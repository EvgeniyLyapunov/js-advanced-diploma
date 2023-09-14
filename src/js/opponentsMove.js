import heroMove from "./heroMove";
import heroAttack from "./heroAttack";

const boardSize = 8;

function checkIndexGo(indexGo, evilPositions, goodPositions) {
  for (const unit of evilPositions) {
    if (indexGo === unit.position) {
      return -1;
    }
  }
  for (const hero of goodPositions) {
    if (indexGo === hero.position) {
      return -1;
    }
  }
  return indexGo;
}

export default function opponentsMove() {
  // проверка возможности атаковать
  for (const unit of this.evilTeamPositions) {
    const allowedAttack = heroAttack(
      unit.character.type,
      unit.position,
      boardSize
    );
    for (const hero of this.goodTeamPositions) {
      if (allowedAttack.includes(hero.position)) {
        this.gamePlay.selectCell(unit.position, "blood");
        new Promise((resolve) => {
          setTimeout(() => {
            this.gamePlay.selectCell(hero.position, "red");
            setTimeout(() => {
              resolve();
            }, 500);
          }, 500);
        }).then(() => {
          const damage = Math.floor(
            Math.max(
              unit.character.attack - hero.character.defence,
              unit.character.attack * 0.5
            )
          );
          hero.character.health -= damage;
          this.gamePlay.showDamage(hero.position, damage).then(() => {
            this.gamePlay.deselectCell(unit.position);
            this.gamePlay.deselectCell(hero.position);
            if (hero.character.health <= 0) {
              this.goodTeamPositions = this.goodTeamPositions.filter(
                (char) => char.character.health > 0
              );
            }
            this.gamePlay.redrawPositions([
              ...this.goodTeamPositions,
              ...this.evilTeamPositions,
            ]);

            // зло победило
            if (this.goodTeamPositions.length === 0) {
              this.gameState.currentMove = "evil";
            }
          });
        });
        this.gameState.currentMove = "good";
        return;
      }
    }
  }
  // проверка возможности ходить, если герои вне атаки
  const unit =
    this.evilTeamPositions[
      Math.floor(Math.random() * this.evilTeamPositions.length)
    ];
  const allowedMove = heroMove(unit.character.type, unit.position, boardSize);
  // проверка возможности подойти к герою
  for (const hero of this.goodTeamPositions) {
    const nearHeroTiles = heroMove("magician", hero.position, boardSize);
    const uniqueSteps = new Set(allowedMove);
    let goUnitToHero;
    for (const tile of nearHeroTiles) {
      const { size } = uniqueSteps;
      uniqueSteps.add(tile);
      if (size === uniqueSteps.size) {
        goUnitToHero = tile;
        break;
      }
    }
    if (goUnitToHero) {
      this.gamePlay.selectCell(unit.position, "blood");
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      }).then(() => {
        this.gamePlay.deselectCell(unit.position);
        unit.position = goUnitToHero;
        this.gamePlay.redrawPositions([
          ...this.goodTeamPositions,
          ...this.evilTeamPositions,
        ]);
      });
      this.gameState.currentMove = "good";
      return;
    }
  }
  // ход юнита выбирается через random()
  const rndUnit =
    this.evilTeamPositions[
      Math.floor(Math.random() * this.evilTeamPositions.length)
    ];
  this.gamePlay.selectCell(rndUnit.position, "blood");
  const allowedMoveRndUnit = heroMove(
    rndUnit.character.type,
    rndUnit.position,
    boardSize
  );
  new Promise((resolve) => {
    let rndIndexGo = -1;
    while (rndIndexGo < 0) {
      const ix = Math.floor(Math.random() * allowedMoveRndUnit.length);
      rndIndexGo = checkIndexGo(
        allowedMoveRndUnit[ix],
        this.evilTeamPositions,
        this.goodTeamPositions
      );
    }
    setTimeout(() => {
      resolve(rndIndexGo);
    }, 500);
  }).then((go) => {
    this.gamePlay.deselectCell(rndUnit.position);
    rndUnit.position = go;
    this.gamePlay.redrawPositions([
      ...this.goodTeamPositions,
      ...this.evilTeamPositions,
    ]);
  });
  this.gameState.currentMove = "good";
}
