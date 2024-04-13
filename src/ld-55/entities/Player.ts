import { Body, Circle } from "p2";
import { AnimatedSprite, Sprite, Spritesheet } from "pixi.js";
import { V, V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { imageName } from "../../core/resources/resourceUtils";
import { CollisionGroups } from "../CollisionGroups";
import { SerializableEntity, SerializedEntity } from "../editor/serializeTypes";
import { SoundInstance } from "../../core/sound/SoundInstance";

const RUNNING_STEPS_PER_SECOND = 5;
const WALKING_STEPS_PER_SECOND = 2;

/** An example Entity to show some features of the engine */
export class Player extends SerializableEntity implements Entity {
  sprite: GameSprite & AnimatedSprite;
  body: Body;
  tags = ["player"];

  stepSound?: SoundInstance;
  walkSoundPlayer: WalkSoundPlayer;

  constructor(private position: V2d) {
    super();

    this.body = new Body({
      mass: 0.5,
      position: position.clone(),
      fixedRotation: true,
    });

    const radius = 0.5; // meters

    const shape = new Circle({ radius: radius });
    shape.collisionGroup = CollisionGroups.Player;
    shape.collisionMask = CollisionGroups.All;
    this.body.addShape(shape);

    this.sprite = AnimatedSprite.fromImages([
      imageName("player1"),
      imageName("player2"),
      imageName("player3"),
      imageName("player4"),
      imageName("player5"),
      imageName("player6"),
      imageName("player7"),
      imageName("player8"),
    ]);
    this.sprite.anchor.set(0.5);
    this.sprite.setSize(2 * radius);

    this.walkSoundPlayer = this.addChild(new WalkSoundPlayer());
  }

  /** Called every update cycle */
  onTick(dt: number) {
    this.body.applyDamping(200 * dt);

    let walkStrength = 100;

    const sprinting = this.game!.io.keyIsDown("ShiftLeft");
    if (sprinting) {
      walkStrength = 200;
    }

    if (this.game && this.game.io.keyIsDown("KeyQ")) {
      this.game.slowMo = 0.5;
    } else if (this.game) {
      this.game.slowMo = 1;
    }

    const walkDirection = this.getWalkDirection();

    if (walkDirection.magnitude > 0) {
      this.body.applyForce(walkDirection.imul(walkStrength));
    }

    if (walkDirection.magnitude > 0) {
      const framesPerStep = 4;
      if (sprinting) {
        this.sprite.animationSpeed =
          (RUNNING_STEPS_PER_SECOND / framesPerStep / 4) * this.game!.slowMo;
      } else {
        this.sprite.animationSpeed =
          (WALKING_STEPS_PER_SECOND / framesPerStep / 4) * this.game!.slowMo;
      }

      this.sprite.play();
      this.walkSoundPlayer.advance(
        dt * (sprinting ? RUNNING_STEPS_PER_SECOND : WALKING_STEPS_PER_SECOND),
        sprinting
      );
      this.body.angle = walkDirection.angle;
    } else {
      this.walkSoundPlayer.stop();
      this.sprite.animationSpeed = 0;
      this.sprite.currentFrame = 0;
    }
  }

  private getWalkDirection(): V2d {
    const walkDirection = V(0, 0);

    if (this.game!.io.keyIsDown("KeyW")) {
      walkDirection[1] -= 1;
    }
    if (this.game!.io.keyIsDown("KeyD")) {
      walkDirection[0] += 1;
    }
    if (this.game!.io.keyIsDown("KeyS")) {
      walkDirection[1] += 1;
    }
    if (this.game!.io.keyIsDown("KeyA")) {
      walkDirection[0] -= 1;
    }

    if (walkDirection.magnitude > 1) {
      walkDirection.magnitude = 1;
    }
    return walkDirection;
  }

  /** Called every frame, right before rendering */
  onRender(dt: number): void {
    this.sprite.position.set(...this.body.position);
    this.sprite.rotation = this.body.angle + Math.PI / 2;
  }

  static deserialize(e: SerializedEntity): Player {
    return new Player(V(e.position));
  }

  serialize(): SerializedEntity {
    return {
      position: [...this.position],
    };
  }
}

class WalkSoundPlayer extends BaseEntity {
  stepProgress: number = 0.5;

  advance(walkAmount: number, sprinting: boolean) {
    this.stepProgress += walkAmount;
    if (this.stepProgress > 1) {
      this.stepProgress -= 1;
      this.addChild(new SoundInstance(sprinting ? "step2" : "step1", {}));
    }
  }

  stop() {
    this.stepProgress = 0.5;
  }

  onTick(dt: number) {
    console.log("stepProgress", this.stepProgress);
  }
}
