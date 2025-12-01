/**
 * BattleSystem - Handles Pokemon-style turn-based battles
 * 
 * Features:
 * - Turn-based combat mechanics
 * - Move selection and execution
 * - Damage calculation with type effectiveness
 * - Status effects
 * - Wild encounters and trainer battles
 * - Party management
 * - Battle UI rendering
 */

import { Pokemon, STATUS, TYPE_CHART } from './Pokemon.js';
import { Party } from './Party.js';
import { DamageCalculator, MOVE_CATEGORY } from './DamageCalculator.js';
import { DifficultyManager, DIFFICULTY } from './DifficultyManager.js';
import { LootSystem } from './LootSystem.js';
import { BattleUI, BATTLE_UI_STATE } from '../ui/BattleUI.js';

/**
 * Battle phases
 */
export const BATTLE_PHASE = {
    INTRO: 'intro',
    PLAYER_TURN: 'player_turn',
    ENEMY_TURN: 'enemy_turn',
    EXECUTING: 'executing',
    SWITCH: 'switch',
    VICTORY: 'victory',
    DEFEAT: 'defeat',
    RUN: 'run',
    CATCH: 'catch'
};

/**
 * BattleSystem class - Full turn-based battle implementation
 */
export class BattleSystem {
    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Object} config 
     */
    constructor(ctx, config) {
        this.ctx = ctx;
        this.config = config;
        this.isActive = false;
        
        // Battle state
        this.phase = BATTLE_PHASE.INTRO;
        this.playerPokemon = null;
        this.opponentPokemon = null;
        this.party = null;
        this.isTrainerBattle = false;
        this.trainerName = '';
        this.trainerPokemon = [];
        this.trainerIndex = 0;
        
        // Turn management
        this.turnNumber = 0;
        this.playerAction = null;
        this.opponentAction = null;
        this.battleLog = [];
        
        // Weather and field effects
        this.weather = 'clear';
        this.weatherTurns = 0;
        
        // Systems
        this.difficultyManager = new DifficultyManager(DIFFICULTY.NORMAL);
        this.lootSystem = new LootSystem(this.difficultyManager);
        this.ui = new BattleUI(ctx, config);
        
        // Battle rewards
        this.rewards = {
            exp: 0,
            money: 0,
            items: []
        };
        
        // Callbacks
        this.onBattleEnd = null;
        
        // Input state (to prevent repeated inputs)
        this.lastKeys = {};
    }
    
    /**
     * Start a wild Pokemon battle
     * @param {Party} party - Player's party
     * @param {Pokemon} wildPokemon - Wild Pokemon to battle
     */
    startWildBattle(party, wildPokemon) {
        this.isActive = true;
        this.party = party;
        this.isTrainerBattle = false;
        this.trainerName = '';
        
        // Get lead Pokemon
        this.playerPokemon = party.getLeadPokemon();
        this.opponentPokemon = wildPokemon;
        
        this.initBattle();
        
        // Show intro message
        this.ui.setMessage(`A wild ${wildPokemon.nickname} appeared!`, () => {
            this.ui.setMessage(`Go! ${this.playerPokemon.nickname}!`, () => {
                this.ui.state = BATTLE_UI_STATE.ACTION_SELECT;
                this.phase = BATTLE_PHASE.PLAYER_TURN;
            });
        });
    }
    
    /**
     * Start a trainer battle
     * @param {Party} party - Player's party
     * @param {Object} trainer - Trainer data with pokemon array
     */
    startTrainerBattle(party, trainer) {
        this.isActive = true;
        this.party = party;
        this.isTrainerBattle = true;
        this.trainerName = trainer.name || 'Trainer';
        this.trainerPokemon = trainer.pokemon || [];
        this.trainerIndex = 0;
        
        // Get lead Pokemon
        this.playerPokemon = party.getLeadPokemon();
        this.opponentPokemon = this.trainerPokemon[0] || null;
        
        this.initBattle();
        
        // Show intro message
        this.ui.setMessage(`${this.trainerName} wants to battle!`, () => {
            this.ui.setMessage(`${this.trainerName} sent out ${this.opponentPokemon.nickname}!`, () => {
                this.ui.setMessage(`Go! ${this.playerPokemon.nickname}!`, () => {
                    this.ui.state = BATTLE_UI_STATE.ACTION_SELECT;
                    this.phase = BATTLE_PHASE.PLAYER_TURN;
                });
            });
        });
    }
    
    /**
     * Initialize battle state
     */
    initBattle() {
        this.phase = BATTLE_PHASE.INTRO;
        this.turnNumber = 0;
        this.playerAction = null;
        this.opponentAction = null;
        this.battleLog = [];
        this.weather = 'clear';
        this.weatherTurns = 0;
        this.rewards = { exp: 0, money: 0, items: [] };
        this.ui.reset();
    }
    
    /**
     * End the current battle
     * @param {string} result - 'victory', 'defeat', or 'run'
     */
    endBattle(result) {
        this.phase = result === 'victory' ? BATTLE_PHASE.VICTORY : 
                    (result === 'defeat' ? BATTLE_PHASE.DEFEAT : BATTLE_PHASE.RUN);
        
        // Calculate rewards for victory
        if (result === 'victory') {
            const loot = this.isTrainerBattle ? 
                this.lootSystem.getTrainerLoot({ 
                    pokemon: this.trainerPokemon, 
                    isGymLeader: false 
                }) :
                this.lootSystem.getWildPokemonLoot(this.opponentPokemon);
            
            this.rewards.money += loot.money;
            this.rewards.items.push(...loot.items);
            
            this.ui.state = BATTLE_UI_STATE.VICTORY;
            this.difficultyManager.recordBattleResult(true);
        } else if (result === 'defeat') {
            this.ui.state = BATTLE_UI_STATE.DEFEAT;
            this.difficultyManager.recordBattleResult(false);
        }
        
        // Notify callback after a delay
        if (result === 'run') {
            this.isActive = false;
            if (this.onBattleEnd) {
                this.onBattleEnd({ result, rewards: this.rewards });
            }
        }
    }
    
    /**
     * Process player's chosen action
     * @param {string} action - 'fight', 'bag', 'pokemon', 'run'
     */
    processPlayerAction(action) {
        switch (action) {
            case 'fight':
                this.ui.state = BATTLE_UI_STATE.MOVE_SELECT;
                break;
                
            case 'bag':
                // TODO: Implement bag/item usage
                this.ui.queueMessage('Items not implemented yet!', 1500);
                break;
                
            case 'pokemon':
                this.ui.state = BATTLE_UI_STATE.POKEMON_SELECT;
                break;
                
            case 'run':
                if (this.isTrainerBattle) {
                    this.ui.queueMessage("Can't run from a trainer battle!", 1500);
                } else {
                    this.attemptRun();
                }
                break;
        }
    }
    
    /**
     * Process player's move selection
     * @param {number} moveIndex 
     */
    processPlayerMove(moveIndex) {
        const move = this.playerPokemon.moves[moveIndex];
        if (!move) {
            this.ui.queueMessage('No move in that slot!', 1000);
            return;
        }
        
        this.playerAction = { type: 'move', move, moveIndex };
        this.selectOpponentAction();
        this.executeTurn();
    }
    
    /**
     * Process Pokemon switch
     * @param {number} pokemonIndex 
     */
    processSwitch(pokemonIndex) {
        const newPokemon = this.party.getPokemon(pokemonIndex);
        if (!newPokemon || newPokemon.isFainted() || newPokemon === this.playerPokemon) {
            this.ui.queueMessage("Can't switch to that Pokemon!", 1000);
            return;
        }
        
        const oldName = this.playerPokemon.nickname;
        this.playerPokemon = newPokemon;
        
        this.ui.setMessage(`${oldName}, come back!`, () => {
            this.ui.setMessage(`Go! ${this.playerPokemon.nickname}!`, () => {
                // Opponent gets a free turn on switch
                this.selectOpponentAction();
                this.executeOpponentTurn();
            });
        });
    }
    
    /**
     * Select opponent's action (AI)
     */
    selectOpponentAction() {
        const aggression = this.difficultyManager.getAIAggression();
        
        // Simple AI: pick a random move, with higher aggression favoring stronger moves
        const moves = this.opponentPokemon.moves;
        if (!moves || moves.length === 0) {
            // Default struggle-like move
            this.opponentAction = {
                type: 'move',
                move: {
                    name: 'Struggle',
                    type: 'normal',
                    power: 50,
                    accuracy: 100,
                    category: MOVE_CATEGORY.PHYSICAL
                }
            };
            return;
        }
        
        if (Math.random() < aggression) {
            // Pick strongest move based on predicted damage
            let bestMove = moves[0];
            let bestDamage = 0;
            
            for (const move of moves) {
                if (move.category === MOVE_CATEGORY.STATUS) continue;
                
                const effectiveness = this.playerPokemon.getTypeEffectiveness(move.type);
                const predictedDamage = (move.power || 0) * effectiveness;
                
                if (predictedDamage > bestDamage) {
                    bestDamage = predictedDamage;
                    bestMove = move;
                }
            }
            
            this.opponentAction = { type: 'move', move: bestMove };
        } else {
            // Random move
            const move = moves[Math.floor(Math.random() * moves.length)];
            this.opponentAction = { type: 'move', move };
        }
    }
    
    /**
     * Execute the turn
     */
    executeTurn() {
        this.turnNumber++;
        this.phase = BATTLE_PHASE.EXECUTING;
        this.ui.state = BATTLE_UI_STATE.EXECUTING;
        
        // Determine turn order
        const first = DamageCalculator.determineTurnOrder(
            this.playerPokemon, this.playerAction.move,
            this.opponentPokemon, this.opponentAction.move
        );
        
        if (first === 1 || first === 0) {
            this.executePlayerTurn(() => {
                if (!this.opponentPokemon.isFainted()) {
                    this.executeOpponentTurn(() => {
                        this.endTurn();
                    });
                } else {
                    this.handleOpponentFainted();
                }
            });
        } else {
            this.executeOpponentTurn(() => {
                if (!this.playerPokemon.isFainted()) {
                    this.executePlayerTurn(() => {
                        this.endTurn();
                    });
                } else {
                    this.handlePlayerFainted();
                }
            });
        }
    }
    
    /**
     * Execute player's turn
     * @param {Function} callback 
     */
    executePlayerTurn(callback) {
        if (!this.playerAction) {
            if (callback) callback();
            return;
        }
        
        const move = this.playerAction.move;
        
        // Show move message
        this.ui.setMessage(`${this.playerPokemon.nickname} used ${move.name}!`, () => {
            // Check accuracy
            if (!DamageCalculator.checkAccuracy(this.playerPokemon, this.opponentPokemon, move)) {
                this.ui.setMessage(`${this.playerPokemon.nickname}'s attack missed!`, () => {
                    if (callback) callback();
                });
                return;
            }
            
            // Calculate damage
            const result = DamageCalculator.calculateDamage(
                this.playerPokemon, this.opponentPokemon, move,
                { weather: this.weather }
            );
            
            // Apply damage
            if (result.damage > 0) {
                this.opponentPokemon.takeDamage(result.damage);
            }
            
            // Show effectiveness message
            if (result.message) {
                this.ui.setMessage(result.message, () => {
                    if (callback) callback();
                });
            } else {
                if (callback) callback();
            }
        });
    }
    
    /**
     * Execute opponent's turn
     * @param {Function} callback 
     */
    executeOpponentTurn(callback) {
        if (!this.opponentAction) {
            if (callback) callback();
            return;
        }
        
        const move = this.opponentAction.move;
        
        // Check status prevents action
        const statusResult = this.opponentPokemon.processStatus();
        if (statusResult.type === 'prevent') {
            this.ui.setMessage(statusResult.message, () => {
                if (callback) callback();
            });
            return;
        }
        
        // Show move message
        const prefix = this.isTrainerBattle ? `Foe ${this.opponentPokemon.nickname}` : `Wild ${this.opponentPokemon.nickname}`;
        this.ui.setMessage(`${prefix} used ${move.name}!`, () => {
            // Check accuracy
            if (!DamageCalculator.checkAccuracy(this.opponentPokemon, this.playerPokemon, move)) {
                this.ui.setMessage(`${prefix}'s attack missed!`, () => {
                    if (callback) callback();
                });
                return;
            }
            
            // Calculate damage
            const result = DamageCalculator.calculateDamage(
                this.opponentPokemon, this.playerPokemon, move,
                { weather: this.weather }
            );
            
            // Apply damage
            if (result.damage > 0) {
                this.playerPokemon.takeDamage(result.damage);
            }
            
            // Show effectiveness message
            if (result.message) {
                this.ui.setMessage(result.message, () => {
                    if (callback) callback();
                });
            } else {
                if (callback) callback();
            }
        });
    }
    
    /**
     * End the turn (status effects, etc.)
     */
    endTurn() {
        // Process end-of-turn status effects
        const processStatus = (pokemon, isPlayer) => {
            return new Promise((resolve) => {
                const result = pokemon.processStatus();
                if (result.type === 'damage' && result.message) {
                    this.ui.setMessage(result.message, resolve);
                } else {
                    resolve();
                }
            });
        };
        
        // Check for fainted Pokemon
        if (this.opponentPokemon.isFainted()) {
            this.handleOpponentFainted();
            return;
        }
        
        if (this.playerPokemon.isFainted()) {
            this.handlePlayerFainted();
            return;
        }
        
        // Return to action select
        this.phase = BATTLE_PHASE.PLAYER_TURN;
        this.ui.state = BATTLE_UI_STATE.ACTION_SELECT;
        this.playerAction = null;
        this.opponentAction = null;
    }
    
    /**
     * Handle opponent Pokemon fainting
     */
    handleOpponentFainted() {
        const prefix = this.isTrainerBattle ? `Foe ${this.opponentPokemon.nickname}` : `Wild ${this.opponentPokemon.nickname}`;
        
        this.ui.setMessage(`${prefix} fainted!`, () => {
            // Calculate exp gain
            const expGain = DamageCalculator.calculateExpYield(
                this.opponentPokemon,
                1, // participantCount
                this.isTrainerBattle
            );
            this.rewards.exp += expGain;
            
            // Award exp to player Pokemon
            const levelUpResult = this.playerPokemon.addExperience(expGain);
            
            this.ui.setMessage(`${this.playerPokemon.nickname} gained ${expGain} EXP!`, () => {
                // Handle level ups
                if (levelUpResult.levelsGained > 0) {
                    this.ui.setMessage(`${this.playerPokemon.nickname} grew to level ${this.playerPokemon.level}!`, () => {
                        this.checkBattleEnd();
                    });
                } else {
                    this.checkBattleEnd();
                }
            });
        });
    }
    
    /**
     * Check if battle should end
     */
    checkBattleEnd() {
        if (this.isTrainerBattle) {
            // Check for next trainer Pokemon
            this.trainerIndex++;
            if (this.trainerIndex < this.trainerPokemon.length) {
                this.opponentPokemon = this.trainerPokemon[this.trainerIndex];
                this.ui.setMessage(`${this.trainerName} sent out ${this.opponentPokemon.nickname}!`, () => {
                    this.phase = BATTLE_PHASE.PLAYER_TURN;
                    this.ui.state = BATTLE_UI_STATE.ACTION_SELECT;
                });
            } else {
                // Trainer defeated
                this.endBattle('victory');
            }
        } else {
            // Wild Pokemon defeated
            this.endBattle('victory');
        }
    }
    
    /**
     * Handle player Pokemon fainting
     */
    handlePlayerFainted() {
        this.ui.setMessage(`${this.playerPokemon.nickname} fainted!`, () => {
            // Check for available Pokemon
            if (this.party.isWhiteout()) {
                this.endBattle('defeat');
            } else {
                // Force switch
                this.ui.setMessage('Choose a Pokemon!', () => {
                    this.phase = BATTLE_PHASE.SWITCH;
                    this.ui.state = BATTLE_UI_STATE.POKEMON_SELECT;
                });
            }
        });
    }
    
    /**
     * Attempt to run from battle
     */
    attemptRun() {
        // Run formula: (player speed * 128 / opponent speed) + 30 * attempts
        const playerSpeed = this.playerPokemon.stats.speed;
        const opponentSpeed = this.opponentPokemon.stats.speed;
        const runChance = ((playerSpeed * 128) / opponentSpeed + 30) / 256;
        
        if (Math.random() < runChance) {
            this.ui.setMessage('Got away safely!', () => {
                this.endBattle('run');
            });
        } else {
            this.ui.setMessage("Can't escape!", () => {
                // Opponent gets free turn
                this.selectOpponentAction();
                this.executeOpponentTurn(() => {
                    if (this.playerPokemon.isFainted()) {
                        this.handlePlayerFainted();
                    } else {
                        this.phase = BATTLE_PHASE.PLAYER_TURN;
                        this.ui.state = BATTLE_UI_STATE.ACTION_SELECT;
                    }
                });
            });
        }
    }
    
    /**
     * Update battle state
     * @param {number} deltaTime - Time since last update
     * @param {Object} keys - Current input state
     */
    update(deltaTime, keys) {
        if (!this.isActive) return;
        
        this.ui.update(deltaTime);
        
        // Handle input (with debounce)
        const newKeys = {};
        for (const key in keys) {
            if (keys[key] && !this.lastKeys[key]) {
                newKeys[key] = true;
            }
        }
        this.lastKeys = { ...keys };
        
        const action = this.ui.handleInput(newKeys);
        
        if (action) {
            switch (action.type) {
                case 'action':
                    this.processPlayerAction(action.action);
                    break;
                case 'move':
                    this.processPlayerMove(action.moveIndex);
                    break;
                case 'switch':
                    this.processSwitch(action.pokemonIndex);
                    break;
                case 'battle_end':
                    this.isActive = false;
                    if (this.onBattleEnd) {
                        this.onBattleEnd({ 
                            result: this.phase === BATTLE_PHASE.VICTORY ? 'victory' : 'defeat',
                            rewards: this.rewards 
                        });
                    }
                    break;
            }
        }
    }
    
    /**
     * Render battle scene
     */
    render() {
        if (!this.isActive) return;
        
        this.ui.render({
            playerPokemon: this.playerPokemon,
            opponentPokemon: this.opponentPokemon,
            isTrainerBattle: this.isTrainerBattle,
            trainerName: this.trainerName,
            party: this.party,
            rewards: this.rewards
        });
    }
}
