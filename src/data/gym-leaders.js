/**
 * Johto Gym Leaders and Trainers
 * All 8 Gym Leaders with proper teams and stats
 */

export const GYM_LEADERS = {
  falkner: {
    name: "Falkner",
    city: "Violet City",
    type: "flying",
    badge: "Zephyr Badge",
    portrait: "falkner",
    dialogue: {
      intro: "I've been waiting! I'm Falkner, the master of Flying Pokemon!",
      victory: "Your Pokemon is superior!",
      defeat: "I won't lose easily!"
    },
    team: [
      { species: "pidgeey", level: 9, moves: ["peck", "growl"] },
      { species: "pidgeotto", level: 11, moves: ["peck", "brave-bird"] },
      { species: "pidgeot", level: 13, moves: ["peck", "brave-bird"] }
    ],
    reward: { money: 840, exp: 1680 }
  },

  bugsy: {
    name: "Bugsy",
    city: "Azalea Town",
    type: "bug",
    badge: "Hive Badge",
    portrait: "bugsy",
    dialogue: {
      intro: "I've been waiting for a worthwhile opponent!",
      victory: "Whoa, amazing!",
      defeat: "My bugs and I aren't the most powerful around!"
    },
    team: [
      { species: "scyther", level: 16, moves: ["steel-wing", "x-scissor"] },
      { species: "scizor", level: 17, moves: ["bullet-punch", "x-scissor"] },
      { species: "heracross", level: 18, moves: ["close-combat", "earthquake"] }
    ],
    reward: { money: 1260, exp: 2520 }
  },

  whitney: {
    name: "Whitney",
    city: "Goldenrod City",
    type: "normal",
    badge: "Plain Badge",
    portrait: "whitney",
    dialogue: {
      intro: "You're challenging me? I'm busy!",
      victory: "Wow! You're strong!",
      defeat: "I'm the master of Normal Pokemon!"
    },
    team: [
      { species: "miltank", level: 20, moves: ["tackle", "body-slam"] }
    ],
    reward: { money: 1500, exp: 3000 }
  },

  morty: {
    name: "Morty",
    city: "Ecruteak City",
    type: "ghost",
    badge: "Fog Badge",
    portrait: "morty",
    dialogue: {
      intro: "I am the master of Ghost Pokemon!",
      victory: "You have a powerful team!",
      defeat: "My Pokemon are stronger!"
    },
    team: [
      { species: "gengar", level: 27, moves: ["shadow-ball", "psychic"] },
      { species: "misdreavus", level: 28, moves: ["shadow-ball", "psychic"] },
      { species: "gengar", level: 29, moves: ["shadow-ball", "psychic"] }
    ],
    reward: { money: 2100, exp: 4200 }
  },

  jasmine: {
    name: "Jasmine",
    city: "Olivine City",
    type: "steel",
    badge: "Mineral Badge",
    portrait: "jasmine",
    dialogue: {
      intro: "Steel Pokemon are the strongest!",
      victory: "I'm impressed!",
      defeat: "My Steel Pokemon are superior!"
    },
    team: [
      { species: "steelix", level: 30, moves: ["iron-head", "earthquake"] },
      { species: "steelix", level: 31, moves: ["iron-head", "earthquake"] },
      { species: "magneton", level: 32, moves: ["thunderbolt", "steel-wing"] }
    ],
    reward: { money: 2400, exp: 4800 }
  },

  chuck: {
    name: "Chuck",
    city: "Cianwood City",
    type: "fighting",
    badge: "Storm Badge",
    portrait: "chuck",
    dialogue: {
      intro: "Fighting moves are unbeatable!",
      victory: "You're strong!",
      defeat: "My fighting spirit is strong!"
    },
    team: [
      { species: "primeape", level: 33, moves: ["close-combat", "earthquake"] },
      { species: "machamp", level: 34, moves: ["close-combat", "earthquake"] },
      { species: "poliwrath", level: 35, moves: ["close-combat", "water-gun"] }
    ],
    reward: { money: 2700, exp: 5400 }
  },

  pryce: {
    name: "Pryce",
    city: "Mahogany Town",
    type: "ice",
    badge: "Glacier Badge",
    portrait: "pryce",
    dialogue: {
      intro: "Ice Pokemon are eternal!",
      victory: "You have incredible power!",
      defeat: "Ice is eternal!"
    },
    team: [
      { species: "piloswine", level: 37, moves: ["ice-beam", "earthquake"] },
      { species: "dewgong", level: 38, moves: ["ice-beam", "water-gun"] },
      { species: "lapras", level: 39, moves: ["ice-beam", "water-gun"] }
    ],
    reward: { money: 3000, exp: 6000 }
  },

  clair: {
    name: "Clair",
    city: "Blackthorn City",
    type: "dragon",
    badge: "Rising Badge",
    portrait: "clair",
    dialogue: {
      intro: "I am the Dragon Master!",
      victory: "You're a true champion!",
      defeat: "My Dragon Pokemon are superior!"
    },
    team: [
      { species: "dragonair", level: 41, moves: ["dragon-claw", "dragon-dance"] },
      { species: "dragonite", level: 42, moves: ["dragon-claw", "outrage"] },
      { species: "dragonite", level: 43, moves: ["dragon-claw", "outrage"] }
    ],
    reward: { money: 3300, exp: 6600 }
  }
};

export const ELITE_FOUR = {
  will: {
    name: "Will",
    type: "psychic",
    portrait: "will",
    team: [
      { species: "xatu", level: 40, moves: ["psychic", "air-slash"] },
      { species: "jynx", level: 41, moves: ["psychic", "ice-punch"] },
      { species: "exeggutor", level: 42, moves: ["psychic", "solar-beam"] }
    ],
    reward: { money: 3000, exp: 6000 }
  },

  koga: {
    name: "Koga",
    type: "poison",
    portrait: "koga",
    team: [
      { species: "muk", level: 40, moves: ["poison-gas", "earthquake"] },
      { species: "weezing", level: 41, moves: ["poison-gas", "shadow-ball"] },
      { species: "tentacruel", level: 42, moves: ["poison-gas", "water-gun"] }
    ],
    reward: { money: 3000, exp: 6000 }
  },

  bruno: {
    name: "Bruno",
    type: "fighting",
    portrait: "bruno",
    team: [
      { species: "machamp", level: 40, moves: ["close-combat", "earthquake"] },
      { species: "hitmonlee", level: 41, moves: ["high-kick", "earthquake"] },
      { species: "hitmonchan", level: 42, moves: ["fire-punch", "ice-punch"] }
    ],
    reward: { money: 3000, exp: 6000 }
  },

  karen: {
    name: "Karen",
    type: "dark",
    portrait: "karen",
    team: [
      { species: "umbreon", level: 40, moves: ["bite", "dark-pulse"] },
      { species: "houndoom", level: 41, moves: ["bite", "fire-blast"] },
      { species: "gengar", level: 42, moves: ["shadow-ball", "psychic"] }
    ],
    reward: { money: 3000, exp: 6000 }
  }
};

export const CHAMPION_LANCE = {
  name: "Lance",
  type: "dragon",
  portrait: "lance",
  dialogue: {
    intro: "I am the Champion! Prepare yourself!",
    victory: "You deserve the title of Champion!",
    defeat: "My dragons are the strongest!"
  },
  team: [
    { species: "dragonite", level: 46, moves: ["dragon-claw", "outrage"] },
    { species: "dragonite", level: 47, moves: ["dragon-claw", "outrage"] },
    { species: "dragonite", level: 48, moves: ["dragon-claw", "outrage"] },
    { species: "dragonite", level: 49, moves: ["dragon-claw", "outrage"] },
    { species: "dragonite", level: 50, moves: ["dragon-claw", "outrage"] },
    { species: "gyarados", level: 50, moves: ["earthquake", "water-gun"] }
  ],
  reward: { money: 9999, exp: 99999 }
};

export const RIVAL_TEAMS = {
  route29: {
    name: "Your Rival",
    team: [
      { species: "chikorita", level: 5, moves: ["tackle", "growl"] } // Or cyndaquil/totodile opposite to player starter
    ],
    reward: { money: 100, exp: 200 }
  },

  route32: {
    name: "Your Rival",
    team: [
      { species: "bayleef", level: 15, moves: ["tackle", "growl", "razor-leaf"] },
      { species: "pidgeotto", level: 16, moves: ["peck", "brave-bird"] }
    ],
    reward: { money: 250, exp: 500 }
  }
};

export default { GYM_LEADERS, ELITE_FOUR, CHAMPION_LANCE, RIVAL_TEAMS };
