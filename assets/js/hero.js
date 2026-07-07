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
    const galleryPaper = document.querySelector(".gallery-paper");

    if (!hero) return;



    /* ======================================================
       MOUSE PARALLAX
       ====================================================== */

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    hero.addEventListener("mousemove", (event) => {

        const rect = hero.getBoundingClientRect();

        mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
        mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 12;

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

        scale: 1.13,

        duration: 28,

        repeat: -1,

        yoyo: true,

        ease: "sine.inOut"

    });



    /* ======================================================
       HERO PARALLAX
       ====================================================== */

    gsap.to(heroImage, {

        yPercent: 10,

        ease: "none",

        scrollTrigger: {

            trigger: hero,

            start: "top top",

            end: "bottom top",

            scrub: 4

        }

    });



    /* ======================================================
       HERO IMAGE BLUR
       ====================================================== */

    gsap.to(heroImageImg, {

        filter: "blur(8px)",

        ease: "none",

        scrollTrigger: {

            trigger: hero,

            start: "top top",

            end: "bottom top",

            scrub: 4

        }

    });



    /* ======================================================
       HERO ZOOM ON SCROLL
       ====================================================== */

    gsap.to(heroImageImg, {

        scale: 1.18,

        ease: "none",

        scrollTrigger: {

            trigger: hero,

            start: "top top",

            end: "bottom top",

            scrub: 4

        }

    });



    /* ======================================================
       HERO CONTENT
       ====================================================== */

    gsap.to(heroContent, {

        yPercent: -20,

        opacity: 0.2,

        ease: "none",

        scrollTrigger: {

            trigger: hero,

            start: "top top",

            end: "bottom top",

            scrub: 3

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

    gsap.to(".gallery-overlay", {

    opacity: 1,

    ease: "none",

    scrollTrigger: {

        trigger: ".gallery-section",

        start: "top bottom",

        end: "top 70%",

        scrub: 2

    }

});

   /* ======================================================
   GALLERY PAPER
   Transparent → White
   ====================================================== */

if (galleryPaper) {

    gsap.fromTo(

        galleryPaper,

        {

            opacity: 0

        },

        {

            opacity: 1,

            ease: "none",

            scrollTrigger: {

                trigger: gallery,

                start: "top bottom",

                end: "top 55%",

                scrub: 3

            }

        }

    );

}



   /* ======================================================
   HERO TRANSITION
====================================================== */

gsap.to(".hero-transition", {

    yPercent: -100,

    ease: "none",

    scrollTrigger: {

        trigger: ".hero",

        start: "top top",

        end: "bottom top",

        scrub: true

    }

});


/* ======================================================
   GALLERY REVEAL
====================================================== */

if (gallery) {

    gsap.fromTo(gallery,

    {

        y: 140

    },

    {

        y: 0,

        ease: "none",

        scrollTrigger: {

            trigger: gallery,

            start: "top bottom",

            end: "top 55%",

            scrub: 3

        }

    }

);

  

}

});
function shutterEffect(nextImage){

    const tl = gsap.timeline();

    tl.to(".blade",{

        xPercent:120,

        opacity:1,

        duration:.18,

        stagger:.015,

        ease:"power3.in"

    });

    tl.add(()=>{

        heroImage.src = nextImage;

    });

    tl.to(".camera-flash",{

        opacity:.12,

        duration:.04,

        yoyo:true,

        repeat:1

    },"-=.05");

    tl.to(".blade",{

        xPercent:0,

        duration:.22,

        stagger:{

            each:.015,

            from:"end"

        },

        ease:"power3.out"

    });

    tl.set(".blade",{

        opacity:0

    });

}