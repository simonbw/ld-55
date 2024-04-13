import { Body, Circle, ContactEquation, Convex, Shape } from "p2";
import { Graphics, Sprite } from "pixi.js";
import { V, V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { imageName } from "../../core/resources/resourceUtils";
import Game from "../../core/Game";
import { degToRad, polarToVec } from "../../core/util/MathUtil";
import { PositionalSound } from "../../core/sound/PositionalSound";
import { choose } from "../../core/util/Random";
import { SoundInstance } from "../../core/sound/SoundInstance";

export class Enemy extends BaseEntity implements Entity {
  sprite: GameSprite & Sprite;
  body: Body;
  tags = ["enemy"];

  visionCone: VisionCone;

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

    this.visionCone = this.addChild(new VisionCone());
  }

  onTick(dt: number): void {
    this.body.applyDamping(200 * dt);

    const player = this.game?.entities.getTagged("player")[0];
    const walkStrength = 100;
    if (player) {
      const playerPosition = V(player.body!.position);
      const direction = playerPosition.sub(this.body.position).normalize();
      this.body.applyForce(direction.mul(walkStrength));
      this.body.angle = direction.angle;
    }

    this.visionCone.body.position = this.body.position;
    this.visionCone.body.angle = this.body.angle;
  }

  onBeginContact(
    other?: Entity | undefined,
    thisShape?: Shape | undefined,
    otherShape?: Shape | undefined,
    contactEquations?: ContactEquation[] | undefined
  ): void {
    if (other?.tags?.includes("player")) {
      // other.destroy();
    }
  }

  /** Called every frame, right before rendering */
  onRender(dt: number): void {
    this.sprite?.position.set(...this.body.position);
    this.sprite.rotation = this.body.angle;
  }
}

class VisionCone extends BaseEntity implements Entity {
  sprite: GameSprite & Graphics;
  body: Body;

  constructor() {
    super();

    this.body = new Body({
      type: Body.KINEMATIC,
      collisionResponse: false,
    });

    const radius = 8; // meters
    const theta = degToRad(90);

    // TODO: Shape
    const vertices: V2d[] = [];
    vertices.push(V(0, 0));
    for (let i = -theta / 2; i <= theta / 2; i += degToRad(5)) {
      vertices.push(polarToVec(i, radius));
    }
    this.body.addShape(new Convex({ vertices }));

    const start = polarToVec(-theta / 2, radius);
    const graphics = new Graphics();
    graphics
      .moveTo(0, 0)
      .lineTo(start.x, start.y)
      .arc(0, 0, radius, -theta / 2, theta / 2)
      .lineTo(0, 0)
      .closePath()
      .fill({ color: 0xff0000, alpha: 0.5 });

    this.sprite = graphics;
  }

  onRender(dt: number): void {
    this.sprite.position.set(...this.body.position);
    this.sprite.rotation = this.body.angle;
  }

  onBeginContact(
    other?: Entity | undefined,
    thisShape?: Shape | undefined,
    otherShape?: Shape | undefined,
    contactEquations?: ContactEquation[] | undefined
  ): void {
    if (other?.tags?.includes("player")) {
      console.log("Player in vision cone!");

      this.game?.addEntity(
        new SoundInstance(
          choose("fleshHit1", "fleshHit2", "fleshHit3", "fleshHit4")
        )
      );
    }
  }
}
