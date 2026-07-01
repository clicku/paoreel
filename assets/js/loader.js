/* ==========================================================
   PAOREEL V2
   DSLR STARTUP
========================================================== */

window.addEventListener("load", () => {

    const tl = gsap.timeline({

        defaults:{
            ease:"power3.out"
        }

    });

    /* ------------------------------------------------------
       Initial State
    ------------------------------------------------------ */

    gsap.set(".hero",{

        opacity:1

    });

    gsap.set(".bg-image",{

        opacity:0,
        filter:"blur(40px)",
        scale:1.12

    });

    gsap.set([

        ".hero-category",
        ".hero h1",
        ".hero p",
        ".btn-primary",
        ".scroll-indicator",
        "#main-header"

    ],{

        opacity:0,
        y:40

    });

    /* ------------------------------------------------------
       Camera Sensor Power
    ------------------------------------------------------ */

    tl.to(".bg-image",{

        opacity:.35,

        duration:.6,

        ease:"power2.out"

    });

    /* ------------------------------------------------------
       Autofocus Hunt
    ------------------------------------------------------ */

    tl.to(".bg-image",{

        filter:"blur(26px)",

        opacity:.50,

        duration:.18

    })

    .to(".bg-image",{

        filter:"blur(34px)",

        opacity:.28,

        duration:.05

    })

    .to(".bg-image",{

        filter:"blur(18px)",

        opacity:.62,

        duration:.18

    })

    .to(".bg-image",{

        filter:"blur(24px)",

        opacity:.40,

        duration:.05

    })

    .to(".bg-image",{

        filter:"blur(10px)",

        opacity:.72,

        duration:.22

    })

    .to(".bg-image",{

        filter:"blur(4px)",

        opacity:.82,

        duration:.20

    })

    .to(".bg-image",{

        filter:"blur(0px)",

        opacity:.95,

        scale:1.08,

        duration:.9,

        ease:"power4.out"

    });

    /* ------------------------------------------------------
       Fade Loader
    ------------------------------------------------------ */

    tl.to("#loader",{

        opacity:0,

        duration:.6,

        pointerEvents:"none"

    },"-=0.45");

    tl.set("#loader",{

        display:"none"

    });

    /* ------------------------------------------------------
       Reveal Navigation
    ------------------------------------------------------ */

    tl.to("#main-header",{

        opacity:1,

        y:0,

        duration:.6

    });

    /* ------------------------------------------------------
       Reveal Hero
    ------------------------------------------------------ */

    tl.to(".hero-category",{

        opacity:1,

        y:0,

        duration:.55

    })

    .to(".hero h1",{

        opacity:1,

        y:0,

        duration:.8

    },"-=.25")

    .to(".hero p",{

        opacity:1,

        y:0,

        duration:.7

    },"-=.45")

    .to(".btn-primary",{

        opacity:1,

        y:0,

        duration:.6

    },"-=.45")

    .to(".scroll-indicator",{

        opacity:1,

        y:0,

        duration:.6

    },"-=.25");

});