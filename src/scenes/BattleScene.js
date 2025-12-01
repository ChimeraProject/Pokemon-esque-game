export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
  }

  preload() {
    // Load battle assets
  }

  create() {
    // Create battle UI
    this.add.text(160, 10, 'Battle System - WIP', {
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Add a simple back button
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('OverworldScene');
    });

    this.add.text(160, 170, 'Press ESC to return', {
      fontSize: '12px',
      color: '#aaaaaa',
    }).setOrigin(0.5);
  }

  update() {
    // Update battle logic
  }
}
