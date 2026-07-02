document.addEventListener("DOMContentLoaded",()=>{

if(typeof gsap==="undefined") return;

gsap.utils.toArray(".portfolio-card").forEach((card,i)=>{

gsap.from(card,{

scrollTrigger:{
trigger:card,
start:"top 88%"
},

opacity:0,

y:80,

duration:.9,

delay:i*0.08,

ease:"power3.out"

});

});

});