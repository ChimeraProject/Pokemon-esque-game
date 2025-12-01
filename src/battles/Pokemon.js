/**
 * Pokemon - Data structure for Pokemon with stats, moves, and abilities
 * Inspired by HeartGold's stat system with balancing from OpenEnroth and Pixel Dungeon
 */

// Type effectiveness chart (multipliers)
export const TYPE_CHART = {
    normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
    fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
    poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
    dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

// Nature stat modifiers (+10% / -10%)
export const NATURES = {
    hardy:   { plus: null, minus: null },
    lonely:  { plus: 'attack', minus: 'defense' },
    brave:   { plus: 'attack', minus: 'speed' },
    adamant: { plus: 'attack', minus: 'spAttack' },
    naughty: { plus: 'attack', minus: 'spDefense' },
    bold:    { plus: 'defense', minus: 'attack' },
    docile:  { plus: null, minus: null },
    relaxed: { plus: 'defense', minus: 'speed' },
    impish:  { plus: 'defense', minus: 'spAttack' },
    lax:     { plus: 'defense', minus: 'spDefense' },
    timid:   { plus: 'speed', minus: 'attack' },
    hasty:   { plus: 'speed', minus: 'defense' },
    serious: { plus: null, minus: null },
    jolly:   { plus: 'speed', minus: 'spAttack' },
    naive:   { plus: 'speed', minus: 'spDefense' },
    modest:  { plus: 'spAttack', minus: 'attack' },
    mild:    { plus: 'spAttack', minus: 'defense' },
    quiet:   { plus: 'spAttack', minus: 'speed' },
    bashful: { plus: null, minus: null },
    rash:    { plus: 'spAttack', minus: 'spDefense' },
    calm:    { plus: 'spDefense', minus: 'attack' },
    gentle:  { plus: 'spDefense', minus: 'defense' },
    sassy:   { plus: 'spDefense', minus: 'speed' },
    careful: { plus: 'spDefense', minus: 'spAttack' },
    quirky:  { plus: null, minus: null }
};

// Status conditions
export const STATUS = {
    NONE: 'none',
    BURN: 'burn',
    FREEZE: 'freeze',
    PARALYSIS: 'paralysis',
    POISON: 'poison',
    BADLY_POISONED: 'badly_poisoned',
    SLEEP: 'sleep'
};

/**
 * Pokemon class - Represents a single Pokemon instance
 */
export class Pokemon {
    /**
     * Create a Pokemon
     * @param {Object} species - Species data (base stats, types, etc.)
     * @param {number} level - Pokemon level (1-100)
     * @param {Object} options - Additional options (IVs, EVs, nature, moves)
     */
    constructor(species, level, options = {}) {
        this.species = species;
        this.nickname = options.nickname || species.name;
        this.level = Math.max(1, Math.min(100, level));
        
        // Individual Values (0-31)
        this.ivs = options.ivs || this.generateIVs();
        
        // Effort Values (0-252 each, max 510 total)
        this.evs = options.evs || {
            hp: 0, attack: 0, defense: 0,
            spAttack: 0, spDefense: 0, speed: 0
        };
        
        // Nature
        this.nature = options.nature || this.randomNature();
        
        // Calculate stats
        this.stats = this.calculateStats();
        
        // Current HP
        this.currentHp = options.currentHp !== undefined ? options.currentHp : this.stats.hp;
        
        // Status condition
        this.status = options.status || STATUS.NONE;
        this.statusTurns = 0;
        
        // Moves (up to 4)
        this.moves = options.moves || [];
        
        // Experience
        this.experience = options.experience || this.getExpForLevel(this.level);
        
        // Held item
        this.heldItem = options.heldItem || null;
        
        // Friendship (0-255)
        this.friendship = options.friendship || 70;
        
        // Original trainer ID
        this.otId = options.otId || Math.floor(Math.random() * 65536);
    }

    /**
     * Generate random IVs
     */
    generateIVs() {
        return {
            hp: Math.floor(Math.random() * 32),
            attack: Math.floor(Math.random() * 32),
            defense: Math.floor(Math.random() * 32),
            spAttack: Math.floor(Math.random() * 32),
            spDefense: Math.floor(Math.random() * 32),
            speed: Math.floor(Math.random() * 32)
        };
    }

    /**
     * Get random nature
     */
    randomNature() {
        const natureNames = Object.keys(NATURES);
        return natureNames[Math.floor(Math.random() * natureNames.length)];
    }

    /**
     * Calculate stats based on base stats, IVs, EVs, level, and nature
     */
    calculateStats() {
        const base = this.species.baseStats;
        const nature = NATURES[this.nature];
        
        const stats = {};
        
        // HP formula: ((2 * Base + IV + EV/4) * Level / 100) + Level + 10
        stats.hp = Math.floor(
            ((2 * base.hp + this.ivs.hp + Math.floor(this.evs.hp / 4)) * this.level / 100) + 
            this.level + 10
        );
        
        // Other stats: ((2 * Base + IV + EV/4) * Level / 100 + 5) * Nature
        const otherStats = ['attack', 'defense', 'spAttack', 'spDefense', 'speed'];
        
        for (const stat of otherStats) {
            let value = Math.floor(
                ((2 * base[stat] + this.ivs[stat] + Math.floor(this.evs[stat] / 4)) * this.level / 100) + 5
            );
            
            // Apply nature modifier
            if (nature.plus === stat) {
                value = Math.floor(value * 1.1);
            } else if (nature.minus === stat) {
                value = Math.floor(value * 0.9);
            }
            
            stats[stat] = value;
        }
        
        return stats;
    }

    /**
     * Get experience required for a level (medium-fast growth rate)
     * @param {number} level 
     * @returns {number}
     */
    getExpForLevel(level) {
        // Medium-fast: n^3
        return Math.pow(level, 3);
    }

    /**
     * Get experience needed for next level
     * @returns {number}
     */
    getExpToNextLevel() {
        if (this.level >= 100) return 0;
        return this.getExpForLevel(this.level + 1) - this.experience;
    }

    /**
     * Add experience and handle level ups
     * @param {number} exp - Experience to add
     * @returns {Object} - Level up info
     */
    addExperience(exp) {
        const startLevel = this.level;
        this.experience += exp;
        
        const levelUps = [];
        
        while (this.level < 100 && this.experience >= this.getExpForLevel(this.level + 1)) {
            this.level++;
            const oldStats = { ...this.stats };
            this.stats = this.calculateStats();
            
            // Heal proportionally on level up
            const hpRatio = this.currentHp / oldStats.hp;
            this.currentHp = Math.ceil(this.stats.hp * hpRatio);
            
            levelUps.push({
                newLevel: this.level,
                statChanges: {
                    hp: this.stats.hp - oldStats.hp,
                    attack: this.stats.attack - oldStats.attack,
                    defense: this.stats.defense - oldStats.defense,
                    spAttack: this.stats.spAttack - oldStats.spAttack,
                    spDefense: this.stats.spDefense - oldStats.spDefense,
                    speed: this.stats.speed - oldStats.speed
                }
            });
        }
        
        return {
            expGained: exp,
            levelsGained: this.level - startLevel,
            levelUps
        };
    }

    /**
     * Check if Pokemon has fainted
     * @returns {boolean}
     */
    isFainted() {
        return this.currentHp <= 0;
    }

    /**
     * Deal damage to this Pokemon
     * @param {number} damage 
     * @returns {number} - Actual damage dealt
     */
    takeDamage(damage) {
        const actualDamage = Math.min(this.currentHp, Math.max(1, Math.floor(damage)));
        this.currentHp -= actualDamage;
        this.currentHp = Math.max(0, this.currentHp);
        return actualDamage;
    }

    /**
     * Heal this Pokemon
     * @param {number} amount 
     * @returns {number} - Actual HP restored
     */
    heal(amount) {
        const before = this.currentHp;
        this.currentHp = Math.min(this.stats.hp, this.currentHp + amount);
        return this.currentHp - before;
    }

    /**
     * Fully restore HP and clear status
     */
    fullRestore() {
        this.currentHp = this.stats.hp;
        this.status = STATUS.NONE;
        this.statusTurns = 0;
    }

    /**
     * Apply a status condition
     * @param {string} status 
     * @returns {boolean} - Whether status was applied
     */
    applyStatus(status) {
        if (this.status !== STATUS.NONE) return false;
        
        // Type immunities
        if (status === STATUS.BURN && this.species.types.includes('fire')) return false;
        if (status === STATUS.FREEZE && this.species.types.includes('ice')) return false;
        if ((status === STATUS.POISON || status === STATUS.BADLY_POISONED) && 
            (this.species.types.includes('poison') || this.species.types.includes('steel'))) return false;
        if (status === STATUS.PARALYSIS && this.species.types.includes('electric')) return false;
        
        this.status = status;
        this.statusTurns = 0;
        return true;
    }

    /**
     * Process status at end of turn
     * @returns {Object} - Status effect result
     */
    processStatus() {
        this.statusTurns++;
        
        switch (this.status) {
            case STATUS.BURN:
                const burnDamage = Math.floor(this.stats.hp / 16);
                this.takeDamage(burnDamage);
                return { type: 'damage', amount: burnDamage, message: `${this.nickname} is hurt by its burn!` };
                
            case STATUS.POISON:
                const poisonDamage = Math.floor(this.stats.hp / 8);
                this.takeDamage(poisonDamage);
                return { type: 'damage', amount: poisonDamage, message: `${this.nickname} is hurt by poison!` };
                
            case STATUS.BADLY_POISONED:
                const toxicDamage = Math.floor(this.stats.hp * this.statusTurns / 16);
                this.takeDamage(toxicDamage);
                return { type: 'damage', amount: toxicDamage, message: `${this.nickname} is badly hurt by poison!` };
                
            case STATUS.SLEEP:
                if (this.statusTurns >= 3 && Math.random() < 0.5) {
                    this.status = STATUS.NONE;
                    this.statusTurns = 0;
                    return { type: 'cure', message: `${this.nickname} woke up!` };
                }
                return { type: 'prevent', message: `${this.nickname} is fast asleep.` };
                
            case STATUS.FREEZE:
                if (Math.random() < 0.2) {
                    this.status = STATUS.NONE;
                    this.statusTurns = 0;
                    return { type: 'cure', message: `${this.nickname} thawed out!` };
                }
                return { type: 'prevent', message: `${this.nickname} is frozen solid!` };
                
            case STATUS.PARALYSIS:
                if (Math.random() < 0.25) {
                    return { type: 'prevent', message: `${this.nickname} is paralyzed! It can't move!` };
                }
                return { type: 'none' };
                
            default:
                return { type: 'none' };
        }
    }

    /**
     * Get type effectiveness multiplier
     * @param {string} attackType 
     * @returns {number}
     */
    getTypeEffectiveness(attackType) {
        let multiplier = 1;
        
        for (const defType of this.species.types) {
            const chart = TYPE_CHART[attackType];
            if (chart && chart[defType] !== undefined) {
                multiplier *= chart[defType];
            }
        }
        
        return multiplier;
    }

    /**
     * Serialize Pokemon to JSON
     */
    toJSON() {
        return {
            species: this.species,
            nickname: this.nickname,
            level: this.level,
            ivs: this.ivs,
            evs: this.evs,
            nature: this.nature,
            currentHp: this.currentHp,
            status: this.status,
            moves: this.moves,
            experience: this.experience,
            heldItem: this.heldItem,
            friendship: this.friendship,
            otId: this.otId
        };
    }

    /**
     * Create Pokemon from JSON
     * @param {Object} data 
     * @returns {Pokemon}
     */
    static fromJSON(data) {
        return new Pokemon(data.species, data.level, {
            nickname: data.nickname,
            ivs: data.ivs,
            evs: data.evs,
            nature: data.nature,
            currentHp: data.currentHp,
            status: data.status,
            moves: data.moves,
            experience: data.experience,
            heldItem: data.heldItem,
            friendship: data.friendship,
            otId: data.otId
        });
    }
}
