import { Graphics } from "pixi.js";
import { V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

const RADIUS = 1.5;
const ARROW_RADIUS = 0.2;

export class EditAngleController extends BaseEntity implements Entity {

  constructor(private v: V2d, private angle: number) {
    super();
    
    const graphics = new Graphics();
    graphics
      .moveTo(0, 0)
      .lineTo(RADIUS, 0)
      .stroke({ width: 0.1, color: 0xbbbb00 });
    graphics
      .moveTo(RADIUS - ARROW_RADIUS, -ARROW_RADIUS)
      .lineTo(RADIUS, 0)
      .lineTo(RADIUS - ARROW_RADIUS, +ARROW_RADIUS)
      .stroke({ width: 0.1, color: 0xbbbb00 });

    this.sprite = graphics;
    this.sprite.angle = angle;
    this.sprite.position.set(...v);
  }
}
