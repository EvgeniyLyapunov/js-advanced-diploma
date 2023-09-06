import { heroMove } from "./heroMove";
import { heroAttack } from "./heroAttack";
import GameState from "./GameState";
import { Promise } from "core-js";

const boardSize = 8;

export function opponentsMove(goodTeam, evilTeam, gamePlay) {
  // проверка возможности атаковать
  for (let unit of evilTeam) {
    const allowedAttack = heroAttack(
      unit.character.type,
      unit.position,
      boardSize
    );
    for (let hero of goodTeam) {
      if (allowedAttack.includes(hero.position)) {
        gamePlay.selectCell(unit.position, "blood");
        const promise = new Promise((resolve) => {
          setTimeout(() => {
            gamePlay.selectCell(hero.position, "blood");
            setTimeout(() => {
              resolve();
            }, 500);
          }, 500);
        }).then(() => {
          gamePlay.deselectCell(unit.position);
          gamePlay.deselectCell(hero.position);
          GameState.currentMove = "good";
        });
        return;
      }
    }
  }
  for (let unit of evilTeam) {
    const allowedMove = heroMove(unit.character.type, unit.position, boardSize);
    for (let hero of goodTeam) {
      if (allowedMove.includes(hero.position)) {
        gamePlay.selectCell(unit.position, "blood");
        const promise = new Promise((resolve) => {
          const indexHero = allowedMove.findIndex(
            (item) => item === hero.position
          );
          let indexGo;
          if (indexHero === 0) {
            indexGo = indexHero + 1;
          } else if (indexHero === allowedMove.length - 1) {
            indexGo = indexHero - 1;
          } else {
            indexGo = indexHero + 1;
          }
          setTimeout(() => {
            resolve(indexGo);
          }, 500);
        }).then((indexGo) => {
          for (let unit of evilTeam) {
            if (indexGo === unit.position) {
              gamePlay.deselectCell(unit.position);
              GameState.currentMove = "good";
              return;
            }
          }
          for (let hero of goodTeam) {
            if (indexGo === hero.position) {
              gamePlay.deselectCell(unit.position);
              GameState.currentMove = "good";
              return;
            }
          }
          gamePlay.deselectCell(unit.position);
          unit.position = indexGo;
          gamePlay.redrawPositions([...goodTeam, ...evilTeam]);
          GameState.currentMove = "good";
        });
        return;
      }
    }
  }
  GameState.currentMove = "good";
}
