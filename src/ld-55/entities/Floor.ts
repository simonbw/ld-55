import { TilingSprite } from "pixi.js";
import { ImageName } from "../../../resources/resources";
import { V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { Layer } from "../config/layers";

export class Floor extends BaseEntity implements Entity {
  sprite: TilingSprite & GameSprite;

  constructor(
    topLeft: V2d,
    bottomRight: V2d,
    texture: ImageName = "hallwayFloor"
  ) {
    super();

    this.sprite = TilingSprite.from(texture);
    this.sprite.layerName = Layer.FLOOR;

    this.sprite.position.set(topLeft.x, topLeft.y);
    this.sprite.width = bottomRight.x - topLeft.x;
    this.sprite.height = bottomRight.y - topLeft.y;

    this.sprite.tileScale.set(0.003);
  }
}
