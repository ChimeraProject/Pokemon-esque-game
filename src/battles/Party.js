/**
 * Party - Manages a collection of Pokemon (party of up to 6)
 * Inspired by HeartGold's party system with enhancements from Pixel Dungeon
 */

import { Pokemon } from './Pokemon.js';

/**
 * Party class - Manages player's Pokemon team
 */
export class Party {
    /**
     * Create a new party
     * @param {number} maxSize - Maximum party size (default 6)
     */
    constructor(maxSize = 6) {
        this.maxSize = maxSize;
        this.pokemon = [];
    }

    /**
     * Get the number of Pokemon in the party
     * @returns {number}
     */
    get size() {
        return this.pokemon.length;
    }

    /**
     * Check if party is full
     * @returns {boolean}
     */
    isFull() {
        return this.pokemon.length >= this.maxSize;
    }

    /**
     * Check if party is empty
     * @returns {boolean}
     */
    isEmpty() {
        return this.pokemon.length === 0;
    }

    /**
     * Add a Pokemon to the party
     * @param {Pokemon} pokemon 
     * @returns {boolean} - Whether the Pokemon was added
     */
    addPokemon(pokemon) {
        if (this.isFull()) {
            return false;
        }
        this.pokemon.push(pokemon);
        return true;
    }

    /**
     * Remove a Pokemon at index
     * @param {number} index 
     * @returns {Pokemon|null} - Removed Pokemon or null
     */
    removePokemon(index) {
        if (index < 0 || index >= this.pokemon.length) {
            return null;
        }
        return this.pokemon.splice(index, 1)[0];
    }

    /**
     * Get Pokemon at index
     * @param {number} index 
     * @returns {Pokemon|null}
     */
    getPokemon(index) {
        return this.pokemon[index] || null;
    }

    /**
     * Get the first non-fainted Pokemon (lead)
     * @returns {Pokemon|null}
     */
    getLeadPokemon() {
        return this.pokemon.find(p => !p.isFainted()) || null;
    }

    /**
     * Get index of lead Pokemon
     * @returns {number}
     */
    getLeadIndex() {
        return this.pokemon.findIndex(p => !p.isFainted());
    }

    /**
     * Swap positions of two Pokemon
     * @param {number} index1 
     * @param {number} index2 
     * @returns {boolean}
     */
    swapPositions(index1, index2) {
        if (index1 < 0 || index1 >= this.pokemon.length ||
            index2 < 0 || index2 >= this.pokemon.length) {
            return false;
        }
        [this.pokemon[index1], this.pokemon[index2]] = [this.pokemon[index2], this.pokemon[index1]];
        return true;
    }

    /**
     * Check if all Pokemon have fainted
     * @returns {boolean}
     */
    isWhiteout() {
        return this.pokemon.every(p => p.isFainted());
    }

    /**
     * Get count of non-fainted Pokemon
     * @returns {number}
     */
    getAbleCount() {
        return this.pokemon.filter(p => !p.isFainted()).length;
    }

    /**
     * Get all non-fainted Pokemon
     * @returns {Pokemon[]}
     */
    getAblePokemon() {
        return this.pokemon.filter(p => !p.isFainted());
    }

    /**
     * Get count of fainted Pokemon
     * @returns {number}
     */
    getFaintedCount() {
        return this.pokemon.filter(p => p.isFainted()).length;
    }

    /**
     * Heal all Pokemon fully
     */
    healAll() {
        for (const pokemon of this.pokemon) {
            pokemon.fullRestore();
        }
    }

    /**
     * Get total party level
     * @returns {number}
     */
    getTotalLevel() {
        return this.pokemon.reduce((sum, p) => sum + p.level, 0);
    }

    /**
     * Get average party level
     * @returns {number}
     */
    getAverageLevel() {
        if (this.pokemon.length === 0) return 0;
        return Math.floor(this.getTotalLevel() / this.pokemon.length);
    }

    /**
     * Get highest level in party
     * @returns {number}
     */
    getHighestLevel() {
        return Math.max(...this.pokemon.map(p => p.level), 0);
    }

    /**
     * Get lowest level in party
     * @returns {number}
     */
    getLowestLevel() {
        if (this.pokemon.length === 0) return 0;
        return Math.min(...this.pokemon.map(p => p.level));
    }

    /**
     * Sort party by various criteria
     * @param {string} criteria - 'level', 'hp', 'name', 'species'
     * @param {boolean} ascending - Sort order
     */
    sort(criteria = 'level', ascending = false) {
        const sortFns = {
            level: (a, b) => a.level - b.level,
            hp: (a, b) => a.currentHp - b.currentHp,
            name: (a, b) => a.nickname.localeCompare(b.nickname),
            species: (a, b) => a.species.name.localeCompare(b.species.name)
        };

        const sortFn = sortFns[criteria] || sortFns.level;
        this.pokemon.sort((a, b) => ascending ? sortFn(a, b) : -sortFn(a, b));
    }

    /**
     * Get party summary for display
     * @returns {Object[]}
     */
    getSummary() {
        return this.pokemon.map((p, index) => ({
            index,
            nickname: p.nickname,
            species: p.species.name,
            level: p.level,
            currentHp: p.currentHp,
            maxHp: p.stats.hp,
            hpPercent: Math.round((p.currentHp / p.stats.hp) * 100),
            status: p.status,
            isFainted: p.isFainted()
        }));
    }

    /**
     * Get experience yield when party defeats a Pokemon
     * Experience is divided among participants
     * @param {Pokemon} defeated - The defeated Pokemon
     * @param {number[]} participantIndices - Indices of Pokemon that participated
     * @param {boolean} isTrainerBattle - Whether this was a trainer battle
     * @returns {Object[]} - Experience gained per Pokemon
     */
    distributeExperience(defeated, participantIndices, isTrainerBattle = false) {
        const baseExp = defeated.species.baseExp || 50;
        const trainerBonus = isTrainerBattle ? 1.5 : 1;
        
        const results = [];
        
        for (const index of participantIndices) {
            const pokemon = this.pokemon[index];
            if (!pokemon || pokemon.isFainted()) continue;
            
            // Experience formula (simplified from Gen V+)
            const a = isTrainerBattle ? 1.5 : 1;
            const b = baseExp;
            const e = 1; // Lucky egg would be 1.5
            const L = defeated.level;
            const Lp = pokemon.level;
            const s = participantIndices.length;
            
            // Scaled experience based on level difference
            const exp = Math.floor((a * b * L) / (5 * s) * Math.pow((2 * L + 10) / (L + Lp + 10), 2.5) + 1);
            
            const levelUpInfo = pokemon.addExperience(exp);
            results.push({
                index,
                pokemon: pokemon.nickname,
                ...levelUpInfo
            });
        }
        
        return results;
    }

    /**
     * Serialize party to JSON
     * @returns {Object}
     */
    toJSON() {
        return {
            maxSize: this.maxSize,
            pokemon: this.pokemon.map(p => p.toJSON())
        };
    }

    /**
     * Create party from JSON
     * @param {Object} data 
     * @returns {Party}
     */
    static fromJSON(data) {
        const party = new Party(data.maxSize);
        for (const pokemonData of data.pokemon) {
            party.addPokemon(Pokemon.fromJSON(pokemonData));
        }
        return party;
    }
}
