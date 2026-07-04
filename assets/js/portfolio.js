window.initPortfolio=function(){

const aboutHero = document.querySelector(".portfolio-hero");

if (!aboutHero) return;

const tl=gsap.timeline();

tl.to(".portfolio-hero-image img",{

scale:1,

duration:2,

ease:"power2.out"

})

.to(".portfolio-content span",{

opacity:1,

y:0,

duration:.8

},"-=1.4")

.to(".portfolio-content h1",{

opacity:1,

y:0,

duration:1

},"-=.5")

.to(".portfolio-content p",{

opacity:1,

y:0,

duration:1

},"-=.6");

};
gsap.utils.toArray(".category-card").forEach((card,index)=>{

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
gsap.utils.toArray(".work-item").forEach((item,index)=>{

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
gsap.to(".portfolio-cta",{

    scrollTrigger:{
        trigger:".portfolio-cta",
        start:"top 80%"
    },

    opacity:1,

    y:0,

    duration:1.2,

    ease:"power3.out"

});