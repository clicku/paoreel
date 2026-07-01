document.addEventListener("DOMContentLoaded", () => {

    gsap.defaults({
        ease: "power3.out"
    });

    // ============================================
    // INITIAL STATES
    // ============================================

    gsap.set("#main-header", {
        opacity: 0,
        y: -30
    });

    gsap.set(".logo-title img", {
        opacity: 0,
        y: 40
    });

    gsap.set(".hero-content p", {
        opacity: 0,
        y: 40
    });

    gsap.set(".hero-content .btn", {
        opacity: 0,
        y: 40
    });

    gsap.set(".hero-bg-image", {
        opacity: 0,
        scale: 1.18,
        filter: "blur(40px)"
    });

    gsap.set(".hero-overlay", {
        opacity: 1
    });

    // ============================================
    // DSLR STARTUP TIMELINE
    // ============================================

    const tl = gsap.timeline();

    // Camera powers on

    tl.to(".hero-bg-image", {

        opacity: 0.45,

        duration: 0.8

    });

    // Lens begins focusing

    tl.to(".hero-bg-image", {

        opacity: 0.75,

        filter: "blur(25px)",

        duration: 0.35

    });

    // Autofocus flicker

    tl.to(".hero-bg-image", {

        opacity: 0.35,

        filter: "blur(28px)",

        duration: 0.08

    });

    tl.to(".hero-bg-image", {

        opacity: 0.80,

        filter: "blur(18px)",

        duration: 0.15

    });

    tl.to(".hero-bg-image", {

        opacity: 0.50,

        filter: "blur(20px)",

        duration: 0.06

    });

    tl.to(".hero-bg-image", {

        opacity: 0.95,

        filter: "blur(8px)",

        duration: 0.20

    });

    // Final focus lock

    tl.to(".hero-bg-image", {

        opacity: 1,

        filter: "blur(0px)",

        duration: 0.8,

        ease: "power2.out"

    });

    // Tiny lens breathing

    tl.to(".hero-bg-image", {

        scale: 1.10,

        duration: 2.5,

        ease: "power2.out"

    }, 0);

    // ============================================
    // INTERFACE APPEARS
    // ============================================

    tl.to("#main-header", {

        opacity: 1,

        y: 0,

        duration: 0.8

    });

    tl.to(".logo-title img", {

        opacity: 1,

        y: 0,

        duration: 0.8

    }, "-=0.45");

    tl.to(".hero-content p", {

        opacity: 1,

        y: 0,

        duration: 0.8

    }, "-=0.45");

    tl.to(".hero-content .btn", {

        opacity: 1,

        y: 0,

        duration: 0.7,

        ease: "back.out(1.4)"

    }, "-=0.4");

    // ============================================
    // CONTINUOUS CINEMATIC ZOOM
    // ============================================

    gsap.to(".hero-bg-image", {

        scale: 1.04,

        duration: 30,

        ease: "none",

        repeat: -1,

        yoyo: true

    });

    // ============================================
    // FILM GRAIN DRIFT
    // ============================================

    gsap.to(".film-grain", {

        rotation: 0.02,

        duration: 5,

        repeat: -1,

        yoyo: true,

        ease: "none"

    });

    // ============================================
    // DUST FLOAT
    // ============================================

    gsap.to(".dust", {

        y: -40,

        duration: 20,

        repeat: -1,

        yoyo: true,

        ease: "sine.inOut"

    });

    // ============================================
    // PORTFOLIO PAGE TRANSITION
    // ============================================

    const button = document.getElementById("portfolio-btn");

    if (button) {

        button.addEventListener("click", function (e) {

            e.preventDefault();

            const url = this.href;

            const exit = gsap.timeline({

                onComplete() {

                    window.location = url;

                }

            });

            exit.to(".transition-column", {

                scaleY: 1,

                transformOrigin: "bottom",

                stagger: 0.12,

                duration: 0.7,

                ease: "power4.inOut"

            });

        });

    }

    // ============================================
    // BACK BUTTON FIX
    // ============================================

    window.addEventListener("pageshow", function (event) {

        if (event.persisted) {

            gsap.set(".transition-column", {

                scaleY: 0

            });

        }

    });

});