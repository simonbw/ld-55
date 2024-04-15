import { Container, Graphics, Text } from "pixi.js";
import Game from "../../../core/Game";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../../core/entity/Entity";
import { ControllerButton } from "../../../core/io/Gamepad";
import { KeyCode } from "../../../core/io/Keys";
import { fontName } from "../../../core/resources/resourceUtils";
import { clamp, smoothStep } from "../../../core/util/MathUtil";
import { Layer } from "../../config/layers";

const FADE_IN_TIME = process.env.NODE_ENV === "development" ? 2.0 : 2.0;
const FADE_OUT_TIME = process.env.NODE_ENV === "development" ? 1.0 : 1.0;

let firstTime = true;
export default class MainMenu extends BaseEntity implements Entity {
  pausable = false;
  sprite: GameSprite;

  titleText: Text;
  startText: Text;
  inTransition: boolean = false;
  background: Graphics;

  constructor() {
    super();

    this.sprite = new Container();
    this.sprite.layerName = Layer.MENU;

    this.background = new Graphics().rect(0, 0, 10000, 10000).fill(0x001800);
    this.sprite.addChild(this.background);

    this.titleText = new Text({
      text: "Detention\nPrevention",
      style: {
        align: "center",
        fill: "white",
        fontSize: 128,
        fontFamily: fontName("kgBrokenVesselsSketch"),
      },
    });
    this.titleText.anchor.set(0.5, 1.0);
    this.sprite.addChild(this.titleText);

    this.startText = new Text({
      text: "Press Enter To Start",
      style: {
        align: "center",
        fill: "white",
        fontSize: 64,
        fontFamily: fontName("rudiment"),
      },
    });
    this.startText.anchor.set(0.5, 0.0);
    this.sprite.addChild(this.startText);
    this.startText.interactive = true;
    this.startText.addListener("click", () => {
      this.startGame();
    });
  }

  async onAdd(game: Game) {
    this.titleText.alpha = 0;
    this.startText.alpha = 0;

    await this.wait(firstTime ? FADE_IN_TIME + 1 : FADE_IN_TIME, (dt, t) => {
      this.background.alpha = smoothStep(t * 2.5);
      this.titleText.alpha = smoothStep(t * 1.5);
      this.startText.alpha = smoothStep(1.5 * t - 0.5);
    });
    firstTime = false;
  }

  onResize([width, height]: [number, number]) {
    this.titleText.position.set(width / 2, height / 2);
    this.startText.position.set(width / 2, height / 2);
  }

  onInputDeviceChange(usingGamepad: boolean) {
    this.startText.text = usingGamepad
      ? "Press START to start"
      : "Press Enter to start";
  }

  async startGame() {
    if (!this.inTransition) {
      this.clearTimers(); // Cancel the fade in
      this.inTransition = true;
      this.startText.interactive = false;
      await this.wait(FADE_OUT_TIME, (dt, t) => {
        this.titleText.alpha = smoothStep(1 - t);
        this.startText.alpha = smoothStep(1 - t);
      });
      this.game?.dispatch({ type: "newGame" });
      this.destroy();
    }
  }

  onKeyDown(key: KeyCode) {
    if (key === "Enter") {
      this.startGame();
    }
  }

  onButtonDown(button: ControllerButton) {
    if (button === ControllerButton.START) {
      this.startGame();
    }
  }
}
