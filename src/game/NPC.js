/**
 * NPC - Non-player character class for dialogue and trainer battles
 */
export class NPC {
  constructor(id, name, x, y, sprite, dialogue = [], options = {}) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.dialogue = dialogue;
    this.isTrainer = options.isTrainer || false;
    this.pokemon = options.pokemon || [];
    this.defeatDialogue = options.defeatDialogue || [];
    this.isDefeated = false;
    this.facingDirection = options.facingDirection || 'down';
    this.movementPattern = options.movementPattern || null;
    this.sightRange = options.sightRange || 4;
  }

  /**
   * Get dialogue based on NPC state
   */
  getDialogue() {
    if (this.isTrainer && this.isDefeated) {
      return this.defeatDialogue.length > 0 
        ? this.defeatDialogue 
        : ['...'];
    }
    return this.dialogue;
  }

  /**
   * Check if NPC can see the player
   * @param {number} playerX - Player X position
   * @param {number} playerY - Player Y position
   * @param {number} tileSize - Size of each tile
   */
  canSeePlayer(playerX, playerY, tileSize) {
    if (!this.isTrainer || this.isDefeated) return false;
    
    const npcTileX = this.x;
    const npcTileY = this.y;
    const playerTileX = Math.floor(playerX / tileSize);
    const playerTileY = Math.floor(playerY / tileSize);
    
    switch (this.facingDirection) {
    case 'up':
      return playerTileX === npcTileX && 
          playerTileY < npcTileY && 
          playerTileY >= npcTileY - this.sightRange;
    case 'down':
      return playerTileX === npcTileX && 
          playerTileY > npcTileY && 
          playerTileY <= npcTileY + this.sightRange;
    case 'left':
      return playerTileY === npcTileY && 
          playerTileX < npcTileX && 
          playerTileX >= npcTileX - this.sightRange;
    case 'right':
      return playerTileY === npcTileY && 
          playerTileX > npcTileX && 
          playerTileX <= npcTileX + this.sightRange;
    default:
      return false;
    }
  }

  /**
   * Mark trainer as defeated
   */
  defeat() {
    this.isDefeated = true;
  }

  /**
   * Get Pokemon team for battle
   */
  getTeam() {
    return this.pokemon;
  }

  /**
   * Serialize NPC state for saving
   */
  serialize() {
    return {
      id: this.id,
      isDefeated: this.isDefeated
    };
  }

  /**
   * Load NPC state from save data
   */
  loadState(saveData) {
    if (saveData && saveData.id === this.id) {
      this.isDefeated = saveData.isDefeated || false;
    }
  }
}

/**
 * GymLeader - Extended NPC class for gym leaders
 */
export class GymLeader extends NPC {
  constructor(id, name, x, y, sprite, dialogue, options = {}) {
    super(id, name, x, y, sprite, dialogue, { ...options, isTrainer: true });
    this.gymType = options.gymType || 'normal';
    this.badgeName = options.badgeName || 'Badge';
    this.badgeId = options.badgeId || null;
    this.prizeMoney = options.prizeMoney || 1000;
    this.tmReward = options.tmReward || null;
  }

  /**
   * Get rewards for defeating this gym leader
   */
  getRewards() {
    return {
      badge: this.badgeName,
      badgeId: this.badgeId,
      money: this.prizeMoney,
      tm: this.tmReward
    };
  }
}

/**
 * Create NPCs from map data
 */
export function createNPCsFromMapData(npcsData) {
  return npcsData.map(data => {
    if (data.isGymLeader) {
      return new GymLeader(
        data.id,
        data.name,
        data.x,
        data.y,
        data.sprite,
        data.dialogue,
        {
          pokemon: data.pokemon,
          defeatDialogue: data.defeatDialogue,
          gymType: data.gymType,
          badgeName: data.badgeName,
          badgeId: data.badgeId,
          prizeMoney: data.prizeMoney,
          tmReward: data.tmReward,
          facingDirection: data.facingDirection,
          sightRange: data.sightRange
        }
      );
    }
    
    return new NPC(
      data.id,
      data.name,
      data.x,
      data.y,
      data.sprite,
      data.dialogue,
      {
        isTrainer: data.isTrainer,
        pokemon: data.pokemon,
        defeatDialogue: data.defeatDialogue,
        facingDirection: data.facingDirection,
        sightRange: data.sightRange
      }
    );
  });
}
