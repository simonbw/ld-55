import { Body, Circle } from "p2";
import { AnimatedSprite } from "pixi.js";
import { V, V2d } from "../../core/Vector";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { choose } from "../../core/util/Random";
import { CollisionGroups } from "../CollisionGroups";
import { Persistence } from "../constants/constants";
import { SerializableEntity, SerializedEntity } from "../editor/serializeTypes";
import { PersonShadow } from "./PersonShadow";
import { WalkSoundPlayer } from "./WalkSoundPlayer";

const studentBaseTextures: string[] = [
  "boy1",
  "boy2",
  "boy3",
  "girl1",
  "girl2",
  "girl3",
  "girlemo",
];
const WALKING_STEPS_PER_SECOND = 2;

/** An example Entity to show some features of the engine */
export class Student extends SerializableEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Game;
  sprite: GameSprite & AnimatedSprite;
  body: Body;
  tags = ["student"];
  targetLocation: V2d;
  walkSoundPlayer: WalkSoundPlayer;

  constructor(
    private position: V2d,
    angle: number = 0
  ) {
    super();

    this.body = new Body({
      mass: 0.5,
      position: position.clone(),
      angle,
    });

    const radius = 0.5; // meters

    const shape = new Circle({ radius: radius * 0.6 });
    shape.collisionGroup = CollisionGroups.Player;
    shape.collisionMask = CollisionGroups.All;
    this.body.addShape(shape);

    const baseTexture = choose(...studentBaseTextures);

    this.sprite = AnimatedSprite.fromImages([
      baseTexture + "1",
      baseTexture + "2",
      baseTexture + "3",
      baseTexture + "4",
      baseTexture + "5",
      baseTexture + "6",
      baseTexture + "7",
      baseTexture + "8",
    ]);
    this.sprite.anchor.set(0.5);
    this.sprite.scale = (2 * radius) / this.sprite.texture.width;
    this.sprite.play();

    this.addChild(new PersonShadow(this.body));
    this.walkSoundPlayer = this.addChild(new WalkSoundPlayer(this.body));
    this.targetLocation = position;
  }

  onTick(dt: number): void {
    this.body.applyDamping(200 * dt);

    let moving;
    if (this.isAtTargetLocation()) {
      this.walkSoundPlayer.stop();
      this.sprite.animationSpeed = 0;
      this.sprite.currentFrame = 0;

      moving = false;
    } else {
      const walkStrength = 40;
      const diff = this.targetLocation.sub(this.body.position);
      const direction = diff.normalize();
      this.body.applyForce(direction.mul(walkStrength));
      this.body.angle = direction.angle;

      moving = true;
    }

    if (moving) {
      const framesPerStep = 4;
      this.sprite.animationSpeed =
        (WALKING_STEPS_PER_SECOND / framesPerStep / 4) * this.game!.slowMo;

      this.walkSoundPlayer.advance(dt * WALKING_STEPS_PER_SECOND, false);
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
