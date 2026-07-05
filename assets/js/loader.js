/* ==========================================================
   PAOREEL STUDIOS V3
   LOADER
   ========================================================== */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (!loader) {

        if (window.lenis) {

            window.lenis.start();

        }

        return;

    }

    /* ======================================================
       INITIAL STATES
    ====================================================== */

    gsap.set(loader, {

        opacity: 1

    });

    gsap.set(".scroll-indicator", {

        opacity: 0,
        y: 0

    });

    gsap.set(".site-header", {

        opacity: 0,
        y: -20

    });

    gsap.set(".hero-label", {

        opacity: 0,
        y: 25

    });

    gsap.set(".hero-title", {

        opacity: 0,
        y: 40

    });

    /* ======================================================
       INTRO TIMELINE
    ====================================================== */

    const tl = gsap.timeline({

        defaults: {

            ease: "power3.out"

        }

    });

    tl

        /* Loader */

        .to(loader, {

            opacity: 0,

            duration: 0.8,

            delay: 0.2

        })

        .set(loader, {

            display: "none"

        })

        /* Navigation */

        .to(".site-header", {

            opacity: 1,

            y: 0,

            duration: 0.5

        })

        /* Hero Label */

        .to(".hero-label", {

            opacity: 1,

            y: 0,

            duration: 0.5

        }, "-=0.3")

        /* Hero Title */

        .to(".hero-title", {

            opacity: 1,

            y: 0,

            duration: 0.7

        }, "-=0.3")

        /* Small pause */

        .to({}, {

            duration: 0.4

        })

        /* Scroll Indicator */

        .to(".scroll-indicator", {

            opacity: 1,

            duration: 0.8

        });

    /* ======================================================
       SCROLL INDICATOR LOOP
    ====================================================== */

    gsap.to(".scroll-indicator", {

        y: 10,

        duration: 1.3,

        repeat: -1,

        yoyo: true,

        ease: "sine.inOut"

    });

});



/* ==========================================================
   UNLOCK ON FIRST SCROLL
   ========================================================== */

let introUnlocked = false;

function unlockIntro() {

    if (introUnlocked) return;

    introUnlocked = true;

    window.removeEventListener("wheel", unlockIntro);
    window.removeEventListener("touchstart", unlockIntro);

    gsap.timeline()

        .to(".scroll-indicator", {

            y: 18,

            opacity: 0,

            duration: 0.45,

            ease: "power2.out"

        })

        .add(() => {

            if (window.lenis) {

                window.lenis.start();

            }

        });

}

window.addEventListener("wheel", unlockIntro, {

    passive: true

});

window.addEventListener("touchstart", unlockIntro, {

    passive: true

});