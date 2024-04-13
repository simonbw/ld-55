import { Body, Circle, ContactEquation, Shape } from "p2";
import { Sprite } from "pixi.js";
import { V, V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { imageName } from "../../core/resources/resourceUtils";

export class Enemy extends BaseEntity implements Entity {
  sprite: GameSprite & Sprite;
  body: Body;
  tags = ["enemy"];

  constructor(position: V2d) {
    super();

    this.body = new Body({
      mass: 0.5,
      position: position.clone(),
      fixedRotation: true,
    });

    const radius = 1; // meters

    const shape = new Circle({ radius: radius });
    this.body.addShape(shape);

    this.sprite = Sprite.from(imageName("enemy"));
    this.sprite.anchor.set(0.5);
    this.sprite.scale = (2 * radius) / this.sprite.texture.width;
  }

  onTick(dt: number): void {
    this.body.applyDamping(200 * dt);

    const player = this.game?.entities.getTagged("player")[0];
    const walkStrength = 100;
    if (player) {
      const playerPosition = V(player.body!.position);
      const direction = playerPosition.sub(this.body.position).normalize();
      this.body.applyForce(direction.mul(walkStrength));
    }
  }

  onBeginContact(
    other?: Entity | undefined,
    thisShape?: Shape | undefined,
    otherShape?: Shape | undefined,
    contactEquations?: ContactEquation[] | undefined
  ): void {
    if (other?.tags?.includes("player")) {
      other.destroy();
    }
  }

  /** Called every frame, right before rendering */
  onRender(dt: number): void {
    this.sprite?.position.set(...this.body.position);
    this.sprite.rotation = this.body.angle;
  }
}
