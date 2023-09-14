class GameState {
  constructor() {
    this.currentMove = 'good';
    this.allowedMoves = null;
    this.allowedAttack = null;
    this.selectedHero = null;
    this.themes = ['mountain', 'arctic', 'desert', 'prairie'];

    this.totalReset = this.totalReset.bind(this);
    this.nextTheme = this.nextTheme.bind(this);
    this.saveDataGame = this.saveDataGame.bind(this);
  }

  totalReset() {
    this.allowedMoves = null;
    this.allowedAttack = null;
    this.selectedHero = null;
  }

  nextTheme() {
    if (this.themes.length > 1) {
      return this.themes.pop();
    }
    return this.themes[0];
  }

  saveDataGame(level, currentTheme, goodTeam, evilTeam) {
    const saveDataObject = {
      level,
      currentTheme,
      nextThemes: this.themes,
      goodTeam,
      evilTeam,
    };
    return saveDataObject;
  }

  newGame() {
    this.totalReset();
    this.currentMove = 'good';
    this.themes = ['mountain', 'arctic', 'desert', 'prairie'];
  }
}

export default GameState;
