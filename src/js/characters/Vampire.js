import Character from "../Character";

class Vampire extends Character {
  constructor(level) {
    super(level, "vampire");
    this.attack = 25;
    this.defence = 25;
  }
}

export default Vampire;
