document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');

    // Mobile nav: toggle menu and close on outside click / escape / link click
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    function closeNav() {
        document.body.classList.remove('nav-open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');
        }
    }
    function openNav() {
        document.body.classList.add('nav-open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'true');
            navToggle.setAttribute('aria-label', 'Close menu');
        }
    }
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            if (document.body.classList.contains('nav-open')) closeNav();
            else openNav();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeNav();
        });
        navMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                if (window.matchMedia('(max-width: 768px)').matches) closeNav();
            });
        });
        window.addEventListener('resize', () => {
            if (window.matchMedia('(min-width: 769px)').matches) closeNav();
        });
    }

    // Hero slider: 5 slides, arrows, dots, autoplay
    const heroSection = document.getElementById('home');
    const heroTrack = heroSection && heroSection.querySelector('.hero-slider-track');
    const slides = heroSection ? heroSection.querySelectorAll('.hero-slide') : [];
    const totalSlides = slides.length;
    const dotsContainer = heroSection && heroSection.querySelector('.hero-slider-dots');
    const prevBtn = heroSection && heroSection.querySelector('.hero-slider-prev');
    const nextBtn = heroSection && heroSection.querySelector('.hero-slider-next');

    if (heroSection && totalSlides > 0) {
        let currentSlide = 0;
        let autoplayTimer = null;
        const AUTOPLAY_MS = 5500;

        function goToSlide(index) {
            currentSlide = (index + totalSlides) % totalSlides;
            heroSection.setAttribute('data-slide', currentSlide);
            if (dotsContainer) {
                dotsContainer.querySelectorAll('.hero-slider-dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentSlide);
                });
            }
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
            resetAutoplay();
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
            resetAutoplay();
        }

        function resetAutoplay() {
            if (autoplayTimer) clearInterval(autoplayTimer);
            autoplayTimer = setInterval(nextSlide, AUTOPLAY_MS);
        }

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'hero-slider-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoplay();
            });
            if (dotsContainer) dotsContainer.appendChild(dot);
        }

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        heroSection.setAttribute('data-slide', '0');
        autoplayTimer = setInterval(nextSlide, AUTOPLAY_MS);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // About section: count-up stats when in view (IntersectionObserver)
    // Works on both homepage (#about) and about page (.about-why-section)
    const aboutSection = document.getElementById('about') || document.querySelector('.about-why-section');
    const statValues = aboutSection ? aboutSection.querySelectorAll('.about-stat-value[data-target]') : [];

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function animateValue(el, target, suffix, durationMs) {
        const start = performance.now();
        const startVal = 0;
        suffix = suffix || '';

        function step(now) {
            const elapsed = now - start;
            const t = Math.min(elapsed / durationMs, 1);
            const eased = easeOutQuart(t);
            let current = startVal + (target - startVal) * eased;
            if (target % 1 !== 0) {
                current = Math.round(current * 10) / 10;
            } else {
                current = Math.floor(current);
            }
            el.textContent = current + suffix;
            if (t < 1) requestAnimationFrame(step);
            else {
                const final = target % 1 !== 0 ? target : Math.round(target);
                el.textContent = final + suffix;
            }
        }
        requestAnimationFrame(step);
    }

    let aboutAnimated = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting || aboutAnimated) return;
            aboutAnimated = true;
            statValues.forEach((el) => {
                const target = parseFloat(el.getAttribute('data-target'), 10);
                const suffix = el.getAttribute('data-suffix') || '';
                animateValue(el, target, suffix, 2000);
            });
        });
    }, { threshold: 0.2, rootMargin: '0px' });

    if (aboutSection) observer.observe(aboutSection);

    // About page: Interactive Timeline — scroll reveal for .timeline-item
    const timelineItems = document.querySelectorAll('#about-timeline .timeline-item');
    if (timelineItems.length) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });
        timelineItems.forEach((el) => timelineObserver.observe(el));
    }

    // About page: Global Infrastructure — update #hub-details on map node hover/click
    const mapNodes = document.querySelectorAll('.map-node');
    const detailsContainer = document.getElementById('hub-details');
    const hubData = {
        accra: '<strong>Tema Port & Kotoka Air Hub:</strong> Primary Dispatch Center handling over 60% of regional outbound multi-modal freight.',
        regional: '<strong>ECOWAS Road Network:</strong> Cross-border heavy haulage ensuring seamless transit through West African corridors.',
        global: '<strong>International Maritime Routes:</strong> Connecting Tabloid Haulage to Europe, Asia, and the Americas via high-capacity sea freight.'
    };
    const defaultHubText = 'Hover over a node on the map to view regional capabilities.';

    function setHubContent(html) {
        if (!detailsContainer) return;
        detailsContainer.style.opacity = 0;
        setTimeout(() => {
            detailsContainer.innerHTML = html;
            detailsContainer.style.opacity = 1;
        }, 200);
    }

    if (detailsContainer && mapNodes.length) {
        mapNodes.forEach((node) => {
            node.addEventListener('mouseenter', () => {
                const target = node.getAttribute('data-target');
                if (hubData[target]) setHubContent(hubData[target]);
            });
            node.addEventListener('mouseleave', () => {
                setHubContent(defaultHubText);
            });
            node.addEventListener('click', () => {
                const target = node.getAttribute('data-target');
                if (hubData[target]) setHubContent(hubData[target]);
            });
            node.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const target = node.getAttribute('data-target');
                    if (hubData[target]) setHubContent(hubData[target]);
                }
            });
        });
    }

    // Services page: Smooth scroll on TOC click + Scroll Spy (#road, #sea, #air, #warehousing, #customs)
    const sections = document.querySelectorAll('#road, #sea, #air, #warehousing, #customs');
    const navLinks = document.querySelectorAll('.toc-link');

    // --- 1. SMOOTH SCROLL ON CLICK ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- 2. SCROLL SPY (Lights up dot based on scroll position) ---
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));

                const activeId = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.toc-link[data-section="${activeId}"]`);

                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Warehousing: add .in-view when section enters viewport (triggers progress bar CSS animation)
    const warehousingSection = document.getElementById('warehousing');
    if (warehousingSection) {
        const warehousingObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px' }
        );
        warehousingObserver.observe(warehousingSection);
    }

    // Security Hub: typewriter effect when section enters viewport
    const securityHub = document.getElementById('security-hub');
    const typewriterEl = document.getElementById('typewriter-text');
    const typewriterLines = [
        '> Initiating secure uplink...',
        '> GPS coordinates verified...',
        '> Cargo bay temperature: 18°C [STABLE]',
        '> Route clearance granted.'
    ];

    function runTypewriter() {
        if (!typewriterEl) return;
        let lineIndex = 0;
        let charIndex = 0;
        const charDelay = 45;
        const lineDelay = 600;

        function typeNext() {
            if (lineIndex >= typewriterLines.length) return;
            const line = typewriterLines[lineIndex];
            if (charIndex <= line.length) {
                typewriterEl.textContent = typewriterLines.slice(0, lineIndex).join('\n') + (lineIndex ? '\n' : '') + line.slice(0, charIndex);
                charIndex++;
                setTimeout(typeNext, charDelay);
            } else {
                lineIndex++;
                charIndex = 0;
                typewriterEl.textContent = typewriterLines.slice(0, lineIndex).join('\n');
                if (lineIndex < typewriterLines.length) {
                    setTimeout(typeNext, lineDelay);
                }
            }
        }
        typeNext();
    }

    let securityHubTyped = false;
    const securityObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting || securityHubTyped) return;
            securityHubTyped = true;
            runTypewriter();
        });
    }, { threshold: 0.2, rootMargin: '0px' });

    if (securityHub) securityObserver.observe(securityHub);

    // Contact page: Smart FAQ accordion (toggle .active, animate max-height, rotate + icon)
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item && item.querySelector('.faq-answer');
            const isOpen = item && item.classList.contains('active');

            if (!item || !answer) return;

            if (isOpen) {
                item.classList.remove('active');
                answer.style.maxHeight = '0px';
                btn.setAttribute('aria-expanded', 'false');
                answer.setAttribute('hidden', '');
            } else {
                item.classList.add('active');
                answer.removeAttribute('hidden');
                btn.setAttribute('aria-expanded', 'true');
                // Expand briefly to read height (hidden + max-height:0 can make scrollHeight 0 in some browsers)
                answer.style.maxHeight = '2000px';
                const height = answer.scrollHeight;
                answer.style.maxHeight = '0px';
                requestAnimationFrame(() => {
                    answer.style.maxHeight = height + 'px';
                });
            }
        });
    });

    // Form submit: prevent navigation to "#", show success message (no backend yet)
    function showFormSuccess(form, message) {
        let notice = form.querySelector('.form-success-msg');
        if (!notice) {
            notice = document.createElement('p');
            notice.className = 'form-success-msg';
            notice.setAttribute('role', 'status');
            notice.setAttribute('aria-live', 'polite');
            form.appendChild(notice);
        }
        notice.textContent = message;
        notice.style.display = 'block';
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showFormSuccess(this, 'Thank you. We will contact you shortly.');
        });
    }

    const portalForm = document.querySelector('.contact-portal-form');
    if (portalForm) {
        portalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showFormSuccess(this, 'Request received. Our team will respond within 24 hours.');
        });
    }

    // Footer placeholder links (Privacy, Terms): prevent jump to top, show coming-soon feedback
    document.querySelectorAll('footer a[href="#"]').forEach((link) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const text = this.textContent.trim();
            if (window.__footerPlaceholderMsg) clearTimeout(window.__footerPlaceholderMsg);
            const toast = document.createElement('div');
            toast.className = 'footer-placeholder-toast';
            toast.setAttribute('role', 'status');
            toast.textContent = text + ' — coming soon.';
            document.body.appendChild(toast);
            window.__footerPlaceholderMsg = setTimeout(() => {
                toast.remove();
            }, 2500);
        });
    });
});
