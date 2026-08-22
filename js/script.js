let currentHeroSlide = 1;
const totalHeroSlides = 3;

function nextHeroSlide() {
    const slides = document.querySelectorAll('.hero-slider-bg');
    slides.forEach((slide) => {
        slide.classList.add('manual-override');
        slide.classList.remove('active');
    });

    currentHeroSlide += 1;
    if (currentHeroSlide > totalHeroSlides) {
        currentHeroSlide = 1;
    }

    const activeSlide = document.querySelector('.hero-slider-bg.slide-' + currentHeroSlide);
    if (activeSlide) {
        activeSlide.classList.add('active');
    }
}

function scrollNext(btn) {
    const wrapper = btn.parentElement;
    const grid = wrapper.querySelector('div[class$="-grid"]');
    if (grid) {
        grid.scrollBy({ left: 250, behavior: 'smooth' });
    }
}

let currentGallerySlide = 0;

function updateGallerySlides() {
    const slides = document.querySelectorAll('.gallery-slide');
    slides.forEach((slide, index) => {
        if (index === currentGallerySlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

function nextGallerySlide() {
    const slides = document.querySelectorAll('.gallery-slide');
    currentGallerySlide = (currentGallerySlide + 1) % slides.length;
    updateGallerySlides();
}

function prevGallerySlide() {
    const slides = document.querySelectorAll('.gallery-slide');
    currentGallerySlide = (currentGallerySlide - 1 + slides.length) % slides.length;
    updateGallerySlides();
}

(function () {
    const SPEED = 0.4;
    const RESUME_DELAY = 1000;

    function setupMarquee(grid) {
        const cards = Array.from(grid.children);
        if (cards.length === 0) return;

        cards.forEach((card) => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            grid.appendChild(clone);
        });

        let isPaused = false;
        let resumeTimer = null;
        let gap = parseFloat(getComputedStyle(grid).gap) || 15;
        let currentScrollFloat = grid.scrollLeft;

        function calcOriginalWidth() {
            let width = 0;
            for (let i = 0; i < cards.length; i++) {
                width += cards[i].offsetWidth + gap;
            }
            return width;
        }

        let originalWidth = calcOriginalWidth();

        window.addEventListener('resize', () => {
            gap = parseFloat(getComputedStyle(grid).gap) || 15;
            originalWidth = calcOriginalWidth();
        });

        function tick() {
            if (!isPaused) {
                currentScrollFloat += SPEED;
                if (currentScrollFloat >= originalWidth) {
                    currentScrollFloat -= originalWidth;
                }
                grid.scrollLeft = currentScrollFloat;
            }
            requestAnimationFrame(tick);
        }

        function pause() {
            isPaused = true;
            if (resumeTimer) {
                clearTimeout(resumeTimer);
                resumeTimer = null;
            }
        }

        function scheduleResume() {
            if (resumeTimer) clearTimeout(resumeTimer);
            resumeTimer = setTimeout(() => {
                currentScrollFloat = grid.scrollLeft;
                isPaused = false;
            }, RESUME_DELAY);
        }

        grid.addEventListener('mouseenter', pause);
        grid.addEventListener('mouseleave', scheduleResume);
        grid.addEventListener('touchstart', pause, { passive: true });
        grid.addEventListener('touchend', scheduleResume, { passive: true });
        grid.addEventListener('touchcancel', scheduleResume, { passive: true });

        grid.addEventListener('wheel', (event) => {
            const hasHorizontal = Math.abs(event.deltaX) > 0;
            const shiftWheel = event.shiftKey && Math.abs(event.deltaY) > 0;
            if (!hasHorizontal && !shiftWheel) return;

            pause();
            const delta = hasHorizontal ? event.deltaX : event.deltaY;
            grid.scrollLeft += delta;
            if (grid.scrollLeft >= originalWidth) grid.scrollLeft -= originalWidth;
            if (grid.scrollLeft < 0) grid.scrollLeft += originalWidth;
            event.preventDefault();
            scheduleResume();
        }, { passive: false });

        let isDragging = false;
        let dragStartX = 0;
        let scrollStart = 0;

        grid.addEventListener('mousedown', (event) => {
            isDragging = true;
            dragStartX = event.pageX;
            scrollStart = grid.scrollLeft;
            grid.classList.add('is-dragging');
            pause();
            event.preventDefault();
        });

        document.addEventListener('mousemove', (event) => {
            if (!isDragging) return;
            const dx = event.pageX - dragStartX;
            grid.scrollLeft = scrollStart - dx;
            if (grid.scrollLeft >= originalWidth) grid.scrollLeft -= originalWidth;
            if (grid.scrollLeft < 0) grid.scrollLeft += originalWidth;
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            grid.classList.remove('is-dragging');
            scheduleResume();
        });

        grid.setAttribute('tabindex', '0');
        grid.addEventListener('focus', pause);
        grid.addEventListener('blur', scheduleResume);
        grid.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                pause();
                grid.scrollLeft += event.key === 'ArrowRight' ? 80 : -80;
                if (grid.scrollLeft >= originalWidth) grid.scrollLeft -= originalWidth;
                if (grid.scrollLeft < 0) grid.scrollLeft += originalWidth;
                scheduleResume();
                event.preventDefault();
            }
        });

        grid.addEventListener('dragstart', (event) => event.preventDefault());
        requestAnimationFrame(tick);
    }

    function initMarquees() {
        const grids = document.querySelectorAll('.marquee-container > div');
        grids.forEach(setupMarquee);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMarquees);
    } else {
        initMarquees();
    }
})();

let currentTestimonialIndex = 0;
let testimonialAutoSlideTimer;

function moveTestimonial(direction, manual = false) {
    const grid = document.getElementById('testimonialGrid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.test-card');
    const isMobile = window.innerWidth <= 768;
    const visibleCards = isMobile ? 1 : 2;
    const maxIndex = cards.length - visibleCards;

    if (manual && testimonialAutoSlideTimer) {
        clearInterval(testimonialAutoSlideTimer);
        startTestimonialAutoSlide();
    }

    currentTestimonialIndex += direction;

    if (currentTestimonialIndex < 0) {
        currentTestimonialIndex = maxIndex;
    } else if (currentTestimonialIndex > maxIndex) {
        currentTestimonialIndex = 0;
    }

    const cardWidth = cards[0].offsetWidth;
    const gap = 40;
    const offset = currentTestimonialIndex * (cardWidth + gap);
    grid.style.transform = `translateX(-${offset}px)`;

    const progress = document.getElementById('testimonialProgress');
    if (progress) {
        progress.textContent = `${String(currentTestimonialIndex + 1).padStart(2, '0')} / ${String(maxIndex + 1).padStart(2, '0')}`;
    }
}

function startTestimonialAutoSlide() {
    moveTestimonial(0);
    testimonialAutoSlideTimer = setInterval(() => {
        moveTestimonial(1);
    }, 3000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startTestimonialAutoSlide);
} else {
    startTestimonialAutoSlide();
}

window.addEventListener('resize', () => {
    currentTestimonialIndex = 0;
    const grid = document.getElementById('testimonialGrid');
    if (grid) grid.style.transform = 'translateX(0px)';
});

let recruiterLogoIndex = 0;

function moveRecruiterLogos(direction) {
    const track = document.getElementById('recruiterLogosTrack');
    if (!track) return;

    const items = track.querySelectorAll('.recruiter-logo-item');
    const overflow = track.parentElement;
    const overflowWidth = overflow.offsetWidth;

    let totalWidth = 0;
    const itemWidths = [];
    items.forEach((item, index) => {
        const style = getComputedStyle(track);
        const gap = parseFloat(style.gap) || 30;
        itemWidths.push(item.offsetWidth + (index < items.length - 1 ? gap : 0));
        totalWidth += itemWidths[index];
    });

    const maxScroll = Math.max(0, totalWidth - overflowWidth);
    const scrollStep = overflowWidth * 0.6;

    recruiterLogoIndex += direction * scrollStep;

    if (recruiterLogoIndex < 0) recruiterLogoIndex = 0;
    if (recruiterLogoIndex > maxScroll) recruiterLogoIndex = 0;

    track.style.transform = `translateX(-${recruiterLogoIndex}px)`;
}
