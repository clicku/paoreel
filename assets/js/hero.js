/* ==========================================================
   PAOREEL V2
   HERO SCROLL LOCK (Extended Duration)
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const bg = document.querySelector(".hero-bg");
    const bloom = document.querySelector(".light-bloom");
    const cursor = document.querySelector(".cursor-light");

    // Mouse parallax logic...
    let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;

    hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 20;

        // Calculate cursor position relative to the hero container in pixels or percentages
        const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

        // Update CSS variables for the color reveal mask
        hero.style.setProperty('--x', `${xPercent}%`);
        hero.style.setProperty('--y', `${yPercent}%`);

        if (cursor) {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, opacity: 1, duration: 0.4, ease: "power2.out" });
        }
    });

    hero.addEventListener("mouseleave", () => {
        // Move mask off-screen or fade out color layer when mouse leaves
        hero.style.setProperty('--x', `-500px`);
        hero.style.setProperty('--y', `-500px`);

        if (cursor) {
            gsap.to(cursor, { opacity: 0, duration: 0.5 });
        }
    });

    hero.addEventListener("mouseleave", () => {
        if (cursor) {
            gsap.to(cursor, { opacity: 0, duration: 0.5 });
        }
    });

    function animateHero() {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        if (bg) gsap.set(bg, { x: currentX, y: currentY });
        if (bloom) gsap.set(bloom, { x: currentX * 0.5, y: currentY * 0.5 });

        requestAnimationFrame(animateHero);
    }
    animateHero();

    /* ======================================================
       SCROLL LOCK PINNING (Extended Length)
    ====================================================== */
    gsap.registerPlugin(ScrollTrigger);

    // Increased duration: "+=250%" means the user scrolls 2.5 screens worth of 
    // movement while locked inside the hero section before it unlocks.
    ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "+=250%", 
        pin: true,
        pinSpacing: true,
        scrub: true,
    });

    // Spread out the fade animations to match the longer lock duration
    gsap.to(".scroll-indicator", {
        opacity: 0,
        y: 30,
        scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "+=40%",
            scrub: true
        }
    });

    gsap.to(".hero-content", {
        opacity: 0,
        y: -40,
        scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "+=150%",
            scrub: true
        }
    });
});