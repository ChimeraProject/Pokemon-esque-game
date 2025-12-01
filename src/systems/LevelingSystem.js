/**
 * Leveling System - Pokemon Level Up and Stat Growth
 * Handles level progression and stat calculations
 */

import { ExperienceSystem } from './ExperienceSystem.js';
import { StatSystem } from './StatSystem.js';

export class LevelingSystem {
  /**
   * Initialize a Pokemon with starting stats
   * @param {Object} pokemon - Pokemon data
   * @returns {Object} Pokemon with all stat data initialized
   */
  static initializePokemon(pokemon) {
    if (!pokemon.level) pokemon.level = 5;
    if (!pokemon.currentExperience) pokemon.currentExperience = 0;
    if (!pokemon.growthRate) {
      pokemon.growthRate = ExperienceSystem.getGrowthRate(pokemon.species);
    }
    if (!pokemon.nature) {
      pokemon.nature = StatSystem.generateRandomNature();
    }
    if (!pokemon.ivs) {
      pokemon.ivs = StatSystem.generateRandomIVs();
    }
    if (!pokemon.evs) {
      pokemon.evs = { hp: 0, attack: 0, defense: 0, spatk: 0, spdef: 0, speed: 0 };
    }

    // Calculate or recalculate stats using StatSystem
    pokemon.stats = StatSystem.calculateAllStats(pokemon);

    // Set experience thresholds
    pokemon.experienceThisLevel = ExperienceSystem.getExperienceForLevel(pokemon.level, pokemon.growthRate);
    pokemon.experienceNextLevel = ExperienceSystem.getExperienceForLevel(pokemon.level + 1, pokemon.growthRate);
    pokemon.experienceToNextLevel = pokemon.experienceNextLevel - pokemon.experienceThisLevel;

    // Set HP to full if not already set
    if (!pokemon.currentHp && pokemon.currentHp !== 0) {
      pokemon.currentHP = pokemon.stats.hp;
    }

    return pokemon;
  }

  /**
   * Add experience and check for level up
   * @param {Object} pokemon - Pokemon to add experience to
   * @param {number} experienceGained - Amount of experience
   * @returns {Object} Result with leveledUp flag and details
   */
  static gainExperience(pokemon, experienceGained) {
    const startLevel = pokemon.level;
    pokemon.currentExperience += experienceGained;

    const result = {
      experienceGained,
      startLevel,
      leveledUp: false,
      newLevel: startLevel,
      levelUps: 0,
      statIncreases: []
    };

    // Check for multiple level ups
    while (pokemon.level < 100) {
      const nextLevelExp = ExperienceSystem.getExperienceForLevel(
        pokemon.level + 1,
        pokemon.growthRate
      );

      if (pokemon.currentExperience >= nextLevelExp) {
        pokemon.level += 1;
        result.leveledUp = true;
        result.levelUps += 1;

        // Calculate new stats
        const oldStats = { ...pokemon.stats };
        pokemon.stats = StatSystem.calculateAllStats(pokemon);

        // Track stat increases
        const increases = {
          level: pokemon.level,
          hp: pokemon.stats.hp - oldStats.hp,
          attack: pokemon.stats.attack - oldStats.attack,
          defense: pokemon.stats.defense - oldStats.defense,
          spatk: pokemon.stats.spatk - oldStats.spatk,
          spdef: pokemon.stats.spdef - oldStats.spdef,
          speed: pokemon.stats.speed - oldStats.speed
        };

        result.statIncreases.push(increases);

        // Heal HP on level up
        pokemon.currentHP = pokemon.stats.hp;

        // Check for new moves (optional - can expand later)
        // this.checkForNewMoves(pokemon);

        // Update experience thresholds
        pokemon.experienceThisLevel = ExperienceSystem.getExperienceForLevel(pokemon.level, pokemon.growthRate);
        pokemon.experienceNextLevel = ExperienceSystem.getExperienceForLevel(pokemon.level + 1, pokemon.growthRate);
        pokemon.experienceToNextLevel = pokemon.experienceNextLevel - pokemon.experienceThisLevel;
      } else {
        break;
      }
    }

    result.newLevel = pokemon.level;

    return result;
  }

  /**
   * Add EVs (Effort Values) to a Pokemon
   * EVs are gained from defeating Pokemon in battle
   * @param {Object} pokemon - Pokemon to add EVs to
   * @param {Object} evGains - Object with EV gains { hp: 0, attack: 3, defense: 0, ... }
   */
  static addEVs(pokemon, evGains) {
    // EV caps per stat: 252 (Gen 3+) or 256 (Gen 1-2 practical max)
    // Total EV cap: 510 (Gen 3+)
    if (!pokemon.evs) {
      pokemon.evs = { hp: 0, attack: 0, defense: 0, spatk: 0, spdef: 0, speed: 0 };
    }

    const maxPerStat = 252;
    const maxTotal = 510;

    let totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);

    for (const stat in evGains) {
      if (evGains[stat] > 0) {
        const canAdd = Math.min(
          evGains[stat],
          maxPerStat - pokemon.evs[stat],
          maxTotal - totalEVs
        );

        pokemon.evs[stat] = (pokemon.evs[stat] || 0) + canAdd;
        totalEVs += canAdd;
      }
    }

    // Recalculate stats after EV changes
    pokemon.stats = StatSystem.calculateAllStats(pokemon);
  }

  /**
   * Heal a Pokemon to full HP
   * @param {Object} pokemon - Pokemon to heal
   */
  static healPokemon(pokemon) {
    if (pokemon.stats && pokemon.stats.hp) {
      pokemon.currentHP = pokemon.stats.hp;
    }
  }

  /**
   * Get EV gains from defeating a specific Pokemon
   * EVs vary by Pokemon species
   * @param {string} species - Defeated Pokemon species
   * @returns {Object} EV gains
   */
  static getEVGains(species) {
    // Common EV yields for Pokemon in this game
    const evYields = {
      // Starters
      'chikorita': { spatk: 1 },
      'bayleef': { spatk: 1 },
      'meganium': { spatk: 2 },
      'cyndaquil': { attack: 1 },
      'quilava': { attack: 1 },
      'typhlosion': { attack: 2 },
      'totodile': { attack: 1 },
      'croconaw': { attack: 1 },
      'feraligatr': { attack: 2 },

      // Early routes
      'pidgeey': { speed: 1 },
      'pidgeot': { speed: 2 },
      'rattata': { speed: 1 },
      'raticate': { speed: 2 },
      'sentret': { defense: 1 },
      'furret': { defense: 2 },
      'hoothoot': { hp: 1 },
      'noctowl': { hp: 2 },
      'spinarak': { attack: 1 },
      'girafarig': { spatk: 2 },
      'ledyba': { defense: 1 },
      'ledian': { defense: 1 },
      'dunsparce': { hp: 1 }
    };

    return evYields[species?.toLowerCase()] || { hp: 1 };
  }

  /**
   * Get detailed level up information for display
   * @param {Object} pokemon - Pokemon object
   * @returns {Object} Level up display information
   */
  static getLevelUpInfo(pokemon) {
    return {
      level: pokemon.level,
      currentExp: pokemon.currentExperience,
      expThisLevel: pokemon.experienceThisLevel,
      expNextLevel: pokemon.experienceNextLevel,
      expToNextLevel: pokemon.experienceToNextLevel,
      expPercent: ExperienceSystem.getExperiencePercentage(pokemon),
      stats: pokemon.stats,
      currentHP: pokemon.currentHP,
      maxHP: pokemon.stats?.hp || 0
    };
  }

  /**
   * Format level up message for display
   * @param {Object} pokemon - Pokemon that leveled up
   * @param {Object} levelUpResult - Result from gainExperience
   * @returns {string} Formatted level up message
   */
  static formatLevelUpMessage(pokemon, levelUpResult) {
    if (!levelUpResult.leveledUp) {
      return `${pokemon.name} gained ${levelUpResult.experienceGained} EXP!`;
    }

    let message = `${pokemon.name} leveled up to Lv. ${levelUpResult.newLevel}!`;

    if (levelUpResult.statIncreases && levelUpResult.statIncreases.length > 0) {
      const lastIncrease = levelUpResult.statIncreases[levelUpResult.statIncreases.length - 1];
      message += '\n\n';

      // Show stat changes
      if (lastIncrease.hp > 0) message += `HP +${lastIncrease.hp} `;
      if (lastIncrease.attack > 0) message += `ATK +${lastIncrease.attack} `;
      if (lastIncrease.defense > 0) message += `DEF +${lastIncrease.defense} `;
      if (lastIncrease.spatk > 0) message += `SPA +${lastIncrease.spatk} `;
      if (lastIncrease.spdef > 0) message += `SPD +${lastIncrease.spdef} `;
      if (lastIncrease.speed > 0) message += `SPE +${lastIncrease.speed}`;
    }

    return message;
  }
}
