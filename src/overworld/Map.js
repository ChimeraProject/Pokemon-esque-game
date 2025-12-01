/**
 * Map/Tilemap Class - Handles tile-based map rendering
 * Inspired by Zelda3's tile system
 */

import { CONFIG, TILE_TYPES } from '../config.js';
import { TilesetManager } from '../graphics/TilesetManager.js';

export class Map {
  constructor() {
    this.width = CONFIG.tile.width;   // 15 tiles
    this.height = CONFIG.tile.height; // 10 tiles
    this.tileSize = CONFIG.tile.size; // 16 pixels

    // Simple test map (Route 29 style)
    // 0 = Grass, 1 = Water, 2 = Wall/Tree, 3 = Path
    this.tiles = this.generateTestMap();
    
    // Initialize tileset manager
    this.tilesetManager = new TilesetManager();
    this.tilesetManager.loadTileset().catch(err => {
      console.warn('Failed to load tileset, using fallback rendering:', err);
    });
    
    console.log(`🗺️  Map created: ${this.width}x${this.height} tiles`);
  }

  /**
   * Generate a Route 29 style map (Pokémon HeartGold starting area)
   */
  generateTestMap() {
    const tiles = [];
    const W = TILE_TYPES.WATER;   // Water (north boundary)
    const G = TILE_TYPES.GRASS;   // Grass (wild Pokemon)
    const P = TILE_TYPES.PATH;    // Path (safe walkway)
    const T = TILE_TYPES.TREE;    // Tree (obstacle)
    const R = TILE_TYPES.WALL;    // Wall/Rock (boundary)

    // Create Route 29: Starting area with path leading down, trees on sides, grass in middle
    const mapData = [
      [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],  // Row 0: Water (north)
      [R, T, T, G, G, G, G, G, G, G, T, T, T, T, R],  // Row 1: Trees and grass
      [R, T, P, P, P, P, P, P, P, G, G, G, T, T, R],  // Row 2: Main path
      [R, T, P, G, G, G, G, G, P, G, G, G, T, T, R],  // Row 3: Path with grass pockets
      [R, G, P, G, G, G, G, G, P, G, G, G, G, T, R],  // Row 4: Grassy area
      [R, G, P, G, G, G, G, G, P, G, G, G, G, G, R],  // Row 5: Open grass
      [R, G, G, G, G, G, G, G, P, G, G, G, G, G, R],  // Row 6: Path curves
      [R, G, G, G, G, G, G, G, P, P, P, G, G, G, R],  // Row 7: Path to south
      [R, G, G, G, T, G, G, G, G, G, P, G, G, G, R],  // Row 8: Tree obstacle
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R, R],  // Row 9: South boundary
    ];

    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        row.push(mapData[y][x]);
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

    // Use tileset if loaded, otherwise fallback to color rendering
    if (this.tilesetManager && this.tilesetManager.isLoaded()) {
      const tileIndex = this.tilesetManager.getTileIndex(type);
      this.tilesetManager.drawTile(ctx, tileIndex, x, y);
    } else {
      // Fallback rendering with solid colors
      this.renderTileFallback(ctx, x, y, type);
    }
  }

  /**
   * Fallback tile rendering (when tileset not loaded)
   * Uses Pokemon Ruby/HeartGold inspired colors
   */
  renderTileFallback(ctx, x, y, type) {
    const size = this.tileSize;

    switch (type) {
      case TILE_TYPES.GRASS:
        // Bright green Pokemon grass
        ctx.fillStyle = '#38A800';
        ctx.fillRect(x, y, size, size);
        // Add grass blade variations for texture
        ctx.fillStyle = '#2D8C00';
        ctx.fillRect(x + 2, y + 2, 2, 2);
        ctx.fillRect(x + 10, y + 10, 2, 2);
        ctx.fillStyle = '#419900';
        ctx.fillRect(x + 4, y + 12, 2, 2);
        ctx.fillRect(x + 12, y + 4, 2, 2);
        // Light grass spots
        ctx.fillStyle = '#47B800';
        ctx.fillRect(x + 6, y + 6, 1, 1);
        ctx.fillRect(x + 11, y + 7, 1, 1);
        break;

      case TILE_TYPES.WATER:
        // Deep blue Pokemon water
        ctx.fillStyle = '#0088FF';
        ctx.fillRect(x, y, size, size);
        // Wave animation effect
        ctx.fillStyle = '#0066DD';
        ctx.fillRect(x + 1, y + 6, 3, 1);
        ctx.fillRect(x + 8, y + 4, 3, 1);
        ctx.fillRect(x + 12, y + 9, 3, 1);
        // Light reflection
        ctx.fillStyle = '#00BBFF';
        ctx.fillRect(x + 5, y + 2, 2, 2);
        ctx.fillRect(x + 11, y + 12, 2, 2);
        break;

      case TILE_TYPES.PATH:
        // Tan/beige path like Route 29
        ctx.fillStyle = '#D2B48C';
        ctx.fillRect(x, y, size, size);
        // Path texture variations
        ctx.fillStyle = '#C19A6B';
        ctx.fillRect(x + 2, y + 2, 2, 2);
        ctx.fillRect(x + 10, y + 8, 2, 2);
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(x + 6, y + 10, 2, 2);
        break;

      case TILE_TYPES.TREE:
        // Brown trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 5, y + 10, 6, 6);
        // Green foliage - darker shade
        ctx.fillStyle = '#1B6B1B';
        ctx.beginPath();
        ctx.arc(x + 8, y + 5, 7, 0, Math.PI * 2);
        ctx.fill();
        // Lighter green highlights
        ctx.fillStyle = '#2D8C2D';
        ctx.fillRect(x + 5, y + 3, 6, 4);
        break;

      case TILE_TYPES.WALL:
      default:
        // Stone/rock wall
        ctx.fillStyle = '#808080';
        ctx.fillRect(x, y, size, size);
        // Stone brick pattern
        ctx.fillStyle = '#696969';
        ctx.fillRect(x + 1, y + 1, 7, 7);
        ctx.fillRect(x + 8, y + 8, 7, 7);
        // Light stone highlight
        ctx.fillStyle = '#A9A9A9';
        ctx.fillRect(x + 8, y + 1, 7, 7);
        ctx.fillRect(x + 1, y + 8, 7, 7);
        break;
    }
  }
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
