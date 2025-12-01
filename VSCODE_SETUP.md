# VS Code Quick Setup Guide (with Claude 4.5 Haiku)

This guide helps you quickly set up the Pokemon HeartGold Browser Clone project in VS Code with Claude 4.5 Haiku assistance.

---

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites
```bash
# Ensure you have Node.js installed (v16+ recommended)
node --version
npm --version
```

### 2. Clone & Install
```bash
git clone https://github.com/ChimeraProject/Pokemon-esque-game.git
cd Pokemon-esque-game
npm install
```

### 3. Open in VS Code
```bash
code .
```

### 4. Run the Game
```bash
npm start
```
Open your browser at **http://localhost:8080**

---

## 📁 Project Structure Summary

```
Pokemon-esque-game/
├── index.html          # Game entry point (loads Phaser.js + game.js)
├── package.json        # Dependencies: phaser@3.60.0, http-server
├── src/
│   ├── game.js         # Main game loop, canvas setup, input handling
│   ├── overworld/
│   │   └── Overworld.js   # Player movement, Route 29 map, collision
│   └── battles/
│       └── BattleSystem.js # Turn-based battle system (placeholder)
└── assets/
    ├── art/            # Sprites, tilesets (to be added)
    ├── audio/          # Music, SFX (to be added)
    └── data/           # Pokemon data, maps (to be added)
```

---

## 🎮 Current Features

| Feature | Status | File |
|---------|--------|------|
| Game Canvas (720x480, 3x scale) | ✅ Working | `src/game.js` |
| Player Movement (WASD/Arrows) | ✅ Working | `src/overworld/Overworld.js` |
| Route 29 Map | ✅ Working | `src/overworld/Overworld.js` |
| Collision Detection | ✅ Working | `src/overworld/Overworld.js` |
| Battle System | 🔲 Placeholder | `src/battles/BattleSystem.js` |

---

## 🤖 Using Claude 4.5 Haiku to Help You Code

### Recommended VS Code Extensions
1. **GitHub Copilot** - AI pair programming
2. **Live Server** - Quick browser preview
3. **ESLint** - Code quality

### Example Prompts for Claude 4.5 Haiku

**To understand the codebase:**
> "Explain the game loop in src/game.js and how it connects to the Overworld system"

**To add features:**
> "Add a Pokemon encounter system that triggers when the player walks on grass tiles (tile type 0) in Overworld.js"

**To implement the battle system:**
> "Implement turn-based battle logic in BattleSystem.js with HP, attack, and defense stats"

**To add sprites:**
> "Replace the colored rectangles with sprite rendering using the Canvas API in Overworld.render()"

---

## 🔧 Key Configuration

| Config | Value | Location |
|--------|-------|----------|
| Tile Size | 16px | `src/game.js` (CONFIG) |
| Scale | 3x | `src/game.js` (CONFIG) |
| Canvas | 240x160 (scaled to 720x480) | `src/game.js` (CONFIG) |
| Move Speed | 0.1 tiles/frame | `src/overworld/Overworld.js` |

---

## 📝 Quick Commands

```bash
npm start     # Start dev server at localhost:8080
npm run build # (No build step yet)
npm test      # (No tests yet)
```

---

## 🎯 Next Steps for Development

1. **Add Pokemon Data** - Create `assets/data/pokemon.json` with stats
2. **Implement Battles** - Complete `BattleSystem.js` with damage calculation
3. **Add Sprites** - Replace colored rectangles with pixel art
4. **Add NPCs** - Create trainer and NPC classes
5. **Save System** - Implement localStorage saves

---

## 🐛 Troubleshooting

**Game doesn't load?**
- Check browser console (F12) for errors
- Ensure you're using `http://` not `file://`
- Run `npm install` if modules are missing

**Movement feels choppy?**
- Adjust `moveSpeed` in `Overworld.js` (try 0.05-0.2)

---

## 📚 Tech Stack

- **Phaser 3.60** - Game framework (CDN loaded)
- **Vanilla JS** - ES6 modules
- **Canvas API** - Rendering
- **http-server** - Development server

---

Happy coding! Use Claude 4.5 Haiku to help you build new features, debug issues, and understand the Pokemon game mechanics. 🎮
