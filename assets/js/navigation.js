/* ==========================================================
   PAOREEL STUDIOS V3
   NAVIGATION
   ========================================================== */

const mobileToggle = document.querySelector(".mobile-toggle");

const navLinks = document.querySelector(".nav-links");

if (mobileToggle && navLinks) {

    mobileToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        mobileToggle.textContent =
            navLinks.classList.contains("active")
                ? "✕"
                : "☰";

    });

}
document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        mobileToggle.textContent = "☰";

    });

});
const header = document.getElementById("main-header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});