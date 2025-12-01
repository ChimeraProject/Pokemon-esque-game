/**
 * PerformanceMonitor - FPS tracking and performance metrics
 * Inspired by VVVVVV's HTML5 optimization approach
 */

// Performance display colors
const PERF_COLORS = {
    GOOD: '#0F0',     // Green - good FPS
    WARNING: '#FF0',  // Yellow - acceptable FPS
    BAD: '#F00',      // Red - poor FPS
    TEXT: '#FFF'      // White - general text
};

/**
 * PerformanceMonitor class - Tracks game performance
 */
export class PerformanceMonitor {
    /**
     * @param {Object} options 
     */
    constructor(options = {}) {
        const {
            sampleSize = 60,    // Number of frames to average
            targetFPS = 60,     // Target frame rate
            showDisplay = false // Whether to render debug display
        } = options;

        this.sampleSize = sampleSize;
        this.targetFPS = targetFPS;
        this.showDisplay = showDisplay;

        // Frame time tracking
        this.frameTimes = [];
        this.lastFrameTime = performance.now();
        this.deltaTime = 0;

        // Performance metrics
        this.fps = 0;
        this.avgFrameTime = 0;
        this.minFrameTime = Infinity;
        this.maxFrameTime = 0;

        // Memory tracking (if available)
        this.memoryUsage = 0;
        this.hasMemoryAPI = !!(performance && performance.memory);

        // Update tracking
        this.updateTime = 0;
        this.renderTime = 0;

        // Warning thresholds
        this.fpsWarningThreshold = 30;
        this.frameTimeWarningThreshold = 50; // ms

        // History for graphs
        this.fpsHistory = [];
        this.maxHistoryLength = 120;

        // Callbacks
        this.onPerformanceWarning = null;
    }

    /**
     * Call at the start of each frame
     */
    beginFrame() {
        const now = performance.now();
        this.deltaTime = now - this.lastFrameTime;
        this.lastFrameTime = now;

        // Track frame times
        this.frameTimes.push(this.deltaTime);
        if (this.frameTimes.length > this.sampleSize) {
            this.frameTimes.shift();
        }

        // Update metrics
        this.calculateMetrics();
    }

    /**
     * Mark the start of update phase
     */
    beginUpdate() {
        this._updateStart = performance.now();
    }

    /**
     * Mark the end of update phase
     */
    endUpdate() {
        if (this._updateStart) {
            this.updateTime = performance.now() - this._updateStart;
        }
    }

    /**
     * Mark the start of render phase
     */
    beginRender() {
        this._renderStart = performance.now();
    }

    /**
     * Mark the end of render phase
     */
    endRender() {
        if (this._renderStart) {
            this.renderTime = performance.now() - this._renderStart;
        }
    }

    /**
     * Calculate performance metrics
     */
    calculateMetrics() {
        if (this.frameTimes.length === 0) return;

        // Average frame time
        const sum = this.frameTimes.reduce((a, b) => a + b, 0);
        this.avgFrameTime = sum / this.frameTimes.length;

        // FPS from average frame time
        this.fps = Math.round(1000 / this.avgFrameTime);

        // Min/Max
        this.minFrameTime = Math.min(...this.frameTimes);
        this.maxFrameTime = Math.max(...this.frameTimes);

        // Update history
        this.fpsHistory.push(this.fps);
        if (this.fpsHistory.length > this.maxHistoryLength) {
            this.fpsHistory.shift();
        }

        // Memory usage
        if (this.hasMemoryAPI) {
            this.memoryUsage = performance.memory.usedJSHeapSize / (1024 * 1024);
        }

        // Check for performance issues
        this.checkPerformance();
    }

    /**
     * Check for performance warnings
     */
    checkPerformance() {
        const warnings = [];

        if (this.fps < this.fpsWarningThreshold) {
            warnings.push(`Low FPS: ${this.fps}`);
        }

        if (this.maxFrameTime > this.frameTimeWarningThreshold) {
            warnings.push(`Frame spike: ${this.maxFrameTime.toFixed(1)}ms`);
        }

        if (warnings.length > 0 && this.onPerformanceWarning) {
            this.onPerformanceWarning(warnings);
        }
    }

    /**
     * Get current delta time in seconds
     * @returns {number}
     */
    getDeltaSeconds() {
        return this.deltaTime / 1000;
    }

    /**
     * Get current delta time in milliseconds
     * @returns {number}
     */
    getDeltaMs() {
        return this.deltaTime;
    }

    /**
     * Get time budget remaining for current frame (ms)
     * @returns {number}
     */
    getRemainingBudget() {
        const targetFrameTime = 1000 / this.targetFPS;
        const elapsed = performance.now() - this.lastFrameTime;
        return Math.max(0, targetFrameTime - elapsed);
    }

    /**
     * Get a performance summary
     * @returns {Object}
     */
    getSummary() {
        return {
            fps: this.fps,
            avgFrameTime: this.avgFrameTime.toFixed(2),
            minFrameTime: this.minFrameTime.toFixed(2),
            maxFrameTime: this.maxFrameTime.toFixed(2),
            updateTime: this.updateTime.toFixed(2),
            renderTime: this.renderTime.toFixed(2),
            memoryMB: this.hasMemoryAPI ? this.memoryUsage.toFixed(1) : 'N/A'
        };
    }

    /**
     * Render debug display
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     */
    render(ctx, x = 4, y = 4) {
        if (!this.showDisplay) return;

        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x, y, 80, 60);

        // FPS text with color based on performance
        ctx.fillStyle = this.fps >= this.targetFPS ? PERF_COLORS.GOOD : 
                       (this.fps >= this.fpsWarningThreshold ? PERF_COLORS.WARNING : PERF_COLORS.BAD);
        ctx.font = '10px monospace';
        ctx.fillText(`FPS: ${this.fps}`, x + 4, y + 12);

        ctx.fillStyle = PERF_COLORS.TEXT;
        ctx.fillText(`Frame: ${this.avgFrameTime.toFixed(1)}ms`, x + 4, y + 24);
        ctx.fillText(`Update: ${this.updateTime.toFixed(1)}ms`, x + 4, y + 36);
        ctx.fillText(`Render: ${this.renderTime.toFixed(1)}ms`, x + 4, y + 48);

        if (this.hasMemoryAPI) {
            ctx.fillText(`Mem: ${this.memoryUsage.toFixed(0)}MB`, x + 4, y + 60);
        }
    }

    /**
     * Render FPS graph
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     */
    renderGraph(ctx, x, y, width, height) {
        if (this.fpsHistory.length < 2) return;

        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(x, y, width, height);

        // Target line
        const targetY = y + height - (this.targetFPS / 120) * height;
        ctx.strokeStyle = '#0F0';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(x, targetY);
        ctx.lineTo(x + width, targetY);
        ctx.stroke();
        ctx.setLineDash([]);

        // FPS line
        ctx.strokeStyle = '#FF0';
        ctx.lineWidth = 1;
        ctx.beginPath();

        for (let i = 0; i < this.fpsHistory.length; i++) {
            const px = x + (i / this.fpsHistory.length) * width;
            const py = y + height - (this.fpsHistory[i] / 120) * height;
            
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }

        ctx.stroke();
    }

    /**
     * Toggle debug display
     */
    toggle() {
        this.showDisplay = !this.showDisplay;
    }

    /**
     * Reset all metrics
     */
    reset() {
        this.frameTimes = [];
        this.fpsHistory = [];
        this.fps = 0;
        this.avgFrameTime = 0;
        this.minFrameTime = Infinity;
        this.maxFrameTime = 0;
    }
}
