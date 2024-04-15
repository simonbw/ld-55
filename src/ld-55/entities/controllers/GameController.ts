import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { Persistence } from "../../constants/constants";
import ElShapedLevel from "../../levels/ElShapedLevel";
import HallwayLevel from "../../levels/HallwayLevel";
import SquareLevel from "../../levels/SquareLevel";
import TutorialLevel from "../../levels/TutorialLevel";
import { MusicController } from "../MusicController";
import PlayerCameraController from "../PlayerCameraController";
import SlowMoController from "../SlowMoController";
import MainMenu from "../menus/MainMenu";
import SuspendedMenu from "../menus/SuspendedMenu";
import WinMenu from "../menus/WinMenu";

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

    goToWinScreen: () => {
      const game = this.game!;
      game.clearScene(Persistence.Game);
      game.addEntity(new WinMenu());
    },

    newGame: () => {
      const game = this.game!;
      game.clearScene(Persistence.Game);
      game.dispatch({ type: "levelStart", level: 1 });
    },

    levelStart: (event: { level: 1 | 2 | 3 }) => {
      const game = this.game!;
      let { level } = event;
      game.clearScene(Persistence.Level);

      game.dispatch({ type: "clearLevel" });

      game.dispatch({
        type: "addObjective",
        objectives: [
          {
            name: "Find the key",
            incompleteDescription: "Check the hallway.",
            completeDescription: "Use the key to leave the building!",
            showOnComplete: true,
            requiredItems: ["key"],
            requiredMilestones: [],
          },
        ],
      });

      if (level == 1) {
        TutorialLevel.addLevelEntities(game, level);
      } else if (level == 2) {
        ElShapedLevel.addLevelEntities(game, level);
      } else if (level == 3) {
        SquareLevel.addLevelEntities(game, level);
      } else {
        HallwayLevel.addLevelEntities(game, level);
      }

      game.addEntity(new PlayerCameraController(game.camera));
      game.addEntity(new SlowMoController());
      game.addEntity(new MusicController());
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
      game.dispatch({ type: "clearLevel" });
      game.dispatch({ type: "goToWinScreen" });
    },

    gameOver: () => {
      const game = this.game!;
      if (game.entities.getById("suspendedMenu") === undefined) {
        game.addEntity(new SuspendedMenu());
      }
    },
  };
}
