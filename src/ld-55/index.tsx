import Game from "../core/Game.ts";
import { V } from "../core/Vector";
import { GamePreloader } from "./GamePreloader.tsx";
import { Ball } from "./entities/Ball.ts";
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

  game.addEntity(new Ball(V(2, 2)));

  game.addEntity(new Wall(V(0, 0), V(0, 10)));
  game.addEntity(new Wall(V(5, 0), V(5, 10)));
}

window.addEventListener("load", main);
