/**
 * UIManager - Centralized UI handling with 16-bit style rendering
 * Inspired by DevilutionX's retro pixel art UI
 */

/**
 * UI color palette - 16-bit style colors
 */
export const UI_COLORS = {
    // Primary colors
    background: '#1a1a2e',
    backgroundLight: '#16213e',
    panel: '#0f3460',
    panelLight: '#1a4d7c',
    
    // Text colors
    textPrimary: '#e8e8e8',
    textSecondary: '#b0b0b0',
    textHighlight: '#ffd93d',
    textDanger: '#ff6b6b',
    textSuccess: '#6bcb77',
    textMana: '#4d96ff',
    
    // HP bar colors
    hpFull: '#6bcb77',
    hpMedium: '#ffd93d',
    hpLow: '#ff6b6b',
    hpEmpty: '#3d3d3d',
    
    // Experience bar
    expBar: '#4d96ff',
    expBackground: '#1a1a2e',
    
    // Border colors
    borderDark: '#0a0a0a',
    borderLight: '#3d3d3d',
    borderHighlight: '#ffd93d',
    
    // Button colors
    buttonNormal: '#0f3460',
    buttonHover: '#1a4d7c',
    buttonPressed: '#0a2540',
    buttonDisabled: '#2d2d2d'
};

/**
 * UI font sizes
 */
export const FONT_SIZES = {
    tiny: 6,
    small: 8,
    medium: 10,
    large: 12,
    title: 16
};

/**
 * UIManager class - Manages all UI rendering
 */
export class UIManager {
    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Object} config 
     */
    constructor(ctx, config) {
        this.ctx = ctx;
        this.config = config;
        this.activeUI = null;
        this.messageQueue = [];
        this.currentMessage = null;
        this.messageTimer = 0;
    }

    /**
     * Draw a panel with 16-bit style border
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {Object} options 
     */
    drawPanel(x, y, width, height, options = {}) {
        const {
            backgroundColor = UI_COLORS.panel,
            borderColor = UI_COLORS.borderLight,
            borderWidth = 2,
            cornerSize = 4
        } = options;

        // Draw background
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(x, y, width, height);

        // Draw 16-bit style border (outer dark, inner light)
        this.ctx.strokeStyle = UI_COLORS.borderDark;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);

        this.ctx.strokeStyle = borderColor;
        this.ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);

        // Draw corner accents
        this.ctx.fillStyle = UI_COLORS.borderHighlight;
        // Top-left
        this.ctx.fillRect(x + 2, y + 2, cornerSize, 1);
        this.ctx.fillRect(x + 2, y + 2, 1, cornerSize);
        // Bottom-right (shadow)
        this.ctx.fillStyle = UI_COLORS.borderDark;
        this.ctx.fillRect(x + width - cornerSize - 2, y + height - 3, cornerSize, 1);
        this.ctx.fillRect(x + width - 3, y + height - cornerSize - 2, 1, cornerSize);
    }

    /**
     * Draw text with shadow (16-bit style)
     * @param {string} text 
     * @param {number} x 
     * @param {number} y 
     * @param {Object} options 
     */
    drawText(text, x, y, options = {}) {
        const {
            color = UI_COLORS.textPrimary,
            fontSize = FONT_SIZES.medium,
            shadow = true,
            align = 'left',
            shadowColor = UI_COLORS.borderDark
        } = options;

        this.ctx.font = `${fontSize}px monospace`;
        this.ctx.textAlign = align;

        // Draw shadow
        if (shadow) {
            this.ctx.fillStyle = shadowColor;
            this.ctx.fillText(text, x + 1, y + 1);
        }

        // Draw text
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);

        this.ctx.textAlign = 'left'; // Reset
    }

    /**
     * Draw an HP bar
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {number} current 
     * @param {number} max 
     */
    drawHPBar(x, y, width, height, current, max) {
        const percent = Math.max(0, Math.min(1, current / max));
        
        // Determine color based on HP percentage
        let color;
        if (percent > 0.5) {
            color = UI_COLORS.hpFull;
        } else if (percent > 0.2) {
            color = UI_COLORS.hpMedium;
        } else {
            color = UI_COLORS.hpLow;
        }

        // Background
        this.ctx.fillStyle = UI_COLORS.hpEmpty;
        this.ctx.fillRect(x, y, width, height);

        // Fill
        if (percent > 0) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, Math.floor(width * percent), height);
        }

        // Border
        this.ctx.strokeStyle = UI_COLORS.borderDark;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
    }

    /**
     * Draw an experience bar
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {number} current 
     * @param {number} needed 
     */
    drawExpBar(x, y, width, height, current, needed) {
        const percent = needed > 0 ? Math.min(1, current / needed) : 1;

        // Background
        this.ctx.fillStyle = UI_COLORS.expBackground;
        this.ctx.fillRect(x, y, width, height);

        // Fill
        if (percent > 0) {
            this.ctx.fillStyle = UI_COLORS.expBar;
            this.ctx.fillRect(x, y, Math.floor(width * percent), height);
        }

        // Border
        this.ctx.strokeStyle = UI_COLORS.borderDark;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
    }

    /**
     * Draw a button
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {string} text 
     * @param {Object} options 
     */
    drawButton(x, y, width, height, text, options = {}) {
        const {
            selected = false,
            disabled = false,
            hovered = false
        } = options;

        let bgColor;
        if (disabled) {
            bgColor = UI_COLORS.buttonDisabled;
        } else if (selected) {
            bgColor = UI_COLORS.buttonPressed;
        } else if (hovered) {
            bgColor = UI_COLORS.buttonHover;
        } else {
            bgColor = UI_COLORS.buttonNormal;
        }

        // Draw button background
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(x, y, width, height);

        // Draw button border
        const borderColor = selected ? UI_COLORS.borderHighlight : UI_COLORS.borderLight;
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);

        // Draw 3D effect
        if (!disabled) {
            // Highlight (top-left)
            this.ctx.fillStyle = UI_COLORS.panelLight;
            this.ctx.fillRect(x + 1, y + 1, width - 2, 1);
            this.ctx.fillRect(x + 1, y + 1, 1, height - 2);

            // Shadow (bottom-right)
            this.ctx.fillStyle = UI_COLORS.borderDark;
            this.ctx.fillRect(x + 1, y + height - 2, width - 2, 1);
            this.ctx.fillRect(x + width - 2, y + 1, 1, height - 2);
        }

        // Draw text
        const textColor = disabled ? UI_COLORS.textSecondary : 
                         (selected ? UI_COLORS.textHighlight : UI_COLORS.textPrimary);
        this.drawText(text, x + width / 2, y + height / 2 + 3, {
            color: textColor,
            fontSize: FONT_SIZES.small,
            align: 'center'
        });
    }

    /**
     * Draw a selection cursor (bouncing arrow)
     * @param {number} x 
     * @param {number} y 
     * @param {number} time - Animation time
     */
    drawCursor(x, y, time = 0) {
        const bounce = Math.sin(time * 0.005) * 2;
        
        this.ctx.fillStyle = UI_COLORS.textHighlight;
        // Simple triangle cursor
        this.ctx.beginPath();
        this.ctx.moveTo(x + bounce, y);
        this.ctx.lineTo(x + 6 + bounce, y + 4);
        this.ctx.lineTo(x + bounce, y + 8);
        this.ctx.closePath();
        this.ctx.fill();
    }

    /**
     * Draw a message box at bottom of screen
     * @param {string} message 
     */
    drawMessageBox(message) {
        const boxHeight = 40;
        const y = this.config.CANVAS_HEIGHT - boxHeight - 8;
        
        this.drawPanel(8, y, this.config.CANVAS_WIDTH - 16, boxHeight);
        
        this.drawText(message, 16, y + 24, {
            color: UI_COLORS.textPrimary,
            fontSize: FONT_SIZES.medium
        });
    }

    /**
     * Queue a message for display
     * @param {string} message 
     * @param {number} duration - Duration in ms
     */
    queueMessage(message, duration = 2000) {
        this.messageQueue.push({ message, duration });
    }

    /**
     * Update message display
     * @param {number} deltaTime 
     */
    updateMessages(deltaTime) {
        if (this.currentMessage) {
            this.messageTimer -= deltaTime;
            if (this.messageTimer <= 0) {
                this.currentMessage = null;
            }
        }

        if (!this.currentMessage && this.messageQueue.length > 0) {
            const next = this.messageQueue.shift();
            this.currentMessage = next.message;
            this.messageTimer = next.duration;
        }
    }

    /**
     * Render active messages
     */
    renderMessages() {
        if (this.currentMessage) {
            this.drawMessageBox(this.currentMessage);
        }
    }

    /**
     * Draw a Pokemon mini sprite (placeholder rectangle)
     * @param {number} x 
     * @param {number} y 
     * @param {string} type - Pokemon type for color
     * @param {boolean} fainted 
     */
    drawPokemonMini(x, y, type, fainted = false) {
        const size = 16;
        
        // Type-based colors (simplified)
        const typeColors = {
            fire: '#ff6b35',
            water: '#4d96ff',
            grass: '#6bcb77',
            electric: '#ffd93d',
            normal: '#b0b0b0',
            fighting: '#ff6b6b',
            poison: '#9b59b6',
            ground: '#cd853f',
            flying: '#87ceeb',
            psychic: '#ff69b4',
            bug: '#90ee90',
            rock: '#8b8989',
            ghost: '#663399',
            dragon: '#4169e1',
            dark: '#4a4a4a',
            steel: '#b0c4de',
            fairy: '#ffb6c1',
            ice: '#87cefa'
        };

        let color = typeColors[type] || typeColors.normal;
        
        if (fainted) {
            color = '#3d3d3d';
        }

        // Draw sprite placeholder
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, size, size);
        
        // Draw eyes (if not fainted)
        if (!fainted) {
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(x + 4, y + 4, 2, 2);
            this.ctx.fillRect(x + 10, y + 4, 2, 2);
        }

        // Border
        this.ctx.strokeStyle = UI_COLORS.borderDark;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, size, size);
    }

    /**
     * Draw a dialog box with multiple lines
     * @param {string[]} lines 
     * @param {Object} options 
     */
    drawDialogBox(lines, options = {}) {
        const {
            x = 8,
            y = this.config.CANVAS_HEIGHT - 60,
            width = this.config.CANVAS_WIDTH - 16,
            height = 52,
            title = null
        } = options;

        this.drawPanel(x, y, width, height);

        if (title) {
            this.drawText(title, x + 8, y + 10, {
                color: UI_COLORS.textHighlight,
                fontSize: FONT_SIZES.small
            });
        }

        const startY = title ? y + 22 : y + 12;
        for (let i = 0; i < lines.length; i++) {
            this.drawText(lines[i], x + 8, startY + i * 12, {
                fontSize: FONT_SIZES.small
            });
        }
    }

    /**
     * Draw a menu with selectable options
     * @param {string[]} options 
     * @param {number} selectedIndex 
     * @param {Object} menuOptions 
     */
    drawMenu(options, selectedIndex, menuOptions = {}) {
        const {
            x = 8,
            y = 8,
            width = 80,
            itemHeight = 16,
            title = null
        } = menuOptions;

        const totalHeight = options.length * itemHeight + (title ? 18 : 8);
        this.drawPanel(x, y, width, totalHeight);

        let startY = y + 8;
        if (title) {
            this.drawText(title, x + 4, startY, {
                color: UI_COLORS.textHighlight,
                fontSize: FONT_SIZES.small
            });
            startY += 14;
        }

        for (let i = 0; i < options.length; i++) {
            const isSelected = i === selectedIndex;
            const itemY = startY + i * itemHeight;

            if (isSelected) {
                this.ctx.fillStyle = UI_COLORS.panelLight;
                this.ctx.fillRect(x + 2, itemY - 2, width - 4, itemHeight);
                this.drawCursor(x + 4, itemY, Date.now());
            }

            this.drawText(options[i], x + 14, itemY + 8, {
                color: isSelected ? UI_COLORS.textHighlight : UI_COLORS.textPrimary,
                fontSize: FONT_SIZES.small
            });
        }
    }
}
