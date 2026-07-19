/* ==========================================================
   PAOREEL STUDIOS
   APPLICATION ENTRY
========================================================== */


// Prevent browser from restoring previous scroll position

if ("scrollRestoration" in history) {

    history.scrollRestoration = "manual";

}


window.addEventListener("DOMContentLoaded", () => {


    // Force page start at top before cinematic begins

    window.scrollTo(0,0);


    console.log("Application Loaded");


    if (window.Hero) {

        Hero.init();

    } else {

        console.error("Hero not found.");

    }


    if (window.CinematicController) {

        CinematicController.start();

    } else {

        console.error("CinematicController not found.");

    }


});