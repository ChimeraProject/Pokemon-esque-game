/**
 * Sprite Manager
 * Handles loading and caching Pokemon sprites
 */

export class SpriteManager {
  constructor() {
    this.spriteCache = new Map();
    this.loadingPromises = new Map();
  }

  /**
   * Load a sprite from filesystem
   * @param {string} pokemonName - Name of Pokemon (lowercase)
   * @param {string} perspective - 'front' or 'back'
   * @returns {Promise<Image>}
   */
  async loadSprite(pokemonName, perspective = 'front') {
    const cacheKey = `${pokemonName}_${perspective}`;
    
    // Return cached sprite if available
    if (this.spriteCache.has(cacheKey)) {
      return this.spriteCache.get(cacheKey);
    }
    
    // Return pending promise if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }
    
    // Create loading promise
    const loadPromise = new Promise((resolve, reject) => {
      const img = new Image();
      const path = `/assets/sprites/pokemon/${perspective}/${pokemonName}.png`;
      
      img.onload = () => {
        this.spriteCache.set(cacheKey, img);
        this.loadingPromises.delete(cacheKey);
        resolve(img);
      };
      
      img.onerror = () => {
        console.warn(`Failed to load sprite: ${path}`);
        this.loadingPromises.delete(cacheKey);
        reject(new Error(`Failed to load sprite: ${path}`));
      };
      
      img.src = path;
    });
    
    this.loadingPromises.set(cacheKey, loadPromise);
    return loadPromise;
  }

  /**
   * Preload multiple sprites
   * @param {Array<{name: string, perspective: string}>} sprites
   * @returns {Promise<void>}
   */
  async preloadSprites(sprites) {
    const promises = sprites.map(s => 
      this.loadSprite(s.name, s.perspective)
        .catch(err => console.warn(err))
    );
    await Promise.all(promises);
  }

  /**
   * Draw a sprite on canvas
   * @param {CanvasRenderingContext2D} ctx
   * @param {Image} sprite
   * @param {number} x
   * @param {number} y
   * @param {number} scale - Optional scale factor (default 1)
   */
  drawSprite(ctx, sprite, x, y, scale = 1) {
    if (!sprite || !sprite.complete) return;
    
    const scaledWidth = sprite.width * scale;
    const scaledHeight = sprite.height * scale;
    
    ctx.drawImage(sprite, x - scaledWidth / 2, y - scaledHeight / 2, scaledWidth, scaledHeight);
  }

  /**
   * Get sprite or return placeholder
   * @param {string} pokemonName
   * @param {string} perspective
   * @returns {Image|null}
   */
  getSprite(pokemonName, perspective = 'front') {
    const cacheKey = `${pokemonName}_${perspective}`;
    return this.spriteCache.get(cacheKey) || null;
  }
}
