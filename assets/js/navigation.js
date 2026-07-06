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

/* ==========================================================
   HERO HEADER VISIBILITY
========================================================== */

const siteHeader = document.querySelector(".site-header");
const hero = document.querySelector(".hero");

if (siteHeader && hero) {

    const observer = new IntersectionObserver(

        (entries) => {

            const entry = entries[0];

            if (entry.isIntersecting) {

                siteHeader.classList.remove("scrolled");

            } else {

                siteHeader.classList.add("scrolled");

            }

        },

        {

            threshold: 0.15

        }

    );

    observer.observe(hero);

}