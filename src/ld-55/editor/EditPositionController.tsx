import { Graphics } from "pixi.js";
import { V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

const RADIUS = 0.1;

export class EditPositionController extends BaseEntity implements Entity {

  constructor(private v: V2d) {
    super();
    
    const graphics = new Graphics();
    graphics
      .circle(v.x, v.y, RADIUS)
      .fill(0xbb0000);

    this.sprite = graphics;
    // this.sprite.position.set(...position);
  }

}