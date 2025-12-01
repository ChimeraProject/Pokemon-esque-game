/**
 * Tileset Manager
 * Handles loading and caching tileset images for rendering
 */

export class TilesetManager {
  constructor() {
    this.tileset = null;
    this.tileSize = 16;
    this.tilesPerRow = 16;
    this.loading = false;
    this.loadPromise = null;
  }

  /**
   * Load tileset image
   */
  async loadTileset(tilesetPath = '/assets/tilesets/pokemon-tileset.png') {
    if (this.tileset) return this.tileset;
    if (this.loading) return this.loadPromise;

    this.loading = true;
    this.loadPromise = new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.tileset = img;
        this.loading = false;
        console.log('✅ Tileset loaded successfully');
        resolve(img);
      };
      
      img.onerror = () => {
        console.warn(`Failed to load tileset: ${tilesetPath}`);
        this.loading = false;
        reject(new Error(`Failed to load tileset: ${tilesetPath}`));
      };
      
      img.src = tilesetPath;
    });

    return this.loadPromise;
  }

  /**
   * Get the tile index for a given tile type
   */
  getTileIndex(tileType) {
    // Map tile types to tileset indices
    const tileMap = {
      0: 0,  // GRASS -> index 0 (grass 1)
      1: 4,  // WATER -> index 4 (water)
      2: 16, // TREE -> index 16 (tree)
      3: 6,  // PATH -> index 6 (path)
      4: 8,  // WALL -> index 8 (rock/wall)
      5: 9,  // SAND -> index 9 (sand)
    };
    return tileMap[tileType] !== undefined ? tileMap[tileType] : 0;
  }

  /**
   * Draw a tile from the tileset onto canvas
   */
  drawTile(ctx, tileIndex, x, y) {
    if (!this.tileset) {
      // Draw placeholder if tileset not loaded
      ctx.fillStyle = '#999';
      ctx.fillRect(x, y, this.tileSize, this.tileSize);
      return;
    }

    const tileX = (tileIndex % this.tilesPerRow) * this.tileSize;
    const tileY = Math.floor(tileIndex / this.tilesPerRow) * this.tileSize;

    ctx.drawImage(
      this.tileset,
      tileX, tileY, this.tileSize, this.tileSize,
      x, y, this.tileSize, this.tileSize
    );
  }

  /**
   * Get tileset status
   */
  isLoaded() {
    return this.tileset !== null;
  }
}
