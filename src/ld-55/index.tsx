import Game from "../core/Game.ts";
import { GamePreloader } from "./GamePreloader.tsx";
import { initLayers } from "./config/layers.ts";
import SlowMoController from "./entities/SlowMoController.ts";
import PlayerCameraController from "./entities/PlayerCameraController.ts";
import HallwayLevel from "./environment/HallwayLevel.ts";
import { Key } from "./entities/Key.ts";
import { V } from "../core/Vector";
import PlayerProgressController from "./entities/PlayerProgressController.ts";

// Do this so we can access the game from the console
declare global {
  interface Window {
    DEBUG: { game?: Game };
  }
}

async function main() {
  const game = new Game();
  await game.init();
  // Make the game accessible from the console
  window.DEBUG = { game };

  const preloader = game.addEntity(GamePreloader);
  await preloader.waitTillLoaded();
  preloader.destroy();

  initLayers(game);  

  HallwayLevel.addLevelEntities(game);
  game.addEntity(new PlayerCameraController(game.camera));
  game.addEntity(new SlowMoController());
  game.addEntity(new PlayerProgressController());

  game.addEntity(new Key(V(12.5, 5)));

  // ExampleLevel.addLevelEntities(game);
}

window.addEventListener("load", main);
