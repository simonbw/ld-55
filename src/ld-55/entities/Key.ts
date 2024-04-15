import p2, { Body } from "p2";
import { Graphics, Sprite } from "pixi.js";
import { V, V2d } from "../../core/Vector";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import BaseEntity from "../../core/entity/BaseEntity";
import { Player } from "./Player";
import Game from "../../core/Game";
import { Persistence } from "../constants/constants";
import { Layer } from "../config/layers";
import { imageName } from "../../core/resources/resourceUtils";
import { SoundInstance } from "../../core/sound/SoundInstance";

export class Key extends BaseEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Game;
  player: Player | undefined;
  sprite: GameSprite & Sprite;

  constructor(private position: V2d) {
    super();

    this.sprite = Sprite.from(imageName("classroomBagBlue"));
    this.sprite.setSize(0.4);
    this.sprite.anchor.set(0.5);
    this.sprite.layerName = Layer.ITEMS;
    this.sprite.position.set(...position);
  }

  onAdd(game: Game): void {
    this.player = game.entities.getTagged("player")[0] as Player;
  }

  onKeyDown(key: KeyCode, event: KeyboardEvent): void {
    if (
      key == "KeyE" &&
      this.position.sub(this.player!.body.position).magnitude < 0.7
    ) {
      this.game!.dispatch({
        type: "addItem",
        name: "key",
        description: "A key",
      });
      this.game!.addEntity(new SoundInstance("backpackPickup"));
      this.destroy();
    }
  }
}
