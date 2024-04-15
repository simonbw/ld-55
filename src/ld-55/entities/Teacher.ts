import { ContactEquation, Shape } from "p2";
import { ImageName, SoundName } from "../../../resources/resources";
import { V, V2d } from "../../core/Vector";
import Entity from "../../core/entity/Entity";
import { PositionalSound } from "../../core/sound/PositionalSound";
import { choose } from "../../core/util/Random";
import { CollisionGroups } from "../CollisionGroups";
import { Persistence } from "../constants/constants";
import { SerializedEntity } from "../editor/serializeTypes";
import { Human } from "./Human";
import { VisionCone } from "./VisionCone";

const RUNNING_STEPS_PER_SECOND = 5;
const WALKING_STEPS_PER_SECOND = 2;
const SUSPICION_THRESHOLD_SECONDS = 1;

interface TeacherConfig {
  images: ImageName[];
  alertSounds: SoundName[];
}

const teacherConfigs: TeacherConfig[] = [
  {
    images: [
      "teacherGym1",
      "teacherGym2",
      "teacherGym3",
      "teacherGym4",
      "teacherGym5",
      "teacherGym6",
      "teacherGym7",
      "teacherGym8",
    ],
    alertSounds: ["teacherAlert1", "teacherAlert3"],
  },
  {
    images: [
      "teacherScience1",
      "teacherScience2",
      "teacherScience3",
      "teacherScience4",
      "teacherScience5",
      "teacherScience6",
      "teacherScience7",
      "teacherScience8",
    ],
    alertSounds: ["teacherAlert2"],
  },
];

export class Teacher extends Human implements Entity {
  persistenceLevel: Persistence = Persistence.Game;

  visionCone: VisionCone;

  foundPlayer: boolean = false;
  suspicion = 0;
  targetLocation: V2d;

  constructor(
    private position: V2d,
    private angle: number,
    private teacherConfig: TeacherConfig = choose(...teacherConfigs)
  ) {
    super({
      position,
      angle,
      images: teacherConfig.images,
      collisionGroup: CollisionGroups.Enemies,
      walkSpeed: 4,
      runSpeed: 8,
      tags: ["enemy"],
    });

    this.targetLocation = position;
    this.visionCone = this.addChild(new VisionCone());
  }

  onTick(dt: number): void {
    const player = this.game?.entities.getTagged("player")[0];

    const lastSuspicion = this.suspicion;
    if (player && this.visionCone.canSee(player)) {
      this.suspicion += dt;
    }

    if (
      lastSuspicion < SUSPICION_THRESHOLD_SECONDS &&
      this.suspicion >= SUSPICION_THRESHOLD_SECONDS
    ) {
      this.game!.dispatch({ type: "teacherSpottedPlayer" });
      this.addChild(
        new PositionalSound(
          choose(...this.teacherConfig.alertSounds),
          V(this.body.position)
        )
      );
    }

    if (
      player &&
      this.visionCone.canSee(player) &&
      this.suspicion > SUSPICION_THRESHOLD_SECONDS
    ) {
      const playerPosition = V(player.body!.position);
      const direction = playerPosition.sub(this.body.position);
      this.walkSpring.walkTowards(direction.angle, 1);

      this.running = true;
    } else if (this.isAtTargetLocation()) {
      this.running = false;
      this.walkSpring.stop();
    } else {
      this.running = false;
      const direction = this.targetLocation.sub(this.body.position);
      this.walkSpring.walkTowards(direction.angle, 1);
    }

    super.onTick(dt);

    this.visionCone.body.position = this.body.position;
    this.visionCone.body.angle = this.body.angle;
  }

  isAtTargetLocation(): boolean {
    return this.targetLocation.sub(this.body.position).magnitude < 0.2;
  }

  setTargetLocation(p: V2d) {
    this.targetLocation = p;
  }

  isTargettingPlayer(): boolean {
    const player = this.game?.entities.getTagged("player")[0];
    return !!(player && this.visionCone.canSee(player));
  }

  onBeginContact(
    other?: Entity | undefined,
    thisShape?: Shape | undefined,
    otherShape?: Shape | undefined,
    contactEquations?: ContactEquation[] | undefined
  ): void {
    if (other?.tags?.includes("player")) {
      if (this.suspicion > SUSPICION_THRESHOLD_SECONDS) {
        this.game!.dispatch({ type: "playerCaught" });
      }
    }
  }

  ///////////////////////////
  /// SERIALIZATION STUFF ///
  ///////////////////////////

  static deserialize(e: SerializedEntity): Teacher {
    return new Teacher(V(e.position), e.angle);
  }

  serialize(): SerializedEntity {
    return {
      position: [...this.position],
      angle: this.angle,
    };
  }

  static defaultSerializedEntity(p: V2d): SerializedEntity {
    return {
      position: [...p],
      angle: 0,
    };
  }
}
