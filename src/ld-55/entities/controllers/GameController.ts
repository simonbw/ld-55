import { V } from "../../../core/Vector";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import HallwayLevel from "../../environment/HallwayLevel";
import { ExitConstraints } from "../ExitConstraints";
import { ExitZone } from "../ExitZone";
import { Key } from "../Key";
import PlayerCameraController from "../PlayerCameraController";
import PlayerProgressController from "../PlayerProgressController";
import SlowMoController from "../SlowMoController";
import MainMenu from "../menus/MainMenu";

interface Item {
  name: string;
  description: string;
}

interface Milestone {
  name: string;
  description: string;
}

export default class GameController extends BaseEntity implements Entity {
  constructor(
  ) {
    super();    
  }

  handlers = {
    goToMainMenu: () => {
      const game = this.game!;
      // game.clearScene();
      game.addEntity(new MainMenu());
    },

    newGame: () => {
      const game = this.game!;
      
      HallwayLevel.addLevelEntities(game);
      game.addEntity(new Key(V(12.5, 5)));
      game.addEntity(new ExitZone(V(12.5, 38), new ExitConstraints(["key"], [])));

      game.addEntity(new PlayerCameraController(game.camera));
      game.addEntity(new SlowMoController());
    }
  };
}
