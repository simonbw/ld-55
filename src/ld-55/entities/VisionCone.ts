import { Body, Convex, Ray, RaycastResult } from "p2";
import { Graphics } from "pixi.js";
import { V, V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { angleDelta, degToRad, polarToVec } from "../../core/util/MathUtil";

export class VisionCone extends BaseEntity implements Entity {
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
      .fill({ color: 16777215, alpha: 0.1 });

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
      this.sprite.tint = 16711680;
    } else {
      this.sprite.tint = 16777215;
    }
  }
}
