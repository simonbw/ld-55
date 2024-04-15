import { Body, Circle } from "p2";
import { AnimatedSprite } from "pixi.js";
import { ImageName } from "../../../resources/resources";
import { V, V2d } from "../../core/Vector";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { clamp, lerp } from "../../core/util/MathUtil";
import { CollisionGroups } from "../CollisionGroups";
import { SerializableEntity } from "../editor/serializeTypes";
import { PersonShadow } from "./PersonShadow";
import { WalkSoundPlayer } from "./WalkSoundPlayer";
import { WalkSpring } from "./WalkSpring";

const WALKING_STEPS_PER_METER = 0.4;
const RUNNING_STEPS_PER_METER = 0.4;

/** Base class for teachers and player and maybe even students */
export abstract class Human extends SerializableEntity implements Entity {
  sprite: GameSprite & AnimatedSprite;
  body: Body;
  tags = ["human"];

  walkSoundPlayer: WalkSoundPlayer;
  walkSpring: WalkSpring;

  running: boolean = false;
  percentThroughStride: number = 0;
  lastDistanceMoved: number = 0;

  constructor(
    private options: {
      position: V2d;
      angle: number;
      collisionGroup: number;
      images: ImageName[];
      walkSpeed: number;
      runSpeed: number;
      tags?: string[];
    }
  ) {
    super();

    if (options.tags) {
      this.tags.push(...options.tags);
    }

    this.body = new Body({
      mass: 0.5,
      angle: options.angle,
      position: options.position.clone(),
      fixedRotation: true,
    });

    const radius = 0.5; // meters

    const shape = new Circle({ radius: radius * 0.6 });
    shape.collisionGroup = options.collisionGroup;
    shape.collisionMask = CollisionGroups.All;
    this.body.addShape(shape);

    this.sprite = AnimatedSprite.fromImages(options.images);
    this.sprite.autoUpdate = false;
    this.sprite.anchor.set(0.5);
    this.sprite.setSize(2 * radius);

    this.addChild(
      new PersonShadow(
        () => this.getPosition(),
        () => this.body.angle
      )
    );
    this.walkSoundPlayer = this.addChild(new WalkSoundPlayer(this));
    this.walkSpring = this.addChild(new WalkSpring(this.body));
  }

  /** Called every update cycle */
  onTick(dt: number) {
    // this.body.applyDamping(200 * dt);
    this.walkSpring.speed = this.running
      ? this.options.runSpeed
      : this.options.walkSpeed;
    this.walkSpring.acceleration = 20;

    const distanceMoved = V(this.body.velocity).magnitude * dt;

    const stopThreshold = 0.001;
    if (distanceMoved > stopThreshold) {
      // walking

      const lastPercentThroughStep = this.percentThroughStride;
      const stepsPerMeter = this.running
        ? RUNNING_STEPS_PER_METER
        : WALKING_STEPS_PER_METER;
      this.percentThroughStride += distanceMoved * stepsPerMeter;
      const maxFrame = this.sprite.totalFrames - 1;
      this.sprite.currentFrame = Math.round(
        clamp(lerp(0, maxFrame, this.percentThroughStride / 2), 0, maxFrame)
      );

      // If we've taken a new step
      if (
        (this.percentThroughStride > 1 && lastPercentThroughStep < 1) ||
        (this.percentThroughStride > 2 && lastPercentThroughStep < 2)
      ) {
        this.walkSoundPlayer.playFootstep();
      }

      // Wrap around the stride
      this.percentThroughStride %= 2;

      this.body.angle = V(this.body.velocity).angle;
    } else {
      // not moving
      this.sprite.currentFrame = 0;
      this.percentThroughStride = 0;

      // If we've just stopped moving
      if (this.lastDistanceMoved > stopThreshold) {
        this.walkSoundPlayer.playFootstep();
      }
    }
  }

  public walk(angle: number, running: boolean): void {
    this.walkSpring.walkTowards(angle, running ? 1 : 0.5);
    this.percentThroughStride;
  }

  /** Called every frame, right before rendering */
  onRender(dt: number): void {
    this.sprite.position.set(...this.body.position);
    this.sprite.rotation = this.body.angle + Math.PI / 2;
  }
}
