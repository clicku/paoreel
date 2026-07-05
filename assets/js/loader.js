/* ==========================================================
   PAOREEL STUDIOS V3
   LOADER
   ========================================================== */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (!loader) return;

    gsap.set(loader, {
        opacity: 1
    });

    const timeline = gsap.timeline({

        defaults: {
            ease: "power3.out"
        }

    });

    timeline

        .to(loader, {

            opacity: 0,
            duration: 1.2,
            delay: 0.3

        })

        .set(loader, {

            display: "none"

        })

        .from(".hero-label", {

            y: 40,
            opacity: 0,
            duration: 0.8

        })

        .from(".hero-title", {

            y: 70,
            opacity: 0,
            duration: 1.2

        }, "-=0.45")

        .from(".site-header", {

            opacity: 0,
            y: -20,
            duration: 0.8

        }, "-=0.8");

});