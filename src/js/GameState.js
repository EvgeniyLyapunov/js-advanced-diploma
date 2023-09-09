export default class GameState {
  static currentMove = 'good';

  static allowedMoves = null;

  static allowedAttack = null;

  static selectedHero = null;

  static themes = ['mountain', 'arctic', 'desert', 'prairie'];

  static totalReset() {
    GameState.allowedMoves = null;
    GameState.allowedAttack = null;
    GameState.selectedHero = null;
  }

  static nextTheme() {
    if (GameState.themes.length > 1) {
      return GameState.themes.pop();
    }
    return GameState.themes[0];
  }

  static saveDataGame(level, currentTheme, goodTeam, evilTeam) {
    const saveDataObject = {
      level,
      currentTheme,
      nextThemes: GameState.themes,
      goodTeam,
      evilTeam,
    };
    return saveDataObject;
  }

  static newGame() {
    GameState.totalReset();
    GameState.currentMove = 'good';
    GameState.themes = ['mountain', 'arctic', 'desert', 'prairie'];
  }
}
