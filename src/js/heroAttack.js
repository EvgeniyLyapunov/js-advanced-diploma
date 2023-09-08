import {
  rowPosition,
  startIndexOfRow,
  finishIndexOfRow,
  characterTypeAttackDistance,
} from "./utils/utilsHero";

/**
 * функция расчитывает все варианты атаки из указанного индекса
 * @param heroType - тип юнита или героя
 * @param heroPosition - индекс на поле
 * @param boardSize - размер стороны поля
 * @returns массив индексов всех вариантов атаки
 */
export function heroAttack(heroType, heroPosition, boardSize) {
  // дальность атаки выбранного героя
  const heroDistansAttack = characterTypeAttackDistance(heroType);
  // строка на которой находится выбранный герой
  const heroRow = rowPosition(heroPosition, boardSize);
  // начальный индекс строки выбранного героя
  const startRow = startIndexOfRow(heroRow, boardSize);
  // конечный индекс строки выбранного героя
  const finishRow = finishIndexOfRow(heroRow, boardSize);

  const allowedAttack = [];
  // границы площади атаки
  let iStart, iFinish, iTop, iBottom;

  // отступ влево от позиции героя для расчёта левой границы площади атаки с учётом краёв поля
  let left;
  if (heroPosition === startRow) {
    left = 0;
  } else if (heroPosition - heroDistansAttack < startRow) {
    left = heroPosition - startRow;
  } else {
    left = heroDistansAttack;
  }
  // отступ вправо от позиции героя для расчёта правой границы площади атаки с учётом краёв поля
  let right;
  if (heroPosition === finishRow) {
    right = 0;
  } else if (heroPosition + heroDistansAttack > finishRow) {
    right = finishRow - heroPosition;
  } else {
    right = heroDistansAttack;
  }
  // отступ вверх от позиции героя для расчёта верхней границы площади атаки с учётом краёв поля
  // и начало цикла формирования массива индексов площади атаки
  let top;
  if (heroRow === 1) {
    top = 0;
  } else if (heroRow - heroDistansAttack < 1) {
    top = heroRow - 1;
  } else {
    top = heroDistansAttack;
  }
  // отступ вниз от позиции героя для расчёта нижней границы площади атаки с учётом краёв поля
  // и конца цикла формирования массива индексов площади атаки
  let bottom;
  if (heroRow === boardSize) {
    bottom = 0;
  } else if (heroRow + heroDistansAttack > boardSize) {
    bottom = boardSize - heroRow;
  } else {
    bottom = heroDistansAttack;
  }

  // индекс крайней левой верхней границы площади атвки
  iStart = heroPosition - boardSize * top - left;
  // индекс крайней правой верхней границы площади атвки
  iFinish = heroPosition - boardSize * top + right;
  // номер строки поля - верхней границы поля атаки
  iTop = heroRow - top;
  // номер строки поля - нижней границы поля атаки
  iBottom = heroRow + bottom;

  // цикл по строкам поля атаки
  for (let row = iTop; row <= iBottom; row++) {
    // цикл по индексам строк поля атаки
    for (let col = iStart; col <= iFinish; col++) {
      // исключение позиции героя
      if (col !== heroPosition) {
        allowedAttack.push(col);
      }
    }
    // переход индексов начала и конца строки на новую строку
    iStart = iStart + boardSize;
    iFinish = iFinish + boardSize;
  }
  return allowedAttack;
}
