document.addEventListener("DOMContentLoaded", () => {
    const lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
        autoRaf: false
    });

    window.lenis = lenis;
    
    // Explicitly stop scrolling on load so user cannot scroll during preloader
    lenis.stop();

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    if (window.gsap && window.ScrollTrigger) {
        lenis.on("scroll", ScrollTrigger.update);
    }

    gsap.ticker.lagSmoothing(0);
});