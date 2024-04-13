import p2, { Body } from "p2";
import { V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Graphics } from "pixi.js";

export class Wall extends BaseEntity implements Entity {
  constructor(position1: V2d, position2: V2d) {
    super();

    const angle = position1.sub(position2).angle;
    const position = position1.add(position2).mul(0.5);
    this.body = new Body({
      type: Body.STATIC,
      position,
      angle,
    });

    const shape = new p2.Box({
      height: 0.5,
      width: position1.sub(position2).magnitude,
    });
    this.body.addShape(shape);

    const graphics = new Graphics();
    graphics
      .rect(-shape.width / 2, -shape.height / 2, shape.width, shape.height)
      .fill(0xff0000);

    this.sprite = graphics;
    this.sprite.position.set(...position);
    this.sprite.rotation = angle;
  }
}
