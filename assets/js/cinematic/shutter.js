/* ==========================================================
   PAOREEL STUDIOS - CINEMATIC ENGINE
   SHUTTER MODULE (Normalized 0-1 Close-to-Open Mapping)
========================================================== */

window.Shutter = (() => {
    "use strict";

    const r = 80;
    const bladeCount = 6; 
    
    let bodiesContainer;
    let edgesContainer;

    const arc = (x, y, s) => `A${r},${r},0,0,${s},${x},${y}`;
    const path = (i, d) => `<path transform='rotate(${(i / bladeCount) * 360})' ${d}></path>`;

    function init() {
        bodiesContainer = document.getElementById("aperture-bodies");
        edgesContainer = document.getElementById("aperture-edges");
    }

    /**
     * @param {number} progress - Expects a value from 0 (Fully Closed) to 1 (Fully Open)
     */
    function update(progress) {
        if (!bodiesContainer || !edgesContainer) return;

        // Clamp entry to prevent visual layout breaking
        let safeProgress = Math.max(0, Math.min(1, progress));

        // INTERNAL MAP: 
        // progress = 0 (Closed) -> maps to 0.75 (blades meet in center)
        // progress = 1 (Open)   -> maps to 0.001 (blades retract out to perimeter)
        let val = (1 - safeProgress) * 0.75;
        if (val < 0.001) val = 0.001;

        let step = Math.PI * (0.5 + 2 / bladeCount);
        let p1x = Math.cos(step) * r;
        let p1y = Math.sin(step) * r;
        let cos = Math.cos(-val);
        let sin = Math.sin(-val);
        let c1x = p1x - cos * p1x - sin * p1y;
        let c1y = p1y - cos * p1y + sin * p1x;
        let dx = -sin * r - c1x;
        let dy = r - cos * r - c1y;
        let dc = Math.sqrt(dx * dx + dy * dy);
        
        let arcRatio = dc / 2 / r;
        if (arcRatio > 1) arcRatio = 1;
        if (arcRatio < -1) arcRatio = -1;
        
        let a = Math.atan2(dy, dx) - Math.acos(arcRatio);
        let x = c1x + Math.cos(a) * r;
        let y = c1y + Math.sin(a) * r;

        let edge = `M${p1x},${p1y}${arc(0, r, 0)}${arc(x, y, 1)}`;
        
        let bodiesHTML = '';
        let edgesHTML = '';

        for (let i = 0; i < bladeCount; i++) {
            edgesHTML += path(i, `fill=none stroke='#050505' stroke-width='0.5' d='${edge}'`);
            let fillColor = i % 2 === 0 ? "#141414" : "#1a1a1a";
            bodiesHTML += path(i, `fill='${fillColor}' d='${edge}${arc(p1x, p1y, 0)}'`);
        }

        bodiesContainer.innerHTML = bodiesHTML;
        edgesContainer.innerHTML = edgesHTML;
    }

    return {
        init,
        update
    };
})();