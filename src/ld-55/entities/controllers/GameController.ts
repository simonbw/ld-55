import { V } from "../../../core/Vector";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { SoundInstance } from "../../../core/sound/SoundInstance";
import { Persistence } from "../../constants/constants";
import HallwayLevel from "../../environment/HallwayLevel";
import { ExitConstraints } from "../ExitConstraints";
import { ExitZone } from "../ExitZone";
import { Grass } from "../Grass";
import { Key } from "../Key";
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

  constructor(
  ) {
    super();    
  }

  handlers = {
    goToMainMenu: () => {
      const game = this.game!;
      game.addEntity(new MainMenu());
    },

    newGame: () => {
      const game = this.game!;
      game.clearScene(Persistence.Game);
      
      HallwayLevel.addLevelEntities(game);
      game.addEntity(new Grass());
      game.addEntity(new Key(V(12.5, 5)));
      game.addEntity(
        new ExitZone(V(12.5, 38), new ExitConstraints(["key"], []))
      );

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

    gameOver: () => {
      const game = this.game!;
      if (game.entities.getById("suspendedMenu") === undefined) {
        game.addEntity(new SuspendedMenu());
      }
    }
  };
}
