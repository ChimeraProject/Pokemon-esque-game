import tilesConfig from '../assets/data/tiles.json';

/**
 * MapLoader - Handles loading and rendering of tile-based maps
 */
export class MapLoader {
  constructor(scene) {
    this.scene = scene;
    this.currentMap = null;
    this.tileSize = 16;
    this.tiles = tilesConfig.tiles;
    this.collisionLayer = null;
    this.groundLayer = null;
    this.npcs = [];
    this.objects = [];
  }

  /**
   * Load a map from JSON data
   * @param {Object} mapData - The map configuration object
   */
  loadMap(mapData) {
    this.currentMap = mapData;
    this.tileSize = mapData.tileSize || 16;
    
    // Clear existing layers
    this.clearMap();
    
    // Create ground layer graphics
    this.renderGroundLayer(mapData.layers.ground);
    
    // Store collision data
    this.collisionLayer = mapData.layers.collision;
    
    // Set up world bounds
    const worldWidth = mapData.width * this.tileSize;
    const worldHeight = mapData.height * this.tileSize;
    this.scene.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.scene.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    
    // Create NPCs
    if (mapData.npcs) {
      this.createNPCs(mapData.npcs);
    }
    
    // Create objects (doors, items, etc.)
    if (mapData.objects) {
      this.createObjects(mapData.objects);
    }
    
    return {
      width: worldWidth,
      height: worldHeight,
      spawnPoint: mapData.spawnPoint
    };
  }

  /**
   * Render the ground layer using colored rectangles
   */
  renderGroundLayer(groundData) {
    this.groundGraphics = this.scene.add.graphics();
    
    for (let y = 0; y < groundData.length; y++) {
      for (let x = 0; x < groundData[y].length; x++) {
        const tileId = groundData[y][x];
        const tile = this.tiles.find(t => t.id === tileId);
        
        if (tile) {
          const color = parseInt(tile.color.replace('#', '0x'));
          this.groundGraphics.fillStyle(color, 1);
          this.groundGraphics.fillRect(
            x * this.tileSize,
            y * this.tileSize,
            this.tileSize,
            this.tileSize
          );
        }
      }
    }
    
    // Set depth so player renders on top
    this.groundGraphics.setDepth(0);
  }

  /**
   * Create collision bodies for impassable tiles
   */
  createCollisionBodies() {
    if (!this.collisionLayer) return;
    
    this.collisionBodies = this.scene.physics.add.staticGroup();
    
    for (let y = 0; y < this.collisionLayer.length; y++) {
      for (let x = 0; x < this.collisionLayer[y].length; x++) {
        if (this.collisionLayer[y][x] === 1) {
          const collider = this.scene.add.rectangle(
            x * this.tileSize + this.tileSize / 2,
            y * this.tileSize + this.tileSize / 2,
            this.tileSize,
            this.tileSize
          );
          collider.setVisible(false);
          this.scene.physics.add.existing(collider, true);
          this.collisionBodies.add(collider);
        }
      }
    }
    
    return this.collisionBodies;
  }

  /**
   * Check if a position is walkable
   */
  isWalkable(x, y) {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);
    
    if (!this.collisionLayer) return true;
    if (tileY < 0 || tileY >= this.collisionLayer.length) return false;
    if (tileX < 0 || tileX >= this.collisionLayer[0].length) return false;
    
    return this.collisionLayer[tileY][tileX] === 0;
  }

  /**
   * Check if a tile is tall grass (wild encounter zone)
   */
  isTallGrass(x, y) {
    if (!this.currentMap || !this.currentMap.layers.ground) return false;
    
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);
    const groundLayer = this.currentMap.layers.ground;
    
    if (tileY < 0 || tileY >= groundLayer.length) return false;
    if (tileX < 0 || tileX >= groundLayer[0].length) return false;
    
    const tileId = groundLayer[tileY][tileX];
    const tile = this.tiles.find(t => t.id === tileId);
    
    return tile && tile.wildEncounter === true;
  }

  /**
   * Get door at position
   */
  getDoorAt(x, y) {
    if (!this.currentMap || !this.currentMap.objects) return null;
    
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);
    
    return this.currentMap.objects.find(obj => 
      obj.type === 'door' && obj.x === tileX && obj.y === tileY
    );
  }

  /**
   * Create NPCs from map data
   */
  createNPCs(npcsData) {
    this.npcs = [];
    
    npcsData.forEach(npcData => {
      const npc = this.scene.add.rectangle(
        npcData.x * this.tileSize + this.tileSize / 2,
        npcData.y * this.tileSize + this.tileSize / 2,
        this.tileSize - 2,
        this.tileSize - 2,
        npcData.sprite === 'sign' ? 0x8b4513 : 0xff69b4
      );
      
      npc.setDepth(1);
      npc.setData('npcData', npcData);
      
      // Add physics for interaction
      this.scene.physics.add.existing(npc, true);
      
      this.npcs.push(npc);
    });
  }

  /**
   * Create objects from map data
   */
  createObjects(objectsData) {
    this.objects = objectsData;
  }

  /**
   * Get NPC at position
   */
  getNPCAt(x, y) {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);
    
    return this.npcs.find(npc => {
      const npcData = npc.getData('npcData');
      return npcData.x === tileX && npcData.y === tileY;
    });
  }

  /**
   * Get wild Pokemon data for this map
   */
  getWildPokemonData() {
    return this.currentMap?.wildPokemon || null;
  }

  /**
   * Clear all map elements
   */
  clearMap() {
    if (this.groundGraphics) {
      this.groundGraphics.destroy();
    }
    
    if (this.collisionBodies) {
      this.collisionBodies.destroy(true);
    }
    
    this.npcs.forEach(npc => npc.destroy());
    this.npcs = [];
    this.objects = [];
  }

  /**
   * Get map connections for transitioning between areas
   */
  getConnections() {
    return this.currentMap?.connections || {};
  }

  /**
   * Check if player is at a map boundary
   */
  checkMapBoundary(x, y) {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);
    const connections = this.getConnections();
    
    if (tileX <= 0 && connections.west) {
      return { direction: 'west', mapId: connections.west };
    }
    if (tileX >= this.currentMap.width - 1 && connections.east) {
      return { direction: 'east', mapId: connections.east };
    }
    if (tileY <= 0 && connections.north) {
      return { direction: 'north', mapId: connections.north };
    }
    if (tileY >= this.currentMap.height - 1 && connections.south) {
      return { direction: 'south', mapId: connections.south };
    }
    
    return null;
  }
}
