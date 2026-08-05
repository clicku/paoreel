/* ==========================================================
   PAOREEL STUDIOS V5 - GALLERY INTRO ENGINE (CURTAIN WIPE)
========================================================== */

window.GalleryIntro = (() => {
  "use strict";

  let initialized = false;

  function init() {
    if (initialized) return;

    if (!window.gsap || !window.ScrollTrigger) {
      console.warn("GalleryIntro: GSAP or ScrollTrigger not found.");
      return;
    }

    /* ==================================================
       1. DOM ELEMENTS
    ================================================== */
    const section = document.querySelector(".gallery-intro");
    const title = document.querySelector(".gallery-title");
    const midLayer = document.querySelector(".parallax-layer.mid .gallery-copy");

    if (!section) return;

    initialized = true;
    gsap.registerPlugin(ScrollTrigger);

    /* ==================================================
       2. TITLE CHARACTER SPOTLIGHT SETUP
    ================================================== */
    let titleLines = [];
    let titleCharacters = [];

    if (title) {
      const titleText = title.textContent
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      title.textContent = "";

      titleText.forEach((lineText) => {
        const line = document.createElement("span");
        line.className = "gallery-title-line";

        Array.from(lineText).forEach((character) => {
          const char = document.createElement("span");
          char.className = "gallery-title-char";
          char.textContent = character === " " ? "\u00A0" : character;

          line.appendChild(char);
          titleCharacters.push(char);
        });

        title.appendChild(line);
        titleLines.push(line);
      });

      // Set initial state for title elements
      gsap.set(titleLines, {
        display: "block",
        overflow: "visible",
        transformOrigin: "center center",
      });

      gsap.set(titleCharacters, {
        display: "inline-block",
        willChange: "transform, opacity, filter",
        backfaceVisibility: "hidden",
        opacity: 0.08,
        scale: 0.78,
        y: 12,
        filter: "blur(12px)",
        transformOrigin: "center center",
      });
    }

    /* ==================================================
       3. COPY LINE SPLITTER & INITIAL CURTAIN WIPE STATE
    ================================================== */
    let lines = gsap.utils.toArray(".gallery-copy .line");

    // Fallback splitter if no explicit .line elements are defined in HTML
    if (lines.length === 0 && midLayer) {
      const text = midLayer.textContent.trim();
      const sentences = text.split(/(?<=[.!?])\s+/);

      midLayer.innerHTML = sentences
        .map((sentence) => `<span class="line" style="display: block; width: 100%; margin-bottom: 1em;">${sentence.trim()}</span>`)
        .join("");

      lines = gsap.utils.toArray(".gallery-copy .line");
    } else {
      lines.forEach((line) => {
        line.style.display = "block";
        line.style.width = "100%";
      });
    }

    // Set initial curtain wipe state (folded closed from center)
    gsap.set(lines, {
      clipPath: "inset(0 50% 0 50%)",
      opacity: 0,
      willChange: "clip-path, opacity"
    });

    /* ==================================================
       4. SCROLLTRIGGER TIMELINE
    ================================================== */
    const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top 80%",
    end: "bottom 30%",
    // onEnter, onLeave, onEnterBack, onLeaveBack
    toggleActions: "play reverse play reverse",
    onLeaveBack: () => timeline.pause(0), // Ensures it resets when scrolled above
  }
});

    // 1. Animate lines sequentially with curtain wipe
    timeline.to(lines, {
      clipPath: "inset(0 0% 0 0%)",
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      stagger: 0.45
    }, 0);

    // 2. Animate title characters (if present)
    if (titleCharacters.length > 0) {
      timeline
        .to(titleCharacters, {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.55,
          ease: "power3.out",
          stagger: {
            each: 0.045,
            from: "center",
          },
        }, 0.18)
        .to(titleLines, {
          scale: 1.025,
          duration: 0.12,
          ease: "power2.out",
        }, "-=0.10")
        .to(titleLines, {
          scale: 1,
          duration: 0.45,
          ease: "elastic.out(1, 0.65)",
        });
    }

    ScrollTrigger.refresh();
  }

  return { init };
})();