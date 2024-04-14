import { Sprite, Text } from "pixi.js";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../../core/entity/Entity";
import Game from "../../../core/Game";
import { ControllerButton } from "../../../core/io/Gamepad";
import { KeyCode } from "../../../core/io/Keys";
import { clamp, lerp, smoothStep } from "../../../core/util/MathUtil";
import { Layer } from "../../config/layers";
import SlowMoController from "../SlowMoController";

const FADE_OUT_TIME = process.env.NODE_ENV === "development" ? 0.1 : 2.2;

export default class SuspendedMenu extends BaseEntity implements Entity {
  id: string = "suspendedMenu";
  pausable = false;
  sprite: Sprite & GameSprite;

  suspendedText: Text;
  restartText: Text;
  inTransition: boolean = false;

  constructor() {
    super();

    this.sprite = new Sprite();
    this.sprite.layerName = Layer.MENU;

    this.suspendedText = new Text("SUSPENDED", {
      align: "center",
      fill: "red",
      fontSize: 128,
    });
    this.suspendedText.anchor.set(0.5, 1.0);
    this.sprite.addChild(this.suspendedText);

    this.restartText = new Text("Press Enter To Restart", {
      align: "center",
      fill: "white",
      fontSize: 64,
    });
    this.restartText.anchor.set(0.5, 0.0);
    this.sprite.addChild(this.restartText);
    this.restartText.interactive = true;
    this.restartText.addListener("click", () => {
      this.restartGame();
    });
  }

  async onAdd(game: Game) {
    const slowMoController = game.entities.getById("slowMoController") as SlowMoController;
    game.removeEntity(slowMoController);
    
    await this.wait(3, (dt, t) => {
      game.slowMo = smoothStep(clamp(1 - t))
    })

    this.restartText.alpha = 0;
    this.restartText.alpha = 0;

    await this.wait(5, (dt, t) => {
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
