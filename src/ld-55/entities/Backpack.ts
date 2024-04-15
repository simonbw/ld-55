import { GlowFilter } from "pixi-filters";
import { Sprite } from "pixi.js";
import { V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { imageName } from "../../core/resources/resourceUtils";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { stepToward } from "../../core/util/MathUtil";
import { Layer } from "../config/layers";
import { Persistence } from "../constants/constants";
import { Player } from "./Player";

export class Key extends BaseEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Game;
  sprite: GameSprite & Sprite;
  glowFilter: GlowFilter;

  constructor(private position: V2d) {
    super();

    this.sprite = Sprite.from(imageName("classroomBagBlue"));
    this.sprite.setSize(0.4);
    this.sprite.anchor.set(0.5);
    this.sprite.layerName = Layer.ITEMS;
    this.sprite.position.set(...position);

    this.glowFilter = new GlowFilter({
      color: 0xffffcc,
      distance: 16,
      outerStrength: 4,
      innerStrength: 1,
      alpha: 0,
    });
    this.sprite.filters = [this.glowFilter];
  }

  playerWithinRange(): boolean {
    const player = this.getPlayer();
    if (!player) return false;
    const displacement = this.position.sub(player.body.position);
    return displacement.magnitude < 0.85;
  }

  getPlayer(): Player | undefined {
    return this.game?.entities.getTagged("player")[0] as Player | undefined;
  }

  onRender(dt: number): void {
    const t = this.game!.elapsedTime * 5 * Math.PI;
    const targetAlpha = this.playerWithinRange() ? 0.3 + 0.05 * Math.sin(t) : 0;

    this.glowFilter.alpha = stepToward(
      this.glowFilter.alpha,
      targetAlpha,
      dt * 6
    );
  }

  onKeyDown(key: KeyCode, event: KeyboardEvent): void {
    if (key == "KeyE" && this.playerWithinRange()) {
      this.game!.dispatch({
        type: "addItem",
        name: "key",
        description: "A key",
      });
      this.game?.dispatch({
        type: "completeRequirement",
        requirement: "backpack",
      });
      this.game!.addEntity(new SoundInstance("backpackPickup"));
      this.destroy();
    }
  }
}