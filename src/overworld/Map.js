/**
 * Map/Tilemap Class - Handles tile-based map rendering
 * Inspired by Zelda3's tile system
 */

import { CONFIG, TILE_TYPES } from '../config.js';

export class Map {
  constructor() {
    this.width = CONFIG.tile.width;   // 15 tiles
    this.height = CONFIG.tile.height; // 10 tiles
    this.tileSize = CONFIG.tile.size; // 16 pixels

    // Simple test map (Route 29 style)
    // 0 = Grass, 1 = Water, 2 = Wall/Tree, 3 = Path
    this.tiles = this.generateTestMap();
    
    console.log(`🗺️  Map created: ${this.width}x${this.height} tiles`);
  }

  /**
   * Generate a test map
   */
  generateTestMap() {
    const tiles = [];
    
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        // Create simple layout
        if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
          row.push(TILE_TYPES.WATER); // Border
        } else if (x === 7 && y === 5) {
          row.push(TILE_TYPES.TREE); // Tree
        } else if ((x === 7 || x === 8) && (y >= 3 && y <= 7)) {
          row.push(TILE_TYPES.PATH); // Path
        } else {
          row.push(TILE_TYPES.GRASS); // Grass
        }
      }
      tiles.push(row);
    }

    return tiles;
  }

  /**
   * Get tile at position
   */
  getTile(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return TILE_TYPES.WALL;
    }
    return this.tiles[y][x];
  }

  /**
   * Set tile at position
   */
  setTile(x, y, type) {
    if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
      this.tiles[y][x] = type;
    }
  }

  /**
   * Check if tile type is solid
   */
  isCollision(tileType) {
    return tileType === TILE_TYPES.WATER || 
           tileType === TILE_TYPES.WALL || 
           tileType === TILE_TYPES.TREE;
  }

  /**
   * Render map
   */
  render(ctx, playerX, playerY) {
    // Render all visible tiles
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tileType = this.tiles[y][x];
        const pixelX = x * this.tileSize;
        const pixelY = y * this.tileSize;

        this.renderTile(ctx, pixelX, pixelY, tileType);
      }
    }

    // Render grid if debug enabled
    if (CONFIG.debug.showGrid) {
      this.renderDebugGrid(ctx);
    }
  }

  /**
   * Render single tile
   */
  renderTile(ctx, x, y, type) {
    const size = this.tileSize;

    switch (type) {
      case TILE_TYPES.GRASS:
        ctx.fillStyle = '#2D5016';
        ctx.fillRect(x, y, size, size);
        // Add grass texture
        ctx.fillStyle = '#3D6B1F';
        ctx.fillRect(x + 2, y + 2, 2, 2);
        ctx.fillRect(x + 10, y + 8, 2, 2);
        break;

      case TILE_TYPES.WATER:
        ctx.fillStyle = '#1E90FF';
        ctx.fillRect(x, y, size, size);
        // Wave pattern
        ctx.strokeStyle = '#0077BE';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 2, y + 8);
        ctx.lineTo(x + 14, y + 8);
        ctx.stroke();
        break;

      case TILE_TYPES.PATH:
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#A0826D';
        ctx.fillRect(x + 4, y + 4, 8, 8);
        break;

      case TILE_TYPES.TREE:
        ctx.fillStyle = '#654321';
        ctx.fillRect(x + 4, y + 8, 8, 8);
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(x + 8, y + 6, 6, 0, Math.PI * 2);
        ctx.fill();
        break;

      case TILE_TYPES.WALL:
      default:
        ctx.fillStyle = '#555555';
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, size, size);
        break;
    }
  }

  /**
   * Render debug grid
   */
  renderDebugGrid(ctx) {
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.font = '8px Arial';
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const pixelX = x * this.tileSize;
        const pixelY = y * this.tileSize;

        ctx.strokeRect(pixelX, pixelY, this.tileSize, this.tileSize);
        ctx.fillText(`${x},${y}`, pixelX + 2, pixelY + 8);
      }
    }
  }
}
