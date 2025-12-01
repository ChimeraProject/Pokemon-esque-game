# Pokemon HeartGold Browser Clone

A faithful browser recreation of Pokemon HeartGold/SoulSilver, built with Phaser.js. Explore Johto, battle trainers, collect Pokemon, and relive the story—all in your browser at 60 FPS.

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
4. Deploy: Push to `main`, enable GitHub Pages.

## Project Structure
- `assets/`: Art, audio, data (e.g., tilesets, sprites)
- `src/`: JS code (overworld, battles, UI)
- `index.html`: Game entry

## Contact / Contributing
Contributions welcome. Open issues in the repository for features, bugs, and asset additions. Follow the Development Concept Template for new component work.

Contribute ideas/issues! 🚀