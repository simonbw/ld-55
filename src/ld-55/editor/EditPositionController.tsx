import { Graphics } from "pixi.js";
import { V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

const RADIUS = 0.1;

export class EditPositionController extends BaseEntity implements Entity {

  selected = false;

  constructor(private v: V2d, public entityInd: number, public property: string) {
    super();
    
    const graphics = new Graphics();
    graphics
      .circle(0, 0, RADIUS)
      .fill(0xff0000);

    this.sprite = graphics;
    this.sprite.position.set(v.x, v.y);
  }

  getDistance(v: V2d): number {
    return v.sub(this.v).magnitude;
  }

  onRender(dt: number): void {
    if (this.selected) {
      this.sprite!.tint = 0xbbbb00;
    } else {
      this.sprite!.tint = 0xbb0000;
    }
  }

  onSelected(position: V2d) {
    this.selected = true;
    this.sprite!.position.set(...position);
  }

  onUnselected() {
    this.selected = false;
  }

}