import p2, { Body, Shape } from "p2";
import { V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { Graphics, Sprite } from "pixi.js";
import Game from "../../core/Game";

export class Door extends BaseEntity implements Entity {
  //sprite: GameSprite;
  body: Body;
  width: V2d;
  
  constructor(position1: V2d, position2: V2d) {
    super();

    const angle = position1.sub(position2).angle;
    const position = position1.add(position2).mul(0.5);

    this.body = new Body({
      mass: 0.5,
      position,
      angle,
    });    

    this.width = position1.sub(position2);

    const shape = new p2.Box({
      height: 0.5,
      width: this.width.magnitude,
    });
    this.body.addShape(shape);

    const graphics = new Graphics();
    graphics
      .rect(-shape.width / 2, -shape.height / 2, shape.width, shape.height)
      .fill(0x00bb00);

    this.sprite = graphics;
    this.sprite.position.set(...position);
    this.sprite.rotation = angle;
  }

  afterAdded(game: Game): void {
    this.constraints = [
      new p2.RevoluteConstraint(this.body, game.ground, {
        localPivotA: [this.body.shapes[0].width / 2, 0],
        localPivotB: [0, 0]
      }),
    ];

    game.world.addConstraint(this.constraints[0]);
  }

  /** Called every frame, right before rendering */
  onRender(dt: number): void {
    if (this.sprite) {
      this.sprite.position.set(...this.body.position);
      this.sprite.rotation = this.body.angle;
    }
  }
}
