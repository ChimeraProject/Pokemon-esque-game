#!/usr/bin/env node

/**
 * Pokemon Tileset Generator
 * Creates a proper Pokemon-style tileset image for the overworld
 * Generates tiles in Gen 2 style (HeartGold/SoulSilver inspired)
 */

import canvas from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create canvas for tileset (16 tiles wide x 8 high = 256x128 at 16px tiles)
const tileSize = 16;
const tilesWide = 16;
const tilesHigh = 8;
const canvasWidth = tileSize * tilesWide;
const canvasHeight = tileSize * tilesHigh;

const cnvs = canvas.createCanvas(canvasWidth, canvasHeight);
const ctx = cnvs.getContext('2d');

// Clear canvas
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

/**
 * Draw a tile on the tileset
 */
function drawTile(index, color, pattern) {
  const x = (index % tilesWide) * tileSize;
  const y = Math.floor(index / tilesWide) * tileSize;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, tileSize, tileSize);

  if (pattern) {
    pattern(ctx, x, y, tileSize);
  }
}

/**
 * Grass patterns
 */
function grassPattern1(ctx, x, y, size) {
  // Light grass with detail spots
  ctx.fillStyle = 'rgba(100, 150, 50, 0.4)';
  ctx.fillRect(x + 2, y + 2, 3, 3);
  ctx.fillRect(x + 10, y + 8, 3, 3);
  ctx.fillRect(x + 6, y + 12, 2, 2);
}

function grassPattern2(ctx, x, y, size) {
  // Tall grass
  ctx.fillStyle = '#4a7c2c';
  ctx.fillRect(x + 1, y + 4, 2, 12);
  ctx.fillRect(x + 6, y + 2, 2, 14);
  ctx.fillRect(x + 12, y + 5, 2, 11);
}

function pathPattern(ctx, x, y, size) {
  // Brown path with dirt texture
  ctx.fillStyle = '#8b7355';
  ctx.fillRect(x + 3, y + 3, 10, 10);
  ctx.fillStyle = 'rgba(101, 67, 33, 0.5)';
  ctx.fillRect(x + 4, y + 4, 2, 2);
  ctx.fillRect(x + 10, y + 10, 2, 2);
}

function waterPattern(ctx, x, y, size) {
  // Water with wave details
  ctx.fillStyle = '#2E90FF';
  ctx.fillRect(x, y, size, size);
  ctx.strokeStyle = '#1E7FE8';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(x + 2, y + 5);
  ctx.quadraticCurveTo(x + 8, y + 3, x + 14, y + 5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 1, y + 11);
  ctx.quadraticCurveTo(x + 8, y + 9, x + 15, y + 11);
  ctx.stroke();
}

function treePattern(ctx, x, y, size) {
  // Tree trunk and foliage
  ctx.fillStyle = '#8B5A3C';
  ctx.fillRect(x + 5, y + 10, 6, 6);
  ctx.fillStyle = '#2D5016';
  ctx.beginPath();
  ctx.arc(x + 8, y + 6, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3D6B1F';
  ctx.beginPath();
  ctx.arc(x + 8, y + 8, 4, 0, Math.PI * 2);
  ctx.fill();
}

function rockPattern(ctx, x, y, size) {
  // Rocky terrain
  ctx.fillStyle = '#696969';
  ctx.fillRect(x + 2, y + 2, 12, 12);
  ctx.fillStyle = '#505050';
  ctx.fillRect(x + 3, y + 4, 4, 4);
  ctx.fillRect(x + 9, y + 8, 4, 4);
  ctx.strokeStyle = '#3a3a3a';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(x + 2, y + 2, 12, 12);
}

function flowerPattern(ctx, x, y, size) {
  // Flowery grass
  ctx.fillStyle = '#3D6B1F';
  ctx.fillRect(x + 2, y + 8, 2, 8);
  ctx.fillRect(x + 12, y + 6, 2, 10);
  ctx.fillStyle = '#FF69B4';
  ctx.beginPath();
  ctx.arc(x + 3, y + 6, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FF1493';
  ctx.beginPath();
  ctx.arc(x + 13, y + 4, 2, 0, Math.PI * 2);
  ctx.fill();
}

function sandPattern(ctx, x, y, size) {
  // Sandy beach
  ctx.fillStyle = '#F4A460';
  ctx.fillRect(x, y, size, size);
  ctx.fillStyle = 'rgba(210, 180, 140, 0.3)';
  ctx.fillRect(x + 3, y + 3, 3, 3);
  ctx.fillRect(x + 10, y + 10, 3, 3);
}

function mountainPattern(ctx, x, y, size) {
  // Mountain/mountain top
  ctx.fillStyle = '#8B7355';
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 2);
  ctx.lineTo(x + 2, y + 14);
  ctx.lineTo(x + 14, y + 14);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#A0826D';
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 2);
  ctx.lineTo(x + 8, y + 14);
  ctx.lineTo(x + 14, y + 14);
  ctx.closePath();
  ctx.fill();
}

function housePattern(ctx, x, y, size) {
  // House/building
  ctx.fillStyle = '#CD5C5C';
  ctx.fillRect(x + 2, y + 6, 12, 10);
  ctx.fillStyle = '#8B3A3A';
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 3);
  ctx.lineTo(x + 2, y + 6);
  ctx.lineTo(x + 14, y + 6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(x + 4, y + 8, 3, 3);
  ctx.fillRect(x + 9, y + 8, 3, 3);
}

// Generate tileset
console.log('🎮 Generating Pokemon Tileset...');

// Row 0: Grass variants
drawTile(0, '#2D5016', grassPattern1);      // Grass 1
drawTile(1, '#2D5016', grassPattern2);      // Grass 2
drawTile(2, '#3D6B1F', grassPattern1);      // Grass 3 (lighter)
drawTile(3, '#2D5016', flowerPattern);      // Flowers

// Row 0 continued: Water and paths
drawTile(4, '#1E90FF', waterPattern);       // Water 1
drawTile(5, '#1E87DD', waterPattern);       // Water 2 (darker)
drawTile(6, '#8B7355', pathPattern);        // Path
drawTile(7, '#A0826D', pathPattern);        // Path (variant)

// Row 0 continued: Terrain
drawTile(8, '#696969', rockPattern);        // Rock
drawTile(9, '#F4A460', sandPattern);        // Sand
drawTile(10, '#8B7355', mountainPattern);   // Mountain
drawTile(11, '#CD5C5C', housePattern);      // House

// Row 1: More terrain
drawTile(12, '#2D5016', grassPattern1);     // Grass (dark)
drawTile(13, '#0077BE', waterPattern);      // Water (deep)
drawTile(14, '#696969', (ctx, x, y) => {    // Wall
  ctx.fillRect(x + 2, y + 2, 3, 3);
  ctx.fillRect(x + 9, y + 2, 3, 3);
  ctx.fillRect(x + 2, y + 9, 3, 3);
  ctx.fillRect(x + 9, y + 9, 3, 3);
});
drawTile(15, '#1a1a1a', () => {             // Empty/void
  ctx.strokeStyle = '#FF0000';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, 16, 16);
});

// Row 2: Trees and nature
for (let i = 16; i < 32; i++) {
  if (i === 16) drawTile(i, '#228B22', treePattern);
  else if (i === 17) drawTile(i, '#2D5016', grassPattern2);
  else if (i === 18) drawTile(i, '#1E90FF', waterPattern);
  else drawTile(i, '#2D5016', grassPattern1);
}

// Fill rest with grass
for (let i = 32; i < tilesWide * tilesHigh; i++) {
  drawTile(i, '#2D5016', grassPattern1);
}

// Save tileset
const assetsDir = path.join(__dirname, 'assets');
const tilesetsDir = path.join(assetsDir, 'tilesets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}
if (!fs.existsSync(tilesetsDir)) {
  fs.mkdirSync(tilesetsDir, { recursive: true });
}

const output = fs.createWriteStream(path.join(tilesetsDir, 'pokemon-tileset.png'));
cnvs.pngStream().pipe(output);

output.on('finish', () => {
  console.log(`✅ Tileset created: assets/tilesets/pokemon-tileset.png`);
  console.log(`📊 Size: ${canvasWidth}x${canvasHeight}px (${tilesWide}x${tilesHigh} tiles of ${tileSize}px)`);
});

output.on('error', (err) => {
  console.error('❌ Failed to create tileset:', err);
});
