import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { Persistence } from "../../constants/constants";
import LevelController from "../LevelController";
import ContinueScreen from "../menus/ContinueScreen";
import MainMenu from "../menus/MainMenu";

export default class GameController extends BaseEntity implements Entity {
  id = "gameController";
  persistenceLevel: Persistence = Persistence.Permanent;

  handlers = {
    goToMainMenu: () => {
      const game = this.game!;
      game.clearScene(Persistence.Game);
      game.addEntity(new MainMenu());
    },

    newGame: () => {
      const game = this.game!;
      game.clearScene(Persistence.Game);
      game.dispatch({ type: "levelSelected", level: 1 });
    },

    levelSelected: async ({ level }: { level: number }) => {
      const game = this.game!;

      const levelScreen = game.addEntity(
        new ContinueScreen("Level " + level, "Press ENTER to start")
      );
      await levelScreen.waitForContinue();
      game.clearScene(Persistence.Level);

      game.addEntity(
        new LevelController(level, [
          { label: "Grab your backpack", requirements: ["backpack"] },
        ])
      );
    },

    levelComplete: ({ level }: { level: number }) => {
      const game = this.game!;
      game.clearScene(Persistence.Game);
      if (level < 3) {
        // go to next level
        game.dispatch({ type: "levelSelected", level: level + 1 });
      } else {
        game.dispatch({ type: "gameWon" });
      }
    },

    gameWon: async () => {
      const game = this.game!;
      game.clearScene(Persistence.Game);
      const winScreen = game.addEntity(
        new ContinueScreen(
          "You've Escaped!",
          "Press ENTER to return to main menu"
        )
      );
      await winScreen.waitForContinue();
      game.dispatch({ type: "goToMainMenu" });
    },
  };
}
