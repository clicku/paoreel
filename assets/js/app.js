document.addEventListener("DOMContentLoaded",()=>{

    if(window.initNavigation){

        initNavigation();

    }

    if(window.initFooter){

        initFooter();

    }

    if(window.initLightbox){

        initLightbox();

    }

    if(document.querySelector(".hero")){

        initHero?.();

    }

    if(document.querySelector(".about-hero")){

        initAbout?.();

    }

    if(document.querySelector(".portfolio-hero")){

        initPortfolio?.();

    }

    if(document.querySelector(".food-hero")){

        initFood?.();

    }

    if(document.querySelector(".contact-hero")){

        initContact?.();

    }

});