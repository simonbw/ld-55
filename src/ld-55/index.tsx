import Game from "../core/Game.ts";
import { GamePreloader } from "./GamePreloader.tsx";
import { deserializeLevel, serializeLevel } from "./editor/serializeLevel.tsx";
import CameraController from "./entities/CameraController.ts";
import HallwayLevel from "./environment/HallwayLevel.ts";

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

  HallwayLevel.addLevelEntities(game);
  // const stuff = serializeLevel(game);
  // game.clearScene();
  // deserializeLevel(game, stuff);
  game.addEntity(new CameraController(game.camera));

  // ExampleLevel.addLevelEntities(game);
}

window.addEventListener("load", main);
