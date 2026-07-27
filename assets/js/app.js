/* ==========================================================
   PAOREEL STUDIOS V3
   APPLICATION ENTRY
========================================================== */

// Prevent browser from restoring previous scroll position
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("DOMContentLoaded", () => {
    // Force page start at top before cinematic begins
    window.scrollTo(0, 0);

    console.log("Application Loaded");

    /* ======================================================
       HERO
    ====================================================== */
    if (window.Hero) {
        Hero.init();
    } else {
        console.error("[App] Hero controller not found.");
    }

    /* ======================================================
       CINEMATIC
    ====================================================== */
    if (window.CinematicController) {
        CinematicController.start();
    } else {
        console.error("[App] CinematicController not found.");
    }

    /* ======================================================
       GALLERY INTRO ENGINE
    ====================================================== */
    if (typeof window.initGalleryIntroEngine === "function") {
        window.initGalleryIntroEngine();
        console.log("[App] Gallery Intro Engine initialized.");
    } else {
        console.warn("[App] initGalleryIntroEngine not found on window.");
    }

    /* ======================================================
       GALLERY SCROLL (UNROLL) ENGINE
    ====================================================== */
    if (typeof window.initGalleryUnrollEngine === "function") {
        window.initGalleryUnrollEngine();
        console.log("[App] Gallery Unroll Engine initialized.");
    } else {
        console.warn("[App] initGalleryUnrollEngine not found on window.");
    }
});

/* ==========================================================
   WINDOW LOAD (STABILIZATION & LAYOUT RECALCULATION)
========================================================== */
window.addEventListener("load", () => {
    // Recalculate ScrollTrigger measurements once all fonts, CSS, & images load
    if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
        console.log("[App] ScrollTrigger refreshed.");
    }
});