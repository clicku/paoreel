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

    function updateCounter() {

        counter.textContent = `${current + 1} / ${gallery.length}`;

    }

    function show(index){

    current = index;

    gsap.to(image,{

        opacity:0,

        scale:.96,

        duration:.18,

        onComplete:()=>{

            image.src=gallery[current].src;

            image.alt=gallery[current].alt || "";

            caption.textContent=
                gallery[current].dataset.caption || "";

            updateCounter();

            gsap.fromTo(image,

                {

                    opacity:0,

                    scale:.96

                },

                {

                    opacity:1,

                    scale:1,

                    duration:.45,

                    ease:"power2.out"

                }

            );

        }

    });

}

    function open(index) {

    show(index);

    lightbox.classList.add("active");

    gsap.fromTo(

        lightbox,

        {
            opacity: 0
        },

        {
            opacity: 1,
            duration: .3
        }

    );

    document.body.style.overflow = "hidden";

}

    function hide() {

    gsap.to(lightbox, {

        opacity: 0,

        duration: .25,

        onComplete: () => {

            lightbox.classList.remove("active");

            document.body.style.overflow = "";

        }

    });

}
    function previous() {

        current--;

        if (current < 0) current = gallery.length - 1;

        show(current);

    }

    function following() {

        current++;

        if (current >= gallery.length) current = 0;

        show(current);

    }

    gallery = Array.from(document.querySelectorAll(

        ".work-item img, .food-item img"

    ));

    gallery.forEach((img, index) => {

        img.style.cursor = "zoom-in";

        img.addEventListener("click", () => {

            open(index);

        });

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