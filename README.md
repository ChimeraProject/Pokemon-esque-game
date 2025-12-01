# Pokemon HeartGold Browser Clone

A browser-based implementation of Pokemon HeartGold featuring turn-based battles, overworld exploration, and tile-based maps.

**Status**: Early Development

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Open in Browser
Visit `http://localhost:8080` in your web browser.

---

## Project Structure

```
pokemon-heartgold-clone/
├── index.html              # Game entry point
├── package.json            # Dependencies and scripts
├── README.md              # This file
├── src/
│   ├── game.js            # Main game initialization and loop
│   ├── config.js          # Game configuration constants
│   ├── overworld/
│   │   ├── Overworld.js   # Overworld scene with player, NPCs, map
│   │   ├── Map.js         # Tile-based map rendering
│   │   └── Player.js      # Player character logic
│   ├── battles/
│   │   ├── BattleScene.js # Battle UI and management
│   │   └── BattleSystem.js # Turn-based battle mechanics
│   ├── ui/
│   │   ├── Menu.js        # Main menu system
│   │   └── HUD.js         # In-game HUD
│   ├── data/
│   │   ├── pokemon.js     # Pokemon stats and data
│   │   ├── moves.js       # Move database
│   │   └── items.js       # Item database
│   └── utils/
│       ├── math.js        # Math utilities (based on Zelda3)
│       └── collision.js   # Collision detection
├── assets/
│   ├── art/               # Sprites and tilesets
│   │   ├── player.png
│   │   ├── pokemon/
│   │   └── tileset.png
│   ├── audio/             # Music and sound effects
│   │   ├── music/
│   │   └── sfx/
│   └── data/              # Map data (JSON)
│       └── maps/
└── .gitignore
```

---

## Tech Stack

- **Phaser 3.60** - Game framework (canvas rendering, input, physics)
- **Vanilla JavaScript (ES6)** - Core game logic
- **Canvas API** - 2D graphics
- **http-server** - Development server

---

## Current Features

| Feature | Status | Notes |
|---------|--------|-------|
| Game Canvas | ✅ In Progress | 240x160 base, 3x scale |
| Overworld Scene | ✅ In Progress | Player movement, collision |
| Map System | 🔲 Planned | Tile-based maps |
| Player Movement | 🔲 Planned | WASD/Arrow keys |
| Battle System | 🔲 Planned | Turn-based |
| Pokemon Database | 🔲 Planned | Stats, moves, types |
| UI/HUD | 🔲 Planned | Health bars, menus |

---

## Architecture Notes

### Inspired by Zelda3 Reimplementation

The project takes architectural inspiration from the Zelda3 project:

1. **Modular Scene System** - Similar to how Zelda3 has multiple game states (overworld, dungeons, battles)
2. **Collision Detection** - Tile-based collision like Zelda3's tile_detect.c
3. **Asset Management** - Organized sprite/music/data structure
4. **Utility Functions** - Math and utility modules for common operations
5. **Configuration-Based** - Central config.js for game constants (inspired by Zelda3's approach)

### Game Loop Structure

```
Main Game Loop
├── Input Handling (WASD/Arrows, buttons)
├── Update Logic (player movement, animations, game state)
├── Collision Detection (tile-based)
├── Render (canvas draw)
└── Frame Rate Control (60 FPS target)
```

---

## Controls (Planned)

| Input | Action |
|-------|--------|
| **WASD** or **Arrow Keys** | Move player |
| **Enter** or **Space** | Interact / Select |
| **E** or **Z** | Use item |
| **M** | Open menu |
| **P** | Pause |

---

## Development Guide

### Adding a New Pokemon

1. Edit `src/data/pokemon.js`:
```javascript
export const POKEMON = {
  chikorita: {
    id: 152,
    name: "Chikorita",
    type: ["grass"],
    stats: { hp: 45, atk: 49, def: 65, spa: 49, spd: 65, spe: 45 },
    moves: ["tackle", "growl"]
  }
  // ...
}
```

2. Add sprite to `assets/art/pokemon/`

### Adding a New Map

1. Create tilemap in `assets/data/maps/newmap.json`:
```json
{
  "width": 20,
  "height": 15,
  "tileSize": 16,
  "tiles": [[0, 1, 2, ...], ...],
  "collisions": [[false, true, false, ...], ...]
}
```

2. Load in Overworld scene

### Adding Dialogue/NPCs

1. Create NPC class in `src/overworld/NPC.js`
2. Add dialogue data to `src/data/dialogue.js`
3. Implement interaction system

---

## Known Limitations

- Assets not yet included (sprites, music, tilesets)
- No save/load system
- No multiplayer
- Limited to single-threaded JavaScript performance

---

## Useful Resources

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Pokemon Data](https://pokeapi.co/)
- [Aseprite](https://www.aseprite.org/) - For sprite editing
- [Tiled Map Editor](https://www.mapeditor.org/) - For map creation

---

## Future Enhancements

- [ ] Pokemon wild encounters
- [ ] Gym battles
- [ ] Trainer AI
- [ ] Inventory system
- [ ] Save/Load system
- [ ] Multiplayer (WebSockets)
- [ ] Mobile touch controls
- [ ] Sound effects and music
- [ ] Particle effects and animations

---

## License

MIT

---

**Made with ❤️ for Pokemon fans**
