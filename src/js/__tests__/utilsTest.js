import { calcTileType } from "../utils";
import { heroFormatInfo } from "../utils";
import Bowman from "../characters/Bowman";

test.each([
  [0, 8, "top-left"],
  [5, 8, "top"],
  [7, 8, "top-right"],
  [16, 8, "left"],
  [23, 8, "right"],
  [21, 8, "center"],
  [56, 8, "bottom-left"],
  [57, 8, "bottom"],
  [63, 8, "bottom-right"],
  [64, 8, ""],
])(
  "when index %i and boardSize %i should return %s position",
  (index, boardSize, expected) => {
    const result = calcTileType(index, boardSize);
    expect(result).toBe(expected);
  }
);

test("should return formatted string with hero data", () => {
  const testHero = new Bowman(1);
  const result = heroFormatInfo(testHero);
  expect(result).toBe("\u{1F396}1  \u{2694}25  \u{1F6E1}25  \u{2764}50");
});
