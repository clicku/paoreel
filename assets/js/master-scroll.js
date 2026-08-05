window.MasterScroll = (() => {
    "use strict";

    let initialized = false;

    function init() {

        if (initialized) return;
        initialized = true;

        if (!window.gsap || !window.ScrollTrigger) return;

        gsap.registerPlugin(ScrollTrigger);

        const heroBg = document.querySelector("#layer-bg");
        const heroSubject = document.querySelector("#layer-fg");
        const heroCamera = document.querySelector("#parallax-stage");
        const galleryIntro = document.querySelector(".gallery-intro");
        const gallerySection = document.querySelector(".gallery-section");

        if (!heroBg || !heroSubject || !heroCamera || !galleryIntro || !gallerySection) {
            console.warn("[MasterScroll] Missing required elements.");
            return;
        }

        const master = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                endTrigger: ".gallery-section",
                end: "top top",
                scrub: 1,
                invalidateOnRefresh: true
            }
        });

        // Background moves the most
        master.to(heroBg, {
            scale: 1.12,
            y: -140,
            ease: "none"
        }, 0);

        // Foreground photographer moves less
        master.to(heroSubject, {
            scale: 1.03,
            y: -35,
            ease: "none"
        }, 0);

        // Whole camera rig gets a subtle float
        master.to(heroCamera, {
            rotation: 0.25,
            transformOrigin: "center center",
            ease: "none"
        }, 0);

        // Debug
        window.MasterTimeline = master;
    }

    return { init };

})();