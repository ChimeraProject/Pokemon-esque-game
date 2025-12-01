# ROM Extraction & Asset Integration Guide

## Overview
This guide walks you through extracting all Pokémon Emerald assets (sprites, data, maps) and integrating them into your game.

## Prerequisites
- **Pokémon Emerald ROM** (legally obtained from cartridge you own)
- **ROM Asset Extractor** executable
- **Node.js** (v14+)

## Step-by-Step Instructions

### Step 1: Download ROM Asset Extractor

1. Visit: https://github.com/tjtwl/ROM-Asset-Extractor/releases
2. Download the latest release (or clone and build)
3. Extract to a folder like `C:\Tools\ROM-Asset-Extractor\`

### Step 2: Extract Pokémon Emerald Assets

```bash
# Navigate to ROM Asset Extractor directory
cd "C:\Tools\ROM-Asset-Extractor"

# Run extraction (adjust paths as needed)
RomAssetExtractor.Cli.exe --rom "C:\path\to\emerald.gba" --output "C:\path\to\Pokemon HeartGold Clone\extracted-emerald"
```

**Or use the UI:**
- Run `RomAssetExtractor.UI.exe`
- Select your Emerald ROM file
- Choose output directory: `extracted-emerald` in your project
- Click Extract

This will create:
```
extracted-emerald/
├── Pokemon/
│   ├── [all Pokemon sprites as PNG]
│   └── pokemon.json (stats, moves, evolutions)
├── Moves/
│   └── moves.json
├── Maps/
│   ├── [map data JSON files]
│   └── [tileset data]
├── Tilesets/
│   └── [tileset PNG images]
└── Trainers/
    └── trainers.json
```

### Step 3: Process Extracted Assets

```bash
# From your project directory
node process-rom-assets.js --input ./extracted-emerald --output ./src/data
```

This generates:
- `src/data/pokemon-extracted.js` - All 386 Pokémon with stats/moves
- `src/data/moves-extracted.js` - All moves with properties
- `src/data/maps-extracted.js` - Map metadata
- `src/data/trainers-extracted.js` - Trainer data
- `src/data/encounters-extracted.js` - Wild encounter pools
- `assets/pokemon/` - Sprite sheets
- `assets/tilesets/` - Tileset images

### Step 4: Merge with Existing Data

Your manual data files take priority:
```javascript
// In pokemon.js - use extracted as fallback
import POKEMON_COMPLETE from './pokemon-complete.js';
import POKEMON_EXTRACTED from './pokemon-extracted.js';

export const POKEMON = {
  ...POKEMON_EXTRACTED,  // Extracted base data
  ...POKEMON_COMPLETE    // Your custom/overrides
};
```

### Step 5: Update Game to Use Assets

Update sprite references in your game:
```javascript
// Before: Manual sprite references
const sprite = 'pidgeot.png';

// After: Load from extracted assets
const pokemonId = pokemon.id;
const sprite = `pokemon/${pokemonId}.png`;
```

## File Structure

```
project/
├── extracted-emerald/          ← Raw extraction output
│   ├── Pokemon/
│   ├── Moves/
│   ├── Maps/
│   ├── Tilesets/
│   └── Trainers/
├── assets/                      ← Processed for game use
│   ├── pokemon/                 ← Sprite sheets (from extraction)
│   └── tilesets/                ← Tileset images (from extraction)
├── src/
│   ├── data/
│   │   ├── pokemon-extracted.js      ← Generated from JSON
│   │   ├── pokemon-complete.js       ← Your manual data (priority)
│   │   ├── moves-extracted.js        ← Generated from JSON
│   │   ├── moves-gen2.js             ← Your manual data
│   │   ├── maps-extracted.js         ← Generated from JSON
│   │   ├── maps-johto.js             ← Your manual data
│   │   ├── gym-leaders.js            ← Your manual data
│   │   ├── location-encounters.js    ← Your manual data
│   │   └── trainers-extracted.js     ← Generated from JSON
│   └── ...
├── process-rom-assets.js       ← Processing script
└── package.json
```

## What Gets Extracted

### Pokémon Data (386 species)
```javascript
{
  bulbasaur: {
    id: 1,
    name: "Bulbasaur",
    type: ["grass", "poison"],
    stats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
    moves: ["tackle", "growl"],
    baseExp: 64,
    evolution: { name: "ivysaur", level: 16 }
  }
}
```

### Moves Data
```javascript
{
  tackle: {
    id: 1,
    name: "Tackle",
    type: "normal",
    category: "physical",
    power: 40,
    accuracy: 100,
    pp: 35,
    description: "A physical attack in which the user charges..."
  }
}
```

### Maps with Encounters
```javascript
{
  "Route 101": {
    name: "Route 101",
    width: 20,
    height: 15,
    encounters: [
      { species: "zigzagoon", level: [2, 4], rate: 0.6 },
      { species: "taillow", level: [2, 4], rate: 0.4 }
    ]
  }
}
```

### Sprites
- **Format:** PNG (transparent background)
- **Animation:** Horizontal sprite sheets (front, back, attacking)
- **Usage:** Load dynamically by Pokémon ID or name
```javascript
// Example sprite loading
const frontSprite = `assets/pokemon/${pokemon.id}-front.png`;
const backSprite = `assets/pokemon/${pokemon.id}-back.png`;
```

## Customization

### Process Only Specific Assets

Modify `process-rom-assets.js` to skip/customize:

```javascript
// Skip tileset processing
// processTilesets();  // Comment out

// Process only first 100 trainers
mapFiles.slice(0, 100).forEach(...)

// Change sprite output directory
const assetsDir = path.join(process.cwd(), 'custom/path');
```

### Merge Manual Data

Keep your best data (gym leaders, custom routes) and supplement with extraction:

```javascript
// Your Gym Leaders + Extracted generic trainers
import GYM_LEADERS from './gym-leaders.js';
import TRAINERS_EXTRACTED from './trainers-extracted.js';

export const ALL_TRAINERS = {
  ...TRAINERS_EXTRACTED,
  ...GYM_LEADERS  // Override with your carefully crafted data
};
```

## Troubleshooting

### "Pokemon JSON not found"
- Ensure extraction completed successfully
- Check `extracted-emerald/Pokemon/pokemon.json` exists
- Try extraction again with UI

### "Sprites not copying"
- Verify `assets/pokemon/` directory was created
- Check file permissions
- Run as administrator if needed

### "Maps have no encounter data"
- Some maps may not have wild Pokémon (cities, indoors)
- Check `encounters-extracted.js` for maps with data
- Merge with your `location-encounters.js` manually

### Missing or incorrect moves/types
- Emerald extraction should be complete
- Review `moves-extracted.js` for accuracy
- Merge with `moves-gen2.js` for missing moves

## Next Steps

1. **Extract assets** using ROM Asset Extractor
2. **Run** `node process-rom-assets.js`
3. **Review** generated files for accuracy
4. **Merge** with existing manual data
5. **Update** game code to use extracted sprites
6. **Test** sprite loading and game functionality
7. **Commit** to git

## Integration Checklist

- [ ] Extracted Pokémon Emerald ROM
- [ ] Ran ROM Asset Extractor CLI/UI
- [ ] Generated extraction output in `extracted-emerald/`
- [ ] Ran `process-rom-assets.js`
- [ ] Generated 5 JSON files in `src/data/`
- [ ] Copied sprites to `assets/pokemon/`
- [ ] Copied tilesets to `assets/tilesets/`
- [ ] Updated game.js to use extracted assets
- [ ] Tested sprite loading
- [ ] Committed to git

## Performance Notes

- **Sprite sheets**: Can be large (50-200MB total)
  - Consider using sprite atlas/spritesheet loader
  - Use canvas drawImage() with correct coordinates
- **Pokemon data**: 386 species × attributes = ~1MB JSON
  - Use gzip compression in production
  - Lazy-load if needed
- **Maps**: Full collision data can be 2-4MB per large map
  - Consider lazy-loading maps on demand
  - Optimize tile storage format if needed

## Legal Notice

- Only extract from ROMs you legally own
- Respect copyright of Nintendo/Game Freak/Creatures Inc.
- Use extracted assets only for non-commercial purposes
- See ROM Asset Extractor license: GPL-3.0
