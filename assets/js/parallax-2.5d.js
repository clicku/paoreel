window.Parallax25D = (() => {
    "use strict";

    let initialized = false;
    let animationFrameId = null;

    function init() {
        if (initialized) return;
        initialized = true;

        const container = document.getElementById('parallax-container');
        const bg = document.getElementById('layer-bg');
        const glowCeiling = document.getElementById('glow-ceiling');
        const wallLighting = document.getElementById('wall-lighting');
        const midLeft = document.getElementById('layer-mid-left');
        const midRight = document.getElementById('layer-mid-right');
        const farRight = document.getElementById('layer-far-right');
        const shadowLeft = document.getElementById('shadow-left');
        const shadowRight = document.getElementById('shadow-right');
        const fg = document.getElementById('layer-fg');
        const shadow = document.getElementById('floor-shadow');
        const lightSweep = document.getElementById('light-sweep');
        const lensGlint = document.getElementById('lens-glint');
        const strobe = document.getElementById('strobe-flash');

        if (!container) {
            console.warn("[Parallax25D] #parallax-container not found.");
            return;
        }

        // Animate the 2.5D layers smoothly into view using GSAP when Parallax25D takes over
        const parallaxLayers = document.querySelectorAll("#layer-bg, #layer-mid-left, #layer-mid-right, #layer-far-right");
        if (parallaxLayers.length) {
            gsap.to(parallaxLayers, {
                opacity: 1,
                scale: 1,
                duration: 1.0,
                ease: "power2.out",
                force3D: true,
                transformOrigin: "center center"
            });
        }

        let targetX = 0, targetY = 0;
        let fgCurrentX = 0, fgCurrentY = 0;   
        let midCurrentX = 0, midCurrentY = 0; 

        const fgEase = 0.05;   
        const midEase = 0.04; 

        let isFlashing = false;

        window.addEventListener('mousedown', (e) => {
           // e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            targetX = (e.clientX - centerX) / centerX;
            targetY = (e.clientY - centerY) / centerY;
        });

        window.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
        });

        let audioCtx = null;

        function playShutterSound() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const bufferSize = audioCtx.sampleRate * 0.08;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1400;

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.07);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            noise.start();
        }

        const stageContainer = document.getElementById('parallax-stage') || container;

        window.addEventListener('click', (e) => {
            playShutterSound();
            isFlashing = true;

            if (strobe) {
                strobe.style.transition = 'none';
                strobe.style.opacity = '1';
            }

            setTimeout(() => {
                isFlashing = false;
                if (strobe) {
                    strobe.style.transition = 'opacity 0.35s ease-out';
                    strobe.style.opacity = '0';
                }
            }, 50);
        });

        const smokeCanvas = document.getElementById('smoke-canvas');
        const smokeCtx = smokeCanvas ? smokeCanvas.getContext('2d') : null;
        
        const canvas = document.getElementById('dust-canvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        let particles = [];
        const numParticles = 87;

        const fgCanvas = document.getElementById('fg-dust-canvas');
        const fgCtx = fgCanvas ? fgCanvas.getContext('2d') : null;
        let fgParticles = [];
        const numFgParticles = 28;

        function resizeCanvas() {
            if (smokeCanvas) { smokeCanvas.width = window.innerWidth; smokeCanvas.height = window.innerHeight; }
            if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
            if (fgCanvas) { fgCanvas.width = window.innerWidth; fgCanvas.height = window.innerHeight; }
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class SmokePuff {
            constructor() { this.init(true); }
            init(initialSpawn = false) {
                this.x = Math.random() * (smokeCanvas ? smokeCanvas.width : window.innerWidth);
                this.y = initialSpawn ? Math.random() * (smokeCanvas ? smokeCanvas.height : window.innerHeight) : (smokeCanvas ? smokeCanvas.height : window.innerHeight) + 150;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = -(Math.random() * 0.45 + 0.25);
                this.radius = Math.random() * 140 + 90;
                this.maxRadius = this.radius * (Math.random() * 1.6 + 1.3);
                this.growthRate = Math.random() * 0.22 + 0.09;
                this.baseAlpha = Math.random() * 0.32 + 0.13;
                this.alpha = this.baseAlpha;
                this.angle = Math.random() * Math.PI * 2;
                this.spin = (Math.random() - 0.5) * 0.006;
            }
            update() {
                this.x += this.vx + Math.sin(this.angle) * 0.45;
                this.y += this.vy;
                this.angle += this.spin;
                if (this.radius < this.maxRadius) this.radius += this.growthRate;
                const sHeight = smokeCanvas ? smokeCanvas.height : window.innerHeight;
                if (this.y < sHeight * 0.3) {
                    this.alpha = this.baseAlpha * (this.y / (sHeight * 0.3));
                } else {
                    this.alpha = this.baseAlpha;
                }
                if (this.y < -150 || this.alpha <= 0.01) this.init(false);
            }
            draw() {
                if (!smokeCtx) return;
                smokeCtx.save();
                smokeCtx.beginPath();
                const grad = smokeCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
                grad.addColorStop(0, `rgba(255, 235, 210, ${this.alpha})`);
                grad.addColorStop(0.5, `rgba(230, 210, 190, ${this.alpha * 0.65})`);
                grad.addColorStop(1, 'rgba(150, 130, 110, 0)');
                smokeCtx.fillStyle = grad;
                smokeCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                smokeCtx.fill();
                smokeCtx.restore();
            }
        }

        let smokePuffs = [];
        for (let i = 0; i < 20; i++) { smokePuffs.push(new SmokePuff()); }

        class Particle {
            constructor() { this.init(true); }
            init(initialSpawn = false) {
                this.x = Math.random() * (canvas ? canvas.width : window.innerWidth);
                this.y = initialSpawn ? Math.random() * (canvas ? canvas.height : window.innerHeight) : (canvas ? canvas.height : window.innerHeight) + 20;
                this.size = (Math.random() * 1.4 + 0.6) * 1.05;
                this.vx = (Math.random() - 0.5) * 0.15;
                this.vy = -(Math.random() * 0.2 + 0.05);
                this.baseAlpha = Math.random() * 0.4 + 0.15; 
                this.pulseSpeed = Math.random() * 0.002 + 0.0008;
                this.pulseSeed = Math.random() * 1000;
            }
            update() {
                this.x += this.vx + Math.sin(Date.now() * 0.001 + this.pulseSeed) * 0.05;
                this.y += this.vy;
                this.alpha = this.baseAlpha + Math.sin(Date.now() * this.pulseSpeed + this.pulseSeed) * 0.15;
                const cWidth = canvas ? canvas.width : window.innerWidth;
                if (this.y < -20) this.init(false);
                if (this.x < -20) this.x = cWidth + 10;
                else if (this.x > cWidth + 20) this.x = -10;
            }
            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 245, 230, ${Math.max(0.03, this.alpha)})`;
                ctx.shadowBlur = this.size * 2.5;
                ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
                ctx.fill();
            }
        }

        class ForegroundParticle {
            constructor() { this.init(true); }
            init(initialSpawn = false) {
                this.x = Math.random() * (fgCanvas ? fgCanvas.width : window.innerWidth);
                this.y = initialSpawn ? Math.random() * (fgCanvas ? fgCanvas.height : window.innerHeight) : (fgCanvas ? fgCanvas.height : window.innerHeight) + 30;
                this.size = Math.random() * 2.5 + 1.2; 
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = -(Math.random() * 0.5 + 0.15); 
                this.baseAlpha = Math.random() * 0.3 + 0.08; 
                this.pulseSpeed = Math.random() * 0.003 + 0.001;
                this.pulseSeed = Math.random() * 1000;
            }
            update() {
                this.x += this.vx + Math.sin(Date.now() * 0.0012 + this.pulseSeed) * 0.1;
                this.y += this.vy;
                this.alpha = this.baseAlpha + Math.sin(Date.now() * this.pulseSpeed + this.pulseSeed) * 0.1;
                const fgWidth = fgCanvas ? fgCanvas.width : window.innerWidth;
                if (this.y < -30) this.init(false);
                if (this.x < -30) this.x = fgWidth + 20;
                else if (this.x > fgWidth + 30) this.x = -20;
            }
            draw(mouseX, mouseY) {
                if (!fgCtx) return;
                const parallaxOffsetX = -mouseX * 25;
                const parallaxOffsetY = -mouseY * 20;
                fgCtx.beginPath();
                fgCtx.arc(this.x + parallaxOffsetX, this.y + parallaxOffsetY, this.size, 0, Math.PI * 2);
                fgCtx.fillStyle = `rgba(255, 250, 240, ${Math.max(0.02, this.alpha)})`;
                fgCtx.shadowBlur = this.size * 4; 
                fgCtx.shadowColor = "rgba(255, 230, 200, 0.6)";
                fgCtx.fill();
            }
        }

        for (let i = 0; i < numParticles; i++) { particles.push(new Particle()); }
        for (let i = 0; i < numFgParticles; i++) { fgParticles.push(new ForegroundParticle()); }

        function animate() {
            fgCurrentX += (targetX - fgCurrentX) * fgEase;
            fgCurrentY += (targetY - fgCurrentY) * fgEase;

            midCurrentX += (targetX - midCurrentX) * midEase;
            midCurrentY += (targetY - midCurrentY) * midEase;

            const time = Date.now() * 0.002;
            const breathCycle = Math.sin(time) * 0.02; 
            const distFromCenter = Math.sqrt(fgCurrentX * fgCurrentX + fgCurrentY * fgCurrentY);

            const rotateX = fgCurrentY * -2.1;
            const rotateY = fgCurrentX * 7.875;
            if (container) container.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

            const bgX = midCurrentX * 18.9;
            const bgY = midCurrentY * 12.6;
            const wallRotateY = fgCurrentX * -5.25; 
            const wallRotateX = fgCurrentY * 3.15;
            const bgScale = 1.15 + Math.abs(fgCurrentY) * 0.084 + Math.abs(fgCurrentX) * 0.0525;
            if (bg) bg.style.transform = `translate3d(${bgX.toFixed(2)}px, ${bgY.toFixed(2)}px, -500px) rotateX(${wallRotateX.toFixed(2)}deg) rotateY(${wallRotateY.toFixed(2)}deg) scale(${bgScale.toFixed(3)})`;

            const ceilingX = midCurrentX * 31.5;
            const ceilingY = midCurrentY * 15.75;
            if (glowCeiling) glowCeiling.style.transform = `translateX(calc(-50% + ${ceilingX.toFixed(2)}px)) translateY(${ceilingY.toFixed(2)}px) translateZ(-100px)`;

            const lightShiftX = 50 + (fgCurrentX * 26.25);
            const lightShiftY = 40 + (fgCurrentY * 21);
            if (wallLighting) wallLighting.style.background = `radial-gradient(circle at ${lightShiftX.toFixed(1)}% ${lightShiftY.toFixed(1)}%, rgba(255, 255, 255, 0.04) 0%, rgba(0, 0, 0, 0.25) 100%)`;

            const shadowX = fgCurrentX * 115.5;
            const baseShadowScaleY = 1 - (fgCurrentY * 0.231) + breathCycle; 
            const shadowScaleX = 1 + (Math.abs(fgCurrentX) * 0.1575);
            const shadowOpacity = Math.min(1.0, Math.max(0.65, 0.95 - (fgCurrentY * 0.21) - (breathCycle * 2)));
            const shadowBlur = Math.max(8, 14.7 + (fgCurrentY * 6.3) + (breathCycle * 4));

            if (shadow) {
                shadow.style.transform = `translateX(calc(-50% + ${shadowX.toFixed(2)}px)) scale(${shadowScaleX.toFixed(3)}, ${Math.max(0.4, baseShadowScaleY).toFixed(3)})`;
                shadow.style.opacity = shadowOpacity.toFixed(2);
                shadow.style.filter = `blur(${shadowBlur.toFixed(1)}px)`;
            }

            const mlX = midCurrentX * 84;
            const mlY = midCurrentY * 26.25;
            if (midLeft) midLeft.style.transform = `translate3d(${mlX.toFixed(2)}px, ${mlY.toFixed(2)}px, 60px) scale(1.344)`;
            if (shadowLeft) shadowLeft.style.transform = `translateX(${(mlX * 0.85).toFixed(2)}px) scaleX(${(1 + fgCurrentX * 0.126).toFixed(3)})`;

            const mrX = midCurrentX * 57.75; 
            const mrY = (midCurrentY * 18.9) + 10;
            if (midRight) midRight.style.transform = `translate(${mrX.toFixed(2)}px, ${mrY.toFixed(2)}px)`;
            if (shadowRight) shadowRight.style.transform = `translateX(${(mrX * 0.85).toFixed(2)}px)`;

            const frX = midCurrentX * 42.0; 
            const frY = (midCurrentY * 14.0) + 15;
            if (farRight) {
                farRight.style.transform = `translate3d(${frX.toFixed(2)}px, ${frY.toFixed(2)}px, 40px) scale(1.1)`;
            }

            const baseFgScale = 0.9975; 
            const dynamicScale = baseFgScale - (fgCurrentY * 0.063) + (Math.abs(fgCurrentX) * 0.0315) + (breathCycle * 0.21);
            const fgX = fgCurrentX * 120.75;
            const fgY = fgCurrentY * 36.75;
            if (fg) {
                fg.style.transform = `translate3d(${fgX.toFixed(2)}px, ${fgY.toFixed(2)}px, 150px) scale(${dynamicScale.toFixed(3)})`;
                const smokeRimBlur = (18 + (distFromCenter * 12)) * 1.05; 
                const smokeRimOpacity = 0.10 + (distFromCenter * 0.185); 
                const fgContrast = 1.08 + (distFromCenter * 0.084); 
                const fgShadowOffsetY = 47.25 + (fgCurrentY * 15.75);
                fg.style.filter = `drop-shadow(0 ${fgShadowOffsetY.toFixed(1)}px 63px rgba(0, 0, 0, 0.98)) drop-shadow(0 0 ${smokeRimBlur.toFixed(0)}px rgba(180, 190, 200, ${smokeRimOpacity.toFixed(2)})) contrast(${fgContrast.toFixed(2)})`;
            }

            const glintOffsetX = fgCurrentX * 36.75;
            const glintOffsetY = fgCurrentY * 26.25;
            const glintScale = (0.8 + (distFromCenter * 0.6) + (isFlashing ? 1.8 : 0)) * 1.05;
            const glintAlpha = isFlashing ? 1.0 : Math.min(0.85, 0.25 + (distFromCenter * 0.5));

            if (lensGlint) {
                lensGlint.style.transform = `translate3d(${glintOffsetX.toFixed(1)}px, ${glintOffsetY.toFixed(1)}px, 220px) scale(${glintScale.toFixed(2)})`;
                lensGlint.style.opacity = glintAlpha.toFixed(2);
            }

            if (lightSweep) {
                lightSweep.style.transform = `translate(${(fgCurrentX * -94.5).toFixed(2)}px, ${(fgCurrentY * -47.25).toFixed(2)}px)`;
            }

            if (smokeCtx && smokeCanvas) {
                smokeCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
                smokePuffs.forEach(sp => { sp.update(); sp.draw(); });
            }
            if (ctx && canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => { p.update(); p.draw(); });
            }
            if (fgCtx && fgCanvas) {
                fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);
                fgParticles.forEach(fp => { fp.update(); fp.draw(fgCurrentX, fgCurrentY); });
            }

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();
    }

    return { init };
})();