import Character from "../characters/Character";
import Bowman from "../characters/Bowman";
import Swordsman from "../characters/Swordsman";
import Magician from "../characters/Magician";
import Undead from "../characters/Undead";
import Vampire from "../characters/Vampire";
import Daemon from "../characters/Daemon";
import { generateTeam } from "../generators";

test("should throw error when try to create character class instance", () => {
  expect(() => {
    const hero = new Character(2, "bowman");
  }).toThrowError("Ошибка - попытка создать экземпляр базового класса.");
});

test("should not throw error when try to create character child class instance", () => {
  expect(() => {
    const hero = new Bowman(2, "bowman");
  }).not.toThrowError("Ошибка - попытка создать экземпляр базового класса.");
});

test.each([
  [Bowman, 1, 25, 25],
  [Daemon, 1, 10, 10],
  [Magician, 1, 10, 40],
  [Swordsman, 1, 40, 10],
  [Undead, 1, 40, 10],
  [Vampire, 1, 25, 25],
])(
  "should instance of class %s level %i has attack %i and defence %i",
  (heroClass, level, attack, defence) => {
    const testHero = new heroClass(level);
    expect(testHero.attack).toBe(attack);
    expect(testHero.defence).toBe(defence);
  }
);

test.each([
  [2, 5],
  [3, 8],
  [4, 10],
])(
  "should create a new team in the range %i level and %i quantity",
  (level, count) => {
    const allowedTypes = [Bowman, Swordsman, Magician];
    const testTeam = generateTeam(allowedTypes, level, count).toArray();
    testTeam.sort((a, b) => a.level - b.level);

    expect(testTeam[0].level).toBeGreaterThanOrEqual(1);
    expect(testTeam[count - 1].level).toBeLessThanOrEqual(level);
    expect(testTeam.length).toBe(count);
  }
);
