import GameController from "../GameController";
import GamePlay from "../GamePlay";
import GameStateService from "../GameStateService";

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

const localStorage = new LocalStorageMock();

const gc = new GameController(
  new GamePlay(),
  new GameStateService(localStorage)
);
test("should get data from storage and not throw error", () => {
  localStorage.setItem("state", "test");
  expect(() => {
    gc.onLoadGame();
  }).not.toThrowError("Ошибка в загрузке сохранения игры.");
});

test("should not get data from storage and throw error", () => {
  localStorage.removeItem("state");
  localStorage.setItem("error", "test");
  expect(() => {
    gc.onLoadGame();
  }).toThrowError("Ошибка в загрузке сохранения игры.");
});
