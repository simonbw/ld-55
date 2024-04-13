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
  }

  onRender() {
    const player = this.game?.entities.getTagged("player")[0];
    if (player) {
      this.camera.smoothCenter(V(player.body!.position));
    } else {
      this.camera.smoothSetVelocity(V(0, 0));
    }

    if (this.game?.io.keyIsDown("Equal")) {
      this.camera.z *= 1.01;
    }
    if (this.game?.io.keyIsDown("Minus")) {
      this.camera.z *= 0.99;
    }
  }
}
