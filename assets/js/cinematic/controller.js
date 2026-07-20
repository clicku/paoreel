window.CinematicController = (() => {
    "use strict";

    let started = false;
    let editorialUpdater = null;
    let overlay, flash, video, heroStill, header, editorial, heroImage, filmGrain, body;
    let heroMask, soundToggle, apertureContainer;

    const shutterConfig = { irisValue: 0 };

    function cacheElements() {
        body = document.body;
        overlay = document.querySelector(".cinematic-overlay");

        // Flash Overlay Setup (Safely recreate to avoid leaks)
        const oldFlash = document.querySelector(".cinematic-flash");
        if (oldFlash) oldFlash.remove();

        flash = document.createElement("div");
        flash.className = "cinematic-flash";
        body.appendChild(flash);

        // Core Unified Media Element
        video = document.querySelector(".cinematic-video");
        heroStill = document.getElementById("hero-still");

        // UI Elements
        soundToggle = document.querySelector(".sound-toggle");
        header = document.querySelector(".site-header");
        editorial = document.querySelector(".editorial-overlay");
        heroImage = document.querySelector(".hero-image img");
        heroMask = document.querySelector(".hero-mask");
        filmGrain = document.querySelector(".film-grain");
        apertureContainer = document.querySelector(".cinematic-aperture");

        // Shutter Module Initialization
        if (window.Shutter && typeof window.Shutter.init === "function") {
            window.Shutter.init();
        }
    }

    function triggerTripleFlash() {
        gsap.timeline()
            .to(flash, { opacity: 0.85, duration: 0.03 })
            .to(flash, { opacity: 0, duration: 0.08 })
            .to(flash, { opacity: 0.65, duration: 0.03 }, "+=0.08")
            .to(flash, { opacity: 0, duration: 0.08 })
            .to(flash, { opacity: 0.45, duration: 0.03 }, "+=0.12")
            .to(flash, { opacity: 0, duration: 0.10 });
    }

    function validateElements() {
        // Removed heroVideo and heroAudio from strict checks since they are deprecated
        const required = [overlay, flash, video, header, editorial, heroImage, apertureContainer];
        return required.every(Boolean);
    }

    function setupInitialState() {
        body.classList.add("cinematic-lock", "cursor-hidden");

        shutterConfig.irisValue = 0; 
        if (window.Shutter && typeof window.Shutter.init === "function") {
            window.Shutter.init();
            window.Shutter.update(0.20);
        }

        // Start element muted to bypass aggressive browser autoplay blocks
        video.muted = true;
        video.currentTime = 0;

        // Pinhole State: Scale down the video inside the shutter mask boundaries
        gsap.set(video, { 
            opacity: 0.95,
            "--lens-blur": "18px",
            scale: 0.4,
            transformOrigin: "center center"
        });

        video.play().catch(err => console.warn("Autoplay block bypassed:", err.message));

        gsap.set(flash, { opacity: 0 });
        gsap.set(header, { opacity: 0, y: -20 });
        gsap.set(heroImage, { opacity: 0 });
        gsap.set(heroMask, { opacity: 0 });
        if (filmGrain) gsap.set(filmGrain, { opacity: 0 });
    }

    function showCursor() { body.classList.remove("cursor-hidden"); }

    function startEditorialScroll() {
        const editorialScroll = document.querySelector(".editorial-scroll");
        if (!editorialScroll) return;

        editorialUpdater = () => {
            const duration = video.duration || 1;
            const progress = (video.currentTime / duration) || 0;
            gsap.set(editorialScroll, {
                y: gsap.utils.interpolate(0, -900, progress)
            });
        };

        gsap.ticker.add(editorialUpdater);
    }

    function stopEditorialScroll() {
        if (!editorialUpdater) return;
        gsap.ticker.remove(editorialUpdater);
        editorialUpdater = null;
    }

    function handleBreakoutTransition() {
        // Try to unmute. If the browser blocks it, catch the error so the video keeps playing silently.
        video.muted = false;
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Browser blocked audio unmuting. Continuing silently until user interaction:", error);
                video.muted = true; // Fallback to muted so playback doesn't freeze
                
                // Optional: Listen for a click anywhere on the body to unmute safely later
                const unmuteOnInteraction = () => {
                    video.muted = false;
                    document.body.removeEventListener("click", unmuteOnInteraction);
                };
                document.body.addEventListener("click", unmuteOnInteraction);
            });
        }
        
        startEditorialScroll();

        // Monitor continuous runtime metrics for target exit events
        video.ontimeupdate = () => {
            if (video.currentTime >= 22) {
                video.ontimeupdate = null;
                video.pause();
                startHeroReveal();
            }
        };
    }

    function startHeroReveal() {
        gsap.timeline()
            .to(heroStill, { opacity: 1, duration: 0.15 })
            .call(triggerTripleFlash)
            .to(heroStill, { duration: 1, filter: "grayscale(100%) contrast(1.15) brightness(0.95) blur(0px)" })
            .call(() => { finishSequence(); })
            .to(heroStill, { duration: 4, filter: "grayscale(0%) contrast(1.05) brightness(1) blur(0px)" });
    }

    function playIntro() {
        const tl = gsap.timeline();

        tl.to({}, { duration: 1 });
        
        // Mechanical aperture opening sequence
        tl.to(shutterConfig, {
            irisValue: 1.04, 
            duration: 4.0,   
            ease: "power1.inOut",
            onUpdate: () => {
                if (window.Shutter && typeof window.Shutter.update === "function") {
                    window.Shutter.update(shutterConfig.irisValue);
                }
            }
        }, "<");

        // Expand the EXACT SAME video out to its full border bounds dynamically
        tl.to(video, { 
            scale: 1.1, 
            "--lens-blur": "0px", 
            duration: 4.0, 
            ease: "power1.inOut" 
        }, "<");
        
        // Single Flash Event
        tl.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: "none" }, "-=0.05")
          .to(flash, { opacity: 0, duration: 0.35, ease: "power2.out" });

        tl.add(() => { body.classList.remove("cursor-hidden"); }, "-=0.2");
        tl.add(() => { handleBreakoutTransition(); }, "-=0.15");
        
        // Remove introductory dark tracking panel from site viewport
        tl.to(overlay, {
            opacity: 0,
            duration: 1.0,
            ease: "power1.out",
            onComplete() { overlay.style.display = "none"; }
        }, "-=0.45");
    }

    function startFilmGrain() {
        if (!filmGrain) return;
        gsap.to(filmGrain, { backgroundPosition: "400px 300px", duration: 2, ease: "none", repeat: -1 });
    }

    function finishSequence() {
        stopEditorialScroll();

        const endTL = gsap.timeline({
            onComplete() {
                video.pause();
                showCursor();
                body.classList.remove("cinematic-lock");
                startFilmGrain();
            }
        });

        // Enqueue remaining elements seamlessly into the master structural timeline
        endTL.set(video, { opacity: 0 });

        if (soundToggle) {
            endTL.to(soundToggle, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                onComplete() { soundToggle.style.display = "none"; }
            }, "<");
        }

        endTL.to(editorial, { opacity: 0, duration: 2, ease: "power2.out" }, "<")
             .to(heroMask, { opacity: 1, duration: 2.5, ease: "power2.out" }, "<")
             .set(heroStill, { opacity: 1 }, "<");

        if (filmGrain) {
            endTL.to(filmGrain, { opacity: 0.08, duration: 1.5, ease: "power2.out" }, "<");
        }

        endTL.to(header, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }, "<+0.3")
             .to(".hero-title", { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" }, "<+0.2")
             .to(".scroll-indicator", { opacity: 1, duration: 1, ease: "power2.out" }, "<+0.3");

        endTL.add(() => {
            if (window.Hero) {
                setTimeout(() => {
                    if (window.Hero) window.Hero.reveal();
                }, 1000);
            }
        }, "-=0.5");
    }

    function start() {
        if (started) return;
        started = true;
        
        cacheElements();

        if (!validateElements()) {
            console.error("CinematicController: Missing required DOM elements.");
            return;
        }

        setupInitialState();
        playIntro();
    }

    return { start };
})();