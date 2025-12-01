/**
 * DamageCalculator - Handles Pokemon damage calculations
 * Implements the standard Pokemon damage formula with stat-based modifiers
 * Inspired by OpenEnroth's balanced combat system
 */

import { TYPE_CHART, STATUS } from './Pokemon.js';

/**
 * Move categories
 */
export const MOVE_CATEGORY = {
    PHYSICAL: 'physical',
    SPECIAL: 'special',
    STATUS: 'status'
};

/**
 * DamageCalculator class - Calculates battle damage
 */
export class DamageCalculator {
    /**
     * Calculate damage for an attack
     * @param {Object} attacker - Attacking Pokemon
     * @param {Object} defender - Defending Pokemon
     * @param {Object} move - Move being used
     * @param {Object} options - Additional modifiers
     * @returns {Object} - Damage result
     */
    static calculateDamage(attacker, defender, move, options = {}) {
        const {
            weather = 'clear',
            criticalHit = null, // null = random, true/false = forced
            isCrit = criticalHit !== null ? criticalHit : this.checkCritical(move),
        } = options;

        // Status moves don't deal damage
        if (move.category === MOVE_CATEGORY.STATUS) {
            return {
                damage: 0,
                effectiveness: 1,
                critical: false,
                message: null
            };
        }

        // Base damage calculation
        const level = attacker.level;
        const power = move.power || 0;
        
        if (power === 0) {
            return { damage: 0, effectiveness: 1, critical: false, message: null };
        }

        // Get attack and defense stats based on move category
        let attack, defense;
        if (move.category === MOVE_CATEGORY.PHYSICAL) {
            attack = attacker.stats.attack;
            defense = defender.stats.defense;
            
            // Burn reduces physical attack
            if (attacker.status === STATUS.BURN) {
                attack = Math.floor(attack * 0.5);
            }
        } else {
            attack = attacker.stats.spAttack;
            defense = defender.stats.spDefense;
        }

        // Critical hits ignore stat drops (simplified - just boost damage)
        const critMultiplier = isCrit ? 1.5 : 1;

        // STAB (Same Type Attack Bonus)
        const stab = attacker.species.types.includes(move.type) ? 1.5 : 1;

        // Type effectiveness
        const effectiveness = defender.getTypeEffectiveness(move.type);

        // Weather modifiers
        let weatherMod = 1;
        if (weather === 'sun') {
            if (move.type === 'fire') weatherMod = 1.5;
            if (move.type === 'water') weatherMod = 0.5;
        } else if (weather === 'rain') {
            if (move.type === 'water') weatherMod = 1.5;
            if (move.type === 'fire') weatherMod = 0.5;
        }

        // Random factor (85-100%)
        const random = 0.85 + Math.random() * 0.15;

        // Main damage formula
        const baseDamage = Math.floor(
            ((2 * level / 5 + 2) * power * attack / defense) / 50 + 2
        );

        // Apply modifiers
        const finalDamage = Math.max(1, Math.floor(
            baseDamage * critMultiplier * stab * effectiveness * weatherMod * random
        ));

        // Generate message
        let message = null;
        if (effectiveness > 1) {
            message = "It's super effective!";
        } else if (effectiveness > 0 && effectiveness < 1) {
            message = "It's not very effective...";
        } else if (effectiveness === 0) {
            message = `It doesn't affect ${defender.nickname}...`;
        }

        if (isCrit && effectiveness > 0) {
            message = (message ? message + ' ' : '') + 'A critical hit!';
        }

        return {
            damage: finalDamage,
            effectiveness,
            critical: isCrit,
            message
        };
    }

    /**
     * Check if attack is a critical hit
     * Base crit rate is 1/24 (~4.17%) for normal moves
     * High crit moves have 1/8 (12.5%) rate
     * @param {Object} move 
     * @returns {boolean}
     */
    static checkCritical(move) {
        const CRIT_RATE_NORMAL = 1 / 24;  // ~4.17%
        const CRIT_RATE_HIGH = 1 / 8;      // 12.5%
        
        const critRate = move.highCrit ? CRIT_RATE_HIGH : CRIT_RATE_NORMAL;
        return Math.random() < critRate;
    }

    /**
     * Calculate accuracy check
     * @param {Object} attacker 
     * @param {Object} defender 
     * @param {Object} move 
     * @returns {boolean} - Whether the move hits
     */
    static checkAccuracy(attacker, defender, move) {
        // Always hit moves
        if (move.accuracy === true || move.accuracy === null) {
            return true;
        }

        const accuracy = move.accuracy || 100;
        
        // TODO: Add accuracy/evasion stat stages when implemented
        const hitChance = accuracy / 100;
        
        return Math.random() < hitChance;
    }

    /**
     * Calculate experience yield when defeating a Pokemon
     * @param {Object} defeated - Defeated Pokemon
     * @param {number} participantCount - Number of Pokemon that participated
     * @param {boolean} isTrainerBattle 
     * @returns {number}
     */
    static calculateExpYield(defeated, participantCount, isTrainerBattle = false) {
        const baseExp = defeated.species.baseExp || 50;
        const level = defeated.level;
        const trainerMod = isTrainerBattle ? 1.5 : 1;
        
        // Simplified exp formula
        return Math.floor((baseExp * level * trainerMod) / (7 * participantCount));
    }

    /**
     * Calculate catch rate
     * @param {Object} pokemon - Wild Pokemon to catch
     * @param {Object} ball - Pokeball being used
     * @returns {Object} - Catch result
     */
    static calculateCatchRate(pokemon, ball) {
        const maxHp = pokemon.stats.hp;
        const currentHp = pokemon.currentHp;
        const catchRate = pokemon.species.catchRate || 45;
        const ballMod = ball.catchMod || 1;
        
        // Status modifiers
        let statusMod = 1;
        switch (pokemon.status) {
            case STATUS.SLEEP:
            case STATUS.FREEZE:
                statusMod = 2.5;
                break;
            case STATUS.PARALYSIS:
            case STATUS.BURN:
            case STATUS.POISON:
            case STATUS.BADLY_POISONED:
                statusMod = 1.5;
                break;
        }

        // Catch rate formula (simplified from Gen V+)
        const a = ((3 * maxHp - 2 * currentHp) * catchRate * ballMod * statusMod) / (3 * maxHp);
        
        // Four shake checks
        const b = 65536 / Math.pow(255 / a, 0.1875);
        const shakes = [0, 0, 0, 0].map(() => Math.random() * 65536 < b ? 1 : 0);
        const shakeCount = shakes.reduce((a, b) => a + b, 0);
        
        return {
            caught: shakeCount === 4,
            shakes: shakeCount,
            catchRate: Math.min(100, (a / 255) * 100).toFixed(1)
        };
    }

    /**
     * Calculate stat stage multiplier
     * @param {number} stage - Stage value (-6 to +6)
     * @returns {number}
     */
    static getStatMultiplier(stage) {
        if (stage >= 0) {
            return (2 + stage) / 2;
        } else {
            return 2 / (2 - stage);
        }
    }

    /**
     * Calculate priority bracket for a move
     * @param {Object} move 
     * @param {Object} pokemon 
     * @returns {number}
     */
    static getMovePriority(move, pokemon) {
        return move.priority || 0;
    }

    /**
     * Determine turn order for two Pokemon
     * @param {Object} pokemon1 
     * @param {Object} move1 
     * @param {Object} pokemon2 
     * @param {Object} move2 
     * @returns {number} - 1 if pokemon1 goes first, 2 if pokemon2, 0 for speed tie
     */
    static determineTurnOrder(pokemon1, move1, pokemon2, move2) {
        const priority1 = this.getMovePriority(move1, pokemon1);
        const priority2 = this.getMovePriority(move2, pokemon2);

        // Priority determines order first
        if (priority1 > priority2) return 1;
        if (priority2 > priority1) return 2;

        // Then speed
        let speed1 = pokemon1.stats.speed;
        let speed2 = pokemon2.stats.speed;

        // Paralysis halves speed
        if (pokemon1.status === STATUS.PARALYSIS) speed1 = Math.floor(speed1 * 0.5);
        if (pokemon2.status === STATUS.PARALYSIS) speed2 = Math.floor(speed2 * 0.5);

        if (speed1 > speed2) return 1;
        if (speed2 > speed1) return 2;

        // Speed tie - random
        return Math.random() < 0.5 ? 1 : 2;
    }
}
