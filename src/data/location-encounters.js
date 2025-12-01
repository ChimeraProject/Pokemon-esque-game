/**
 * Pokemon Encounter Pools by Location
 * Location-specific wild Pokemon encounters for all Johto routes and cities
 */

export const LOCATION_ENCOUNTERS = {
  'route-29': {
    name: 'Route 29',
    encounters: [
      { species: 'pidgeey', level: [3, 6], rate: 0.3 },
      { species: 'rattata', level: [2, 5], rate: 0.4 },
      { species: 'sentret', level: [3, 6], rate: 0.3 }
    ]
  },

  'route-30': {
    name: 'Route 30',
    encounters: [
      { species: 'pidgeey', level: [3, 7], rate: 0.3 },
      { species: 'rattata', level: [2, 6], rate: 0.3 },
      { species: 'sentret', level: [3, 7], rate: 0.25 },
      { species: 'hoothoot', level: [3, 7], rate: 0.15 }
    ]
  },

  'route-31': {
    name: 'Route 31',
    encounters: [
      { species: 'pidgeey', level: [3, 8], rate: 0.25 },
      { species: 'rattata', level: [2, 8], rate: 0.3 },
      { species: 'sentret', level: [3, 8], rate: 0.25 },
      { species: 'hoothoot', level: [3, 8], rate: 0.2 }
    ]
  },

  'route-32': {
    name: 'Route 32',
    encounters: [
      { species: 'rattata', level: [4, 9], rate: 0.2 },
      { species: 'sentret', level: [4, 9], rate: 0.2 },
      { species: 'hoothoot', level: [4, 9], rate: 0.2 },
      { species: 'pidgeey', level: [4, 9], rate: 0.2 },
      { species: 'spinarak', level: [5, 10], rate: 0.2 }
    ]
  },

  'route-33': {
    name: 'Route 33',
    encounters: [
      { species: 'hoothoot', level: [6, 15], rate: 0.2 },
      { species: 'geodude', level: [6, 15], rate: 0.3 },
      { species: 'onix', level: [8, 15], rate: 0.2 },
      { species: 'phanpy', level: [8, 15], rate: 0.3 }
    ]
  },

  'route-34': {
    name: 'Route 34',
    encounters: [
      { species: 'bellsprout', level: [5, 16], rate: 0.25 },
      { species: 'weepinbell', level: [8, 18], rate: 0.15 },
      { species: 'mankey', level: [6, 16], rate: 0.25 },
      { species: 'growlithe', level: [7, 17], rate: 0.2 },
      { species: 'pidgeey', level: [8, 18], rate: 0.15 }
    ]
  },

  'route-35': {
    name: 'Route 35',
    encounters: [
      { species: 'growlithe', level: [10, 20], rate: 0.2 },
      { species: 'mankey', level: [10, 20], rate: 0.25 },
      { species: 'pidgeot', level: [12, 22], rate: 0.25 },
      { species: 'girafarig', level: [15, 25], rate: 0.3 }
    ]
  },

  'route-36': {
    name: 'Route 36',
    encounters: [
      { species: 'growlithe', level: [10, 20], rate: 0.25 },
      { species: 'pidgeot', level: [12, 22], rate: 0.3 },
      { species: 'tauros', level: [15, 25], rate: 0.25 },
      { species: 'mareep', level: [13, 23], rate: 0.2 }
    ]
  },

  'route-37': {
    name: 'Route 37',
    encounters: [
      { species: 'growlithe', level: [11, 21], rate: 0.25 },
      { species: 'pidgeot', level: [13, 23], rate: 0.25 },
      { species: 'tauros', level: [15, 25], rate: 0.25 },
      { species: 'mareep', level: [14, 24], rate: 0.25 }
    ]
  },

  'route-38': {
    name: 'Route 38',
    encounters: [
      { species: 'growlithe', level: [15, 28], rate: 0.25 },
      { species: 'tauros', level: [17, 30], rate: 0.25 },
      { species: 'pidgeot', level: [17, 30], rate: 0.2 },
      { species: 'miltank', level: [18, 31], rate: 0.3 }
    ]
  },

  'route-39': {
    name: 'Route 39',
    encounters: [
      { species: 'tauros', level: [17, 30], rate: 0.3 },
      { species: 'miltank', level: [18, 31], rate: 0.3 },
      { species: 'pidgeot', level: [17, 30], rate: 0.2 },
      { species: 'rapidash', level: [20, 33], rate: 0.2 }
    ]
  },

  'route-40': {
    name: 'Route 40',
    encounters: [
      { species: 'shellder', level: [20, 35], rate: 0.4 },
      { species: 'cloyster', level: [25, 40], rate: 0.2 },
      { species: 'krabby', level: [20, 35], rate: 0.4 }
    ]
  },

  'route-41': {
    name: 'Route 41',
    encounters: [
      { species: 'shellder', level: [20, 35], rate: 0.35 },
      { species: 'krabby', level: [20, 35], rate: 0.35 },
      { species: 'tentacool', level: [18, 33], rate: 0.3 }
    ]
  },

  'route-42': {
    name: 'Route 42',
    encounters: [
      { species: 'mankey', level: [15, 33], rate: 0.25 },
      { species: 'primeape', level: [20, 38], rate: 0.2 },
      { species: 'growlithe', level: [16, 34], rate: 0.25 },
      { species: 'arcanine', level: [20, 38], rate: 0.2 },
      { species: 'ponyta', level: [17, 35], rate: 0.1 }
    ]
  },

  'route-43': {
    name: 'Route 43',
    encounters: [
      { species: 'pidgeot', level: [18, 36], rate: 0.25 },
      { species: 'girafarig', level: [18, 36], rate: 0.25 },
      { species: 'tauros', level: [18, 36], rate: 0.25 },
      { species: 'flaaffy', level: [20, 38], rate: 0.25 }
    ]
  },

  'route-44': {
    name: 'Route 44',
    encounters: [
      { species: 'poliwag', level: [20, 38], rate: 0.25 },
      { species: 'poliwrath', level: [25, 43], rate: 0.15 },
      { species: 'slowbro', level: [25, 43], rate: 0.1 },
      { species: 'goldeen', level: [20, 38], rate: 0.25 },
      { species: 'seaking', level: [25, 43], rate: 0.25 }
    ]
  },

  'route-45': {
    name: 'Route 45',
    encounters: [
      { species: 'mankey', level: [20, 40], rate: 0.2 },
      { species: 'primeape', level: [25, 45], rate: 0.15 },
      { species: 'machop', level: [22, 42], rate: 0.25 },
      { species: 'machoke', level: [25, 45], rate: 0.2 },
      { species: 'graveler', level: [20, 40], rate: 0.2 }
    ]
  },

  'route-46': {
    name: 'Route 46',
    encounters: [
      { species: 'geodude', level: [15, 35], rate: 0.3 },
      { species: 'graveler', level: [20, 40], rate: 0.2 },
      { species: 'phanpy', level: [18, 38], rate: 0.3 },
      { species: 'donphan', level: [23, 43], rate: 0.2 }
    ]
  },

  'dark-cave': {
    name: 'Dark Cave',
    encounters: [
      { species: 'zubat', level: [4, 9], rate: 0.4 },
      { species: 'geodude', level: [5, 10], rate: 0.3 },
      { species: 'dunsparce', level: [5, 10], rate: 0.3 }
    ]
  },

  'union-cave': {
    name: 'Union Cave',
    encounters: [
      { species: 'zubat', level: [5, 12], rate: 0.4 },
      { species: 'goldeen', level: [5, 12], rate: 0.3 },
      { species: 'quagsire', level: [6, 13], rate: 0.3 }
    ]
  },

  'ilex-forest': {
    name: 'Ilex Forest',
    encounters: [
      { species: 'caterpie', level: [3, 12], rate: 0.25 },
      { species: 'metapod', level: [5, 15], rate: 0.15 },
      { species: 'weedle', level: [3, 12], rate: 0.25 },
      { species: 'kakuna', level: [5, 15], rate: 0.15 },
      { species: 'pidgeey', level: [5, 15], rate: 0.2 }
    ]
  },

  'national-park': {
    name: 'National Park',
    encounters: [
      { species: 'caterpie', level: [10, 20], rate: 0.2 },
      { species: 'weedle', level: [10, 20], rate: 0.2 },
      { species: 'butterfree', level: [13, 23], rate: 0.2 },
      { species: 'beedrill', level: [13, 23], rate: 0.2 },
      { species: 'pidgeey', level: [15, 25], rate: 0.2 }
    ]
  },

  'burned-tower': {
    name: 'Burned Tower',
    encounters: [
      { species: 'litwick', level: [15, 25], rate: 0.4 },
      { species: 'lampent', level: [18, 28], rate: 0.3 },
      { species: 'ponyta', level: [16, 26], rate: 0.3 }
    ]
  },

  'lake-of-rage': {
    name: 'Lake of Rage',
    encounters: [
      { species: 'krabby', level: [20, 40], rate: 0.3 },
      { species: 'kingler', level: [25, 45], rate: 0.15 },
      { species: 'shellder', level: [20, 40], rate: 0.3 },
      { species: 'goldeen', level: [20, 40], rate: 0.25 }
    ]
  },

  'dragons-den': {
    name: "Dragon's Den",
    encounters: [
      { species: 'dratini', level: [25, 40], rate: 0.4 },
      { species: 'dragonair', level: [30, 45], rate: 0.3 },
      { species: 'bagon', level: [32, 47], rate: 0.3 }
    ]
  },

  'mt-silver': {
    name: 'Mt. Silver',
    encounters: [
      { species: 'onix', level: [40, 50], rate: 0.25 },
      { species: 'steelix', level: [42, 52], rate: 0.2 },
      { species: 'graveler', level: [40, 50], rate: 0.25 },
      { species: 'rhyhorn', level: [40, 50], rate: 0.15 },
      { species: 'rhydon', level: [42, 52], rate: 0.15 }
    ]
  }
};

export default LOCATION_ENCOUNTERS;
