import { Sprite, Text } from "pixi.js";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../../core/entity/Entity";
import Game from "../../../core/Game";
import { ControllerButton } from "../../../core/io/Gamepad";
import { KeyCode } from "../../../core/io/Keys";
import { clamp, smoothStep } from "../../../core/util/MathUtil";
import { Layer } from "../../config/layers";

const FADE_OUT_TIME = process.env.NODE_ENV === "development" ? 0.1 : 2.2;

let firstTime = true;
export default class MainMenu extends BaseEntity implements Entity {
  pausable = false;
  sprite: Sprite & GameSprite;

  titleText: Text;
  startText: Text;
  inTransition: boolean = false;

  constructor() {
    super();

    this.sprite = new Sprite();
    this.sprite.layerName = Layer.MENU;

    this.titleText = new Text("Not HIGHRISE", {
      align: "center",
      fill: "red",
      fontSize: 128,
    });
    this.titleText.anchor.set(0.5, 1.0);
    this.sprite.addChild(this.titleText);

    this.startText = new Text("Press Enter To Start", {
      align: "center",
      fill: "white",
      fontSize: 64,
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

    await this.wait(firstTime ? 5 : 3.0, (dt, t) => {
      this.titleText.alpha = smoothStep(clamp(t * 1.5));
      this.startText.alpha = smoothStep(clamp(2.8 * t - 1.8));
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
      this.inTransition = true;
      this.startText.interactive = false;
      await this.wait(FADE_OUT_TIME, (dt, t) => {
        this.titleText.alpha = smoothStep(clamp(1.5 - 1.5 * t));
        this.startText.alpha = smoothStep(clamp(1.0 - 4 * t));
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