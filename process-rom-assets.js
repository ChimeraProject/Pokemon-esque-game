#!/usr/bin/env node
/**
 * ROM Asset Processor for Pokémon Game
 * Processes extracted assets from ROM Asset Extractor and generates game-ready JSON files
 * Usage: node process-rom-assets.js --input ./extracted-emerald --output ./src/data
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let inputDir = './extracted-emerald';
let outputDir = './src/data';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--input' || args[i] === '-i') {
    inputDir = args[i + 1];
  }
  if (args[i] === '--output' || args[i] === '-o') {
    outputDir = args[i + 1];
  }
}

console.log('🎮 ROM Asset Processor');
console.log(`📂 Input: ${inputDir}`);
console.log(`📁 Output: ${outputDir}`);
console.log('');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ============================================
// 1. PROCESS POKEMON DATA
// ============================================
console.log('📊 Processing Pokemon data...');

function processPokemonData() {
  try {
    const pokemonJsonPath = path.join(inputDir, 'Pokemon', 'pokemon.json');
    
    if (!fs.existsSync(pokemonJsonPath)) {
      console.warn('⚠️  Pokemon JSON not found at', pokemonJsonPath);
      return null;
    }

    const rawData = JSON.parse(fs.readFileSync(pokemonJsonPath, 'utf8'));
    
    // Transform extracted data to our format
    const processedPokemon = {};
    
    Object.entries(rawData).forEach(([key, pokemon]) => {
      const id = pokemon.id || parseInt(key);
      const name = (pokemon.name || key).toLowerCase().replace(/[^a-z0-9]/g, '');
      
      processedPokemon[name] = {
        id: id,
        name: pokemon.name || key,
        type: Array.isArray(pokemon.type) ? pokemon.type.map(t => t.toLowerCase()) : [pokemon.type?.toLowerCase() || 'normal'],
        stats: {
          hp: pokemon.baseStats?.hp || 45,
          atk: pokemon.baseStats?.attack || 49,
          def: pokemon.baseStats?.defense || 49,
          spa: pokemon.baseStats?.spAtk || 49,
          spd: pokemon.baseStats?.spDef || 49,
          spe: pokemon.baseStats?.speed || 45
        },
        moves: Array.isArray(pokemon.moves) 
          ? pokemon.moves.slice(0, 4).map(m => m.toLowerCase().replace(/[^a-z0-9]/g, ''))
          : [],
        baseExp: pokemon.baseExp || 64,
        evolution: pokemon.evolutions ? processEvolution(pokemon.evolutions[0]) : null
      };
    });

    // Write to file
    const output = `/**
 * Auto-generated Pokemon data from ROM extraction
 * Source: Pokémon Emerald ROM
 * Generated: ${new Date().toISOString()}
 */

export const POKEMON_EXTRACTED = ${JSON.stringify(processedPokemon, null, 2)};

export default POKEMON_EXTRACTED;
`;

    fs.writeFileSync(path.join(outputDir, 'pokemon-extracted.js'), output);
    console.log(`✅ Generated pokemon-extracted.js (${Object.keys(processedPokemon).length} species)`);
    
    return processedPokemon;
  } catch (error) {
    console.error('❌ Error processing Pokemon data:', error.message);
    return null;
  }
}

function processEvolution(evo) {
  if (!evo) return null;
  
  const evolution = {
    name: (evo.name || evo.species || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  };

  if (evo.level) {
    evolution.level = evo.level;
  } else if (evo.item) {
    evolution.item = evo.item.toLowerCase().replace(/[^a-z0-9]/g, '');
  } else if (evo.happiness !== undefined) {
    evolution.happiness = evo.happiness;
  }

  return evolution;
}

// ============================================
// 2. PROCESS MOVES DATA
// ============================================
console.log('🎯 Processing moves data...');

function processMovesData() {
  try {
    const movesJsonPath = path.join(inputDir, 'Moves', 'moves.json');
    
    if (!fs.existsSync(movesJsonPath)) {
      console.warn('⚠️  Moves JSON not found at', movesJsonPath);
      return null;
    }

    const rawMoves = JSON.parse(fs.readFileSync(movesJsonPath, 'utf8'));
    
    const processedMoves = {};
    
    Object.entries(rawMoves).forEach(([key, move]) => {
      const moveName = (move.name || key).toLowerCase().replace(/[^a-z0-9]/g, '');
      
      processedMoves[moveName] = {
        id: move.id || parseInt(key),
        name: move.name || key,
        type: (move.type || 'normal').toLowerCase(),
        category: (move.category || move.type || 'physical').toLowerCase(),
        power: move.power || 0,
        accuracy: move.accuracy !== undefined ? move.accuracy : 100,
        pp: move.pp || 20,
        description: move.description || ''
      };
    });

    const output = `/**
 * Auto-generated moves data from ROM extraction
 * Source: Pokémon Emerald ROM
 * Generated: ${new Date().toISOString()}
 */

export const MOVES_EXTRACTED = ${JSON.stringify(processedMoves, null, 2)};

export default MOVES_EXTRACTED;
`;

    fs.writeFileSync(path.join(outputDir, 'moves-extracted.js'), output);
    console.log(`✅ Generated moves-extracted.js (${Object.keys(processedMoves).length} moves)`);
    
    return processedMoves;
  } catch (error) {
    console.error('❌ Error processing moves data:', error.message);
    return null;
  }
}

// ============================================
// 3. PROCESS TILESETS
// ============================================
console.log('🧩 Processing tilesets...');

function processTilesets() {
  try {
    const tilesetsDir = path.join(inputDir, 'Tilesets');
    
    if (!fs.existsSync(tilesetsDir)) {
      console.warn('⚠️  Tilesets directory not found');
      return;
    }

    const tilesetsDataDir = path.join(inputDir, 'Tilesets', 'Data');
    if (fs.existsSync(tilesetsDataDir)) {
      const tilesets = fs.readdirSync(tilesetsDataDir)
        .filter(f => f.endsWith('.json'))
        .length;
      console.log(`✅ Found ${tilesets} tileset data files`);
    }

    // Copy tileset PNGs to assets
    const assetsDir = path.join(process.cwd(), 'assets', 'tilesets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    const pngFiles = fs.readdirSync(tilesetsDir).filter(f => f.endsWith('.png'));
    pngFiles.forEach(file => {
      const src = path.join(tilesetsDir, file);
      const dest = path.join(assetsDir, file);
      fs.copyFileSync(src, dest);
    });

    console.log(`✅ Copied ${pngFiles.length} tileset PNG files to assets/tilesets/`);
  } catch (error) {
    console.error('❌ Error processing tilesets:', error.message);
  }
}

// ============================================
// 4. PROCESS SPRITE SHEETS
// ============================================
console.log('🎨 Processing Pokemon sprites...');

function processSprites() {
  try {
    const spritesDir = path.join(inputDir, 'Pokemon');
    
    if (!fs.existsSync(spritesDir)) {
      console.warn('⚠️  Pokemon sprites directory not found');
      return;
    }

    const assetsDir = path.join(process.cwd(), 'assets', 'pokemon');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    // Copy all Pokemon sprite PNG files
    const spriteFiles = fs.readdirSync(spritesDir).filter(f => f.endsWith('.png'));
    spriteFiles.forEach(file => {
      const src = path.join(spritesDir, file);
      const dest = path.join(assetsDir, file);
      fs.copyFileSync(src, dest);
    });

    console.log(`✅ Copied ${spriteFiles.length} Pokemon sprite files to assets/pokemon/`);
  } catch (error) {
    console.error('❌ Error processing sprites:', error.message);
  }
}

// ============================================
// 5. PROCESS MAP DATA
// ============================================
console.log('🗺️  Processing map data...');

function processMaps() {
  try {
    const mapsDir = path.join(inputDir, 'Maps');
    
    if (!fs.existsSync(mapsDir)) {
      console.warn('⚠️  Maps directory not found');
      return;
    }

    const mapFiles = fs.readdirSync(mapsDir)
      .filter(f => f.endsWith('.json') && !f.endsWith('_data.json'));

    const processedMaps = {};

    mapFiles.slice(0, 20).forEach(file => {
      try {
        const mapName = file.replace('.json', '');
        const mapData = JSON.parse(fs.readFileSync(path.join(mapsDir, file), 'utf8'));
        const dataFile = file.replace('.json', '_data.json');
        const tileData = fs.existsSync(path.join(mapsDir, dataFile)) 
          ? JSON.parse(fs.readFileSync(path.join(mapsDir, dataFile), 'utf8'))
          : [];

        processedMaps[mapName] = {
          id: mapName,
          name: mapData.name || mapName,
          width: mapData.width || 20,
          height: mapData.height || 20,
          tileCount: tileData.length || (mapData.width * mapData.height),
          encounters: mapData.encounters || []
        };
      } catch (e) {
        // Skip individual map errors
      }
    });

    const output = `/**
 * Auto-generated map metadata from ROM extraction
 * Source: Pokémon Emerald ROM
 * Generated: ${new Date().toISOString()}
 * Note: Full tile collision data is available in individual map JSON files
 */

export const MAPS_EXTRACTED = ${JSON.stringify(processedMaps, null, 2)};

export default MAPS_EXTRACTED;
`;

    fs.writeFileSync(path.join(outputDir, 'maps-extracted.js'), output);
    console.log(`✅ Generated maps-extracted.js (${Object.keys(processedMaps).length} maps)`);
  } catch (error) {
    console.error('❌ Error processing maps:', error.message);
  }
}

// ============================================
// 6. PROCESS TRAINERS
// ============================================
console.log('👥 Processing trainer data...');

function processTrainers() {
  try {
    const trainersJsonPath = path.join(inputDir, 'Trainers', 'trainers.json');
    
    if (!fs.existsSync(trainersJsonPath)) {
      console.warn('⚠️  Trainers JSON not found');
      return;
    }

    const rawTrainers = JSON.parse(fs.readFileSync(trainersJsonPath, 'utf8'));
    
    const processedTrainers = {};
    
    Object.entries(rawTrainers).slice(0, 50).forEach(([key, trainer]) => {
      const trainerName = (trainer.name || key).toLowerCase().replace(/[^a-z0-9]/g, '');
      
      processedTrainers[trainerName] = {
        id: trainer.id || parseInt(key),
        name: trainer.name || key,
        type: trainer.type || 'trainer',
        team: Array.isArray(trainer.team) ? trainer.team.map(p => ({
          species: (p.species || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
          level: p.level || 10,
          moves: Array.isArray(p.moves) ? p.moves.slice(0, 4) : []
        })) : [],
        reward: {
          money: trainer.reward?.money || 1000,
          exp: trainer.reward?.exp || 1000
        }
      };
    });

    const output = `/**
 * Auto-generated trainers data from ROM extraction
 * Source: Pokémon Emerald ROM
 * Generated: ${new Date().toISOString()}
 * Note: Limited to first 50 trainers for game balance
 */

export const TRAINERS_EXTRACTED = ${JSON.stringify(processedTrainers, null, 2)};

export default TRAINERS_EXTRACTED;
`;

    fs.writeFileSync(path.join(outputDir, 'trainers-extracted.js'), output);
    console.log(`✅ Generated trainers-extracted.js (${Object.keys(processedTrainers).length} trainers)`);
  } catch (error) {
    console.error('❌ Error processing trainers:', error.message);
  }
}

// ============================================
// 7. PROCESS WILD ENCOUNTERS
// ============================================
console.log('🎯 Processing wild encounters...');

function processEncounters() {
  try {
    const mapsDir = path.join(inputDir, 'Maps');
    
    if (!fs.existsSync(mapsDir)) {
      console.warn('⚠️  Maps directory not found for encounters');
      return;
    }

    const encounters = {};
    const mapFiles = fs.readdirSync(mapsDir)
      .filter(f => f.endsWith('.json') && !f.endsWith('_data.json'));

    mapFiles.forEach(file => {
      try {
        const mapName = file.replace('.json', '');
        const mapData = JSON.parse(fs.readFileSync(path.join(mapsDir, file), 'utf8'));
        
        if (mapData.encounters && mapData.encounters.length > 0) {
          encounters[mapName] = {
            name: mapData.name || mapName,
            encounters: mapData.encounters.map(enc => ({
              species: (enc.species || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
              level: enc.level ? Array.isArray(enc.level) ? enc.level : [enc.level, enc.level] : [5, 15],
              rate: enc.rate || 0.2
            }))
          };
        }
      } catch (e) {
        // Skip individual errors
      }
    });

    const output = `/**
 * Auto-generated wild encounter data from ROM extraction
 * Source: Pokémon Emerald ROM
 * Generated: ${new Date().toISOString()}
 */

export const ENCOUNTERS_EXTRACTED = ${JSON.stringify(encounters, null, 2)};

export default ENCOUNTERS_EXTRACTED;
`;

    fs.writeFileSync(path.join(outputDir, 'encounters-extracted.js'), output);
    console.log(`✅ Generated encounters-extracted.js (${Object.keys(encounters).length} locations)`);
  } catch (error) {
    console.error('❌ Error processing encounters:', error.message);
  }
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🚀 Starting ROM asset extraction and processing...');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  const startTime = Date.now();

  // Process all asset types
  processPokemonData();
  processMovesData();
  processTilesets();
  processSprites();
  processMaps();
  processTrainers();
  processEncounters();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✅ Asset extraction complete! (${duration}s)`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('📁 Generated files:');
  console.log('   • src/data/pokemon-extracted.js');
  console.log('   • src/data/moves-extracted.js');
  console.log('   • src/data/maps-extracted.js');
  console.log('   • src/data/trainers-extracted.js');
  console.log('   • src/data/encounters-extracted.js');
  console.log('');
  console.log('🎨 Asset directories:');
  console.log('   • assets/pokemon/ (sprite sheets)');
  console.log('   • assets/tilesets/ (tileset PNGs)');
  console.log('');
  console.log('Next steps:');
  console.log('   1. Review and validate extracted data');
  console.log('   2. Merge with existing manual data (gym-leaders, custom routes)');
  console.log('   3. Update game.js to use extracted assets');
  console.log('');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
