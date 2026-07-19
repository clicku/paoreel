window.CinematicController = (() => {
    "use strict";

    let started = false;
    let videoTransitionStarted = false;
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

    /* ------------------------------------------
       Flash Overlay
    ------------------------------------------ */

    /* ------------------------------------------
   Flash Overlay
------------------------------------------ */

// Always create fresh flash layer

const oldFlash = document.querySelector(".cinematic-flash");

if (oldFlash) {
    oldFlash.remove();
}

flash = document.createElement("div");

flash.className = "cinematic-flash";

document.body.appendChild(flash);

console.log(
    "NEW FLASH ELEMENT",
    flash
);

    /* ------------------------------------------
       Video Elements
    ------------------------------------------ */

    video = document.querySelector(".cinematic-video");

    heroVideo = document.querySelector(".hero-bts");
    heroVideo.addEventListener("loadedmetadata",()=>{

        console.log(
            "Hero metadata position:",
            heroVideo.currentTime
        );

    });


    console.log(
        "HERO VIDEO ELEMENT",
        heroVideo
    );
    heroVideo.autoplay = false;
    heroVideo.controls = false;
    heroVideo.removeAttribute("autoplay");
    heroStill = document.getElementById("hero-still");

    heroAudio = document.querySelector(".hero-audio");

    /* ------------------------------------------
       UI Elements
    ------------------------------------------ */

    soundToggle = document.querySelector(".sound-toggle");

    header = document.querySelector(".site-header");

    editorial = document.querySelector(".editorial-overlay");

    heroImage = document.querySelector(".hero-image img");

    heroMask = document.querySelector(".hero-mask");

    filmGrain = document.querySelector(".film-grain");

    apertureContainer = document.querySelector(".cinematic-aperture");

    /* ------------------------------------------
       Shutter
    ------------------------------------------ */

    if (
        window.Shutter &&
        typeof window.Shutter.init === "function"
    ) {

        window.Shutter.init();

    }

}
    
    function waitForHeroVideo(callback){

    console.log(
        "WAITING READY STATE:",
        heroVideo.readyState
    );

    if(heroVideo.readyState >= 4){

        console.log(
            "VIDEO ALREADY READY"
        );

        callback();
        return;

    }

    heroVideo.addEventListener(
        "canplaythrough",
        () => {

            console.log(
                "VIDEO READY NOW:",
                heroVideo.readyState
            );

            callback();

        },
        { once:true }
    );

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
        window.__heroVideoRef = heroVideo;

console.log(
    "HERO VIDEO ELEMENT",
    heroVideo
);
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
    opacity:1,
    "--lens-blur":"0px",
    scale:1
});

            gsap.to(heroVideo,{
                opacity:1,
                duration:0.9,
                ease:"power2.out"
            });

        heroVideo.pause();

heroVideo.removeAttribute("src");
heroVideo.load();

heroVideo.muted = true;
heroVideo.preload = "auto";

console.log(
    "Hero preload started",
    heroVideo.readyState
);
heroVideo.addEventListener("loadedmetadata", () => {

    console.log(
        "loadedmetadata",
        heroVideo.readyState,
        heroVideo.duration
    );

});

heroVideo.addEventListener("canplay", () => {

    console.log(
        "canplay",
        heroVideo.readyState
    );

});

heroVideo.addEventListener("canplaythrough", () => {

    console.log(
        "canplaythrough",
        heroVideo.readyState
    );

});
        
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

        if (!heroVideo.duration) return;


        const progress =
            heroVideo.currentTime / heroVideo.duration;


        gsap.set(editorialScroll, {

            y: gsap.utils.interpolate(
                0,
                -900,
                progress
            )

        });

    };


    gsap.ticker.add(editorialUpdater);

    console.log(
        "Editorial scroll started using hero video"
    );

}

    function stopEditorialScroll() {
        if (!editorialUpdater) return;
        gsap.ticker.remove(editorialUpdater);
        editorialUpdater = null;
    }

  function playVideoFullScreen(){

    console.log(
        "WAIT START",
        heroVideo.readyState,
        heroVideo.networkState
    );


    const targetTime = video.currentTime;


    const trySeek = () => {

        console.log(
            "TRY SEEK",
            "readyState:",
            heroVideo.readyState,
            "current:",
            heroVideo.currentTime,
            "target:",
            targetTime
        );


        heroVideo.currentTime = targetTime;


        console.log(
            "AFTER SEEK SET",
            heroVideo.currentTime
        );


        heroVideo.addEventListener("seeked",()=>{

            console.log(
                "SEEK SUCCESS",
                heroVideo.currentTime
            );


            heroVideo.play()
            .then(()=>{

                console.log(
                    "HERO VIDEO PLAYING"
                );

                startEditorialScroll();

            })
            .catch(err=>{

                console.warn(
                    "Hero video play failed:",
                    err
                );

            });


        },{once:true});

    };


    waitForHeroVideo(()=>{

        trySeek();

    });

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

            setTimeout(() => {

    if(window.Hero){
        window.Hero.reveal();
    }

}, 1000);

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