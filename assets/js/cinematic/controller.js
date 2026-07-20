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

        // Flash Overlay Setup (Safely recreate to avoid leaks)
        const oldFlash = document.querySelector(".cinematic-flash");
        if (oldFlash) oldFlash.remove();

        flash = document.createElement("div");
        flash.className = "cinematic-flash";
        body.appendChild(flash);

        // Media Elements
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
    
    function waitForHeroVideo(callback) {
        if (heroVideo.readyState >= 4) {
            callback();
            return;
        }
        heroVideo.addEventListener("canplaythrough", callback, { once: true });
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
        const required = [overlay, flash, video, header, editorial, heroImage, apertureContainer];
        return required.every(Boolean);
    }

    function setupInitialState() {
        window.__heroVideoRef = heroVideo;
        body.classList.add("cinematic-lock", "cursor-hidden");

        shutterConfig.irisValue = 0; 
        if (window.Shutter && typeof window.Shutter.init === "function") {
            window.Shutter.init();
            window.Shutter.update(0.20);
        }

        video.muted = true;
        video.currentTime = 1;

        gsap.set(video, { 
            opacity: 0.95,
            "--lens-blur": "18px",
            scale: 0.4,
            transformOrigin: "center center"
        });

        gsap.set(heroVideo, { opacity: 1, "--lens-blur": "0px", scale: 1 });
        gsap.to(heroVideo, { opacity: 1, duration: 0.9, ease: "power2.out" });

        heroVideo.pause();
        heroVideo.currentTime = 0;
        heroVideo.muted = true;
        heroVideo.preload = "auto";
        
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
    waitForHeroVideo(() => {
        // Fallback to 5.0 seconds if the video hasn't progressed past 1 second yet due to caching
        let targetTime = video.currentTime;
        if (targetTime < 1.0) {
            console.log("Cache race condition detected. Forcing targetTime to 5.0s baseline.");
            targetTime = 5.0; 
        }

        const trySeek = () => {
            if (heroVideo.readyState < 2) {
                heroVideo.addEventListener("loadeddata", trySeek, { once: true });
                return;
            }

            console.log("Seeking heroVideo to safely calculated target:", targetTime);
            heroVideo.currentTime = targetTime;
            
            heroVideo.addEventListener("seeked", () => {
                heroVideo.play().catch(err => console.warn("Hero video play failed:", err));
            }, { once: true });
        };

        trySeek();
    });

    if (heroAudio) {
        // Apply the same safe baseline logic to the audio synchronization track
        let targetAudioTime = video.currentTime;
        if (targetAudioTime < 1.0) targetAudioTime = 5.0;

        heroAudio.currentTime = targetAudioTime;
        heroAudio.volume = 1;
        heroAudio.play().catch(err => console.warn("Hero audio play failed:", err));
    }

    startEditorialScroll();

    heroVideo.ontimeupdate = () => {
        if (heroVideo.currentTime >= 22) {
            heroVideo.ontimeupdate = null;
            heroVideo.pause();
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

        tl.to(video, { scale: 1.1, duration: 4.0, ease: "power1.inOut" }, "<");
        
        tl.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: "none" }, "-=0.05")
          .to(flash, { opacity: 0, duration: 0.35, ease: "power2.out" });

        tl.add(() => { body.classList.remove("cursor-hidden"); }, "-=0.2");
        tl.add(() => { playVideoFullScreen(); }, "-=0.15");
        
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
                if (heroAudio) {
                    heroAudio.pause();
                    heroAudio.currentTime = 0;
                    heroAudio.volume = 1;
                }
                heroVideo.pause();
                showCursor();
                body.classList.remove("cinematic-lock");
                startFilmGrain();
            }
        });

        // Enqueue everything smoothly into the structural timeline
        endTL.set(heroVideo, { opacity: 0 });

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