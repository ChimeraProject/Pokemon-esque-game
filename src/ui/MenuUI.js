/**
 * MenuUI - In-game menu system with 16-bit style
 * Inspired by DevilutionX's retro interface
 */

import { UIManager, UI_COLORS, FONT_SIZES } from './UIManager.js';

/**
 * Menu states
 */
export const MENU_STATE = {
    CLOSED: 'closed',
    MAIN: 'main',
    POKEMON: 'pokemon',
    BAG: 'bag',
    SAVE: 'save',
    OPTIONS: 'options'
};

/**
 * MenuUI class - Handles pause menu and submenus
 */
export class MenuUI extends UIManager {
    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Object} config 
     */
    constructor(ctx, config) {
        super(ctx, config);
        
        this.state = MENU_STATE.CLOSED;
        this.selectedIndex = 0;
        this.animationTime = 0;
        
        // Menu items
        this.mainMenuItems = [
            { id: 'pokemon', label: 'POKéMON' },
            { id: 'bag', label: 'BAG' },
            { id: 'save', label: 'SAVE' },
            { id: 'options', label: 'OPTIONS' },
            { id: 'close', label: 'CLOSE' }
        ];
    }

    /**
     * Open the menu
     */
    open() {
        this.state = MENU_STATE.MAIN;
        this.selectedIndex = 0;
    }

    /**
     * Close the menu
     */
    close() {
        this.state = MENU_STATE.CLOSED;
    }

    /**
     * Check if menu is open
     * @returns {boolean}
     */
    isOpen() {
        return this.state !== MENU_STATE.CLOSED;
    }

    /**
     * Update menu
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        this.animationTime += deltaTime;
        this.updateMessages(deltaTime);
    }

    /**
     * Handle menu input
     * @param {Object} keys 
     * @returns {Object|null} - Action result
     */
    handleInput(keys) {
        if (!this.isOpen()) {
            // Check for menu open key
            if (keys['Escape'] || keys['Enter'] || keys['x']) {
                this.open();
                return { type: 'menu_opened' };
            }
            return null;
        }

        switch (this.state) {
            case MENU_STATE.MAIN:
                return this.handleMainMenuInput(keys);
            case MENU_STATE.POKEMON:
                return this.handlePokemonMenuInput(keys);
            case MENU_STATE.SAVE:
                return this.handleSaveMenuInput(keys);
            default:
                return null;
        }
    }

    /**
     * Handle main menu input
     */
    handleMainMenuInput(keys) {
        // Navigation
        if (keys['ArrowUp'] || keys['w']) {
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        }
        if (keys['ArrowDown'] || keys['s']) {
            this.selectedIndex = Math.min(this.mainMenuItems.length - 1, this.selectedIndex + 1);
        }

        // Selection
        if (keys['Enter'] || keys['z'] || keys[' ']) {
            const item = this.mainMenuItems[this.selectedIndex];
            return this.selectMainMenuItem(item.id);
        }

        // Close
        if (keys['Escape'] || keys['x']) {
            this.close();
            return { type: 'menu_closed' };
        }

        return null;
    }

    /**
     * Select a main menu item
     * @param {string} itemId 
     */
    selectMainMenuItem(itemId) {
        switch (itemId) {
            case 'pokemon':
                this.state = MENU_STATE.POKEMON;
                this.selectedIndex = 0;
                return { type: 'submenu', menu: 'pokemon' };
                
            case 'bag':
                this.state = MENU_STATE.BAG;
                this.selectedIndex = 0;
                return { type: 'submenu', menu: 'bag' };
                
            case 'save':
                this.state = MENU_STATE.SAVE;
                return { type: 'submenu', menu: 'save' };
                
            case 'options':
                this.state = MENU_STATE.OPTIONS;
                return { type: 'submenu', menu: 'options' };
                
            case 'close':
                this.close();
                return { type: 'menu_closed' };
                
            default:
                return null;
        }
    }

    /**
     * Handle Pokemon menu input
     */
    handlePokemonMenuInput(keys) {
        if (keys['Escape'] || keys['x']) {
            this.state = MENU_STATE.MAIN;
            this.selectedIndex = 0;
            return { type: 'back' };
        }
        return null;
    }

    /**
     * Handle save menu input
     */
    handleSaveMenuInput(keys) {
        if (keys['Enter'] || keys['z'] || keys[' ']) {
            return { type: 'save_game' };
        }
        if (keys['Escape'] || keys['x']) {
            this.state = MENU_STATE.MAIN;
            this.selectedIndex = 3; // Options position
            return { type: 'back' };
        }
        return null;
    }

    /**
     * Render the menu
     * @param {Object} gameState - Current game state for displaying info
     */
    render(gameState = {}) {
        if (!this.isOpen()) return;

        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.config.CANVAS_WIDTH, this.config.CANVAS_HEIGHT);

        switch (this.state) {
            case MENU_STATE.MAIN:
                this.renderMainMenu(gameState);
                break;
            case MENU_STATE.POKEMON:
                this.renderPokemonMenu(gameState);
                break;
            case MENU_STATE.BAG:
                this.renderBagMenu(gameState);
                break;
            case MENU_STATE.SAVE:
                this.renderSaveMenu(gameState);
                break;
            case MENU_STATE.OPTIONS:
                this.renderOptionsMenu(gameState);
                break;
        }

        this.renderMessages();
    }

    /**
     * Render main menu
     */
    renderMainMenu(gameState) {
        const menuWidth = 80;
        const menuHeight = this.mainMenuItems.length * 16 + 12;
        const menuX = this.config.CANVAS_WIDTH - menuWidth - 8;
        const menuY = 8;

        // Draw panel
        this.drawPanel(menuX, menuY, menuWidth, menuHeight);

        // Draw items
        for (let i = 0; i < this.mainMenuItems.length; i++) {
            const item = this.mainMenuItems[i];
            const y = menuY + 10 + i * 16;
            const isSelected = i === this.selectedIndex;

            if (isSelected) {
                this.ctx.fillStyle = UI_COLORS.panelLight;
                this.ctx.fillRect(menuX + 2, y - 4, menuWidth - 4, 14);
                this.drawCursor(menuX + 4, y - 2, this.animationTime);
            }

            this.drawText(item.label, menuX + 14, y + 6, {
                fontSize: FONT_SIZES.small,
                color: isSelected ? UI_COLORS.textHighlight : UI_COLORS.textPrimary
            });
        }

        // Player info panel
        if (gameState.playerName || gameState.money !== undefined) {
            const infoWidth = 80;
            const infoX = menuX;
            const infoY = menuY + menuHeight + 8;

            this.drawPanel(infoX, infoY, infoWidth, 36);

            if (gameState.playerName) {
                this.drawText(gameState.playerName, infoX + 4, infoY + 12, {
                    fontSize: FONT_SIZES.small,
                    color: UI_COLORS.textHighlight
                });
            }

            if (gameState.money !== undefined) {
                this.drawText(`₽${gameState.money}`, infoX + 4, infoY + 26, {
                    fontSize: FONT_SIZES.small
                });
            }
        }
    }

    /**
     * Render Pokemon submenu
     */
    renderPokemonMenu(gameState) {
        const party = gameState.party;
        
        this.drawPanel(8, 8, this.config.CANVAS_WIDTH - 16, this.config.CANVAS_HEIGHT - 16);
        
        this.drawText('POKéMON', 16, 22, {
            fontSize: FONT_SIZES.medium,
            color: UI_COLORS.textHighlight
        });

        if (!party || party.isEmpty()) {
            this.drawText('No Pokémon in party!', 16, 50, {
                color: UI_COLORS.textSecondary
            });
        } else {
            const summary = party.getSummary();
            for (let i = 0; i < summary.length; i++) {
                const p = summary[i];
                const y = 36 + i * 20;

                // Mini sprite placeholder
                this.drawPokemonMini(16, y, p.species || 'normal', p.isFainted);

                // Name and level
                this.drawText(p.nickname, 36, y + 10, {
                    fontSize: FONT_SIZES.small,
                    color: p.isFainted ? UI_COLORS.textSecondary : UI_COLORS.textPrimary
                });

                this.drawText(`Lv${p.level}`, 100, y + 10, {
                    fontSize: FONT_SIZES.tiny,
                    color: UI_COLORS.textSecondary
                });

                // HP bar
                this.drawHPBar(130, y + 4, 60, 6, p.currentHp, p.maxHp);

                // HP numbers
                this.drawText(`${p.currentHp}/${p.maxHp}`, 195, y + 10, {
                    fontSize: FONT_SIZES.tiny,
                    color: UI_COLORS.textSecondary
                });
            }
        }

        this.drawText('Press X to go back', 16, this.config.CANVAS_HEIGHT - 20, {
            fontSize: FONT_SIZES.tiny,
            color: UI_COLORS.textSecondary
        });
    }

    /**
     * Render bag submenu
     */
    renderBagMenu(gameState) {
        this.drawPanel(8, 8, this.config.CANVAS_WIDTH - 16, this.config.CANVAS_HEIGHT - 16);
        
        this.drawText('BAG', 16, 22, {
            fontSize: FONT_SIZES.medium,
            color: UI_COLORS.textHighlight
        });

        this.drawText('Bag system coming soon!', 16, 50);

        this.drawText('Press X to go back', 16, this.config.CANVAS_HEIGHT - 20, {
            fontSize: FONT_SIZES.tiny,
            color: UI_COLORS.textSecondary
        });
    }

    /**
     * Render save submenu
     */
    renderSaveMenu(gameState) {
        this.drawPanel(40, 40, this.config.CANVAS_WIDTH - 80, 60);
        
        this.drawText('Save the game?', this.config.CANVAS_WIDTH / 2, 60, {
            fontSize: FONT_SIZES.medium,
            color: UI_COLORS.textHighlight,
            align: 'center'
        });

        this.drawText('Press Z to save, X to cancel', this.config.CANVAS_WIDTH / 2, 85, {
            fontSize: FONT_SIZES.small,
            align: 'center'
        });
    }

    /**
     * Render options submenu
     */
    renderOptionsMenu(gameState) {
        this.drawPanel(8, 8, this.config.CANVAS_WIDTH - 16, this.config.CANVAS_HEIGHT - 16);
        
        this.drawText('OPTIONS', 16, 22, {
            fontSize: FONT_SIZES.medium,
            color: UI_COLORS.textHighlight
        });

        this.drawText('Options coming soon!', 16, 50);

        this.drawText('Press X to go back', 16, this.config.CANVAS_HEIGHT - 20, {
            fontSize: FONT_SIZES.tiny,
            color: UI_COLORS.textSecondary
        });
    }
}
