/* ==========================================================
   PAOREEL STUDIOS V3
   HERO
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    gsap.registerPlugin(ScrollTrigger);

    const hero = document.querySelector(".hero");
    const heroParallax = document.querySelector(".hero-parallax");
    const heroImage = document.querySelector(".hero-image");
    const heroImageImg = document.querySelector(".hero-image img");
    const heroContent = document.querySelector(".hero-content");
    const scrollIndicator = document.querySelector(".scroll-indicator");
    const gallery = document.querySelector(".gallery-section");
    const galleryTrack = document.querySelector(".gallery-track");

    if (!hero || !heroParallax || !heroImage || !heroImageImg) return;

    /* ======================================================
       MOUSE PARALLAX
    ====================================================== */

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    hero.addEventListener("mousemove", (event) => {

        const rect = hero.getBoundingClientRect();

        mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 20;
        mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 14;

    });

    function animateHero() {

        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        gsap.set(heroParallax, {

            x: currentX,
            y: currentY

        });

        requestAnimationFrame(animateHero);

    }

    animateHero();



    /* ======================================================
       KEN BURNS
    ====================================================== */

    gsap.to(heroImageImg, {

        scale: 1.04,

        duration: 30,

        repeat: -1,

        yoyo: true,

        ease: "sine.inOut"

    });



    /* ======================================================
       HERO PARALLAX
    ====================================================== */

    gsap.to(heroImage, {

        yPercent: 6,

        ease: "none",

        scrollTrigger: {

            trigger: hero,

            start: "top top",

            end: "bottom top",

            scrub:5

        }

    });



    /* ======================================================
       HERO BLUR
    ====================================================== */

    gsap.to(heroImageImg, {

        filter: "blur(4px)",

        ease: "none",

        scrollTrigger: {

            trigger: hero,

            start: "top top",

            end: "bottom top",

            scrub:5

        }

    });



    /* ======================================================
       HERO SCROLL ZOOM
    ====================================================== */

    gsap.to(heroImageImg, {

        scale: 1.08,

        ease: "none",

        scrollTrigger: {

            trigger: hero,

            start: "top top",

            end: "bottom top",

            scrub:5

        }

    });



    /* ======================================================
       HERO CONTENT
    ====================================================== */

    gsap.to(heroContent, {

        yPercent: -18,

        opacity: 0.35,

        ease: "none",

        scrollTrigger: {

            trigger: hero,

            start: "top top",

            end: "bottom top",

            scrub:5

        }

    });



    /* ======================================================
   SCROLL INDICATOR
====================================================== */

if (scrollIndicator) {

    gsap.to(scrollIndicator, {

        opacity: 0,

        y: 20,

        ease: "none",

        scrollTrigger: {

            trigger: hero,

            start: "top top",

            end: "top+=180 top",

            scrub: 1

        }

    });

}


/* ======================================================
   GALLERY OVERLAY FADE
====================================================== */

const galleryOverlay = document.querySelector(".gallery-overlay");

if (galleryOverlay) {

    gsap.to(galleryOverlay, {

        opacity: 1,

        ease: "none",

        scrollTrigger: {

            trigger: ".gallery-section",

            start: "top bottom",

            end: "top 85%",

            scrub: true

        }

    });

}


/* ======================================================
   GALLERY REVEAL
====================================================== */

if (galleryTrack) {

    gsap.from(galleryTrack, {

        y: 40,

        ease: "none",

        scrollTrigger: {

            trigger: gallery,

            start: "top 90%",

            end: "top 70%",

            scrub: 2

        }

    });

}

});