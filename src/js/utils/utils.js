/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 * */
export function calcTileType(index, boardSize) {
  const row = (index - (index % boardSize)) / boardSize + 1;
  const startRow = boardSize * row - boardSize;
  const finishRow = boardSize * row - 1;

  switch (true) {
    // top
    case index === 0:
      return "top-left";
    case row === 1 && index < finishRow:
      return "top";
    case row === 1 && index === finishRow:
      return "top-right";
    // center
    case row < boardSize && index === startRow:
      return "left";
    case row < boardSize && index === finishRow:
      return "right";
    case row < boardSize && index < finishRow:
      return "center";
    // bottom
    case row === boardSize && index === startRow:
      return "bottom-left";
    case row === boardSize && index === finishRow:
      return "bottom-right";
    case row === boardSize && index < finishRow:
      return "bottom";
    default:
      return "";
  }
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return "critical";
  }

  if (health < 50) {
    return "normal";
  }

  return "high";
}

/**
 * функция, в зависимости от типа команды,
 * генерирует уникальные для каждого героя указанной команды стартовые позиции
 * @param boardSize - размер стороны игрового поля
 * @param teamType - тип команды: 'good' | 'evil'
 * @param teamCount - стартовое количество героев в команде
 * @returns - структура Set с уникальными стартовыми позициями
 */
export function startPositions(boardSize, teamType, teamCount) {
  const positions = [];
  switch (teamType) {
    case "good":
      for (let i = 1; i <= boardSize; i++) {
        positions.push(boardSize * i - boardSize);
        positions.push(boardSize * i - boardSize + 1);
      }
      return currentTeamStartPositions(positions, teamCount);
    case "evil":
      for (let i = 1; i <= boardSize; i++) {
        positions.push(boardSize * i - 1);
        positions.push(boardSize * i - 2);
      }
      return currentTeamStartPositions(positions, teamCount);
    default:
      throw new Error("Переданный аргументом тип команды не определён.");
  }
}

function currentTeamStartPositions(startPositions, teamCount) {
  const startHeroPositions = new Set();
  while (startHeroPositions.size !== teamCount) {
    const index = Math.floor(Math.random() * startPositions.length);
    startHeroPositions.add(startPositions[index]);
  }
  return Array.from(startHeroPositions);
}
