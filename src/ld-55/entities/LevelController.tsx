import Game from "../../core/Game";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { Persistence } from "../constants/constants";
import ElShapedLevel from "../levels/ElShapedLevel";
import HallwayLevel from "../levels/HallwayLevel";
import SquareLevel from "../levels/SquareLevel";
import TutorialLevel from "../levels/TutorialLevel";
import FadeFromColor from "./FadeFromColor";
import FadeToColor from "./FadeToColor";
import { MusicController } from "./MusicController";
import { ObjectivesDisplay } from "./ObjectivesDisplay";
import PlayerCameraController from "./PlayerCameraController";
import SuspendedMenu from "./menus/SuspendedMenu";

export interface LevelObjectiveInput {
  // User facing description of the objective
  label: string;
  // If true, the user can finish the level without this objective
  optional?: boolean;
  // The list of requirements the user must have completed to exit the level
  requirements: string[];
}

export interface LevelObjective extends LevelObjectiveInput {
  completed: boolean;
}

export type LevelPhase = "pre" | "main" | "post";

// High level control flow within a single level
export default class LevelController extends BaseEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Level;
  id = "levelController";
  tags = ["levelController"];

  requirements = new Set<string>();
  levelPhase: LevelPhase = "pre";

  handlers = {
    completeRequirement: ({ requirement }: { requirement: string }) => {
      this.requirements.add(requirement);
    },

    exitReached: async () => {
      const game = this.game!;
      if (
        this.levelPhase != "post" &&
        this.getObjectives().every(
          (objective) => objective.completed || objective.optional
        )
      ) {
        this.levelPhase = "post";
        game.dispatch({ type: "levelPreComplete", level: this.level });
        const fade = game.addEntity(new FadeToColor());
        await fade.done();
        game.dispatch({ type: "levelComplete", level: this.level });
      } else {
        console.warn("Cannot exit level, incomplete objectives");
      }
    },

    playerCaught: () => {
      if (this.levelPhase === "main") {
        this.levelPhase = "post";
        const game = this.game!;
        if (game.entities.getById("suspendedMenu") === undefined) {
          game.addEntity(new SuspendedMenu());
        }
      }
    },

    restartLevel: () => {
      this.game!.dispatch({ type: "levelSelected", level: this.level });
    },
  };

  constructor(
    public readonly level: number,
    public objectives: LevelObjectiveInput[] = []
  ) {
    super();
  }

  onAdd(game: Game): void {
    game.addEntity(new FadeFromColor());

    if (this.level == 1) {
      TutorialLevel.addLevelEntities(game, this.level);
    } else if (this.level == 2) {
      ElShapedLevel.addLevelEntities(game, this.level);
    } else if (this.level == 3) {
      SquareLevel.addLevelEntities(game, this.level);
    } else {
      HallwayLevel.addLevelEntities(game, this.level);
    }
    const announcement = game.addEntity(
      new SoundInstance("paAnnouncement1Processed")
    );

    game.addEntity(new PlayerCameraController(game.camera));
    game.addEntity(new ObjectivesDisplay());

    announcement.waitTillEnded().then(() => {
      this.levelPhase = "main";
      game.addEntity(new MusicController());
    });
  }

  getObjectives(): LevelObjective[] {
    return this.objectives.map((objective) => ({
      ...objective,
      completed: objective.requirements.every((requirement) =>
        this.hasRequirement(requirement)
      ),
    }));
  }

  hasRequirement(name: string): boolean {
    return this.requirements.has(name);
  }
}

export function getLevelController(game?: Game): LevelController | undefined {
  return game?.entities.getById("levelController") as
    | LevelController
    | undefined;
}
