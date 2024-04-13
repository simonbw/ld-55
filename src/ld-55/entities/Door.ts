import p2, { Body } from "p2";
import { Graphics } from "pixi.js";
import Game from "../../core/Game";
import { V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import DampedRotationalSpring from "../../core/physics/DampedRotationalSpring";
import { CollisionGroups } from "../CollisionGroups";
import { degToRad } from "../../core/util/MathUtil";

export class Door extends BaseEntity implements Entity {
  //sprite: GameSprite;
  body: Body;

  constructor(
    public hinge: V2d,
    public end: V2d
  ) {
    super();

    const restAngle = hinge.sub(end).angle;

    this.body = new Body({
      mass: 0.5,
      position: hinge.clone(),
      angle: restAngle,
    });
    this.body.angle = restAngle;

    const width = hinge.sub(end).magnitude;

    const shape = new p2.Box({
      height: 0.5,
      width,
    });
    shape.collisionGroup = CollisionGroups.Walls;
    shape.collisionMask = CollisionGroups.All ^ CollisionGroups.Walls; // Don't run into other walls
    this.body.addShape(shape, [width / 2, 0]);

    const graphics = new Graphics();
    graphics
      .rect(0, -shape.height / 2, shape.width, shape.height)
      .fill(0x00bb00);

    this.sprite = graphics;
    this.sprite.position.set(...hinge);
    this.sprite.rotation = restAngle;
  }

  onAdd(game: Game): void {
    const restAngle = this.hinge.sub(this.end).angle;

    const constraint = new p2.RevoluteConstraint(this.body, game.ground, {
      worldPivot: this.hinge.clone(),
    });
    const swingLimit = degToRad(110);
    constraint.upperLimit = restAngle + swingLimit;
    constraint.lowerLimit = restAngle - swingLimit;
    constraint.upperLimitEnabled = true;
    constraint.lowerLimitEnabled = true;
    this.constraints = [constraint];

    this.springs = [
      new DampedRotationalSpring(this.body, game.ground, {
        worldAnchorA: this.body.position,
        worldAnchorB: this.body.position,
        restAngle: restAngle,
        damping: 30,
        stiffness: 500,
        maxTorque: 50,
      }),
    ];
  }

  /** Called every frame, right before rendering */
  onRender(dt: number): void {
    if (this.sprite) {
      this.sprite.position.set(...this.body.position);
      this.sprite.rotation = this.body.angle;
    }
  }
}
