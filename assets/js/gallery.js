/* ==========================================================
   PAOREEL STUDIOS V3
   GALLERY INITIALIZER
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (!document.querySelector(".gallery-section")) return;

    if (window.PaoreelGalleryEngine) {

        window.PaoreelGalleryEngine();

    }

});