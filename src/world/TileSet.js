/**
 * TileSet - Defines tile types and their properties for the game world
 * Inspired by classic 16-bit RPG tile systems
 */

export const TILE_TYPES = {
    GRASS: 0,
    PATH: 1,
    TREE: 2,
    WATER: 3,
    TALL_GRASS: 4,  // Encounter zone
    ROCK: 5,
    SAND: 6,
    FLOWER: 7,
    CAVE_FLOOR: 8,
    CAVE_WALL: 9,
    BUILDING: 10,
    DOOR: 11
};

export const TILE_COLORS = {
    [TILE_TYPES.GRASS]: '#90EE90',      // Light green
    [TILE_TYPES.PATH]: '#DEB887',        // Tan
    [TILE_TYPES.TREE]: '#228B22',        // Forest green
    [TILE_TYPES.WATER]: '#4169E1',       // Royal blue
    [TILE_TYPES.TALL_GRASS]: '#32CD32',  // Lime green
    [TILE_TYPES.ROCK]: '#808080',        // Gray
    [TILE_TYPES.SAND]: '#F4A460',        // Sandy brown
    [TILE_TYPES.FLOWER]: '#FFB6C1',      // Light pink
    [TILE_TYPES.CAVE_FLOOR]: '#696969',  // Dim gray
    [TILE_TYPES.CAVE_WALL]: '#2F4F4F',   // Dark slate gray
    [TILE_TYPES.BUILDING]: '#8B4513',    // Saddle brown
    [TILE_TYPES.DOOR]: '#CD853F'         // Peru
};

export const TILE_PROPERTIES = {
    [TILE_TYPES.GRASS]: { walkable: true, encounter: false, name: 'Grass' },
    [TILE_TYPES.PATH]: { walkable: true, encounter: false, name: 'Path' },
    [TILE_TYPES.TREE]: { walkable: false, encounter: false, name: 'Tree' },
    [TILE_TYPES.WATER]: { walkable: false, encounter: false, name: 'Water' },
    [TILE_TYPES.TALL_GRASS]: { walkable: true, encounter: true, encounterRate: 0.15, name: 'Tall Grass' },
    [TILE_TYPES.ROCK]: { walkable: false, encounter: false, name: 'Rock' },
    [TILE_TYPES.SAND]: { walkable: true, encounter: false, name: 'Sand' },
    [TILE_TYPES.FLOWER]: { walkable: true, encounter: false, name: 'Flowers' },
    [TILE_TYPES.CAVE_FLOOR]: { walkable: true, encounter: true, encounterRate: 0.1, name: 'Cave Floor' },
    [TILE_TYPES.CAVE_WALL]: { walkable: false, encounter: false, name: 'Cave Wall' },
    [TILE_TYPES.BUILDING]: { walkable: false, encounter: false, name: 'Building' },
    [TILE_TYPES.DOOR]: { walkable: true, encounter: false, isTransition: true, name: 'Door' }
};

/**
 * Get the color for a tile type
 * @param {number} tileType - The tile type constant
 * @returns {string} - The hex color for the tile
 */
export function getTileColor(tileType) {
    return TILE_COLORS[tileType] || '#FF00FF'; // Magenta for unknown tiles
}

/**
 * Check if a tile is walkable
 * @param {number} tileType - The tile type constant
 * @returns {boolean} - Whether the tile can be walked on
 */
export function isWalkable(tileType) {
    const props = TILE_PROPERTIES[tileType];
    return props ? props.walkable : false;
}

/**
 * Check if a tile can trigger encounters
 * @param {number} tileType - The tile type constant
 * @returns {boolean} - Whether the tile can trigger encounters
 */
export function canEncounter(tileType) {
    const props = TILE_PROPERTIES[tileType];
    return props ? props.encounter : false;
}

/**
 * Get the encounter rate for a tile
 * @param {number} tileType - The tile type constant
 * @returns {number} - The encounter rate (0-1)
 */
export function getEncounterRate(tileType) {
    const props = TILE_PROPERTIES[tileType];
    return props && props.encounterRate ? props.encounterRate : 0;
}
