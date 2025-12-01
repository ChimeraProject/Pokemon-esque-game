import Phaser from 'phaser';
import { MapLoader } from '../game/MapLoader';
import { DialogueSystem } from '../game/DialogueSystem';
import { createNPCsFromMapData } from '../game/NPC';
import { Pokemon } from '../game/Pokemon';
import { GameConfig } from '../game/GameConfig';

// Import map data
import newBarkTownData from '../assets/data/maps/new-bark-town.json';
import route29Data from '../assets/data/maps/route-29.json';
import cherrygroveData from '../assets/data/maps/cherrygrove-city.json';
import pokemonData from '../assets/data/pokemon/pokemon-data.json';

export default class OverworldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'OverworldScene' });
    this.mapLoader = null;
    this.dialogueSystem = null;
    this.playerSpeed = GameConfig.player.speed;
    this.currentMapId = 'new-bark-town';
    this.maps = {
      'new-bark-town': newBarkTownData,
      'route-29': route29Data,
      'cherrygrove-city': cherrygroveData
    };
    this.npcs = [];
    this.lastGrassStep = 0;
    this.wildEncounterRate = GameConfig.wildEncounter.rate;
    this.facingDirection = 'down';
  }

  preload() {
    // Assets are loaded as JSON through import
  }

  create() {
    // Initialize systems
    this.mapLoader = new MapLoader(this);
    this.dialogueSystem = new DialogueSystem(this);
    
    // Load the starting map
    this.loadMap(this.currentMapId);
    
    // Create player
    this.createPlayer();
    
    // Set up collision
    this.setupCollision();
    
    // Set up input
    this.setupInput();
    
    // Display map name
    this.showMapName();
  }

  loadMap(mapId) {
    const mapData = this.maps[mapId];
    if (!mapData) {
      console.error(`Map not found: ${mapId}`);
      return;
    }
    
    this.currentMapId = mapId;
    const mapInfo = this.mapLoader.loadMap(mapData);
    
    // Create NPCs
    if (mapData.npcs) {
      this.npcs = createNPCsFromMapData(mapData.npcs);
    }
    
    return mapInfo;
  }

  createPlayer() {
    const mapData = this.maps[this.currentMapId];
    const spawnPoint = mapData.spawnPoint;
    const tileSize = mapData.tileSize || GameConfig.map.defaultTileSize;
    
    // Create player sprite (colored rectangle for now)
    this.player = this.add.rectangle(
      spawnPoint.x * tileSize + tileSize / 2,
      spawnPoint.y * tileSize + tileSize / 2,
      GameConfig.player.size,
      GameConfig.player.size,
      0x00ff00
    );
    this.player.setDepth(10);
    
    // Add physics
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    
    // Camera follows player
    this.cameras.main.startFollow(
      this.player, 
      true, 
      GameConfig.camera.lerpX, 
      GameConfig.camera.lerpY
    );
    this.cameras.main.setZoom(GameConfig.camera.zoom);
  }

  setupCollision() {
    // Create collision bodies from map
    const collisionBodies = this.mapLoader.createCollisionBodies();
    
    if (collisionBodies) {
      this.physics.add.collider(this.player, collisionBodies);
    }
    
    // Collide with NPCs
    this.mapLoader.npcs.forEach(npc => {
      this.physics.add.collider(this.player, npc);
    });
  }

  setupInput() {
    // Create cursor keys
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    
    // Action key for interactions
    this.actionKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    
    // Menu key
    this.menuKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  update() {
    if (!this.player) return;
    
    // Handle dialogue advancement
    if (this.dialogueSystem.isDialogueActive()) {
      if (Phaser.Input.Keyboard.JustDown(this.actionKey) || 
          Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        this.dialogueSystem.advance();
      }
      this.player.body.setVelocity(0);
      return;
    }
    
    // Handle movement
    this.handleMovement();
    
    // Check for interactions
    if (Phaser.Input.Keyboard.JustDown(this.actionKey) || 
        Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.checkInteraction();
    }
    
    // Check for wild encounters
    this.checkWildEncounter();
    
    // Check for map transitions
    this.checkMapTransition();
  }

  handleMovement() {
    const body = this.player.body;
    body.setVelocity(0);
    
    let moving = false;
    
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      body.setVelocityX(-this.playerSpeed);
      this.facingDirection = 'left';
      moving = true;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      body.setVelocityX(this.playerSpeed);
      this.facingDirection = 'right';
      moving = true;
    }
    
    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      body.setVelocityY(-this.playerSpeed);
      this.facingDirection = 'up';
      moving = true;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      body.setVelocityY(this.playerSpeed);
      this.facingDirection = 'down';
      moving = true;
    }
    
    // Normalize diagonal movement
    if (body.velocity.x !== 0 && body.velocity.y !== 0) {
      body.velocity.normalize().scale(this.playerSpeed);
    }
    
    return moving;
  }

  checkInteraction() {
    // Get tile in front of player based on facing direction
    const tileSize = this.maps[this.currentMapId].tileSize || 16;
    let checkX = this.player.x;
    let checkY = this.player.y;
    
    switch (this.facingDirection) {
    case 'up': checkY -= tileSize; break;
    case 'down': checkY += tileSize; break;
    case 'left': checkX -= tileSize; break;
    case 'right': checkX += tileSize; break;
    }
    
    // Check for NPC
    const npc = this.mapLoader.getNPCAt(checkX, checkY);
    if (npc) {
      const npcData = npc.getData('npcData');
      if (npcData && npcData.dialogue) {
        this.dialogueSystem.showDialogue(npcData.dialogue, () => {
          // Check if trainer battle
          if (npcData.isTrainer && npcData.pokemon) {
            this.startTrainerBattle(npcData);
          }
        });
      }
      return;
    }
    
    // Check for door
    const door = this.mapLoader.getDoorAt(checkX, checkY);
    if (door) {
      this.dialogueSystem.showDialogue([`${door.label}`]);
    }
  }

  checkWildEncounter() {
    if (!this.mapLoader.isTallGrass(this.player.x, this.player.y)) {
      return;
    }
    
    // Check if player is moving
    if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
      return;
    }
    
    // Throttle encounter checks
    const now = this.time.now;
    if (now - this.lastGrassStep < GameConfig.wildEncounter.throttleMs) return;
    this.lastGrassStep = now;
    
    // Random encounter check
    if (Math.random() < this.wildEncounterRate) {
      const wildPokemonData = this.mapLoader.getWildPokemonData();
      if (wildPokemonData && wildPokemonData.length > 0) {
        this.startWildBattle(wildPokemonData);
      }
    }
  }

  startWildBattle(wildPokemonData) {
    // Select random wild Pokemon based on encounter rates
    const totalRate = wildPokemonData.reduce((sum, p) => sum + p.rate, 0);
    let roll = Math.random() * totalRate;
    let selectedPokemon = wildPokemonData[0];
    
    for (const pokemon of wildPokemonData) {
      roll -= pokemon.rate;
      if (roll <= 0) {
        selectedPokemon = pokemon;
        break;
      }
    }
    
    // Generate level within range
    const level = Math.floor(
      Math.random() * (selectedPokemon.maxLevel - selectedPokemon.minLevel + 1)
    ) + selectedPokemon.minLevel;
    
    // Find Pokemon data
    const pokemonInfo = pokemonData.pokemon.find(p => p.id === selectedPokemon.id);
    if (!pokemonInfo) return;
    
    // Create wild Pokemon
    const wildPokemon = new Pokemon(
      selectedPokemon.id,
      selectedPokemon.name,
      level,
      this.calculateStats(pokemonInfo.baseStats, level),
      this.getMovesForLevel(pokemonInfo.moves, level)
    );
    
    // Start battle scene
    this.scene.start('BattleScene', {
      type: 'wild',
      wildPokemon: wildPokemon,
      returnScene: 'OverworldScene',
      playerPosition: { x: this.player.x, y: this.player.y },
      currentMapId: this.currentMapId
    });
  }

  startTrainerBattle(npcData) {
    const trainerPokemon = npcData.pokemon.map(p => {
      const pokemonInfo = pokemonData.pokemon.find(pi => pi.id === p.id);
      if (!pokemonInfo) return null;
      
      return new Pokemon(
        p.id,
        p.name,
        p.level,
        this.calculateStats(pokemonInfo.baseStats, p.level),
        this.getMovesForLevel(pokemonInfo.moves, p.level)
      );
    }).filter(p => p !== null);
    
    this.scene.start('BattleScene', {
      type: 'trainer',
      trainerName: npcData.name,
      trainerPokemon: trainerPokemon,
      returnScene: 'OverworldScene',
      playerPosition: { x: this.player.x, y: this.player.y },
      currentMapId: this.currentMapId
    });
  }

  calculateStats(baseStats, level) {
    // Simplified stat calculation
    return {
      hp: Math.floor((2 * baseStats.hp * level) / 100) + level + 10,
      attack: Math.floor((2 * baseStats.attack * level) / 100) + 5,
      defense: Math.floor((2 * baseStats.defense * level) / 100) + 5,
      spAtk: Math.floor((2 * baseStats.spAtk * level) / 100) + 5,
      spDef: Math.floor((2 * baseStats.spDef * level) / 100) + 5,
      speed: Math.floor((2 * baseStats.speed * level) / 100) + 5
    };
  }

  getMovesForLevel(allMoves, level) {
    // Get moves the Pokemon would know at this level
    const knownMoves = allMoves
      .filter(m => m.learnLevel <= level)
      .slice(-4); // Keep last 4 moves
    
    return knownMoves.map(m => ({
      name: m.name,
      type: m.type,
      power: m.power,
      accuracy: m.accuracy,
      pp: m.pp,
      currentPp: m.pp
    }));
  }

  checkMapTransition() {
    const transition = this.mapLoader.checkMapBoundary(this.player.x, this.player.y);
    
    if (transition) {
      this.transitionToMap(transition.mapId, transition.direction);
    }
  }

  transitionToMap(mapId, fromDirection) {
    if (!this.maps[mapId]) {
      console.log(`Map ${mapId} not implemented yet`);
      return;
    }
    
    // Clear current map
    this.mapLoader.clearMap();
    
    // Load new map
    this.currentMapId = mapId;
    this.loadMap(mapId);
    
    // Position player based on entry direction
    const mapData = this.maps[mapId];
    const tileSize = mapData.tileSize || 16;
    
    let newX, newY;
    switch (fromDirection) {
    case 'west':
      newX = (mapData.width - 2) * tileSize;
      newY = this.player.y;
      break;
    case 'east':
      newX = 2 * tileSize;
      newY = this.player.y;
      break;
    case 'north':
      newX = this.player.x;
      newY = (mapData.height - 2) * tileSize;
      break;
    case 'south':
      newX = this.player.x;
      newY = 2 * tileSize;
      break;
    default:
      newX = mapData.spawnPoint.x * tileSize;
      newY = mapData.spawnPoint.y * tileSize;
    }
    
    // Clamp position to map bounds
    newX = Math.max(tileSize, Math.min(newX, (mapData.width - 1) * tileSize));
    newY = Math.max(tileSize, Math.min(newY, (mapData.height - 1) * tileSize));
    
    this.player.setPosition(newX, newY);
    
    // Recreate collision
    this.setupCollision();
    
    // Show map name
    this.showMapName();
  }

  showMapName() {
    const mapData = this.maps[this.currentMapId];
    if (!mapData) return;
    
    // Create map name display
    const text = this.add.text(
      this.scale.width / 2,
      20,
      mapData.name,
      {
        fontSize: '12px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 8, y: 4 }
      }
    );
    text.setOrigin(0.5);
    text.setScrollFactor(0);
    text.setDepth(100);
    
    // Fade out after 2 seconds
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: text,
        alpha: 0,
        duration: 500,
        onComplete: () => text.destroy()
      });
    });
  }
}
