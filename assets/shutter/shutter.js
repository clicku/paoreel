(function($){
    
    $.fn.tzShutter = function(options){
        
        var supportsCanvas = 'getContext' in document.createElement('canvas');

        options = $.extend({
            openCallback:function(){},
            closeCallback:function(){},
            loadCompleteCallback:function(){},
            hideWhenOpened:true,
            imgSrc: 'assets/shutter/shutter.png'
        },options);
        
        var element = this;
    
        if(!supportsCanvas){
            element.bind('shutterOpen',options.openCallback)
                   .bind('shutterClose',options.closeCallback);
            options.loadCompleteCallback();
            return element;
        }
        
        window.setTimeout(function(){
            
            // Get stable layout dimensions 
            var targetWidth = element.width() || 500;
            var targetHeight = element.height() || 500;

            if (targetWidth === 0 || targetHeight === 0) {
                var vmin = Math.min(window.innerWidth, window.innerHeight);
                targetWidth = vmin * 0.75;
                targetHeight = vmin * 0.75;
            }

            var dpr = window.devicePixelRatio || 1;
            var frames = {num: 15, height: targetHeight, width: targetWidth};

            // 1. STABLE SCALE FACTOR (Ensures structural integrity)
            var scaleFactor = (targetHeight / 500) * 0.60; 

            var slices = {
                num: 8, 
                width: 208 * scaleFactor, 
                height: 250 * scaleFactor, 
                startDeg: 30
            };
            
            var rotateStep = 2*Math.PI/slices.num;
            slices.angleStep = ((90 - slices.startDeg)/frames.num)*Math.PI/180;
            
            var img = new Image();
        
            img.onload = function(){

                window.console && console.time && console.time("Generating Frames");
                
                var film = $('<div>',{
                    className: 'film',
                    css:{
                        position: 'absolute',
                        height: frames.num * 100 + '%', 
                        width: '100%',
                        left: 0,
                        top: 0
                    }
                });

                var animationHolder = $('<div>',{
                    className: 'shutterAnimationHolder',
                    css:{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }
                });
                
                for(var z=0;z<frames.num;z++){
                    var canvas  = document.createElement('canvas'),
                        c       = canvas.getContext("2d");

                    // Set physical canvas display size
                    canvas.style.width = "100%";
                    canvas.style.height = "100%";
                    
                    // Set backing store size considering Device Pixel Ratio for crispness
                    canvas.width = frames.width * dpr;
                    canvas.height = frames.height * dpr;

                    canvas.style.background = "transparent";
                    canvas.style.border = "none";
                    canvas.style.outline = "none";
                    
                    // Scale drawing context to account for DPR
                    c.scale(dpr, dpr);
                    
                    c.clearRect(0, 0, frames.width, frames.height);
    
                    // Translate cleanly to center point
                    c.translate(frames.width/2, frames.height/2);
    
                    for(var i=0;i<slices.num;i++){
                        c.rotate(-rotateStep);
                        c.save();
                        
                        // 2. ZOOM OUT OFFSET: Push the blade pivot points outward away from the center.
                        // Increasing this value (e.g. to 50 or 60) pushes the blades further out.
                        var zoomOutOffset = 45 * scaleFactor;
                        
                        c.translate(0, (frames.height/2) + zoomOutOffset);
                        c.rotate((frames.num-1-z)*slices.angleStep);
                        
                        var offset = 0;
                        if((frames.num-1-z) < 5){
                            offset = (frames.num-1-z)*5 * scaleFactor;
                        }
                        
                        c.drawImage(
                            img, 
                            0, 0, img.width, img.height,
                            Math.floor(-slices.width / 2),
                            Math.floor(-(frames.height / 2 + offset)),
                            Math.ceil(slices.width),
                            Math.ceil(slices.height)
                        );
                        
                        c.restore();
                    }
                    
                    // Center pinhole adjustment (Adapted scale dynamically)
                    if (z === 0) {
                        c.beginPath();
                        c.arc(0, 0, 8 * scaleFactor, 0, 2 * Math.PI); 
                        c.fillStyle = "rgba(0,0,0,0.95)"; 
                        c.fill();
                    }

                    film.append(canvas);
                }
                
                animationHolder.append(film);
                
                if(options.hideWhenOpened){
                    animationHolder.hide();
                }
                
                element.append(animationHolder);
                
                var animating = false;
                
                element.bind('shutterClose',function(){
                    if(animating) return false;
                    animating = true;
                    var count = 0;
                    
                    var close = function(){
                        (function animate(){
                            if(count>=frames.num){
                                animating=false;
                                options.closeCallback.call(element);
                                return false;
                            }
                            film.css('transform', 'translate3d(0, ' + (-(count * 100) / frames.num) + '%, 0)');
                            count++;
                            setTimeout(animate, 60);
                        })();
                    }
                    
                    if(options.hideWhenOpened){
                        animationHolder.fadeIn(60,close);
                    }
                    else close();
                });
                
                element.bind('shutterOpen',function(){
                    if(animating) return false;
                    animating = true;
                    var count = frames.num-1;
                    
                    (function animate(){
                        if(count<0){
                            var hide = function(){
                                animating=false;
                                options.openCallback.call(element);
                            };
                            
                            if(options.hideWhenOpened){
                                animationHolder.fadeOut(400, hide);
                            }
                            else{
                                hide();
                            }
                            return false;
                        }
                        film.css('transform', 'translate3d(0, ' + (-(count * 100) / frames.num) + '%, 0)');
                        count--;
                        setTimeout(animate, 60); 
                    })();
                });

                window.console && console.timeEnd && console.timeEnd("Generating Frames");
                options.loadCompleteCallback();
            };
            
            img.src = options.imgSrc;
            
        },0);
        
        return element;     
    };
    
})(jQuery);