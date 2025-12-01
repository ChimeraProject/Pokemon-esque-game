import Phaser from 'phaser';
import { BattleSystem } from '../game/BattleSystem';
import { Pokemon } from '../game/Pokemon';
import pokemonData from '../assets/data/pokemon/pokemon-data.json';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
    this.battleSystem = null;
    this.battleState = 'intro'; // intro, menu, attack, enemy-turn, end
    this.selectedMoveIndex = 0;
    this.playerPokemon = null;
    this.enemyPokemon = null;
    this.battleData = null;
  }

  init(data) {
    this.battleData = data || {};
  }

  preload() {
    // Battle assets loaded via imports
  }

  create() {
    // Create battle background
    this.createBattleBackground();
    
    // Initialize Pokemon
    this.initializePokemon();
    
    // Create battle UI
    this.createBattleUI();
    
    // Create health bars
    this.createHealthBars();
    
    // Create move selection menu
    this.createMoveMenu();
    
    // Set up input
    this.setupInput();
    
    // Start battle intro
    this.showBattleIntro();
  }

  createBattleBackground() {
    // Battle background
    this.add.rectangle(160, 90, 320, 180, 0x88ccff).setDepth(0);
    
    // Ground area
    this.add.rectangle(160, 130, 320, 100, 0x7cba5c).setDepth(0);
    
    // Player platform
    this.add.ellipse(80, 130, 80, 20, 0x5a9a3c).setDepth(1);
    
    // Enemy platform
    this.add.ellipse(240, 80, 80, 20, 0x5a9a3c).setDepth(1);
  }

  initializePokemon() {
    // Create player's starter Pokemon if not set
    if (!this.battleData.playerPokemon) {
      const starterData = pokemonData.pokemon.find(p => p.id === 155); // Cyndaquil
      this.playerPokemon = new Pokemon(
        155,
        'Cyndaquil',
        5,
        this.calculateStats(starterData.baseStats, 5),
        this.getMovesForLevel(starterData.moves, 5)
      );
    } else {
      this.playerPokemon = this.battleData.playerPokemon;
    }
    
    // Get enemy Pokemon from battle data
    if (this.battleData.type === 'wild' && this.battleData.wildPokemon) {
      this.enemyPokemon = this.battleData.wildPokemon;
    } else if (this.battleData.type === 'trainer' && this.battleData.trainerPokemon) {
      this.enemyPokemon = this.battleData.trainerPokemon[0];
    } else {
      // Default wild Pokemon for testing
      const pidgeyData = pokemonData.pokemon.find(p => p.id === 16);
      this.enemyPokemon = new Pokemon(
        16,
        'Pidgey',
        3,
        this.calculateStats(pidgeyData.baseStats, 3),
        this.getMovesForLevel(pidgeyData.moves, 3)
      );
    }
    
    // Initialize battle system
    this.battleSystem = new BattleSystem(
      [this.playerPokemon],
      [this.enemyPokemon]
    );
  }

  createBattleUI() {
    // Enemy Pokemon display (top left)
    this.enemyBox = this.add.graphics();
    this.enemyBox.fillStyle(0xf8f8f8, 0.9);
    this.enemyBox.fillRoundedRect(5, 5, 120, 35, 5);
    this.enemyBox.lineStyle(2, 0x303030);
    this.enemyBox.strokeRoundedRect(5, 5, 120, 35, 5);
    this.enemyBox.setDepth(50);
    
    this.enemyNameText = this.add.text(10, 8, this.enemyPokemon.name, {
      fontSize: '10px',
      color: '#000000',
      fontStyle: 'bold'
    }).setDepth(51);
    
    this.enemyLevelText = this.add.text(100, 8, `Lv${this.enemyPokemon.level}`, {
      fontSize: '8px',
      color: '#000000'
    }).setDepth(51);
    
    // Player Pokemon display (bottom right)
    this.playerBox = this.add.graphics();
    this.playerBox.fillStyle(0xf8f8f8, 0.9);
    this.playerBox.fillRoundedRect(195, 95, 120, 45, 5);
    this.playerBox.lineStyle(2, 0x303030);
    this.playerBox.strokeRoundedRect(195, 95, 120, 45, 5);
    this.playerBox.setDepth(50);
    
    this.playerNameText = this.add.text(200, 98, this.playerPokemon.name, {
      fontSize: '10px',
      color: '#000000',
      fontStyle: 'bold'
    }).setDepth(51);
    
    this.playerLevelText = this.add.text(290, 98, `Lv${this.playerPokemon.level}`, {
      fontSize: '8px',
      color: '#000000'
    }).setDepth(51);
    
    // Pokemon sprites (placeholder rectangles)
    this.playerSprite = this.add.rectangle(80, 115, 32, 32, 0x00ff00);
    this.playerSprite.setDepth(10);
    
    this.enemySprite = this.add.rectangle(240, 65, 28, 28, 0xff6600);
    this.enemySprite.setDepth(10);
    
    // Battle message box
    this.messageBox = this.add.graphics();
    this.messageBox.fillStyle(0xf8f8f8, 0.95);
    this.messageBox.fillRoundedRect(5, 145, 310, 30, 5);
    this.messageBox.lineStyle(2, 0x303030);
    this.messageBox.strokeRoundedRect(5, 145, 310, 30, 5);
    this.messageBox.setDepth(50);
    
    this.messageText = this.add.text(12, 152, '', {
      fontSize: '10px',
      color: '#000000',
      wordWrap: { width: 300 }
    }).setDepth(51);
  }

  createHealthBars() {
    // Enemy HP bar
    this.enemyHpBarBg = this.add.rectangle(75, 28, 45, 6, 0x303030).setDepth(51);
    this.enemyHpBar = this.add.rectangle(75, 28, 43, 4, 0x4cd137).setDepth(52);
    
    // Player HP bar
    this.playerHpBarBg = this.add.rectangle(265, 113, 45, 6, 0x303030).setDepth(51);
    this.playerHpBar = this.add.rectangle(265, 113, 43, 4, 0x4cd137).setDepth(52);
    
    // Player HP text
    this.playerHpText = this.add.text(240, 122, 
      `${this.playerPokemon.currentHp}/${this.playerPokemon.stats.hp}`, {
        fontSize: '8px',
        color: '#000000'
      }).setDepth(51);
  }

  createMoveMenu() {
    // Move menu container
    this.moveMenuBox = this.add.graphics();
    this.moveMenuBox.fillStyle(0xf8f8f8, 0.95);
    this.moveMenuBox.fillRoundedRect(160, 145, 155, 30, 5);
    this.moveMenuBox.lineStyle(2, 0x303030);
    this.moveMenuBox.strokeRoundedRect(160, 145, 155, 30, 5);
    this.moveMenuBox.setDepth(60);
    this.moveMenuBox.setVisible(false);
    
    // Action menu
    this.actionMenuBox = this.add.graphics();
    this.actionMenuBox.fillStyle(0xf8f8f8, 0.95);
    this.actionMenuBox.fillRoundedRect(250, 145, 65, 30, 5);
    this.actionMenuBox.lineStyle(2, 0x303030);
    this.actionMenuBox.strokeRoundedRect(250, 145, 65, 30, 5);
    this.actionMenuBox.setDepth(60);
    this.actionMenuBox.setVisible(false);
    
    // Action menu options
    this.actionOptions = ['FIGHT', 'RUN'];
    this.actionTexts = [];
    this.selectedActionIndex = 0;
    
    this.actionOptions.forEach((option, index) => {
      const text = this.add.text(260, 148 + index * 12, option, {
        fontSize: '8px',
        color: '#000000'
      }).setDepth(61);
      text.setVisible(false);
      this.actionTexts.push(text);
    });
    
    // Action selector
    this.actionSelector = this.add.text(254, 148, '▶', {
      fontSize: '8px',
      color: '#000000'
    }).setDepth(61);
    this.actionSelector.setVisible(false);
    
    // Move texts
    this.moveTexts = [];
    const moves = this.playerPokemon.moves;
    
    for (let i = 0; i < 4; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 175 + col * 75;
      const y = 148 + row * 12;
      
      const moveName = moves[i] ? moves[i].name : '-';
      const text = this.add.text(x, y, moveName, {
        fontSize: '8px',
        color: '#000000'
      }).setDepth(61);
      text.setVisible(false);
      this.moveTexts.push(text);
    }
    
    // Move selector
    this.moveSelector = this.add.text(167, 148, '▶', {
      fontSize: '8px',
      color: '#000000'
    }).setDepth(61);
    this.moveSelector.setVisible(false);
  }

  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.xKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
  }

  showBattleIntro() {
    const introText = this.battleData.type === 'wild' 
      ? `A wild ${this.enemyPokemon.name} appeared!`
      : `${this.battleData.trainerName || 'Trainer'} wants to battle!`;
    
    this.messageText.setText(introText);
    this.battleState = 'intro';
    
    // Flash enemy sprite
    this.tweens.add({
      targets: this.enemySprite,
      alpha: { from: 0, to: 1 },
      duration: 300,
      repeat: 2,
      onComplete: () => {
        this.time.delayedCall(1000, () => {
          this.messageText.setText(`Go! ${this.playerPokemon.name}!`);
          
          // Flash player sprite
          this.tweens.add({
            targets: this.playerSprite,
            alpha: { from: 0, to: 1 },
            duration: 300,
            repeat: 2,
            onComplete: () => {
              this.time.delayedCall(1000, () => {
                this.showActionMenu();
              });
            }
          });
        });
      }
    });
  }

  showActionMenu() {
    this.battleState = 'action-menu';
    this.messageText.setText(`What will ${this.playerPokemon.name} do?`);
    
    this.actionMenuBox.setVisible(true);
    this.actionTexts.forEach(t => t.setVisible(true));
    this.actionSelector.setVisible(true);
    this.selectedActionIndex = 0;
    this.updateActionSelector();
  }

  hideActionMenu() {
    this.actionMenuBox.setVisible(false);
    this.actionTexts.forEach(t => t.setVisible(false));
    this.actionSelector.setVisible(false);
  }

  showMoveMenu() {
    this.battleState = 'move-menu';
    this.hideActionMenu();
    
    this.moveMenuBox.setVisible(true);
    this.moveTexts.forEach(t => t.setVisible(true));
    this.moveSelector.setVisible(true);
    this.selectedMoveIndex = 0;
    this.updateMoveSelector();
  }

  hideMoveMenu() {
    this.moveMenuBox.setVisible(false);
    this.moveTexts.forEach(t => t.setVisible(false));
    this.moveSelector.setVisible(false);
  }

  updateActionSelector() {
    this.actionSelector.setY(148 + this.selectedActionIndex * 12);
  }

  updateMoveSelector() {
    const col = this.selectedMoveIndex % 2;
    const row = Math.floor(this.selectedMoveIndex / 2);
    this.moveSelector.setX(167 + col * 75);
    this.moveSelector.setY(148 + row * 12);
  }

  update() {
    // Handle input based on battle state
    switch (this.battleState) {
    case 'intro':
      // Skip intro with space/enter
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
            Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        // Speed up intro - not implemented for simplicity
      }
      break;
      
    case 'action-menu':
      this.handleActionMenuInput();
      break;
      
    case 'move-menu':
      this.handleMoveMenuInput();
      break;
      
    case 'message':
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
            Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        if (this.pendingAction) {
          this.pendingAction();
          this.pendingAction = null;
        }
      }
      break;
    }
    
    // ESC to run (in appropriate states)
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      if (this.battleState === 'move-menu') {
        this.hideMoveMenu();
        this.showActionMenu();
      } else if (this.battleData.type === 'wild' && 
                 (this.battleState === 'action-menu' || this.battleState === 'move-menu')) {
        this.attemptRun();
      }
    }
  }

  handleActionMenuInput() {
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.selectedActionIndex = Math.max(0, this.selectedActionIndex - 1);
      this.updateActionSelector();
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.selectedActionIndex = Math.min(this.actionOptions.length - 1, this.selectedActionIndex + 1);
      this.updateActionSelector();
    } else if (Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
               Phaser.Input.Keyboard.JustDown(this.enterKey) ||
               Phaser.Input.Keyboard.JustDown(this.zKey)) {
      this.selectAction();
    }
  }

  handleMoveMenuInput() {
    const moves = this.playerPokemon.moves;
    const maxMoves = Math.min(moves.length, 4);
    
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      if (this.selectedMoveIndex % 2 === 1) {
        this.selectedMoveIndex--;
        this.updateMoveSelector();
      }
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      if (this.selectedMoveIndex % 2 === 0 && this.selectedMoveIndex + 1 < maxMoves) {
        this.selectedMoveIndex++;
        this.updateMoveSelector();
      }
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      if (this.selectedMoveIndex >= 2) {
        this.selectedMoveIndex -= 2;
        this.updateMoveSelector();
      }
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      if (this.selectedMoveIndex + 2 < maxMoves) {
        this.selectedMoveIndex += 2;
        this.updateMoveSelector();
      }
    } else if (Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
               Phaser.Input.Keyboard.JustDown(this.enterKey) ||
               Phaser.Input.Keyboard.JustDown(this.zKey)) {
      this.selectMove();
    } else if (Phaser.Input.Keyboard.JustDown(this.xKey)) {
      this.hideMoveMenu();
      this.showActionMenu();
    }
  }

  selectAction() {
    const action = this.actionOptions[this.selectedActionIndex];
    
    switch (action) {
    case 'FIGHT':
      this.showMoveMenu();
      break;
    case 'RUN':
      this.attemptRun();
      break;
    }
  }

  selectMove() {
    const move = this.playerPokemon.moves[this.selectedMoveIndex];
    if (!move) return;
    
    this.hideMoveMenu();
    this.executePlayerAttack(move);
  }

  executePlayerAttack(move) {
    this.battleState = 'attacking';
    
    // Show attack message
    this.messageText.setText(`${this.playerPokemon.name} used ${move.name}!`);
    
    // Calculate damage
    const damage = this.battleSystem.calculateDamage(
      this.playerPokemon,
      this.enemyPokemon,
      move
    );
    
    // Apply damage with animation
    this.time.delayedCall(800, () => {
      this.enemyPokemon.takeDamage(damage);
      this.updateHealthBars();
      
      // Flash enemy sprite
      this.tweens.add({
        targets: this.enemySprite,
        alpha: 0,
        duration: 100,
        yoyo: true,
        repeat: 3
      });
      
      this.time.delayedCall(500, () => {
        if (!this.enemyPokemon.isAlive()) {
          this.handleEnemyFainted();
        } else {
          this.executeEnemyAttack();
        }
      });
    });
  }

  executeEnemyAttack() {
    this.battleState = 'enemy-turn';
    
    // Select random move
    const moveIndex = Math.floor(Math.random() * this.enemyPokemon.moves.length);
    const move = this.enemyPokemon.moves[moveIndex];
    
    if (!move) {
      this.showActionMenu();
      return;
    }
    
    this.messageText.setText(`${this.enemyPokemon.name} used ${move.name}!`);
    
    // Calculate damage
    const damage = this.battleSystem.calculateDamage(
      this.enemyPokemon,
      this.playerPokemon,
      move
    );
    
    this.time.delayedCall(800, () => {
      this.playerPokemon.takeDamage(damage);
      this.updateHealthBars();
      
      // Flash player sprite
      this.tweens.add({
        targets: this.playerSprite,
        alpha: 0,
        duration: 100,
        yoyo: true,
        repeat: 3
      });
      
      this.time.delayedCall(500, () => {
        if (!this.playerPokemon.isAlive()) {
          this.handlePlayerFainted();
        } else {
          this.showActionMenu();
        }
      });
    });
  }

  updateHealthBars() {
    // Update player HP bar
    const playerHpPercent = this.playerPokemon.currentHp / this.playerPokemon.stats.hp;
    this.playerHpBar.setScale(playerHpPercent, 1);
    this.playerHpBar.setX(265 - (43 * (1 - playerHpPercent)) / 2);
    this.playerHpBar.setFillStyle(this.getHpColor(playerHpPercent));
    this.playerHpText.setText(`${this.playerPokemon.currentHp}/${this.playerPokemon.stats.hp}`);
    
    // Update enemy HP bar
    const enemyHpPercent = this.enemyPokemon.currentHp / this.enemyPokemon.stats.hp;
    this.enemyHpBar.setScale(enemyHpPercent, 1);
    this.enemyHpBar.setX(75 - (43 * (1 - enemyHpPercent)) / 2);
    this.enemyHpBar.setFillStyle(this.getHpColor(enemyHpPercent));
  }

  getHpColor(percent) {
    if (percent > 0.5) return 0x4cd137;
    if (percent > 0.2) return 0xfbc531;
    return 0xe84118;
  }

  handleEnemyFainted() {
    this.battleState = 'end';
    
    // Fade out enemy sprite
    this.tweens.add({
      targets: this.enemySprite,
      y: this.enemySprite.y + 20,
      alpha: 0,
      duration: 500
    });
    
    this.messageText.setText(`${this.enemyPokemon.name} fainted!`);
    
    this.time.delayedCall(1500, () => {
      this.messageText.setText(`${this.playerPokemon.name} gained EXP!`);
      this.battleState = 'message';
      this.pendingAction = () => this.endBattle(true);
    });
  }

  handlePlayerFainted() {
    this.battleState = 'end';
    
    // Fade out player sprite
    this.tweens.add({
      targets: this.playerSprite,
      y: this.playerSprite.y + 20,
      alpha: 0,
      duration: 500
    });
    
    this.messageText.setText(`${this.playerPokemon.name} fainted!`);
    
    this.time.delayedCall(1500, () => {
      this.messageText.setText('You blacked out!');
      this.battleState = 'message';
      this.pendingAction = () => this.endBattle(false);
    });
  }

  attemptRun() {
    if (this.battleData.type !== 'wild') {
      this.messageText.setText('Can\'t escape from a trainer battle!');
      this.time.delayedCall(1000, () => this.showActionMenu());
      return;
    }
    
    this.hideActionMenu();
    this.hideMoveMenu();
    this.battleState = 'running';
    
    // 50% base escape chance
    const escapeChance = 0.5 + (this.playerPokemon.stats.speed - this.enemyPokemon.stats.speed) / 100;
    
    if (Math.random() < escapeChance) {
      this.messageText.setText('Got away safely!');
      this.time.delayedCall(1000, () => this.endBattle(null));
    } else {
      this.messageText.setText('Can\'t escape!');
      this.time.delayedCall(1000, () => this.executeEnemyAttack());
    }
  }

  endBattle(playerWon) {
    // Return to overworld
    this.scene.start('OverworldScene', {
      currentMapId: this.battleData.currentMapId,
      playerPosition: this.battleData.playerPosition,
      battleResult: playerWon
    });
  }

  calculateStats(baseStats, level) {
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
    const knownMoves = allMoves
      .filter(m => m.learnLevel <= level)
      .slice(-4);
    
    return knownMoves.map(m => ({
      name: m.name,
      type: m.type,
      power: m.power,
      accuracy: m.accuracy,
      pp: m.pp,
      currentPp: m.pp
    }));
  }
}
