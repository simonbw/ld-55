import { Body, Circle } from "p2";
import { AnimatedSprite, Texture } from "pixi.js";
import { ImageName } from "../../../resources/resources";
import { V, V2d } from "../../core/Vector";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { CustomHandlersMap } from "../../core/entity/GameEventHandler";
import PositionalSoundListener from "../../core/sound/PositionalSoundListener";
import { CollisionGroups } from "../CollisionGroups";
import { SerializableEntity, SerializedEntity } from "../editor/serializeTypes";
import { PersonShadow } from "./PersonShadow";
import { WalkSoundPlayer } from "./WalkSoundPlayer";

const RUNNING_STEPS_PER_SECOND = 5;
const WALKING_STEPS_PER_SECOND = 3;

const WALK_SPEED = 2; // meters per second
const RUN_SPEED = 5; // meters per second

const imagesWithoutBag: ImageName[] = [
  "player1",
  "player2",
  "player3",
  "player4",
  "player5",
  "player6",
  "player7",
  "player8",
];

const imagesWithbag: ImageName[] = [
  "playerBag1",
  "playerBag2",
  "playerBag3",
  "playerBag4",
  "playerBag5",
  "playerBag6",
  "playerBag7",
  "playerBag8",
];

/** An example Entity to show some features of the engine */
export class Player extends SerializableEntity implements Entity {
  sprite: GameSprite & AnimatedSprite;
  body: Body;
  tags = ["player"];

  walkSoundPlayer: WalkSoundPlayer;
  soundListener: PositionalSoundListener;

  constructor(private position: V2d) {
    super();

    this.body = new Body({
      mass: 0.5,
      position: position.clone(),
      fixedRotation: true,
    });

    const radius = 0.5; // meters

    const shape = new Circle({ radius: radius * 0.6 });
    shape.collisionGroup = CollisionGroups.Player;
    shape.collisionMask = CollisionGroups.All;
    this.body.addShape(shape);

    this.sprite = AnimatedSprite.fromImages(imagesWithoutBag);

    this.sprite.anchor.set(0.5);
    this.sprite.setSize(2 * radius);
    this.sprite.play();

    this.walkSoundPlayer = this.addChild(new WalkSoundPlayer(this.body));
    this.soundListener = this.addChild(new PositionalSoundListener());
    this.addChild(new PersonShadow(this.body));
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

    this.soundListener.setPosition(V(this.body.position));
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

  static defaultSerializedEntity(p: V2d): SerializedEntity {
    return {
      position: [...p],
    };
  }

  handlers: CustomHandlersMap = {
    addItem: ({ name }: { name: string }) => {
      if (name === "key") {
        this.sprite.textures = imagesWithbag.map((image) =>
          Texture.from(image)
        );
      }
    },
  };
}
