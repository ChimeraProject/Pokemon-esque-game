/**
 * Pokemon HeartGold Clone - Main Game File
 * 
 * Game Loop Structure (inspired by Zelda3):
 * 1. Input Handling (WASD/Arrows for movement)
 * 2. Update Logic (player position, animations, state)
 * 3. Collision Detection (tile-based)
 * 4. Render (canvas drawing)
 * 5. Frame Rate Control
 */

import { CONFIG, TILE_TYPES } from './config.js';
import { OverworldScene } from './overworld/Overworld.js';
import { BattleScene } from './battles/BattleScene.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Scale canvas for display
    this.canvas.width = CONFIG.canvas.width;
    this.canvas.height = CONFIG.canvas.height;
    this.canvas.style.width = CONFIG.canvas.targetWidth + 'px';
    this.canvas.style.height = CONFIG.canvas.targetHeight + 'px';

    this.currentScene = null;
    this.gameState = 'overworld'; // 'overworld', 'battle', 'menu'
    this.running = false;
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
    this.fps = 0;
    this.deltaTime = 0;

    this.setupInput();
    this.initScene('overworld');
    this.start();
  }

  /**
   * Setup input handling (WASD, Arrows, Enter, etc.)
   * Similar to Zelda3's input.c approach
   */
  setupInput() {
    this.keys = {};
    this.input = {
      up: false,
      down: false,
      left: false,
      right: false,
      interact: false,
      menu: false
    };

    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      this.updateInput();
      if (CONFIG.debug.logInput) {
        console.log('Key down:', e.key);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
      this.updateInput();
    });
  }

  /**
   * Convert raw key input to game input state
   */
  updateInput() {
    this.input.up = this.keys['w'] || this.keys['W'] || this.keys['ArrowUp'];
    this.input.down = this.keys['s'] || this.keys['S'] || this.keys['ArrowDown'];
    this.input.left = this.keys['a'] || this.keys['A'] || this.keys['ArrowLeft'];
    this.input.right = this.keys['d'] || this.keys['D'] || this.keys['ArrowRight'];
    this.input.interact = this.keys['Enter'] || this.keys[' '];
    this.input.menu = this.keys['m'] || this.keys['M'];
  }

  /**
   * Initialize game scene
   */
  initScene(sceneType, isReturnFromBattle = false) {
    if (sceneType === 'overworld') {
      this.currentScene = new OverworldScene(this, isReturnFromBattle);
      this.gameState = 'overworld';
    } else if (sceneType === 'battle') {
      // Battle scene is initialized via onEncounter
      this.gameState = 'battle';
    }
  }

  /**
   * Handle Pokemon encounter
   */
  onEncounter(wildPokemon) {
    // Create player Pokemon (placeholder - will expand later)
    const playerPokemon = {
      species: 'cyndaquil',
      name: 'Cyndaquil',
      id: 155,
      level: 5,
      type: ['fire'],
      stats: {
        hp: 40,
        atk: 53,
        def: 44,
        spa: 61,
        spd: 51,
        spe: 66
      },
      currentHp: 40,
      maxHp: 40,
      moves: [
        { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, pp: 35, maxPp: 35, category: 'physical' },
        { name: 'Leer', type: 'normal', power: 0, accuracy: 100, pp: 30, maxPp: 30, category: 'status' }
      ]
    };

    this.currentScene = new BattleScene(this, playerPokemon, wildPokemon);
    this.gameState = 'battle';
  }

  /**
   * Return to overworld after battle
   */
  returnToOverworld() {
    this.initScene('overworld', true); // true = returning from battle, use longer delay
  }

  /**
   * Main game loop
   * Inspired by Zelda3's NMI (non-maskable interrupt) timing
   */
  update(deltaTime) {
    // 1. Handle input
    if (this.currentScene && this.currentScene.handleInput) {
      this.currentScene.handleInput(this.input);
    }

    // 2. Update scene logic
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(deltaTime);
    }

    // 3. Render
    this.render();
  }

  /**
   * Render current scene
   */
  render() {
    // Clear canvas (black background)
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw scene
    if (this.currentScene && this.currentScene.render) {
      this.currentScene.render(this.ctx);
    }

    // Draw debug grid if enabled
    if (CONFIG.debug.showGrid) {
      this.drawGrid();
    }

    // Update UI
    this.updateUI();
  }

  /**
   * Draw debug grid
   */
  drawGrid() {
    this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
    this.ctx.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x <= CONFIG.canvas.width; x += CONFIG.tile.size) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, CONFIG.canvas.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= CONFIG.canvas.height; y += CONFIG.tile.size) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(CONFIG.canvas.width, y);
      this.ctx.stroke();
    }
  }

  /**
   * Update UI overlay (FPS, position, etc.)
   */
  updateUI() {
    if (this.currentScene && this.currentScene.player) {
      const player = this.currentScene.player;
      document.getElementById('px').textContent = Math.floor(player.x / CONFIG.tile.size);
      document.getElementById('py').textContent = Math.floor(player.y / CONFIG.tile.size);
    }
    document.getElementById('state').textContent = this.gameState;
    document.getElementById('fps').textContent = Math.floor(this.fps);
  }

  /**
   * Game loop with frame rate control
   */
  loop() {
    const now = performance.now();
    this.deltaTime = Math.min(now - this.lastFrameTime, 50); // Cap delta time
    this.lastFrameTime = now;

    // Calculate FPS
    this.frameCount++;
    if (this.frameCount % 60 === 0) {
      this.fps = 1000 / (this.deltaTime || 1);
    }

    this.update(this.deltaTime);

    if (this.running) {
      requestAnimationFrame(() => this.loop());
    }
  }

  /**
   * Start the game
   */
  start() {
    this.running = true;
    this.loop();
    console.log('🎮 Pokemon HeartGold Clone started');
  }

  /**
   * Stop the game
   */
  stop() {
    this.running = false;
    console.log('Game stopped');
  }

  /**
   * Change to a different scene
   */
  changeScene(sceneType) {
    this.initScene(sceneType);
  }
}

// Initialize game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});

export { Game };
