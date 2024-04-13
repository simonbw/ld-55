import Game from "../core/Game.ts";
import { GamePreloader } from "./GamePreloader.tsx";
import { EditorController } from "./editor/EditorController.tsx";
import GodCameraController from "./editor/GodCameraController.tsx";
import { serializeLevel } from "./editor/serializeLevel.tsx";
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

  HallwayLevel.addLevelEntities(game);
  const stuff = serializeLevel(game);
  game.clearScene();

  game.addEntity(new EditorController(game, stuff));
  game.addEntity(new GodCameraController(game.camera));

}

window.addEventListener("load", main);
