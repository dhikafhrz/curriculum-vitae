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

            rows.forEach(row => {
                if (!row.trim()) return;
                const [category, title, subtitle, date, desc] = row.split(';');

                if (category === 'professional') {
                    // Buat elemen pekerjaan
                    const jobDiv = document.createElement('div');
                    jobDiv.className = 'job';

                    // Pecah deskripsi berdasarkan tanda koma/titik koma jika ada list
                    const listItems = desc.split('>').map(item => `<li>${item.trim()}</li>`).join('');

                    jobDiv.innerHTML = `
                        <h3>${title} | ${subtitle}</h3>
                        <p><em>${date}</em></p>
                        <ul>${listItems}</ul>
                    `;
                    profContainer.appendChild(jobDiv);

                } else if (category === 'education') {
                    // Buat elemen edukasi
                    const eduCard = document.createElement('div');
                    eduCard.className = 'education-card animate-on-scroll';
                    eduCard.innerHTML = `
                        <h3>${title}</h3>
                        <p>${subtitle} (${date})</p>
                        <p>${desc || ''}</p>
                    `;
                    eduContainer.appendChild(eduCard);
                }

                else if (category === 'skill') {
                    const skillCard = document.createElement('div');
                    skillCard.className = 'skill-category animate-on-scroll';
                    
                    // Mengubah deskripsi (yang dipisah koma) menjadi badge/label
                    const skillBadges = desc.split(',').map(s => `<span class="skill-badge">${s.trim()}</span>`).join('');
                    
                    skillCard.innerHTML = `
                        <h3>${title}</h3>
                        <div class="skill-list">${skillBadges}</div>
                    `;
                    skillContainer.appendChild(skillCard);

                } else if (category === 'license') {
                    const certCard = document.createElement('div');
                    certCard.className = 'education-card animate-on-scroll'; // Menggunakan style yang sudah ada
                    certCard.innerHTML = `
                        <h3>${title}</h3>
                        <p><strong>${subtitle}</strong> | ${date}</p>
                        <p>${desc}</p>
                    `;
                    licenseContainer.appendChild(certCard);
                }
            });

            // Jalankan ulang observer agar elemen baru teranimasi
            refreshObserver();
        });

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