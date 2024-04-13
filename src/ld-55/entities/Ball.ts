import { Body, Circle } from "p2";
import BaseEntity from "../../core/entity/BaseEntity";
import { Graphics, Sprite } from "pixi.js";
import { V2d } from "../../core/Vector";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { imageName } from "../../core/resources/resourceUtils";

/** An example Entity to show some features of the engine */
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

    const ballRadius = 1; // meters

    const shape = new Circle({ radius: ballRadius });
    this.body.addShape(shape);

    this.sprite = Sprite.from(imageName("ball"));
    this.sprite.anchor.set(0.5);
    this.sprite.scale = (2 * ballRadius) / this.sprite.texture.width;
  }

  /** Called every update cycle */
  onTick(dt: number) {
    this.body.applyDamping(200 * dt);

    const walkStrength = 200;
    if (this.game!.io.keyIsDown("KeyW")) {
      this.body.applyForce([0, -walkStrength]);
    }
    if (this.game!.io.keyIsDown("KeyD")) {
      this.body.applyForce([walkStrength, 0]);
    }
    if (this.game!.io.keyIsDown("KeyS")) {
      this.body.applyForce([0, walkStrength]);
    }
    if (this.game!.io.keyIsDown("KeyA")) {
      this.body.applyForce([-walkStrength, 0]);
    }
  }

  /** Called every frame, right before rendering */
  onRender(dt: number): void {
    this.sprite?.position.set(...this.body.position);
  }

  handlers = {
    bounce: () => {
      console.log("Bounce!");
    },
  };
}
