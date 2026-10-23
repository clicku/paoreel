/**
 * Paoreel Studios — Centralized Watermark & Protection Utility
 */

// 1. Generate Watermarked Data URL on-the-fly
function getWatermarkedImageUrl(imgSrc, callback) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Configure dynamic font scale
        const fontSize = Math.max(18, Math.floor(canvas.width * 0.022));
        ctx.font = `600 ${fontSize}px "DM Sans", -apple-system, sans-serif`;
        ctx.textBaseline = "bottom";
        ctx.textAlign = "right";
        
        const text = "© Paoreel Studios — All Rights Reserved";
        const padding = fontSize * 1.5;
        const textMetrics = ctx.measureText(text);
        
        // Semi-transparent backdrop box
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(
            canvas.width - textMetrics.width - padding - 20,
            canvas.height - fontSize - padding - 10,
            textMetrics.width + 40,
            fontSize + 24
        );
        
        // White copyright text
        ctx.fillStyle = "rgba(242, 240, 235, 0.92)";
        ctx.fillText(text, canvas.width - padding, canvas.height - padding);
        
        callback(canvas.toDataURL('image/webp', 0.92));
    };
    img.src = imgSrc;
}

// 2. Global Saving Deterrents (Disables right-click and dragging on gallery images)
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// 3. Global Interceptor for Lightbox2 (Used in portraits.html & products.html)
document.addEventListener('click', function(e) {
    const trigger = e.target.closest('[data-lightbox]');
    if (trigger && !trigger.dataset.watermarked) {
        e.preventDefault();
        const originalHref = trigger.href;
        getWatermarkedImageUrl(originalHref, (watermarkedUrl) => {
            trigger.href = watermarkedUrl;
            trigger.dataset.watermarked = "true";
            if (typeof lightbox !== "undefined") {
                lightbox.start($(trigger));
            }
        });
    }
}, true);