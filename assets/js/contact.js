document.addEventListener("DOMContentLoaded",()=>{

if(typeof gsap==="undefined") return;

gsap.from(".contact-content",{

scrollTrigger:{

trigger:".contact-cta",

start:"top 70%"

},

opacity:0,

y:120,

duration:1.3,

ease:"power3.out"

});

gsap.to(".contact-bg",{

scrollTrigger:{

trigger:".contact-cta",

scrub:true

},

scale:1,

ease:"none"

});

});