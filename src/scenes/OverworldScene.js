export default class OverworldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'OverworldScene' });
  }

  preload() {
    // Load overworld assets
  }

  create() {
    // Create overworld map and player
    this.cameras.main.setBounds(0, 0, 1280, 720);
    this.physics.world.setBounds(0, 0, 1280, 720);

    // Add a temporary player sprite (placeholder)
    this.player = this.add.rectangle(160, 90, 16, 16, 0x00ff00);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.player);

    // Add input
    this.setupInput();
  }

  setupInput() {
    this.input.keyboard.on('keydown', (event) => {
      switch (event.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          this.player.body.setVelocityY(-100);
          break;
        case 'arrowdown':
        case 's':
          this.player.body.setVelocityY(100);
          break;
        case 'arrowleft':
        case 'a':
          this.player.body.setVelocityX(-100);
          break;
        case 'arrowright':
        case 'd':
          this.player.body.setVelocityX(100);
          break;
        case 'enter':
        case ' ':
          this.scene.start('BattleScene');
          break;
      }
    });

    this.input.keyboard.on('keyup', (event) => {
      switch (event.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
        case 'arrowdown':
        case 's':
          this.player.body.setVelocityY(0);
          break;
        case 'arrowleft':
        case 'a':
        case 'arrowright':
        case 'd':
          this.player.body.setVelocityX(0);
          break;
      }
    });
  }

  update() {
    // Update overworld logic
  }
}
