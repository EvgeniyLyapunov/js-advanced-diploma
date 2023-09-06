import Character from "./Character";

class Swordsman extends Character {
  constructor(level) {
    super(level, "swordsman");
    this.attack = 40;
    this.defence = 10;
  }
}

export default Swordsman;
