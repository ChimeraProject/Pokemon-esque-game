/**
 * DifficultyManager - Manages game difficulty scaling
 * Inspired by Pixel Dungeon's adaptive difficulty and OpenEnroth's balanced progression
 */

/**
 * Difficulty presets
 */
export const DIFFICULTY = {
    EASY: 'easy',
    NORMAL: 'normal',
    HARD: 'hard',
    CHALLENGE: 'challenge'
};

/**
 * Difficulty modifiers for each preset
 */
export const DIFFICULTY_MODIFIERS = {
    [DIFFICULTY.EASY]: {
        name: 'Easy',
        description: 'Reduced enemy levels and higher catch rates',
        enemyLevelMod: 0.8,
        enemyStatMod: 0.9,
        expMod: 1.5,
        moneyMod: 1.5,
        catchRateMod: 1.3,
        aiAggression: 0.3,
        itemDropMod: 1.3
    },
    [DIFFICULTY.NORMAL]: {
        name: 'Normal',
        description: 'Standard HeartGold experience',
        enemyLevelMod: 1.0,
        enemyStatMod: 1.0,
        expMod: 1.0,
        moneyMod: 1.0,
        catchRateMod: 1.0,
        aiAggression: 0.5,
        itemDropMod: 1.0
    },
    [DIFFICULTY.HARD]: {
        name: 'Hard',
        description: 'Stronger enemies and smarter AI',
        enemyLevelMod: 1.2,
        enemyStatMod: 1.1,
        expMod: 0.8,
        moneyMod: 0.8,
        catchRateMod: 0.8,
        aiAggression: 0.7,
        itemDropMod: 0.8
    },
    [DIFFICULTY.CHALLENGE]: {
        name: 'Challenge',
        description: 'For experienced players - Nuzlocke-inspired',
        enemyLevelMod: 1.3,
        enemyStatMod: 1.2,
        expMod: 0.6,
        moneyMod: 0.6,
        catchRateMod: 0.6,
        aiAggression: 0.9,
        itemDropMod: 0.5
    }
};

/**
 * DifficultyManager class - Manages difficulty scaling
 */
export class DifficultyManager {
    /**
     * Create a difficulty manager
     * @param {string} difficulty - Initial difficulty preset
     */
    constructor(difficulty = DIFFICULTY.NORMAL) {
        this.setDifficulty(difficulty);
        
        // Dynamic scaling state
        this.playerDeaths = 0;
        this.consecutiveWins = 0;
        this.consecutiveLosses = 0;
        this.adaptiveEnabled = false;
    }

    /**
     * Set the difficulty level
     * @param {string} difficulty 
     */
    setDifficulty(difficulty) {
        if (!DIFFICULTY_MODIFIERS[difficulty]) {
            difficulty = DIFFICULTY.NORMAL;
        }
        this.difficulty = difficulty;
        this.modifiers = { ...DIFFICULTY_MODIFIERS[difficulty] };
    }

    /**
     * Enable adaptive difficulty that adjusts based on performance
     * @param {boolean} enabled 
     */
    setAdaptiveDifficulty(enabled) {
        this.adaptiveEnabled = enabled;
    }

    /**
     * Record a battle result for adaptive difficulty
     * @param {boolean} won 
     */
    recordBattleResult(won) {
        if (won) {
            this.consecutiveWins++;
            this.consecutiveLosses = 0;
        } else {
            this.consecutiveLosses++;
            this.consecutiveWins = 0;
            this.playerDeaths++;
        }

        if (this.adaptiveEnabled) {
            this.adjustDifficulty();
        }
    }

    /**
     * Adjust difficulty based on performance
     */
    adjustDifficulty() {
        // If struggling (3+ consecutive losses), ease up
        if (this.consecutiveLosses >= 3) {
            this.modifiers.enemyLevelMod *= 0.95;
            this.modifiers.enemyStatMod *= 0.95;
            this.modifiers.catchRateMod *= 1.1;
        }
        
        // If dominating (5+ consecutive wins), ramp up slightly
        if (this.consecutiveWins >= 5) {
            this.modifiers.enemyLevelMod *= 1.02;
            this.modifiers.enemyStatMod *= 1.02;
        }

        // Clamp modifiers to reasonable ranges
        this.modifiers.enemyLevelMod = Math.max(0.5, Math.min(2.0, this.modifiers.enemyLevelMod));
        this.modifiers.enemyStatMod = Math.max(0.5, Math.min(2.0, this.modifiers.enemyStatMod));
        this.modifiers.catchRateMod = Math.max(0.3, Math.min(2.0, this.modifiers.catchRateMod));
    }

    /**
     * Get scaled enemy level based on area level and player level
     * @param {number} areaLevel - Base level for the area
     * @param {number} playerLevel - Player's average party level
     * @returns {number}
     */
    getEnemyLevel(areaLevel, playerLevel) {
        // Level scales with area and slightly with player
        const baseLevel = areaLevel + Math.floor((playerLevel - areaLevel) * 0.2);
        const scaledLevel = Math.floor(baseLevel * this.modifiers.enemyLevelMod);
        
        // Add some variance (-1 to +2)
        const variance = Math.floor(Math.random() * 4) - 1;
        
        return Math.max(1, Math.min(100, scaledLevel + variance));
    }

    /**
     * Get stat modifier for enemy Pokemon
     * @returns {number}
     */
    getEnemyStatMod() {
        return this.modifiers.enemyStatMod;
    }

    /**
     * Get experience modifier
     * @param {number} baseExp 
     * @returns {number}
     */
    getExpReward(baseExp) {
        return Math.floor(baseExp * this.modifiers.expMod);
    }

    /**
     * Get money reward modifier
     * @param {number} baseMoney 
     * @returns {number}
     */
    getMoneyReward(baseMoney) {
        return Math.floor(baseMoney * this.modifiers.moneyMod);
    }

    /**
     * Get catch rate modifier
     * @param {number} baseCatchRate 
     * @returns {number}
     */
    getCatchRate(baseCatchRate) {
        return Math.min(255, Math.floor(baseCatchRate * this.modifiers.catchRateMod));
    }

    /**
     * Get AI aggression level (0-1)
     * Higher = more likely to use optimal moves
     * @returns {number}
     */
    getAIAggression() {
        return this.modifiers.aiAggression;
    }

    /**
     * Get item drop rate modifier
     * @param {number} baseRate 
     * @returns {number}
     */
    getItemDropRate(baseRate) {
        return baseRate * this.modifiers.itemDropMod;
    }

    /**
     * Check if Nuzlocke rules should apply (Challenge mode)
     * @returns {boolean}
     */
    isNuzlockeMode() {
        return this.difficulty === DIFFICULTY.CHALLENGE;
    }

    /**
     * Get a descriptive difficulty summary
     * @returns {Object}
     */
    getSummary() {
        return {
            difficulty: this.difficulty,
            ...this.modifiers,
            adaptiveEnabled: this.adaptiveEnabled,
            playerDeaths: this.playerDeaths,
            consecutiveWins: this.consecutiveWins,
            consecutiveLosses: this.consecutiveLosses
        };
    }

    /**
     * Reset adaptive difficulty tracking
     */
    resetTracking() {
        this.consecutiveWins = 0;
        this.consecutiveLosses = 0;
    }

    /**
     * Serialize to JSON
     */
    toJSON() {
        return {
            difficulty: this.difficulty,
            modifiers: this.modifiers,
            adaptiveEnabled: this.adaptiveEnabled,
            playerDeaths: this.playerDeaths,
            consecutiveWins: this.consecutiveWins,
            consecutiveLosses: this.consecutiveLosses
        };
    }

    /**
     * Create from JSON
     * @param {Object} data 
     * @returns {DifficultyManager}
     */
    static fromJSON(data) {
        const manager = new DifficultyManager(data.difficulty);
        manager.modifiers = { ...data.modifiers };
        manager.adaptiveEnabled = data.adaptiveEnabled;
        manager.playerDeaths = data.playerDeaths;
        manager.consecutiveWins = data.consecutiveWins;
        manager.consecutiveLosses = data.consecutiveLosses;
        return manager;
    }
}
