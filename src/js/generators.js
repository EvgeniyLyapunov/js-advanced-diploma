import Team from "./characters/Team";
import { startPositions } from "./utils/utils";
import PositionedCharacter from "./characters/PositionedCharacter";

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, level = 1) {
  while (true) {
    const typeForCreate =
      allowedTypes[Math.floor(Math.random() * allowedTypes.length)];

    yield new typeForCreate(level);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, level, characterCount) {
  const team = new Team();
  const gen = characterGenerator(allowedTypes, 1);
  for (let i = 0; i < characterCount; i++) {
    if (level === 1) {
      team.add(gen.next().value);
    } else {
      const char = gen.next().value;
      for (let i = 2; i <= level; i++) {
        char.attack = Math.max(
          char.attack,
          (char.attack * (80 + char.health)) / 100
        );
        char.defence = Math.max(
          char.defence,
          (char.defence * (80 + char.health)) / 100
        );
        char.health = char.health + 80 > 100 ? 100 : char.health + 80;
        char.level = i;
      }
      team.add(char);
    }
  }
  return team;
}

export function newTeamWithSurvivors(
  survivors,
  allowedTypes,
  nextLevel,
  teamCount,
  boardSize
) {
  const oldHeroes = survivors.map((hero) => {
    hero.character.attack = Math.max(
      hero.character.attack,
      (hero.character.attack * (80 + hero.character.health)) / 100
    );
    hero.character.defence = Math.max(
      hero.character.defence,
      (hero.character.defence * (80 + hero.character.health)) / 100
    );
    hero.character.health =
      hero.character.health + 80 > 100 ? 100 : hero.character.health + 80;
    hero.character.level = nextLevel;
    return hero.character;
  });
  const newHeroes = generateTeam(
    allowedTypes,
    nextLevel,
    teamCount - oldHeroes.length
  ).toArray();
  const nextGoodTeam = [...oldHeroes, ...newHeroes];
  const startIndex = startPositions(boardSize, "good", teamCount);
  return nextGoodTeam.map((hero, i) => {
    return new PositionedCharacter(hero, startIndex[i]);
  });
}

export function newTeam(allowedTypes, type, nextLevel, teamCount, boardSize) {
  const newHeroes = generateTeam(allowedTypes, nextLevel, teamCount).toArray();
  const startIndex = startPositions(boardSize, type, teamCount);
  return newHeroes.map((hero, i) => {
    return new PositionedCharacter(hero, startIndex[i]);
  });
}
