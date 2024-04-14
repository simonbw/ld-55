import p2, { Body } from "p2";
import { Graphics } from "pixi.js";
import { V, V2d } from "../../core/Vector";
import Entity from "../../core/entity/Entity";
import BaseEntity from "../../core/entity/BaseEntity";
import { Player } from "./Player";
import Game from "../../core/Game";
import { ExitConstraints } from "./ExitConstraints";
import PlayerProgressController from "./PlayerProgressController";
import { Persistence } from "../constants/constants";

export class ExitZone extends BaseEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Game;
  player: Player | undefined;
  playerProgress: PlayerProgressController | undefined;

  constructor(
    private position: V2d,
    private exitConstraints: ExitConstraints,
    private level: number
  ) {
    super();

    this.body = new Body({
      type: Body.STATIC,
      position,
      fixedRotation: true,
    });

    const shape = new p2.Box({
      height: 2,
      width: 2,
    });
    this.body.addShape(shape);

    const graphics = new Graphics();
    graphics
      .rect(-shape.width / 2, -shape.height / 2, shape.width, shape.height)
      .fill(0x00ff00);

    this.sprite = graphics;
    this.sprite.position.set(...position);
  }

  onAdd(game: Game): void {
    this.player = game.entities.getTagged("player")[0] as Player;
    this.playerProgress = game.entities.getTagged(
      "playerProgressController"
    )[0] as PlayerProgressController;
  }

  onRender(dt: number): void {
    if (
      this.player &&
      V(this.player.body.position).sub(V(this.body!.position)).magnitude < 0.5
    ) {
      if (
        this.exitConstraints.checkExitConstraints(this.playerProgress!) === true
      ) {
        this.game!.dispatch({ type: "finishLevel", level: this.level });
        this.destroy();
      } else {
        console.log("You can't leave yet!");
      }
    }
  }
}
