/* ==========================================================
   PAOREEL STUDIOS V3
   NAVIGATION
========================================================== */

const mobileToggle = document.querySelector(".mobile-toggle");
const navLinks = document.querySelector(".nav-links");
const siteHeader = document.querySelector(".site-header");
const hero = document.querySelector(".hero");

/* ==========================================================
   MOBILE MENU TOGGLE
========================================================== */

if (mobileToggle && navLinks) {

    mobileToggle.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("active");

        mobileToggle.textContent = isOpen ? "✕" : "☰";

    });

}

/* ==========================================================
   CLOSE MENU WHEN LINK IS CLICKED
========================================================== */

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        mobileToggle.textContent = "☰";

    });

});

/* ==========================================================
   AUTO CLOSE MENU ON SCROLL
========================================================== */

window.addEventListener("scroll", () => {

    if (!navLinks.classList.contains("active")) return;

    navLinks.classList.remove("active");

    mobileToggle.textContent = "☰";

});

/* ==========================================================
   HERO HEADER VISIBILITY
========================================================== */

if (siteHeader && hero) {

    const observer = new IntersectionObserver(

        (entries) => {

            const heroVisible = entries[0].isIntersecting;

            siteHeader.classList.toggle("scrolled", !heroVisible);

        },

        {
            threshold: 0.15
        }

    );

    observer.observe(hero);

}