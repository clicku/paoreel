window.CinematicController = (() => {
    "use strict";

    let started = false;
    let editorialUpdater = null;
    let overlay, flash, video, heroVideo, heroStill, header, editorial, heroImage, filmGrain, body;
    let heroMask, heroBg, heroAudio, soundToggle, apertureContainer, lensMask;

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
        heroBg = document.querySelector(".hero-bg");
        filmGrain = document.querySelector(".film-grain");
        apertureContainer = document.querySelector(".cinematic-aperture");
        lensMask = document.querySelector(".cinematic-lens-mask");

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

    body.classList.add(
        "cinematic-lock",
        "cursor-hidden"
    );

    shutterConfig.irisValue = 0;

    if (
        window.Shutter &&
        typeof window.Shutter.init === "function"
    ) {
        window.Shutter.init();
        window.Shutter.update(0.20);
    }

    // Hero Perspective Setup
    const heroParallax =
        document.querySelector(".hero-parallax");

    if (heroParallax) {

        gsap.set(heroParallax, {
            transformPerspective: 1200,
            transformStyle: "preserve-3d"
        });

    }

    // Background Depth Layer
    if (heroBg) {

        gsap.set(heroBg, {
            opacity: 0,
            scale: 1.25,
            transformOrigin: "center center"
        });

        heroBg.pause();
        heroBg.currentTime = 0;
        heroBg.muted = true;
        heroBg.preload = "auto";
        heroBg.load();

    }

    // Intro Lens Video
    if (video) {

        video.muted = true;
        video.currentTime = 1;

        gsap.set(video, {
            opacity: 0.95,
            "--lens-blur": "18px",
            scale: 0.4,
            filter: "blur(8px)",
            transformOrigin: "center center"
        });

        video.play().catch(err =>
            console.warn(
                "Autoplay block bypassed:",
                err.message
            )
        );

        video.ontimeupdate = () => {

            const handoffPoint =
                video.duration - 0.80;

            if (
                video.currentTime >=
                handoffPoint
            ) {

                video.ontimeupdate = null;

                playVideoFullScreen();

            }

        };

    }

    // Main Hero Video
    if (heroVideo) {

        gsap.set(heroVideo, {
            opacity: 0,
            "--lens-blur": "0px",
            scale: 1,
            transformOrigin:
                "center center"
        });

        heroVideo.pause();
        heroVideo.currentTime = 0;
        heroVideo.muted = true;
        heroVideo.preload = "auto";
        heroVideo.load();

    }

    if (flash)
        gsap.set(flash, { opacity: 0 });

    if (header)
        gsap.set(header, {
            opacity: 0,
            y: -20
        });

    if (heroImage)
        gsap.set(heroImage, {
            opacity: 0
        });

    if (heroMask)
        gsap.set(heroMask, {
            opacity: 0
        });

    if (filmGrain)
        gsap.set(filmGrain, {
            opacity: 0
        });

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

    heroVideo.currentTime = 0;

    if (heroBg) {

        heroBg.currentTime = 0;

    }

    const startMainVideo = () => {

        if (heroBg) {

            heroBg.play().catch(() => {});

        }

        heroVideo.play()
            .then(() => {

                gsap.set(heroVideo, {
                    opacity: 1
                });

                if (heroBg) {

                    gsap.to(heroBg, {
                        opacity: 0.35,
                        duration: 1
                    });

                    gsap.fromTo(
                        heroBg,
                        {
                            scale: 1.25
                        },
                        {
                            scale: 1.35,
                            duration: heroVideo.duration || 9,
                            ease: "none"
                        }
                    );

                }

                gsap.fromTo(
                    heroVideo,
                    {
                        scale: 1.00
                    },
                    {
                        scale: 1.08,
                        duration: heroVideo.duration || 9,
                        ease: "none"
                    }
                );

                const heroParallax =
                    document.querySelector(".hero-parallax");

                if (heroParallax) {

                    gsap.to(heroParallax, {

                        rotationX: 1,

                        duration:
                            heroVideo.duration || 9,

                        ease: "none"

                    });

                }

                startEditorialScroll();

                requestAnimationFrame(() => {

                    if (overlay) {

                        overlay.style.display =
                            "none";

                    }

                });

            })
            .catch(err => {

                console.warn(
                    "Hero video play failed:",
                    err
                );

            });

    };

    if (heroVideo.readyState >= 2) {

        startMainVideo();

    } else {

        heroVideo.addEventListener(
            "canplay",
            startMainVideo,
            { once: true }
        );

    }

    heroVideo.ontimeupdate = () => {

        const revealPoint = 8.75;

        if (
            heroVideo.currentTime >=
            revealPoint
        ) {

            heroVideo.ontimeupdate = null;

            if (heroBg) {

                heroBg.pause();

            }

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
    irisValue: 1.20,
    duration: 5.0,
    ease: "sine.inOut",
    onUpdate: () => {
        if (window.Shutter && typeof window.Shutter.update === "function") {
            window.Shutter.update(shutterConfig.irisValue);
        }
    }
}, "<");

        if (video) {

    tl.to(video, {

        scale: 1.1,
        filter: "blur(0px)",

        duration: 4.0,

        ease: "power1.inOut"

    }, "<");

}
        
        if (flash) {
            tl.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: "none" }, "-=0.05")
              .to(flash, { opacity: 0, duration: 0.35, ease: "power2.out" });
        }

        tl.add(() => { body.classList.remove("cursor-hidden"); }, "-=0.2");
        
               
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

    if (heroVideo) {
        endTL.set(heroVideo, {
            opacity: 0
        });
    }
    if (heroBg) {

    heroBg.pause();

    gsap.set(heroBg, {
        opacity: 0
    });

}
    if (heroAudio) {
        endTL.to(heroAudio, {
            volume: 0,
            duration: 1.5,
            ease: "power2.out"
        }, "<");
    }

    if (soundToggle) {
        endTL.to(soundToggle, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete() {
                soundToggle.style.display = "none";
            }
        }, "<");
    }

    if (editorial) {
        endTL.to(editorial, {
            opacity: 0,
            duration: 2,
            ease: "power2.out"
        }, "<");
    }

    if (heroMask) {
        endTL.to(heroMask, {
            opacity: 1,
            duration: 2.5,
            ease: "power2.out"
        }, "<");
    }

    if (heroStill) {
        endTL.set(heroStill, {
            opacity: 1
        }, "<");
    }

    if (filmGrain) {
        endTL.to(filmGrain, {
            opacity: 0.08,
            duration: 1.5,
            ease: "power2.out"
        }, "<");
    }

    /* HEADER ONLY */

    if (header) {
        endTL.to(header, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out"
        }, "<+0.3");
    }

    /* HAND OFF TO HERO.JS */

    endTL.add(() => {

    if (window.Hero) {
        window.Hero.reveal();
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

    gsap.to("#lens-reflection", {
        x: 1,
        y: -0.5,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
    });
    gsap.to(video, {
    scale: 1.03,
    duration: 5,
    ease: "sine.inOut"
});

    playIntro();
}

    return { start };
})();