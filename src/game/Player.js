/**
 * Player class to manage player state, inventory, and Pokemon team
 */
export class Player {
  constructor(name = 'Trainer') {
    this.name = name;
    this.level = 1;
    this.experience = 0;
    this.money = 0;
    this.team = [];
    this.inventory = [];
    this.badges = [];
    this.pokedex = {};
    this.currentMapId = 'new-bark-town';
    this.position = { x: 10, y: 10 };
  }

  addPokemon(pokemon) {
    if (this.team.length < 6) {
      this.team.push(pokemon);
      return true;
    }
    return false;
  }

  removePokemon(index) {
    if (index >= 0 && index < this.team.length) {
      this.team.splice(index, 1);
      return true;
    }
    return false;
  }

  addBadge(badge) {
    if (!this.badges.includes(badge)) {
      this.badges.push(badge);
    }
  }

  addMoney(amount) {
    this.money += amount;
  }

  spendMoney(amount) {
    if (this.money >= amount) {
      this.money -= amount;
      return true;
    }
    return false;
  }

  gainExperience(amount) {
    this.experience += amount;
  }

  save() {
    const saveData = {
      name: this.name,
      level: this.level,
      experience: this.experience,
      money: this.money,
      badges: this.badges,
      team: this.team,
      currentMapId: this.currentMapId,
      position: this.position,
    };
    localStorage.setItem('pokemonSave', JSON.stringify(saveData));
  }

  load() {
    const saveData = localStorage.getItem('pokemonSave');
    if (saveData) {
      const data = JSON.parse(saveData);
      Object.assign(this, data);
      return true;
    }
    return false;
  }
}
