/**
 * Pokemon Database
 * Stats, types, moves for all Pokemon
 * Complete Gen I-III database
 */

import { POKEMON_COMPLETE } from './pokemon-complete.js';

// Re-export the complete database as the primary POKEMON object
export const POKEMON = POKEMON_COMPLETE;

// Keep legacy export for compatibility
export const POKEMON_LEGACY = {
  // Johto starters
  chikorita: {
    id: 152,
    name: "Chikorita",
    type: ["grass"],
    stats: {
      hp: 45,
      atk: 49,
      def: 65,
      spa: 49,
      spd: 65,
      spe: 45
    },
    moves: ["tackle", "growl"],
    baseExp: 64
  },

  cyndaquil: {
    id: 155,
    name: "Cyndaquil",
    type: ["fire"],
    stats: {
      hp: 39,
      atk: 52,
      def: 43,
      spa: 60,
      spd: 50,
      spe: 65
    },
    moves: ["tackle", "leer"],
    baseExp: 62
  },

  totodile: {
    id: 158,
    name: "Totodile",
    type: ["water"],
    stats: {
      hp: 50,
      atk: 65,
      def: 64,
      spa: 59,
      spd: 63,
      spe: 43
    },
    moves: ["scratch", "leer"],
    baseExp: 63
  },

  // Common early-game Pokemon
  pidgeot: {
    id: 18,
    name: "Pidgeot",
    type: ["normal", "flying"],
    stats: {
      hp: 83,
      atk: 107,
      def: 90,
      spa: 90,
      spd: 100,
      spe: 101
    },
    moves: ["peck", "brave-bird"],
    baseExp: 172
  },

  raticate: {
    id: 20,
    name: "Raticate",
    type: ["normal"],
    stats: {
      hp: 75,
      atk: 71,
      def: 70,
      spa: 40,
      spd: 80,
      spe: 97
    },
    moves: ["tackle", "quick-attack"],
    baseExp: 115
  },

  // Early game common Pokemon
  rattata: {
    id: 19,
    name: "Rattata",
    type: ["normal"],
    stats: {
      hp: 30,
      atk: 56,
      def: 35,
      spa: 25,
      spd: 35,
      spe: 72
    },
    moves: ["tackle", "quick-attack"],
    baseExp: 51
  },

  pidgeotto: {
    id: 17,
    name: "Pidgeotto",
    type: ["normal", "flying"],
    stats: {
      hp: 63,
      atk: 60,
      def: 55,
      spa: 50,
      spd: 50,
      spe: 71
    },
    moves: ["peck", "brave-bird"],
    baseExp: 113
  },

  sentret: {
    id: 161,
    name: "Sentret",
    type: ["normal"],
    stats: {
      hp: 35,
      atk: 46,
      def: 34,
      spa: 35,
      spd: 35,
      spe: 20
    },
    moves: ["tackle", "scratch"],
    baseExp: 51
  },

  hoothoot: {
    id: 163,
    name: "Hoothoot",
    type: ["normal", "flying"],
    stats: {
      hp: 30,
      atk: 36,
      def: 52,
      spa: 40,
      spd: 47,
      spe: 27
    },
    moves: ["peck", "growl"],
    baseExp: 58
  },

  spinarak: {
    id: 167,
    name: "Spinarak",
    type: ["bug", "poison"],
    stats: {
      hp: 40,
      atk: 60,
      def: 40,
      spa: 40,
      spd: 40,
      spe: 30
    },
    moves: ["poison-powder", "tackle"],
    baseExp: 58
  },

  ledyba: {
    id: 165,
    name: "Ledyba",
    type: ["bug", "flying"],
    stats: {
      hp: 40,
      atk: 40,
      def: 40,
      spa: 40,
      spd: 80,
      spe: 55
    },
    moves: ["peck", "tackle"],
    baseExp: 66
  }
};

export const TYPE_CHART = {
  normal: { resists: [], weak: ["fighting"], strong: [] },
  fire: { resists: ["fire", "grass", "ice", "bug", "steel", "fairy"], weak: ["water", "ground", "rock"], strong: ["grass", "ice", "bug", "steel"] },
  water: { resists: ["fire", "water", "ice", "steel"], weak: ["electric", "grass"], strong: ["fire", "ground", "rock"] },
  electric: { resists: ["electric", "flying", "steel"], weak: ["ground"], strong: ["water", "flying"] },
  grass: { resists: ["ground", "water", "grass", "electric"], weak: ["fire", "ice", "poison", "flying", "bug"], strong: ["water", "ground", "rock"] },
  ice: { resists: ["ice"], weak: ["fire", "fighting", "rock", "steel"], strong: ["flying", "ground", "grass", "dragon"] },
  fighting: { resists: ["rock", "bug", "dark"], weak: ["flying", "psychic", "fairy"], strong: ["normal", "rock", "steel", "ice", "dark"] },
  poison: { resists: ["fighting", "poison", "bug", "grass"], weak: ["ground", "psychic"], strong: ["grass", "fairy"] },
  ground: { resists: ["poison", "rock"], weak: ["water", "grass", "ice"], strong: ["fire", "poison", "rock", "electric", "steel"] },
  flying: { resists: ["fighting", "bug", "grass"], weak: ["electric", "ice", "rock"], strong: ["fighting", "bug", "grass"] },
  psychic: { resists: ["fighting", "psychic"], weak: ["bug", "ghost", "dark"], strong: ["fighting", "poison"] },
  bug: { resists: ["fighting", "ground", "grass"], weak: ["fire", "flying", "rock"], strong: ["grass", "psychic", "dark"] },
  rock: { resists: ["normal", "flying", "poison", "fire"], weak: ["water", "grass", "fighting", "ground", "steel"], strong: ["fire", "ice", "flying", "bug"] },
  ghost: { resists: ["poison", "bug"], weak: ["ghost", "dark"], strong: ["psychic", "ghost"] },
  dragon: { resists: ["fire", "water", "grass", "electric"], weak: ["ice", "dragon", "fairy"], strong: ["dragon"] },
  dark: { resists: ["ghost", "dark"], weak: ["fighting", "bug", "fairy"], strong: ["psychic", "ghost"] },
  steel: { resists: ["normal", "flying", "rock", "bug", "steel", "grass", "psychic", "ice", "dragon", "fairy"], weak: ["fire", "fighting", "ground"], strong: ["ice", "rock", "fairy"] },
  fairy: { resists: ["fighting", "bug", "dark"], weak: ["poison", "steel"], strong: ["fighting", "dragon", "dark"] }
};
