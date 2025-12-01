/**
 * Overworld Scene - Player exploration and map interaction
 * Inspired by Zelda3's overworld.c
 */

import { CONFIG, TILE_TYPES } from '../config.js';
import { Map } from './Map.js';
import { Player } from './Player.js';
import { EncounterSystem } from '../encounters/EncounterSystem.js';
import { NPCManager, NPC, Trainer } from '../npcs/NPC.js';

export class OverworldScene {
  constructor(game, isReturnFromBattle = false) {
    this.game = game;
    this.map = new Map();
    this.player = new Player(this.map);
    this.encounterSystem = new EncounterSystem();
    this.npcManager = new NPCManager();
    
    // Prevent encounters for first few frames after startup or after battle
    // 180 frames = 3 seconds at 60fps - gives time for scene transition
    this.framesSinceStart = 0;
    this.encountersEnabledAfter = isReturnFromBattle ? 180 : 60;
    
    // Initialize NPCs for the map
    this.initializeNPCs();
    
    console.log('📍 Overworld Scene initialized');
  }

  /**
   * Initialize NPCs for the map
   */
  initializeNPCs() {
    // Add a few test NPCs
    const npc1 = new NPC(5, 3, 'Old Man', 'npc', [
      'Welcome to Route 29!',
      'Be careful of wild Pokemon!',
      'Good luck on your adventure!'
    ]);
    this.npcManager.addNPC(npc1);

    // Add a trainer
    const trainerTeam = [
      {
        species: 'pidgeot',
        name: 'Pidgeot',
        level: 7,
        type: ['normal', 'flying'],
        stats: { hp: 45, atk: 60, def: 55, spa: 50, spd: 50, spe: 71 },
        currentHp: 45,
        maxHp: 45,
        moves: [
          { name: 'Peck', type: 'flying', power: 35, accuracy: 100, pp: 35, maxPp: 35, category: 'physical' }
        ]
      }
    ];
    
    const trainer = new Trainer('Youngster Joey', 'Youngster', trainerTeam, 8, 5);
    const trainerNPC = new NPC(8, 5, 'Youngster Joey', 'trainer', trainer.dialogue, trainer);
    this.npcManager.addNPC(trainerNPC);

    console.log(`🧍 Initialized ${this.npcManager.npcs.length} NPCs`);
  }

  /**
   * Handle player input
   */
  handleInput(input) {
    // Move player based on input
    if (input.up) {
      this.player.moveUp();
    }
    if (input.down) {
      this.player.moveDown();
    }
    if (input.left) {
      this.player.moveLeft();
    }
    if (input.right) {
      this.player.moveRight();
    }

    // Interaction
    if (input.interact) {
      this.handleInteraction();
    }

    // Menu
    if (input.menu) {
      console.log('Menu opened');
      // TODO: Open menu
    }
  }

  /**
   * Handle player interaction (NPCs, items, etc.)
   */
  handleInteraction() {
    const adjacentTile = this.getAdjacentTile();
    const npc = this.npcManager.getNPCAt(adjacentTile.x, adjacentTile.y);
    
    if (npc) {
      const result = npc.interact();
      
      if (result.action === 'dialogue') {
        console.log(`💬 ${npc.name}: ${result.text}`);
      } else if (result.action === 'battle') {
        console.log(`⚔️ Trainer ${npc.name} wants to battle!`);
        // TODO: Trigger trainer battle
      }
    } else {
      console.log('Nothing to interact with');
    }
  }

  /**
   * Get tile in front of player
   */
  getAdjacentTile() {
    const px = Math.floor(this.player.x / CONFIG.tile.size);
    const py = Math.floor(this.player.y / CONFIG.tile.size);
    
    let adjX = px;
    let adjY = py;

    if (this.player.direction === 'up') adjY--;
    if (this.player.direction === 'down') adjY++;
    if (this.player.direction === 'left') adjX--;
    if (this.player.direction === 'right') adjX++;

    return { x: adjX, y: adjY };
  }

  /**
   * Update scene logic
   */
  update(deltaTime) {
    this.framesSinceStart++;
    this.player.update(deltaTime, this.map);
    
    // Update NPCs
    this.npcManager.update(deltaTime);
    
    // Check for wild Pokemon encounters (only after initial startup period)
    if (this.framesSinceStart > this.encountersEnabledAfter) {
      const playerTileX = Math.floor(this.player.x / CONFIG.tile.size);
      const playerTileY = Math.floor(this.player.y / CONFIG.tile.size);
      
      // Check for encounter every frame if player is moving
      if (this.player.isMoving) {
        const encounter = this.encounterSystem.checkForEncounter(this.map, playerTileX, playerTileY);
        
        if (encounter) {
          console.log(`🔥 Encountered a wild ${encounter.name}!`);
          // Trigger battle transition
          this.game.onEncounter(encounter);
        }
      }
    }
    
    // TODO: Update animations
  }

  /**
   * Render scene
   */
  render(ctx) {
    // Render map
    this.map.render(ctx, this.player.x, this.player.y);

    // Render NPCs
    this.npcManager.render(ctx);

    // Render player
    this.player.render(ctx);

    // Render UI overlay (health, items, etc.)
    this.renderHUD(ctx);
  }

  /**
   * Render HUD (heads-up display)
   */
  renderHUD(ctx) {
    // TODO: Render health bars, item counts, etc.
  }
}
