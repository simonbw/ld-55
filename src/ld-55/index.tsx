import Game from "../core/Game.ts";
import { V } from "../core/Vector";
import { GamePreloader } from "./GamePreloader.tsx";
import { Door } from "./entities/Door.ts";
import { Enemy } from "./entities/Enemy.ts";
import { Player } from "./entities/Player.ts";
import { Wall } from "./entities/Wall.ts";

// Do this so we can access the game from the console
declare global {
  interface Window {
    DEBUG: { game?: Game };
  }
}

async function main() {
  const game = new Game();
  // Make the game accessible from the console
  await game.init();
  window.DEBUG = { game };

  const preloader = game.addEntity(GamePreloader);
  await preloader.waitTillLoaded();
  preloader.destroy();

  // Add some filters for fast lookup of certain entities later
  // Think of these like indexes in a DB
  // game.entities.addFilter(isHuman);

  game.addEntity(new Player(V(2, 2)));

  game.addEntity(new Wall(V(-1, 0), V(-1, 10)));
  game.addEntity(new Wall(V(5, 0), V(5, 10)));

  game.addEntity(new Wall(V(-5, 0), V(0, 0)));
  game.addEntity(new Wall(V(4, 0), V(9, 0)));

  game.addEntity(new Door(V(0, 0), V(4, 0)));

  game.addEntity(new Enemy(V(10, 5), Math.PI));
}

window.addEventListener("load", main);
