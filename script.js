document.addEventListener("DOMContentLoaded", function () {
    // Intersection Observer for scroll fade-in animations
    const sections = document.querySelectorAll('.fade-in-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Unobserve after fading in if you only want it once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Handle gentle scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// --- Inline Article Logic ---
function toggleArticle(articleId) {
    const card = document.getElementById(articleId);

    // If already open, close it
    if (card.classList.contains('open')) {
        card.classList.remove('open');
        return;
    }

    // Close other open articles for a cleaner experience
    document.querySelectorAll('.article-card.open').forEach(openCard => {
        if (openCard.id !== articleId) {
            openCard.classList.remove('open');
        }
    });

    // Open this one
    card.classList.add('open');

    // Scroll slightly to the content after it opens for better UX
    setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// --- Gallery Carousel Logic ---
document.addEventListener("DOMContentLoaded", function () {
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach((container) => {
        const carousel = container.querySelector('.carousel');
        const dotsContainer = container.querySelector('.carousel-dots');
        const items = carousel.querySelectorAll('.carousel-item');

        // Generate dots
        items.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                carousel.scrollTo({
                    left: items[i].offsetLeft - carousel.offsetLeft,
                    behavior: 'smooth'
                });
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        // Update dots on scroll
        carousel.addEventListener('scroll', () => {
            let maxVisibleIndex = 0;
            let maxVisibleArea = 0;

            items.forEach((item, i) => {
                const itemLeft = item.offsetLeft - carousel.offsetLeft;
                const itemRight = itemLeft + item.offsetWidth;
                const viewLeft = carousel.scrollLeft;
                const viewRight = viewLeft + carousel.clientWidth;

                const visibleLeft = Math.max(itemLeft, viewLeft);
                const visibleRight = Math.min(itemRight, viewRight);
                const visibleArea = Math.max(0, visibleRight - visibleLeft);

                if (visibleArea > maxVisibleArea) {
                    maxVisibleArea = visibleArea;
                    maxVisibleIndex = i;
                }
            });

            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[maxVisibleIndex]) {
                dots[maxVisibleIndex].classList.add('active');
            }
        });

        // Dragging Logic
        let isDown = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.classList.add('dragging');
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.classList.remove('dragging');
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.classList.remove('dragging');
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            carousel.scrollLeft = scrollLeft - walk;
        });
    });
});
