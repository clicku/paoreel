/**
 * gallery-intro.js
 * Paoreel Studios - Intro Text & Kinetic Typography Only
 */

(function () {
  function initGalleryIntro() {
    if (typeof gsap === "undefined") return;

    const titleSpans = Array.from(document.querySelectorAll(".gallery-title .word span"));
    const copyText = document.querySelector(".gallery-copy");

    if (titleSpans.length === 0) return;

    // Set clean initial entry text visibility
    gsap.set(titleSpans, { opacity: 1, y: 0 });
    if (copyText) {
      gsap.set(copyText, { opacity: 1, y: 0 });
    }
  }

  window.initGalleryIntroEngine = initGalleryIntro;

  if (document.readyState === "interactive" || document.readyState === "complete") {
    initGalleryIntro();
  } else {
    document.addEventListener("DOMContentLoaded", initGalleryIntro);
  }
})();