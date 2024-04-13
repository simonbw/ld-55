import { Body, Circle } from "p2";
import { Sprite } from "pixi.js";
import { V, V2d } from "../../core/Vector";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { imageName } from "../../core/resources/resourceUtils";
import { SerializableEntity, SerializedEntity } from "../editor/serializeTypes";

/** An example Entity to show some features of the engine */
export class Player extends SerializableEntity implements Entity {
  sprite: GameSprite & Sprite;
  body: Body;
  tags = ["player"];

  constructor(private position: V2d) {
    super();

    this.body = new Body({
      mass: 0.5,
      position: position.clone(),
      fixedRotation: true,
    });

    const radius = 0.5; // meters

    const shape = new Circle({ radius: radius });
    this.body.addShape(shape);

    this.sprite = Sprite.from(imageName("player"));
    this.sprite.anchor.set(0.5);
    this.sprite.scale = (2 * radius) / this.sprite.texture.width;
  }

  /** Called every update cycle */
  onTick(dt: number) {
    this.body.applyDamping(200 * dt);

    const walkStrength = 200;
    if (this.game!.io.keyIsDown("KeyW")) {
      this.body.applyForce([0, -walkStrength]);
    }
    if (this.game!.io.keyIsDown("KeyD")) {
      this.body.applyForce([walkStrength, 0]);
    }
    if (this.game!.io.keyIsDown("KeyS")) {
      this.body.applyForce([0, walkStrength]);
    }
    if (this.game!.io.keyIsDown("KeyA")) {
      this.body.applyForce([-walkStrength, 0]);
    }
  }

  /** Called every frame, right before rendering */
  onRender(dt: number): void {
    this.sprite?.position.set(...this.body.position);
  }

  static deserialize(e: SerializedEntity): Player {
    return new Player(V(e.position));
  }

  serialize() : SerializedEntity {
    return {
      'position': [ ...this.position ],
    };
  }
}
