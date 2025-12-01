/**
 * Johto Map Generator
 * Creates tile data for all Johto locations
 */

import { TILE_TYPES } from '../config.js';

const W = TILE_TYPES.WATER;
const G = TILE_TYPES.GRASS;
const P = TILE_TYPES.PATH;
const T = TILE_TYPES.TREE;
const R = TILE_TYPES.WALL;

export const JOHTO_MAPS = {
  newBarkTown: {
    id: 'new-bark-town',
    name: 'New Bark Town',
    width: 12,
    height: 10,
    tiles: [
      [R, R, R, R, R, R, R, R, R, R, R, R],
      [R, T, P, P, P, T, T, P, P, P, T, R],
      [R, P, P, G, P, T, T, P, P, G, P, R],
      [R, T, P, P, P, P, P, P, P, P, T, R],
      [R, P, P, G, P, P, P, P, P, G, P, R],
      [R, P, P, P, P, P, P, P, P, P, P, R],
      [R, T, P, P, P, P, P, P, P, P, T, R],
      [R, P, P, P, P, P, P, P, P, P, P, R],
      [R, P, P, P, P, P, P, P, P, P, P, R],
      [R, R, R, R, R, P, P, R, R, R, R, R],
    ]
  },

  route29: {
    id: 'route-29',
    name: 'Route 29',
    width: 20,
    height: 20,
    tiles: [
      [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
      [R, T, T, G, G, G, G, G, G, G, T, T, T, T, T, T, T, T, T, R],
      [R, T, P, P, P, P, P, P, P, G, G, G, T, T, T, T, T, T, T, R],
      [R, T, P, G, G, G, G, G, P, G, G, G, T, T, T, T, T, T, T, R],
      [R, G, P, G, G, G, G, G, P, G, G, G, G, T, T, T, T, T, T, R],
      [R, G, P, G, G, G, G, G, P, G, G, G, G, G, G, T, T, T, T, R],
      [R, G, G, G, G, G, G, G, P, G, G, G, G, G, G, G, T, T, T, R],
      [R, G, G, G, G, G, G, G, P, P, P, G, G, G, G, G, G, T, T, R],
      [R, G, G, G, T, G, G, G, G, G, P, G, G, G, G, G, G, G, T, R],
      [R, G, G, G, G, G, G, G, G, G, P, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, G, G, G, P, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, G, G, G, P, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, G, G, G, P, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, G, G, G, P, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, G, G, G, P, P, P, G, G, G, G, G, G, R],
      [R, G, G, G, T, G, G, G, G, G, G, G, P, G, G, G, G, G, G, R],
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R],
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R],
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R],
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R],
    ]
  },

  cherrygroveCity: {
    id: 'cherrygrove-city',
    name: 'Cherrygrove City',
    width: 15,
    height: 12,
    tiles: [
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R, R],
      [R, T, P, P, P, T, T, P, P, P, P, T, T, T, R],
      [R, T, P, P, P, T, T, P, P, G, P, T, T, T, R],
      [R, T, P, P, P, P, P, P, P, P, P, T, T, T, R],
      [R, P, P, P, P, P, P, P, P, P, P, P, T, T, R],
      [R, P, P, G, P, P, P, P, P, P, P, P, T, T, R],
      [R, P, P, P, P, P, P, P, P, P, P, P, P, T, R],
      [R, P, P, P, P, P, P, P, P, P, P, P, P, P, R],
      [R, P, P, P, P, P, P, P, P, P, P, P, P, P, R],
      [R, P, P, P, P, P, P, P, P, P, P, P, P, P, R],
      [R, P, P, P, P, P, P, P, P, P, P, P, P, P, R],
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R, R],
    ]
  },

  route30: {
    id: 'route-30',
    name: 'Route 30',
    width: 20,
    height: 20,
    tiles: [
      [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
      [R, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, P, G, G, G, G, G, G, T, T, T, T, G, G, G, G, G, R],
      [R, G, G, P, G, G, G, G, G, T, T, T, T, T, G, G, G, G, G, R],
      [R, G, T, P, G, G, G, G, T, T, T, T, T, T, G, G, G, G, G, R],
      [R, G, T, P, G, G, G, G, T, T, T, T, T, T, G, G, G, G, G, R],
      [R, G, G, P, P, P, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, P, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, P, P, P, P, P, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, P, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R],
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R],
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R, R],
    ]
  },

  darkCave: {
    id: 'dark-cave',
    name: 'Dark Cave',
    width: 15,
    height: 12,
    tiles: [
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R, R],
      [R, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, G, G, G, G, G, G, G, G, G, G, G, G, G, R],
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R, R],
    ]
  },

  violetCity: {
    id: 'violet-city',
    name: 'Violet City',
    width: 15,
    height: 14,
    tiles: [
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R, R],
      [R, T, P, P, P, P, T, T, P, P, P, P, T, T, R],
      [R, T, P, P, P, P, T, T, P, P, P, P, T, T, R],
      [R, T, P, P, P, P, P, P, P, P, P, P, T, T, R],
      [R, P, P, P, P, P, P, P, P, P, P, P, P, T, R],
      [R, P, P, P, P, P, P, P, P, P, P, P, P, P, R],
      [R, P, P, P, P, P, P, P, P, P, P, P, P, P, R],
      [R, P, P, P, P, P, P, P, P, P, P, P, P, P, R],
      [R, P, P, P, P, P, P, P, P, P, P, P, P, P, R],
      [R, P, P, P, P, P, P, P, P, P, P, P, P, P, R],
      [R, P, P, P, P, P, P, P, P, P, P, P, P, P, R],
      [R, P, P, P, P, P, P, P, P, P, P, P, P, P, R],
      [R, P, P, P, P, P, P, P, P, P, P, P, P, P, R],
      [R, R, R, R, R, R, R, R, R, R, R, R, R, R, R],
    ]
  }
};

export default JOHTO_MAPS;
