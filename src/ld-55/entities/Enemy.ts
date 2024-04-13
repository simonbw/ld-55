import { Body, Circle, ContactEquation, Convex, Ray, RaycastResult, Shape } from "p2";
import { Graphics, Sprite } from "pixi.js";
import { V, V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { imageName } from "../../core/resources/resourceUtils";
import { degToRad, polarToVec } from "../../core/util/MathUtil";
import { SerializedEntity } from "../editor/serializeTypes";

export class Enemy extends BaseEntity implements Entity {
  sprite: GameSprite & Sprite;
  body: Body;
  tags = ["enemy"];

  visionCone: VisionCone;

  constructor(private position: V2d, private angle: number) {
    super();

    this.body = new Body({
      mass: 0.5,
      position: position.clone(),
      fixedRotation: true,
    });

    const radius = 0.5; // meters

    const shape = new Circle({ radius: radius });
    this.body.addShape(shape);

    this.sprite = Sprite.from(imageName("enemy"));
    this.sprite.anchor.set(0.5);
    this.sprite.scale = (2 * radius) / this.sprite.texture.width;

    this.visionCone = this.addChild(new VisionCone());

    this.body.angle = angle;
  }

  onTick(dt: number): void {
    this.body.applyDamping(200 * dt);

    const player = this.game?.entities.getTagged("player")[0];
    const walkStrength = 100;
    if (player && this.visionCone.canSee(player)) {
      const playerPosition = V(player.body!.position);
      const direction = playerPosition.sub(this.body.position).normalize();
      this.body.applyForce(direction.mul(walkStrength));
      this.body.angle = direction.angle;
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
    this.sprite?.position.set(...this.body.position);
    this.sprite.rotation = this.body.angle;
  }

  static deserialize(e: SerializedEntity): Enemy {
    return new Enemy(V(e.position), e.angle);
  }

  serialize() : SerializedEntity {
    return {
      'position': [ ...this.position ],
      'angle': this.angle,
    };
  }
}

class VisionCone extends BaseEntity implements Entity {
  sprite: GameSprite & Graphics;
  body: Body;

  constructor() {
    super();

    this.body = new Body({
      type: Body.KINEMATIC,
      collisionResponse: false
    });

    const radius = 8; // meters
    const theta = degToRad(90);

    // TODO: Shape
    const vertices: V2d[] = [];
    vertices.push(V(0, 0));
    for (let i = -theta / 2; i <= theta / 2; i += degToRad(5)) {
      vertices.push(polarToVec(i, radius));
    }
    this.body.addShape(new Convex({ vertices }));

    const start = polarToVec(-theta / 2, radius);
    const graphics = new Graphics();
    graphics
      .moveTo(0, 0)
      .lineTo(start.x, start.y)
      .arc(0, 0, radius, -theta / 2, theta / 2)
      .lineTo(0, 0)
      .closePath()
      .fill({ color: 0xff0000, alpha: 0.5 });

    this.sprite = graphics;
  }

  canSee(entity: Entity): boolean {
    const p = V(entity.body!.position);
    const radius = 8; // meters
    const theta = degToRad(90);

    const delta = p.sub(V(this.body!.position));
    const tooFar = delta.magnitude > radius;
    if (tooFar) {
      return false;
    }

    const tau = Math.PI * 2
    // Handle three cases in case angle has wrapped around
    const inArc = delta.angle <= this.body.angle + theta / 2 && delta.angle >= this.body.angle - theta / 2
      || delta.angle + tau <= this.body.angle + theta / 2 && delta.angle + tau >= this.body.angle - theta / 2
      || delta.angle - tau <= this.body.angle + theta / 2 && delta.angle - tau >= this.body.angle - theta / 2;
    if (!inArc) {
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
  }

  // onBeginContact(
  //   other?: Entity | undefined,
  //   thisShape?: Shape | undefined,
  //   otherShape?: Shape | undefined,
  //   contactEquations?: ContactEquation[] | undefined
  // ): void {
  //   if (other?.tags?.includes("player") && this.canSee(other)) {
  //     console.log("Player in vision cone!");

  //     this.game?.addEntity(
  //       new SoundInstance(
  //         choose("fleshHit1", "fleshHit2", "fleshHit3", "fleshHit4")
  //       )
  //     );
  //   }
  // }
}
