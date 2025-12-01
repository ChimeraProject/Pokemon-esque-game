/**
 * Battle Scene - Turn-based battle UI and management
 * Displays Pokemon, HP bars, move selection, and battle text
 */

import { CONFIG } from '../config.js';
import { BattleSystem } from './BattleSystem.js';
import { SpriteManager } from '../graphics/SpriteManager.js';
import { LevelingSystem } from '../systems/LevelingSystem.js';
import { ExperienceSystem } from '../systems/ExperienceSystem.js';

export class BattleScene {
  constructor(game, playerPokemon, wildPokemon) {
    this.game = game;
    this.playerTeam = Array.isArray(playerPokemon) ? playerPokemon : [playerPokemon];
    this.enemyTeam = Array.isArray(wildPokemon) ? wildPokemon : [wildPokemon];
    
    this.battleSystem = new BattleSystem(this.playerTeam, this.enemyTeam);
    this.spriteManager = new SpriteManager();
    
    this.currentMenuState = 'action'; // 'action', 'move', 'switch', 'waiting'
    this.selectedAction = 0;
    this.selectedMove = 0;
    this.battleLog = [];
    this.animationQueue = [];
    this.battleOver = false;
    this.waitingForEnemyTurn = false; // Track if we're waiting for enemy turn
    
    // Sprite tracking
    this.playerSprite = null;
    this.enemySprite = null;
    this.spritesLoading = true;
    
    // Input tracking to prevent rapid repeated inputs
    this.lastInputTime = 0;
    this.inputDelay = 200; // ms between inputs
    
    this.addBattleLog(`A wild ${this.battleSystem.enemyActive.name} appeared!`);
    this.loadBattleSprites();
    
    // Initialize Pokemon with stats if not already done
    for (const pokemon of this.playerTeam) {
      if (!pokemon.stats || !pokemon.stats.attack) {
        LevelingSystem.initializePokemon(pokemon);
      }
      // Ensure currentHp is set
      if (!pokemon.currentHp && pokemon.currentHp !== 0) {
        pokemon.currentHp = pokemon.stats?.hp || 40;
      }
    }
    for (const pokemon of this.enemyTeam) {
      if (!pokemon.stats || !pokemon.stats.attack) {
        LevelingSystem.initializePokemon(pokemon);
      }
      // Ensure currentHp is set
      if (!pokemon.currentHp && pokemon.currentHp !== 0) {
        pokemon.currentHp = pokemon.stats?.hp || 40;
      }
    }
    
    console.log('⚔️ Battle Scene initialized');
  }

  /**
   * Handle input during battle
   */
  handleInput(input) {
    if (this.battleOver) {
      if (input.interact) {
        this.game.returnToOverworld();
      }
      return;
    }

    const now = Date.now();
    const canInput = now - this.lastInputTime > this.inputDelay;

    // Don't accept input while waiting for enemy turn
    if (this.currentMenuState === 'waiting') {
      return;
    }

    if (this.currentMenuState === 'action') {
      if (canInput && (input.left || input.right || input.down || input.up)) {
        if (input.left) this.selectedAction = 0;
        if (input.right) this.selectedAction = 1;
        if (input.down) this.selectedAction = (this.selectedAction + 1) % 4;
        if (input.up) this.selectedAction = (this.selectedAction - 1 + 4) % 4;
        this.lastInputTime = now;
      }
      
      if (input.interact) {
        this.handleActionSelect();
        this.lastInputTime = now;
      }
    } else if (this.currentMenuState === 'move') {
      if (canInput && (input.up || input.down)) {
        if (input.up) this.selectedMove = Math.max(0, this.selectedMove - 1);
        if (input.down) this.selectedMove = Math.min(this.battleSystem.playerActive.moves.length - 1, this.selectedMove + 1);
        this.lastInputTime = now;
      }
      
      if (input.interact) {
        this.executePlayerMove();
        this.lastInputTime = now;
      }
      
      if (input.menu) {
        this.currentMenuState = 'action';
        this.lastInputTime = now;
      }
    }
  }

  /**
   * Handle action selection (Fight, Switch, Item, Run)
   */
  handleActionSelect() {
    switch (this.selectedAction) {
      case 0: // Fight
        this.currentMenuState = 'move';
        this.selectedMove = 0;
        break;
      case 1: // Switch
        // TODO: Implement switch Pokemon
        break;
      case 2: // Item
        // TODO: Implement item usage
        break;
      case 3: // Run
        this.addBattleLog(`You fled from battle!`);
        this.battleOver = true;
        break;
    }
  }

  /**
   * Execute player's move
   */
  executePlayerMove() {
    const move = this.battleSystem.playerActive.moves[this.selectedMove];
    
    if (!move || move.pp <= 0) {
      this.addBattleLog('No PP left for that move!');
      return;
    }
    
    // Decrement PP
    move.pp--;
    
    // Calculate damage and execute
    const damage = this.battleSystem.executeAttack(
      this.battleSystem.playerActive,
      this.battleSystem.enemyActive,
      move
    );
    
    this.addBattleLog(this.battleSystem.battleLog[this.battleSystem.battleLog.length - 1]);
    
    // Check if enemy fainted
    if (this.battleSystem.enemyActive.currentHp <= 0) {
      this.addBattleLog(`${this.battleSystem.enemyActive.name} fainted!`);
      
      // Award experience to all player Pokemon that participated
      this.awardExperience();
      
      // Check if all enemy Pokemon are fainted
      if (this.battleSystem.getWinner() === 'player') {
        this.addBattleLog('Victory! You won the battle!');
        this.battleOver = true;
      }
      return;
    }
    
    // Set to waiting state and schedule enemy turn after delay
    this.currentMenuState = 'waiting';
    this.waitingForEnemyTurn = true;
    setTimeout(() => {
      if (this.waitingForEnemyTurn) {
        this.executeEnemyTurn();
      }
    }, 1000);
  }

  /**
   * Award experience to player Pokemon
   */
  awardExperience() {
    // Calculate experience from defeated enemy
    const defeatedPokemon = this.battleSystem.enemyActive;
    const baseExp = ExperienceSystem.getBaseExperience(defeatedPokemon.species);
    const defeatedLevel = defeatedPokemon.level || 5;

    // Award exp to all player Pokemon
    for (const pokemon of this.playerTeam) {
      if (pokemon.currentHp > 0) {
        // Calculate exp gained
        const expGained = ExperienceSystem.getExperienceReward(
          baseExp,
          defeatedLevel,
          pokemon.level || 5,
          1 // participants
        );

        this.addBattleLog(`${pokemon.name} gained ${expGained} EXP!`);

        // Add experience and check for level up
        const result = LevelingSystem.gainExperience(pokemon, expGained);

        if (result.leveledUp) {
          // Show level up messages
          const message = LevelingSystem.formatLevelUpMessage(pokemon, result);
          this.addBattleLog(message);
        }

        // Add EVs from defeated Pokemon
        const evGains = LevelingSystem.getEVGains(defeatedPokemon.species);
        LevelingSystem.addEVs(pokemon, evGains);
      }
    }
  }

  /**
   * Execute enemy's turn
   */
  executeEnemyTurn() {
    this.waitingForEnemyTurn = false;
    
    if (this.battleSystem.enemyActive.currentHp <= 0) {
      this.addBattleLog(`${this.battleSystem.enemyActive.name} fainted!`);
      
      // Check if all enemy Pokemon are fainted
      if (this.battleSystem.getWinner() === 'player') {
        this.addBattleLog('Victory! You won the battle!');
        this.battleOver = true;
      }
      return;
    }
    
    // Enemy AI: select random move
    const moves = this.battleSystem.enemyActive.moves;
    const validMoves = moves.filter(m => m.pp > 0);
    
    if (validMoves.length === 0) {
      this.addBattleLog(`${this.battleSystem.enemyActive.name} has no PP left!`);
      this.currentMenuState = 'action';
      return;
    }
    
    const selectedMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    selectedMove.pp--;
    
    const damage = this.battleSystem.executeAttack(
      this.battleSystem.enemyActive,
      this.battleSystem.playerActive,
      selectedMove
    );
    
    this.addBattleLog(this.battleSystem.battleLog[this.battleSystem.battleLog.length - 1]);
    
    if (this.battleSystem.playerActive.currentHp <= 0) {
      this.addBattleLog(`${this.battleSystem.playerActive.name} fainted!`);
      
      if (this.battleSystem.getWinner() === 'enemy') {
        this.addBattleLog('Defeat! You lost the battle!');
        this.battleOver = true;
      }
      return;
    }
    
    // Return to action menu for player's next turn
    this.currentMenuState = 'action';
  }

  /**
   * Add text to battle log
   */
  addBattleLog(text) {
    this.battleLog.push(text);
    if (this.battleLog.length > 3) {
      this.battleLog.shift();
    }
  }

  /**
   * Update battle state
   */
  update(deltaTime) {
    // Animation queue updates can go here
  }

  /**
   * Load sprites for battle Pokemon
   */
  async loadBattleSprites() {
    try {
      // Load player sprite (back view) and enemy sprite (front view)
      const playerName = this.battleSystem.playerActive.species || this.battleSystem.playerActive.name.toLowerCase();
      const enemyName = this.battleSystem.enemyActive.species || this.battleSystem.enemyActive.name.toLowerCase();
      
      this.playerSprite = await this.spriteManager.loadSprite(playerName, 'back');
      this.enemySprite = await this.spriteManager.loadSprite(enemyName, 'front');
      
      this.spritesLoading = false;
      console.log('✅ Battle sprites loaded successfully');
    } catch (error) {
      console.warn('Failed to load battle sprites:', error);
      this.spritesLoading = false;
    }
  }

  /**
   * Render battle scene
   */
  render(ctx) {
    // Clear background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

    // Draw enemy Pokemon info
    this.renderEnemyInfo(ctx);

    // Draw player Pokemon info
    this.renderPlayerInfo(ctx);

    // Draw battle menu
    this.renderBattleMenu(ctx);

    // Draw battle log
    this.renderBattleLog(ctx);

    // Draw battle over message if applicable
    if (this.battleOver) {
      this.renderBattleOverlay(ctx);
    }
  }

  /**
   * Render enemy Pokemon info
   */
  renderEnemyInfo(ctx) {
    const pokemon = this.battleSystem.enemyActive;
    
    // Position: top-right
    const x = CONFIG.canvas.width - 80;
    const y = 10;

    // Draw enemy sprite if available
    if (this.enemySprite && !this.spritesLoading) {
      this.spriteManager.drawSprite(ctx, this.enemySprite, CONFIG.canvas.width - 50, 50, 2);
    }

    // Name and level
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText(`${pokemon.name} Lv.${pokemon.level}`, x, y + 12);

    // HP bar background
    ctx.fillStyle = '#333333';
    ctx.fillRect(x, y + 20, 60, 10);

    // HP bar foreground
    const hpPercent = pokemon.currentHp / pokemon.maxHp;
    const barColor = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
    ctx.fillStyle = barColor;
    ctx.fillRect(x, y + 20, 60 * hpPercent, 10);

    // HP text
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';
    ctx.fillText(`${pokemon.currentHp}/${pokemon.maxHp}`, x + 2, y + 37);
  }

  /**
   * Render player Pokemon info
   */
  renderPlayerInfo(ctx) {
    const pokemon = this.battleSystem.playerActive;
    
    // Position: bottom-left
    const x = 10;
    const y = CONFIG.canvas.height - 50;

    // Draw player sprite if available
    if (this.playerSprite && !this.spritesLoading) {
      this.spriteManager.drawSprite(ctx, this.playerSprite, 50, CONFIG.canvas.height - 70, 2);
    }

    // Name and level
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText(`${pokemon.name} Lv.${pokemon.level}`, x, y + 12);

    // HP bar background
    ctx.fillStyle = '#333333';
    ctx.fillRect(x, y + 20, 60, 10);

    // HP bar foreground
    const hpPercent = pokemon.currentHp / pokemon.maxHp;
    const barColor = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
    ctx.fillStyle = barColor;
    ctx.fillRect(x, y + 20, 60 * hpPercent, 10);

    // HP text
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';
    ctx.fillText(`${pokemon.currentHp}/${pokemon.maxHp}`, x + 2, y + 37);
  }

  /**
   * Render battle action menu
   */
  renderBattleMenu(ctx) {
    if (this.currentMenuState === 'action') {
      this.renderActionMenu(ctx);
    } else if (this.currentMenuState === 'move') {
      this.renderMoveMenu(ctx);
    }
  }

  /**
   * Render action selection menu
   */
  renderActionMenu(ctx) {
    const actions = ['Fight', 'Switch', 'Item', 'Run'];
    const x = 10;
    const y = CONFIG.canvas.height - 35;
    const buttonWidth = 50;
    const buttonHeight = 14;
    const padding = 2;

    // Menu background
    ctx.fillStyle = '#222222';
    ctx.fillRect(x - 2, y - 2, buttonWidth * 2 + padding * 3 + 2, buttonHeight * 2 + padding * 3 + 2);
    
    // Menu border
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 2, y - 2, buttonWidth * 2 + padding * 3 + 2, buttonHeight * 2 + padding * 3 + 2);

    for (let i = 0; i < actions.length; i++) {
      const isSelected = i === this.selectedAction;
      const col = i % 2;
      const row = Math.floor(i / 2);
      const posX = x + col * (buttonWidth + padding);
      const posY = y + row * (buttonHeight + padding);

      // Draw button background
      ctx.fillStyle = isSelected ? '#00ff00' : '#666666';
      ctx.fillRect(posX, posY, buttonWidth, buttonHeight);
      
      // Draw button border if selected
      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(posX, posY, buttonWidth, buttonHeight);
      }

      // Draw text
      ctx.fillStyle = isSelected ? '#000000' : '#ffffff';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(actions[i], posX + buttonWidth / 2, posY + 11);
      ctx.textAlign = 'left';
    }
  }

  /**
   * Render move selection menu
   */
  renderMoveMenu(ctx) {
    const pokemon = this.battleSystem.playerActive;
    const x = 10;
    const y = CONFIG.canvas.height - 100;
    const moveHeight = 16;

    const menuHeight = Math.min(pokemon.moves.length * moveHeight + 6, 70);
    
    // Menu background
    ctx.fillStyle = '#222222';
    ctx.fillRect(x - 2, y - 2, 100, menuHeight);
    
    // Menu border
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 2, y - 2, 100, menuHeight);

    for (let i = 0; i < pokemon.moves.length; i++) {
      const move = pokemon.moves[i];
      const isSelected = i === this.selectedMove;
      const posY = y + i * moveHeight;

      if (posY + moveHeight > y + menuHeight) break;

      // Draw button background
      ctx.fillStyle = isSelected ? '#00ff00' : '#666666';
      ctx.fillRect(x, posY, 96, moveHeight - 1);
      
      // Draw button border if selected
      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, posY, 96, moveHeight - 1);
      }

      // Draw text
      ctx.fillStyle = isSelected ? '#000000' : '#ffffff';
      ctx.font = 'bold 10px Arial';
      ctx.fillText(`${move.name} (${move.pp}/${move.maxPp})`, x + 4, posY + 12);
    }
  }

  /**
   * Render battle log (bottom of screen)
   */
  renderBattleLog(ctx) {
    const x = 10;
    const y = CONFIG.canvas.height - 95;
    const logHeight = 55;

    ctx.fillStyle = '#444444';
    ctx.fillRect(x - 2, y - 2, CONFIG.canvas.width - 20, logHeight);

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';

    for (let i = 0; i < this.battleLog.length; i++) {
      ctx.fillText(this.battleLog[i], x + 4, y + (i * 13) + 11);
    }
  }

  /**
   * Render battle over overlay
   */
  renderBattleOverlay(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Battle Over!', CONFIG.canvas.width / 2, CONFIG.canvas.height / 2 - 20);
    
    ctx.font = '12px Arial';
    ctx.fillText('Press Enter to continue', CONFIG.canvas.width / 2, CONFIG.canvas.height / 2 + 20);
    ctx.textAlign = 'left';
  }
}
