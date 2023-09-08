export default class GameState {
  static currentMove = "good";
  static allowedMoves = null;
  static allowedAttack = null;
  static selectedHero = null;

  static totalReset() {
    GameState.allowedMoves = null;
    GameState.allowedAttack = null;
    GameState.selectedHero = null;
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
