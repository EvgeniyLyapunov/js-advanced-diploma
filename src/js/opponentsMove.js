import { heroMove } from "./heroMove";
import { heroAttack } from "./heroAttack";
import GameState from "./GameState";

const boardSize = 8;

export function opponentsMove(gc) {
  // проверка возможности атаковать
  for (let unit of gc.evilTeamPositions) {
    const allowedAttack = heroAttack(
      unit.character.type,
      unit.position,
      boardSize
    );
    for (let hero of gc.goodTeamPositions) {
      if (allowedAttack.includes(hero.position)) {
        gc.gamePlay.selectCell(unit.position, "blood");
        const promise = new Promise((resolve) => {
          setTimeout(() => {
            gc.gamePlay.selectCell(hero.position, "red");
            setTimeout(() => {
              resolve();
            }, 500);
          }, 500);
        }).then(() => {
          const damage = Math.max(
            unit.character.attack - hero.character.defence,
            unit.character.attack * 0.5
          );
          hero.character.health = hero.character.health - damage;
          gc.gamePlay.showDamage(hero.position, damage).then(() => {
            gc.gamePlay.deselectCell(unit.position);
            gc.gamePlay.deselectCell(hero.position);
            if (hero.character.health <= 0) {
              gc.goodTeamPositions = gc.goodTeamPositions.filter(
                (hero) => hero.character.health > 0
              );
            }
            gc.gamePlay.redrawPositions([
              ...gc.goodTeamPositions,
              ...gc.evilTeamPositions,
            ]);
          });
        });
        GameState.currentMove = "good";
        return;
      }
    }
  }
  // проверка возможности ходить, если герои вне атаки
  for (let unit of gc.evilTeamPositions) {
    const allowedMove = heroMove(unit.character.type, unit.position, boardSize);
    // проверка возможности подойти к герою
    for (let hero of gc.goodTeamPositions) {
      const nearHeroTiles = heroMove("magician", hero.position, boardSize);
      const uniqueSteps = new Set(allowedMove);
      let goUnitToHero;
      for (let tile of nearHeroTiles) {
        const size = uniqueSteps.size;
        uniqueSteps.add(tile);
        if (size === uniqueSteps.size) {
          goUnitToHero = tile;
          break;
        }
      }
      if (goUnitToHero) {
        gc.gamePlay.selectCell(unit.position, "blood");
        const promise = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 500);
        }).then(() => {
          gc.gamePlay.deselectCell(unit.position);
          unit.position = goUnitToHero;
          gc.gamePlay.redrawPositions([
            ...gc.goodTeamPositions,
            ...gc.evilTeamPositions,
          ]);
        });
        GameState.currentMove = "good";
        return;
      }
    }
    // ход юнита выбирается через random()
    const rndUnit =
      gc.evilTeamPositions[
        Math.floor(Math.random() * gc.evilTeamPositions.length)
      ];
    gc.gamePlay.selectCell(rndUnit.position, "blood");
    const allowedMoveRndUnit = heroMove(
      rndUnit.character.type,
      rndUnit.position,
      boardSize
    );
    const promise = new Promise((resolve) => {
      let rndIndexGo = -1;
      while (rndIndexGo < 0) {
        let ix = Math.floor(Math.random() * allowedMoveRndUnit.length);
        rndIndexGo = checkIndexGo(allowedMoveRndUnit[ix], gc);
      }
      setTimeout(() => {
        resolve(rndIndexGo);
      }, 500);
    }).then((go) => {
      gc.gamePlay.deselectCell(rndUnit.position);
      rndUnit.position = go;
      gc.gamePlay.redrawPositions([
        ...gc.goodTeamPositions,
        ...gc.evilTeamPositions,
      ]);
    });
    GameState.currentMove = "good";
    return;
  }
  GameState.currentMove = "good";
}

/**
 * функция проверяет возмоность хода на указанный индекс
 * @param indexGo - индекс возможного хода
 * @param gc - объект класса GameController для доступа к массивам персонажей
 * @returns - -1 если клетка занята, indexGo - если клетка свободна
 */
function checkIndexGo(indexGo, gc) {
  for (let unit of gc.evilTeamPositions) {
    if (indexGo === unit.position) {
      return -1;
    }
  }
  for (let hero of gc.goodTeamPositions) {
    if (indexGo === hero.position) {
      return -1;
    }
  }
  return indexGo;
}
