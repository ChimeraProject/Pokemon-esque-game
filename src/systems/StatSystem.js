/**
 * Stat System - Gen 1-3 Pokemon Stats and Calculations
 * 
 * Stat formula from Gen 1-3:
 * HP: ((2 * Base + IV + EV/4) * Level/100 + Level + 5)
 * Other Stats: (((2 * Base + IV + EV/4) * Level/100 + 5) * Nature)
 */

export class StatSystem {
  /**
   * Calculate final stat value based on Gen 1-3 formula
   * @param {string} statType - 'hp', 'attack', 'defense', 'spatk', 'spdef', 'speed'
   * @param {number} baseStat - Base stat from species data
   * @param {number} level - Pokemon level
   * @param {number} iv - Individual Value (0-31)
   * @param {number} ev - Effort Value (0-252 for HP, 0-255 for others)
   * @param {number} natureMultiplier - Nature multiplier (usually 1.0, but 1.1 for favored or 0.9 for hindered)
   * @returns {number} Final stat value
   */
  static calculateStat(statType, baseStat, level, iv, ev, natureMultiplier = 1.0) {
    if (statType === 'hp') {
      // HP has unique formula
      return Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level / 100) + level + 5);
    } else {
      // All other stats use same formula with nature multiplier
      const base = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level / 100) + 5);
      return Math.floor(base * natureMultiplier);
    }
  }

  /**
   * Generate random IV values (0-31 for each stat)
   * Gen 1-3 uses 5 bits per stat
   * @returns {Object} IVs for all stats
   */
  static generateRandomIVs() {
    return {
      hp: Math.floor(Math.random() * 32),
      attack: Math.floor(Math.random() * 32),
      defense: Math.floor(Math.random() * 32),
      spatk: Math.floor(Math.random() * 32),
      spdef: Math.floor(Math.random() * 32),
      speed: Math.floor(Math.random() * 32)
    };
  }

  /**
   * Apply stat changes from battle status conditions
   * @param {number} stat - Current stat value
   * @param {number} stage - Stage change (-6 to 6)
   * @returns {number} Modified stat value
   */
  static applyStatStage(stat, stage) {
    const multipliers = {
      '-6': 0.25,
      '-5': 0.286,
      '-4': 0.333,
      '-3': 0.4,
      '-2': 0.5,
      '-1': 0.667,
      '0': 1.0,
      '1': 1.5,
      '2': 2.0,
      '3': 2.5,
      '4': 3.0,
      '5': 3.5,
      '6': 4.0
    };
    
    const clampedStage = Math.max(-6, Math.min(6, stage));
    return Math.floor(stat * (multipliers[clampedStage] || 1.0));
  }

  /**
   * Get nature multiplier by nature name
   * @param {string} nature - Nature name
   * @param {string} stat - Stat being modified
   * @returns {number} Multiplier (0.9, 1.0, or 1.1)
   */
  static getNatureMultiplier(nature, stat) {
    // Nature affects one stat by +10% and one by -10%
    const natures = {
      'hardy': { inc: null, dec: null },
      'lonely': { inc: 'attack', dec: 'defense' },
      'brave': { inc: 'attack', dec: 'speed' },
      'adamant': { inc: 'attack', dec: 'spatk' },
      'naughty': { inc: 'attack', dec: 'spdef' },
      'bold': { inc: 'defense', dec: 'attack' },
      'docile': { inc: null, dec: null },
      'relaxed': { inc: 'defense', dec: 'speed' },
      'impish': { inc: 'defense', dec: 'spatk' },
      'lax': { inc: 'defense', dec: 'spdef' },
      'timid': { inc: 'speed', dec: 'attack' },
      'hasty': { inc: 'speed', dec: 'defense' },
      'serious': { inc: null, dec: null },
      'jolly': { inc: 'speed', dec: 'spatk' },
      'naive': { inc: 'speed', dec: 'spdef' },
      'modest': { inc: 'spatk', dec: 'attack' },
      'mild': { inc: 'spatk', dec: 'defense' },
      'quiet': { inc: 'spatk', dec: 'speed' },
      'bashful': { inc: null, dec: null },
      'rash': { inc: 'spatk', dec: 'spdef' },
      'calm': { inc: 'spdef', dec: 'attack' },
      'gentle': { inc: 'spdef', dec: 'defense' },
      'sassy': { inc: 'spdef', dec: 'speed' },
      'careful': { inc: 'spdef', dec: 'spatk' },
      'quirky': { inc: null, dec: null }
    };

    const natureData = natures[nature?.toLowerCase()] || { inc: null, dec: null };
    
    if (stat === natureData.inc) return 1.1;
    if (stat === natureData.dec) return 0.9;
    return 1.0;
  }

  /**
   * Generate random nature
   * @returns {string} Nature name
   */
  static generateRandomNature() {
    const natures = [
      'hardy', 'lonely', 'brave', 'adamant', 'naughty',
      'bold', 'docile', 'relaxed', 'impish', 'lax',
      'timid', 'hasty', 'serious', 'jolly', 'naive',
      'modest', 'mild', 'quiet', 'bashful', 'rash',
      'calm', 'gentle', 'sassy', 'careful', 'quirky'
    ];
    return natures[Math.floor(Math.random() * natures.length)];
  }

  /**
   * Calculate all stats for a Pokemon
   * @param {Object} pokemon - Pokemon with baseStats, level, ivs, evs, nature
   * @returns {Object} All calculated stats
   */
  static calculateAllStats(pokemon) {
    // Support both naming conventions: baseStats or stats
    let baseStats = pokemon.baseStats;
    if (!baseStats) {
      // Try to map from pokemon.stats (uses abbreviated keys)
      baseStats = {
        hp: pokemon.stats?.hp,
        attack: pokemon.stats?.atk,
        defense: pokemon.stats?.def,
        spatk: pokemon.stats?.spa,
        spdef: pokemon.stats?.spd,
        speed: pokemon.stats?.spe
      };
    }

    const level = pokemon.level || 5;
    const ivs = pokemon.ivs || this.generateRandomIVs();
    const evs = pokemon.evs || { hp: 0, attack: 0, defense: 0, spatk: 0, spdef: 0, speed: 0 };
    const nature = pokemon.nature || 'hardy';

    return {
      hp: this.calculateStat('hp', baseStats.hp || 45, level, ivs.hp, evs.hp),
      attack: this.calculateStat('attack', baseStats.attack || 49, level, ivs.attack, evs.attack, this.getNatureMultiplier(nature, 'attack')),
      defense: this.calculateStat('defense', baseStats.defense || 49, level, ivs.defense, evs.defense, this.getNatureMultiplier(nature, 'defense')),
      spatk: this.calculateStat('spatk', baseStats.spatk || 65, level, ivs.spatk, evs.spatk, this.getNatureMultiplier(nature, 'spatk')),
      spdef: this.calculateStat('spdef', baseStats.spdef || 65, level, ivs.spdef, evs.spdef, this.getNatureMultiplier(nature, 'spdef')),
      speed: this.calculateStat('speed', baseStats.speed || 45, level, ivs.speed, evs.speed, this.getNatureMultiplier(nature, 'speed'))
    };
  }
}
