import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Camera2d } from "../../core/graphics/Camera2d";
import { V } from "../../core/Vector";
import { Player } from "./Player";

export default class PlayerCameraController
  extends BaseEntity
  implements Entity
{
  constructor(private camera: Camera2d) {
    super();
  }

  onAdd() {
    const player = this.game?.entities.getTagged("player")[0];
    if (player instanceof Player) {
      this.camera.position.set(player.getPosition());
    }
    this.camera.z = 65;
  }

  onRender() {
    const player = this.game?.entities.getTagged("player")[0];
    if (player instanceof Player) {
      this.camera.smoothCenter(player.getPosition());
    } else {
      this.camera.smoothSetVelocity(V(0, 0));
    }
  }
}
