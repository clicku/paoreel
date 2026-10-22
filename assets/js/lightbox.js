document.addEventListener("DOMContentLoaded", () => {

    const lightbox = document.querySelector(".lightbox");

    if (!lightbox) return;

    const image = lightbox.querySelector(".lightbox-image");
    const close = lightbox.querySelector(".lightbox-close");
    const prev = lightbox.querySelector(".lightbox-prev");
    const next = lightbox.querySelector(".lightbox-next");
    const counter = lightbox.querySelector(".lightbox-counter");
    const caption = lightbox.querySelector(".lightbox-caption");

    let gallery = [];
    let current = 0;
    let activeThumb = null;

    function updateCounter() {
        gallery = Array.from(document.querySelectorAll(".work-item img, .food-item img"));
        counter.textContent = `${current + 1} / ${gallery.length}`;
    }

    function show(index) {
        gallery = Array.from(document.querySelectorAll(".work-item img, .food-item img"));
        if (gallery.length === 0) return;

        current = index;
        if (current >= gallery.length) current = 0;
        if (current < 0) current = gallery.length - 1;

        gsap.to(image, {
            opacity: 0,
            scale: .96,
            duration: .18,
            onComplete: () => {
                if (!gallery[current]) return;

                image.src = gallery[current].src;
                image.alt = gallery[current].alt || "";
                caption.textContent = gallery[current].dataset.caption || gallery[current].alt || "";

                updateCounter();

                gsap.fromTo(
                    image,
                    { opacity: 0, scale: .96 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: .45,
                        ease: "power2.out"
                    }
                );
            }
        });
    }

    function open(index, thumb) {
        activeThumb = thumb;
        show(index);
        lightbox.classList.add("active");
        window.lenis?.stop();
        animateOpen();
    }

    function hide() {
        gsap.to(image, {
            opacity: 0,
            scale: .92,
            duration: .25
        });

        gsap.to(lightbox, {
            opacity: 0,
            duration: .3,
            onComplete: () => {
                lightbox.classList.remove("active");
                window.lenis?.start();
            }
        });
    }

    function animateOpen() {
        if (!activeThumb) return;

        gsap.fromTo(
            image,
            { opacity: 0, scale: .85 },
            {
                opacity: 1,
                scale: 1,
                duration: .45,
                ease: "power3.out"
            }
        );

        gsap.fromTo(
            lightbox,
            { opacity: 0 },
            {
                opacity: 1,
                duration: .35
            }
        );
    }

    function previous() {
        gallery = Array.from(document.querySelectorAll(".work-item img, .food-item img"));
        if (gallery.length === 0) return;

        current--;
        if (current < 0) {
            current = gallery.length - 1;
        }

        show(current);
    }

    function following() {
        gallery = Array.from(document.querySelectorAll(".work-item img, .food-item img"));
        if (gallery.length === 0) return;

        current++;
        if (current >= gallery.length) {
            current = 0;
        }

        show(current);
    }

    // Use Event Delegation to support dynamically loaded images automatically
    document.addEventListener("click", (e) => {
        const img = e.target.closest(".work-item img, .food-item img");
        if (img) {
            gallery = Array.from(document.querySelectorAll(".work-item img, .food-item img"));
            const index = gallery.indexOf(img);
            if (index > -1) {
                open(index, img);
            }
        }
    });

    close.addEventListener("click", hide);

    prev.addEventListener("click", previous);

    next.addEventListener("click", following);

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            hide();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;

        if (e.key === "Escape") hide();

        if (e.key === "ArrowLeft") previous();

        if (e.key === "ArrowRight") following();
    });

    /* ==========================================================
       TOUCH SWIPE
    ========================================================== */

    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].clientX;

        const distance = touchEndX - touchStartX;

        if (Math.abs(distance) < 60) return;

        if (distance > 0) {
            previous();
        } else {
            following();
        }
    }, { passive: true });

});