import { Body, Box } from "p2";
import { Graphics } from "pixi.js";
import { V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { CollisionGroups } from "../CollisionGroups";
import { Layer } from "../config/layers";
import { Persistence } from "../constants/constants";

export class ExitZone extends BaseEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Game;
  body: Body;
  sprite: Graphics & GameSprite;

  constructor(position: V2d) {
    super();

    this.body = new Body({
      type: Body.STATIC,
      position,
    });

    const width = 2;
    const height = 2;
    const shape = new Box({
      height,
      width,
      sensor: true,
    });
    this.body.addShape(shape);
    shape.collisionGroup = CollisionGroups.Furniture;
    shape.collisionMask = CollisionGroups.Player;

    const graphics = new Graphics();
    graphics
      .rect(-width / 2, -height / 2, width, height)
      .fill({ color: 0x00ff00, alpha: 0.1 });

    this.sprite = graphics;
    this.sprite.layerName = Layer.FLOOR_DECALS;
    this.sprite.position.set(...position);
  }

  onBeginContact(other?: Entity | undefined): void {
    if (true) {
      this.game!.dispatch({ type: "exitReached" });
      this.sprite.alpha = 0.5;
    }
  }
}
