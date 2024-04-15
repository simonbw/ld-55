import { Texture } from "pixi.js";
import { ImageName } from "../../../resources/resources";
import { V, V2d } from "../../core/Vector";
import Entity from "../../core/entity/Entity";
import { CustomHandlersMap } from "../../core/entity/GameEventHandler";
import PositionalSoundListener from "../../core/sound/PositionalSoundListener";
import { clamp } from "../../core/util/MathUtil";
import { CollisionGroups } from "../CollisionGroups";
import { SerializedEntity } from "../editor/serializeTypes";
import { Human } from "./Human";

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
export class Player extends Human implements Entity {
  soundListener: PositionalSoundListener;

  constructor(private position: V2d) {
    super({
      position,
      angle: 0,
      images: imagesWithoutBag,
      collisionGroup: CollisionGroups.Player,
      walkSpeed: 4,
      runSpeed: 10,
    });

    this.tags.push("player");
    this.soundListener = this.addChild(new PositionalSoundListener());
  }

  /** Called every update cycle */
  onTick(dt: number) {
    this.running = this.game!.io.keyIsDown("ShiftLeft");
    const walkDirection = this.game!.io.getMovementVector();
    const walkPercent = clamp(walkDirection.magnitude);
    this.walkSpring.walkTowards(walkDirection.angle, walkPercent);
    super.onTick(dt);
    this.soundListener.setPosition(V(this.body.position));
  }
  wd;

  handlers: CustomHandlersMap = {
    addItem: ({ name }: { name: string }) => {
      if (name === "key") {
        this.sprite.textures = imagesWithbag.map((image) =>
          Texture.from(image)
        );
      }
    },
  };

  serialize(): SerializedEntity {
    throw new Error("Method not implemented.");
  }
}
