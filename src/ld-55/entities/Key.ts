import p2, { Body } from "p2";
import { Graphics, Sprite } from "pixi.js";
import { V, V2d } from "../../core/Vector";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import BaseEntity from "../../core/entity/BaseEntity";
import { Player } from "./Player";
import Game from "../../core/Game";
import { Persistence } from "../constants/constants";
import { Layer } from "../config/layers";
import { imageName } from "../../core/resources/resourceUtils";

export class Key extends BaseEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Game;
  player: Player | undefined;

  constructor(private position: V2d) {
    super();

    this.body = new Body({
      type: Body.STATIC,
      position,
      fixedRotation: true,
    });

    const shape = new p2.Box({
      height: 0.5,
      width: 0.5,
    });
    this.body.addShape(shape);

    this.sprite = Sprite.from(imageName("classroomBagBlue"));
    this.sprite.setSize(0.4);
    this.sprite.layerName = Layer.ITEMS;
    this.sprite.position.set(...position);
  }

  onAdd(game: Game): void {
    this.player = game.entities.getTagged("player")[0] as Player;
  }

  onKeyDown(key: KeyCode, event: KeyboardEvent): void {
    if (
      key == "KeyE" &&
      V(this.player!.body.position).sub(V(this.body!.position)).magnitude < 0.5
    ) {
      this.game!.dispatch({
        type: "addItem",
        name: "key",
        description: "A key",
      });
      this.destroy();
    }
  }
}
