/* ==========================================================
   PAOREEL V2
   NAVIGATION
========================================================== */

window.initNavigation=function(){

    const toggle = document.querySelector(".mobile-toggle");
    const nav = document.querySelector(".nav-links");
    const header = document.getElementById("header");

    if (!nav) return;

    /* ======================================================
       MOBILE MENU
    ====================================================== */

    if (toggle) {

        toggle.addEventListener("click", () => {

            nav.classList.toggle("active");

            toggle.classList.toggle("active");

            document.body.classList.toggle("menu-open");

            toggle.innerHTML =
                nav.classList.contains("active")
                ? "✕"
                : "☰";

        });

    }

    /* ======================================================
       CLOSE WHEN CLICKING A LINK
    ====================================================== */

    document.querySelectorAll(".nav-links a").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("active");

            document.body.classList.remove("menu-open");

            if (toggle) {

                toggle.classList.remove("active");

                toggle.innerHTML = "☰";

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

                toggle.innerHTML = "☰";

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

            toggle.innerHTML = "☰";

        }

    });

    /* ======================================================
       ACTIVE PAGE
    ====================================================== */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a").forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {

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

};