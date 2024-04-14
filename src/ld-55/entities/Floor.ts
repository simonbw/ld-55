import { TilingSprite } from "pixi.js";
import { ImageName } from "../../../resources/resources";
import { V, V2d } from "../../core/Vector";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { Layer } from "../config/layers";
import { SerializableEntity, SerializedEntity } from "../editor/serializeTypes";

export class Floor extends SerializableEntity implements Entity {
  sprite: TilingSprite & GameSprite;

  constructor(
    private topLeft: V2d,
    private bottomRight: V2d,
    private texture: ImageName = "hallwayFloor"
  ) {
    super();

    this.sprite = TilingSprite.from(texture);
    this.sprite.layerName = Layer.FLOOR;

    this.sprite.position.set(topLeft.x, topLeft.y);
    this.sprite.width = bottomRight.x - topLeft.x;
    this.sprite.height = bottomRight.y - topLeft.y;

    this.sprite.tileScale.set(0.003);
  }

  serialize(): SerializedEntity {
    return {
      topLeft: [...this.topLeft],
      bottomRight: [...this.bottomRight],
      texture: this.texture,
    };
  }

  static deserialize(e: SerializedEntity): Floor {
    return new Floor(V(e.topLeft), V(e.bottomRight), e.texture);
  }
}
