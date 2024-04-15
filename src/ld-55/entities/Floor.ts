import { TilingSprite } from "pixi.js";
import { ImageName } from "../../../resources/resources";
import { V, V2d } from "../../core/Vector";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { Layer } from "../config/layers";
import { Persistence } from "../constants/constants";
import { SerializableEntity, SerializedEntity } from "../editor/serializeTypes";

const floorScales: Partial<Record<ImageName, number>> = {
  hallwayFloor: 0.003,
  bathroomFloor: 0.001,
  herringboneFloor: 0.04,
  floorCarpet1: 0.02,
  floorCarpet2: 0.02,
  floorCarpet3: 0.02,
  floorCarpet4: 0.02,
  carpetFloor5: 0.04,
  carpetFloor6: 0.04,
  carpetFloor7: 0.04,
  gymBballCourt: 0.08,
};

export class Floor extends SerializableEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Game;
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

    const scale = floorScales[texture] || 0.004;
    this.sprite.tileScale.set(scale);
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

  static defaultSerializedEntity(p: V2d): SerializedEntity {
    return {
      topLeft: [...p],
      bottomRight: [...p.add([1.4, 1.4])],
      texture: "hallwayFloor",
    };
  }
}
