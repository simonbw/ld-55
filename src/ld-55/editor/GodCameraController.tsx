import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Camera2d } from "../../core/graphics/Camera2d";
import { V } from "../../core/Vector";

const CAMERA_SPEED = 10; 

export default class PlayerCameraController extends BaseEntity implements Entity {

  constructor(
    private camera: Camera2d
  ) {
    super();
  }

  onAdd() {
    this.camera.z = 40;
    const player = this.game?.entities.getTagged("player")[0];
    if (player) {
      this.camera.center(V(player.body!.position));
    }
    console.log(this.game);
  }

  /** Called every update cycle */
  onTick(dt: number) {
    let targetV = V(0, 0);
    if (this.game!.io.keyIsDown("KeyW")) {
      targetV.y -= CAMERA_SPEED;
    }
    if (this.game!.io.keyIsDown("KeyD")) {
      targetV.x += CAMERA_SPEED;
    }
    if (this.game!.io.keyIsDown("KeyS")) {
      targetV.y += CAMERA_SPEED;
    }
    if (this.game!.io.keyIsDown("KeyA")) {
      targetV.x -= CAMERA_SPEED;
    }
    this.camera.smoothSetVelocity(targetV);
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
