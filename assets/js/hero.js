/*
==========================================
PAOREEL STUDIOS

V5 HERO ENGINE

==========================================
*/

window.Hero = (() => {

    let initialized = false;

    /* ==========================================
        Cached Elements
    ========================================== */

    let hero;
    let content;
    let heroParallax;
    let title;
    let lines;

    let scrollIndicator;
    /* ==========================================
        Cache DOM
    ========================================== */

    function cacheElements() {

        hero = document.querySelector(".hero");

        content = hero.querySelector(".hero-content");

        heroParallax = document.querySelector(".hero-parallax");

        title = hero.querySelector(".hero-title");

        lines = hero.querySelectorAll(".hero-line-inner");

        scrollIndicator =
            hero.querySelector(".scroll-indicator");

    }
        /* ==========================================
        Validate
    ========================================== */

    function validateElements() {

        if (!hero) return false;

        if (!content) return false;
 
        if (!title) return false;

        if (!lines.length) return false;

        if (!scrollIndicator) return false;

        return true;

    }
       /* ==========================================
    Initial State
========================================== */

function setupInitialState() {

    gsap.set(content, {

        opacity: 0

    });
    

    gsap.set(lines, {

        opacity: 0,
        yPercent: 100

    });

    gsap.set(scrollIndicator, {

        opacity: 0,
        y: 20

    });

}
        /* ==========================================
        Init
    ========================================== */

    function init() {

        if (initialized) return;

        initialized = true;

        console.log("Hero V5 Ready");

        cacheElements();

        if (!validateElements()) {

            console.error("Hero elements missing.");

            return;

        }

        setupInitialState();

    }
   
/* ==========================================
    Reveal
========================================== */

function reveal() {

    console.log("Hero.reveal() called");

    const tl = gsap.timeline({

        defaults: {

            ease: "power3.out"

        }

    });

    tl.set(content, {

        opacity:1

    })


    .to(lines,{

        opacity:1,
        yPercent:0,
        duration:1.2,
        stagger:.22,
        ease:"expo.out"

    },"-=0.15")

   .to(scrollIndicator,{

    opacity:1,
    y:0,
    duration:.8

})


.call(()=>{


    // Reveal gallery white background
    if(window.revealGallery){

        window.revealGallery();

    }


})


.call(()=>{

    // Initialize 2.5D parallax tracking and canvas particle systems
    if (window.Parallax25D) {
        window.Parallax25D.init();
    }

    startCameraBreathing();

    setupHeroExit();

    document.body.classList.remove("cinematic-lock");

    if(window.App?.startScroll){

        App.startScroll();

    }

});
}

/* ==========================================
    Camera Breathing
========================================== */

function startCameraBreathing() {

    if (!heroParallax) return;

gsap.to(heroParallax,{

        scale:1.018,

        x:-8,

        y:6,

        rotation:0.12,

        duration:18,

        ease:"sine.inOut",

        repeat:-1,

        yoyo:true

    });

}
function setupHeroExit() {

    const heroFixed =
        document.querySelector(".hero-fixed");

    const gallery =
        document.querySelector(".gallery-section");

    if(!heroFixed || !gallery) return;

    ScrollTrigger.create({

        trigger: gallery,

        start: "top 80%",

        onEnter: () => {

            gsap.to(heroFixed,{

                opacity:0,

                duration:1,

                ease:"power2.out"

            });

        },

        onLeaveBack: () => {

            gsap.to(heroFixed,{

                opacity:1,

                duration:1,

                ease:"power2.out"

            });

        }

    });

}
   return {

    init,
    reveal

};
    
})();