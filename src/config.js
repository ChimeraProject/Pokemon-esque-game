/**
 * Central configuration for Pokemon HeartGold Clone
 * Inspired by Zelda3's configuration approach
 */

export const CONFIG = {
  // Canvas settings
  canvas: {
    width: 240,
    height: 160,
    scale: 3,  // 3x upscaling = 720x480 display
    targetWidth: 720,
    targetHeight: 480
  },

  // Tile settings (16x16 pixels like SNES)
  tile: {
    size: 16,
    width: 240 / 16,  // 15 tiles
    height: 160 / 16  // 10 tiles
  },

  // Game physics
  physics: {
    moveSpeed: 0.1,    // tiles per frame
    friction: 0.85,
    gravity: 0.0       // No gravity in overworld
  },

  // Frame rate
  fps: {
    target: 60,
    deltaTime: 1000 / 60
  },

  // Input
  input: {
    repeatRate: 100,   // ms before key repeat
    repeatDelay: 500   // ms before repeat starts
  },

  // Battle settings
  battle: {
    speed: 'normal',   // 'slow', 'normal', 'fast'
    expGain: 1.0,
    moneyMultiplier: 1.0
  },

  // Debug
  debug: {
    showCollision: false,
    showGrid: false,
    showFPS: true,
    logInput: false
  }
};

export const TILE_TYPES = {
  GRASS: 0,
  WATER: 1,
  WALL: 2,
  PATH: 3,
  SAND: 4,
  TREE: 5
};
