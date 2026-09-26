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

    const progress = document.getElementById('galleryProgress');
    if (progress && slides.length > 0) {
        progress.textContent = `${String(currentGallerySlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    }
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateGallerySlides);
} else {
    updateGallerySlides();
}

// Testimonial slider
let currentTestimonialIndex = 0;

function moveTestimonial(direction) {
    // Desktop lays the cards out in full, so there is no loop to advance — and
    // cloning there would leave the grid with duplicate cards.
    if (window.innerWidth > 768) return;

    const grid = document.getElementById('testimonialGrid');
    if (!grid) return;

    if (!grid.dataset.cloned) {
        const cards = Array.from(grid.querySelectorAll('.test-card'));
        grid.dataset.realCount = cards.length;
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone');
            clone.setAttribute('aria-hidden', 'true');
            grid.appendChild(clone);
        });
        grid.dataset.cloned = 'true';
    }

    const realCount = parseInt(grid.dataset.realCount);
    const cards = grid.querySelectorAll('.test-card');
    
    if (realCount === 0) return;

    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(grid).gap) || 40;
    const step = cardWidth + gap;

    if (direction !== undefined) {
        if (currentTestimonialIndex >= realCount && direction === 1) {
            grid.style.transition = 'none';
            grid.style.transform = `translateX(0px)`;
            grid.offsetHeight;
            grid.style.transition = '';
            currentTestimonialIndex = 0;
        }

        currentTestimonialIndex += direction;

        if (currentTestimonialIndex < 0) {
            grid.style.transition = 'none';
            grid.style.transform = `translateX(-${realCount * step}px)`;
            grid.offsetHeight;
            grid.style.transition = '';
            currentTestimonialIndex = realCount - 1;
        }
    }

    const offset = currentTestimonialIndex * step;
    grid.style.transform = `translateX(-${offset}px)`;

    renderTestimonialProgress();
}

function renderTestimonialProgress() {
    const progress = document.getElementById('testimonialProgress');
    const grid = document.getElementById('testimonialGrid');
    if (!progress || !grid) return;

    const realCount = grid.dataset.realCount ? parseInt(grid.dataset.realCount) : grid.querySelectorAll('.test-card').length;
    if (realCount === 0) return;

    let displayIndex = currentTestimonialIndex === realCount ? 0 : currentTestimonialIndex;
    progress.textContent = `${String(displayIndex + 1).padStart(2, '0')} / ${String(realCount).padStart(2, '0')}`;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderTestimonialProgress);
} else {
    renderTestimonialProgress();
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
    const visualViewport = window.visualViewport;
    let lastFocusedElement = null;
    let isAutoOpened = false;

    function syncModalToVisualViewport() {
        if (!visualViewport) return;
        modal.style.setProperty('--modal-viewport-top', `${visualViewport.offsetTop}px`);
        modal.style.setProperty('--modal-viewport-left', `${visualViewport.offsetLeft}px`);
        modal.style.setProperty('--modal-viewport-width', `${visualViewport.width}px`);
        modal.style.setProperty('--modal-viewport-height', `${visualViewport.height}px`);
    }

    syncModalToVisualViewport();
    visualViewport?.addEventListener('resize', syncModalToVisualViewport);
    visualViewport?.addEventListener('scroll', syncModalToVisualViewport);

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
            if (form) {
                form.hidden = false;
                form.reset();
            }
            if (success) {
                success.hidden = true;
            }
            modal.hidden = false;
            document.body.classList.add('modal-open');
            modal.querySelector('input')?.focus();
        });
    });

    closeButtons.forEach((button) => button.addEventListener('click', closeModal));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.hidden) closeModal();
    });

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            form.hidden = true;
            if (success) success.hidden = false;
        });
    }
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
    // Always clear any existing timer so this is safe to call again on resize
    if (industryAutoSlideTimer) {
        clearInterval(industryAutoSlideTimer);
        industryAutoSlideTimer = undefined;
    }

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

function moveStudentSlider(direction) {
    if (window.innerWidth > 768) return;

    const track = document.getElementById('studentSliderTrack');
    if (!track) return;

    if (!track.dataset.cloned) {
        const cards = Array.from(track.querySelectorAll('.student-card'));
        track.dataset.realCount = cards.length;
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone');
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
        track.dataset.cloned = 'true';
    }

    const realCount = parseInt(track.dataset.realCount);
    const cards = track.querySelectorAll('.student-card');
    
    if (realCount === 0) return;

    const cardWidth = cards[0].offsetWidth;
    const cardStyle = window.getComputedStyle(cards[0]);
    const leftMargin = parseFloat(cardStyle.marginLeft) || 0;
    const rightMargin = parseFloat(cardStyle.marginRight) || 0;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 14;
    const step = cardWidth + leftMargin + rightMargin + gap;

    if (direction !== undefined) {
        if (currentStudentIndex >= realCount && direction === 1) {
            track.style.transition = 'none';
            track.style.transform = `translateX(0px)`;
            track.offsetHeight;
            track.style.transition = '';
            currentStudentIndex = 0;
        }

        currentStudentIndex += direction;

        if (currentStudentIndex < 0) {
            track.style.transition = 'none';
            track.style.transform = `translateX(-${realCount * step}px)`;
            track.offsetHeight;
            track.style.transition = '';
            currentStudentIndex = realCount - 1;
        }
    }

    const offset = currentStudentIndex * step;
    track.style.transform = `translateX(-${offset}px)`;

    // Update progress counter
    const progress = document.getElementById('studentProgress');
    if (progress) {
        let displayIndex = currentStudentIndex === realCount ? 0 : currentStudentIndex;
        progress.textContent = `${String(displayIndex + 1).padStart(2, '0')} / ${String(realCount).padStart(2, '0')}`;
    }
}

function startStudentAutoSlide() {
    const track = document.getElementById('studentSliderTrack');
    if (!track) return;

    if (window.innerWidth <= 768) {
        currentStudentIndex = 0;
        track.style.transition = 'none';
        track.style.transform = `translateX(0px)`;
        track.offsetHeight;
        track.style.transition = '';

        const progress = document.getElementById('studentProgress');
        if (progress) {
            const realCount = track.dataset.realCount ? parseInt(track.dataset.realCount) : track.querySelectorAll('.student-card').length;
            progress.textContent = `01 / ${String(realCount).padStart(2, '0')}`;
        }
    } else {
        track.style.transform = '';
    }
}

// ===== Mobile Slider: Programme Details (Courses Grid) =====
let currentCourseIndex = 0;

function moveCourseSlider(direction) {
    if (window.innerWidth > 768) return;

    const track = document.getElementById('courseSliderTrack');
    if (!track) return;

    if (!track.dataset.cloned) {
        const cards = Array.from(track.querySelectorAll('.course-card'));
        track.dataset.realCount = cards.length;
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone');
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
        track.dataset.cloned = 'true';
    }

    const realCount = parseInt(track.dataset.realCount);
    const cards = track.querySelectorAll('.course-card');
    
    if (realCount === 0) return;

    const cardWidth = cards[0].offsetWidth;
    const cardStyle = window.getComputedStyle(cards[0]);
    const leftMargin = parseFloat(cardStyle.marginLeft) || 0;
    const rightMargin = parseFloat(cardStyle.marginRight) || 0;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 14;
    const step = cardWidth + leftMargin + rightMargin + gap;

    if (direction !== undefined) {
        if (currentCourseIndex >= realCount && direction === 1) {
            track.style.transition = 'none';
            track.style.transform = `translateX(0px)`;
            track.offsetHeight;
            track.style.transition = '';
            currentCourseIndex = 0;
        }

        currentCourseIndex += direction;

        if (currentCourseIndex < 0) {
            track.style.transition = 'none';
            track.style.transform = `translateX(-${realCount * step}px)`;
            track.offsetHeight;
            track.style.transition = '';
            currentCourseIndex = realCount - 1;
        }
    }

    const offset = currentCourseIndex * step;
    track.style.transform = `translateX(-${offset}px)`;

    // Update progress counter
    const progress = document.getElementById('courseProgress');
    if (progress) {
        let displayIndex = currentCourseIndex === realCount ? 0 : currentCourseIndex;
        progress.textContent = `${String(displayIndex + 1).padStart(2, '0')} / ${String(realCount).padStart(2, '0')}`;
    }
}

function startCourseAutoSlide() {
    const track = document.getElementById('courseSliderTrack');
    if (!track) return;

    if (window.innerWidth <= 768) {
        currentCourseIndex = 0;
        track.style.transition = 'none';
        track.style.transform = `translateX(0px)`;
        track.offsetHeight;
        track.style.transition = '';

        const progress = document.getElementById('courseProgress');
        if (progress) {
            const realCount = track.dataset.realCount ? parseInt(track.dataset.realCount) : track.querySelectorAll('.course-card').length;
            progress.textContent = `01 / ${String(realCount).padStart(2, '0')}`;
        }
    } else {
        track.style.transform = '';
    }
}

// ===== Auto-slide timers (3 seconds) for all mobile sliders =====
let studentAutoTimer, courseAutoTimer, approvalAutoTimer, testimonialAutoTimer, galleryAutoTimer;
const AUTO_SLIDE_INTERVAL = 3000;
// Pause while the user touches a slider (or holds the page hidden) so
// auto-advance never fights the swipe gesture.
let slidersPaused = false;

const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

function clearAllAutoTimers() {
    clearInterval(studentAutoTimer);
    clearInterval(courseAutoTimer);
    clearInterval(approvalAutoTimer);
    clearInterval(testimonialAutoTimer);
    clearInterval(galleryAutoTimer);
    studentAutoTimer = courseAutoTimer = approvalAutoTimer = testimonialAutoTimer = galleryAutoTimer = undefined;
}

function startAllAutoSliders() {
    clearAllAutoTimers();

    if (slidersPaused) return; // paused by touch or hidden tab
    if (prefersReducedMotion && prefersReducedMotion.matches) return; // a11y

    testimonialAutoTimer = setInterval(function () {
        moveTestimonial(1);
    }, AUTO_SLIDE_INTERVAL);

    if (window.innerWidth > 768) return; // only auto-slide on mobile

    studentAutoTimer = setInterval(function () {
        moveStudentSlider(1);
    }, AUTO_SLIDE_INTERVAL);

    courseAutoTimer = setInterval(function () {
        moveCourseSlider(1);
    }, AUTO_SLIDE_INTERVAL);

    approvalAutoTimer = setInterval(function () {
        moveApprovalSlider(1);
    }, AUTO_SLIDE_INTERVAL);

    galleryAutoTimer = setInterval(function () {
        nextGallerySlide();
    }, AUTO_SLIDE_INTERVAL);
}

// Pause auto-advance while the user is actively touching any slider track
function initSliderPauseOnTouch() {
    const tracks = [
        'studentSliderTrack', 'courseSliderTrack', 'approvalSliderTrack',
        'testimonialGrid', 'industrySliderTrack',
    ];

    tracks.forEach((trackId) => {
        const track = document.getElementById(trackId);
        if (!track) return;

        track.addEventListener('touchstart', () => {
            slidersPaused = true;
            clearAllAutoTimers();
        }, { passive: true });

        track.addEventListener('touchend', () => {
            slidersPaused = false;
            startAllAutoSliders();
        }, { passive: true });

        track.addEventListener('touchcancel', () => {
            slidersPaused = false;
            startAllAutoSliders();
        }, { passive: true });
    });

    // Battery/tab-visibility: don't advance sliders the user can't see
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            slidersPaused = true;
            clearAllAutoTimers();
        } else {
            slidersPaused = false;
            startAllAutoSliders();
        }
    });

    // React live if the user toggles reduced motion
    if (prefersReducedMotion) {
        const onMotionPrefChange = () => startAllAutoSliders();
        if (prefersReducedMotion.addEventListener) {
            prefersReducedMotion.addEventListener('change', onMotionPrefChange);
        } else if (prefersReducedMotion.addListener) {
            prefersReducedMotion.addListener(onMotionPrefChange);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSliderPauseOnTouch);
} else {
    initSliderPauseOnTouch();
}

// Init mobile sliders
function initMobileSliders() {
    startStudentAutoSlide();
    startCourseAutoSlide();
    startAllAutoSliders();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileSliders);
} else {
    initMobileSliders();
}

// Every slider that loops on mobile extends its track with clones (marked
// `.clone`). Widening the window turns those tracks back into grids that show
// every child, so the copies have to go — otherwise leaving phone view leaves
// the page displaying duplicated cards. Clearing `dataset.cloned` as well lets
// the mobile path clone afresh if the window narrows again.
const CLONED_TRACK_IDS = ['testimonialGrid', 'studentSliderTrack', 'courseSliderTrack', 'approvalSliderTrack'];

function stripSliderClones() {
    CLONED_TRACK_IDS.forEach(id => {
        const track = document.getElementById(id);
        if (!track) return;
        track.querySelectorAll('.clone').forEach(clone => clone.remove());
        delete track.dataset.cloned;
        delete track.dataset.realCount;
    });
}

window.addEventListener('resize', () => {
    // Leaving phone view: drop the loop clones so the desktop grids hold real cards only.
    if (window.innerWidth > 768) stripSliderClones();

    currentTestimonialIndex = 0;
    const grid = document.getElementById('testimonialGrid');
    if (grid) grid.style.transform = 'translateX(0px)';
    renderTestimonialProgress();

    // Approval slider: clear the mobile translate so the wrapped desktop row isn't left shifted
    resetApprovalSlider();

    // Industry slider: restart auto-slide when crossing the mobile/desktop breakpoint
    currentIndustryIndex = 0;
    const industryTrack = document.getElementById('industrySliderTrack');
    if (industryTrack) industryTrack.style.transform = '';
    startIndustryAutoSlide();

    startStudentAutoSlide();
    startCourseAutoSlide();

    // Restart auto-slide timers based on new viewport
    startAllAutoSliders();
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

function resetApprovalSlider() {
    currentApprovalIndex = 0;
    const track = document.getElementById('approvalSliderTrack');
    if (track) {
        track.style.transition = 'none';
        track.style.transform = `translateX(0px)`;
        track.offsetHeight;
        track.style.transition = '';
    }

    const progress = document.getElementById('approvalProgress');
    if (progress && track) {
        const realCount = track.dataset.realCount ? parseInt(track.dataset.realCount) : track.querySelectorAll('.approval-image-box').length;
        progress.textContent = `01 / ${String(realCount).padStart(2, '0')}`;
    }
}

function moveApprovalSlider(direction) {
    if (window.innerWidth > 768) return;

    const track = document.getElementById('approvalSliderTrack');
    if (!track) return;

    if (!track.dataset.cloned) {
        const cards = Array.from(track.querySelectorAll('.approval-image-box'));
        track.dataset.realCount = cards.length;
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone');
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
        track.dataset.cloned = 'true';
    }

    const realCount = parseInt(track.dataset.realCount);
    const cards = track.querySelectorAll('.approval-image-box');
    
    if (realCount === 0) return;

    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 15;
    const step = cardWidth + gap;

    if (direction !== undefined) {
        if (currentApprovalIndex >= realCount && direction === 1) {
            track.style.transition = 'none';
            track.style.transform = `translateX(0px)`;
            track.offsetHeight;
            track.style.transition = '';
            currentApprovalIndex = 0;
        }

        currentApprovalIndex += direction;

        if (currentApprovalIndex < 0) {
            track.style.transition = 'none';
            track.style.transform = `translateX(-${realCount * step}px)`;
            track.offsetHeight;
            track.style.transition = '';
            currentApprovalIndex = realCount - 1;
        }
    }

    const offset = currentApprovalIndex * step;
    track.style.transform = `translateX(-${offset}px)`;

    const progress = document.getElementById('approvalProgress');
    if (progress) {
        let displayIndex = currentApprovalIndex === realCount ? 0 : currentApprovalIndex;
        progress.textContent = `${String(displayIndex + 1).padStart(2, '0')} / ${String(realCount).padStart(2, '0')}`;
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

    const reveal = (el) => {
        el.classList.add('revealed');
        observer.unobserve(el);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                reveal(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealTargets.forEach((el) => observer.observe(el));

    /* The observer only reports threshold crossings, so a section the viewport
       skips over — jumping to an anchor, restoring a remembered scroll
       position, flicking fast — is never reported and stays at opacity 0 while
       still occupying its full height, which reads as an empty gap between
       sections. Sweep on every scroll: anything the viewport has reached gets
       revealed, and the observer keeps handling the normal case. */
    const sweep = () => {
        revealTargets.forEach((el) => {
            if (!el.classList.contains('revealed') && el.getBoundingClientRect().top < window.innerHeight) {
                reveal(el);
            }
        });
    };

    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('hashchange', sweep);
    window.addEventListener('load', sweep);
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

// ===== Mobile Topbar: same logic as desktop =====
// The navbar is position: fixed on mobile, which would cover the in-flow topbar.
// At the top of the page the navbar sits directly below the topbar; as the user
// scrolls it releases to top: 0 — exactly mirroring desktop sticky behaviour.
function initMobileTopbar() {
    const topbar = document.querySelector('.topbar');
    const navbar = document.querySelector('.navbar');
    if (!topbar || !navbar) return;

    function updateTopbarOffset() {
        if (window.innerWidth > 768) {
            // Desktop: navbar is position: sticky — remove any mobile override
            if (navbar.style.top) navbar.style.top = '';
            return;
        }

        const topbarHeight = topbar.offsetHeight;
        navbar.style.top = `${Math.max(0, topbarHeight - window.scrollY)}px`;
    }

    window.addEventListener('scroll', updateTopbarOffset, { passive: true });
    window.addEventListener('resize', updateTopbarOffset);
    updateTopbarOffset();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileTopbar);
} else {
    initMobileTopbar();
}

// ===== Mobile Nav: close on link tap, lock page scroll, support Escape =====
function initMobileNavClose() {
    const menuToggle = document.getElementById('menu-toggle');
    if (!menuToggle) return;

    const navLinks = document.querySelectorAll('.nav-close-link');
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (menuToggle.checked) {
                menuToggle.checked = false;
            }
        });
    });

    // Lock the page behind the drawer so the background cannot scroll under it.
    function syncNavState() {
        document.body.classList.toggle('nav-open', menuToggle.checked && window.innerWidth <= 768);
    }

    menuToggle.addEventListener('change', syncNavState);
    window.addEventListener('resize', syncNavState);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuToggle.checked) {
            menuToggle.checked = false;
            syncNavState();
        }
    });

    syncNavState();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNavClose);
} else {
    initMobileNavClose();
}

// ===== Hero Background Slider =====
function initSimpleHeroSlider() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    // Smooth fade effect
    heroBg.style.transition = 'opacity 0.4s ease-in-out';

    // Production banners (images/New Photos/) ship a desktop crop and a
    // narrower mobile crop of the same two designs: the admissions banner and
    // the Smart India Hackathon banner. Both lists keep the same order so the
    // rotation stays in sync across breakpoints, and index 0 matches the
    // default banner painted by the stylesheets.
    const desktopBanners = [
        'images/New%20Photos/Admissions%20Open%20Banner%20Desktop.webp',
        'images/New%20Photos/Hackathon%202025%20Desktop.webp'
    ];
    const mobileBanners = [
        'images/New%20Photos/Admissions%20Open%20Banner%20Mobile.webp',
        'images/New%20Photos/Hackathon%202025%20Mobile.webp'
    ];

    let currentIndex = 0;

    function getBanners() {
        return window.innerWidth <= 768 ? mobileBanners : desktopBanners;
    }

    setInterval(() => {
        heroBg.style.opacity = '0'; // fade out
        setTimeout(() => {
            const banners = getBanners();
            currentIndex = (currentIndex + 1) % banners.length;
            heroBg.style.backgroundImage = `url('${banners[currentIndex]}')`;
            heroBg.style.opacity = '1'; // fade in
        }, 400);
    }, 8000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimpleHeroSlider);
} else {
    initSimpleHeroSlider();
}

// ===== Microsoft CoE Image Gallery Slider =====
(function initCoeGallerySlider() {
    const TOTAL = 8;
    const AUTO_INTERVAL = 3500;
    let currentIndex = 0;
    let autoTimer = null;
    let isPaused = false;

    // Always 1 image at a time (full-width)
    const visibleCount = () => 1;

    const track = document.getElementById('coeGalleryTrack');
    const prevBtn = document.getElementById('coeGalleryPrev');
    const nextBtn = document.getElementById('coeGalleryNext');
    const pauseBtn = document.getElementById('coeGalleryPause');
    const pauseIcon = document.getElementById('coeGalleryPauseIcon');
    const playIcon = document.getElementById('coeGalleryPlayIcon');
    const progressEl = document.getElementById('coeGalleryProgress');
    const dotsContainer = document.getElementById('coeGalleryDots');

    if (!track || !prevBtn || !nextBtn) return;

    // Build dot indicators
    function buildDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < TOTAL; i++) {
            const dot = document.createElement('button');
            dot.className = 'coe-gallery-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to image ${i + 1}`);
            dot.addEventListener('click', () => { goTo(i); if (!isPaused) { stopAuto(); startAuto(); } });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.coe-gallery-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function updateProgress() {
        if (!progressEl) return;
        progressEl.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}`;
    }

    function applyTranslate() {
        const slides = track.querySelectorAll('.coe-gallery-slide');
        if (!slides.length) return;
        const slideWidth = slides[0].offsetWidth;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateProgress();
        updateDots();
    }

    function goTo(index) {
        currentIndex = Math.max(0, Math.min(TOTAL - 1, index));
        applyTranslate();
    }

    function next() {
        currentIndex = (currentIndex + 1) % TOTAL;
        applyTranslate();
    }

    function prev() {
        currentIndex = (currentIndex - 1 + TOTAL) % TOTAL;
        applyTranslate();
    }

    function startAuto() {
        if (autoTimer) clearInterval(autoTimer);
        if (isPaused) return;
        autoTimer = setInterval(next, AUTO_INTERVAL);
    }

    function stopAuto() {
        if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    function togglePause() {
        isPaused = !isPaused;
        if (pauseBtn) pauseBtn.classList.toggle('is-paused', isPaused);
        if (pauseIcon) pauseIcon.style.display = isPaused ? 'none' : '';
        if (playIcon)  playIcon.style.display  = isPaused ? ''     : 'none';
        isPaused ? stopAuto() : startAuto();
    }

    // Button events
    nextBtn.addEventListener('click', () => { next(); if (!isPaused) { stopAuto(); startAuto(); } });
    prevBtn.addEventListener('click', () => { prev(); if (!isPaused) { stopAuto(); startAuto(); } });
    if (pauseBtn) pauseBtn.addEventListener('click', togglePause);

    // Touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
            if (!isPaused) { stopAuto(); startAuto(); }
        }
    }, { passive: true });

    // Recalculate on resize (slide widths change)
    window.addEventListener('resize', applyTranslate);

    // Init
    function init() {
        buildDots();
        applyTranslate();
        startAuto();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
