/**
 * NPC (Non-Player Character) Class
 * Handles NPC logic, dialogue, and trainer battles
 */

import { CONFIG } from '../config.js';

export class NPC {
  constructor(x, y, name, type = 'npc', dialogue = [], trainer = null) {
    // Position (in tiles)
    this.tileX = x;
    this.tileY = y;
    this.x = x * CONFIG.tile.size;
    this.y = y * CONFIG.tile.size;

    this.name = name;
    this.type = type; // 'npc', 'trainer', 'item', 'sign'
    this.dialogue = dialogue;
    this.trainer = trainer; // Trainer data if type is 'trainer'

    // Visual
    this.width = CONFIG.tile.size;
    this.height = CONFIG.tile.size;
    this.color = this.getColorByType();

    // State
    this.hasInteracted = false;
    this.currentDialogueIndex = 0;
  }

  /**
   * Get color based on NPC type
   */
  getColorByType() {
    switch (this.type) {
      case 'trainer':
        return '#FF6B6B'; // Red
      case 'npc':
        return '#4ECDC4'; // Teal
      case 'item':
        return '#FFD93D'; // Yellow
      case 'sign':
        return '#8B4513'; // Brown
      default:
        return '#CCCCCC'; // Gray
    }
  }

  /**
   * Handle interaction with NPC
   */
  interact() {
    if (this.type === 'trainer' && this.trainer) {
      return { action: 'battle', trainer: this.trainer };
    } else if (this.type === 'item') {
      return { action: 'item', item: this.name };
    } else if (this.dialogue.length > 0) {
      this.currentDialogueIndex = (this.currentDialogueIndex + 1) % this.dialogue.length;
      return { action: 'dialogue', text: this.dialogue[this.currentDialogueIndex] };
    }
    return null;
  }

  /**
   * Render NPC
   */
  render(ctx) {
    // Draw NPC as colored rectangle with a marker
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Draw type indicator (exclamation mark for trainers)
    if (this.type === 'trainer') {
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('!', this.x + this.width / 2, this.y + this.height / 2 + 3);
      ctx.textAlign = 'left';
    }
  }

  /**
   * Update NPC (for animations, movement, etc.)
   */
  update(deltaTime) {
    // Can add animation/movement logic here
  }

  /**
   * Check if player is adjacent to NPC
   */
  isAdjacentTo(playerTileX, playerTileY) {
    const dx = Math.abs(playerTileX - this.tileX);
    const dy = Math.abs(playerTileY - this.tileY);
    return (dx + dy) === 1; // Manhattan distance of 1
  }

  /**
   * Get dialogue text
   */
  getDialogue() {
    if (this.dialogue.length === 0) return 'Hello there!';
    return this.dialogue[this.currentDialogueIndex];
  }

  /**
   * Reset dialogue
   */
  resetDialogue() {
    this.currentDialogueIndex = 0;
  }
}

/**
 * Trainer NPC (special type)
 * Represents a trainer with a team of Pokemon
 */
export class Trainer {
  constructor(name, title, team, x, y) {
    this.name = name;
    this.title = title; // "Youngster", "Lass", etc.
    this.team = team; // Array of Pokemon
    this.x = x;
    this.y = y;
    
    this.hasBeatenBefore = false;
    this.dialogue = [
      `Hiya! I'm ${name} the ${title}!`,
      `I'll battle you!`,
      `You're pretty strong!`
    ];
  }

  /**
   * Get trainer's description
   */
  getDescription() {
    return `${this.title} ${this.name}`;
  }
}

/**
 * NPCManager - Manages all NPCs in a scene
 */
export class NPCManager {
  constructor() {
    this.npcs = [];
  }

  /**
   * Add NPC to scene
   */
  addNPC(npc) {
    this.npcs.push(npc);
  }

  /**
   * Get NPC at tile position
   */
  getNPCAt(tileX, tileY) {
    return this.npcs.find(npc => npc.tileX === tileX && npc.tileY === tileY);
  }

  /**
   * Get adjacent NPCs to player
   */
  getAdjacentNPCs(playerTileX, playerTileY) {
    return this.npcs.filter(npc => npc.isAdjacentTo(playerTileX, playerTileY));
  }

  /**
   * Render all NPCs
   */
  render(ctx) {
    this.npcs.forEach(npc => npc.render(ctx));
  }

  /**
   * Update all NPCs
   */
  update(deltaTime) {
    this.npcs.forEach(npc => npc.update(deltaTime));
  }

  /**
   * Get NPC count by type
   */
  getCountByType(type) {
    return this.npcs.filter(npc => npc.type === type).length;
  }
}
