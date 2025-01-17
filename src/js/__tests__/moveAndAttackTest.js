import heroAttack from "../heroAttack";
import heroMove from "../heroMove";

const boardSize = 8;

test.each([
  ["bowman", 9, [0, 1, 2, 3, 8, 10, 11, 16, 17, 18, 19, 24, 25, 26, 27]],
  ["bowman", 32, [16, 17, 18, 24, 25, 26, 33, 34, 40, 41, 42, 48, 49, 50]],
  [
    "daemon",
    30,
    [
      2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 26, 27,
      28, 29, 31, 34, 35, 36, 37, 38, 39, 42, 43, 44, 45, 46, 47, 50, 51, 52,
      53, 54, 55, 58, 59, 60, 61, 62, 63,
    ],
  ],
  [
    "daemon",
    63,
    [
      27, 28, 29, 30, 31, 35, 36, 37, 38, 39, 43, 44, 45, 46, 47, 51, 52, 53,
      54, 55, 59, 60, 61, 62,
    ],
  ],
  [
    "magician",
    25,
    [
      0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 21, 24, 26,
      27, 28, 29, 32, 33, 34, 35, 36, 37, 40, 41, 42, 43, 44, 45, 48, 49, 50,
      51, 52, 53, 56, 57, 58, 59, 60, 61,
    ],
  ],
  [
    "magician",
    57,
    [
      24, 25, 26, 27, 28, 29, 32, 33, 34, 35, 36, 37, 40, 41, 42, 43, 44, 45,
      48, 49, 50, 51, 52, 53, 56, 58, 59, 60, 61,
    ],
  ],
  ["swordsman", 17, [8, 9, 10, 16, 18, 24, 25, 26]],
  ["swordsman", 49, [40, 41, 42, 48, 50, 56, 57, 58]],
  ["undead", 55, [46, 47, 54, 62, 63]],
  ["undead", 6, [5, 7, 13, 14, 15]],
  [
    "vampire",
    46,
    [
      28, 29, 30, 31, 36, 37, 38, 39, 44, 45, 47, 52, 53, 54, 55, 60, 61, 62,
      63,
    ],
  ],
  ["vampire", 14, [4, 5, 6, 7, 12, 13, 15, 20, 21, 22, 23, 28, 29, 30, 31]],
])(
  "should hero %s on index %i to have this field of attack",
  (heroType, heroPosition, expected) => {
    const result = heroAttack(heroType, heroPosition, boardSize);
    expect(result).toEqual(expected);
  }
);

test.each([
  ["bowman", 9, [8, 10, 11, 1, 17, 25, 0, 2, 18, 27, 16]],
  ["bowman", 32, [33, 34, 16, 24, 40, 48, 25, 18, 41, 50]],
  ["daemon", 30, [29, 31, 22, 38, 21, 23, 39, 37]],
  ["daemon", 63, [62, 55, 54]],
  ["magician", 25, [24, 26, 17, 33, 16, 18, 34, 32]],
  ["magician", 57, [56, 58, 49, 48, 50, 64]],
  [
    "swordsman",
    17,
    [16, 18, 19, 20, 21, 1, 9, 25, 33, 41, 49, 8, 10, 3, 26, 35, 44, 53, 24],
  ],
  [
    "swordsman",
    49,
    [48, 50, 51, 52, 53, 17, 25, 33, 41, 57, 40, 42, 35, 28, 21, 58, 56],
  ],
  ["undead", 55, [51, 52, 53, 54, 23, 31, 39, 47, 63, 46, 37, 28, 19, 62]],
  ["undead", 6, [2, 3, 4, 5, 7, 14, 22, 30, 38, 15, 13, 20, 27, 34]],
  ["vampire", 46, [44, 45, 47, 30, 38, 54, 62, 37, 28, 39, 55, 53, 60]],
  ["vampire", 14, [12, 13, 15, 6, 22, 30, 5, 7, 0, 23, 21, 28]],
])(
  "should hero %s on index %i to have this indexes of move",
  (heroType, heroPosition, expected) => {
    const result = heroMove(heroType, heroPosition, boardSize);
    expect(result).toEqual(expected);
  }
);
