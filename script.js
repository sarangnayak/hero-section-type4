document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');
    
    const dpr = window.devicePixelRatio || 1;
    
    let resolution = 20;
    let cols, rows;
    let snakes = [];
    const numSnakes = 15;

    // Reduced motion state
    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setup() {
        // Set canvas size with device pixel ratio for crisp rendering
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        // Scale context to account for DPR
        ctx.scale(dpr, dpr);
        
        // Calculate grid
        cols = Math.floor(width / resolution);
        rows = Math.floor(height / resolution);
        
        // Initialize snakes
        snakes = [];
        for (let i = 0; i < numSnakes; i++) {
            snakes.push(new Snake());
        }
    }

    class Snake {
        constructor() {
            this.body = [{
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows)
            }];
            this.directions = ['up', 'down', 'left', 'right'];
            this.direction = this.directions[Math.floor(Math.random() * 4)];
            this.hue = 260 + Math.random() * 60; // Purple to Magenta range
            this.length = Math.floor(Math.random() * 15) + 5;
            // New properties to control speed independently of frame rate
            this.speed = Math.floor(Math.random() * 3) + 4; // Value between 4-6
            this.updateCounter = 0;
        }

        update() {
            // This counter slows down the snake's movement logic
            this.updateCounter++;
            if (this.updateCounter % this.speed === 0) {
                const head = { ...this.body[0] };

                // Occasionally change direction
                if (Math.random() < 0.05) {
                    this.direction = this.directions[Math.floor(Math.random() * 4)];
                }

                switch (this.direction) {
                    case 'up': head.y--; break;
                    case 'down': head.y++; break;
                    case 'left': head.x--; break;
                    case 'right': head.x++; break;
                }

                // Wrap around edges
                if (head.x < 0) head.x = cols - 1;
                if (head.x >= cols) head.x = 0;
                if (head.y < 0) head.y = rows - 1;
                if (head.y >= rows) head.y = 0;

                this.body.unshift(head);

                if (this.body.length > this.length) {
                    this.body.pop();
                }
            }
        }

        draw() {
            this.body.forEach((segment, index) => {
                const lightness = 50 + (index / this.body.length) * 20;
                ctx.fillStyle = `hsla(${this.hue}, 90%, ${lightness}%, 0.8)`;
                ctx.fillRect(segment.x * resolution, segment.y * resolution, resolution, resolution);
            });
        }
    }

    function gameLoop() {
        // Stop animation if reduced motion is enabled
        if (reducedMotion) {
            // Draw a static frame if needed
            if (snakes.length > 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                snakes.forEach(snake => snake.draw());
            }
            return; // Exit the loop
        }

        // The loop now runs on every frame for smooth rendering
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw snakes
        snakes.forEach(snake => {
            snake.update();
            snake.draw();
        });
        
        requestAnimationFrame(gameLoop);
    }

    // Initialize and start animation
    setup();
    requestAnimationFrame(gameLoop);
    
    // Handle window resize with debouncing for performance
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setup();
        }, 250);
    });

    // GSAP Animations for hero text
    gsap.fromTo('.hero-title', 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );
    
    gsap.fromTo('.hero-subtitle', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1.2, delay: 0.3, ease: "power2.out" }
    );
    
    gsap.fromTo('.social-links a', 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.6, ease: "back.out(1.7)" }
    );

    // Reduced motion toggle
    const motionToggle = document.getElementById('motionToggle');
    motionToggle.addEventListener('click', () => {
        reducedMotion = !reducedMotion;
        motionToggle.innerHTML = reducedMotion ? 
            '<i class="fas fa-play"></i> Enable Motion' : 
            '<i class="fas fa-pause"></i> Disable Motion';
        
        if (!reducedMotion) {
            // Restart animation loop if motion is re-enabled
            requestAnimationFrame(gameLoop);
        }
    });

    // Page transition simulation (for future navigation)
    function simulatePageTransition() {
        const pageTransition = document.getElementById('pageTransition');
        pageTransition.classList.add('active');
        
        setTimeout(() => {
            pageTransition.classList.remove('active');
        }, 600);
    }

    // Example: Simulate page transition after 5 seconds for demo
    setTimeout(simulatePageTransition, 5000);
});


