document.addEventListener("DOMContentLoaded",()=>{

const foodHero = document.querySelector(".food-hero");

if (!foodHero) return;

const tl=gsap.timeline();

tl.to(".food-hero-image img",{

scale:1,

duration:2,

ease:"power2.out"

})

.to(".food-content span",{

opacity:1,

y:0,

duration:.8

},"-=1.4")

.to(".food-content h1",{

opacity:1,

y:0,

duration:1

},"-=.5")

.to(".food-content p",{

opacity:1,

y:0,

duration:1

},"-=.5");

});
gsap.to(".food-intro-text",{

    scrollTrigger:{
        trigger:".food-intro",
        start:"top 75%"
    },

    opacity:1,

    y:0,

    duration:1.2,

    ease:"power3.out"

});

gsap.to(".food-intro-image",{

    scrollTrigger:{
        trigger:".food-intro",
        start:"top 75%"
    },

    opacity:1,

    y:0,

    duration:1.2,

    delay:.2,

    ease:"power3.out"

});
gsap.utils.toArray(".food-item").forEach((item,index)=>{

    gsap.to(item,{

        scrollTrigger:{
            trigger:item,
            start:"top 85%"
        },

        opacity:1,

        y:0,

        duration:1,

        delay:index*.08,

        ease:"power3.out"

    });

});
gsap.to(".food-featured-content",{

    scrollTrigger:{
        trigger:".food-featured",
        start:"top 75%"
    },

    opacity:1,

    y:0,

    duration:1.2,

    ease:"power3.out"

});

gsap.to(".food-featured-image img",{

    scrollTrigger:{
        trigger:".food-featured",
        start:"top bottom",
        end:"bottom top",
        scrub:true
    },

    scale:1

});
gsap.to(".food-cta",{

    scrollTrigger:{
        trigger:".food-cta",
        start:"top 80%"
    },

    opacity:1,

    y:0,

    duration:1.2,

    ease:"power3.out"

});