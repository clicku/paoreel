/* ==========================================================
   PAOREEL STUDIOS V3
   PREMIUM GALLERY
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const viewport = document.querySelector(".gallery-viewport");
    const track = document.querySelector(".gallery-track");

    if (!viewport || !track) return;

    gsap.registerPlugin();

    /* ======================================================
       SETTINGS
    ====================================================== */

    const AUTO_SPEED = 0.35;
    const RESUME_DELAY = 2500;

    /* ======================================================
       STATE
    ====================================================== */

    let currentX = 0;
    let targetX = 0;

    let isDragging = false;
    let startX = 0;
    let dragStart = 0;

    let autoScroll = true;
    let resumeTimer = null;

    /* ======================================================
       LOOP WIDTH
    ====================================================== */

    const loopWidth = track.scrollWidth / 2;

    /* ======================================================
       RESUME
    ====================================================== */

    function scheduleResume() {

        clearTimeout(resumeTimer);

        resumeTimer = setTimeout(() => {

            autoScroll = true;

        }, RESUME_DELAY);

    }

    /* ======================================================
       ANIMATION LOOP
    ====================================================== */

    function animate() {

        if (autoScroll && !isDragging) {

            targetX -= AUTO_SPEED;

        }

        currentX += (targetX - currentX) * 0.12;

        if (currentX <= -loopWidth) {

            currentX += loopWidth;
            targetX += loopWidth;

        }

        if (currentX > 0) {

            currentX -= loopWidth;
            targetX -= loopWidth;

        }

        gsap.set(track, {

            x: currentX

        });

        requestAnimationFrame(animate);

    }

    animate();

    /* ======================================================
       DESKTOP DRAG
    ====================================================== */

    viewport.addEventListener("mousedown", (event) => {

        isDragging = true;

        autoScroll = false;

        startX = event.clientX;

        dragStart = targetX;

        viewport.style.cursor = "grabbing";

    });

    window.addEventListener("mousemove", (event) => {

        if (!isDragging) return;

        const distance = event.clientX - startX;

        targetX = dragStart + distance;

    });

    window.addEventListener("mouseup", () => {

        if (!isDragging) return;

        isDragging = false;

        viewport.style.cursor = "grab";

        scheduleResume();

    });

    /* ======================================================
       TOUCH
    ====================================================== */

    viewport.addEventListener("touchstart", (event) => {

        isDragging = true;

        autoScroll = false;

        startX = event.touches[0].clientX;

        dragStart = targetX;

    }, {

        passive: true

    });

    viewport.addEventListener("touchmove", (event) => {

        if (!isDragging) return;

        const distance = event.touches[0].clientX - startX;

        targetX = dragStart + distance;

    }, {

        passive: true

    });

    viewport.addEventListener("touchend", () => {

        isDragging = false;

        scheduleResume();

    });

    /* ======================================================
       HOVER
    ====================================================== */

    viewport.addEventListener("mouseenter", () => {

        if (!isDragging) {

            autoScroll = false;

        }

    });

    viewport.addEventListener("mouseleave", () => {

        if (!isDragging) {

            scheduleResume();

        }

    });

});