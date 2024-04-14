import { TextureStyle } from "pixi.js";
import Game from "../core/Game.ts";
import { V } from "../core/Vector";
import { GamePreloader } from "./GamePreloader.tsx";
import { initLayers } from "./config/layers.ts";
import { ExitConstraints } from "./entities/ExitConstraints.ts";
import { ExitZone } from "./entities/ExitZone.ts";
import { Key } from "./entities/Key.ts";
import PlayerCameraController from "./entities/PlayerCameraController.ts";
import PlayerProgressController from "./entities/PlayerProgressController.ts";
import SlowMoController from "./entities/SlowMoController.ts";
import HallwayLevel from "./environment/HallwayLevel.ts";
import GameController from "./entities/controllers/GameController.ts";

// Do this so we can access the game from the console
declare global {
  interface Window {
    DEBUG: { game?: Game };
  }
}

async function main() {
  // Make the pixel art crisp
  TextureStyle.defaultOptions.scaleMode = "nearest";

  const game = new Game();
  await game.init();
  // Make the game accessible from the console
  window.DEBUG = { game };

  const preloader = game.addEntity(GamePreloader);
  await preloader.waitTillLoaded();
  preloader.destroy();

  initLayers(game);

  game.addEntity(new GameController());
  game.addEntity(new PlayerProgressController());

  game.dispatch({ type: "goToMainMenu" });
}

window.addEventListener("load", main);
