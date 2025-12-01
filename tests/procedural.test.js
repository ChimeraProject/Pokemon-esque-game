/**
 * Tests for ProceduralGenerator
 */

import { ProceduralGenerator, SeededRandom, NoiseGenerator } from '../src/world/ProceduralGenerator.js';
import { TILE_TYPES, isWalkable, canEncounter, getEncounterRate } from '../src/world/TileSet.js';

describe('SeededRandom', () => {
    test('should produce deterministic results with same seed', () => {
        const rng1 = new SeededRandom(12345);
        const rng2 = new SeededRandom(12345);
        
        expect(rng1.next()).toBe(rng2.next());
        expect(rng1.next()).toBe(rng2.next());
        expect(rng1.next()).toBe(rng2.next());
    });

    test('should produce different results with different seeds', () => {
        const rng1 = new SeededRandom(12345);
        const rng2 = new SeededRandom(54321);
        
        const val1 = rng1.next();
        const val2 = rng2.next();
        
        // With different seeds, values should be different
        expect(val1).not.toBe(val2);
    });

    test('should produce values between 0 and 1', () => {
        const rng = new SeededRandom(999);
        
        for (let i = 0; i < 100; i++) {
            const val = rng.next();
            expect(val).toBeGreaterThanOrEqual(0);
            expect(val).toBeLessThan(1);
        }
    });

    test('should produce integers in range with nextInt', () => {
        const rng = new SeededRandom(888);
        
        for (let i = 0; i < 100; i++) {
            const val = rng.nextInt(5, 10);
            expect(val).toBeGreaterThanOrEqual(5);
            expect(val).toBeLessThanOrEqual(10);
        }
    });
});

describe('NoiseGenerator', () => {
    test('should produce values between -1 and 1', () => {
        const noise = new NoiseGenerator(42);
        
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const val = noise.noise2D(x, y);
            
            expect(val).toBeGreaterThanOrEqual(-1);
            expect(val).toBeLessThanOrEqual(1);
        }
    });

    test('should produce deterministic results', () => {
        const noise1 = new NoiseGenerator(42);
        const noise2 = new NoiseGenerator(42);
        
        expect(noise1.noise2D(10, 10)).toBe(noise2.noise2D(10, 10));
        expect(noise1.octaveNoise(5, 5, 4, 0.5)).toBe(noise2.octaveNoise(5, 5, 4, 0.5));
    });

    test('should have spatial coherence', () => {
        const noise = new NoiseGenerator(42);
        
        // Values at nearby points should be similar
        const val1 = noise.noise2D(10, 10);
        const val2 = noise.noise2D(10.01, 10.01);
        
        const difference = Math.abs(val1 - val2);
        expect(difference).toBeLessThan(0.1);
    });
});

describe('ProceduralGenerator', () => {
    test('should generate a map with correct dimensions', () => {
        const generator = new ProceduralGenerator(12345);
        const map = generator.generateMap(20, 15);
        
        expect(map.length).toBe(15);
        expect(map[0].length).toBe(20);
    });

    test('should generate deterministic maps with same seed', () => {
        const gen1 = new ProceduralGenerator(12345);
        const gen2 = new ProceduralGenerator(12345);
        
        const map1 = gen1.generateMap(10, 10);
        const map2 = gen2.generateMap(10, 10);
        
        expect(JSON.stringify(map1)).toBe(JSON.stringify(map2));
    });

    test('should add borders when requested', () => {
        const generator = new ProceduralGenerator(42);
        const map = generator.generateMap(10, 10, { addBorder: true });
        
        // Check all edge tiles are trees
        for (let x = 0; x < 10; x++) {
            expect(map[0][x]).toBe(TILE_TYPES.TREE);
            expect(map[9][x]).toBe(TILE_TYPES.TREE);
        }
        for (let y = 0; y < 10; y++) {
            expect(map[y][0]).toBe(TILE_TYPES.TREE);
            expect(map[y][9]).toBe(TILE_TYPES.TREE);
        }
    });

    test('should generate cave maps', () => {
        const generator = new ProceduralGenerator(42);
        const cave = generator.generateCave(15, 15);
        
        expect(cave.length).toBe(15);
        expect(cave[0].length).toBe(15);
        
        // Should contain cave tiles
        let hasCaveFloor = false;
        let hasCaveWall = false;
        
        for (let y = 0; y < cave.length; y++) {
            for (let x = 0; x < cave[y].length; x++) {
                if (cave[y][x] === TILE_TYPES.CAVE_FLOOR) hasCaveFloor = true;
                if (cave[y][x] === TILE_TYPES.CAVE_WALL) hasCaveWall = true;
            }
        }
        
        expect(hasCaveFloor).toBe(true);
        expect(hasCaveWall).toBe(true);
    });

    test('should find valid spawn points', () => {
        const generator = new ProceduralGenerator(42);
        const map = generator.generateMap(15, 15);
        const spawn = generator.findSpawnPoint(map);
        
        expect(spawn.x).toBeGreaterThanOrEqual(0);
        expect(spawn.y).toBeGreaterThanOrEqual(0);
        expect(spawn.x).toBeLessThan(15);
        expect(spawn.y).toBeLessThan(15);
        
        // Spawn should be on a walkable tile
        const tile = map[spawn.y][spawn.x];
        expect(isWalkable(tile)).toBe(true);
    });
});

describe('TileSet', () => {
    test('should correctly identify walkable tiles', () => {
        expect(isWalkable(TILE_TYPES.GRASS)).toBe(true);
        expect(isWalkable(TILE_TYPES.PATH)).toBe(true);
        expect(isWalkable(TILE_TYPES.TALL_GRASS)).toBe(true);
        expect(isWalkable(TILE_TYPES.TREE)).toBe(false);
        expect(isWalkable(TILE_TYPES.WATER)).toBe(false);
        expect(isWalkable(TILE_TYPES.ROCK)).toBe(false);
    });

    test('should correctly identify encounter tiles', () => {
        expect(canEncounter(TILE_TYPES.TALL_GRASS)).toBe(true);
        expect(canEncounter(TILE_TYPES.CAVE_FLOOR)).toBe(true);
        expect(canEncounter(TILE_TYPES.GRASS)).toBe(false);
        expect(canEncounter(TILE_TYPES.PATH)).toBe(false);
    });

    test('should return valid encounter rates', () => {
        const tallGrassRate = getEncounterRate(TILE_TYPES.TALL_GRASS);
        expect(tallGrassRate).toBeGreaterThan(0);
        expect(tallGrassRate).toBeLessThan(1);
        
        const grassRate = getEncounterRate(TILE_TYPES.GRASS);
        expect(grassRate).toBe(0);
    });
});
