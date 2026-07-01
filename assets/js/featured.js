/* ==========================================================
   FEATURED CATEGORIES ANIMATION
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".featured-item").forEach((item, index) => {

        const image = item.querySelector(".featured-image");
        const content = item.querySelector(".featured-content");

        gsap.set(image, {
            opacity: 0,
            y: 100,
            scale: 1.12
        });

        gsap.set(content, {
            opacity: 0,
            x: index % 2 === 0 ? 80 : -80
        });

        const tl = gsap.timeline({

            scrollTrigger: {

                trigger: item,

                start: "top 75%",

                toggleActions: "play none none reverse"

            }

        });

        tl.to(image, {

            opacity: 1,

            y: 0,

            scale: 1,

            duration: 1.3,

            ease: "power3.out"

        });

        tl.to(content, {

            opacity: 1,

            x: 0,

            duration: 1,

            ease: "power3.out"

        }, "-=0.9");

    });

});