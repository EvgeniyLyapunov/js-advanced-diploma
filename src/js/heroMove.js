import {
  rowPosition,
  startIndexOfRow,
  finishIndexOfRow,
  characterTypeMoveDistanse,
} from './utils/utilsHero';

/**
 * функция расчитывает все варианты движения из указанного индекса
 * @param heroType - тип юнита или героя
 * @param heroPosition - индекс на поле
 * @param boardSize - размер стороны поля
 * @returns массив индексов всех вариантов движения
 */
export default function heroMove(heroType, heroPosition, boardSize) {
  // длина хода выбранного героя
  const heroDistansMove = characterTypeMoveDistanse(heroType);
  // строка на которой находится выбранный герой
  const row = rowPosition(heroPosition, boardSize);
  // начальный индекс строки выбранного героя
  const startRow = startIndexOfRow(row, boardSize);
  // конечный индекс строки выбранного героя
  const finishRow = finishIndexOfRow(row, boardSize);

  /**
   * Функция возвращает массив индексов возможных ходов
   * выбранного героя по горизонтали
   * @param heroDistansMove - длина хода выбранного героя
   * @param heroPosition - индекс позиции героя на поле
   * @param startRow - индекс начала строки, в которой находится герой
   * @param finishRow - индекс конца строки, в которой находится герой
   * @returns - массив индексов возможных ходов по горизонтали
   */
  function HorizontalMove(distansMove, position, start, finish) {
    const horizontal = [];
    for (let i = position - distansMove; i <= position + distansMove; i += 1) {
      if (i >= start && i <= finish && i !== position) {
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
  function verticalMove(distansMove, position, size) {
    const vertical = [];
    const iStart = position - distansMove * size;
    const iEnd = position + distansMove * size;
    for (let i = iStart; i <= iEnd; i += size) {
      if (i >= 0 && i <= size ** 2 && i !== position) {
        vertical.push(i);
      }
    }
    return vertical;
  }

  function diagonalMove(distansMove, position, size) {
    const diagonal = [];
    // левый верхний угол
    for (let i = 1; i <= distansMove; i += 1) {
      const step = position - size * i - i;
      const line = rowPosition(step + i, size);
      const startLine = startIndexOfRow(line, size);
      if (step < 0 || step < startLine) {
        break;
      }
      diagonal.push(step);
    }
    // правый верхний угол
    for (let i = 1; i <= distansMove; i += 1) {
      const step = position - size * i + i;
      const line = rowPosition(step - i, size);
      const finishLine = finishIndexOfRow(line, size);
      if (step < 0 || step > finishLine) {
        break;
      }
      diagonal.push(step);
    }
    // правый нижний угол
    for (let i = 1; i <= distansMove; i += 1) {
      const step = position + size * i + i;
      const line = rowPosition(step - i, size);
      const finishLine = finishIndexOfRow(line, size);
      if (step > size ** 2 || step > finishLine) {
        break;
      }
      diagonal.push(step);
    }
    // левый нижний угол
    for (let i = 1; i <= distansMove; i += 1) {
      const step = position + size * i - i;
      const line = rowPosition(step + i, size);
      const startLine = startIndexOfRow(line, size);
      if (step > size ** 2 || step < startLine) {
        break;
      }
      diagonal.push(step);
    }
    return diagonal;
  }

  const allowedMoves = [
    ...HorizontalMove(heroDistansMove, heroPosition, startRow, finishRow),
    ...verticalMove(heroDistansMove, heroPosition, boardSize),
    ...diagonalMove(heroDistansMove, heroPosition, boardSize),
  ];
  return allowedMoves;
}
