export function heroFormatInfo(hero) {
  return `\u{1F396}${hero.level}  \u{2694}${hero.attack}  \u{1F6E1}${hero.defence}  \u{2764}${hero.health}`;
}

/**
 * функция возвращает номер строки поля на которой находится выбранный индекс
 * @param heroPosition - индекс позиции героя на поле
 * @param boardSize - размер стороны квадрата поля
 * @returns - number - номер строки поля на которой находится выбранный индекс
 */
export function rowPosition(heroPosition, boardSize) {
  return (heroPosition - (heroPosition % boardSize)) / boardSize + 1;
}

/**
 * функция возвращает индекс первой клетки указанной строки поля
 * @param row - номер строки поля
 * @param boardSize - размер стороны поля
 * @returns - number - индекс первой клетки указанной строки поля
 */
export function startIndexOfRow(row, boardSize) {
  return boardSize * row - boardSize;
}

/**
 * функция возвращает индекс последней клетки указанной строки поля
 * @param row - номер строки поля
 * @param boardSize - размер стороны поля
 * @returns - number - индекс последней клетки указанной строки поля
 */
export function finishIndexOfRow(row, boardSize) {
  return boardSize * row - 1;
}

/**
 * Функция возвращает длину хода выбранного героя
 * @param heroType - string - тип героя
 * @returns numder - длина хода
 */
export function characterTypeMoveDistanse(heroType) {
  switch (heroType) {
    case "swordsman":
    case "undead":
      return 4;
    case "bowman":
    case "vampire":
      return 2;
    case "magician":
    case "daemon":
      return 1;
    default:
      throw new Error("В функцию передан несуществующий тип героя.");
  }
}

/**
 * Функция возвращает дальность атаки выбранного героя
 * @param heroType - string - тип героя
 * @returns numder - дальность атаки
 */
export function characterTypeAttackDistance(heroType) {
  switch (heroType) {
    case "swordsman":
    case "undead":
      return 1;
    case "bowman":
    case "vampire":
      return 2;
    case "magician":
    case "daemon":
      return 4;
    default:
      throw new Error("В функцию передан несуществующий тип героя.");
  }
}
