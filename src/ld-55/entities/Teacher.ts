import { Body, Circle, ContactEquation, Shape } from "p2";
import { AnimatedSprite } from "pixi.js";
import { ImageName, SoundName } from "../../../resources/resources";
import { V, V2d } from "../../core/Vector";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { PositionalSound } from "../../core/sound/PositionalSound";
import { choose } from "../../core/util/Random";
import { CollisionGroups } from "../CollisionGroups";
import { Persistence } from "../constants/constants";
import { SerializableEntity, SerializedEntity } from "../editor/serializeTypes";
import { PersonShadow } from "./PersonShadow";
import { VisionCone } from "./VisionCone";
import { WalkSoundPlayer } from "./WalkSoundPlayer";

const RUNNING_STEPS_PER_SECOND = 5;
const WALKING_STEPS_PER_SECOND = 2;
const SUSPICION_THRESHOLD_SECONDS = 1;

interface TeacherStats {
  images: ImageName[];
  alertSounds: SoundName[];
}

const teacherStats: TeacherStats[] = [
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

export class Teacher extends SerializableEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Game;
  sprite: GameSprite & AnimatedSprite;
  body: Body;
  tags = ["enemy"];

  visionCone: VisionCone;

  walkSoundPlayer: WalkSoundPlayer;
  foundPlayer: boolean = false;
  suspicion = 0;

  targetLocation: V2d;

  teacherStats: TeacherStats = choose(...teacherStats);

  constructor(
    private position: V2d,
    private angle: number
  ) {
    super();

    this.body = new Body({
      mass: 0.5,
      position: position.clone(),
      fixedRotation: true,
    });

    const radius = 0.5; // meters

    const shape = new Circle({ radius: radius * 0.6 });
    shape.collisionGroup = CollisionGroups.Enemies;
    shape.collisionMask = CollisionGroups.All;
    this.body.addShape(shape);

    this.sprite = AnimatedSprite.fromImages(this.teacherStats.images);
    this.sprite.anchor.set(0.5);
    this.sprite.scale = (2 * radius) / this.sprite.texture.width;
    this.sprite.play();

    this.visionCone = this.addChild(new VisionCone());

    this.body.angle = angle;

    this.walkSoundPlayer = this.addChild(new WalkSoundPlayer(this.body));
    this.addChild(new PersonShadow(this.body));
    this.targetLocation = position;
  }

  onTick(dt: number): void {
    this.body.applyDamping(200 * dt);

    let sprinting;
    let moving;
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
          choose(...this.teacherStats.alertSounds),
          V(this.body.position)
        )
      );
    }

    if (
      player &&
      this.visionCone.canSee(player) &&
      this.suspicion > SUSPICION_THRESHOLD_SECONDS
    ) {
      const walkStrength = 180;
      const playerPosition = V(player.body!.position);
      const diff = playerPosition.sub(this.body.position);
      const direction = diff.normalize();
      this.body.applyForce(direction.mul(walkStrength));
      this.body.angle = direction.angle;

      if (diff.magnitude < 1 && !this.foundPlayer) {
        console.log("found player");
        this.foundPlayer = true;
        this.game?.dispatch({ type: "gameOver" });
      }

      sprinting = true;
      moving = true;
    } else if (this.isAtTargetLocation()) {
      this.walkSoundPlayer.stop();
      this.sprite.animationSpeed = 0;
      this.sprite.currentFrame = 0;

      sprinting = false;
      moving = false;
    } else {
      const walkStrength = 40;
      const diff = this.targetLocation.sub(this.body.position);
      const direction = diff.normalize();
      this.body.applyForce(direction.mul(walkStrength));
      this.body.angle = direction.angle;

      sprinting = false;
      moving = true;
    }

    if (moving) {
      const framesPerStep = 4;
      if (sprinting) {
        this.sprite.animationSpeed =
          (RUNNING_STEPS_PER_SECOND / framesPerStep / 4) * this.game!.slowMo;
      } else {
        this.sprite.animationSpeed =
          (WALKING_STEPS_PER_SECOND / framesPerStep / 4) * this.game!.slowMo;
      }

      this.walkSoundPlayer.advance(
        dt * (sprinting ? RUNNING_STEPS_PER_SECOND : WALKING_STEPS_PER_SECOND),
        sprinting
      );
    }

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
      // other.destroy();
    }
  }

  /** Called every frame, right before rendering */
  onRender(dt: number): void {
    this.sprite.position.set(...this.body.position);
    this.sprite.rotation = this.body.angle + Math.PI / 2;
  }

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
