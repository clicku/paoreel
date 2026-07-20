window.CinematicController = (() => {
    "use strict";

    let started = false;
    let editorialUpdater = null;
    let overlay, flash, video, heroVideo, heroStill, header, editorial, heroImage, filmGrain, body;
    let heroMask, heroAudio, soundToggle, apertureContainer;

    const shutterConfig = { irisValue: 0 };

    function cacheElements() {
        body = document.body;
        overlay = document.querySelector(".cinematic-overlay");

        // Flash Overlay Setup (Safely recreate to avoid leaks/stale references)
        const oldFlash = document.querySelector(".cinematic-flash");
        if (oldFlash) oldFlash.remove();

        flash = document.createElement("div");
        flash.className = "cinematic-flash";
        body.appendChild(flash);

        // Media Elements (Always fetch fresh queries to prevent cache mismatches)
        video = document.querySelector(".cinematic-video");
        heroVideo = document.querySelector(".hero-bts");
        heroStill = document.getElementById("hero-still");
        heroAudio = document.querySelector(".hero-audio");

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
        if (!flash) return;
        gsap.timeline()
            .to(flash, { opacity: 0.85, duration: 0.03 })
            .to(flash, { opacity: 0, duration: 0.08 })
            .to(flash, { opacity: 0.65, duration: 0.03 }, "+=0.08")
            .to(flash, { opacity: 0, duration: 0.08 })
            .to(flash, { opacity: 0.45, duration: 0.03 }, "+=0.12")
            .to(flash, { opacity: 0, duration: 0.10 });
    }

    function validateElements() {
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

        if (video) {
            video.muted = true;
            video.currentTime = 1;
            gsap.set(video, { 
                opacity: 0.95,
                "--lens-blur": "18px",
                scale: 0.4,
                transformOrigin: "center center"
            });
            video.play().catch(err => console.warn("Autoplay block bypassed:", err.message));
        }

        if (heroVideo) {gsap.set(heroVideo,{
        opacity:0,
        "--lens-blur":"0px",
        scale:1
            });

            heroVideo.pause();
            heroVideo.currentTime = 0;
            heroVideo.muted = true;
            heroVideo.preload = "auto";

        }

        if (flash) gsap.set(flash, { opacity: 0 });
        if (header) gsap.set(header, { opacity: 0, y: -20 });
        if (heroImage) gsap.set(heroImage, { opacity: 0 });
        if (heroMask) gsap.set(heroMask, { opacity: 0 });
        if (filmGrain) gsap.set(filmGrain, { opacity: 0 });
    }

    function showCursor() { body.classList.remove("cursor-hidden"); }

    function startEditorialScroll() {
        const editorialScroll = document.querySelector(".editorial-scroll");
        if (!editorialScroll || !heroVideo) return;

        editorialUpdater = () => {
            const duration = heroVideo.duration || 1;
            const progress = (heroVideo.currentTime / duration) || 0;
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

    function playVideoFullScreen() {

    if (!heroVideo) return;
    gsap.to(heroVideo,{
    opacity:1,
    duration:0.6,
    ease:"power2.out"
});

    heroVideo.currentTime = 0;

    heroVideo.play()
        .then(() => {

            startEditorialScroll();

        })
        .catch(err => {

            console.warn(
                "Hero video play failed:",
                err
            );

        });

    if (heroAudio) {

        heroAudio.currentTime = 0;

        heroAudio.volume = 1;

        heroAudio.play().catch(err => {

            console.warn(
                "Hero audio play failed:",
                err
            );

        });

    }

    heroVideo.ontimeupdate = () => {

        const revealPoint =
            Math.max(
                0,
                heroVideo.duration - 0.8
            );

        if (heroVideo.currentTime >= revealPoint) {

            heroVideo.ontimeupdate = null;

            heroVideo.pause();

            startHeroReveal();

        }

    };

}

    function startHeroReveal() {
        if (!heroStill) return;
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

        if (video) {
            tl.to(video, { scale: 1.1, duration: 4.0, ease: "power1.inOut" }, "<");
        }
        
        if (flash) {
            tl.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: "none" }, "-=0.05")
              .to(flash, { opacity: 0, duration: 0.35, ease: "power2.out" });
        }

        tl.add(() => { body.classList.remove("cursor-hidden"); }, "-=0.2");
        tl.add(() => { playVideoFullScreen(); }, "-=0.15");
        
        if (overlay) {
            tl.to(overlay, {
                opacity: 0,
                duration: 1.0,
                ease: "power1.out",
                onComplete() { overlay.style.display = "none"; }
            }, "-=0.45");
        }
    }

    function startFilmGrain() {
        if (!filmGrain) return;
        gsap.to(filmGrain, { backgroundPosition: "400px 300px", duration: 2, ease: "none", repeat: -1 });
    }

    function finishSequence() {
        stopEditorialScroll();

        const endTL = gsap.timeline({
            onComplete() {
                if (heroAudio) {
                    heroAudio.pause();
                    heroAudio.currentTime = 0;
                    heroAudio.volume = 1;
                }
                if (heroVideo) heroVideo.pause();
                showCursor();
                body.classList.remove("cinematic-lock");
                startFilmGrain();
            }
        });

        if (heroVideo) endTL.set(heroVideo, { opacity: 0 });

        if (heroAudio) {
            endTL.to(heroAudio, { volume: 0, duration: 1.5, ease: "power2.out" }, "<");
        }

        if (soundToggle) {
            endTL.to(soundToggle, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                onComplete() { soundToggle.style.display = "none"; }
            }, "<");
        }

        if (editorial) endTL.to(editorial, { opacity: 0, duration: 2, ease: "power2.out" }, "<");
        if (heroMask) endTL.to(heroMask, { opacity: 1, duration: 2.5, ease: "power2.out" }, "<");
        if (heroStill) endTL.set(heroStill, { opacity: 1 }, "<");

        if (filmGrain) {
            endTL.to(filmGrain, { opacity: 0.08, duration: 1.5, ease: "power2.out" }, "<");
        }

        if (header) endTL.to(header, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }, "<+0.3");
        endTL.to(".hero-title", { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" }, "<+0.2")
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
        // Safe resets for hot-caching conditions
        if (started) {
            stopEditorialScroll();
            started = false;
        }
        
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