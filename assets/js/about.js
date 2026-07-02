document.addEventListener("DOMContentLoaded",()=>{

if(typeof gsap==="undefined") return;

gsap.from(".about-image",{

scrollTrigger:{
trigger:".about-home",
start:"top 75%"
},

opacity:0,

x:-100,

duration:1.2,

ease:"power3.out"

});

gsap.from(".about-content",{

scrollTrigger:{
trigger:".about-home",
start:"top 75%"
},

opacity:0,

x:100,

duration:1.2,

ease:"power3.out"

});

});