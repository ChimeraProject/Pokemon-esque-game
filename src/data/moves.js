/**
 * Move Database
 * All Pokemon moves with stats
 */

export const MOVES = {
  tackle: {
    id: 1,
    name: "Tackle",
    type: "normal",
    category: "physical",
    power: 40,
    accuracy: 100,
    pp: 35,
    description: "A physical attack in which the user charges and slams into the foe."
  },

  growl: {
    id: 45,
    name: "Growl",
    type: "normal",
    category: "status",
    power: 0,
    accuracy: 100,
    pp: 40,
    description: "The user growls in an endearing way, lowering the foe's Attack."
  },

  leer: {
    id: 43,
    name: "Leer",
    type: "normal",
    category: "status",
    power: 0,
    accuracy: 100,
    pp: 30,
    description: "The foe is given an intimidating leer with sharp eyes. The target's Defense drops."
  },

  scratch: {
    id: 10,
    name: "Scratch",
    type: "normal",
    category: "physical",
    power: 40,
    accuracy: 100,
    pp: 35,
    description: "Hard, pointed, sharp claws rake the target."
  },

  ember: {
    id: 33,
    name: "Ember",
    type: "fire",
    category: "special",
    power: 40,
    accuracy: 100,
    pp: 25,
    description: "The target is attacked with small flames. It may also leave the target with a burn."
  },

  water: {
    id: 53,
    name: "Water Gun",
    type: "water",
    category: "special",
    power: 40,
    accuracy: 100,
    pp: 25,
    description: "The foe is soaked with a forceful spray of water."
  },

  peck: {
    id: 64,
    name: "Peck",
    type: "flying",
    category: "physical",
    power: 35,
    accuracy: 100,
    pp: 35,
    description: "The target is jabbed with a sharply pointed beak."
  },

  "quick-attack": {
    id: 98,
    name: "Quick Attack",
    type: "normal",
    category: "physical",
    power: 40,
    accuracy: 100,
    pp: 30,
    description: "The user moves at high speed and strikes before the foe."
  },

  "brave-bird": {
    id: 413,
    name: "Brave Bird",
    type: "flying",
    category: "physical",
    power: 120,
    accuracy: 100,
    pp: 15,
    description: "The user tucks in its wings and charges forward at a foe at maximum speed."
  },

  "poison-powder": {
    id: 75,
    name: "Poison Powder",
    type: "poison",
    category: "status",
    power: 0,
    accuracy: 75,
    pp: 35,
    description: "The user scatters a cloud of poisonous dust on the target. It may poison the target."
  },

  "string-shot": {
    id: 40,
    name: "String Shot",
    type: "bug",
    category: "status",
    power: 0,
    accuracy: 95,
    pp: 40,
    description: "The target is bound with silk blown from the user's mouth that hardens upon contact."
  },

  "confusion": {
    id: 33,
    name: "Confusion",
    type: "psychic",
    category: "special",
    power: 50,
    accuracy: 100,
    pp: 25,
    description: "The target is hit by a weak telekinetic force. It may also confuse the target."
  },

  "hypnosis": {
    id: 95,
    name: "Hypnosis",
    type: "psychic",
    category: "status",
    power: 0,
    accuracy: 60,
    pp: 20,
    description: "The user hypnotizes the target into a deep sleep."
  },

  "sonicboom": {
    id: 49,
    name: "Sonic Boom",
    type: "normal",
    category: "special",
    power: 90,
    accuracy: 100,
    pp: 20,
    description: "The user generates a shock wave by violently trembling its wings."
  },

  "wing-attack": {
    id: 17,
    name: "Wing Attack",
    type: "flying",
    category: "physical",
    power: 60,
    accuracy: 100,
    pp: 35,
    description: "The target is struck with a large and imposing wing."
  },

  "bite": {
    id: 44,
    name: "Bite",
    type: "dark",
    category: "physical",
    power: 60,
    accuracy: 100,
    pp: 25,
    description: "The target is bitten with sharp fangs. It may also make the target flinch."
  },

  "fury-swipes": {
    id: 18,
    name: "Fury Swipes",
    type: "normal",
    category: "physical",
    power: 18,
    accuracy: 80,
    pp: 15,
    description: "The target is raked with sharp claws or thorns roughly 2 to 5 times in quick succession."
  },

  "focus-energy": {
    id: 116,
    name: "Focus Energy",
    type: "normal",
    category: "status",
    power: 0,
    accuracy: 100,
    pp: 30,
    description: "The user focuses its will to sharpen its spells. This increases the user's critical-hit ratio."
  }
};
