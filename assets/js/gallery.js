/* ==========================================================
   PAOREEL STUDIOS V3
   GALLERY
   ========================================================== */

window.addEventListener("load", () => {

    const track = document.querySelector(".gallery-track");

    if (!track) return;



    /* ======================================================
       CONTINUOUS SCROLL
       ====================================================== */

    gsap.to(track, {

        xPercent: -50,

        duration: 40,

        ease: "none",

        repeat: -1

    });



    /* ======================================================
       IMAGE HOVER
       ====================================================== */

    document.querySelectorAll(".gallery-item").forEach(item => {

        item.addEventListener("mouseenter", () => {

            gsap.to(item.querySelector("img"), {

                scale: 1.08,

                duration: 0.8,

                ease: "power3.out"

            });

        });



        item.addEventListener("mouseleave", () => {

            gsap.to(item.querySelector("img"), {

                scale: 1,

                duration: 0.8,

                ease: "power3.out"

            });

        });

    });

});