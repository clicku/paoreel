/**
 * Paoreel Studios — Centralized Watermark & Protection Utility
 */

function getWatermarkedImageUrl(imgSrc, callback) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = function() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            
            // Draw original image
            ctx.drawImage(img, 0, 0);
            
            // Configure font scaling
            const fontSize = Math.max(26, Math.floor(canvas.width * 0.03));
            ctx.font = `bold ${fontSize}px "DM Sans", -apple-system, sans-serif`;
            ctx.textBaseline = "bottom";
            ctx.textAlign = "right";
            
            const text = "";
            const rightMargin = fontSize * 1.5;
            const bottomMargin = fontSize * 1.8;
            
            // Subtle drop-shadow for high readability without a background box
            ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
            ctx.shadowBlur = 6;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            // Crisp white text
            ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
            ctx.fillText(text, canvas.width - rightMargin, canvas.height - bottomMargin);
            
            callback(canvas.toDataURL('image/webp', 0.92));
        } catch (err) {
            console.warn("Watermark canvas tainted, using original image:", err);
            callback(imgSrc);
        }
    };

    img.onerror = () => callback(imgSrc);
    img.src = imgSrc;
}

// Global Saving Deterrents (Disables right-click and dragging on images)
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

// Global Interceptor for Lightbox2 pages (portraits.html, products.html)
document.addEventListener('click', function(e) {
    const trigger = e.target.closest('[data-lightbox]');
    if (trigger) {
        e.preventDefault();
        const pristineSrc = trigger.dataset.originalHref || trigger.href;
        if (!trigger.dataset.originalHref) {
            trigger.dataset.originalHref = pristineSrc;
        }
        
        getWatermarkedImageUrl(pristineSrc, (watermarkedUrl) => {
            trigger.href = watermarkedUrl;
            if (typeof lightbox !== "undefined") {
                lightbox.start($(trigger));
            }
        });
    }
}, true);