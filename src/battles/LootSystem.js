/**
 * LootSystem - Manages item drops, rewards, and loot tables
 * Inspired by Pixel Dungeon's loot system
 */

/**
 * Item categories
 */
export const ITEM_CATEGORY = {
    POKEBALL: 'pokeball',
    POTION: 'potion',
    HELD_ITEM: 'held_item',
    BERRY: 'berry',
    TM: 'tm',
    KEY_ITEM: 'key_item',
    VALUABLE: 'valuable'
};

/**
 * Item rarity tiers
 */
export const RARITY = {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary'
};

/**
 * Rarity drop weights (higher = more common)
 */
export const RARITY_WEIGHTS = {
    [RARITY.COMMON]: 100,
    [RARITY.UNCOMMON]: 40,
    [RARITY.RARE]: 15,
    [RARITY.EPIC]: 5,
    [RARITY.LEGENDARY]: 1
};

/**
 * Base item definitions
 */
export const ITEMS = {
    // Pokeballs
    pokeball: { id: 'pokeball', name: 'Poké Ball', category: ITEM_CATEGORY.POKEBALL, rarity: RARITY.COMMON, catchMod: 1, sellPrice: 100 },
    greatball: { id: 'greatball', name: 'Great Ball', category: ITEM_CATEGORY.POKEBALL, rarity: RARITY.UNCOMMON, catchMod: 1.5, sellPrice: 300 },
    ultraball: { id: 'ultraball', name: 'Ultra Ball', category: ITEM_CATEGORY.POKEBALL, rarity: RARITY.RARE, catchMod: 2, sellPrice: 600 },
    masterball: { id: 'masterball', name: 'Master Ball', category: ITEM_CATEGORY.POKEBALL, rarity: RARITY.LEGENDARY, catchMod: 255, sellPrice: 0 },
    
    // Potions
    potion: { id: 'potion', name: 'Potion', category: ITEM_CATEGORY.POTION, rarity: RARITY.COMMON, healAmount: 20, sellPrice: 100 },
    superpotion: { id: 'superpotion', name: 'Super Potion', category: ITEM_CATEGORY.POTION, rarity: RARITY.UNCOMMON, healAmount: 50, sellPrice: 350 },
    hyperpotion: { id: 'hyperpotion', name: 'Hyper Potion', category: ITEM_CATEGORY.POTION, rarity: RARITY.RARE, healAmount: 200, sellPrice: 600 },
    maxpotion: { id: 'maxpotion', name: 'Max Potion', category: ITEM_CATEGORY.POTION, rarity: RARITY.EPIC, healAmount: 9999, sellPrice: 1250 },
    fullrestore: { id: 'fullrestore', name: 'Full Restore', category: ITEM_CATEGORY.POTION, rarity: RARITY.EPIC, healAmount: 9999, curesStatus: true, sellPrice: 1500 },
    revive: { id: 'revive', name: 'Revive', category: ITEM_CATEGORY.POTION, rarity: RARITY.RARE, reviveHp: 0.5, sellPrice: 750 },
    maxrevive: { id: 'maxrevive', name: 'Max Revive', category: ITEM_CATEGORY.POTION, rarity: RARITY.EPIC, reviveHp: 1.0, sellPrice: 2000 },
    
    // Berries
    oranberry: { id: 'oranberry', name: 'Oran Berry', category: ITEM_CATEGORY.BERRY, rarity: RARITY.COMMON, healAmount: 10, sellPrice: 10 },
    sitrusberry: { id: 'sitrusberry', name: 'Sitrus Berry', category: ITEM_CATEGORY.BERRY, rarity: RARITY.UNCOMMON, healPercent: 0.25, sellPrice: 20 },
    leppaberry: { id: 'leppaberry', name: 'Leppa Berry', category: ITEM_CATEGORY.BERRY, rarity: RARITY.UNCOMMON, restorePP: 10, sellPrice: 20 },
    lumberry: { id: 'lumberry', name: 'Lum Berry', category: ITEM_CATEGORY.BERRY, rarity: RARITY.RARE, curesStatus: true, sellPrice: 50 },
    
    // Held items
    leftovers: { id: 'leftovers', name: 'Leftovers', category: ITEM_CATEGORY.HELD_ITEM, rarity: RARITY.RARE, effect: 'heal_each_turn', healPercent: 0.0625, sellPrice: 1000 },
    choiceband: { id: 'choiceband', name: 'Choice Band', category: ITEM_CATEGORY.HELD_ITEM, rarity: RARITY.RARE, effect: 'boost_attack', boostMod: 1.5, sellPrice: 1000 },
    choicespecs: { id: 'choicespecs', name: 'Choice Specs', category: ITEM_CATEGORY.HELD_ITEM, rarity: RARITY.RARE, effect: 'boost_sp_attack', boostMod: 1.5, sellPrice: 1000 },
    focussash: { id: 'focussash', name: 'Focus Sash', category: ITEM_CATEGORY.HELD_ITEM, rarity: RARITY.RARE, effect: 'survive_ohko', oneUse: true, sellPrice: 500 },
    lifeorb: { id: 'lifeorb', name: 'Life Orb', category: ITEM_CATEGORY.HELD_ITEM, rarity: RARITY.EPIC, effect: 'boost_damage', boostMod: 1.3, recoilPercent: 0.1, sellPrice: 1500 },
    
    // Valuables (sell items)
    nugget: { id: 'nugget', name: 'Nugget', category: ITEM_CATEGORY.VALUABLE, rarity: RARITY.RARE, sellPrice: 5000 },
    bigpearl: { id: 'bigpearl', name: 'Big Pearl', category: ITEM_CATEGORY.VALUABLE, rarity: RARITY.UNCOMMON, sellPrice: 3750 },
    stardust: { id: 'stardust', name: 'Stardust', category: ITEM_CATEGORY.VALUABLE, rarity: RARITY.UNCOMMON, sellPrice: 1000 },
    starpiece: { id: 'starpiece', name: 'Star Piece', category: ITEM_CATEGORY.VALUABLE, rarity: RARITY.RARE, sellPrice: 4900 }
};

/**
 * Loot tables for different encounter types
 */
export const LOOT_TABLES = {
    wildPokemon: {
        dropChance: 0.1,
        items: [
            { item: 'oranberry', weight: 30 },
            { item: 'sitrusberry', weight: 15 },
            { item: 'leppaberry', weight: 10 },
            { item: 'lumberry', weight: 5 }
        ]
    },
    trainer: {
        dropChance: 1.0, // Trainers always give rewards
        moneyBase: 100, // Base * highest level
        items: [
            { item: 'potion', weight: 20 },
            { item: 'superpotion', weight: 10 },
            { item: 'pokeball', weight: 15 },
            { item: 'greatball', weight: 8 }
        ]
    },
    gymLeader: {
        dropChance: 1.0,
        moneyBase: 500,
        guaranteed: ['tm'], // Will generate a TM
        items: [
            { item: 'hyperpotion', weight: 20 },
            { item: 'ultraball', weight: 15 },
            { item: 'revive', weight: 10 },
            { item: 'leftovers', weight: 3 }
        ]
    },
    dungeonChest: {
        dropChance: 1.0,
        items: [
            { item: 'superpotion', weight: 20 },
            { item: 'hyperpotion', weight: 10 },
            { item: 'greatball', weight: 15 },
            { item: 'ultraball', weight: 8 },
            { item: 'revive', weight: 10 },
            { item: 'stardust', weight: 10 },
            { item: 'nugget', weight: 3 },
            { item: 'focussash', weight: 2 },
            { item: 'leftovers', weight: 2 }
        ]
    },
    hiddenItem: {
        dropChance: 1.0,
        items: [
            { item: 'pokeball', weight: 25 },
            { item: 'potion', weight: 25 },
            { item: 'oranberry', weight: 20 },
            { item: 'stardust', weight: 10 },
            { item: 'bigpearl', weight: 5 },
            { item: 'starpiece', weight: 3 },
            { item: 'nugget', weight: 2 }
        ]
    }
};

/**
 * LootSystem class - Manages loot generation
 */
export class LootSystem {
    /**
     * Create a loot system
     * @param {Object} difficultyManager - Optional difficulty manager for drop rate modifiers
     */
    constructor(difficultyManager = null) {
        this.difficultyManager = difficultyManager;
    }

    /**
     * Roll for loot from a loot table
     * @param {string} tableId - ID of the loot table
     * @param {Object} options - Additional options
     * @returns {Object} - Loot result
     */
    rollLoot(tableId, options = {}) {
        const {
            level = 10,           // Used for money scaling
            itemCount = 1,        // Number of items to roll
            guaranteeItem = false // Always drop at least one item
        } = options;

        const table = LOOT_TABLES[tableId];
        if (!table) {
            return { money: 0, items: [] };
        }

        const result = {
            money: 0,
            items: []
        };

        // Calculate money reward
        if (table.moneyBase) {
            result.money = this.calculateMoney(table.moneyBase, level);
        }

        // Roll for drops
        let dropChance = table.dropChance || 0;
        if (this.difficultyManager) {
            dropChance = this.difficultyManager.getItemDropRate(dropChance);
        }

        const shouldDrop = guaranteeItem || Math.random() < dropChance;

        if (shouldDrop && table.items && table.items.length > 0) {
            for (let i = 0; i < itemCount; i++) {
                const item = this.rollItem(table.items);
                if (item) {
                    result.items.push(item);
                }
            }
        }

        // Add guaranteed items
        if (table.guaranteed) {
            for (const guaranteed of table.guaranteed) {
                // Handle special cases like TMs
                if (guaranteed === 'tm') {
                    result.items.push(this.generateTM(level));
                }
            }
        }

        return result;
    }

    /**
     * Roll a single item from weighted list
     * @param {Object[]} itemList 
     * @returns {Object|null}
     */
    rollItem(itemList) {
        const totalWeight = itemList.reduce((sum, entry) => sum + entry.weight, 0);
        let roll = Math.random() * totalWeight;

        for (const entry of itemList) {
            roll -= entry.weight;
            if (roll <= 0) {
                const itemDef = ITEMS[entry.item];
                if (itemDef) {
                    return { ...itemDef, quantity: 1 };
                }
            }
        }

        return null;
    }

    /**
     * Calculate money reward
     * @param {number} baseMoney 
     * @param {number} level 
     * @returns {number}
     */
    calculateMoney(baseMoney, level) {
        let money = baseMoney * level;
        
        if (this.difficultyManager) {
            money = this.difficultyManager.getMoneyReward(money);
        }

        // Add some variance (90-110%)
        const variance = 0.9 + Math.random() * 0.2;
        return Math.floor(money * variance);
    }

    /**
     * Generate a TM (Technical Machine)
     * @param {number} level - Used to determine which TM
     * @returns {Object}
     */
    generateTM(level) {
        // Simplified TM generation - would have full move list in real implementation
        const tmMoves = [
            { number: 1, move: 'Focus Punch' },
            { number: 6, move: 'Toxic' },
            { number: 10, move: 'Hidden Power' },
            { number: 13, move: 'Ice Beam' },
            { number: 15, move: 'Hyper Beam' },
            { number: 24, move: 'Thunderbolt' },
            { number: 26, move: 'Earthquake' },
            { number: 29, move: 'Psychic' },
            { number: 35, move: 'Flamethrower' },
            { number: 36, move: 'Sludge Bomb' }
        ];

        const tm = tmMoves[Math.floor(Math.random() * tmMoves.length)];
        
        return {
            id: `tm${tm.number}`,
            name: `TM${String(tm.number).padStart(2, '0')} ${tm.move}`,
            category: ITEM_CATEGORY.TM,
            rarity: RARITY.RARE,
            move: tm.move,
            sellPrice: 3000
        };
    }

    /**
     * Generate loot for defeating a wild Pokemon
     * @param {Object} pokemon - Defeated Pokemon
     * @returns {Object}
     */
    getWildPokemonLoot(pokemon) {
        return this.rollLoot('wildPokemon', {
            level: pokemon.level,
            guaranteeItem: false
        });
    }

    /**
     * Generate loot for defeating a trainer
     * @param {Object} trainer - Defeated trainer data
     * @returns {Object}
     */
    getTrainerLoot(trainer) {
        const highestLevel = Math.max(...trainer.pokemon.map(p => p.level));
        
        return this.rollLoot(trainer.isGymLeader ? 'gymLeader' : 'trainer', {
            level: highestLevel,
            itemCount: trainer.isGymLeader ? 2 : 1,
            guaranteeItem: true
        });
    }

    /**
     * Generate dungeon chest loot
     * @param {number} dungeonLevel - Difficulty level of dungeon
     * @returns {Object}
     */
    getDungeonChestLoot(dungeonLevel) {
        return this.rollLoot('dungeonChest', {
            level: dungeonLevel,
            itemCount: 2,
            guaranteeItem: true
        });
    }

    /**
     * Roll for random encounter with rare Pokemon
     * @param {number} areaLevel 
     * @returns {Object}
     */
    rollRareEncounter(areaLevel) {
        // 5% chance for rare encounter
        if (Math.random() < 0.05) {
            return {
                isRare: true,
                levelBonus: Math.floor(areaLevel * 0.2),
                guaranteedItem: true
            };
        }
        
        return { isRare: false };
    }

    /**
     * Get item by ID
     * @param {string} itemId 
     * @returns {Object|null}
     */
    getItem(itemId) {
        return ITEMS[itemId] || null;
    }
}
