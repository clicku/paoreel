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

        const oldFlash = document.querySelector(".cinematic-flash");
        if (oldFlash) oldFlash.remove();

        flash = document.createElement("div");
        flash.className = "cinematic-flash";
        body.appendChild(flash);

        video = document.querySelector(".cinematic-video");
        heroVideo = document.querySelector(".hero-bts");
        heroStill = document.getElementById("hero-still");
        heroAudio = document.querySelector(".hero-audio");

        soundToggle = document.querySelector(".sound-toggle");
        header = document.querySelector(".site-header");
        editorial = document.querySelector(".editorial-overlay");
        heroImage = document.querySelector(".hero-image img");
        heroMask = document.querySelector(".hero-mask");
        heroBg = document.querySelector(".hero-bg");
        filmGrain = document.querySelector(".film-grain");
        apertureContainer = document.querySelector(".cinematic-aperture");
        lensMask = document.querySelector(".cinematic-lens-mask");

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
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        shutterConfig.irisValue = 0;

        if (window.Shutter && typeof window.Shutter.init === "function") {
            window.Shutter.init();
            window.Shutter.update(0.20);
        }

        if (heroBg) {
            gsap.set(heroBg, {
                opacity: 0,
                scale: 1.35,
                transform: "none",
                transformOrigin: "center center",
                force3D: true,
                willChange: "transform, opacity"
            });

            heroBg.pause();
            heroBg.currentTime = 0;
            heroBg.muted = true;
            heroBg.preload = "auto";
            heroBg.load();
        }

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
                console.warn("Autoplay block bypassed:", err.message)
            );

            video.ontimeupdate = () => {
                const handoffPoint = video.duration - 0.80;
                if (video.currentTime >= handoffPoint) {
                    video.ontimeupdate = null;
                    playVideoFullScreen();
                }
            };
        }

        if (heroVideo) {
            gsap.set(heroVideo, {
                opacity: 0,
                "--lens-blur": "0px",
                scale: 1,
                transformOrigin: "center center"
            });
            heroVideo.pause();
            heroVideo.currentTime = 0;
            heroVideo.muted = true;
            heroVideo.preload = "auto";
            heroVideo.load();
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
        heroVideo.currentTime = 0;
        if (heroBg) heroBg.currentTime = 0;

        const startMainVideo = () => {
            if (heroBg) heroBg.play().catch(() => {});

            heroVideo.play()
                .then(() => {
                    gsap.set(heroVideo, { opacity: 1 });

                    if (heroBg) {
                        gsap.to(heroBg, { opacity: 0.35, duration: 1 });
                        gsap.fromTo(heroBg, { scale: 1.35 }, {
                            scale: 1.35,
                            duration: heroVideo.duration || 9,
                            ease: "none"
                        });
                    }

                    gsap.fromTo(heroVideo, { scale: 1.00 }, {
                        scale: 1.08,
                        duration: heroVideo.duration || 9,
                        ease: "none"
                    });

                    startEditorialScroll();

                    requestAnimationFrame(() => {
                        if (overlay) overlay.style.display = "none";
                    });
                })
                .catch(err => {
                    console.warn("Hero video play failed:", err);
                });
        };

        if (heroVideo.readyState >= 2) {
            startMainVideo();
        } else {
            heroVideo.addEventListener("canplay", startMainVideo, { once: true });
        }

        heroVideo.ontimeupdate = () => {
            const revealPoint = 8.75;
            if (heroVideo.currentTime >= revealPoint) {
                heroVideo.ontimeupdate = null;
                startHeroReveal();
            }
        };
    }

    function startHeroReveal() {
        if (!heroStill) {
            heroStill = document.getElementById("hero-still");
        }

        const layerFg = document.getElementById("layer-fg");

        if (!heroStill) {
            console.warn("CinematicController: #hero-still not found, forcing finishSequence.");
            finishSequence();
            return;
        }

        gsap.set(heroStill, {
            opacity: 1,
            zIndex: 30,
            scale: 1,
            transformOrigin: "center center"
        });

        if (heroVideo) {
            gsap.set(heroVideo, { opacity: 0 });
            heroVideo.pause();
        }
        if (heroBg) {
            heroBg.pause();
        }

        const tl = gsap.timeline();

        tl.call(triggerTripleFlash);

        if (layerFg) {
            gsap.set(layerFg, { opacity: 0, scale: 1 });
        }

        tl.call(() => { finishSequence(); });

        if (layerFg) {
            tl.to(layerFg, { opacity: 1, duration: 0.5 }, "<")
              .to(heroStill, { opacity: 0, duration: 1 }, "-=0.5");
        }
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

                // Unlock scrolling viewport bounds
              
                document.documentElement.style.overflowY = "auto";
                document.body.style.overflowY = "auto";
            }
        });
        if (heroVideo) {
        endTL.set(heroVideo, {
            opacity: 0
        });
    }
        if (heroBg) {
            heroBg.pause();
            endTL.set(heroBg, { 
                opacity: 0.35, 
                scale: 1.35,
                force3D: true,
                rotation: 0.01
            });
        }

        endTL.add(() => {
            if (window.Parallax25D && typeof window.Parallax25D.init === "function") {
                window.Parallax25D.init();
            }
        }, "<");

        if (heroAudio) {
            endTL.to(heroAudio, { volume: 0, duration: 1.5, ease: "power2.out" }, "<");
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
            endTL.to(editorial, { opacity: 0, duration: 2, ease: "power2.out" }, "<");
        }

        if (heroMask) {
            endTL.to(heroMask, { opacity: 1, duration: 2.5, ease: "power2.out" }, "<");
        }

        if (filmGrain) {
            endTL.to(filmGrain, { opacity: 0.08, duration: 1.5, ease: "power2.out" }, "<");
        }

        if (header) {
            endTL.to(header, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }, "<+0.3");
        }

        endTL.add(() => {
            if (window.Hero && typeof window.Hero.reveal === "function") {
                window.Hero.reveal();
            }
        });
    }

    function start() {
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