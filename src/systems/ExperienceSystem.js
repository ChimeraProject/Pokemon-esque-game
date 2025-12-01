/**
 * Experience System - Gen 1-3 Pokemon Experience and Leveling
 * 
 * Experience growth groups from Gen 1-3:
 * - Slow (e.g. Starters): Y = (5 * X^3) / 4
 * - Medium-Slow (e.g. Legends): Y = (6 * X^3 / 5) - (15 * X^2) + (100 * X) - 140
 * - Medium-Fast (most common): Y = X^3
 * - Fast (e.g. Ledyba): Y = (4 * X^3) / 5
 * - Very Fast (e.g. Nidoran): Y = (4 * X^3) / 5 (but different base)
 */

export class ExperienceSystem {
  /**
   * Growth rate constants for Gen 1-3
   */
  static GROWTH_RATES = {
    slow: 'slow',           // 5 * X^3 / 4
    mediumSlow: 'mediumSlow', // (6X^3/5) - (15X^2) + (100X) - 140
    mediumFast: 'mediumFast', // X^3
    fast: 'fast',           // (4X^3)/5
    veryFast: 'veryFast'    // (4X^3)/5 + something
  };

  /**
   * Calculate experience required for a given level
   * @param {number} level - Target level (1-100)
   * @param {string} growthRate - Growth rate type (mediumFast, slow, etc)
   * @returns {number} Total experience needed to reach level
   */
  static getExperienceForLevel(level, growthRate = 'mediumFast') {
    if (level <= 1) return 0;
    if (level > 100) level = 100;

    const x = level;

    switch (growthRate) {
      case 'slow':
        return Math.floor((5 * Math.pow(x, 3)) / 4);

      case 'mediumSlow':
        return Math.floor((6 * Math.pow(x, 3) / 5) - (15 * Math.pow(x, 2)) + (100 * x) - 140);

      case 'mediumFast':
        return Math.floor(Math.pow(x, 3));

      case 'fast':
        return Math.floor((4 * Math.pow(x, 3)) / 5);

      case 'veryFast':
        return Math.floor((4 * Math.pow(x, 3)) / 5);

      default:
        return Math.floor(Math.pow(x, 3)); // Default to mediumFast
    }
  }

  /**
   * Calculate experience gained from defeating a wild Pokemon
   * Gen 1-3 formula: (BaseExp * OpponentLevel) / 7
   * @param {number} baseExp - Base experience of defeated Pokemon
   * @param {number} opponentLevel - Level of defeated Pokemon
   * @param {number} playerLevel - Level of player's Pokemon (for scaling)
   * @param {number} participantCount - Number of Pokemon that participated (for Gen 3)
   * @returns {number} Experience gained
   */
  static getExperienceReward(baseExp, opponentLevel, playerLevel, participantCount = 1) {
    // Base formula from Gen 1-2
    let exp = Math.floor((baseExp * opponentLevel) / 7);

    // Add level scaling bonus (higher level trainers give less relative exp)
    if (playerLevel > opponentLevel) {
      // Reduce exp if player is higher level
      exp = Math.floor(exp * 0.5);
    } else if (playerLevel < opponentLevel) {
      // Bonus exp if player is lower level
      exp = Math.floor(exp * 1.5);
    }

    // Gen 3 includes participation bonus reduction
    if (participantCount > 1) {
      exp = Math.floor(exp / participantCount);
    }

    return Math.max(1, exp); // Minimum 1 exp
  }

  /**
   * Check if Pokemon can level up with current experience
   * @param {Object} pokemon - Pokemon object with experience and experienceToNextLevel
   * @returns {boolean} True if Pokemon should level up
   */
  static canLevelUp(pokemon) {
    return (pokemon.currentExperience || 0) >= (pokemon.experienceToNextLevel || 1000);
  }

  /**
   * Get base experience values for Pokemon (Gen 1-3 values)
   * Returns common Pokemon used in this game
   * @param {string} species - Pokemon species name
   * @returns {number} Base exp value
   */
  static getBaseExperience(species) {
    const baseExpValues = {
      // Starter Pokemon
      'chikorita': 64,
      'bayleef': 142,
      'meganium': 236,
      'cyndaquil': 62,
      'quilava': 142,
      'typhlosion': 240,
      'totodile': 63,
      'croconaw': 141,
      'feraligatr': 239,

      // Early route Pokemon
      'pidgeey': 58,
      'pidgeot': 172,
      'rattata': 51,
      'raticate': 145,
      'sentret': 66,
      'furret': 170,
      'hoothoot': 52,
      'noctowl': 155,
      'spinarak': 48,
      'girafarig': 159,
      'ledyba': 53,
      'ledian': 151,
      'dunsparce': 145,

      // Default fallback
      'default': 100
    };

    return baseExpValues[species?.toLowerCase()] || baseExpValues['default'];
  }

  /**
   * Get growth rate for a Pokemon species
   * @param {string} species - Pokemon species name
   * @returns {string} Growth rate type
   */
  static getGrowthRate(species) {
    const growthRates = {
      // Slow growers (Starters)
      'chikorita': 'mediumSlow',
      'cyndaquil': 'mediumSlow',
      'totodile': 'mediumSlow',
      'meganium': 'mediumSlow',
      'typhlosion': 'mediumSlow',
      'feraligatr': 'mediumSlow',

      // Medium-Fast (most Pokemon)
      'pidgeey': 'mediumFast',
      'pidgeot': 'mediumFast',
      'rattata': 'fast',
      'raticate': 'fast',
      'sentret': 'mediumFast',
      'furret': 'mediumFast',
      'hoothoot': 'mediumFast',
      'noctowl': 'mediumFast',
      'spinarak': 'mediumFast',
      'girafarig': 'mediumFast',
      'ledyba': 'fast',
      'ledian': 'fast',
      'dunsparce': 'mediumFast',

      // Default
      'default': 'mediumFast'
    };

    return growthRates[species?.toLowerCase()] || growthRates['default'];
  }

  /**
   * Calculate percentage to next level
   * @param {Object} pokemon - Pokemon with currentExperience and experienceToNextLevel
   * @returns {number} Percentage (0-100)
   */
  static getExperiencePercentage(pokemon) {
    if (!pokemon.experienceToNextLevel || pokemon.experienceToNextLevel === 0) return 0;

    const expThisLevel = (pokemon.experienceThisLevel || 0);
    const expCurrent = (pokemon.currentExperience || 0) - expThisLevel;
    const expNeeded = pokemon.experienceToNextLevel - expThisLevel;

    if (expNeeded <= 0) return 0;
    return Math.floor((expCurrent / expNeeded) * 100);
  }

  /**
   * Add experience to a Pokemon
   * @param {Object} pokemon - Pokemon object
   * @param {number} expAmount - Experience to add
   * @returns {Object} Result with leveledUp flag and new level if applicable
   */
  static addExperience(pokemon, expAmount) {
    const result = {
      leveledUp: false,
      newLevel: pokemon.level || 5,
      statIncreases: null
    };

    pokemon.currentExperience = (pokemon.currentExperience || 0) + expAmount;

    // Check for level up
    const nextLevelExp = ExperienceSystem.getExperienceForLevel(
      (pokemon.level || 5) + 1,
      pokemon.growthRate || 'mediumFast'
    );

    if (pokemon.currentExperience >= nextLevelExp && (pokemon.level || 5) < 100) {
      result.leveledUp = true;
      result.newLevel = (pokemon.level || 5) + 1;
    }

    return result;
  }
}
