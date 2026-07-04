document.addEventListener("DOMContentLoaded",()=>{

if(typeof gsap==="undefined") return;

gsap.from(".footer",{

scrollTrigger:{

trigger:".footer",

start:"top 85%"

},

opacity:0,

y:80,

duration:1,

ease:"power3.out"

});

});