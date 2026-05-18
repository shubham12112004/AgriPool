import './bootstrap';

// Scroll Reveal Animations
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Check if it's a counter
                if (entry.target.classList.contains('count-up-element') && !entry.target.classList.contains('counted')) {
                    startCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up-element');
    fadeElements.forEach(el => observer.observe(el));

    // Counter Animation Logic
    function startCounter(element) {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // ms
        const stepTime = Math.abs(Math.floor(duration / target));
        let current = 0;
        
        // Fast counting for large numbers
        const step = target > 100 ? Math.ceil(target / 100) : 1;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.innerText = target.toLocaleString() + (element.getAttribute('data-suffix') || '');
                clearInterval(timer);
            } else {
                element.innerText = current.toLocaleString() + (element.getAttribute('data-suffix') || '');
            }
        }, stepTime || 20); // fallback to 20ms if stepTime is 0
    }
});
