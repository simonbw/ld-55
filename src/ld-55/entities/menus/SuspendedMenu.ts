import { Container, Graphics, Text } from "pixi.js";
import Game from "../../../core/Game";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../../core/entity/Entity";
import { ControllerButton } from "../../../core/io/Gamepad";
import { KeyCode } from "../../../core/io/Keys";
import { fontName } from "../../../core/resources/resourceUtils";
import { clamp, lerp, smoothStep } from "../../../core/util/MathUtil";
import { Layer } from "../../config/layers";

const FADE_OUT_TIME = process.env.NODE_ENV === "development" ? 0.1 : 2.2;

export default class SuspendedMenu extends BaseEntity implements Entity {
  id: string = "suspendedMenu";
  pausable = false;
  sprite: GameSprite;

  suspendedText: Text;
  restartText: Text;
  inTransition: boolean = false;
  background: Graphics;

  constructor() {
    super();

    this.sprite = new Container();
    this.sprite.layerName = Layer.MENU;

    this.background = new Graphics().rect(0, 0, 10000, 10000).fill(0xff0000);
    this.sprite.addChild(this.background);

    this.suspendedText = new Text({
      text: "SUSPENDED",
      style: {
        align: "center",
        fill: "red",
        fontSize: 128,
        fontFamily: fontName("kgBrokenVesselsSketch"),
      },
    });
    this.suspendedText.anchor.set(0.5, 1.0);
    this.sprite.addChild(this.suspendedText);

    this.restartText = new Text({
      text: "Press Enter To Restart",
      style: {
        align: "center",
        fill: "white",
        fontSize: 64,
        fontFamily: fontName("rudiment"),
      },
    });
    this.restartText.anchor.set(0.5, 0.0);
    this.sprite.addChild(this.restartText);
    this.restartText.interactive = true;
    this.restartText.addListener("click", () => {
      this.restartGame();
    });
  }

  async onAdd(game: Game) {
    const slowMoController = game.entities.getById("slowMoController")!;
    game.removeEntity(slowMoController);

    await this.wait(3, (dt, t) => {
      game.slowMo = smoothStep(1 - t);
    });

    this.restartText.alpha = 0;
    this.restartText.alpha = 0;

    await this.wait(5, (dt, t) => {
      this.background.alpha = lerp(0, 0.3, t);
      // this.suspendedText.alpha = smoothStep(clamp(t * 1.5));
      this.suspendedText.alpha = clamp(lerp(0, 1, t / 5.0));
      // this.restartText.alpha = smoothStep(clamp(2.8 * t - 1.8));
      this.restartText.alpha = clamp(lerp(0, 1, t / 5.0) - 1.8);
    });
  }

  onResize([width, height]: [number, number]) {
    this.suspendedText.position.set(width / 2, height / 2);
    this.restartText.position.set(width / 2, height / 2);
  }

  onInputDeviceChange(usingGamepad: boolean) {
    this.restartText.text = usingGamepad
      ? "Press START to start"
      : "Press Enter to start";
  }

  async restartGame() {
    if (!this.inTransition) {
      this.inTransition = true;
      this.restartText.interactive = false;

      this.game?.dispatch({ type: "newGame" });

      this.destroy();
    }
  }

  onKeyDown(key: KeyCode) {
    if (key === "Enter") {
      this.restartGame();
    }
  }

  onButtonDown(button: ControllerButton) {
    if (button === ControllerButton.START) {
      this.restartGame();
    }
  }
}
