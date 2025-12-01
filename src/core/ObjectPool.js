/**
 * ObjectPool - Reusable object pooling for performance
 * Reduces garbage collection overhead in browser games
 */

/**
 * ObjectPool class - Generic object pool implementation
 */
export class ObjectPool {
    /**
     * Create an object pool
     * @param {Function} factory - Function that creates new objects
     * @param {Function} reset - Function that resets objects for reuse
     * @param {number} initialSize - Initial pool size
     */
    constructor(factory, reset = null, initialSize = 10) {
        this.factory = factory;
        this.reset = reset || ((obj) => obj);
        this.pool = [];
        this.activeCount = 0;
        
        // Pre-populate pool
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.factory());
        }
    }

    /**
     * Get an object from the pool
     * @returns {Object}
     */
    acquire() {
        let obj;
        
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.factory();
        }
        
        this.activeCount++;
        return obj;
    }

    /**
     * Return an object to the pool
     * @param {Object} obj 
     */
    release(obj) {
        if (!obj) return;
        
        this.reset(obj);
        this.pool.push(obj);
        this.activeCount--;
    }

    /**
     * Release multiple objects
     * @param {Object[]} objects 
     */
    releaseAll(objects) {
        for (const obj of objects) {
            this.release(obj);
        }
    }

    /**
     * Get pool statistics
     * @returns {Object}
     */
    getStats() {
        return {
            poolSize: this.pool.length,
            activeCount: this.activeCount,
            totalCreated: this.pool.length + this.activeCount
        };
    }

    /**
     * Clear the pool
     */
    clear() {
        this.pool = [];
        this.activeCount = 0;
    }

    /**
     * Ensure minimum pool size
     * @param {number} minSize 
     */
    ensureCapacity(minSize) {
        while (this.pool.length < minSize) {
            this.pool.push(this.factory());
        }
    }
}

/**
 * Pre-built pools for common game objects
 */

/**
 * Vector2 pool for position/velocity calculations
 */
export class Vector2Pool extends ObjectPool {
    constructor(initialSize = 50) {
        super(
            () => ({ x: 0, y: 0 }),
            (v) => { v.x = 0; v.y = 0; return v; },
            initialSize
        );
    }

    /**
     * Get a vector with specified values
     * @param {number} x 
     * @param {number} y 
     * @returns {Object}
     */
    get(x = 0, y = 0) {
        const v = this.acquire();
        v.x = x;
        v.y = y;
        return v;
    }
}

/**
 * Particle pool for visual effects
 */
export class ParticlePool extends ObjectPool {
    constructor(initialSize = 100) {
        super(
            () => ({
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                life: 0,
                maxLife: 0,
                color: '#FFF',
                size: 1,
                alpha: 1,
                active: false
            }),
            (p) => {
                p.x = 0;
                p.y = 0;
                p.vx = 0;
                p.vy = 0;
                p.life = 0;
                p.maxLife = 0;
                p.color = '#FFF';
                p.size = 1;
                p.alpha = 1;
                p.active = false;
                return p;
            },
            initialSize
        );
    }

    /**
     * Create a particle with initial values
     * @param {Object} props 
     * @returns {Object}
     */
    create(props) {
        const p = this.acquire();
        Object.assign(p, props);
        p.active = true;
        return p;
    }
}

/**
 * Rectangle pool for collision detection
 */
export class RectPool extends ObjectPool {
    constructor(initialSize = 30) {
        super(
            () => ({ x: 0, y: 0, width: 0, height: 0 }),
            (r) => { r.x = 0; r.y = 0; r.width = 0; r.height = 0; return r; },
            initialSize
        );
    }

    /**
     * Get a rectangle with specified values
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @returns {Object}
     */
    get(x, y, width, height) {
        const r = this.acquire();
        r.x = x;
        r.y = y;
        r.width = width;
        r.height = height;
        return r;
    }
}

/**
 * Event pool for game events
 */
export class EventPool extends ObjectPool {
    constructor(initialSize = 20) {
        super(
            () => ({ type: '', data: null, timestamp: 0 }),
            (e) => { e.type = ''; e.data = null; e.timestamp = 0; return e; },
            initialSize
        );
    }

    /**
     * Create an event
     * @param {string} type 
     * @param {Object} data 
     * @returns {Object}
     */
    create(type, data = null) {
        const e = this.acquire();
        e.type = type;
        e.data = data;
        e.timestamp = Date.now();
        return e;
    }
}

/**
 * Global pool manager for easy access
 */
export class PoolManager {
    constructor() {
        this.pools = new Map();
    }

    /**
     * Register a pool
     * @param {string} name 
     * @param {ObjectPool} pool 
     */
    register(name, pool) {
        this.pools.set(name, pool);
    }

    /**
     * Get a pool by name
     * @param {string} name 
     * @returns {ObjectPool|null}
     */
    getPool(name) {
        return this.pools.get(name) || null;
    }

    /**
     * Get statistics for all pools
     * @returns {Object}
     */
    getStats() {
        const stats = {};
        for (const [name, pool] of this.pools) {
            stats[name] = pool.getStats();
        }
        return stats;
    }

    /**
     * Clear all pools
     */
    clearAll() {
        for (const pool of this.pools.values()) {
            pool.clear();
        }
    }

    /**
     * Create default pools for common game objects
     */
    createDefaultPools() {
        this.register('vector2', new Vector2Pool());
        this.register('particle', new ParticlePool());
        this.register('rect', new RectPool());
        this.register('event', new EventPool());
    }
}

// Global pool manager instance
export const globalPools = new PoolManager();
