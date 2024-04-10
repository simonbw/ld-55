import { Body, Circle } from "p2";
import BaseEntity from "../../core/entity/BaseEntity";
import { Graphics, Sprite } from "pixi.js";
import { V2d } from "../../core/Vector";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { imageName } from "../../core/resources/resourceUtils";

export class Ball extends BaseEntity implements Entity {
  sprite: GameSprite & Sprite;
  body: Body;
  tags = ["ball"];

  constructor(position: V2d) {
    super();

    this.body = new Body({
      mass: 0.5,
      position: position.clone(),
      fixedRotation: true,
    });

    const ballRadius = 1;

    const shape = new Circle({ radius: ballRadius });
    this.body.addShape(shape);

    this.sprite = Sprite.from(imageName("favicon"));
    this.sprite.anchor.set(0.5);
    this.sprite.scale = (2 * ballRadius) / this.sprite.texture.width;
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
