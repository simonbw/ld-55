import { Container, Graphics, Text } from "pixi.js";
import Game from "../../../core/Game";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../../core/entity/Entity";
import { ControllerButton } from "../../../core/io/Gamepad";
import { KeyCode } from "../../../core/io/Keys";
import { fontName } from "../../../core/resources/resourceUtils";
import { clamp, smoothStep } from "../../../core/util/MathUtil";
import { Layer } from "../../config/layers";

const FADE_IN_TIME = process.env.NODE_ENV === "development" ? 1.5 : 1.5;
const FADE_OUT_TIME = process.env.NODE_ENV === "development" ? 1.0 : 1.0;

export default class ContinueScreen extends BaseEntity implements Entity {
  pausable = false;
  sprite: GameSprite;

  private _promise!: Promise<void>;
  private _resolve!: (value: void | PromiseLike<void>) => void;

  bigText: Text;
  smallText: Text;
  inTransition: boolean = false;
  background: Graphics;

  constructor(
    bigText: string,
    smallText: string,
    public onContinue?: () => void
  ) {
    super();

    this._promise = new Promise((resolve) => {
      this._resolve = resolve;
    });

    this.sprite = new Container();
    this.sprite.layerName = Layer.MENU;

    this.background = new Graphics().rect(0, 0, 10000, 10000).fill(0x001800);
    this.sprite.addChild(this.background);

    this.bigText = new Text({
      text: bigText,
      style: {
        align: "center",
        fill: "white",
        fontSize: 96,
        fontFamily: fontName("kgBrokenVesselsSketch"),
      },
    });
    this.bigText.anchor.set(0.5, 1.0);
    this.sprite.addChild(this.bigText);

    this.smallText = new Text({
      text: smallText,
      style: {
        align: "center",
        fill: "white",
        fontSize: 48,
        fontFamily: fontName("rudiment"),
      },
    });
    this.smallText.anchor.set(0.5, 0.0);
    this.sprite.addChild(this.smallText);
    this.smallText.interactive = true;
    this.smallText.addListener("click", () => {
      this.continue();
    });
  }

  async onAdd(game: Game) {
    this.bigText.alpha = 0;
    this.smallText.alpha = 0;

    await this.wait(FADE_IN_TIME, (dt, t) => {
      this.background.alpha = smoothStep(t * 2);
      this.bigText.alpha = smoothStep(t);
      this.smallText.alpha = smoothStep(1.5 * t - 0.5);
    });
  }

  onResize([width, height]: [number, number]) {
    this.bigText.position.set(width / 2, height / 2);
    this.smallText.position.set(width / 2, height / 2);
  }

  async continue() {
    if (!this.inTransition) {
      this.clearTimers(); // Cancel the fade in
      this.inTransition = true;
      this.smallText.interactive = false;
      await this.wait(FADE_OUT_TIME, (dt, t) => {
        this.bigText.alpha = smoothStep(1.5 - 1.5 * t);
        this.smallText.alpha = smoothStep(1.0 - 4 * t);
      });
      this._resolve();
      this.onContinue?.();
      this.destroy();
    }
  }

  async waitForContinue() {
    return this._promise;
  }

  onKeyDown(key: KeyCode) {
    if (key === "Enter") {
      this.continue();
    }
  }

  onButtonDown(button: ControllerButton) {
    if (button === ControllerButton.START) {
      this.continue();
    }
  }
}
