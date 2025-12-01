import { Overworld } from './overworld/Overworld.js';

// Game configuration
const CONFIG = {
    TILE_SIZE: 16,
    SCALE: 3,
    CANVAS_WIDTH: 240,
    CANVAS_HEIGHT: 160
};

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = CONFIG.CANVAS_WIDTH * CONFIG.SCALE;
        this.canvas.height = CONFIG.CANVAS_HEIGHT * CONFIG.SCALE;
        
        // Scale context for pixel art
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.scale(CONFIG.SCALE, CONFIG.SCALE);
        
        // Initialize game systems
        this.overworld = new Overworld(this.ctx, CONFIG);
        
        // Input state
        this.keys = {};
        this.setupInput();
        
        // Start game loop
        this.lastTime = 0;
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
    }
    
    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Update
        this.overworld.update(deltaTime, this.keys);
        
        // Render
        this.ctx.fillStyle = '#87CEEB'; // Sky blue background
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        this.overworld.render();
        
        requestAnimationFrame(this.gameLoop);
    }
}

// Start game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
