/**
 * Battle System - Handles turn-based Pokemon battles
 */
export class BattleSystem {
  constructor(playerTeam, opponentTeam) {
    this.playerTeam = playerTeam;
    this.opponentTeam = opponentTeam;
    this.currentPlayerPokemon = playerTeam[0];
    this.currentOpponentPokemon = opponentTeam[0];
    this.turn = 0;
    this.battleLog = [];
  }

  calculateDamage(attacker, defender, move) {
    // Simplified damage calculation
    const level = attacker.level;
    const attack = attacker.stats.attack;
    const defense = defender.stats.defense;
    const basePower = move.power || 50;

    const damage = Math.floor(((2 * level + 10) / 250 * attack / defense * basePower + 2) * (Math.random() * 0.15 + 0.85));
    return Math.max(1, damage);
  }

  playerAttack(moveIndex) {
    if (!this.currentPlayerPokemon.moves[moveIndex]) {
      return false;
    }

    const move = this.currentPlayerPokemon.moves[moveIndex];
    const damage = this.calculateDamage(this.currentPlayerPokemon, this.currentOpponentPokemon, move);
    this.currentOpponentPokemon.takeDamage(damage);

    this.battleLog.push(`${this.currentPlayerPokemon.name} used ${move.name}! Dealt ${damage} damage!`);

    if (!this.currentOpponentPokemon.isAlive()) {
      this.battleLog.push(`${this.currentOpponentPokemon.name} fainted!`);
      return this.switchOpponentPokemon();
    }

    return true;
  }

  opponentAttack() {
    const moveIndex = Math.floor(Math.random() * this.currentOpponentPokemon.moves.length);
    const move = this.currentOpponentPokemon.moves[moveIndex];
    const damage = this.calculateDamage(this.currentOpponentPokemon, this.currentPlayerPokemon, move);
    this.currentPlayerPokemon.takeDamage(damage);

    this.battleLog.push(`${this.currentOpponentPokemon.name} used ${move.name}! Dealt ${damage} damage!`);

    if (!this.currentPlayerPokemon.isAlive()) {
      this.battleLog.push(`${this.currentPlayerPokemon.name} fainted!`);
      return this.switchPlayerPokemon();
    }

    return true;
  }

  switchPlayerPokemon() {
    const alive = this.playerTeam.find(p => p.isAlive());
    if (alive) {
      this.currentPlayerPokemon = alive;
      this.battleLog.push(`${this.currentPlayerPokemon.name} go!`);
      return true;
    }
    return false;
  }

  switchOpponentPokemon() {
    const alive = this.opponentTeam.find(p => p.isAlive());
    if (alive) {
      this.currentOpponentPokemon = alive;
      this.battleLog.push(`${this.currentOpponentPokemon.name} go!`);
      return true;
    }
    return false;
  }

  isPlayerWin() {
    return this.opponentTeam.every(p => !p.isAlive());
  }

  isPlayerLose() {
    return this.playerTeam.every(p => !p.isAlive());
  }
}
