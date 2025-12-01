/**
 * Game configuration constants
 */
export const GameConfig = {
  // Player settings
  player: {
    speed: 80,
    size: 14
  },

  // Wild encounter settings
  wildEncounter: {
    rate: 0.1, // 10% chance per step in tall grass
    throttleMs: 500 // Minimum ms between encounter checks
  },

  // Battle damage calculation constants
  // Based on Pokemon damage formula: ((2L/5 + 2) * A * P / D / 50 + 2) * M
  battle: {
    levelMultiplier: 2,
    levelDivisor: 250,
    baseDamage: 2,
    damageRandomMin: 0.85,
    damageRandomMax: 1.0,
    damageRandomRange: 0.15,
    minDamage: 1
  },

  // Map settings
  map: {
    defaultTileSize: 16
  },

  // Camera settings
  camera: {
    zoom: 2,
    lerpX: 0.1,
    lerpY: 0.1
  }
};
