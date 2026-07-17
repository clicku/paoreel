const button = document.querySelector(".sound-toggle");
const audio = document.querySelector(".hero-audio");

button.addEventListener("click", () => {

    // Stop the breathing animation permanently
    button.style.animation = "none";

    if (audio.paused) {

        audio.volume = 0;
        audio.play();

        gsap.to(audio, {
            volume: 1,
            duration: 1.5
        });

        button.classList.add("on");

    } else {

        gsap.to(audio, {
            volume: 0,
            duration: 1,
            onComplete() {
                audio.pause();
            }
        });

        button.classList.remove("on");

    }

});