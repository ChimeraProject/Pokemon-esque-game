/**
 * Overworld system - Handles the game world, player movement, and map rendering
 * Features procedural generation inspired by Veloren's voxel systems
 */

import { ProceduralGenerator } from '../world/ProceduralGenerator.js';
import { TILE_TYPES, getTileColor, isWalkable, canEncounter, getEncounterRate } from '../world/TileSet.js';

export class Overworld {
    constructor(ctx, config) {
        this.ctx = ctx;
        this.config = config;
        
        // Map configuration
        this.mapWidth = 30;
        this.mapHeight = 20;
        this.useProcedural = true;  // Toggle between procedural and static maps
        
        // Procedural generator
        this.generator = new ProceduralGenerator(Date.now());
        
        // Generate or load map
        if (this.useProcedural) {
            this.map = this.generator.generateMap(this.mapWidth, this.mapHeight, {
                scale: 0.12,
                waterLevel: -0.35,
                treeThreshold: 0.55,
                tallGrassChance: 0.35,
                pathDensity: 0.12
            });
        } else {
            this.map = this.createRoute29Map();
        }
        
        // Find spawn point
        const spawn = this.generator.findSpawnPoint(this.map);
        
        // Player state
        this.player = {
            x: spawn.x,
            y: spawn.y,
            pixelX: spawn.x * config.TILE_SIZE,
            pixelY: spawn.y * config.TILE_SIZE,
            direction: 'down',
            isMoving: false,
            moveProgress: 0
        };
        
        // Movement configuration
        this.moveSpeed = 0.1; // Tiles per frame
        this.targetX = this.player.x;
        this.targetY = this.player.y;
        
        // Camera for larger maps
        this.cameraX = 0;
        this.cameraY = 0;
        this.viewportTilesX = Math.ceil(config.CANVAS_WIDTH / config.TILE_SIZE);
        this.viewportTilesY = Math.ceil(config.CANVAS_HEIGHT / config.TILE_SIZE);
        
        // Encounter state
        this.encounterCallback = null;
        this.stepsSinceEncounter = 0;
        
        // Map generation callback for regeneration
        this.onMapGenerated = null;
    }
    
    /**
     * Generate a new procedural map
     * @param {number} seed - Optional seed
     */
    regenerateMap(seed = Date.now()) {
        this.generator = new ProceduralGenerator(seed);
        
        this.map = this.generator.generateMap(this.mapWidth, this.mapHeight, {
            scale: 0.12,
            waterLevel: -0.35,
            treeThreshold: 0.55,
            tallGrassChance: 0.35,
            pathDensity: 0.12
        });
        
        // Find new spawn point
        const spawn = this.generator.findSpawnPoint(this.map);
        this.player.x = spawn.x;
        this.player.y = spawn.y;
        this.player.pixelX = spawn.x * this.config.TILE_SIZE;
        this.player.pixelY = spawn.y * this.config.TILE_SIZE;
        this.targetX = spawn.x;
        this.targetY = spawn.y;
        this.player.isMoving = false;
        
        if (this.onMapGenerated) {
            this.onMapGenerated(this.map);
        }
    }
    
    /**
     * Generate a cave/dungeon map
     * @param {number} seed 
     */
    generateCave(seed = Date.now()) {
        this.generator = new ProceduralGenerator(seed);
        
        this.map = this.generator.generateCave(this.mapWidth, this.mapHeight, {
            fillPercent: 0.45,
            iterations: 5
        });
        
        // Find spawn point
        const spawn = this.generator.findSpawnPoint(this.map);
        this.player.x = spawn.x;
        this.player.y = spawn.y;
        this.player.pixelX = spawn.x * this.config.TILE_SIZE;
        this.player.pixelY = spawn.y * this.config.TILE_SIZE;
        this.targetX = spawn.x;
        this.targetY = spawn.y;
        this.player.isMoving = false;
        
        if (this.onMapGenerated) {
            this.onMapGenerated(this.map);
        }
    }
    
    createRoute29Map() {
        // 15x10 tile map representing Route 29 (legacy map)
        return [
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, 0, 0, 1, 0, 1, 0, 0, 2, 0, 0, 0, 0, 2],
            [2, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 2],
            [2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2],
            [2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2],
            [2, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
        ];
    }
    
    update(deltaTime, keys) {
        this.updateCamera();
        
        if (this.player.isMoving) {
            // Continue current movement
            this.player.moveProgress += this.moveSpeed;
            
            if (this.player.moveProgress >= 1) {
                // Movement complete
                this.player.x = this.targetX;
                this.player.y = this.targetY;
                this.player.pixelX = this.player.x * this.config.TILE_SIZE;
                this.player.pixelY = this.player.y * this.config.TILE_SIZE;
                this.player.isMoving = false;
                this.player.moveProgress = 0;
                
                // Check for encounter on landing tile
                this.checkEncounter();
            } else {
                // Interpolate position
                const startX = this.player.x * this.config.TILE_SIZE;
                const startY = this.player.y * this.config.TILE_SIZE;
                const endX = this.targetX * this.config.TILE_SIZE;
                const endY = this.targetY * this.config.TILE_SIZE;
                
                this.player.pixelX = startX + (endX - startX) * this.player.moveProgress;
                this.player.pixelY = startY + (endY - startY) * this.player.moveProgress;
            }
        } else {
            // Check for new movement input
            let dx = 0;
            let dy = 0;
            
            if (keys['ArrowUp'] || keys['w'] || keys['W']) {
                dy = -1;
                this.player.direction = 'up';
            } else if (keys['ArrowDown'] || keys['s'] || keys['S']) {
                dy = 1;
                this.player.direction = 'down';
            } else if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
                dx = -1;
                this.player.direction = 'left';
            } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
                dx = 1;
                this.player.direction = 'right';
            }
            
            // R key to regenerate map
            if (keys['r'] || keys['R']) {
                this.regenerateMap();
            }
            
            // C key to generate cave
            if (keys['c'] || keys['C']) {
                this.generateCave();
            }
            
            if (dx !== 0 || dy !== 0) {
                const newX = this.player.x + dx;
                const newY = this.player.y + dy;
                
                if (this.canMoveTo(newX, newY)) {
                    this.targetX = newX;
                    this.targetY = newY;
                    this.player.isMoving = true;
                    this.player.moveProgress = 0;
                }
            }
        }
    }
    
    /**
     * Update camera to follow player
     */
    updateCamera() {
        // Center camera on player
        const targetCamX = this.player.pixelX - (this.config.CANVAS_WIDTH / 2) + (this.config.TILE_SIZE / 2);
        const targetCamY = this.player.pixelY - (this.config.CANVAS_HEIGHT / 2) + (this.config.TILE_SIZE / 2);
        
        // Clamp camera to map bounds
        const maxCamX = (this.map[0]?.length || 0) * this.config.TILE_SIZE - this.config.CANVAS_WIDTH;
        const maxCamY = (this.map.length || 0) * this.config.TILE_SIZE - this.config.CANVAS_HEIGHT;
        
        this.cameraX = Math.max(0, Math.min(maxCamX, targetCamX));
        this.cameraY = Math.max(0, Math.min(maxCamY, targetCamY));
    }
    
    canMoveTo(x, y) {
        // Check bounds
        if (y < 0 || y >= this.map.length || x < 0 || x >= (this.map[0]?.length || 0)) {
            return false;
        }
        
        // Check collision using TileSet
        const tile = this.map[y][x];
        return isWalkable(tile);
    }
    
    /**
     * Check for wild Pokemon encounter
     */
    checkEncounter() {
        const tile = this.map[this.player.y]?.[this.player.x];
        if (tile === undefined) return;
        
        if (canEncounter(tile)) {
            this.stepsSinceEncounter++;
            const encounterRate = getEncounterRate(tile);
            
            // Increase chance after more steps without encounter
            const adjustedRate = encounterRate * (1 + this.stepsSinceEncounter * 0.05);
            
            if (Math.random() < adjustedRate) {
                this.stepsSinceEncounter = 0;
                if (this.encounterCallback) {
                    this.encounterCallback(tile);
                }
            }
        }
    }
    
    /**
     * Set callback for wild encounters
     * @param {Function} callback 
     */
    setEncounterCallback(callback) {
        this.encounterCallback = callback;
    }
    
    render() {
        // Calculate visible tile range
        const startTileX = Math.floor(this.cameraX / this.config.TILE_SIZE);
        const startTileY = Math.floor(this.cameraY / this.config.TILE_SIZE);
        const endTileX = Math.min(startTileX + this.viewportTilesX + 1, this.map[0]?.length || 0);
        const endTileY = Math.min(startTileY + this.viewportTilesY + 1, this.map.length);
        
        // Render visible map tiles
        for (let y = startTileY; y < endTileY; y++) {
            for (let x = startTileX; x < endTileX; x++) {
                const tile = this.map[y]?.[x];
                if (tile === undefined) continue;
                
                this.ctx.fillStyle = getTileColor(tile);
                this.ctx.fillRect(
                    x * this.config.TILE_SIZE - this.cameraX,
                    y * this.config.TILE_SIZE - this.cameraY,
                    this.config.TILE_SIZE,
                    this.config.TILE_SIZE
                );
                
                // Add visual variation to tall grass
                if (tile === TILE_TYPES.TALL_GRASS) {
                    this.ctx.fillStyle = '#228B22';
                    const grassX = x * this.config.TILE_SIZE - this.cameraX;
                    const grassY = y * this.config.TILE_SIZE - this.cameraY;
                    // Draw grass blades
                    this.ctx.fillRect(grassX + 2, grassY + 2, 2, 8);
                    this.ctx.fillRect(grassX + 6, grassY + 4, 2, 6);
                    this.ctx.fillRect(grassX + 10, grassY + 2, 2, 8);
                    this.ctx.fillRect(grassX + 14, grassY + 4, 2, 6);
                }
            }
        }
        
        // Render player
        this.ctx.fillStyle = '#FF6B6B'; // Coral red for player
        this.ctx.fillRect(
            this.player.pixelX - this.cameraX + 2,
            this.player.pixelY - this.cameraY + 2,
            this.config.TILE_SIZE - 4,
            this.config.TILE_SIZE - 4
        );
        
        // Draw direction indicator
        this.ctx.fillStyle = '#FFFFFF';
        const indicatorSize = 4;
        let indicatorX = this.player.pixelX - this.cameraX + this.config.TILE_SIZE / 2 - indicatorSize / 2;
        let indicatorY = this.player.pixelY - this.cameraY + this.config.TILE_SIZE / 2 - indicatorSize / 2;
        
        switch (this.player.direction) {
            case 'up':
                indicatorY = this.player.pixelY - this.cameraY + 3;
                break;
            case 'down':
                indicatorY = this.player.pixelY - this.cameraY + this.config.TILE_SIZE - 6;
                break;
            case 'left':
                indicatorX = this.player.pixelX - this.cameraX + 3;
                break;
            case 'right':
                indicatorX = this.player.pixelX - this.cameraX + this.config.TILE_SIZE - 6;
                break;
        }
        
        this.ctx.fillRect(indicatorX, indicatorY, indicatorSize, indicatorSize);
        
        // Draw UI hints
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '8px monospace';
        this.ctx.fillText('R: New Map | C: Cave | WASD: Move', 4, this.config.CANVAS_HEIGHT - 4);
    }
    
    /**
     * Get current map data
     */
    getMap() {
        return this.map;
    }
    
    /**
     * Get player position
     */
    getPlayerPosition() {
        return { x: this.player.x, y: this.player.y };
    }
}
