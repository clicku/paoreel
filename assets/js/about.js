document.addEventListener("DOMContentLoaded", () => {

    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const hero = document.querySelector(".about-hero");

    if (!hero) return;

    /* ==========================================================
       HERO
    ========================================================== */

    const tl = gsap.timeline({

        defaults: {

            ease: "power3.out"

        }

    });

    tl.to(".about-hero-image img", {

        scale: 1,

        duration: 2.4

    })

    .to(".about-hero-content span", {

        opacity: 1,

        y: 0,

        duration: .7

    }, "-=1.8")

    .to(".about-hero-content h1", {

        opacity: 1,

        y: 0,

        duration: 1

    }, "-=.4")

    .to(".about-hero-content p", {

        opacity: 1,

        y: 0,

        duration: .9

    }, "-=.5");


    /* ==========================================================
       INTRO
    ========================================================== */

    gsap.to(".intro-content", {

        scrollTrigger: {

            trigger: ".about-intro",

            start: "top 70%"

        },

        opacity: 1,

        y: 0,

        duration: 1.1,

        ease: "power3.out"

    });

    gsap.to(".intro-image", {

        scrollTrigger: {

            trigger: ".about-intro",

            start: "top 70%"

        },

        opacity: 1,

        y: 0,

        duration: 1.2,

        delay: .2,

        ease: "power3.out"

    });


    /* ==========================================================
       PARALLAX BANNER
    ========================================================== */

    gsap.to(".about-banner img", {

        scrollTrigger: {

            trigger: ".about-banner",

            start: "top bottom",

            end: "bottom top",

            scrub: true

        },

        scale: 1.1

    });

gsap.to(".about-banner-content", {

    scrollTrigger: {

        trigger: ".about-banner",

        start: "top 65%"

    },

    opacity: 1,

    y: 0,

    duration: 1.2,

    ease: "power3.out"

});
    /* ==========================================================
       PHILOSOPHY
    ========================================================== */

    gsap.utils.toArray(".philosophy-card").forEach((card, index) => {

        gsap.to(card, {

            scrollTrigger: {

                trigger: card,

                start: "top 85%"

            },

            opacity: 1,

            y: 0,

            duration: .9,

            delay: index * .15,

            ease: "power3.out"

        });

    });


    /* ==========================================================
       SERVICES
    ========================================================== */

    gsap.utils.toArray(".service-card").forEach((card, index) => {

        gsap.to(card, {

            scrollTrigger: {

                trigger: card,

                start: "top 85%"

            },

            opacity: 1,

            y: 0,

            duration: .9,

            delay: index * .15,

            ease: "power3.out"

        });

    });


    /* ==========================================================
       CTA
    ========================================================== */

    gsap.to(".about-cta", {

        scrollTrigger: {

            trigger: ".about-cta",

            start: "top 80%"

        },

        opacity: 1,

        y: 0,

        duration: 1.2,

        ease: "power3.out"

    });

});