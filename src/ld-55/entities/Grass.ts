import { TilingSprite } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { imageName } from "../../core/resources/resourceUtils";
import { Layer } from "../config/layers";
import { Persistence } from "../constants/constants";

export class Grass extends BaseEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Game;
  sprite: TilingSprite & GameSprite;

  constructor() {
    super();

    this.sprite = TilingSprite.from(imageName("grass1"));
    this.sprite.layerName = Layer.SUBFLOOR;

    this.sprite.position.set(-10, -10);
    this.sprite.width = 100;
    this.sprite.height = 100;
    this.sprite.tileScale.set(0.03);
  }
}
