export default class GameState {
  static currentMove = "good";
  static allowedMoves = null;
  static allowedAttack = null;
  static selectedHero = null;
  static themes = ["prairie", "desert", "arctic", "mountain"];

  static totalReset() {
    GameState.allowedMoves = null;
    GameState.allowedAttack = null;
    GameState.selectedHero = null;
  }

  static nextTheme() {
    if (GameState.themes.length > 1) {
      return GameState.themes.shift();
    }
    return GameState.themes[0];
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
