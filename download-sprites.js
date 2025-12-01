#!/usr/bin/env node

/**
 * Pokemon Sprite Downloader
 * Downloads sprites from PokéAPI for all Pokemon in the game
 * Usage: node download-sprites.js
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create necessary directories
const spritesDir = path.join(__dirname, 'assets', 'sprites', 'pokemon');
const frontDir = path.join(spritesDir, 'front');
const backDir = path.join(spritesDir, 'back');

[spritesDir, frontDir, backDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// List of Pokemon to download (Gen 2 + starters from our game)
const pokemonToDownload = [
  { name: 'chikorita', id: 152 },
  { name: 'bayleef', id: 153 },
  { name: 'meganium', id: 154 },
  { name: 'cyndaquil', id: 155 },
  { name: 'quilava', id: 156 },
  { name: 'typhlosion', id: 157 },
  { name: 'totodile', id: 158 },
  { name: 'croconaw', id: 159 },
  { name: 'feraligatr', id: 160 },
  { name: 'pidgeot', id: 18 },
  { name: 'pidgeotto', id: 17 },
  { name: 'pidgeey', id: 16 },
  { name: 'rattata', id: 19 },
  { name: 'raticate', id: 20 },
  { name: 'sentret', id: 161 },
  { name: 'furret', id: 162 },
  { name: 'hoothoot', id: 163 },
  { name: 'noctowl', id: 164 },
  { name: 'spinarak', id: 167 },
  { name: 'girafarig', id: 203 },
  { name: 'ledyba', id: 165 },
  { name: 'ledian', id: 166 },
  { name: 'dunsparce', id: 206 }
];

/**
 * Download a file from URL
 */
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 404) {
        reject(new Error(`404 Not Found: ${url}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', reject);
  });
}

/**
 * Download front and back sprites for a Pokemon
 */
async function downloadPokemonSprites(pokemon) {
  try {
    // PokéAPI sprite URLs
    const frontUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemon.id}.png`;
    const backUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
    
    const frontPath = path.join(backDir, `${pokemon.name}.png`);
    const backPath = path.join(frontDir, `${pokemon.name}.png`);
    
    // Download front sprite (player's perspective - back view)
    await downloadFile(frontUrl, frontPath);
    console.log(`✅ Downloaded back sprite: ${pokemon.name}`);
    
    // Download back sprite (enemy's perspective - front view)
    await downloadFile(backUrl, backPath);
    console.log(`✅ Downloaded front sprite: ${pokemon.name}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to download ${pokemon.name}: ${error.message}`);
    return false;
  }
}

/**
 * Main downloader function
 */
async function main() {
  console.log('🎮 Starting Pokémon Sprite Download...\n');
  
  let successful = 0;
  let failed = 0;
  
  for (const pokemon of pokemonToDownload) {
    const success = await downloadPokemonSprites(pokemon);
    if (success) {
      successful++;
    } else {
      failed++;
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n📊 Download Summary:`);
  console.log(`✅ Successful: ${successful}/${pokemonToDownload.length}`);
  console.log(`❌ Failed: ${failed}/${pokemonToDownload.length}`);
  console.log(`\n📁 Sprites saved to: ${spritesDir}`);
}

main().catch(console.error);
