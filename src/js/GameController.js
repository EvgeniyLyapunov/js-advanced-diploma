import { newTeam, newTeamWithSurvivors } from "./generators";
import { heroFormatInfo } from "./utils/utilsHero";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Vampire from "./characters/Vampire";
import Undead from "./characters/Undead";
import Daemon from "./characters/Daemon";
import GameState from "./GameState";
import GamePlay from "./GamePlay";
import cursors from "./cursors";
import heroMove from "./heroMove";
import heroAttack from "./heroAttack";
import opponentsMove from "./opponentsMove";
import Character from "./characters/Character";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.goodAllowedTypes = [Bowman, Swordsman, Magician];
    this.evilAllowedTypes = [Vampire, Undead, Daemon];
    this.teamCount = 3;
    this.HeroLevel = 1;
    this.currentTheme = null;
    this.goodTeamPositions = [];
    this.evilTeamPositions = [];

    this.gameState = new GameState();
  }

  init() {
    this.currentTheme = this.gameState.nextTheme();
    this.gamePlay.drawUi(this.currentTheme);

    this.goodTeamPositions = newTeam(
      this.goodAllowedTypes,
      "good",
      this.HeroLevel,
      this.teamCount,
      this.gamePlay.boardSize
    );

    this.evilTeamPositions = newTeam(
      this.evilAllowedTypes,
      "evil",
      this.HeroLevel,
      this.teamCount,
      this.gamePlay.boardSize
    );

    this.gamePlay.redrawPositions([
      ...this.goodTeamPositions,
      ...this.evilTeamPositions,
    ]);
    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
    // клик игнорируется - ход противника
    if (this.gameState.currentMove === "evil") {
      return;
    }

    // клик по вражескому герою
    for (const unit of this.evilTeamPositions) {
      if (unit.position === index) {
        if (!this.gameState.selectedHero) {
          GamePlay.showError("This is an enemny!");
          return;
        }
        // проверяем поле атаки героя
        this.gameState.currentMove = "evil";
        if (this.gameState.allowedAttack.includes(index)) {
          this.gamePlay.deselectCell(this.gameState.selectedHero.position);
          this.gamePlay.deselectCell(index);
          const damage = Math.max(
            this.gameState.selectedHero.character.attack -
              unit.character.defence,
            this.gameState.selectedHero.character.attack * 0.5
          );
          this.gameState.totalReset();
          this.gamePlay.showDamage(index, damage).then(() => {
            unit.character.health -= damage;
            if (unit.character.health <= 0) {
              this.evilTeamPositions = this.evilTeamPositions.filter(
                (char) => char.character.health > 0
              );
            }

            // все враги убиты - переход на новый уровень
            if (this.evilTeamPositions.length === 0) {
              this.currentTheme = this.gameState.nextTheme();
              this.gamePlay.drawUi(this.currentTheme);
              this.HeroLevel += 1;
              this.goodTeamPositions = newTeamWithSurvivors(
                this.goodTeamPositions,
                this.goodAllowedTypes,
                this.HeroLevel,
                this.teamCount,
                this.gamePlay.boardSize
              );

              this.evilTeamPositions = newTeam(
                this.evilAllowedTypes,
                "evil",
                this.HeroLevel,
                this.teamCount,
                this.gamePlay.boardSize
              );

              this.gamePlay.redrawPositions([
                ...this.goodTeamPositions,
                ...this.evilTeamPositions,
              ]);
              this.gameState.currentMove = "good";
              return;
            }

            this.gamePlay.redrawPositions([
              ...this.goodTeamPositions,
              ...this.evilTeamPositions,
            ]);
            opponentsMove.call(this);
          });
          this.gameState.currentMove = "good";
          return;
        }
      }
    }

    // проверка индекса клетки клика с индексами героев игрока
    for (const hero of this.goodTeamPositions) {
      // если клик по клетке с героем
      if (hero.position === index) {
        // если клик по герою который не выбран ранее, но ранее уже выбран другой герой из команды
        if (
          this.gameState.selectedHero !== null &&
          this.gameState.selectedHero.position !== index
        ) {
          // снимаем выделение с ранее выбранного героя
          this.gamePlay.deselectCell(this.gameState.selectedHero.position);
          // ставим выбор на текущий клик
          this.gamePlay.selectCell(index);
          // запоминаем выбранного героя
          this.gameState.selectedHero = hero;
          // запоминаем индексы всех возможных ходов выбранного героя
          this.gameState.allowedMoves = heroMove(
            this.gameState.selectedHero.character.type,
            this.gameState.selectedHero.position,
            this.gamePlay.boardSize
          );
          // запоминаем индексы всех возможных атак выбранного героя
          this.gameState.allowedAttack = heroAttack(
            this.gameState.selectedHero.character.type,
            this.gameState.selectedHero.position,
            this.gamePlay.boardSize
          );
          return;
          // клик в уже выбранного героя
          // снимаем выделение и забываем выбор
        }
        if (
          this.gameState.selectedHero !== null &&
          this.gameState.selectedHero.position === index
        ) {
          this.gamePlay.deselectCell(this.gameState.selectedHero.position);
          this.gameState.totalReset();
          return;
        }
        // клик по невыбранному герою, другие герои тоже не выбраны
        this.gamePlay.selectCell(index);
        this.gameState.selectedHero = hero;
        this.gameState.allowedMoves = heroMove(
          this.gameState.selectedHero.character.type,
          this.gameState.selectedHero.position,
          this.gamePlay.boardSize
        );
        this.gameState.allowedAttack = heroAttack(
          this.gameState.selectedHero.character.type,
          this.gameState.selectedHero.position,
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
    if (this.gameState.selectedHero !== null) {
      // ход выбранным героем
      if (this.gameState.allowedMoves.includes(index)) {
        this.gamePlay.deselectCell(this.gameState.selectedHero.position);
        this.gamePlay.deselectCell(index);
        this.gameState.selectedHero.position = index;
        // ход игрока, перерисовка поля
        this.gamePlay.redrawPositions([
          ...this.goodTeamPositions,
          ...this.evilTeamPositions,
        ]);
        // сброс выбранного героя и переход хода
        this.gameState.totalReset();

        this.gameState.currentMove = "evil";
        opponentsMove.call(this);
        return;
      }
      // клик по пустой клетке
      this.gamePlay.deselectCell(this.gameState.selectedHero.position);
      this.gameState.totalReset();
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.gameState.currentMove === "evil") {
      return;
    }
    // курсор входит в пустую клетку, но герой уже выбран
    if (
      this.gameState.selectedHero &&
      this.gameState.selectedHero.position !== index
    ) {
      // если индекс в поле атаки
      if (this.gameState.allowedAttack.includes(index)) {
        for (const unit of this.evilTeamPositions) {
          // если враг в поле атаки
          if (unit.position === index) {
            this.gamePlay.setCursor(cursors.crosshair);
            this.gamePlay.selectCell(index, "red");
            return;
          }
        }
      }
      // если индекс в вариантах движения
      if (this.gameState.allowedMoves.includes(index)) {
        // если двигаться на клетку врага
        for (const hero of this.evilTeamPositions) {
          if (hero.position === index) {
            this.gamePlay.setCursor(cursors.notallowed);
            return;
          }
        }
        // если двигаться на клетку союзника
        for (const hero of this.goodTeamPositions) {
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
      for (const unit of this.evilTeamPositions) {
        if (unit.position === index) {
          this.gamePlay.setCursor(cursors.notallowed);
          return;
        }
      }
      // на союзника вне досягаемости для хода
      for (const hero of this.goodTeamPositions) {
        if (hero.position === index) {
          this.gamePlay.setCursor(cursors.pointer);
          return;
        }
      }
      // на пустую клетку вне досягаемости для хода и атаки
      this.gamePlay.setCursor(cursors.auto);
    }

    // если герой не выбран
    if (!this.gameState.selectedHero) {
      // на клетки героев добра
      for (const hero of this.goodTeamPositions) {
        if (hero.position === index) {
          this.gamePlay.setCursor(cursors.pointer);
          const message = heroFormatInfo(hero.character);
          this.gamePlay.showCellTooltip(message, index);
          return;
        }
      }
      // на клетки героев зла
      for (const unit of this.evilTeamPositions) {
        if (unit.position === index) {
          this.gamePlay.setCursor(cursors.notallowed);
          const message = heroFormatInfo(unit.character);
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
      this.gameState.selectedHero !== null &&
      this.gameState.selectedHero.position !== index
    ) {
      this.gamePlay.deselectCell(index);
    }
  }

  onNewGame() {
    this.gameState.newGame();
    this.gamePlay.clearListenersForNewGame();
    this.HeroLevel = 1;
    this.goodTeamPositions = [];
    this.evilTeamPositions = [];
    this.init();
  }

  onSaveGame() {
    const saveObject = this.gameState.saveDataGame(
      this.HeroLevel,
      this.currentTheme,
      this.goodTeamPositions,
      this.evilTeamPositions
    );

    this.stateService.save(saveObject);
    setTimeout(() => {
      if (localStorage.getItem("state")) {
        alert("Текущая игра успешно сохранена.");
      }
    }, 500);
  }

  onLoadGame() {
    const loadObject = this.stateService.load();
    if (loadObject) {
      this.HeroLevel = loadObject.level;
      this.currentTheme = loadObject.currentTheme;

      loadObject.goodTeam.map((item) => {
        const obj = Object.setPrototypeOf(item.character, Character.prototype);
        return obj;
      });
      loadObject.evilTeam.forEach((item) => {
        const obj = Object.setPrototypeOf(item.character, Character.prototype);
        return obj;
      });

      this.goodTeamPositions = loadObject.goodTeam;
      this.evilTeamPositions = loadObject.evilTeam;

      this.gameState.newGame();
      this.gameState.themes = loadObject.nextThemes;
      this.gamePlay.drawUi(this.currentTheme);
      this.gamePlay.redrawPositions([
        ...this.goodTeamPositions,
        ...this.evilTeamPositions,
      ]);
    } else {
      throw new Error("Ошибка в загрузке сохранения игры.");
    }
  }
}
