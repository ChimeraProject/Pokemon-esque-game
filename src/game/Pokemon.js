/**
 * Pokemon class representing individual Pokemon with stats and moves
 */
export class Pokemon {
  constructor(id, name, level, stats = {}, moves = []) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.stats = {
      hp: stats.hp || 100,
      attack: stats.attack || 100,
      defense: stats.defense || 100,
      spAtk: stats.spAtk || 100,
      spDef: stats.spDef || 100,
      speed: stats.speed || 100,
    };
    this.currentHp = this.stats.hp;
    this.moves = moves;
    this.experience = 0;
  }

  takeDamage(damage) {
    this.currentHp = Math.max(0, this.currentHp - damage);
  }

  heal(amount) {
    this.currentHp = Math.min(this.stats.hp, this.currentHp + amount);
  }

  isAlive() {
    return this.currentHp > 0;
  }
}
