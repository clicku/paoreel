/*
==========================================
PAOREEL STUDIOS

V4 HERO CINEMATIC ENGINE

VIDEO MODULE
==========================================
*/

window.CinematicVideo = (() => {

    let video = null;

    function init() {

        video = document.querySelector(".hero-bts");
        console.log("Video element:", video);

if (video) {

    console.log("Video source:", video.currentSrc);

    video.addEventListener("loadedmetadata", () => {

        console.log("Video metadata loaded");

        console.log("Duration:", video.duration);

    });

    video.addEventListener("canplay", () => {

        console.log("Video can play");

    });

    video.addEventListener("play", () => {

        console.log("Video started");

    });

}

        if (!video) {

            console.warn("Hero BTS video not found.");

            return;

        }

        /* -------------------------------
           Initial State
        ------------------------------- */

        video.pause();

        video.currentTime = 0;

    }

    function play() {

        if (!video) return;

        video.pause();

        video.currentTime = 0;

        const playPromise = video.play();

        if (playPromise !== undefined) {

            playPromise.catch(error => {

                console.error("Video playback failed:", error);

            });

        }

    }

    function onEnded(callback) {

        if (!video) return;

        video.onended = callback;

    }

    function element() {

        return video;

    }

    return {

        init,

        play,

        onEnded,

        element

    };

})();