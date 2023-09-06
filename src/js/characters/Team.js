/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  constructor() {
    this.members = new Set();
  }

  add(char) {
    if (this.members.has(char)) {
      throw new Error(`Этот герой уже добавлен - ${char.name}`);
    }
    this.members.add(char);
  }

  addAll(...args) {
    args.forEach((item) => {
      this.members.add(item);
    });
  }

  toArray() {
    return Array.from(this.members);
  }

  *[Symbol.iterator]() {
    const teamArr = this.toArray();
    for (let i = 0; i < teamArr.length; i += 1) {
      yield teamArr[i];
    }
  }
}
