/**
 * AssetLoader - Efficient asset loading for browser games
 * Inspired by VVVVVV's HTML5 approach
 */

/**
 * Asset types
 */
export const ASSET_TYPE = {
    IMAGE: 'image',
    AUDIO: 'audio',
    JSON: 'json'
};

/**
 * AssetLoader class - Handles loading and caching of game assets
 */
export class AssetLoader {
    constructor() {
        // Asset caches
        this.images = new Map();
        this.audio = new Map();
        this.data = new Map();
        
        // Loading state
        this.loadingQueue = [];
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.isLoading = false;
        this.errors = [];
        
        // Progress callback
        this.onProgress = null;
        this.onComplete = null;
        this.onError = null;
    }

    /**
     * Queue an image for loading
     * @param {string} key - Unique identifier
     * @param {string} src - Image source URL
     */
    queueImage(key, src) {
        this.loadingQueue.push({
            type: ASSET_TYPE.IMAGE,
            key,
            src
        });
    }

    /**
     * Queue audio for loading
     * @param {string} key 
     * @param {string} src 
     */
    queueAudio(key, src) {
        this.loadingQueue.push({
            type: ASSET_TYPE.AUDIO,
            key,
            src
        });
    }

    /**
     * Queue JSON data for loading
     * @param {string} key 
     * @param {string} src 
     */
    queueJSON(key, src) {
        this.loadingQueue.push({
            type: ASSET_TYPE.JSON,
            key,
            src
        });
    }

    /**
     * Start loading all queued assets
     * @returns {Promise<void>}
     */
    async loadAll() {
        if (this.loadingQueue.length === 0) {
            if (this.onComplete) this.onComplete();
            return;
        }

        this.isLoading = true;
        this.totalAssets = this.loadingQueue.length;
        this.loadedAssets = 0;
        this.errors = [];

        const promises = this.loadingQueue.map(asset => this.loadAsset(asset));
        
        try {
            await Promise.all(promises);
        } catch (error) {
            console.error('Asset loading failed:', error);
        }

        this.loadingQueue = [];
        this.isLoading = false;

        if (this.onComplete) {
            this.onComplete();
        }
    }

    /**
     * Load a single asset
     * @param {Object} asset 
     * @returns {Promise<void>}
     */
    async loadAsset(asset) {
        try {
            switch (asset.type) {
                case ASSET_TYPE.IMAGE:
                    await this.loadImage(asset.key, asset.src);
                    break;
                case ASSET_TYPE.AUDIO:
                    await this.loadAudio(asset.key, asset.src);
                    break;
                case ASSET_TYPE.JSON:
                    await this.loadJSON(asset.key, asset.src);
                    break;
            }
            
            this.loadedAssets++;
            
            if (this.onProgress) {
                this.onProgress(this.loadedAssets, this.totalAssets);
            }
        } catch (error) {
            this.errors.push({ asset, error });
            if (this.onError) {
                this.onError(asset, error);
            }
        }
    }

    /**
     * Load an image
     * @param {string} key 
     * @param {string} src 
     * @returns {Promise<HTMLImageElement>}
     */
    loadImage(key, src) {
        return new Promise((resolve, reject) => {
            if (this.images.has(key)) {
                resolve(this.images.get(key));
                return;
            }

            const img = new Image();
            
            img.onload = () => {
                this.images.set(key, img);
                resolve(img);
            };
            
            img.onerror = () => {
                reject(new Error(`Failed to load image: ${src}`));
            };
            
            img.src = src;
        });
    }

    /**
     * Load audio
     * @param {string} key 
     * @param {string} src 
     * @returns {Promise<HTMLAudioElement>}
     */
    loadAudio(key, src) {
        return new Promise((resolve, reject) => {
            if (this.audio.has(key)) {
                resolve(this.audio.get(key));
                return;
            }

            const audio = new Audio();
            
            audio.oncanplaythrough = () => {
                this.audio.set(key, audio);
                resolve(audio);
            };
            
            audio.onerror = () => {
                reject(new Error(`Failed to load audio: ${src}`));
            };
            
            audio.src = src;
            audio.load();
        });
    }

    /**
     * Load JSON data
     * @param {string} key 
     * @param {string} src 
     * @returns {Promise<Object>}
     */
    async loadJSON(key, src) {
        if (this.data.has(key)) {
            return this.data.get(key);
        }

        const response = await fetch(src);
        if (!response.ok) {
            throw new Error(`Failed to load JSON: ${src}`);
        }
        
        const data = await response.json();
        this.data.set(key, data);
        return data;
    }

    /**
     * Get a loaded image
     * @param {string} key 
     * @returns {HTMLImageElement|null}
     */
    getImage(key) {
        return this.images.get(key) || null;
    }

    /**
     * Get loaded audio
     * @param {string} key 
     * @returns {HTMLAudioElement|null}
     */
    getAudio(key) {
        return this.audio.get(key) || null;
    }

    /**
     * Get loaded JSON data
     * @param {string} key 
     * @returns {Object|null}
     */
    getData(key) {
        return this.data.get(key) || null;
    }

    /**
     * Play an audio clip
     * @param {string} key 
     * @param {Object} options 
     */
    playAudio(key, options = {}) {
        const {
            volume = 1.0,
            loop = false
        } = options;

        const audio = this.audio.get(key);
        if (!audio) return;

        // Clone audio for overlapping playback
        const clone = audio.cloneNode(true);
        clone.volume = volume;
        clone.loop = loop;
        clone.play().catch(() => {
            // Ignore autoplay restrictions
        });

        return clone;
    }

    /**
     * Get loading progress (0-1)
     * @returns {number}
     */
    getProgress() {
        if (this.totalAssets === 0) return 1;
        return this.loadedAssets / this.totalAssets;
    }

    /**
     * Check if all assets are loaded
     * @returns {boolean}
     */
    isComplete() {
        return !this.isLoading && this.loadingQueue.length === 0;
    }

    /**
     * Clear all cached assets
     */
    clearCache() {
        this.images.clear();
        this.audio.clear();
        this.data.clear();
    }

    /**
     * Generate a placeholder sprite sheet (for missing assets)
     * @param {number} width 
     * @param {number} height 
     * @param {string} color 
     * @returns {HTMLCanvasElement}
     */
    generatePlaceholder(width, height, color = '#FF00FF') {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        
        // Add checkerboard pattern to indicate missing texture
        ctx.fillStyle = '#000';
        const gridSize = 4;
        for (let y = 0; y < height; y += gridSize * 2) {
            for (let x = 0; x < width; x += gridSize * 2) {
                ctx.fillRect(x, y, gridSize, gridSize);
                ctx.fillRect(x + gridSize, y + gridSize, gridSize, gridSize);
            }
        }
        
        return canvas;
    }
}
