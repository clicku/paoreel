/**
 * gallery-engine.js
 * Core GSAP timeline controller for compressed photo deck expansion 
 * and horizontal scroll track scrubbing.
 */

export function initGalleryUnrollEngine(
  gallerySectionSelector = ".gallery-section", 
  itemSelector = ".gallery-item", 
  trackSelector = ".gallery-track"
) {
  const gallerySection = document.querySelector(gallerySectionSelector);
  const items = Array.from(document.querySelectorAll(itemSelector));
  const track = document.querySelector(trackSelector);

  // Safety Check: Stop execution if elements aren't present in the DOM
  if (!gallerySection || items.length === 0 || !track) {
    return null;
  }

  const itemWidth = 320;
  const gap = 16;
  const offsetStep = itemWidth + gap; // 336px per card
  const compressedOffset = 40; // Overlapped distance between cards

  // Step 1: Compress items horizontally into a tight overlapping stack
  items.forEach((item, index) => {
    if (index > 0) {
      const defaultX = index * offsetStep;
      const compressedX = index * compressedOffset;
      const targetX = compressedX - defaultX;

      gsap.set(item, {
        x: targetX,
        scale: 1 - index * 0.02,
        zIndex: items.length - index,
        transformOrigin: "center center"
      });
    }
  });

  // Step 2: Build pinned ScrollTrigger timeline
  const mainTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: gallerySection,
      start: "top top",
      end: "+=250%",
      pin: true,
      scrub: 1,
      anticipatePin: 1
    }
  });

  // Phase 1: Decompress stacked photos horizontally into natural grid layout
  items.forEach((item, index) => {
    if (index > 0) {
      mainTimeline.to(item, {
        x: 0,
        scale: 1,
        ease: "power2.out",
        duration: 1
      }, index * 0.12);
    }
  });

  // Phase 2: Translate track leftward to browse all images
  const totalShift = -offsetStep * (items.length - 2);
  mainTimeline.to(track, {
    x: totalShift,
    ease: "none",
    duration: 2
  }, ">-0.2");

  return mainTimeline;
}