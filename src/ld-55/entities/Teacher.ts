import {
  Body,
  Circle,
  ContactEquation,
  Convex,
  Ray,
  RaycastResult,
  Shape,
} from "p2";
import { AnimatedSprite, Graphics } from "pixi.js";
import { V, V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { imageName } from "../../core/resources/resourceUtils";
import { angleDelta, degToRad, polarToVec } from "../../core/util/MathUtil";
import { CollisionGroups } from "../CollisionGroups";
import { SerializableEntity, SerializedEntity } from "../editor/serializeTypes";
import { WalkSoundPlayer } from "./WalkSoundPlayer";

const RUNNING_STEPS_PER_SECOND = 5;
const WALKING_STEPS_PER_SECOND = 2;

export class Teacher extends SerializableEntity implements Entity {
  sprite: GameSprite & AnimatedSprite;
  body: Body;
  tags = ["enemy"];

  visionCone: VisionCone;

  walkSoundPlayer: WalkSoundPlayer;

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

    const shape = new Circle({ radius: radius });
    shape.collisionGroup = CollisionGroups.Enemies;
    shape.collisionMask = CollisionGroups.All;
    this.body.addShape(shape);

    this.sprite = AnimatedSprite.fromImages([
      imageName("teacherGym1"),
      imageName("teacherGym2"),
      imageName("teacherGym3"),
      imageName("teacherGym4"),
      imageName("teacherGym5"),
      imageName("teacherGym6"),
      imageName("teacherGym7"),
      imageName("teacherGym8"),
    ]);
    this.sprite.anchor.set(0.5);
    this.sprite.scale = (2 * radius) / this.sprite.texture.width;
    this.sprite.play();

    this.visionCone = this.addChild(new VisionCone());

    this.body.angle = angle;

    this.walkSoundPlayer = this.addChild(new WalkSoundPlayer(this.body));
  }

  onTick(dt: number): void {
    this.body.applyDamping(200 * dt);

    const player = this.game?.entities.getTagged("player")[0];
    const walkStrength = 180;
    if (player && this.visionCone.canSee(player)) {
      const playerPosition = V(player.body!.position);
      const direction = playerPosition.sub(this.body.position).normalize();
      this.body.applyForce(direction.mul(walkStrength));
      this.body.angle = direction.angle;

      // Always running for now, later we can change
      const sprinting = true;

      const framesPerStep = 4;
      if (sprinting) {
        this.sprite.animationSpeed =
          (RUNNING_STEPS_PER_SECOND / framesPerStep / 4) * this.game!.slowMo;
      } else {
        this.sprite.animationSpeed =
          (RUNNING_STEPS_PER_SECOND / framesPerStep / 4) * this.game!.slowMo;
      }

      this.walkSoundPlayer.advance(
        dt * (sprinting ? RUNNING_STEPS_PER_SECOND : WALKING_STEPS_PER_SECOND),
        sprinting
      );
    } else {
      this.walkSoundPlayer.stop();
      this.sprite.animationSpeed = 0;
      this.sprite.currentFrame = 0;
    }

    this.visionCone.body.position = this.body.position;
    this.visionCone.body.angle = this.body.angle;
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
}

class VisionCone extends BaseEntity implements Entity {
  sprite: GameSprite & Graphics;
  body: Body;

  theta = degToRad(45); // half width of vision cone

  constructor() {
    super();

    this.body = new Body({
      type: Body.KINEMATIC,
      collisionResponse: false,
    });

    const radius = 8; // meters

    const vertices: V2d[] = [];
    vertices.push(V(0, 0));
    for (let i = -this.theta; i <= this.theta; i += degToRad(5)) {
      vertices.push(polarToVec(i, radius));
    }
    this.body.addShape(new Convex({ vertices }));

    const start = polarToVec(-this.theta, radius);
    const graphics = new Graphics();
    graphics
      .moveTo(0, 0)
      .lineTo(start.x, start.y)
      .arc(0, 0, radius, -this.theta, this.theta)
      .lineTo(0, 0)
      .closePath()
      .fill({ color: 0xffffff, alpha: 0.5 });

    this.sprite = graphics;
  }

  canSee(entity?: Entity): boolean {
    if (!entity || !entity.body) {
      return false;
    }
    const p = V(entity.body!.position);
    const radius = 8; // meters

    const delta = p.sub(V(this.body!.position));
    const tooFar = delta.magnitude > radius;
    if (tooFar) {
      return false;
    }

    const angleDisplacement = angleDelta(delta.angle, this.body.angle);
    if (Math.abs(angleDisplacement) > this.theta) {
      return false;
    }

    const result = new RaycastResult();
    const ray = new Ray({
      from: this.body.position,
      to: [p[0], p[1]],
      mode: Ray.CLOSEST,
      skipBackfaces: true,
    });

    this.body.world.raycast(result, ray);
    const visionBlocked = result.body != entity.body;
    if (visionBlocked) {
      return false;
    }

    return true;
  }

  onRender(dt: number): void {
    this.sprite.position.set(...this.body.position);
    this.sprite.rotation = this.body.angle;

    if (this.canSee(this.game?.entities.getTagged("player")[0])) {
      this.sprite.tint = 0xff0000;
    } else {
      this.sprite.tint = 0xffffff;
    }
  }
}
