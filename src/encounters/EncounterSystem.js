/**
 * Pokemon Encounter System
 * Handles wild Pokemon encounters, encounter rates, and Pokemon generation
 */

import { CONFIG, TILE_TYPES } from '../config.js';
import { POKEMON } from '../data/pokemon.js';
import { MOVES } from '../data/moves.js';

export class EncounterSystem {
  constructor() {
    // Encounter rates by tile type and area
    this.encounterRates = {
      [TILE_TYPES.GRASS]: 0.5,    // 50% encounter rate on grass (increased for testing)
      [TILE_TYPES.WATER]: 0.3,    // 30% on water
      [TILE_TYPES.PATH]: 0,       // No encounters on path
      [TILE_TYPES.SAND]: 0.5,     // 50% on sand
      [TILE_TYPES.WALL]: 0,       // No encounters on walls
      [TILE_TYPES.TREE]: 0        // No encounters on trees
    };

    // Wild Pokemon pools by area (Route 29 style)
    this.wildPokemonPools = {
      'route29': [
        { species: 'pidgeot', level: 5, rate: 0.30 },
        { species: 'rattata', level: 3, rate: 0.40 },
        { species: 'sentret', level: 4, rate: 0.30 }
      ],
      'default': [
        { species: 'pidgeot', level: 5, rate: 0.5 },
        { species: 'rattata', level: 3, rate: 0.5 }
      ]
    };

    this.encounterSteps = 0;
    this.encounterThreshold = 0;
    this.setNewEncounterThreshold();

    console.log('🎣 Encounter System initialized');
  }

  /**
   * Set random threshold for next encounter
   */
  setNewEncounterThreshold() {
    this.encounterThreshold = Math.floor(Math.random() * 20) + 5; // 5-25 steps (reduced for testing)
    this.encounterSteps = 0;
  }

  /**
   * Check for encounter when player moves
   */
  checkForEncounter(map, playerTileX, playerTileY) {
    const tileType = map.getTile(playerTileX, playerTileY);
    const encounterRate = this.encounterRates[tileType] || 0;

    if (encounterRate === 0) {
      this.encounterSteps = 0;
      return null;
    }

    // Increment encounter steps
    this.encounterSteps++;

    // Log for debugging
    if (this.encounterSteps % 5 === 0) {
      console.log(`Steps: ${this.encounterSteps}/${this.encounterThreshold} on tile type ${tileType}`);
    }

    // Check if threshold met and roll encounter
    if (this.encounterSteps >= this.encounterThreshold) {
      const roll = Math.random();
      console.log(`Encounter check: roll ${roll} vs rate ${encounterRate}`);
      
      if (roll < encounterRate) {
        console.log('✅ Encounter triggered!');
        this.setNewEncounterThreshold();
        return this.generateWildPokemon('route29');
      }
      this.setNewEncounterThreshold();
    }

    return null;
  }

  /**
   * Generate a random wild Pokemon from pool
   */
  generateWildPokemon(areaName = 'default') {
    const pool = this.wildPokemonPools[areaName] || this.wildPokemonPools['default'];
    
    // Select random Pokemon from pool based on rates
    let random = Math.random();
    let selected = pool[0];
    
    for (const pokemon of pool) {
      if (random < pokemon.rate) {
        selected = pokemon;
        break;
      }
      random -= pokemon.rate;
    }

    // Create Pokemon instance with stats and moves
    return this.createPokemonInstance(selected.species, selected.level);
  }

  /**
   * Create a Pokemon instance with current HP, moves, etc.
   */
  createPokemonInstance(speciesName, level) {
    const species = POKEMON[speciesName];
    
    if (!species) {
      console.warn(`Pokemon species not found: ${speciesName}`);
      return null;
    }

    // Calculate stats based on level (simplified formula)
    const hpStat = Math.floor((2 * species.stats.hp + 31 + 0) / 4) + level + 5;
    const atkStat = Math.floor((2 * species.stats.atk + 31 + 0) / 4) + level + 5;
    const defStat = Math.floor((2 * species.stats.def + 31 + 0) / 4) + level + 5;
    const spaStat = Math.floor((2 * species.stats.spa + 31 + 0) / 4) + level + 5;
    const spdStat = Math.floor((2 * species.stats.spd + 31 + 0) / 4) + level + 5;
    const speStat = Math.floor((2 * species.stats.spe + 31 + 0) / 4) + level + 5;

    // Get moves for this level
    const moves = this.getMovesForLevel(speciesName, level);

    return {
      species: speciesName,
      name: species.name,
      id: species.id,
      level: level,
      type: species.type,
      stats: {
        hp: hpStat,
        atk: atkStat,
        def: defStat,
        spa: spaStat,
        spd: spdStat,
        spe: speStat
      },
      currentHp: hpStat,
      maxHp: hpStat,
      moves: moves,
      experience: 0,
      status: null  // 'burn', 'poison', 'paralysis', etc.
    };
  }

  /**
   * Get available moves for a Pokemon at given level
   */
  getMovesForLevel(speciesName, level) {
    const species = POKEMON[speciesName];
    if (!species || !species.moves) {
      return [];
    }

    // For now, return the first 4 available moves from species
    return species.moves.slice(0, 4).map(moveName => {
      const move = MOVES[moveName];
      return {
        name: move.name,
        id: move.id,
        type: move.type,
        category: move.category,
        power: move.power,
        accuracy: move.accuracy,
        pp: move.pp,
        maxPp: move.pp,
        description: move.description
      };
    });
  }

  /**
   * Get encounter rate for tile type
   */
  getEncounterRate(tileType) {
    return this.encounterRates[tileType] || 0;
  }

  /**
   * Reset encounter counter
   */
  resetEncounterCounter() {
    this.encounterSteps = 0;
  }
}
