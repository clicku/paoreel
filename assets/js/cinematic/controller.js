window.CinematicController = (() => {
    "use strict";

    let started = false;
    let editorialUpdater = null;
    let overlay,
    flash,
    video,
    heroVideo,
    heroStill,
    header,
    editorial,
    heroImage,
    filmGrain,
    body;
    let heroMask;
    let heroAudio;
    let soundToggle;
    let apertureContainer;

    // Local configuration proxy object for tracking real-time layout values
    const shutterConfig = { irisValue: 0 };

    function cacheElements() {
        body = document.body;
        overlay = document.querySelector(".cinematic-overlay");
        flash = document.querySelector(".cinematic-flash");
        flash = document.createElement("div");
        flash.className = "cinematic-flash";
        document.body.appendChild(flash);
        video=document.querySelector(".cinematic-video");
        heroVideo = document.querySelector(".hero-bts");
        heroStill = document.getElementById("hero-still");
        heroAudio = document.querySelector(".hero-audio");
        soundToggle = document.querySelector(".sound-toggle");
        header = document.querySelector(".site-header");
        editorial = document.querySelector(".editorial-overlay");
        heroImage = document.querySelector(".hero-image img");
        heroMask = document.querySelector(".hero-mask");
        filmGrain = document.querySelector(".film-grain");
        apertureContainer = document.querySelector(".cinematic-aperture");

        if (window.Shutter && typeof window.Shutter.init === "function") {
            window.Shutter.init();
        }
    }
    
    function triggerTripleFlash() {
         console.log("FLASH TRIGGERED");


    gsap.timeline()

        .to(flash,{
            opacity:0.85,
            duration:0.03
        })
        .to(flash,{
            opacity:0,
            duration:0.08
        })

        .to(flash,{
            opacity:0.65,
            duration:0.03
        }, "+=0.08")
        .to(flash,{
            opacity:0,
            duration:0.08
        })

        .to(flash,{
            opacity:0.45,
            duration:0.03
        }, "+=0.12")
        .to(flash,{
            opacity:0,
            duration:0.10
        });

}

    function validateElements() {
        const required = [overlay, flash, video, header, editorial, heroImage, apertureContainer];
        return required.every(Boolean);
    }

    /* ==========================================
       Initial States
    ========================================= */

    function setupInitialState() {
        body.classList.add("cinematic-lock");
        body.classList.add("cursor-hidden");

        shutterConfig.irisValue = 0; 
        
        if (window.Shutter && typeof window.Shutter.init === "function") {
            window.Shutter.init();
            window.Shutter.update(0.20);
        }

        // Force-mute to guarantee immediate browser playback
        video.muted = true;
        video.currentTime = 1;

        // Pinhole State: Video expands naturally without background mask interference
        gsap.set(video, { 
            opacity: 0.95,
            "--lens-blur": "18px",
            scale: 0.4,
            transformOrigin: "center center"
        });
                gsap.set(heroVideo,{
                opacity:0
            });

            gsap.to(heroVideo,{
                opacity:1,
                duration:0.9,
                ease:"power2.out"
            });

        heroVideo.pause();
        heroVideo.currentTime=0;
        heroVideo.muted=true;
        video.play().catch(err => {
            console.warn("Autoplay block bypassed, playback starting:", err.message);
        });

        gsap.set(flash, { opacity: 0 });
        gsap.set(header, { opacity: 0, y: -20 });
        gsap.set(heroImage, { opacity: 0 });
        gsap.set(heroMask,{ opacity:0 });
        if (filmGrain) gsap.set(filmGrain, { opacity: 0 });
    }

    function showCursor() { body.classList.remove("cursor-hidden"); }

    function startEditorialScroll() {
        const editorialScroll = document.querySelector(".editorial-scroll");
        if (!editorialScroll) return;

        editorialUpdater = () => {
            if (!video.duration) return;
            const progress = video.currentTime / video.duration;
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

    function playVideoFullScreen(){

    heroVideo.currentTime = video.currentTime;

    console.log(
        "handoff",
        "peek:", video.currentTime,
        "hero:", heroVideo.currentTime
    );

    heroVideo.play().catch(()=>{});

    if(heroAudio){

        heroAudio.currentTime = video.currentTime;

        heroAudio.volume = 1;

        heroAudio.play().catch(()=>{});

    }

}

    gsap.to(heroVideo,{

        opacity:1,

        duration:0.8,

        ease:"power2.out"

    });

    gsap.to(heroVideo,{

        "--lens-blur":"0px",

        duration:1.0

    });

    startEditorialScroll();

   heroVideo.ontimeupdate = () => {

    if (heroVideo.currentTime >= 22.2) {

        heroVideo.ontimeupdate = null;

        heroVideo.pause();

        startHeroReveal();

    }

};
    
   function startHeroReveal() {

    gsap.timeline()

        .to(heroStill,{
            opacity:1,
            duration:0.15
        })

        .call(triggerTripleFlash)

        .to(heroStill,{
            duration:1,
            filter:"grayscale(100%) contrast(1.15) brightness(0.95) blur(0px)"
        })

        .call(() => {

            finishSequence();

        })

        .to(heroStill,{
            duration:4,
            filter:"grayscale(0%) contrast(1.05) brightness(1) blur(0px)"
        });

}

}

    /* ==========================================
       Intro Timeline
    ========================================== */

    function playIntro() {
        const tl = gsap.timeline();

        tl.to({}, { duration: 1 });

        // Slow mechanical opening of the blades (0.0s -> 4.0s)
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

        // Slowly maximize scale of the video matching the opening blades
        tl.to(video, {
            scale: 1.1,
            duration: 4.0,
            ease: "power1.inOut"
        }, "<");
       

        // The Flash Event
        tl.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: "none" }, "-=0.05")
          .to(flash, { opacity: 0, duration: 0.35, ease: "power2.out" });

          tl.add(()=>{

    body.classList.remove("cursor-hidden");

},"-=0.2");
        // BREAKOUT
        tl.add(() => {

    playVideoFullScreen();

}, "-=0.15");
        
        // Fade out the camera aperture interface and dark overlay
      tl.to(overlay,{
    opacity:0,
    duration:1.0,
    ease:"power1.out",
    onComplete(){
        overlay.style.display="none";
    }
},"-=0.45");
    }

    /* ==========================================
       Ending Sequence
    ========================================== */

    function startFilmGrain() {
        if (!filmGrain) return;
        gsap.to(filmGrain, { backgroundPosition: "400px 300px", duration: 2, ease: "none", repeat: -1 });
    }

    function finishSequence(){

    stopEditorialScroll();

    const endTL = gsap.timeline({

        onComplete(){

            if(heroAudio){

                heroAudio.pause();
                heroAudio.currentTime = 0;
                heroAudio.volume = 1;

            }

            heroVideo.pause();

            showCursor();

            document.body.classList.remove("cinematic-lock");

            startFilmGrain();

        }

    });

    // Fade out both video and audio together
  gsap.set(heroVideo,{
    opacity:0
});

if(heroAudio){

    endTL.to(heroAudio,{

        volume:0,

        duration:1.5,

        ease:"power2.out"

    },"<");

}

if(soundToggle){

    endTL.to(soundToggle,{

        opacity:0,

        duration:0.8,

        ease:"power2.out",

        onComplete(){

            soundToggle.style.display = "none";

        }

    },"<");

}

    // Continue with the rest of your existing timeline...
    /* ------------------------------------------
       Editorial fades away
    ------------------------------------------ */

    /* ------------------------------------------
   V5 Editorial Transition
------------------------------------------ */

endTL.to(editorial,{
    opacity:0,
    duration:2,
    ease:"power2.out"
},"<");

/* ------------------------------------------
   Hero mask starts immediately
------------------------------------------ */

endTL.to(heroMask,{
    opacity:1,
    duration:2.5,
    ease:"power2.out"
},"<");

/* ------------------------------------------
   Keep hero still visible
------------------------------------------ */

endTL.set(heroStill,{
    opacity:1
},"<");

/* ------------------------------------------
   Film grain
------------------------------------------ */

if(filmGrain){

    endTL.to(filmGrain,{

        opacity:0.08,

        duration:1.5,

        ease:"power2.out"

    },"<");

}

/* ------------------------------------------
   Header / Logo
------------------------------------------ */

endTL.to(header,{
    opacity:1,
    y:0,
    duration:1.2,
    ease:"power2.out"
},"<+0.3");

/* ------------------------------------------
   Hero title
------------------------------------------ */

endTL.to(".hero-title",{
    opacity:1,
    y:0,
    duration:1.4,
    ease:"power2.out"
},"<+0.2");

/* ------------------------------------------
   Scroll indicator
------------------------------------------ */

endTL.to(".scroll-indicator",{
    opacity:1,
    duration:1,
    ease:"power2.out"
},"<+0.3");

    /* ------------------------------------------
       Hero title + Scroll indicator
    ------------------------------------------ */

    endTL.add(()=>{

        if(window.Hero){

            window.Hero.reveal();

        }

    },"-=0.5");

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