import Character from "../Character";

class Daemon extends Character {
  constructor(level) {
    super(level, "daemon");
    this.attack = 10;
    this.defence = 10;
  }
}

export default Daemon;
