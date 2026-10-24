/**
 * Global Mobile Hamburger Navigation Handler
 */
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-links, .pa-nav, .nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            const isActive = hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            
            // Prevent background page scroll while menu is open
            document.body.style.overflow = isActive ? "hidden" : "";
            hamburger.setAttribute("aria-expanded", isActive);
        });

        // Close menu automatically on link click
        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
                document.body.style.overflow = "";
                hamburger.setAttribute("aria-expanded", "false");
            });
        });
    }
});