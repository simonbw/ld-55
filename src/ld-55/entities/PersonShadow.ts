import { Sprite } from "pixi.js";
import { V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { imageName } from "../../core/resources/resourceUtils";

export class PersonShadow extends BaseEntity implements Entity {
  sprite: GameSprite & Sprite;

  constructor(
    private getPersonPosition: () => V2d,
    private getPersonRotation: () => number
  ) {
    super();

    this.sprite = Sprite.from(imageName("playerShadow"));
    this.sprite.anchor.set(0.5);
    this.sprite.setSize(1.5);
    this.sprite.alpha = 0.5;
  }

  onRender(): void {
    this.sprite.position.set(...this.getPersonPosition());
    this.sprite.rotation = this.getPersonRotation();
  }
}
