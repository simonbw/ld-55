import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { SoundInstance } from "../../../core/sound/SoundInstance";
import { Persistence } from "../../constants/constants";
import ElShapedLevel from "../../environment/ElShapedLevel";
import PlayerCameraController from "../PlayerCameraController";
import SlowMoController from "../SlowMoController";
import MainMenu from "../menus/MainMenu";
import SuspendedMenu from "../menus/SuspendedMenu";

interface Item {
  name: string;
  description: string;
}

interface Milestone {
  name: string;
  description: string;
}

export default class GameController extends BaseEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Permanent;

  constructor() {
    super();
  }

  handlers = {
    goToMainMenu: () => {
      const game = this.game!;
      game.clearScene(Persistence.Game);
      game.addEntity(new MainMenu());
    },

    newGame: () => {
      const game = this.game!;
      game.clearScene(Persistence.Game);
      game.dispatch({ type: "levelStart", level: 1 });
    },

    levelStart: (event: { level: 1 | 2 | 3 }) => {
      const game = this.game!;
      const { level } = event;
      game.clearScene(Persistence.Level);

      ElShapedLevel.addLevelEntities(game, level);

      game.addEntity(new PlayerCameraController(game.camera));
      game.addEntity(new SlowMoController());

      game.addEntity(
        new SoundInstance("music1", {
          continuous: true,
          reactToSlowMo: true,
          gain: 0.5,
        })
      );
    },

    finishLevel: (event: { level: 1 | 2 | 3 }) => {
      const game = this.game!;
      game.clearScene(Persistence.Game);

      if (event.level === 1) {
        game.dispatch({ type: "levelStart", level: 2 });
      } else if (event.level === 2) {
        game.dispatch({ type: "levelStart", level: 3 });
      } else {
        game.dispatch({ type: "gameWon" });
      }
    },

    gameWon: () => {
      const game = this.game!;
      console.log("Game Won!");
      game.dispatch({ type: "goToMainMenu" });
    },

    gameOver: () => {
      const game = this.game!;
      if (game.entities.getById("suspendedMenu") === undefined) {
        game.addEntity(new SuspendedMenu());
      }
    },
  };
}
