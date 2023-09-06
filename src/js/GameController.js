import themes from "./themes";
import { generateTeam } from "./generators";
import { startPositions } from "./utils/utils";
import { heroFormatInfo } from "./utils/utilsHero";
import PositionedCharacter from "./characters/PositionedCharacter";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Vampire from "./characters/Vampire";
import Undead from "./characters/Undead";
import Daemon from "./characters/Daemon";
import GameState from "./GameState";
import GamePlay from "./GamePlay";
import cursors from "./cursors";
import { heroMove } from "./heroMove";
import { heroAttack } from "./heroAttack";
import { opponentsMove } from "./opponents.Move";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.goodAllowedTypes = [Bowman, Swordsman, Magician];
    this.evilAllowedTypes = [Vampire, Undead, Daemon];
    this.teamCount = 3;
    this.maxStartHeroLevel = 2;
    this.goodTeamPositions = [];
    this.evilTeamPositions = [];
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    const goodTeam = generateTeam(
      this.goodAllowedTypes,
      this.maxStartHeroLevel,
      this.teamCount
    );
    const goodStart = startPositions(
      this.gamePlay.boardSize,
      "good",
      this.teamCount
    );
    this.goodTeamPositions = goodTeam.toArray().map((hero, i) => {
      return new PositionedCharacter(hero, goodStart[i]);
    });

    const evilTeam = generateTeam(
      this.evilAllowedTypes,
      this.maxStartHeroLevel,
      this.teamCount
    );
    const evilStart = startPositions(
      this.gamePlay.boardSize,
      "evil",
      this.teamCount
    );
    this.evilTeamPositions = evilTeam.toArray().map((hero, i) => {
      return new PositionedCharacter(hero, evilStart[i]);
    });

    this.gamePlay.redrawPositions([
      ...this.goodTeamPositions,
      ...this.evilTeamPositions,
    ]);
    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
    // клик игнорируется - ход противника
    if (GameState.currentMove === "evil") {
      return;
    }

    // клик по вражескому герою
    for (let hero of this.evilTeamPositions) {
      if (hero.position === index) {
        if (!GameState.selectedHero) GamePlay.showError("This is an enemny!");
        return;
      }
    }

    // проверка индекса клетки клика с индексами героев игрока
    for (let hero of this.goodTeamPositions) {
      // если клик по клетке с героем
      if (hero.position === index) {
        // если клик по герою который не выбран ранее, но ранее уже выбран другой герой из команды
        if (
          GameState.selectedHero !== null &&
          GameState.selectedHero.position !== index
        ) {
          // снимаем выделение с ранее выбранного героя
          this.gamePlay.deselectCell(GameState.selectedHero.position);
          // ставим выбор на текущий клик
          this.gamePlay.selectCell(index);
          // запоминаем выбранного героя
          GameState.selectedHero = hero;
          // запоминаем индексы всех возможных ходов выбранного героя
          GameState.allowedMoves = heroMove(
            GameState.selectedHero.character.type,
            GameState.selectedHero.position,
            this.gamePlay.boardSize
          );
          // запоминаем индексы всех возможных атак выбранного героя
          GameState.allowedAttack = heroAttack(
            GameState.selectedHero.character.type,
            GameState.selectedHero.position,
            this.gamePlay.boardSize
          );
          return;
          // клик в уже выбранного героя
          // снимаем выделение и забываем выбор
        } else if (
          GameState.selectedHero !== null &&
          GameState.selectedHero.position === index
        ) {
          this.gamePlay.deselectCell(GameState.selectedHero.position);
          GameState.selectedHero = null;
          GameState.allowedMoves = null;
          GameState.allowedAttack = null;
          return;
        }
        // клик по невыбранному герою, другие герои тоже не выбраны
        this.gamePlay.selectCell(index);
        GameState.selectedHero = hero;
        GameState.allowedMoves = heroMove(
          GameState.selectedHero.character.type,
          GameState.selectedHero.position,
          this.gamePlay.boardSize
        );
        GameState.allowedAttack = heroAttack(
          GameState.selectedHero.character.type,
          GameState.selectedHero.position,
          this.gamePlay.boardSize
        );
        return;
      }
    }
    // клик по пустой клетке
    // снимает выбор с уже выбранного героя
    // ход выбранным героем
    // переход хода противнику
    // ход противника
    if (GameState.selectedHero !== null) {
      // ход выбранным героем
      if (GameState.allowedMoves.includes(index)) {
        this.gamePlay.deselectCell(GameState.selectedHero.position);
        GameState.selectedHero.position = index;
        GameState.allowedMoves = heroMove(
          GameState.selectedHero.character.type,
          GameState.selectedHero.position,
          this.gamePlay.boardSize
        );
        GameState.allowedAttack = heroAttack(
          GameState.selectedHero.character.type,
          GameState.selectedHero.position,
          this.gamePlay.boardSize
        );
        // ход игрока, перересовка поля
        this.gamePlay.redrawPositions([
          ...this.goodTeamPositions,
          ...this.evilTeamPositions,
        ]);
        // сброс выбранного героя и переход хода
        this.gamePlay.deselectCell(index);
        GameState.selectedHero = null;
        GameState.allowedMoves = null;
        GameState.allowedAttack = null;
        GameState.currentMove = "evil";
        opponentsMove(
          this.goodTeamPositions,
          this.evilTeamPositions,
          this.gamePlay
        );
        return;
      }
      // клик по пустой клетке
      this.gamePlay.deselectCell(GameState.selectedHero.position);
      GameState.selectedHero = null;
      GameState.allowedMoves = null;
      GameState.allowedAttack = null;
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    // курсор входит в пустую клетку, но герой уже выбран
    if (GameState.selectedHero && GameState.selectedHero.position !== index) {
      // если индекс в поле атаки
      if (GameState.allowedAttack.includes(index)) {
        for (let hero of this.evilTeamPositions) {
          // если враг в поле атаки
          if (hero.position === index) {
            this.gamePlay.setCursor(cursors.crosshair);
            this.gamePlay.selectCell(index, "red");
            return;
          }
        }
      }
      // если индекс в вариантах движения
      if (GameState.allowedMoves.includes(index)) {
        // если двигаться на клетку врага
        for (let hero of this.evilTeamPositions) {
          if (hero.position === index) {
            this.gamePlay.setCursor(cursors.notallowed);
            return;
          }
        }
        // если двигаться на клетку союзника
        for (let hero of this.goodTeamPositions) {
          if (hero.position === index) {
            this.gamePlay.setCursor(cursors.pointer);
            return;
          }
        }
        // если пустая клетка
        this.gamePlay.selectCell(index, "green");
        this.gamePlay.setCursor(cursors.pointer);
        return;
      }

      // на врага вне досягаемости для хода и атаки
      for (let hero of this.evilTeamPositions) {
        if (hero.position === index) {
          this.gamePlay.setCursor(cursors.notallowed);
          return;
        }
      }
      // на союзника вне досягаемости для хода
      for (let hero of this.goodTeamPositions) {
        if (hero.position === index) {
          this.gamePlay.setCursor(cursors.pointer);
          return;
        }
      }
      // на пустую клетку вне досягаемости для хода и атаки
      this.gamePlay.setCursor(cursors.auto);
    }

    // если герой не выбран
    if (!GameState.selectedHero) {
      // на клетки героев добра
      for (let hero of this.goodTeamPositions) {
        if (hero.position === index) {
          this.gamePlay.setCursor(cursors.pointer);
          const message = heroFormatInfo(hero.character);
          this.gamePlay.showCellTooltip(message, index);
          return;
        }
      }
      // на клетки героев зла
      for (let hero of this.evilTeamPositions) {
        if (hero.position === index) {
          this.gamePlay.setCursor(cursors.notallowed);
          const message = heroFormatInfo(hero.character);
          this.gamePlay.showCellTooltip(message, index);
          return;
        }
      }
    }
    // на пустые клетки
    this.gamePlay.setCursor(cursors.auto);
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.setCursor(cursors.auto);
    this.gamePlay.hideCellTooltip(index);
    if (
      GameState.selectedHero !== null &&
      GameState.selectedHero.position !== index
    ) {
      this.gamePlay.deselectCell(index);
    }
  }
}
