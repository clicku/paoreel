/* ==========================================================
   PAOREEL STUDIOS
   APPLICATION ENTRY
========================================================== */

window.addEventListener("load", () => {

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