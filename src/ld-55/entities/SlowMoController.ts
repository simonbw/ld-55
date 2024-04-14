import { Sprite, Text } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { Layer } from "../config/layers";

export default class SlowMoController extends BaseEntity implements Entity {
  sprite: Sprite & GameSprite;
  slowMoText: Text;

  slowMoLimit: number = 2; // seconds of slow motion
  slowMoCurrent: number = 0;
  slowMoExhausted: boolean = false;

  constructor() {
    super();

    this.sprite = new Sprite();
    this.sprite.layerName = Layer.HUD;

    this.slowMoText = new Text({
      text: "Slow-Mo (Q): 100",
      style: {
        align: "right",
        fill: "white",
        // fontFamily: "Comfortaa",
        fontSize: 16,
      },
    });
    this.slowMoText.anchor.set(1, 1);

    this.sprite.addChild(this.slowMoText);
  }

  onTick(dt: number): void {
    const SLOW_MO_MULTIPLIER = 0.5;
    const SLOW_MO_RECHARGE_RATE = 1.0;

    if (!this.game) {
      return;
    }

    if (this.slowMoExhausted) {
      this.game.slowMo = 1.0;

      this.slowMoCurrent = Math.max(0, this.slowMoCurrent - dt);
      if (this.slowMoCurrent <= 0) {
        this.slowMoExhausted = false;
      }
    } else if (
      this.game.io.keyIsDown("KeyQ") &&
      this.slowMoCurrent < this.slowMoLimit
    ) {
      this.game!.slowMo = SLOW_MO_MULTIPLIER;
      this.slowMoCurrent = Math.min(
        this.slowMoLimit,
        this.slowMoCurrent + dt / SLOW_MO_MULTIPLIER
      );

      if (this.slowMoCurrent >= this.slowMoLimit) {
        this.slowMoExhausted = true;
      }
    } else {
      this.game!.slowMo = 1.0;
      this.slowMoCurrent = Math.max(
        0,
        this.slowMoCurrent - dt * SLOW_MO_RECHARGE_RATE
      );
    }
  }

  onResize([width, height]: [number, number]) {
    this.slowMoText.position.set(width - 20, height - 20);
  }

  onRender(dt: number): void {
    this.slowMoText.text = `Slow-Mo (Q): ${100 - Math.floor((this.slowMoCurrent / this.slowMoLimit) * 100)}`;
  }
}
