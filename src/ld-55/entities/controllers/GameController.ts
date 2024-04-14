import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { SoundInstance } from "../../../core/sound/SoundInstance";
import { Persistence } from "../../constants/constants";
import ElShapedLevel from "../../levels/ElShapedLevel";
import HallwayLevel from "../../levels/HallwayLevel";
import PlayerCameraController from "../PlayerCameraController";
import SlowMoController from "../SlowMoController";
import MainMenu from "../menus/MainMenu";
import SuspendedMenu from "../menus/SuspendedMenu";
import ObjectiveController from "./ObjectiveController";

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

      game.dispatch({ type: 'clearLevel' });

      game.dispatch({ type: 'addObjective', objectives: [
        {
          name: "Find the key",
          incompleteDescription: "Check the hallway.",
          completeDescription: "Use the key to leave the building!",
          showOnComplete: true,
          requiredItems: ["key"],
          requiredMilestones: [],
        }
      ]});
      
      if (level == 1) {
        ElShapedLevel.addLevelEntities(game, level);
      } else {
        HallwayLevel.addLevelEntities(game, level);
      }

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
