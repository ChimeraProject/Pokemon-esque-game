/**
 * Player Character Class
 * Handles player movement, animation, and collision
 * Inspired by Zelda3's player.c
 */

import { CONFIG, TILE_TYPES } from '../config.js';

export class Player {
  constructor(map) {
    // Position (in pixels)
    this.x = 120;      // Start at map center
    this.y = 80;
    this.width = 16;
    this.height = 16;

    // Velocity
    this.vx = 0;
    this.vy = 0;

    // State
    this.direction = 'down';
    this.isMoving = false;
    this.map = map;

    // Animation
    this.animFrame = 0;
    this.animSpeed = 0.1;
  }

  /**
   * Move player up
   */
  moveUp() {
    this.direction = 'up';
    this.vy = -CONFIG.physics.moveSpeed;
  }

  /**
   * Move player down
   */
  moveDown() {
    this.direction = 'down';
    this.vy = CONFIG.physics.moveSpeed;
  }

  /**
   * Move player left
   */
  moveLeft() {
    this.direction = 'left';
    this.vx = -CONFIG.physics.moveSpeed;
  }

  /**
   * Move player right
   */
  moveRight() {
    this.direction = 'right';
    this.vx = CONFIG.physics.moveSpeed;
  }

  /**
   * Update player position and collision
   */
  update(deltaTime, map) {
    // Apply velocity
    let newX = this.x + this.vx;
    let newY = this.y + this.vy;

    // Collision detection (tile-based)
    if (this.canMoveTo(newX, newY, map)) {
      this.x = newX;
      this.y = newY;
      this.isMoving = true;
    } else {
      this.isMoving = false;
    }

    // Apply friction
    this.vx *= CONFIG.physics.friction;
    this.vy *= CONFIG.physics.friction;

    // Stop very small velocity
    if (Math.abs(this.vx) < 0.01) this.vx = 0;
    if (Math.abs(this.vy) < 0.01) this.vy = 0;

    // Update animation
    if (this.isMoving) {
      this.animFrame += this.animSpeed;
      if (this.animFrame >= 4) this.animFrame = 0;
    } else {
      this.animFrame = 0;
    }

    // Clamp to map bounds
    this.x = Math.max(0, Math.min(this.x, map.width * CONFIG.tile.size - this.width));
    this.y = Math.max(0, Math.min(this.y, map.height * CONFIG.tile.size - this.height));
  }

  /**
   * Check if player can move to position
   */
  canMoveTo(newX, newY, map) {
    // Convert pixel position to tile coordinates
    const tileX = Math.floor(newX / CONFIG.tile.size);
    const tileY = Math.floor(newY / CONFIG.tile.size);

    // Check bounds
    if (tileX < 0 || tileY < 0 || tileX >= map.width || tileY >= map.height) {
      return false;
    }

    // Check collision
    const tileType = map.getTile(tileX, tileY);
    return !map.isCollision(tileType);
  }

  /**
   * Render player
   */
  render(ctx) {
    // Simple colored rectangle (placeholder for sprite)
    const color = this.isMoving ? '#4CAF50' : '#45a049';
    
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw direction indicator
    ctx.fillStyle = '#FFD700';
    const size = 2;
    
    switch (this.direction) {
      case 'up':
        ctx.fillRect(this.x + 7, this.y + 2, 2, 2);
        break;
      case 'down':
        ctx.fillRect(this.x + 7, this.y + 12, 2, 2);
        break;
      case 'left':
        ctx.fillRect(this.x + 2, this.y + 7, 2, 2);
        break;
      case 'right':
        ctx.fillRect(this.x + 12, this.y + 7, 2, 2);
        break;
    }

    // Draw debug info if enabled
    if (CONFIG.debug.showCollision) {
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}
