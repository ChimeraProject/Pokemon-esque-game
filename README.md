# Pokemon HeartGold Browser Clone

A faithful browser recreation of Pokemon HeartGold/SoulSilver, built with Phaser.js. Explore Johto, battle trainers, collect Pokemon, and relive the story—all in your browser at 60 FPS.

## New Features

### 🗺️ Procedural World Generation
- **Noise-based terrain generation** inspired by Veloren's voxel systems
- Dynamic, replayable Johto regions with varied biomes
- Cave/dungeon generation using cellular automata
- Press `R` to regenerate the world, `C` to generate caves

### ⚔️ Enhanced Battle System
- **Complete turn-based combat** with damage calculation and type effectiveness
- **Party management** - manage up to 6 Pokemon
- **Difficulty scaling** (Easy, Normal, Hard, Challenge modes)
- **Loot system** with item drops and rewards
- Status effects, critical hits, and move priority

### 🎨 16-bit Style UI
- Retro pixel art UI inspired by DevilutionX
- Custom panels, HP bars, and menu systems
- Battle UI with Pokemon info boxes and action menus
- Message queue system for battle narration

### ⚡ Performance Optimizations
- Asset loading system with caching
- Object pooling to reduce garbage collection
- FPS monitoring and performance tracking
- Camera system for large procedural maps

## Purpose
This project focuses on ideating, designing, coding, and building a playable browser-based clone of Pokemon HeartGold/SoulSilver. Replicate core RPG elements: exploration, turn-based battles, collecting/training, story quests. Optimize for HTML5/JS/Canvas, 60 FPS in browsers like Chrome/Firefox/Safari. Prioritize accessibility (mobile, keyboard, colorblind palettes, subtitles).

## Scope
- In: Concepts for HeartGold clone (Johto mechanics), story/scripts, mechanics (battles/exploration), designs (characters/Pokemon), pixel art, tile maps, JS code, browser prototypes, testing, deployment (GitHub Pages/itch.io).
- Out: Non-web platforms, multiplayer, monetization, unrelated genres.

## Workflow
1. Ideate: New issue with Development Concept Template.
2. Validate: Research HeartGold via wikis/ROMs, playtest clones (e.g., Pokemon Showdown), gather browser feedback.
3. Develop: Code mechanics (e.g., battle logic), create/source assets, design levels, integrate story.
4. Prototype: Deploy playable demo (e.g., route + battle) via GitHub Pages.
5. Test & Iterate: Browser testing, bug fixes (e.g., Canvas leaks), optimize load times.
6. Evaluate: Use Rubric to score; decide beta/iterate/archive.
7. Handoff: Code repo, asset packs, deployment guides, balance checklists.

## Norms
- Structured: One component per issue (e.g., "Battle UI").
- Labels: `component/`, `status/ideating` etc.
- Timebox: 48h reviews, archive 60d.
- Copilot: For code (e.g., "Phaser.js scene"), assets, debugging.

## Development Concept Template
- Title: e.g., "HeartGold Battle System".
- Pitch: One-sentence premise.
- Problem/Goal: What achieves.
- Target Players: Age/interests.
- Core Mechanics: 3-6 (e.g., turn-based, types).
- Setting/World: Johto regions.
- Characters: Protagonist, rivals, Gym Leaders, Pokemon.
- Story Outline: Key plots.
- MVP Scope: Testable loop.
- Metrics: e.g., FPS, load time.
- Risks: Performance, legal.
- Dependencies: Phaser.js, Aseprite.
- Timeline: Phases.
- Inspirations: HeartGold, clones.
- Assets: Links.
- Owners/Reviewers.
- Next Step.

## Development Checklist
- Story Arcs: Quests, NPCs.
- Mechanics: Battle stats, leveling.
- Level Design: Maps, collision.
- Character Bios: Backstories, evolutions.
- Art Style: 16-bit pixel, animations.
- Sound/Music: MIDI, SFX (Web Audio).
- Balance: Difficulty, grind.
- Tech: Phaser 3, browsers, optimizations.
- Estimate/Team: Hours, roles.

## Evaluation Rubric (0-5, max 15)
- Desirability: Fan appeal, uniqueness.
- Viability: Browser fit, accessibility.
- Feasibility: Complexity, performance.
- Thresholds: 12-15=beta; 8-11=iterate; 0-7=archive.

## Checkpoints
- Validate: Compare to HeartGold, feedback.
- Prototype: Mockups (e.g., battle UI).
- Build: Assemble game.

## Handoff
- Code, assets, guides, balance.

## Tools/Resources
- Design: Aseprite; share links.
- Prototyping: Phaser.js; GitHub Pages.
- Coding: JS/Canvas; Copilot.
- Validation: DevTools, itch.io.
- Copilot: "JS type chart", "Gym art ideas".

## Accessibility/Privacy
- Palettes, controls, subtitles.
- Open-source, no data collection.

## Cadences
- Daily async updates.
- Weekly demos.
- Archive inactive.

## Tips
- Faithful to HeartGold, adapt for browser (localStorage saves).
- Fun over grind; measure engagement.
- Use Copilot for ideas.

## FAQs
- Start: Issue with template.
- Vague? Sub-issues.
- Copilot: Generates code/assets.
- Pitfalls: Over-engineer; focus MVP; browser limits.
- Legal: Fan project, avoid branding.

## Setup
1. Clone repo: `git clone https://github.com/ChimeraProject/Pokemon-esque-game.git`
2. Install: `npm install`
3. Run: `npm start` (opens at http://localhost:8080)
4. Test: `npm test` (runs Jest tests)
5. Deploy: Push to `main`, enable GitHub Pages.

## Controls
- **WASD / Arrow Keys**: Move player
- **R**: Generate new procedural map
- **C**: Generate cave/dungeon map
- **Enter/Escape**: Open/close menu

## Project Structure
- `assets/`: Art, audio, data (e.g., tilesets, sprites)
- `src/`: JS code modules
  - `src/battles/`: Battle system, Pokemon, Party, Damage calculations
  - `src/world/`: Procedural generation, TileSet definitions
  - `src/overworld/`: Overworld rendering and player movement
  - `src/ui/`: UI components (BattleUI, MenuUI, UIManager)
  - `src/core/`: Core systems (AssetLoader, ObjectPool, PerformanceMonitor)
- `tests/`: Jest test files
- `index.html`: Game entry

## Architecture

### Battle System (`src/battles/`)
- `BattleSystem.js` - Main battle controller
- `Pokemon.js` - Pokemon data structure with stats, types, status effects
- `Party.js` - Party management (up to 6 Pokemon)
- `DamageCalculator.js` - Damage formulas with STAB, type effectiveness
- `DifficultyManager.js` - Difficulty scaling and adaptive difficulty
- `LootSystem.js` - Item drops and reward tables

### World Generation (`src/world/`)
- `ProceduralGenerator.js` - Noise-based terrain and cave generation
- `TileSet.js` - Tile type definitions and properties

### UI System (`src/ui/`)
- `UIManager.js` - Base UI rendering utilities
- `BattleUI.js` - Battle screen interface
- `MenuUI.js` - Pause menu system

### Core Systems (`src/core/`)
- `AssetLoader.js` - Asset loading and caching
- `ObjectPool.js` - Object pooling for performance
- `PerformanceMonitor.js` - FPS tracking and metrics

## Contact / Contributing
Contributions welcome. Open issues in the repository for features, bugs, and asset additions. Follow the Development Concept Template for new component work.

Contribute ideas/issues! 🚀