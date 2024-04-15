import { Graphics } from "pixi.js";
import Game from "../../core/Game";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { smoothStep } from "../../core/util/MathUtil";
import { Layer } from "../config/layers";

export default class FadeFromColor extends BaseEntity implements Entity {
  pausable = false;
  sprite: GameSprite;

  private _promise!: Promise<void>;
  private _resolve!: (value: void | PromiseLike<void>) => void;

  constructor(public readonly duration: number = 0.5) {
    super();

    this._promise = new Promise((resolve) => {
      this._resolve = resolve;
    });

    this.sprite = new Graphics().rect(0, 0, 10000, 10000).fill(0x001800);
    this.sprite.alpha = 0;
    this.sprite.layerName = Layer.MENU;
  }

  async onAdd() {
    await this.wait(this.duration, (dt, t) => {
      this.sprite.alpha = smoothStep(1 - t);
    });
    this.destroy();
  }

  onDestroy(): void {
    this._resolve();
  }

  async done(): Promise<void> {
    return this._promise;
  }
}
