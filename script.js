document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal Elements on Scroll
    // Use IntersectionObserver to add a 'visible' class when elements enter the viewport
    
    // Add a base style dynamically for elements we want to animate
    const style = document.createElement('style');
    style.innerHTML = `
        .reveal-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .reveal-on-scroll.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Select elements to animate
    const elementsToReveal = document.querySelectorAll('.about-text, .about-image-wrapper, .section-header, .portfolio-gallery, .testimonial-card, .faq .section-title, .accordion-item, .cta-final h2, .cta-final p, .process-card');
    
    elementsToReveal.forEach((el, index) => {
        el.classList.add('reveal-on-scroll');
        // Add slightly different transition delays for grid items (testimonial cards, accordion items, process cards)
        if (el.classList.contains('testimonial-card') || el.classList.contains('accordion-item') || el.classList.contains('process-card')) {
            el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    elementsToReveal.forEach(el => observer.observe(el));

    // 2 & 4. Parallax effect for hero background and illustrations on scroll
    const hero = document.querySelector('.hero');
    const decorations = document.querySelectorAll('.decoration');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        
        // Hero parallax
        if (scrollPosition <= window.innerHeight && hero) {
            hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        }
        
        // Decorations parallax
        decorations.forEach((dec) => {
            const parent = dec.parentElement;
            if (!parent) return;
            
            const rect = parent.getBoundingClientRect();
            // Check if section is visible
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Move based on distance from center of viewport
                const distanceCenter = rect.top - (window.innerHeight / 2);
                
                // Base rotation so we don't lose the CSS rotation
                let rotate = 0;
                let speed = 0.1;
                
                if (dec.classList.contains('decoration-1')) { rotate = 15; speed = 0.15; }
                if (dec.classList.contains('decoration-2')) { rotate = -10; speed = -0.1; }
                if (dec.classList.contains('decoration-3')) { rotate = 0; speed = 0.12; }
                if (dec.classList.contains('decoration-4')) { rotate = 20; speed = 0.18; }
                if (dec.classList.contains('decoration-5')) { rotate = -15; speed = -0.14; }
                if (dec.classList.contains('decoration-6')) { rotate = 20; speed = 0.14; }
                
                const yPos = distanceCenter * speed;
                dec.style.transform = `translateY(${yPos}px) rotate(${rotate}deg)`;
            }
        });
    });

    // 3. FAQ Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Toggle active class on header
            header.classList.toggle('active');
            
            // Get the corresponding content
            const content = header.nextElementSibling;
            
            if (header.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });
    // 4. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon from bars to xmark
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        const navLinkElements = document.querySelectorAll('.nav-links a');
        navLinkElements.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // 5. Policy Modal Logic
    const policyModal = document.getElementById('policy-modal');
    const closeModalBtn = document.getElementById('close-policy-modal');
    const policyTriggers = document.querySelectorAll('.trigger-policy-modal');

    function openPolicyModal() {
        if (!policyModal) return;
        policyModal.classList.add('active');
        policyModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closePolicyModal() {
        if (!policyModal) return;
        policyModal.classList.remove('active');
        policyModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    policyTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openPolicyModal();
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closePolicyModal);
    }

    if (policyModal) {
        policyModal.addEventListener('click', (e) => {
            if (e.target === policyModal) {
                closePolicyModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && policyModal && policyModal.classList.contains('active')) {
            closePolicyModal();
        }
    });
});
    // Review modal logic
    const openReviewBtn = document.getElementById('open-review-modal');
    const closeReviewBtn = document.getElementById('close-review-modal');
    const reviewModal = document.getElementById('review-modal');
    const reviewForm = document.getElementById('review-form');
    const reviewSuccess = document.getElementById('review-success');
    const starContainer = document.querySelector('.star-rating');

    function openReviewModal() {
        if (!reviewModal) return;
        reviewModal.classList.add('active');
        reviewModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function closeReviewModal() {
        if (!reviewModal) return;
        reviewModal.classList.remove('active');
        reviewModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (reviewForm) reviewForm.reset();
        setRating(0);
        if (reviewSuccess) reviewSuccess.classList.add('hidden');
    }
    if (openReviewBtn) openReviewBtn.addEventListener('click', openReviewModal);
    if (closeReviewBtn) closeReviewBtn.addEventListener('click', closeReviewModal);
    if (reviewModal) {
        reviewModal.addEventListener('click', (e) => {
            if (e.target === reviewModal) closeReviewModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && reviewModal?.classList.contains('active')) {
            closeReviewModal();
        }
    });

    // Star rating handling
    function setRating(value) {
        if (!starContainer) return;
        starContainer.dataset.rating = value;
        const stars = starContainer.querySelectorAll('.star');
        stars.forEach(star => {
            const val = parseInt(star.dataset.value);
            star.textContent = val <= value ? '★' : '☆';
        });
    }
    if (starContainer) {
        starContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('star')) {
                const val = parseInt(e.target.dataset.value);
                setRating(val);
            }
        });
    }

    // Form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = reviewForm.name.value.trim();
            const city = reviewForm.city.value.trim();
            const rating = parseInt(starContainer?.dataset.rating || '0');
            const comment = reviewForm.comment.value.trim();
            if (!name || !rating || !comment) {
                alert('Por favor completa los campos obligatorios.');
                return;
            }
            const payload = { name, city, rating, comment };
            try {
                const resp = await fetch('/api/submit-review', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (resp.ok) {
                    if (reviewSuccess) reviewSuccess.classList.remove('hidden');
                    reviewForm.reset();
                    setRating(0);
                } else {
                    alert('Error al enviar la reseña.');
                }
            } catch (err) {
                console.error(err);
                alert('Error de red al enviar la reseña.');
            }
        });
    }
