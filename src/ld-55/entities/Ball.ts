import { Body, Circle } from "p2";
import BaseEntity from "../../core/entity/BaseEntity";
import { Graphics } from "pixi.js";
import { V2d } from "../../core/Vector";
import Entity from "../../core/entity/Entity";

export class Ball extends BaseEntity implements Entity {
  body: Body;
  tags = ["ball"];

  constructor(position: V2d) {
    super();

    this.body = new Body({
      mass: 0.5,
      position: position.clone(),
      fixedRotation: true,
    });

    const shape = new Circle({ radius: 1 });
    this.body.addShape(shape);

    const graphics = (this.sprite = new Graphics());
    graphics
      .circle(0, 0, 1)
      .fill(0xff0000)
      .setStrokeStyle({ width: 0.1, color: 0xffff00 })
      .stroke();
  }

  onTick(dt: number) {
    if (this.game!.io.keyIsDown("KeyA")) {
      this.body.applyForce([-10, 0]);
    }
    if (this.game!.io.keyIsDown("KeyD")) {
      this.body.applyForce([10, 0]);
    }
    if (this.game!.io.keyIsDown("KeyS")) {
      this.body.applyForce([0, 10]);
    }
    if (this.game!.io.keyIsDown("KeyW")) {
      this.body.applyForce([0, -10]);
    }
  }

  onRender(dt: number): void {
    this.sprite?.position.set(...this.body.position);
  }
}
