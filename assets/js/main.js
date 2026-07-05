/* ==========================================================
   PAOREEL STUDIOS V3
   MAIN
   ========================================================== */



/* ==========================================================
   GSAP
   ========================================================== */

gsap.registerPlugin(ScrollTrigger);



/* ==========================================================
   LENIS
   ========================================================== */

const lenis = new Lenis({

    duration: 1.2,

    smoothWheel: true,

    touchMultiplier: 1.5,

    wheelMultiplier: 1,

    infinite: false

});



/* ==========================================================
   LENIS RAF
   ========================================================== */

function raf(time) {

    lenis.raf(time);

    requestAnimationFrame(raf);

}

requestAnimationFrame(raf);



/* ==========================================================
   GSAP + LENIS
   ========================================================== */

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {

    lenis.raf(time * 1000);

});

gsap.ticker.lagSmoothing(0);



/* ==========================================================
   PAGE READY
   ========================================================== */

document.documentElement.classList.add("is-ready");