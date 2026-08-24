// Hero slider
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

// Programme carousel
function scrollProgramme(direction) {
    const grid = document.querySelector('#programme-details .courses-grid');
    const card = grid?.querySelector('.course-card');
    if (!grid || !card) return;

    const gap = parseFloat(getComputedStyle(grid).gap) || 15;
    grid.scrollBy({
        left: direction * (card.offsetWidth + gap),
        behavior: 'smooth'
    });
}

// Campus gallery
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

// Testimonial slider
let currentTestimonialIndex = 0;
let testimonialAutoSlideTimer;

function moveTestimonial(direction, manual = false) {
    const grid = document.getElementById('testimonialGrid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.test-card');
    const isMobile = window.innerWidth <= 768;
    const visibleCards = isMobile ? 1 : 3;
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

// Admission modal
function initAdmissionModal() {
    const modal = document.getElementById('admissionModal');
    if (!modal) return;

    const openButtons = document.querySelectorAll('[data-open-admission-modal]');
    const closeButtons = modal.querySelectorAll('[data-close-admission-modal]');
    const form = modal.querySelector('.admission-modal-form');
    const success = modal.querySelector('.admission-success');
    let lastFocusedElement = null;

    function closeModal() {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
        if (lastFocusedElement) lastFocusedElement.focus();
    }

    openButtons.forEach((button) => {
        button.addEventListener('click', () => {
            lastFocusedElement = button;
            form.hidden = false;
            success.hidden = true;
            form.reset();
            modal.hidden = false;
            document.body.classList.add('modal-open');
            modal.querySelector('input')?.focus();
        });
    });

    closeButtons.forEach((button) => button.addEventListener('click', closeModal));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.hidden) closeModal();
    });

    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        form.hidden = true;
        success.hidden = false;
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmissionModal);
} else {
    initAdmissionModal();
}

