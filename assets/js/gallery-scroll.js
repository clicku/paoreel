/**
 * gallery-scroll.js
 * Infinite Seamless Loop + Proxy Draggable Inertia
 */

let activeCleanups = [];
let marqueeTrack = null;
let marqueeWidth = 0;
let dragInstance = null;
let mainTimeline = null;
let tickerActive = false;
let autoScrollSpeed = 1; // Speed in pixels per frame
let isMarqueeActive = false;
/* ==========================================================
   MASTER STORY SCENE
========================================================== */

let storyTimeline = null;

/**
 * Main Gallery Unroll Engine
 */
export function initGalleryUnrollEngine(
  gallerySectionSelector = ".gallery-section", 
  itemSelector = ".gallery-item", 
  trackSelector = ".gallery-track"
) {
  const gallerySection = document.querySelector(gallerySectionSelector);
  const items = Array.from(document.querySelectorAll(itemSelector));
  const track = document.querySelector(trackSelector);
  const heroStill = document.querySelector("#hero-still");
  const heroParallax = document.querySelector(".hero-parallax");
  const galleryGradient = document.querySelector(".gallery-bg-gradient");
  const galleryNoise = document.querySelector(".gallery-bg-noise");
  const galleryLight = document.querySelector(".gallery-bg-light");
  const galleryIntro = document.querySelector(".gallery-intro");
  const galleryCopy = document.querySelector(".gallery-copy");
  const galleryTitle = document.querySelector(".gallery-title");

  if (!gallerySection || items.length === 0 || !track) return null;

  stopMarqueeLoop();
  /* ==========================================================
   STORY TIMELINE
========================================================== */

storyTimeline = gsap.timeline({

    scrollTrigger: {

        trigger: galleryIntro,

        start: "top bottom",

        end: "bottom top",

        scrub: 1,

        invalidateOnRefresh: true

    }

});
/* ===========================
   NEW BACKGROUND ANIMATION
=========================== */

if (galleryGradient){

    storyTimeline.to(galleryGradient,{

        y:-120,

        scale:1,

        rotation:-2,

        ease:"none"

    },0);

}

if (galleryNoise){

    storyTimeline.to(galleryNoise,{

        y:-220,

        ease:"none"

    },0);

}

if (galleryLight){

    storyTimeline.to(galleryLight,{

        x:-140,

        y:-90,

        scale:1.15,

        ease:"none"

    },0);

}

  /* ----------------------------------------------------------
   HERO CONTINUES MOVING
---------------------------------------------------------- */

if (heroStill) {

    storyTimeline.to(heroStill, {

        y: -120,

        scale: 1.08,

        ease: "none"

    }, 0);

}

if (heroParallax) {

    storyTimeline.to(heroParallax, {

        y: -80,

        ease: "none"

    }, 0);

}
if (galleryCopy) {

    storyTimeline.fromTo(

        galleryCopy,

        {

            y: 120,

            opacity: 0

        },

        {

            y: -40,

            opacity: 1,

            ease: "none"

        },

        0

    );

}
if (galleryTitle) {

    storyTimeline.fromTo(

        galleryTitle,

        {

            y: 180,

            opacity: 0

        },

        {

            y: -80,

            opacity: 1,

            ease: "none"

        },

        0

    );

}

  

  const itemWidth = 400; 
  const gap = 24;          

  const total = items.length;
  const midPoint = Math.floor(total / 2);

  items.forEach((item, index) => {
    if (index > 0) {
      const defaultX = index * (itemWidth + gap);
      const distFromCenter = Math.abs(index - midPoint);
      const pyramidY = - (midPoint - distFromCenter) * 25;
      const tilt = (index - midPoint) * 4;

      gsap.set(item, {
        x: -defaultX + (index * 20),
        y: pyramidY,
        rotation: tilt,
        scale: 1 - distFromCenter * 0.03,
        zIndex: items.length - distFromCenter,
        transformOrigin: "center bottom"
      });
    }
  });

  mainTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: gallerySection,
      start: "top top",
      end: "+=300%",
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true, // Crucial for recalculating positions on resize/refresh
      onLeave: () => startContinuousMarquee(track, gallerySection),
      onEnterBack: () => stopMarqueeLoop(),
      onUpdate: (self) => {
        if (self.direction === -1 && isMarqueeActive) stopMarqueeLoop();
      }
    }
  });

  items.forEach((item, index) => {
    if (index > 0) {
      mainTimeline.to(item, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        ease: "power2.out",
        duration: 1
      }, index * 0.12);
    }
  });

  return mainTimeline;
}

/**
 * Helper to keep position within horizontal marquee loop bounds [0, -marqueeWidth]
 */
function normalizeX(x) {
  if (!marqueeWidth) return 0;
  let normalized = x % marqueeWidth;
  if (normalized > 0) normalized -= marqueeWidth;
  return normalized;
}

/**
 * Custom Ticker Function for Smooth Continuous Motion
 */
function updateMarquee() {
  if (!marqueeTrack || !marqueeWidth) return;

  let currentX = gsap.getProperty(marqueeTrack, "x");
  let nextX = normalizeX(currentX - autoScrollSpeed);

  gsap.set(marqueeTrack, { x: nextX });

  if (dragInstance) {
    dragInstance.update(true);
  }
}

function startMarqueeTicker() {
  if (tickerActive) return;
  tickerActive = true;
  gsap.ticker.add(updateMarquee);
}

function stopMarqueeTicker() {
  if (!tickerActive) return;
  tickerActive = false;
  gsap.ticker.remove(updateMarquee);
}

/**
 * Clones DOM nodes for zero-gap looping and attaches Draggable interaction
 */
function startContinuousMarquee(track, container) {
  if (isMarqueeActive) return;
  isMarqueeActive = true;

  marqueeTrack = container.querySelector(".gallery-marquee");
  if (!marqueeTrack) return;

  const originalTrack = marqueeTrack.querySelector(".gallery-track");
  const cloneTrack = marqueeTrack.querySelector(".gallery-track-clone");

  if (cloneTrack && !cloneTrack.children.length && originalTrack) {
    cloneTrack.innerHTML = originalTrack.innerHTML;
  }

  if (cloneTrack) {
    gsap.set(cloneTrack, { display: "flex", opacity: 1 });
  }

  const gap = parseFloat(getComputedStyle(originalTrack).marginRight) || 16;
  marqueeWidth = originalTrack.getBoundingClientRect().width + gap;

  container.style.cursor = "grab";
  startMarqueeTicker();

  if (typeof Draggable !== "undefined" && !dragInstance) {
    dragInstance = Draggable.create(marqueeTrack, {
      type: "x",
      trigger: container,
      inertia: true,
      cursor: "grab",
      activeCursor: "grabbing",
      onPress() {
        container.style.cursor = "grabbing";
        container.classList.add("is-dragging");
        stopMarqueeTicker();
      },
      onDrag() {
        let clamped = normalizeX(this.x);
        if (clamped !== this.x) {
          let diff = this.x - clamped;
          this.startX -= diff;
          gsap.set(this.target, { x: clamped });
          this.update();
        }
      },
      onThrowUpdate() {
        let clamped = normalizeX(this.x);
        if (clamped !== this.x) {
          gsap.set(this.target, { x: clamped });
          this.update();
        }
      },
      onRelease() {
        container.style.cursor = "grab";
        container.classList.remove("is-dragging");
        if (!this.isThrowing && (!this.tween || !this.tween.isActive())) {
          startMarqueeTicker();
        }
      },
      onThrowComplete() {
        container.style.cursor = "grab";
        container.classList.remove("is-dragging");
        startMarqueeTicker();
      }
    })[0];
  } else if (dragInstance) {
    dragInstance.enable();
  }
}

function stopMarqueeLoop() {
  if (!isMarqueeActive) return;
  isMarqueeActive = false;

  stopMarqueeTicker();

  if (dragInstance) {
    dragInstance.disable();
  }

  const gallerySection = document.querySelector(".gallery-section");
  if (!gallerySection) return;

  const marqueeTrack = gallerySection.querySelector(".gallery-marquee");

  if (marqueeTrack) {
    gsap.to(marqueeTrack, {
      x: 0,
      duration: 0.2,
      overwrite: "auto",
      ease: "power1.out"
    });
  }

  gallerySection.classList.remove("is-dragging");
}

/**
 * Reset Helper
 */
export function resetIntroElements(titleSpansSelector, copySelector, overlaySelector) {
  activeCleanups.forEach(fn => fn());
  activeCleanups = [];

  const elements = [
    ...Array.from(document.querySelectorAll(titleSpansSelector)),
    document.querySelector(copySelector),
    document.querySelector(overlaySelector)
  ].filter(Boolean);

  if (elements.length === 0) return;

  gsap.killTweensOf(elements);
  gsap.set(elements, { clearProps: "all" });
}

/**
 * Intro Switcher
 */
export function applyIntroEffect(
  option, 
  introSectionSelector = ".gallery-intro", 
  gallerySectionSelector = ".gallery-section",
  titleSpansSelector = ".gallery-title .word span", 
  copySelector = ".gallery-copy", 
  overlaySelector = ".gallery-overlay"
) {
  const introSection = document.querySelector(introSectionSelector);
  const gallerySection = document.querySelector(gallerySectionSelector);
  const titleSpans = Array.from(document.querySelectorAll(titleSpansSelector));
  const copyText = document.querySelector(copySelector);
  const overlay = document.querySelector(overlaySelector);

  if (!introSection || titleSpans.length === 0) return;

  resetIntroElements(titleSpansSelector, copySelector, overlaySelector);

  switch (String(option)) {
    case "1": {
      const tween = gsap.fromTo(titleSpans, 
        { yPercent: 120, opacity: 0, rotateX: -30 },
        { 
          yPercent: 0, opacity: 1, rotateX: 0, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: introSection, start: "top 85%", end: "top 35%", scrub: 1 }
        }
      );
      activeCleanups.push(() => tween.scrollTrigger?.kill());
      break;
    }
    case "2": {
      // Safe trigger: bound to introSection instead of pinned gallerySection to prevent layout conflict
      const tl = gsap.timeline({
        scrollTrigger: { trigger: introSection, start: "top top", end: "+=100%", scrub: 1 }
      });
      if (copyText) tl.to(copyText, { y: -50, opacity: 0, ease: "power1.in" }, 0);
      if (titleSpans.length) tl.to(titleSpans, { y: -100, opacity: 0.1, scale: 0.9, ease: "power1.in" }, 0);
      if (overlay) tl.to(overlay, { opacity: 0.9, ease: "power1.inOut" }, 0);

      activeCleanups.push(() => tl.scrollTrigger?.kill());
      break;
    }
    case "3": {
      const xTo = titleSpans.map(s => gsap.quickTo(s, "x", { duration: 0.4, ease: "power3.out" }));
      const yTo = titleSpans.map(s => gsap.quickTo(s, "y", { duration: 0.4, ease: "power3.out" }));

      const handleMouseMove = (e) => {
        const { left, top, width, height } = introSection.getBoundingClientRect();
        const relX = (e.clientX - left) / width - 0.5;
        const relY = (e.clientY - top) / height - 0.5;
        titleSpans.forEach((_, i) => {
          xTo[i](relX * (i + 1) * 20);
          yTo[i](relY * (i + 1) * 20);
        });
      };

      const handleMouseLeave = () => titleSpans.forEach((_, i) => { xTo[i](0); yTo[i](0); });

      introSection.addEventListener("mousemove", handleMouseMove);
      introSection.addEventListener("mouseleave", handleMouseLeave);

      activeCleanups.push(() => {
        introSection.removeEventListener("mousemove", handleMouseMove);
        introSection.removeEventListener("mouseleave", handleMouseLeave);
      });
      break;
    }
    case "4": {
      const targets = [...titleSpans, copyText].filter(Boolean);
      const tween = gsap.fromTo(targets,
        { filter: "blur(12px)", opacity: 0, y: 30 },
        {
          filter: "blur(0px)", opacity: 1, y: 0, stagger: 0.15,
          scrollTrigger: { trigger: introSection, start: "top 80%", end: "top 30%", scrub: 1 }
        }
      );
      activeCleanups.push(() => tween.scrollTrigger?.kill());
      break;
    }
    case "5": {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: introSection, start: "top 80%", end: "top 20%", scrub: 1 }
      });
      if (copyText) tl.fromTo(copyText, { x: -60, opacity: 0 }, { x: 0, opacity: 1 }, 0);
      if (titleSpans.length) tl.fromTo(titleSpans, { x: 60, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1 }, 0);

      activeCleanups.push(() => tl.scrollTrigger?.kill());
      break;
    }
    case "6": {
      // Safe trigger: bound to introSection instead of pinned gallerySection
      const tl = gsap.timeline({
        scrollTrigger: { trigger: introSection, start: "top 90%", end: "top top", scrub: 1 }
      });
      if (titleSpans.length) tl.fromTo(titleSpans, { scale: 1.25, letterSpacing: "-0.08em" }, { scale: 1, letterSpacing: "-0.05em", stagger: 0.05 }, 0);
      if (copyText) tl.fromTo(copyText, { opacity: 0.3, y: 20 }, { opacity: 1, y: 0 }, 0);

      activeCleanups.push(() => tl.scrollTrigger?.kill());
      break;
    }
  }
}

// Initialization
window.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined") {
    if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
    if (typeof Draggable !== "undefined") gsap.registerPlugin(Draggable);
  }

  initGalleryUnrollEngine();

  const select = document.getElementById("effect-select");
  if (select) {
    select.addEventListener("change", (e) => applyIntroEffect(e.target.value));
  }

  applyIntroEffect("1");
});