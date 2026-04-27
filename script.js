document.addEventListener("DOMContentLoaded", function () {

    // --- FUNGSI LOAD CSV ---
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').slice(1); // Lewati header
            const profContainer = document.getElementById('professional-container');
            const eduContainer = document.getElementById('education-container');
            const skillContainer = document.getElementById('skills-container');
            const licenseContainer = document.getElementById('licenses-container');
            const portfolioContainer = document.getElementById('portfolio-container'); // Container baru

            rows.forEach(row => {
                if (!row.trim()) return;
                
                // Ambil semua kolom (termasuk kolom ke-6 jika ada untuk gambar)
                const cols = row.split(';');
                const category = cols[0];
                const title = cols[1];
                const subtitle = cols[2];
                const date = cols[3];
                const desc = cols[4];
                const imagePath = cols[5]; // Kolom tambahan khusus portfolio

                if (category === 'professional') {
                    const jobDiv = document.createElement('div');
                    jobDiv.className = 'job';
                    const listItems = desc.split('>').map(item => `<li>${item.trim()}</li>`).join('');
                    jobDiv.innerHTML = `
                        <h3>${title} | ${subtitle}</h3>
                        <p><em>${date}</em></p>
                        <ul>${listItems}</ul>
                    `;
                    profContainer.appendChild(jobDiv);

                } else if (category === 'education') {
                    const eduCard = document.createElement('div');
                    eduCard.className = 'education-card animate-on-scroll';
                    eduCard.innerHTML = `
                        <h3>${title}</h3>
                        <p>${subtitle} (${date})</p>
                        <p>${desc || ''}</p>
                    `;
                    eduContainer.appendChild(eduCard);

                } else if (category === 'skill') {
                    const skillCard = document.createElement('div');
                    skillCard.className = 'skill-category animate-on-scroll';
                    const skillBadges = desc.split(',').map(s => `<span class="skill-badge">${s.trim()}</span>`).join(' ');
                    skillCard.innerHTML = `
                        <h3>${title}</h3>
                        <div class="skill-list">${skillBadges}</div>
                    `;
                    skillContainer.appendChild(skillCard);

                } else if (category === 'license') {
                    const certLink = cols[5] ? cols[5].trim() : '';
                    const certCard = document.createElement('div');
                    certCard.className = 'education-card animate-on-scroll';
                    certCard.innerHTML = `
                        <h3>${title}</h3>
                        <p><strong>${subtitle}</strong> | ${date}</p>
                        <p>${desc}</p>
                        ${certLink ? `<a href="${certLink}" target="_blank" class="license-btn">View Certificate</a>` : ''}
                    `;
                    licenseContainer.appendChild(certCard);

                } else if (category === 'portfolio') {
                    // Logika khusus Portfolio
                    // subtitle berisi "filterCode|TagName", misal "web|Web Development"
                    const filterData = subtitle ? subtitle.split('|') : ['all', 'Portfolio'];
                    const filterCode = filterData[0].trim();
                    const tagName = filterData[1] ? filterData[1].trim() : filterCode;
                    
                    const linkUrl = date || '#';
                    const imgSrc = imagePath && imagePath.trim() !== '' ? imagePath : 'https://via.placeholder.com/400x250/222/00aaff?text=Portfolio';

                    const portCard = document.createElement('div');
                    portCard.className = 'portfolio-card animate-on-scroll';
                    portCard.setAttribute('data-category', filterCode);

                    portCard.innerHTML = `
                        <div class="portfolio-img">
                            <img src="${imgSrc}" alt="${title}">
                        </div>
                        <div class="portfolio-info">
                            <h3>${title}</h3>
                            <span class="portfolio-tag">${tagName}</span>
                            <p>${desc}</p>
                            <a href="${linkUrl}" class="portfolio-link" target="_blank"><i class="fas fa-external-link-alt"></i> View Project</a>
                        </div>
                    `;
                    portfolioContainer.appendChild(portCard);
                }
            });

            // Jalankan ulang observer agar elemen baru teranimasi
            refreshObserver();
            
            // Aktifkan fungsi klik untuk filter portofolio
            setupPortfolioFilters();
        });

    // --- FUNGSI FILTER PORTFOLIO ---
    function setupPortfolioFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioCards = document.querySelectorAll('.portfolio-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Hapus class active dari semua tombol, lalu tambahkan ke yang diklik
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                portfolioCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // --- ANIMASI SCROLL (Intersection Observer) ---
    function refreshObserver() {
        const observerOptions = { threshold: 0.1 };
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    }


    // Navigasi Aktif saat Scroll
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Perlu offset 50px karena navbar
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

});