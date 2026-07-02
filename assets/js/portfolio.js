document.addEventListener("DOMContentLoaded",()=>{

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

});