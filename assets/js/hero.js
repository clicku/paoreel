/* ==========================================================
   PAOREEL V2
   HERO INTERACTIONS
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const hero = document.querySelector(".hero");
    const bg = document.querySelector(".hero-bg-image");
    const bloom = document.querySelector(".light-bloom");
    const cursor = document.querySelector(".cursor-light");

    if (!hero || !bg) return;

    /* ======================================================
       MOUSE PARALLAX
    ====================================================== */

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    hero.addEventListener("mousemove", (e) => {

        const rect = hero.getBoundingClientRect();

        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 20;

        if (cursor) {

            gsap.to(cursor, {

                x: e.clientX,
                y: e.clientY,
                opacity: 1,
                duration: 0.4,
                ease: "power2.out"

            });

        }

    });

    hero.addEventListener("mouseleave", () => {

        if (cursor) {

            gsap.to(cursor, {

                opacity: 0,
                duration: 0.5

            });

        }

    });

    /* ======================================================
       SMOOTH PARALLAX LOOP
    ====================================================== */

    function animateHero() {

        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        gsap.set(bg, {

            x: currentX,
            y: currentY

        });

        if (bloom) {

            gsap.set(bloom, {

                x: currentX * 0.5,
                y: currentY * 0.5

            });

        }

        requestAnimationFrame(animateHero);

    }

    animateHero();

    /* ======================================================
       SCROLL PARALLAX
    ====================================================== */

    window.addEventListener("scroll", () => {

        const scroll = window.scrollY;

        gsap.to(bg, {

            y: currentY + scroll * 0.12,
            duration: 0.5,
            overwrite: true,
            ease: "none"

        });

    });

    /* ======================================================
       HEADER GLASS EFFECT
    ====================================================== */

    const header = document.getElementById("header");

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 60) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    updateHeader();

    window.addEventListener("scroll", updateHeader);

    /* ======================================================
       HERO BREATHING (VERY SUBTLE)
    ====================================================== */

    gsap.to(bg, {

        scale: 1.14,

        duration: 12,

        repeat: -1,

        yoyo: true,

        ease: "sine.inOut"

    });

    /* ======================================================
       LIGHT BLOOM FLOAT
    ====================================================== */

    if (bloom) {

        gsap.to(bloom, {

            x: 20,

            y: -15,

            duration: 10,

            repeat: -1,

            yoyo: true,

            ease: "sine.inOut"

        });

    }

});