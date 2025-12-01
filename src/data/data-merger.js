/**
 * Data Merger - Combines extracted ROM assets with custom game data
 * Ensures manual data takes priority over extracted data
 */

export function mergePokemonData(extracted, custom) {
  return {
    ...extracted,
    ...custom
  };
}

export function mergeMovesData(extracted, custom) {
  return {
    ...extracted,
    ...custom
  };
}

export function mergeEncounters(extracted, custom) {
  return {
    ...extracted,
    ...custom
  };
}

export function mergeMaps(extracted, custom) {
  return {
    ...extracted,
    ...custom
  };
}

export function mergeTrainers(extracted, custom) {
  return {
    ...extracted,
    ...custom
  };
}

export default {
  mergePokemonData,
  mergeMovesData,
  mergeEncounters,
  mergeMaps,
  mergeTrainers
};
