import { Body } from "p2";
import { AnimatedSprite } from "pixi.js";
import { ImageName } from "../../../resources/resources";
import { V, V2d } from "../../core/Vector";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { choose } from "../../core/util/Random";
import { CollisionGroups } from "../CollisionGroups";
import { Persistence } from "../constants/constants";
import { SerializedEntity } from "../editor/serializeTypes";
import { Human } from "./Human";
import { WalkSoundPlayer } from "./WalkSoundPlayer";

const studentImages: ImageName[][] = [
  ["boy11", "boy12", "boy13", "boy14", "boy15", "boy16", "boy17", "boy18"],
  ["boy21", "boy22", "boy23", "boy24", "boy25", "boy26", "boy27", "boy28"],
  ["boy31", "boy32", "boy33", "boy34", "boy35", "boy36", "boy37", "boy38"],
  [
    "girl11",
    "girl12",
    "girl13",
    "girl14",
    "girl15",
    "girl16",
    "girl17",
    "girl18",
  ],
  [
    "girl21",
    "girl22",
    "girl23",
    "girl24",
    "girl25",
    "girl26",
    "girl27",
    "girl28",
  ],
  [
    "girl31",
    "girl32",
    "girl33",
    "girl34",
    "girl35",
    "girl36",
    "girl37",
    "girl38",
  ],
  [
    "girlemo1",
    "girlemo2",
    "girlemo3",
    "girlemo4",
    "girlemo5",
    "girlemo6",
    "girlemo7",
    "girlemo8",
  ],
];

/** An example Entity to show some features of the engine */
export class Student extends Human implements Entity {
  persistenceLevel: Persistence = Persistence.Game;
  targetLocation: V2d;

  constructor(
    private position: V2d,
    angle: number = 0,
    images: ImageName[] = choose(...studentImages)
  ) {
    super({
      position,
      angle,
      images,
      collisionGroup: CollisionGroups.Students,
      walkSpeed: 3,
      runSpeed: 6,
      tags: ["student"],
    });

    this.targetLocation = position;
  }

  onTick(dt: number): void {
    super.onTick(dt);

    if (this.isAtTargetLocation()) {
      this.walkSpring.stop();
    } else {
      const diff = this.targetLocation.sub(this.body.position);
      const direction = diff.normalize();
      this.walkSpring.walkTowards(direction.angle, 1);
    }
  }

  isAtTargetLocation(): boolean {
    return this.targetLocation.sub(this.body.position).magnitude < 0.2;
  }

  isTargettingPlayer(): boolean {
    return false;
  }

  setTargetLocation(p: V2d) {
    this.targetLocation = p;
  }

  /** Called every frame, right before rendering */
  onRender(dt: number): void {
    this.sprite.position.set(...this.body.position);
    this.sprite.rotation = this.body.angle + Math.PI / 2;
  }

  ///////////////////////////
  /// SERIALIZATION STUFF ///
  ///////////////////////////

  static deserialize(e: SerializedEntity): Student {
    return new Student(V(e.position));
  }

  serialize(): SerializedEntity {
    return {
      position: [...this.position],
    };
  }

  static defaultSerializedEntity(p: V2d): SerializedEntity {
    return {
      position: [...p],
    };
  }
}
