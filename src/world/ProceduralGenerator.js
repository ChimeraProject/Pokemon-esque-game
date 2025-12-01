/**
 * ProceduralGenerator - Generates procedural terrain using noise algorithms
 * Inspired by Veloren's voxel world generation systems
 * 
 * Uses simplex-like noise to create natural-looking terrain variations
 * for dynamic and replayable Johto regions.
 */

import { TILE_TYPES } from './TileSet.js';

/**
 * Simple seeded random number generator (Mulberry32)
 * Provides deterministic randomness for reproducible world generation
 */
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }

    /**
     * Generate next random number (0-1)
     * @returns {number}
     */
    next() {
        let t = this.seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    /**
     * Generate random integer in range [min, max]
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    nextInt(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
}

/**
 * Simple 2D noise generator using value noise interpolation
 * Provides terrain height/biome variation
 */
class NoiseGenerator {
    constructor(seed) {
        this.rng = new SeededRandom(seed);
        this.permutation = this.generatePermutation();
    }

    generatePermutation() {
        const perm = [];
        for (let i = 0; i < 256; i++) {
            perm.push(i);
        }
        // Fisher-Yates shuffle
        for (let i = 255; i > 0; i--) {
            const j = this.rng.nextInt(0, i);
            [perm[i], perm[j]] = [perm[j], perm[i]];
        }
        // Duplicate for wrapping
        return [...perm, ...perm];
    }

    /**
     * Fade function for smooth interpolation
     */
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    /**
     * Linear interpolation
     */
    lerp(a, b, t) {
        return a + t * (b - a);
    }

    /**
     * Get gradient value at a point
     */
    grad(hash, x, y) {
        const h = hash & 3;
        const u = h < 2 ? x : y;
        const v = h < 2 ? y : x;
        return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
    }

    /**
     * Generate noise value at coordinates
     * @param {number} x 
     * @param {number} y 
     * @returns {number} - Value between -1 and 1
     */
    noise2D(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        const u = this.fade(x);
        const v = this.fade(y);

        const A = this.permutation[X] + Y;
        const B = this.permutation[X + 1] + Y;

        return this.lerp(
            this.lerp(this.grad(this.permutation[A], x, y),
                      this.grad(this.permutation[B], x - 1, y), u),
            this.lerp(this.grad(this.permutation[A + 1], x, y - 1),
                      this.grad(this.permutation[B + 1], x - 1, y - 1), u),
            v
        );
    }

    /**
     * Generate octave noise (fractal brownian motion)
     * @param {number} x 
     * @param {number} y 
     * @param {number} octaves - Number of noise layers
     * @param {number} persistence - Amplitude decay per octave
     * @returns {number}
     */
    octaveNoise(x, y, octaves = 4, persistence = 0.5) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += this.noise2D(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        return total / maxValue;
    }
}

/**
 * ProceduralGenerator - Main terrain generation class
 */
export class ProceduralGenerator {
    /**
     * @param {number} seed - Seed for reproducible generation
     */
    constructor(seed = Date.now()) {
        this.seed = seed;
        this.rng = new SeededRandom(seed);
        this.elevationNoise = new NoiseGenerator(seed);
        this.moistureNoise = new NoiseGenerator(seed + 1000);
        this.detailNoise = new NoiseGenerator(seed + 2000);
    }

    /**
     * Generate a procedural map
     * @param {number} width - Map width in tiles
     * @param {number} height - Map height in tiles
     * @param {Object} options - Generation options
     * @returns {number[][]} - 2D array of tile types
     */
    generateMap(width, height, options = {}) {
        const {
            scale = 0.1,           // Noise scale (larger = smoother)
            waterLevel = -0.3,     // Below this = water
            treeThreshold = 0.6,   // Above this = trees
            tallGrassChance = 0.3, // Chance for tall grass on grass tiles
            pathDensity = 0.15,    // Chance for path generation
            addBorder = true       // Add tree border around map
        } = options;

        const map = [];

        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                // Get noise values
                const elevation = this.elevationNoise.octaveNoise(x * scale, y * scale, 4, 0.5);
                const moisture = this.moistureNoise.octaveNoise(x * scale * 0.8, y * scale * 0.8, 3, 0.6);
                const detail = this.detailNoise.noise2D(x * 0.3, y * 0.3);

                // Determine tile type based on noise values
                let tile = this.determineTile(elevation, moisture, detail, {
                    waterLevel,
                    treeThreshold,
                    tallGrassChance
                });

                row.push(tile);
            }
            map.push(row);
        }

        // Add paths through the terrain
        if (pathDensity > 0) {
            this.addPaths(map, width, height, pathDensity);
        }

        // Add border of trees
        if (addBorder) {
            this.addBorder(map, width, height);
        }

        return map;
    }

    /**
     * Determine tile type based on noise values
     */
    determineTile(elevation, moisture, detail, thresholds) {
        const { waterLevel, treeThreshold, tallGrassChance } = thresholds;

        // Water areas
        if (elevation < waterLevel) {
            return TILE_TYPES.WATER;
        }

        // Beach/sand near water
        if (elevation < waterLevel + 0.1) {
            return TILE_TYPES.SAND;
        }

        // Forest areas (high elevation + moisture)
        if (elevation > treeThreshold && moisture > 0) {
            return TILE_TYPES.TREE;
        }

        // Rocky areas (high elevation, low moisture)
        if (elevation > treeThreshold && moisture < -0.3) {
            return TILE_TYPES.ROCK;
        }

        // Scattered trees
        if (detail > 0.7 && moisture > 0.2) {
            return TILE_TYPES.TREE;
        }

        // Tall grass (encounter zones)
        if (detail > 0.3 && detail < 0.5 && this.rng.next() < tallGrassChance) {
            return TILE_TYPES.TALL_GRASS;
        }

        // Flowers (decorative)
        if (detail > 0.8 && moisture > 0) {
            return TILE_TYPES.FLOWER;
        }

        // Default grass
        return TILE_TYPES.GRASS;
    }

    /**
     * Add paths through the terrain using simple random walk
     */
    addPaths(map, width, height, density) {
        const numPaths = Math.floor(Math.max(width, height) * density);
        
        for (let i = 0; i < numPaths; i++) {
            // Random starting edge
            let x, y, dx, dy;
            const edge = this.rng.nextInt(0, 3);
            
            switch (edge) {
                case 0: // Top
                    x = this.rng.nextInt(1, width - 2);
                    y = 1;
                    dx = 0;
                    dy = 1;
                    break;
                case 1: // Bottom
                    x = this.rng.nextInt(1, width - 2);
                    y = height - 2;
                    dx = 0;
                    dy = -1;
                    break;
                case 2: // Left
                    x = 1;
                    y = this.rng.nextInt(1, height - 2);
                    dx = 1;
                    dy = 0;
                    break;
                default: // Right
                    x = width - 2;
                    y = this.rng.nextInt(1, height - 2);
                    dx = -1;
                    dy = 0;
            }

            // Walk across the map
            const maxSteps = width + height;
            for (let step = 0; step < maxSteps; step++) {
                if (x < 1 || x >= width - 1 || y < 1 || y >= height - 1) break;

                // Only place path on walkable tiles
                if (map[y][x] !== TILE_TYPES.WATER && map[y][x] !== TILE_TYPES.TREE) {
                    map[y][x] = TILE_TYPES.PATH;
                }

                // Move with some randomness
                if (this.rng.next() < 0.3) {
                    // Perpendicular step
                    if (dx === 0) {
                        x += this.rng.next() < 0.5 ? -1 : 1;
                    } else {
                        y += this.rng.next() < 0.5 ? -1 : 1;
                    }
                } else {
                    // Forward step
                    x += dx;
                    y += dy;
                }
            }
        }
    }

    /**
     * Add border of trees around the map
     */
    addBorder(map, width, height) {
        for (let x = 0; x < width; x++) {
            map[0][x] = TILE_TYPES.TREE;
            map[height - 1][x] = TILE_TYPES.TREE;
        }
        for (let y = 0; y < height; y++) {
            map[y][0] = TILE_TYPES.TREE;
            map[y][width - 1] = TILE_TYPES.TREE;
        }
    }

    /**
     * Generate a cave/dungeon map
     * @param {number} width 
     * @param {number} height 
     * @param {Object} options 
     * @returns {number[][]}
     */
    generateCave(width, height, options = {}) {
        const {
            fillPercent = 0.45,  // Initial wall fill percentage
            iterations = 5       // Cellular automata iterations
        } = options;

        // Initialize with random walls
        let map = [];
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                    row.push(TILE_TYPES.CAVE_WALL);
                } else {
                    row.push(this.rng.next() < fillPercent ? TILE_TYPES.CAVE_WALL : TILE_TYPES.CAVE_FLOOR);
                }
            }
            map.push(row);
        }

        // Apply cellular automata
        for (let i = 0; i < iterations; i++) {
            map = this.applyCaveAutomata(map, width, height);
        }

        return map;
    }

    /**
     * Apply cellular automata rules for cave generation
     */
    applyCaveAutomata(map, width, height) {
        const newMap = [];
        
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const wallCount = this.countWallNeighbors(map, x, y, width, height);
                
                // 4-5 rule: become wall if 5+ neighbors are walls, become floor if 4- neighbors are walls
                if (wallCount >= 5) {
                    row.push(TILE_TYPES.CAVE_WALL);
                } else if (wallCount <= 3) {
                    row.push(TILE_TYPES.CAVE_FLOOR);
                } else {
                    row.push(map[y][x]);
                }
            }
            newMap.push(row);
        }

        return newMap;
    }

    /**
     * Count wall neighbors for cellular automata
     */
    countWallNeighbors(map, x, y, width, height) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
                    count++; // Out of bounds counts as wall
                } else if (map[ny][nx] === TILE_TYPES.CAVE_WALL) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * Get a spawn point on a walkable tile
     * @param {number[][]} map 
     * @returns {{x: number, y: number}}
     */
    findSpawnPoint(map) {
        const walkableTiles = [];
        
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const tile = map[y][x];
                if (tile === TILE_TYPES.GRASS || tile === TILE_TYPES.PATH || 
                    tile === TILE_TYPES.CAVE_FLOOR || tile === TILE_TYPES.SAND) {
                    walkableTiles.push({ x, y });
                }
            }
        }

        if (walkableTiles.length === 0) {
            return { x: 1, y: 1 };
        }

        return walkableTiles[this.rng.nextInt(0, walkableTiles.length - 1)];
    }
}

// Export for testing
export { SeededRandom, NoiseGenerator };
