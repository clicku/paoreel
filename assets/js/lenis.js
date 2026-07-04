document.addEventListener("DOMContentLoaded", () => {

    const lenis = new Lenis({

        duration:1.2,

        smoothWheel:true,

        wheelMultiplier:1,

        touchMultiplier:1.5,

        infinite:false,

        autoRaf:false

    });

    window.lenis = lenis;

    gsap.ticker.add((time)=>{

        lenis.raf(time * 1000);

    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.lagSmoothing(0);

});

    function raf(time) {

        lenis.raf(time);

        requestAnimationFrame(raf);

    }

    requestAnimationFrame(raf);

    if (window.gsap) {

        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {

            lenis.raf(time * 1000);

        });

        gsap.ticker.lagSmoothing(0);

    }

});