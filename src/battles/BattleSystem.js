/**
 * Turn-Based Battle System
 * Handles battle logic, damage calculation, status effects
 */

export class BattleSystem {
  constructor(playerTeam, enemyTeam) {
    this.playerTeam = playerTeam;
    this.enemyTeam = enemyTeam;
    
    this.currentTurn = 0;
    this.playerActive = playerTeam[0];
    this.enemyActive = enemyTeam[0];
    
    this.battleLog = [];
  }

  /**
   * Calculate damage based on type matchup and stats
   */
  calculateDamage(attacker, defender, move) {
    // Use calculated stats if available, fallback to base stats
    const atkStat = attacker.stats?.attack || attacker.stats?.atk || 49;
    const defStat = defender.stats?.defense || defender.stats?.def || 49;
    
    let damage = (2 * atkStat / 5 + 2) * (move.power || 40) / defStat + 2;
    
    // Type effectiveness
    const effectiveness = this.getTypeEffectiveness(move.type, defender.type);
    damage *= effectiveness;
    
    // Random factor (0.85 - 1.0)
    damage *= (0.85 + Math.random() * 0.15);
    
    return Math.floor(damage);
  }

  /**
   * Get type effectiveness multiplier
   */
  getTypeEffectiveness(attackType, defenderTypes) {
    // Type effectiveness chart
    const typeChart = {
      normal: { super: [], weak: ['rock', 'steel'], resists: [] },
      fire: { super: ['grass', 'ice', 'bug', 'steel'], weak: ['water', 'ground', 'rock'], resists: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'] },
      water: { super: ['fire', 'ground', 'rock'], weak: ['electric', 'grass'], resists: ['fire', 'water', 'ice', 'steel'] },
      electric: { super: ['water', 'flying'], weak: ['ground'], resists: ['electric', 'flying', 'steel'] },
      grass: { super: ['water', 'ground', 'rock'], weak: ['fire', 'ice', 'poison', 'flying', 'bug'], resists: ['ground', 'water', 'grass', 'electric'] },
      ice: { super: ['flying', 'ground', 'grass', 'dragon'], weak: ['fire', 'fighting', 'rock', 'steel'], resists: ['ice'] },
      fighting: { super: ['normal', 'rock', 'steel', 'ice', 'dark'], weak: ['flying', 'psychic', 'fairy'], resists: ['rock', 'bug', 'dark'] },
      poison: { super: ['grass', 'fairy'], weak: ['ground', 'psychic'], resists: ['fighting', 'poison', 'bug', 'grass'] },
      ground: { super: ['fire', 'poison', 'rock', 'electric', 'steel'], weak: ['water', 'grass', 'ice'], resists: ['poison', 'rock'] },
      flying: { super: ['fighting', 'bug', 'grass'], weak: ['electric', 'ice', 'rock'], resists: ['fighting', 'bug', 'grass'] },
      psychic: { super: ['fighting', 'poison'], weak: ['bug', 'ghost', 'dark'], resists: ['fighting', 'psychic'] },
      bug: { super: ['grass', 'psychic', 'dark'], weak: ['fire', 'flying', 'rock'], resists: ['fighting', 'ground', 'grass'] },
      rock: { super: ['fire', 'ice', 'flying', 'bug'], weak: ['water', 'grass', 'fighting', 'ground', 'steel'], resists: ['normal', 'flying', 'poison', 'fire'] },
      ghost: { super: ['psychic', 'ghost'], weak: ['ghost', 'dark'], resists: ['poison', 'bug'] },
      dragon: { super: ['dragon'], weak: ['ice', 'dragon', 'fairy'], resists: ['fire', 'water', 'grass', 'electric'] },
      dark: { super: ['psychic', 'ghost'], weak: ['fighting', 'bug', 'fairy'], resists: ['ghost', 'dark'] },
      steel: { super: ['ice', 'rock', 'fairy'], weak: ['fire', 'fighting', 'ground'], resists: ['normal', 'flying', 'rock', 'bug', 'steel', 'grass', 'psychic', 'ice', 'dragon', 'fairy'] },
      fairy: { super: ['fighting', 'dragon', 'dark'], weak: ['poison', 'steel'], resists: ['fighting', 'bug', 'dark'] }
    };

    // Ensure defenderTypes is an array
    if (!Array.isArray(defenderTypes)) {
      defenderTypes = [defenderTypes];
    }

    let effectiveness = 1.0;

    // Check against each defender type
    for (const defType of defenderTypes) {
      if (typeChart[attackType]) {
        if (typeChart[attackType].super.includes(defType)) {
          effectiveness *= 2.0;  // Super effective
        } else if (typeChart[attackType].weak.includes(defType)) {
          effectiveness *= 0.5;  // Not very effective
        }
      }
    }

    return effectiveness;
  }

  /**
   * Execute attack
   */
  executeAttack(attacker, defender, move) {
    const damage = this.calculateDamage(attacker, defender, move);
    defender.currentHp = Math.max(0, defender.currentHp - damage);
    
    this.battleLog.push(`${attacker.name} used ${move.name}! It's ${damage} damage!`);
    
    return damage;
  }

  /**
   * Switch active Pokemon
   */
  switchPokemon(team, index) {
    if (index < team.length && team[index].currentHp > 0) {
      if (team === this.playerTeam) {
        this.playerActive = team[index];
      } else {
        this.enemyActive = team[index];
      }
      return true;
    }
    return false;
  }

  /**
   * Check if battle is over
   */
  isBattleOver() {
    const playerAllFainted = this.playerTeam.every(p => p.currentHp <= 0);
    const enemyAllFainted = this.enemyTeam.every(p => p.currentHp <= 0);
    
    return playerAllFainted || enemyAllFainted;
  }

  /**
   * Get winner
   */
  getWinner() {
    if (this.playerTeam.every(p => p.currentHp <= 0)) {
      return 'enemy';
    } else if (this.enemyTeam.every(p => p.currentHp <= 0)) {
      return 'player';
    }
    return null;
  }
}
