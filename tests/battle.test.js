/**
 * Tests for Pokemon and battle calculations
 */

import { Pokemon, STATUS } from '../src/battles/Pokemon.js';
import { Party } from '../src/battles/Party.js';
import { DamageCalculator, MOVE_CATEGORY } from '../src/battles/DamageCalculator.js';
import { DifficultyManager, DIFFICULTY } from '../src/battles/DifficultyManager.js';
import { LootSystem, RARITY } from '../src/battles/LootSystem.js';

// Test species data
const testSpecies = {
    name: 'Testmon',
    types: ['fire'],
    baseStats: {
        hp: 80,
        attack: 82,
        defense: 83,
        spAttack: 100,
        spDefense: 100,
        speed: 80
    },
    baseExp: 240,
    catchRate: 45
};

const testSpecies2 = {
    name: 'Watermon',
    types: ['water'],
    baseStats: {
        hp: 90,
        attack: 75,
        defense: 100,
        spAttack: 90,
        spDefense: 90,
        speed: 60
    },
    baseExp: 200,
    catchRate: 45
};

describe('Pokemon', () => {
    test('should create a Pokemon with correct level', () => {
        const pokemon = new Pokemon(testSpecies, 50);
        expect(pokemon.level).toBe(50);
        expect(pokemon.nickname).toBe('Testmon');
    });

    test('should calculate stats correctly', () => {
        const pokemon = new Pokemon(testSpecies, 50, {
            ivs: { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 },
            evs: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
            nature: 'hardy' // No stat changes
        });
        
        // HP formula: ((2 * 80 + 31 + 0) * 50 / 100) + 50 + 10 = 155
        expect(pokemon.stats.hp).toBe(155);
    });

    test('should start with full HP', () => {
        const pokemon = new Pokemon(testSpecies, 50);
        expect(pokemon.currentHp).toBe(pokemon.stats.hp);
    });

    test('should correctly identify fainted state', () => {
        const pokemon = new Pokemon(testSpecies, 50);
        expect(pokemon.isFainted()).toBe(false);
        
        pokemon.currentHp = 0;
        expect(pokemon.isFainted()).toBe(true);
    });

    test('should apply damage correctly', () => {
        const pokemon = new Pokemon(testSpecies, 50);
        const initialHp = pokemon.currentHp;
        
        const damage = pokemon.takeDamage(30);
        
        expect(damage).toBe(30);
        expect(pokemon.currentHp).toBe(initialHp - 30);
    });

    test('should not go below 0 HP', () => {
        const pokemon = new Pokemon(testSpecies, 50);
        pokemon.takeDamage(9999);
        
        expect(pokemon.currentHp).toBe(0);
        expect(pokemon.isFainted()).toBe(true);
    });

    test('should heal correctly', () => {
        const pokemon = new Pokemon(testSpecies, 50);
        pokemon.currentHp = 50;
        
        const healed = pokemon.heal(30);
        
        expect(healed).toBe(30);
        expect(pokemon.currentHp).toBe(80);
    });

    test('should not heal above max HP', () => {
        const pokemon = new Pokemon(testSpecies, 50);
        const maxHp = pokemon.stats.hp;
        pokemon.currentHp = maxHp - 10;
        
        const healed = pokemon.heal(50);
        
        expect(healed).toBe(10);
        expect(pokemon.currentHp).toBe(maxHp);
    });

    test('should apply status conditions', () => {
        const pokemon = new Pokemon(testSpecies, 50);
        
        const applied = pokemon.applyStatus(STATUS.BURN);
        
        expect(applied).toBe(false); // Fire types are immune to burn
        
        const pokemon2 = new Pokemon(testSpecies2, 50);
        const applied2 = pokemon2.applyStatus(STATUS.BURN);
        
        expect(applied2).toBe(true);
        expect(pokemon2.status).toBe(STATUS.BURN);
    });

    test('should calculate type effectiveness', () => {
        const pokemon = new Pokemon(testSpecies2, 50); // Water type
        
        const fireEffectiveness = pokemon.getTypeEffectiveness('fire');
        const grassEffectiveness = pokemon.getTypeEffectiveness('grass');
        const waterEffectiveness = pokemon.getTypeEffectiveness('water');
        
        expect(fireEffectiveness).toBe(0.5); // Fire is not very effective
        expect(grassEffectiveness).toBe(2);  // Grass is super effective
        expect(waterEffectiveness).toBe(0.5); // Water is not very effective
    });

    test('should gain experience and level up', () => {
        const pokemon = new Pokemon(testSpecies, 10);
        const initialLevel = pokemon.level;
        
        // Add enough exp for at least one level
        const result = pokemon.addExperience(1000);
        
        expect(pokemon.level).toBeGreaterThan(initialLevel);
        expect(result.levelsGained).toBeGreaterThan(0);
    });

    test('should serialize and deserialize correctly', () => {
        const pokemon = new Pokemon(testSpecies, 50, { nickname: 'Fluffy' });
        const json = pokemon.toJSON();
        const restored = Pokemon.fromJSON(json);
        
        expect(restored.nickname).toBe('Fluffy');
        expect(restored.level).toBe(50);
        expect(restored.stats.hp).toBe(pokemon.stats.hp);
    });
});

describe('Party', () => {
    test('should start empty', () => {
        const party = new Party();
        
        expect(party.isEmpty()).toBe(true);
        expect(party.size).toBe(0);
    });

    test('should add Pokemon correctly', () => {
        const party = new Party();
        const pokemon = new Pokemon(testSpecies, 50);
        
        const added = party.addPokemon(pokemon);
        
        expect(added).toBe(true);
        expect(party.size).toBe(1);
        expect(party.isEmpty()).toBe(false);
    });

    test('should respect max party size', () => {
        const party = new Party(3); // Max 3
        
        party.addPokemon(new Pokemon(testSpecies, 10));
        party.addPokemon(new Pokemon(testSpecies, 20));
        party.addPokemon(new Pokemon(testSpecies, 30));
        
        expect(party.isFull()).toBe(true);
        
        const added = party.addPokemon(new Pokemon(testSpecies, 40));
        expect(added).toBe(false);
        expect(party.size).toBe(3);
    });

    test('should get lead Pokemon', () => {
        const party = new Party();
        const pokemon1 = new Pokemon(testSpecies, 10);
        const pokemon2 = new Pokemon(testSpecies, 20);
        
        party.addPokemon(pokemon1);
        party.addPokemon(pokemon2);
        
        expect(party.getLeadPokemon()).toBe(pokemon1);
    });

    test('should skip fainted Pokemon for lead', () => {
        const party = new Party();
        const pokemon1 = new Pokemon(testSpecies, 10);
        const pokemon2 = new Pokemon(testSpecies, 20);
        
        pokemon1.currentHp = 0; // Fainted
        
        party.addPokemon(pokemon1);
        party.addPokemon(pokemon2);
        
        expect(party.getLeadPokemon()).toBe(pokemon2);
    });

    test('should detect whiteout', () => {
        const party = new Party();
        const pokemon1 = new Pokemon(testSpecies, 10);
        const pokemon2 = new Pokemon(testSpecies, 20);
        
        party.addPokemon(pokemon1);
        party.addPokemon(pokemon2);
        
        expect(party.isWhiteout()).toBe(false);
        
        pokemon1.currentHp = 0;
        pokemon2.currentHp = 0;
        
        expect(party.isWhiteout()).toBe(true);
    });

    test('should swap positions', () => {
        const party = new Party();
        const pokemon1 = new Pokemon(testSpecies, 10, { nickname: 'First' });
        const pokemon2 = new Pokemon(testSpecies, 20, { nickname: 'Second' });
        
        party.addPokemon(pokemon1);
        party.addPokemon(pokemon2);
        
        party.swapPositions(0, 1);
        
        expect(party.getPokemon(0).nickname).toBe('Second');
        expect(party.getPokemon(1).nickname).toBe('First');
    });

    test('should calculate average level', () => {
        const party = new Party();
        party.addPokemon(new Pokemon(testSpecies, 10));
        party.addPokemon(new Pokemon(testSpecies, 20));
        party.addPokemon(new Pokemon(testSpecies, 30));
        
        expect(party.getAverageLevel()).toBe(20);
    });
});

describe('DamageCalculator', () => {
    const testMove = {
        name: 'Test Attack',
        type: 'fire',
        power: 90,
        accuracy: 100,
        category: MOVE_CATEGORY.PHYSICAL
    };

    test('should calculate damage > 0 for attacking moves', () => {
        const attacker = new Pokemon(testSpecies, 50);
        const defender = new Pokemon(testSpecies2, 50);
        
        const result = DamageCalculator.calculateDamage(attacker, defender, testMove, { criticalHit: false });
        
        expect(result.damage).toBeGreaterThan(0);
    });

    test('should apply type effectiveness', () => {
        const attacker = new Pokemon(testSpecies, 50);
        const defender = new Pokemon(testSpecies2, 50); // Water type
        
        // Fire vs Water should be not very effective (0.5x)
        const result = DamageCalculator.calculateDamage(attacker, defender, testMove, { criticalHit: false });
        
        expect(result.effectiveness).toBe(0.5);
        expect(result.message).toBe("It's not very effective...");
    });

    test('should detect super effective', () => {
        const attacker = new Pokemon(testSpecies2, 50); // Water type
        const defender = new Pokemon(testSpecies, 50);  // Fire type
        
        const waterMove = {
            name: 'Water Gun',
            type: 'water',
            power: 40,
            accuracy: 100,
            category: MOVE_CATEGORY.SPECIAL
        };
        
        const result = DamageCalculator.calculateDamage(attacker, defender, waterMove, { criticalHit: false });
        
        expect(result.effectiveness).toBe(2);
        expect(result.message).toBe("It's super effective!");
    });

    test('should calculate 0 damage for status moves', () => {
        const attacker = new Pokemon(testSpecies, 50);
        const defender = new Pokemon(testSpecies2, 50);
        
        const statusMove = {
            name: 'Growl',
            type: 'normal',
            category: MOVE_CATEGORY.STATUS
        };
        
        const result = DamageCalculator.calculateDamage(attacker, defender, statusMove);
        
        expect(result.damage).toBe(0);
    });

    test('should determine turn order by speed', () => {
        const fastPokemon = new Pokemon(testSpecies, 50);
        const slowPokemon = new Pokemon(testSpecies2, 50);
        
        // Testmon has 80 speed, Watermon has 60
        const order = DamageCalculator.determineTurnOrder(
            fastPokemon, testMove,
            slowPokemon, testMove
        );
        
        expect(order).toBe(1); // Fast Pokemon goes first
    });

    test('should respect move priority', () => {
        const pokemon1 = new Pokemon(testSpecies, 50);
        const pokemon2 = new Pokemon(testSpecies2, 50);
        
        const normalMove = { ...testMove, priority: 0 };
        const priorityMove = { ...testMove, priority: 1 };
        
        // Priority move should go first even if slower
        const order = DamageCalculator.determineTurnOrder(
            pokemon2, priorityMove, // Slower but priority
            pokemon1, normalMove    // Faster but normal
        );
        
        expect(order).toBe(1);
    });
});

describe('DifficultyManager', () => {
    test('should start with normal difficulty', () => {
        const dm = new DifficultyManager();
        expect(dm.difficulty).toBe(DIFFICULTY.NORMAL);
    });

    test('should apply difficulty modifiers', () => {
        const easy = new DifficultyManager(DIFFICULTY.EASY);
        const hard = new DifficultyManager(DIFFICULTY.HARD);
        
        expect(easy.modifiers.enemyLevelMod).toBeLessThan(1);
        expect(hard.modifiers.enemyLevelMod).toBeGreaterThan(1);
    });

    test('should track battle results', () => {
        const dm = new DifficultyManager();
        
        dm.recordBattleResult(true);
        expect(dm.consecutiveWins).toBe(1);
        
        dm.recordBattleResult(true);
        expect(dm.consecutiveWins).toBe(2);
        
        dm.recordBattleResult(false);
        expect(dm.consecutiveWins).toBe(0);
        expect(dm.consecutiveLosses).toBe(1);
        expect(dm.playerDeaths).toBe(1);
    });

    test('should scale enemy levels', () => {
        const dm = new DifficultyManager(DIFFICULTY.NORMAL);
        
        const level = dm.getEnemyLevel(10, 15);
        
        // Should be around area level with some player scaling
        expect(level).toBeGreaterThan(5);
        expect(level).toBeLessThan(25);
    });
});

describe('LootSystem', () => {
    test('should roll loot from tables', () => {
        const loot = new LootSystem();
        
        const result = loot.rollLoot('trainer', { level: 20, guaranteeItem: true });
        
        expect(result.money).toBeGreaterThan(0);
    });

    test('should get item by id', () => {
        const loot = new LootSystem();
        
        const potion = loot.getItem('potion');
        
        expect(potion).toBeTruthy();
        expect(potion.name).toBe('Potion');
        expect(potion.healAmount).toBe(20);
    });

    test('should generate TMs', () => {
        const loot = new LootSystem();
        
        const tm = loot.generateTM(50);
        
        expect(tm.category).toBe('tm');
        expect(tm.rarity).toBe(RARITY.RARE);
        expect(tm.move).toBeTruthy();
    });

    test('should scale money with difficulty', () => {
        const easy = new LootSystem(new DifficultyManager(DIFFICULTY.EASY));
        const hard = new LootSystem(new DifficultyManager(DIFFICULTY.HARD));
        
        // Run multiple times to account for variance
        let easyTotal = 0;
        let hardTotal = 0;
        for (let i = 0; i < 100; i++) {
            easyTotal += easy.calculateMoney(100, 10);
            hardTotal += hard.calculateMoney(100, 10);
        }
        
        // Easy should give more money on average
        expect(easyTotal).toBeGreaterThan(hardTotal);
    });
});
