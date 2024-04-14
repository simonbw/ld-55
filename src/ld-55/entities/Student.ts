import { Body, Circle, ContactEquation, Shape } from "p2";
import { Sprite } from "pixi.js";
import { ImageName } from "../../../resources/resources";
import { V, V2d } from "../../core/Vector";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { choose } from "../../core/util/Random";
import { CollisionGroups } from "../CollisionGroups";
import { SerializableEntity, SerializedEntity } from "../editor/serializeTypes";
import { PersonShadow } from "./PersonShadow";
import { Persistence } from "../constants/constants";

const studentTextures: ImageName[] = [
  "boy11",
  "boy21",
  "boy31",
  "girl11",
  "girl21",
  "girl31",
  "girlemo1",
];

/** An example Entity to show some features of the engine */
export class Student extends SerializableEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Game;
  sprite: GameSprite & Sprite;
  body: Body;
  tags = ["student"];

  constructor(
    private position: V2d,
    angle: number = 0
  ) {
    super();

    this.body = new Body({
      mass: 2,
      position: position.clone(),
      angle,
      damping: 0.99,
      angularDamping: 0.99,
    });

    const radius = 0.5; // meters

    const shape = new Circle({ radius: radius * 0.6 });
    shape.collisionGroup = CollisionGroups.Player;
    shape.collisionMask = CollisionGroups.All;
    this.body.addShape(shape);

    this.sprite = Sprite.from(choose(...studentTextures));
    this.sprite.anchor.set(0.5);
    this.sprite.setSize(2 * radius);

    this.addChild(new PersonShadow(this.body));
  }

  // onBeginContact(other?: Entity | undefined, thisShape?: Shape | undefined, otherShape?: Shape | undefined, contactEquations?: ContactEquation[] | undefined): void {
  //   if (other!.tags!.includes("enemy")) {
  //     this.game?.dispatch({ type: "gameOver" });
  //   }
  // }

  onTick(dt: number): void {
    this.body.applyDamping(dt);
  }

  /** Called every frame, right before rendering */
  onRender(dt: number): void {
    this.sprite.position.set(...this.body.position);
    this.sprite.rotation = this.body.angle + Math.PI / 2;
  }

  static deserialize(e: SerializedEntity): Student {
    return new Student(V(e.position));
  }

  serialize(): SerializedEntity {
    return {
      position: [...this.position],
    };
  }
}
