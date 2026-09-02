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
    const gap = parseFloat(window.getComputedStyle(grid).gap) || 40;
    const offset = currentTestimonialIndex * (cardWidth + gap);
    grid.style.transform = `translateX(-${offset}px)`;

    const progress = document.getElementById('testimonialProgress');
    if (progress) {
        // progress.textContent = `${String(currentTestimonialIndex + 1).padStart(2, '0')} / ${String(maxIndex + 1).padStart(2, '0')}`;
    }
}

function startTestimonialAutoSlide() {
    // no auto-scroll
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startTestimonialAutoSlide);
} else {
    startTestimonialAutoSlide();
}



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

function moveIndustrySlider(direction) {
    const track = document.getElementById('industrySliderTrack');
    if (!track) return;
    
    const cards = track.querySelectorAll('.industry-logo-box');
    if (cards.length === 0) return;

    const isMobile = window.innerWidth <= 768;
    const visibleCards = isMobile ? 1 : 4;
    const maxIndex = cards.length - visibleCards;
    
    if (maxIndex <= 0) return;

    if (direction !== undefined) {
        currentIndustryIndex += direction;
    } else {
        currentIndustryIndex++;
    }
    if (currentIndustryIndex > maxIndex) {
        currentIndustryIndex = 0;
    }
    if (currentIndustryIndex < 0) {
        currentIndustryIndex = maxIndex;
    }
    
    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 40;
    const offset = currentIndustryIndex * (cardWidth + gap);
    
    track.style.transform = `translateX(-${offset}px)`;
}

function startIndustryAutoSlide() {
    if (window.innerWidth <= 768) return; // mobile uses swipe
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
        track.style.transform = `translateX(0px)`;
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
        track.style.transform = `translateX(0px)`;
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
    currentTestimonialIndex = 0;
    const grid = document.getElementById('testimonialGrid');
    if (grid) grid.style.transform = 'translateX(0px)';
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
    // no auto-scroll
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAffiliationAutoSlide);
} else {
    startAffiliationAutoSlide();
}

// ===== Mobile Slider: Approvals & Recognitions =====
let currentApprovalIndex = 0;

function moveApprovalSlider(direction) {
    if (window.innerWidth > 768) return;

    const track = document.getElementById('approvalSliderTrack');
    if (!track) return;

    const cards = track.querySelectorAll('.approval-image-box');
    if (cards.length === 0) return;

    const totalCards = cards.length;
    currentApprovalIndex += direction;

    if (currentApprovalIndex < 0) {
        currentApprovalIndex = totalCards - 1;
    } else if (currentApprovalIndex >= totalCards) {
        currentApprovalIndex = 0;
    }

    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 15;
    const offset = currentApprovalIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    const progress = document.getElementById('approvalProgress');
    if (progress) {
        progress.textContent = `${String(currentApprovalIndex + 1).padStart(2, '0')} / ${String(totalCards).padStart(2, '0')}`;
    }
}



// Auto-open admission modal when scrolling to Placements, Testimonial, or Microsoft Center of Excellence
function initScrollAdmissionTrigger() {
    const modal = document.getElementById('admissionModal');
    if (!modal) return;

    const target = document.querySelector('.top-recruiters');
    if (!target) return;

    let modalAutoOpened = false;

    const observer = new IntersectionObserver((entries) => {
        if (modalAutoOpened) return;
        entries.forEach((entry) => {
            if (entry.isIntersecting && !modalAutoOpened) {
                modalAutoOpened = true;
                observer.disconnect();
                if (typeof window._admissionModalAutoOpen === 'function') {
                    window._admissionModalAutoOpen();
                }
            }
        });
    }, { threshold: 0.3 });

    observer.observe(target);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAdmissionTrigger);
} else {
    initScrollAdmissionTrigger();
}

// ===== Scroll Reveal: sections appear on scroll =====
function initScrollReveal() {
    const revealTargets = document.querySelectorAll(
        '.section:not(.industry-learning), .placement-highlights, .coe-banner, .footer-lead'
    );

    revealTargets.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealTargets.forEach((el) => observer.observe(el));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
} else {
    initScrollReveal();
}

// ===== Touch Swipe for all mobile sliders =====
function initSwipeSupport() {
    if (window.innerWidth > 768) return;

    const sliders = [
        { trackId: 'studentSliderTrack', moveFn: moveStudentSlider },
        { trackId: 'courseSliderTrack', moveFn: moveCourseSlider },
        { trackId: 'approvalSliderTrack', moveFn: moveApprovalSlider },
        { trackId: 'testimonialGrid', moveFn: (dir) => moveTestimonial(dir, true) },
        { trackId: 'industrySliderTrack', moveFn: moveIndustrySlider },
    ];

    sliders.forEach(({ trackId, moveFn }) => {
        const track = document.getElementById(trackId);
        if (!track) return;

        let startX = 0;
        let startY = 0;
        let swiping = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            swiping = true;
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!swiping) return;
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            // If horizontal swipe is dominant, prevent vertical scroll
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
                e.preventDefault();
            }
        }, { passive: false });

        track.addEventListener('touchend', (e) => {
            if (!swiping) return;
            swiping = false;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                moveFn(diff > 0 ? 1 : -1);
            }
        }, { passive: true });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwipeSupport);
} else {
    initSwipeSupport();
}
