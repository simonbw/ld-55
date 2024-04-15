import { Sprite } from "pixi.js";
import { ImageName } from "../../../resources/resources";
import { V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { Layer } from "../config/layers";
import { Persistence } from "../constants/constants";

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

export class FloorDecal extends BaseEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Game;
  sprite: Sprite & GameSprite;

  constructor(
    private topLeft: V2d,
    private bottomRight: V2d,
    private angle: number = 0,
    private texture: ImageName = "gymBballCourt"
  ) {
    super();
    
    this.sprite = Sprite.from(texture);
    this.sprite.layerName = Layer.DECORATIONS;
    this.sprite.position.set(topLeft.x + (bottomRight.x - topLeft.x) / 2, topLeft.y + (bottomRight.y - topLeft.y) / 2);
    this.sprite.rotation = angle;
    this.sprite.anchor.set(0.5);

    this.sprite.setSize(bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
  }
}
