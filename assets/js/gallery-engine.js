/* ==========================================================
   PAOREEL STUDIOS V3
   GALLERY ENGINE V2
   PART 1
   ========================================================== */

window.PaoreelGalleryEngine = function () {

    /* ======================================================
       ELEMENTS
    ====================================================== */

    const viewport = document.querySelector(".gallery-viewport");
    const track = document.querySelector(".gallery-track");

    if (!viewport || !track) return;

    /* ======================================================
       DUPLICATE CONTENT
    ====================================================== */

    track.innerHTML += track.innerHTML;

    /* ======================================================
       ENGINE
    ====================================================== */

    const engine = {

        x: 0,

        velocity: 0,

        autoSpeed: 0.28,

        friction: 0.93,

        width: 0,

        hovered: null,

        items: []

    };

    /* ======================================================
       BUILD CARD OBJECTS
    ====================================================== */

    const cards = track.querySelectorAll(".gallery-item");

    cards.forEach((item) => {

        engine.items.push({

            element: item,

            card: item.querySelector(".gallery-card"),

            image: item.querySelector(".gallery-image"),

            img: item.querySelector("img"),

            caption: item.querySelector(".gallery-caption"),

            hovered: false,

            scale: 1,
            targetScale: 1,

            lift: 0,
            targetLift: 0,

            imageScale: 1,
            targetImageScale: 1

        });

    });

    /* ======================================================
       MEASURE
    ====================================================== */

    function measure() {

        engine.width = track.scrollWidth * 0.5;

    }

    measure();

    window.addEventListener("resize", measure);

    /* ======================================================
       HOVER EVENTS
    ====================================================== */

    engine.items.forEach((item) => {

        item.element.addEventListener("mouseenter", () => {

            engine.hovered = item;

        });

        item.element.addEventListener("mouseleave", () => {

            if (engine.hovered === item) {

                engine.hovered = null;

            }

        });

    });

    /* ======================================================
       UPDATE CARD STATES
    ====================================================== */

    function updateCards() {

        engine.items.forEach((item) => {

            if (engine.hovered === item) {

                item.targetScale = 0.93;

                item.targetLift = -10;

                item.targetImageScale = 1.08;

            } else {

                item.targetScale = 1;

                item.targetLift = 0;

                item.targetImageScale = 1;

            }

            item.scale += (item.targetScale - item.scale) * 0.12;

            item.lift += (item.targetLift - item.lift) * 0.12;

            item.imageScale +=
                (item.targetImageScale - item.imageScale) * 0.12;

        });

    }
        /* ======================================================
       RENDER CARDS
    ====================================================== */

    function renderCards() {

        engine.items.forEach((item) => {

            item.card.style.transform =
                `translate3d(0, ${item.lift}px, 0) scale(${item.scale})`;

            item.img.style.transform =
                `scale(${item.imageScale})`;

        });

    }

    /* ======================================================
       UPDATE ENGINE
    ====================================================== */

    function updateEngine() {

        engine.velocity *= engine.friction;

        engine.x -= engine.autoSpeed;

        engine.x += engine.velocity;

        if (-engine.x >= engine.width) {

            engine.x += engine.width;

        }

        if (engine.x > 0) {

            engine.x -= engine.width;

        }

    }

    /* ======================================================
       RENDER TRACK
    ====================================================== */

    function renderTrack() {

        track.style.transform =
            `translate3d(${engine.x}px,0,0)`;

    }

    /* ======================================================
       MAIN LOOP
    ====================================================== */

    function loop() {

        updateEngine();

        updateCards();

        renderCards();

        renderTrack();

        requestAnimationFrame(loop);

    }

    loop();
   /* ======================================================
   MOUSE CONTROLLER
====================================================== */

let dragging = false;
let moved = false;
let lastX = 0;

viewport.style.cursor = "pointer";

viewport.addEventListener("mousedown", (event) => {

    dragging = true;
    moved = false;

    lastX = event.clientX;

    viewport.style.cursor = "pointer";

});

window.addEventListener("mousemove", (event) => {

    if (!dragging) return;

    const delta = event.clientX - lastX;

    if (Math.abs(delta) > 2) {

        moved = true;

    }

    lastX = event.clientX;

    engine.velocity += delta * 0.06;

});

window.addEventListener("mouseup", () => {

    dragging = false;

    viewport.style.cursor = "pointer";

});

/* ======================================================
   PREVENT CLICK AFTER DRAG
====================================================== */

track.querySelectorAll(".gallery-item").forEach((item) => {

    item.addEventListener("click", (event) => {

        if (moved) {

            event.preventDefault();

            event.stopPropagation();

        }

    });

});

    /* ======================================================
       PREVENT IMAGE DRAGGING
    ====================================================== */

    track.querySelectorAll("img").forEach((img) => {

        img.draggable = false;

    });

    /* ======================================================
       PREVENT LINK DRAG
    ====================================================== */

    track.querySelectorAll("a").forEach((link) => {

        link.addEventListener("dragstart", (event) => {

            event.preventDefault();

        });

    });

};