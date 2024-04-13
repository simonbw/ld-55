import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Camera2d } from "../../core/graphics/Camera2d";
import { V } from "../../core/Vector";

export default class PlayerCameraController extends BaseEntity implements Entity {

  constructor(
    private camera: Camera2d
  ) {
    super();
  }

  onAdd() {
    this.camera.z = 65;
    const player = this.game?.entities.getTagged("player")[0];
    if (player) {
      this.camera.smoothCenter(V(player.body!.position));
    } else {
      this.camera.smoothSetVelocity(V(0, 0));
    }
  }

  /** Called every update cycle */
  onTick(dt: number) {
    if (this.game!.io.keyIsDown("KeyW")) {
      this.camera.smoothSetVelocity(V(0, 11));
    }
    if (this.game!.io.keyIsDown("KeyD")) {
      this.camera.smoothSetVelocity(V(1, 0));
    }
    if (this.game!.io.keyIsDown("KeyS")) {
      this.camera.smoothSetVelocity(V(0, 1));
    }
    if (this.game!.io.keyIsDown("KeyA")) {
      this.camera.smoothSetVelocity(V(-1, 0));
    }
  }

  onRender() {
    if (this.game?.io.keyIsDown("Equal")) {
      this.camera.z *= 1.01;
    }
    if (this.game?.io.keyIsDown("Minus")) {
      this.camera.z *= 0.99;
    }
  }
}
