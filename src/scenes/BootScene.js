import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Load assets here
    // this.load.image('pokemon', 'assets/sprites/pokemon.png');
  }

  create() {
    // Initialize game state and transition to next scene
    this.scene.start('OverworldScene');
  }

  update() {
    // Boot scene update logic
  }
}
