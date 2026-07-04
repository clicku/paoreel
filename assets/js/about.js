document.addEventListener("DOMContentLoaded", () => {

    const aboutHero = document.querySelector(".about-hero");

    if (!aboutHero) return;

    const tl = gsap.timeline();

    tl.to(".about-hero-image img", {

        scale:1,

        duration:2,

        ease:"power2.out"

    })

    .to(".about-hero-content span",{

        opacity:1,

        y:0,

        duration:.8

    },"-=1.3")

    .to(".about-hero-content h1",{

        opacity:1,

        y:0,

        duration:1

    },"-=.4")

    .to(".about-hero-content p",{

        opacity:1,

        y:0,

        duration:1

    },"-=.5");

    gsap.to(".story-image",{

        scrollTrigger:{
            trigger:".about-story",
            start:"top 75%"
        },

        opacity:1,

        y:0,

        duration:1.2,

        ease:"power3.out"

    });

    gsap.to(".story-content",{

        scrollTrigger:{
            trigger:".about-story",
            start:"top 75%"
        },

        opacity:1,

        y:0,

        duration:1.2,

        delay:.2,

        ease:"power3.out"

    });

    gsap.utils.toArray(".philosophy-card").forEach((card,index)=>{

        gsap.to(card,{

            scrollTrigger:{
                trigger:card,
                start:"top 85%"
            },

            opacity:1,

            y:0,

            duration:1,

            delay:index*.2,

            ease:"power3.out"

        });

    });

    gsap.to(".behind-content",{

        scrollTrigger:{
            trigger:".behind-scenes",
            start:"top 70%"
        },

        opacity:1,

        y:0,

        duration:1.2,

        ease:"power3.out"

    });

    gsap.to(".behind-image img",{

        scrollTrigger:{
            trigger:".behind-scenes",
            start:"top bottom",
            end:"bottom top",
            scrub:true
        },

        scale:1

    });

    gsap.utils.toArray(".service-card").forEach((card,index)=>{

        gsap.to(card,{

            scrollTrigger:{
                trigger:card,
                start:"top 85%"
            },

            opacity:1,

            y:0,

            duration:1,

            delay:index*.15,

            ease:"power3.out"

        });

    });

    gsap.to(".about-cta",{

        scrollTrigger:{
            trigger:".about-cta",
            start:"top 80%"
        },

        opacity:1,

        y:0,

        duration:1.2,

        ease:"power3.out"

    });

});