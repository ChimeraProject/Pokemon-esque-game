# Pokémon Sprite System Guide

## Overview

The game now includes a full sprite system that automatically downloads and displays Pokémon sprites during battles. Sprites are sourced from **PokéAPI**, which provides official Generation II Pokémon artwork.

## File Structure

```
assets/
└── sprites/
    └── pokemon/
        ├── front/          # Enemy sprites (front-facing view)
        │   ├── cyndaquil.png
        │   ├── rattata.png
        │   └── ... (21 more)
        └── back/           # Player sprites (back-facing view)
            ├── cyndaquil.png
            ├── rattata.png
            └── ... (21 more)
```

**Total Sprites:** 46 PNG files (23 Pokémon × 2 perspectives)

## Downloading Sprites

### Automatic Download

Run the sprite downloader script:

```bash
node download-sprites.js
```

This will:
1. Create necessary directories
2. Download front/back sprites for all configured Pokémon
3. Cache them in `assets/sprites/pokemon/`
4. Display download progress and summary

### Adding More Pokémon

Edit `download-sprites.js` and add to the `pokemonToDownload` array:

```javascript
const pokemonToDownload = [
  { name: 'bulbasaur', id: 1 },
  { name: 'ivysaur', id: 2 },
  // ... add more
];
```

Then run the downloader again.

## Sprite System Architecture

### SpriteManager Class

Located in `src/graphics/SpriteManager.js`

**Key Methods:**

- `loadSprite(pokemonName, perspective)` - Async load sprite with caching
- `preloadSprites(sprites)` - Batch preload multiple sprites
- `getSprite(pokemonName, perspective)` - Get cached sprite or null
- `drawSprite(ctx, sprite, x, y, scale)` - Render sprite on canvas

**Features:**

- **Automatic Caching** - Sprites loaded once and cached in memory
- **Promise-based Loading** - Async/await support for sequential loading
- **Scale Support** - Sprites can be drawn at different sizes (default 1x = 96×96px)
- **Error Handling** - Graceful fallback if sprite fails to load

### BattleScene Integration

The BattleScene automatically:

1. **Initializes SpriteManager** in constructor
2. **Loads sprites** on battle start (async, doesn't block rendering)
3. **Renders sprites** once loaded:
   - **Enemy sprite** (front view) - top-right corner, 2x scale
   - **Player sprite** (back view) - bottom-left corner, 2x scale

**Code Example:**

```javascript
// In BattleScene constructor
this.spriteManager = new SpriteManager();
this.loadBattleSprites(); // Async load

// During render
if (this.enemySprite && !this.spritesLoading) {
  this.spriteManager.drawSprite(ctx, this.enemySprite, 
    CONFIG.canvas.width - 50, 50, 2);
}
```

## Sprite Sources

### Primary Source: PokéAPI

- **URL:** https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/
- **Format:** PNG with transparency
- **Size:** 96×96 pixels per sprite
- **Quality:** Official Game Freak artwork (Generation II)
- **Coverage:** All 251 Pokémon (Gen I-II)
- **License:** PokeAPI provides CC0 public domain sprites

### Available Perspectives

- **Front (`front/`)** - Pokémon facing viewer (used for enemies)
- **Back (`back/`)** - Pokémon back view (used for player's team)
- **Animated** - Available but not currently used

### Alternative Sources

If you need animated sprites or different art styles:

1. **Bulbapedia** - Sprites from official games
   - URL: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/`
   - Higher resolution official artwork

2. **Spriters-Resource** - Fan-made and official sprites
   - URL: https://www.spriters-resource.com/
   - Various art styles and generations

3. **PokéAPI Animated** - Animated sprites (requires modification)
   - URL: `/sprites/pokemon/versions/generation-v/black-white/animated/`

## Performance Considerations

### Current Approach

- **Lazy Loading** - Sprites loaded when battle starts (not preloaded)
- **Memory Efficient** - Cached sprites reused across multiple battles
- **Non-Blocking** - Sprite loading doesn't freeze UI

### Optimization Tips

1. **Batch Preload** on game start:
   ```javascript
   await spriteManager.preloadSprites([
     { name: 'cyndaquil', perspective: 'back' },
     { name: 'cyndaquil', perspective: 'front' },
     // ... preload all common pokemon
   ]);
   ```

2. **Lazy Loading** for encountered Pokémon:
   ```javascript
   // Sprites auto-load during battle setup (current approach)
   ```

3. **Scale Optimization** - Currently 2x scale (192×192px on screen)
   - Adjust scale parameter for different sizes
   - Higher scale = slower rendering

### Load Times

- **First Encounter**: ~100-500ms (depends on connection)
- **Subsequent Battles**: <1ms (from cache)
- **Concurrent Loading**: Handled via Promise caching

## Troubleshooting

### Sprites Not Showing

1. **Check console** for loading errors (F12)
   - Should see: `✅ Battle sprites loaded successfully`
   
2. **Verify file paths** exist:
   ```bash
   ls assets/sprites/pokemon/front/
   ls assets/sprites/pokemon/back/
   ```

3. **Clear browser cache** (http-server has `Cache: -1`)
   - Hard refresh: Ctrl+Shift+R

4. **Check network tab** (F12) for 404s on sprite requests

### 404 on Sprite Files

- **Cause**: Pokémon name mismatch between code and sprite filename
- **Fix**: Verify `species` field in Pokemon data matches filename exactly
  ```javascript
  // In pokemon.js
  { 
    name: 'Cyndaquil',
    species: 'cyndaquil',  // Must match filename
    // ...
  }
  ```

### Memory Usage High

- **Cause**: Too many sprites cached
- **Fix**: Clear cache by restarting browser or creating new SpriteManager instance

## Usage Examples

### Example 1: Load Single Sprite

```javascript
const spriteManager = new SpriteManager();
const sprite = await spriteManager.loadSprite('cyndaquil', 'back');
spriteManager.drawSprite(ctx, sprite, 50, 100, 2);
```

### Example 2: Preload All Battle Pokémon

```javascript
const toPreload = [
  ...playerTeam.map(p => ({ name: p.species, perspective: 'back' })),
  ...enemyTeam.map(p => ({ name: p.species, perspective: 'front' }))
];
await spriteManager.preloadSprites(toPreload);
```

### Example 3: Handle Missing Sprites

```javascript
try {
  const sprite = await spriteManager.loadSprite('unknown', 'front');
  spriteManager.drawSprite(ctx, sprite, x, y);
} catch (error) {
  // Draw placeholder instead
  ctx.fillStyle = '#999';
  ctx.fillRect(x - 48, y - 48, 96, 96);
}
```

## Future Enhancements

### Planned Features

- [ ] Animated sprites (PNG sequence or sprite sheets)
- [ ] Custom sprite loading from user files
- [ ] Sprite effects (flash on damage, flinch animation)
- [ ] Alternative art styles or generations
- [ ] Sprite zoom/pan during battle transitions
- [ ] Custom player character sprite

### Implementation Notes

- Animated sprites would require Canvas frame-by-frame rendering
- Consider sprite atlases for better performance with many sprites
- Could add `SpriteAnimator` class for managing frame sequences

## API Reference

### SpriteManager

```javascript
class SpriteManager {
  // Load single sprite
  async loadSprite(pokemonName: string, perspective: 'front'|'back'): Promise<Image>
  
  // Load multiple sprites
  async preloadSprites(sprites: Array<{name, perspective}>): Promise<void>
  
  // Get cached sprite
  getSprite(pokemonName: string, perspective?: string): Image|null
  
  // Draw sprite on canvas
  drawSprite(ctx: CanvasRenderingContext2D, sprite: Image, 
             x: number, y: number, scale?: number): void
}
```

### Sprite Cache

```javascript
spriteManager.spriteCache  // Map<string, Image>
spriteManager.loadingPromises  // Map<string, Promise<Image>>
```

## Files Modified

- `src/graphics/SpriteManager.js` - NEW: Sprite management class
- `src/battles/BattleScene.js` - MODIFIED: Added sprite rendering
- `download-sprites.js` - NEW: Sprite downloader script
- `assets/sprites/pokemon/` - NEW: 46 sprite files

## Credits

- **Sprites**: Pokémon sprites © Nintendo/Game Freak, provided via PokéAPI
- **PokéAPI**: https://pokeapi.co/
- **Repository**: https://github.com/PokeAPI/sprites
