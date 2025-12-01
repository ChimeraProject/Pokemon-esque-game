/**
 * BattleUI - Battle interface with 16-bit style rendering
 * Inspired by DevilutionX and classic Pokemon UI
 */

import { UIManager, UI_COLORS, FONT_SIZES } from './UIManager.js';
import { STATUS } from '../battles/Pokemon.js';

/**
 * Battle UI states
 */
export const BATTLE_UI_STATE = {
    INTRO: 'intro',
    ACTION_SELECT: 'action_select',
    MOVE_SELECT: 'move_select',
    POKEMON_SELECT: 'pokemon_select',
    ITEM_SELECT: 'item_select',
    EXECUTING: 'executing',
    MESSAGE: 'message',
    VICTORY: 'victory',
    DEFEAT: 'defeat'
};

/**
 * BattleUI class - Handles all battle screen rendering
 */
export class BattleUI extends UIManager {
    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Object} config 
     */
    constructor(ctx, config) {
        super(ctx, config);
        
        this.state = BATTLE_UI_STATE.INTRO;
        this.selectedAction = 0;
        this.selectedMove = 0;
        this.selectedPokemon = 0;
        
        this.animationTime = 0;
        this.battleMessage = '';
        this.messageCallback = null;
    }

    /**
     * Update battle UI
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        this.animationTime += deltaTime;
        this.updateMessages(deltaTime);
    }

    /**
     * Render the complete battle scene
     * @param {Object} battleState - Current battle state
     */
    render(battleState) {
        const { playerPokemon, opponentPokemon, isTrainerBattle, trainerName } = battleState;

        // Draw battle background
        this.drawBattleBackground();

        // Draw Pokemon
        this.drawBattlePokemon(playerPokemon, false);
        this.drawBattlePokemon(opponentPokemon, true);

        // Draw info boxes
        this.drawPokemonInfoBox(playerPokemon, false);
        this.drawPokemonInfoBox(opponentPokemon, true);

        // Draw current UI based on state
        switch (this.state) {
            case BATTLE_UI_STATE.ACTION_SELECT:
                this.drawActionMenu(battleState);
                break;
            case BATTLE_UI_STATE.MOVE_SELECT:
                this.drawMoveMenu(playerPokemon);
                break;
            case BATTLE_UI_STATE.POKEMON_SELECT:
                this.drawPokemonSelectMenu(battleState.party);
                break;
            case BATTLE_UI_STATE.MESSAGE:
            case BATTLE_UI_STATE.EXECUTING:
                this.drawBattleMessage();
                break;
            case BATTLE_UI_STATE.VICTORY:
                this.drawVictoryScreen(battleState);
                break;
            case BATTLE_UI_STATE.DEFEAT:
                this.drawDefeatScreen();
                break;
        }

        // Always render queued messages on top
        this.renderMessages();
    }

    /**
     * Draw the battle arena background
     */
    drawBattleBackground() {
        // Gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.config.CANVAS_HEIGHT);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(0.6, '#98FB98'); // Pale green
        gradient.addColorStop(1, '#228B22'); // Forest green

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.config.CANVAS_WIDTH, this.config.CANVAS_HEIGHT);

        // Draw battle platform for opponent
        this.ctx.fillStyle = '#556B2F';
        this.ctx.beginPath();
        this.ctx.ellipse(180, 55, 40, 12, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#2F4F2F';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw battle platform for player
        this.ctx.fillStyle = '#556B2F';
        this.ctx.beginPath();
        this.ctx.ellipse(55, 95, 45, 14, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#2F4F2F';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    /**
     * Draw a Pokemon sprite (placeholder)
     * @param {Object} pokemon 
     * @param {boolean} isOpponent 
     */
    drawBattlePokemon(pokemon, isOpponent) {
        if (!pokemon) return;

        const x = isOpponent ? 160 : 35;
        const y = isOpponent ? 20 : 55;
        const size = isOpponent ? 36 : 44;

        // Use type for color
        const primaryType = pokemon.species.types[0] || 'normal';
        const typeColors = {
            fire: '#ff6b35',
            water: '#4d96ff',
            grass: '#6bcb77',
            electric: '#ffd93d',
            normal: '#b0b0b0',
            fighting: '#c03028',
            poison: '#a040a0',
            ground: '#e0c068',
            flying: '#a890f0',
            psychic: '#f85888',
            bug: '#a8b820',
            rock: '#b8a038',
            ghost: '#705898',
            dragon: '#7038f8',
            dark: '#705848',
            steel: '#b8b8d0',
            fairy: '#ee99ac',
            ice: '#98d8d8'
        };

        const color = typeColors[primaryType] || typeColors.normal;

        // Draw Pokemon body (simple shape)
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.ellipse(x + size / 2, y + size / 2, size / 2, size / 2 - 4, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw outline
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw eyes
        if (!pokemon.isFainted()) {
            const eyeOffset = isOpponent ? -1 : 1;
            this.ctx.fillStyle = '#FFF';
            this.ctx.beginPath();
            this.ctx.arc(x + size / 3 + eyeOffset * 2, y + size / 3, 4, 0, Math.PI * 2);
            this.ctx.arc(x + 2 * size / 3 + eyeOffset * 2, y + size / 3, 4, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#000';
            this.ctx.beginPath();
            this.ctx.arc(x + size / 3 + eyeOffset * 4, y + size / 3, 2, 0, Math.PI * 2);
            this.ctx.arc(x + 2 * size / 3 + eyeOffset * 4, y + size / 3, 2, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // X eyes for fainted
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            
            const eyeY = y + size / 3;
            const leftEyeX = x + size / 3;
            const rightEyeX = x + 2 * size / 3;
            
            // Left X
            this.ctx.beginPath();
            this.ctx.moveTo(leftEyeX - 3, eyeY - 3);
            this.ctx.lineTo(leftEyeX + 3, eyeY + 3);
            this.ctx.moveTo(leftEyeX + 3, eyeY - 3);
            this.ctx.lineTo(leftEyeX - 3, eyeY + 3);
            this.ctx.stroke();
            
            // Right X
            this.ctx.beginPath();
            this.ctx.moveTo(rightEyeX - 3, eyeY - 3);
            this.ctx.lineTo(rightEyeX + 3, eyeY + 3);
            this.ctx.moveTo(rightEyeX + 3, eyeY - 3);
            this.ctx.lineTo(rightEyeX - 3, eyeY + 3);
            this.ctx.stroke();
        }

        // Draw name below (for player's Pokemon)
        if (!isOpponent) {
            this.drawText(pokemon.nickname, x + size / 2, y + size + 8, {
                align: 'center',
                fontSize: FONT_SIZES.tiny,
                color: UI_COLORS.textPrimary
            });
        }
    }

    /**
     * Draw Pokemon info box (HP bar, level, status)
     * @param {Object} pokemon 
     * @param {boolean} isOpponent 
     */
    drawPokemonInfoBox(pokemon, isOpponent) {
        if (!pokemon) return;

        const x = isOpponent ? 8 : this.config.CANVAS_WIDTH - 96;
        const y = isOpponent ? 8 : 68;
        const width = 88;
        const height = 32;

        // Draw panel
        this.drawPanel(x, y, width, height);

        // Draw name and level
        this.drawText(pokemon.nickname.substring(0, 8), x + 4, y + 10, {
            fontSize: FONT_SIZES.small,
            color: UI_COLORS.textPrimary
        });

        this.drawText(`Lv${pokemon.level}`, x + width - 24, y + 10, {
            fontSize: FONT_SIZES.tiny,
            color: UI_COLORS.textSecondary
        });

        // Draw HP bar
        this.drawText('HP', x + 4, y + 22, {
            fontSize: FONT_SIZES.tiny,
            color: UI_COLORS.textHighlight
        });
        this.drawHPBar(x + 14, y + 17, width - 20, 6, pokemon.currentHp, pokemon.stats.hp);

        // Draw HP numbers (player only)
        if (!isOpponent) {
            this.drawText(`${pokemon.currentHp}/${pokemon.stats.hp}`, x + width - 4, y + 30, {
                fontSize: FONT_SIZES.tiny,
                color: UI_COLORS.textSecondary,
                align: 'right'
            });
        }

        // Draw status condition
        if (pokemon.status && pokemon.status !== STATUS.NONE) {
            const statusColors = {
                [STATUS.BURN]: '#ff6b35',
                [STATUS.FREEZE]: '#87cefa',
                [STATUS.PARALYSIS]: '#ffd93d',
                [STATUS.POISON]: '#9b59b6',
                [STATUS.BADLY_POISONED]: '#9b59b6',
                [STATUS.SLEEP]: '#808080'
            };

            const statusText = {
                [STATUS.BURN]: 'BRN',
                [STATUS.FREEZE]: 'FRZ',
                [STATUS.PARALYSIS]: 'PAR',
                [STATUS.POISON]: 'PSN',
                [STATUS.BADLY_POISONED]: 'TOX',
                [STATUS.SLEEP]: 'SLP'
            };

            const statusColor = statusColors[pokemon.status] || '#808080';
            const text = statusText[pokemon.status] || '';

            this.ctx.fillStyle = statusColor;
            this.ctx.fillRect(x + 4, y + 26, 18, 8);
            this.drawText(text, x + 5, y + 32, {
                fontSize: FONT_SIZES.tiny,
                color: '#FFF',
                shadow: false
            });
        }
    }

    /**
     * Draw action selection menu
     * @param {Object} battleState 
     */
    drawActionMenu(battleState) {
        const actions = ['FIGHT', 'BAG', 'POKéMON', 'RUN'];
        const disabledActions = battleState.isTrainerBattle ? [3] : []; // Can't run from trainers

        const menuX = this.config.CANVAS_WIDTH - 88;
        const menuY = this.config.CANVAS_HEIGHT - 52;

        this.drawPanel(8, menuY, this.config.CANVAS_WIDTH - 96, 44);
        this.drawText('What will', 16, menuY + 16, { fontSize: FONT_SIZES.medium });
        this.drawText(`${battleState.playerPokemon.nickname} do?`, 16, menuY + 30, { fontSize: FONT_SIZES.medium });

        this.drawPanel(menuX, menuY, 80, 44);

        for (let i = 0; i < 4; i++) {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const x = menuX + 4 + col * 38;
            const y = menuY + 14 + row * 18;

            const isSelected = this.selectedAction === i;
            const isDisabled = disabledActions.includes(i);

            if (isSelected) {
                this.drawCursor(x - 2, y - 4, this.animationTime);
            }

            this.drawText(actions[i], x + 8, y, {
                fontSize: FONT_SIZES.small,
                color: isDisabled ? UI_COLORS.textSecondary : 
                       (isSelected ? UI_COLORS.textHighlight : UI_COLORS.textPrimary)
            });
        }
    }

    /**
     * Draw move selection menu
     * @param {Object} pokemon 
     */
    drawMoveMenu(pokemon) {
        const menuY = this.config.CANVAS_HEIGHT - 52;

        // Move list panel
        this.drawPanel(8, menuY, this.config.CANVAS_WIDTH - 60, 44);

        const moves = pokemon.moves || [];
        for (let i = 0; i < 4; i++) {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const x = 16 + col * 80;
            const y = menuY + 14 + row * 18;

            const isSelected = this.selectedMove === i;
            const move = moves[i];

            if (isSelected) {
                this.drawCursor(x - 6, y - 4, this.animationTime);
            }

            if (move) {
                this.drawText(move.name.substring(0, 10), x, y, {
                    fontSize: FONT_SIZES.small,
                    color: isSelected ? UI_COLORS.textHighlight : UI_COLORS.textPrimary
                });
            } else {
                this.drawText('-', x, y, {
                    fontSize: FONT_SIZES.small,
                    color: UI_COLORS.textSecondary
                });
            }
        }

        // Move info panel
        const selectedMove = moves[this.selectedMove];
        this.drawPanel(this.config.CANVAS_WIDTH - 48, menuY, 40, 44);

        if (selectedMove) {
            this.drawText(selectedMove.type.toUpperCase().substring(0, 6), this.config.CANVAS_WIDTH - 44, menuY + 12, {
                fontSize: FONT_SIZES.tiny,
                color: UI_COLORS.textSecondary
            });
            this.drawText(`PP`, this.config.CANVAS_WIDTH - 44, menuY + 26, {
                fontSize: FONT_SIZES.tiny,
                color: UI_COLORS.textSecondary
            });
            this.drawText(`${selectedMove.pp || '-'}/${selectedMove.maxPp || '-'}`, this.config.CANVAS_WIDTH - 44, menuY + 38, {
                fontSize: FONT_SIZES.tiny
            });
        }
    }

    /**
     * Draw Pokemon selection menu
     * @param {Object} party 
     */
    drawPokemonSelectMenu(party) {
        this.drawPanel(8, 8, this.config.CANVAS_WIDTH - 16, this.config.CANVAS_HEIGHT - 16);
        
        this.drawText('Choose a Pokémon', 16, 22, {
            fontSize: FONT_SIZES.medium,
            color: UI_COLORS.textHighlight
        });

        if (!party || party.isEmpty()) {
            this.drawText('No Pokémon available!', 16, 60, {
                color: UI_COLORS.textSecondary
            });
            return;
        }

        const pokemon = party.getSummary();
        for (let i = 0; i < pokemon.length; i++) {
            const y = 34 + i * 20;
            const p = pokemon[i];
            const isSelected = this.selectedPokemon === i;

            if (isSelected) {
                this.ctx.fillStyle = UI_COLORS.panelLight;
                this.ctx.fillRect(12, y - 2, this.config.CANVAS_WIDTH - 28, 18);
                this.drawCursor(14, y, this.animationTime);
            }

            // Pokemon mini sprite
            this.drawPokemonMini(24, y, p.species, p.isFainted);

            // Name and level
            this.drawText(`${p.nickname}`, 44, y + 10, {
                fontSize: FONT_SIZES.small,
                color: p.isFainted ? UI_COLORS.textSecondary : UI_COLORS.textPrimary
            });
            this.drawText(`Lv${p.level}`, 110, y + 10, {
                fontSize: FONT_SIZES.tiny,
                color: UI_COLORS.textSecondary
            });

            // HP bar
            this.drawHPBar(140, y + 4, 60, 6, p.currentHp, p.maxHp);
        }

        // Instructions
        this.drawText('Press B to cancel', 16, this.config.CANVAS_HEIGHT - 20, {
            fontSize: FONT_SIZES.tiny,
            color: UI_COLORS.textSecondary
        });
    }

    /**
     * Draw battle message
     */
    drawBattleMessage() {
        if (this.battleMessage) {
            this.drawMessageBox(this.battleMessage);
        }
    }

    /**
     * Draw victory screen
     * @param {Object} battleState 
     */
    drawVictoryScreen(battleState) {
        this.drawPanel(20, 40, this.config.CANVAS_WIDTH - 40, 80);

        this.drawText('VICTORY!', this.config.CANVAS_WIDTH / 2, 60, {
            align: 'center',
            fontSize: FONT_SIZES.title,
            color: UI_COLORS.textHighlight
        });

        if (battleState.rewards) {
            if (battleState.rewards.exp) {
                this.drawText(`Gained ${battleState.rewards.exp} EXP`, this.config.CANVAS_WIDTH / 2, 80, {
                    align: 'center',
                    fontSize: FONT_SIZES.small
                });
            }
            if (battleState.rewards.money) {
                this.drawText(`Gained ₽${battleState.rewards.money}`, this.config.CANVAS_WIDTH / 2, 94, {
                    align: 'center',
                    fontSize: FONT_SIZES.small,
                    color: UI_COLORS.textHighlight
                });
            }
        }

        this.drawText('Press A to continue', this.config.CANVAS_WIDTH / 2, 110, {
            align: 'center',
            fontSize: FONT_SIZES.tiny,
            color: UI_COLORS.textSecondary
        });
    }

    /**
     * Draw defeat screen
     */
    drawDefeatScreen() {
        this.drawPanel(20, 40, this.config.CANVAS_WIDTH - 40, 60);

        this.drawText('DEFEAT', this.config.CANVAS_WIDTH / 2, 60, {
            align: 'center',
            fontSize: FONT_SIZES.title,
            color: UI_COLORS.textDanger
        });

        this.drawText('You blacked out...', this.config.CANVAS_WIDTH / 2, 80, {
            align: 'center',
            fontSize: FONT_SIZES.small
        });
    }

    /**
     * Set the current battle message
     * @param {string} message 
     * @param {Function} callback - Called when message is dismissed
     */
    setMessage(message, callback = null) {
        this.battleMessage = message;
        this.messageCallback = callback;
        this.state = BATTLE_UI_STATE.MESSAGE;
    }

    /**
     * Handle input for the battle UI
     * @param {Object} keys 
     * @returns {Object|null} - Action to perform
     */
    handleInput(keys) {
        switch (this.state) {
            case BATTLE_UI_STATE.ACTION_SELECT:
                return this.handleActionInput(keys);
            case BATTLE_UI_STATE.MOVE_SELECT:
                return this.handleMoveInput(keys);
            case BATTLE_UI_STATE.POKEMON_SELECT:
                return this.handlePokemonInput(keys);
            case BATTLE_UI_STATE.MESSAGE:
                return this.handleMessageInput(keys);
            case BATTLE_UI_STATE.VICTORY:
            case BATTLE_UI_STATE.DEFEAT:
                return this.handleEndInput(keys);
            default:
                return null;
        }
    }

    /**
     * Handle action menu input
     */
    handleActionInput(keys) {
        if (keys['ArrowRight'] || keys['d']) {
            this.selectedAction = (this.selectedAction % 2 === 0) ? this.selectedAction + 1 : this.selectedAction;
        }
        if (keys['ArrowLeft'] || keys['a']) {
            this.selectedAction = (this.selectedAction % 2 === 1) ? this.selectedAction - 1 : this.selectedAction;
        }
        if (keys['ArrowDown'] || keys['s']) {
            this.selectedAction = this.selectedAction < 2 ? this.selectedAction + 2 : this.selectedAction;
        }
        if (keys['ArrowUp'] || keys['w']) {
            this.selectedAction = this.selectedAction >= 2 ? this.selectedAction - 2 : this.selectedAction;
        }
        
        if (keys['Enter'] || keys['z'] || keys[' ']) {
            const actions = ['fight', 'bag', 'pokemon', 'run'];
            return { type: 'action', action: actions[this.selectedAction] };
        }
        
        return null;
    }

    /**
     * Handle move menu input
     */
    handleMoveInput(keys) {
        if (keys['ArrowRight'] || keys['d']) {
            this.selectedMove = (this.selectedMove % 2 === 0) ? this.selectedMove + 1 : this.selectedMove;
        }
        if (keys['ArrowLeft'] || keys['a']) {
            this.selectedMove = (this.selectedMove % 2 === 1) ? this.selectedMove - 1 : this.selectedMove;
        }
        if (keys['ArrowDown'] || keys['s']) {
            this.selectedMove = this.selectedMove < 2 ? this.selectedMove + 2 : this.selectedMove;
        }
        if (keys['ArrowUp'] || keys['w']) {
            this.selectedMove = this.selectedMove >= 2 ? this.selectedMove - 2 : this.selectedMove;
        }

        if (keys['Enter'] || keys['z'] || keys[' ']) {
            return { type: 'move', moveIndex: this.selectedMove };
        }

        if (keys['Escape'] || keys['x']) {
            this.state = BATTLE_UI_STATE.ACTION_SELECT;
        }

        return null;
    }

    /**
     * Handle Pokemon selection input
     */
    handlePokemonInput(keys) {
        // Navigation handled externally
        if (keys['Enter'] || keys['z'] || keys[' ']) {
            return { type: 'switch', pokemonIndex: this.selectedPokemon };
        }

        if (keys['Escape'] || keys['x']) {
            this.state = BATTLE_UI_STATE.ACTION_SELECT;
        }

        return null;
    }

    /**
     * Handle message dismissal
     */
    handleMessageInput(keys) {
        if (keys['Enter'] || keys['z'] || keys[' ']) {
            if (this.messageCallback) {
                this.messageCallback();
                this.messageCallback = null;
            }
            this.battleMessage = '';
            return { type: 'message_dismissed' };
        }
        return null;
    }

    /**
     * Handle end screen input
     */
    handleEndInput(keys) {
        if (keys['Enter'] || keys['z'] || keys[' ']) {
            return { type: 'battle_end' };
        }
        return null;
    }

    /**
     * Reset UI state for new battle
     */
    reset() {
        this.state = BATTLE_UI_STATE.INTRO;
        this.selectedAction = 0;
        this.selectedMove = 0;
        this.selectedPokemon = 0;
        this.battleMessage = '';
        this.messageCallback = null;
    }
}
