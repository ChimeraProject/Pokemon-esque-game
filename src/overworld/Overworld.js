/**
 * Overworld system - Handles the game world, player movement, and map rendering
 * Initial implementation: Route 29 (starting area)
 */
export class Overworld {
    constructor(ctx, config) {
        this.ctx = ctx;
        this.config = config;
        
        // Player state
        this.player = {
            x: 5, // Grid position
            y: 5,
            pixelX: 5 * config.TILE_SIZE,
            pixelY: 5 * config.TILE_SIZE,
            direction: 'down',
            isMoving: false,
            moveProgress: 0
        };
        
        // Movement configuration
        this.moveSpeed = 0.1; // Tiles per frame
        this.targetX = this.player.x;
        this.targetY = this.player.y;
        
        // Route 29 map data (simple tile-based map)
        // 0 = grass, 1 = path, 2 = tree, 3 = water
        this.map = this.createRoute29Map();
        
        // Tile colors (placeholder until art assets are added)
        this.tileColors = {
            0: '#90EE90', // Light green - grass
            1: '#DEB887', // Tan - path
            2: '#228B22', // Forest green - tree
            3: '#4169E1'  // Royal blue - water
        };
        
        // Collision tiles (can't walk through these)
        this.collisionTiles = [2, 3];
    }
    
    createRoute29Map() {
        // 15x10 tile map representing Route 29
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
    
    canMoveTo(x, y) {
        // Check bounds
        if (x < 0 || x >= this.map[0].length || y < 0 || y >= this.map.length) {
            return false;
        }
        
        // Check collision
        const tile = this.map[y][x];
        return !this.collisionTiles.includes(tile);
    }
    
    render() {
        // Render map tiles
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                const tile = this.map[y][x];
                this.ctx.fillStyle = this.tileColors[tile];
                this.ctx.fillRect(
                    x * this.config.TILE_SIZE,
                    y * this.config.TILE_SIZE,
                    this.config.TILE_SIZE,
                    this.config.TILE_SIZE
                );
            }
        }
        
        // Render player (simple rectangle for now)
        this.ctx.fillStyle = '#FF6B6B'; // Coral red for player
        this.ctx.fillRect(
            this.player.pixelX + 2,
            this.player.pixelY + 2,
            this.config.TILE_SIZE - 4,
            this.config.TILE_SIZE - 4
        );
        
        // Draw direction indicator
        this.ctx.fillStyle = '#FFFFFF';
        const indicatorSize = 4;
        let indicatorX = this.player.pixelX + this.config.TILE_SIZE / 2 - indicatorSize / 2;
        let indicatorY = this.player.pixelY + this.config.TILE_SIZE / 2 - indicatorSize / 2;
        
        switch (this.player.direction) {
            case 'up':
                indicatorY = this.player.pixelY + 3;
                break;
            case 'down':
                indicatorY = this.player.pixelY + this.config.TILE_SIZE - 6;
                break;
            case 'left':
                indicatorX = this.player.pixelX + 3;
                break;
            case 'right':
                indicatorX = this.player.pixelX + this.config.TILE_SIZE - 6;
                break;
        }
        
        this.ctx.fillRect(indicatorX, indicatorY, indicatorSize, indicatorSize);
    }
}
