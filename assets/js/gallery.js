document.addEventListener("DOMContentLoaded", () => {
    if (!document.querySelector(".gallery-section")) return;

    if (window.PaoreelGalleryEngine) {
        window.PaoreelGalleryEngine();
    }
});

window.revealGallery = function () {
    const overlay = document.querySelector(".gallery-overlay");
    if (!overlay) return;

    gsap.to(overlay, {
        opacity: 1,
        duration: 1.8,
        ease: "power2.out"
    });
};