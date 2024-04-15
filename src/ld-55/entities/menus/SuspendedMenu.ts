import { Container, Graphics, Text } from "pixi.js";
import Game from "../../../core/Game";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../../core/entity/Entity";
import { ControllerButton } from "../../../core/io/Gamepad";
import { KeyCode } from "../../../core/io/Keys";
import { fontName } from "../../../core/resources/resourceUtils";
import { clamp, lerp, smoothStep } from "../../../core/util/MathUtil";
import { Layer } from "../../config/layers";

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
    this.background.alpha = 0;
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
    const slowMoController = game.entities.getById("slowMoController");
    if (slowMoController) {
      game.removeEntity(slowMoController);
    }

    this.restartText.alpha = 0;
    this.restartText.alpha = 0;

    this.wait(1.0, (dt, t) => {
      this.background.alpha = lerp(0, 0.5, t);
      this.suspendedText.alpha = clamp(t * 5);
      this.restartText.alpha = t;
    });

    // Don't await this
    this.wait(3, (dt, t) => {
      game.slowMo = smoothStep(1 - t);
    });
  }

  onResize([width, height]: [number, number]) {
    this.suspendedText.position.set(width / 2, height / 2);
    this.restartText.position.set(width / 2, height / 2);
  }

  onInputDeviceChange(usingGamepad: boolean) {
    this.restartText.text = usingGamepad
      ? "Press START to restart"
      : "Press Enter to restart";
  }

  async restartGame() {
    if (!this.inTransition) {
      this.inTransition = true;
      this.restartText.interactive = false;
      this.game!.dispatch({ type: "restartLevel" });
      this.game!.slowMo = 1;
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
