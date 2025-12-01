# Pokemon-esque Game

A Pokemon-style game built with JavaScript and HTML5 Canvas.

## 🎮 Features

- **Overworld Exploration**: Navigate through various routes and towns
- **Turn-based Battles**: Classic Pokemon-style battle system (in progress)
- **Pixel Art Style**: Retro graphics with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- A modern web browser

### Running the Game

1. Clone the repository:
   ```bash
   git clone https://github.com/ChimeraProject/Pokemon-esque-game.git
   cd Pokemon-esque-game
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:8080`

### Running in GitHub Codespaces

1. Open this repository in GitHub Codespaces
2. Wait for the environment to initialize
3. Run `npm start` in the terminal
4. Click on the "Open in Browser" button when the port is forwarded

## 🎯 Controls

| Key | Action |
|-----|--------|
| Arrow Keys / WASD | Move character |
| Enter | Interact / Confirm |
| Escape | Menu / Cancel |

## 📁 Project Structure

```
pokemon-esque-game/
├── assets/
│   ├── art/        # Sprites and tilesets
│   ├── audio/      # Music and sound effects
│   └── data/       # JSON data files for maps, Pokemon, etc.
├── src/
│   ├── battles/    # Battle system modules
│   ├── overworld/  # Overworld and map modules
│   └── game.js     # Main game entry point
├── index.html      # HTML entry point
├── package.json    # Project configuration
└── README.md       # This file
```

## 🗺️ Current Implementation

### Route 29 (Starting Area)
The game currently features Route 29 as the starting area with:
- Grass tiles for wild Pokemon encounters
- Path tiles for safe travel
- Tree and water obstacles
- Grid-based movement system

## 🛠️ Development

### Building
No build step required - the game runs directly in the browser using ES modules.

### Adding New Maps
Maps are defined in the respective overworld files as 2D arrays. See `src/overworld/Overworld.js` for an example.

### Adding Pokemon Data
Pokemon data will be stored in `assets/data/` as JSON files.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.