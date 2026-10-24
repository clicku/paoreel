/* ==========================================================
   PAOREEL V2
   NAVIGATION
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.querySelector(".hamburger") || document.querySelector(".mobile-toggle");
    const nav = document.querySelector(".nav-links") || document.querySelector(".pa-nav") || document.querySelector(".nav-menu");
    const header = document.getElementById("header");

    if (!nav) return;

    /* ======================================================
       MOBILE MENU
    ====================================================== */

    if (toggle) {
        toggle.addEventListener("click", () => {
            const isActive = nav.classList.toggle("active");
            toggle.classList.toggle("active", isActive);
            document.body.classList.toggle("menu-open", isActive);
            toggle.setAttribute("aria-expanded", isActive);
        });
    }

    /* ======================================================
       CLOSE WHEN CLICKING A LINK
    ====================================================== */

    const navLinksSelector = ".nav-links a, .pa-nav a, .nav-menu a";

    document.querySelectorAll(navLinksSelector).forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            document.body.classList.remove("menu-open");
            if (toggle) {
                toggle.classList.remove("active");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    });

    /* ======================================================
       CLOSE WHEN CLICKING OUTSIDE
    ====================================================== */

    document.addEventListener("click", (e) => {
        if (window.innerWidth > 900) return;
        if (!nav.classList.contains("active")) return;

        const clickedInsideNav = nav.contains(e.target);
        const clickedToggle = toggle && toggle.contains(e.target);

        if (!clickedInsideNav && !clickedToggle) {
            nav.classList.remove("active");
            document.body.classList.remove("menu-open");
            if (toggle) {
                toggle.classList.remove("active");
                toggle.setAttribute("aria-expanded", "false");
            }
        }
    });

    /* ======================================================
       ESC KEY CLOSES MENU
    ====================================================== */

    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;

        nav.classList.remove("active");
        document.body.classList.remove("menu-open");
        if (toggle) {
            toggle.classList.remove("active");
            toggle.setAttribute("aria-expanded", "false");
        }
    });

    /* ======================================================
       ACTIVE PAGE
    ====================================================== */

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(navLinksSelector).forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPage || (currentPage === "" && href === "index.html")) {
            link.classList.add("active");
        }
    });

    /* ======================================================
       HEADER SHRINK
    ====================================================== */

    function updateHeader() {
        if (!header) return;

        if (window.scrollY > 80) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader);

});