/* ==========================================================
   PAOREEL STUDIOS
   CORE SERVICES
========================================================== */

gsap.registerPlugin(ScrollTrigger);

/* ==========================================================
   LENIS
========================================================== */

const lenis = new Lenis({

    duration: 2.0,

    smoothWheel: true,

    smoothTouch: false,

    wheelMultiplier: 0.65,

    touchMultiplier: 1,

    infinite: false

});

/* ==========================================================
   START STOP
========================================================== */

window.App = {

    lenis,

    startScroll() {

        lenis.start();

    },

    stopScroll() {

        lenis.stop();

    }

};

/* ==========================================================
   INITIAL STATE
========================================================== */

App.stopScroll();

/* ==========================================================
   RAF
========================================================== */

function raf(time) {

    lenis.raf(time);

    requestAnimationFrame(raf);

}

requestAnimationFrame(raf);

/* ==========================================================
   GSAP
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