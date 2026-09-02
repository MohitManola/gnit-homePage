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

// Programme carousel (desktop scroll fallback)
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
        // progress.textContent = `${String(currentTestimonialIndex + 1).padStart(2, '0')} / ${String(maxIndex + 1).padStart(2, '0')}`;
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
window._modalCooldown = false; // shared cooldown flag for scroll triggers

function initAdmissionModal() {
    const modal = document.getElementById('admissionModal');
    if (!modal) return;

    const openButtons = document.querySelectorAll('[data-open-admission-modal]');
    const closeButtons = modal.querySelectorAll('[data-close-admission-modal]');
    const form = modal.querySelector('.admission-modal-form');
    const success = modal.querySelector('.admission-success');
    let lastFocusedElement = null;
    let isAutoOpened = false;

    function closeModal() {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
        // Only restore focus if manually opened (prevents scroll jump on auto-open)
        if (!isAutoOpened && lastFocusedElement) lastFocusedElement.focus();
        isAutoOpened = false;
        // Set cooldown to prevent scroll triggers from immediately reopening
        window._modalCooldown = true;
        setTimeout(() => { window._modalCooldown = false; }, 1500);
    }

    // Expose for auto-open use
    window._admissionModalAutoOpen = function () {
        if (!modal.hidden || window._modalCooldown) return;
        isAutoOpened = true;
        lastFocusedElement = null;
        if (form) { form.hidden = false; form.reset(); }
        if (success) success.hidden = true;
        modal.hidden = false;
        document.body.classList.add('modal-open');
    };

    openButtons.forEach((button) => {
        button.addEventListener('click', () => {
            isAutoOpened = false;
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

// Industry Slider
let currentIndustryIndex = 0;
let industryAutoSlideTimer;

function moveIndustrySlider() {
    const track = document.getElementById('industrySliderTrack');
    if (!track) return;
    
    const cards = track.querySelectorAll('.industry-logo-box');
    if (cards.length === 0) return;

    const isMobile = window.innerWidth <= 768;
    const visibleCards = isMobile ? 1 : 4;
    const maxIndex = cards.length - visibleCards;
    
    if (maxIndex <= 0) return;

    currentIndustryIndex++;
    if (currentIndustryIndex > maxIndex) {
        currentIndustryIndex = 0;
    }
    
    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 40;
    const offset = currentIndustryIndex * (cardWidth + gap);
    
    track.style.transform = `translateX(-${offset}px)`;
}

function startIndustryAutoSlide() {
    if (document.getElementById('industrySliderTrack')) {
        industryAutoSlideTimer = setInterval(moveIndustrySlider, 2000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startIndustryAutoSlide);
} else {
    startIndustryAutoSlide();
}

// ===== Mobile Slider: Placement Student Details =====
let currentStudentIndex = 0;
let studentAutoSlideTimer;

function moveStudentSlider(direction) {
    if (window.innerWidth > 768) return;

    const track = document.getElementById('studentSliderTrack');
    if (!track) return;

    const cards = track.querySelectorAll('.student-card');
    if (cards.length === 0) return;

    const totalCards = cards.length;

    // If called from button, reset auto-slide
    if (direction !== undefined && studentAutoSlideTimer) {
        clearInterval(studentAutoSlideTimer);
        startStudentAutoSlide();
    }

    if (direction !== undefined) {
        currentStudentIndex += direction;
    }

    if (currentStudentIndex < 0) {
        currentStudentIndex = totalCards - 1;
    } else if (currentStudentIndex >= totalCards) {
        currentStudentIndex = 0;
    }

    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 14;
    const offset = currentStudentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Update progress counter
    const progress = document.getElementById('studentProgress');
    if (progress) {
        progress.textContent = `${String(currentStudentIndex + 1).padStart(2, '0')} / ${String(totalCards).padStart(2, '0')}`;
    }
}

function startStudentAutoSlide() {
    const track = document.getElementById('studentSliderTrack');
    if (!track) return;

    if (studentAutoSlideTimer) clearInterval(studentAutoSlideTimer);
    if (window.innerWidth <= 768) {
        currentStudentIndex = 0;
        moveStudentSlider();
        studentAutoSlideTimer = setInterval(() => {
            currentStudentIndex++;
            moveStudentSlider();
        }, 3000);
    } else {
        track.style.transform = '';
    }
}

// ===== Mobile Slider: Programme Details (Courses Grid) =====
let currentCourseIndex = 0;
let courseAutoSlideTimer;

function moveCourseSlider(direction) {
    if (window.innerWidth > 768) return;

    const track = document.getElementById('courseSliderTrack');
    if (!track) return;

    const cards = track.querySelectorAll('.course-card');
    if (cards.length === 0) return;

    const totalCards = cards.length;

    // If called from button, reset auto-slide
    if (direction !== undefined && courseAutoSlideTimer) {
        clearInterval(courseAutoSlideTimer);
        startCourseAutoSlide();
    }

    if (direction !== undefined) {
        currentCourseIndex += direction;
    }

    if (currentCourseIndex < 0) {
        currentCourseIndex = totalCards - 1;
    } else if (currentCourseIndex >= totalCards) {
        currentCourseIndex = 0;
    }

    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 14;
    const offset = currentCourseIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Update progress counter
    const progress = document.getElementById('courseProgress');
    if (progress) {
        progress.textContent = `${String(currentCourseIndex + 1).padStart(2, '0')} / ${String(totalCards).padStart(2, '0')}`;
    }
}

function startCourseAutoSlide() {
    const track = document.getElementById('courseSliderTrack');
    if (!track) return;

    if (courseAutoSlideTimer) clearInterval(courseAutoSlideTimer);
    if (window.innerWidth <= 768) {
        currentCourseIndex = 0;
        moveCourseSlider();
        courseAutoSlideTimer = setInterval(() => {
            currentCourseIndex++;
            moveCourseSlider();
        }, 3000);
    } else {
        track.style.transform = '';
    }
}

// Init mobile sliders
function initMobileSliders() {
    startStudentAutoSlide();
    startCourseAutoSlide();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileSliders);
} else {
    initMobileSliders();
}

window.addEventListener('resize', () => {
    startStudentAutoSlide();
    startCourseAutoSlide();
});

// Affiliation Slider
let currentAffiliationIndex = 0;
let affiliationAutoSlideTimer;

function moveAffiliationSlider() {
    const track = document.getElementById('affiliationSliderTrack');
    if (!track) return;
    
    const cards = track.querySelectorAll('.industry-logo-box');
    if (cards.length === 0) return;

    const isMobile = window.innerWidth <= 768;
    const visibleCards = isMobile ? 1 : 4;
    const maxIndex = cards.length - visibleCards;
    
    if (maxIndex <= 0) return;

    currentAffiliationIndex++;
    if (currentAffiliationIndex > maxIndex) {
        currentAffiliationIndex = 0;
    }
    
    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 40;
    const offset = currentAffiliationIndex * (cardWidth + gap);
    
    track.style.transform = `translateX(-${offset}px)`;
}

function startAffiliationAutoSlide() {
    if (document.getElementById('affiliationSliderTrack')) {
        affiliationAutoSlideTimer = setInterval(moveAffiliationSlider, 2000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAffiliationAutoSlide);
} else {
    startAffiliationAutoSlide();
}

// Approvals auto-scroll slider on mobile
function initApprovalSlider() {
    const container = document.querySelector('.approvals .approval-images-container');
    if (!container) return;

    let approvalIndex = 0;
    let approvalTimer;

    function autoScrollApprovals() {
        if (window.innerWidth > 768) return;

        const boxes = container.querySelectorAll('.approval-image-box');
        if (boxes.length === 0) return;

        approvalIndex++;
        if (approvalIndex >= boxes.length) {
            approvalIndex = 0;
            container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            boxes[approvalIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }

    function startTimer() {
        if (approvalTimer) clearInterval(approvalTimer);
        approvalTimer = setInterval(autoScrollApprovals, 2000);
    }

    startTimer();

    // Pause on touch, resume after
    container.addEventListener('touchstart', () => { clearInterval(approvalTimer); }, { passive: true });
    container.addEventListener('touchend', () => { startTimer(); }, { passive: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApprovalSlider);
} else {
    initApprovalSlider();
}

// Auto-open admission modal when scrolling to Placements, Testimonial, or Microsoft Center of Excellence
function initScrollAdmissionTrigger() {
    const modal = document.getElementById('admissionModal');
    if (!modal) return;

    // Sections that trigger only once per page load
    const onceSections = [
        document.querySelector('.placements'),
        document.querySelector('.testimonials'),
        document.querySelector('.center-excellence')
    ].filter(Boolean);

    const triggeredOnce = new Set();

    const onceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !triggeredOnce.has(entry.target)) {
                triggeredOnce.add(entry.target);
                if (typeof window._admissionModalAutoOpen === 'function') {
                    window._admissionModalAutoOpen();
                }
            }
        });
    }, { threshold: 0.3 });

    onceSections.forEach((section) => onceObserver.observe(section));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAdmissionTrigger);
} else {
    initScrollAdmissionTrigger();
}
