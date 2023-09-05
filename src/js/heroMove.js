import {
  rowPosition,
  startIndexOfRow,
  finishIndexOfRow,
  characterTypeMoveDistanse,
} from "./utilsHero";

export function heroMove(heroType, heroPosition, boardSize) {
  // длина хода выбранного героя
  const heroDistansMove = characterTypeMoveDistanse(heroType);
  // строка на которой находится выбранный герой
  const row = rowPosition(heroPosition, boardSize);
  // начальный индекс строки выбранного героя
  const startRow = startIndexOfRow(row, boardSize);
  // конечный индекс строки выбранного героя
  const finishRow = finishIndexOfRow(row, boardSize);

  const allowedMoves = [
    ...HorizontalMove(heroDistansMove, heroPosition, startRow, finishRow),
    ...verticalMove(heroDistansMove, heroPosition, boardSize),
    ...diagonalMove(heroDistansMove, heroPosition, boardSize),
  ];
  return allowedMoves;
}

/**
 * Функция возвращает массив индексов возможных ходов
 * выбранного героя по горизонтали
 * @param heroDistansMove - длина хода выбранного героя
 * @param heroPosition - индекс позиции героя на поле
 * @param startRow - индекс начала строки, в которой находится герой
 * @param finishRow - индекс конца строки, в которой находится герой
 * @returns - массив индексов возможных ходов по горизонтали
 */
function HorizontalMove(heroDistansMove, heroPosition, startRow, finishRow) {
  const horizontal = [];
  for (
    let i = heroPosition - heroDistansMove;
    i <= heroPosition + heroDistansMove;
    i++
  ) {
    if (i >= startRow && i <= finishRow && i !== heroPosition) {
      horizontal.push(i);
    }
  }
  return horizontal;
}

/**
 * Функция возвращает массив индексов возможных ходов
 * выбранного героя по вертикали
 * @param heroDistansMove - длина хода выбранного героя
 * @param heroPosition - индекс позиции героя на поле
 * @param boardSize - размер стороны поля
 * @returns массив индексов возможных ходов по вертикали
 */
function verticalMove(heroDistansMove, heroPosition, boardSize) {
  const vertical = [];
  const iStart = heroPosition - heroDistansMove * boardSize;
  const iEnd = heroPosition + heroDistansMove * boardSize;
  for (let i = iStart; i <= iEnd; i = i + boardSize) {
    if (i >= 0 && i <= boardSize ** 2 && i !== heroPosition) {
      vertical.push(i);
    }
  }
  return vertical;
}
function diagonalMove(heroDistansMove, heroPosition, boardSize) {
  const diagonal = [];
  // левый верхний угол
  for (let i = 1; i <= heroDistansMove; i++) {
    const step = heroPosition - boardSize * i - i;
    const row = rowPosition(step + i, boardSize);
    const startRow = startIndexOfRow(row, boardSize);
    if (step < 0 || step < startRow) {
      break;
    }
    diagonal.push(step);
  }
  // правый верхний угол
  for (let i = 1; i <= heroDistansMove; i++) {
    const step = heroPosition - boardSize * i + i;
    const row = rowPosition(step - i, boardSize);
    const finishRow = finishIndexOfRow(row, boardSize);
    if (step < 0 || step > finishRow) {
      break;
    }
    diagonal.push(step);
  }
  // правый нижний угол
  for (let i = 1; i <= heroDistansMove; i++) {
    const step = heroPosition + boardSize * i + i;
    const row = rowPosition(step - i, boardSize);
    const finishRow = finishIndexOfRow(row, boardSize);
    if (step > boardSize ** 2 || step > finishRow) {
      break;
    }
    diagonal.push(step);
  }
  // левый нижний угол
  for (let i = 1; i <= heroDistansMove; i++) {
    const step = heroPosition + boardSize * i - i;
    const row = rowPosition(step + i, boardSize);
    const startRow = startIndexOfRow(row, boardSize);
    if (step > boardSize ** 2 || step < startRow) {
      break;
    }
    diagonal.push(step);
  }
  return diagonal;
}
