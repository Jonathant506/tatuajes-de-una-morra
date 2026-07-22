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
    const elementsToReveal = document.querySelectorAll('.about-text, .about-image-wrapper, .section-header, .portfolio-item, .testimonial-card, .faq .section-title, .accordion-item, .cta-final h2, .cta-final p');
    
    elementsToReveal.forEach((el, index) => {
        el.classList.add('reveal-on-scroll');
        // Add slightly different transition delays for grid items
        if (el.classList.contains('portfolio-item') || el.classList.contains('testimonial-card') || el.classList.contains('accordion-item')) {
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
});
