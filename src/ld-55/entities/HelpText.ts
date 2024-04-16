import { Container, Graphics, Sprite, Text } from "pixi.js";
import Game from "../../core/Game";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { ControllerButton } from "../../core/io/Gamepad";
import { KeyCode } from "../../core/io/Keys";
import { fontName } from "../../core/resources/resourceUtils";
import { clamp, smoothStep } from "../../core/util/MathUtil";
import { Layer } from "../config/layers";
import { V2d } from "../../core/Vector";
import { Persistence } from "../constants/constants";
import { Body } from "p2";

export default class HelpText extends BaseEntity implements Entity {
  sprite: GameSprite;

  helpText: Text;

  constructor(
    public position: V2d,
    public text: string
  ) {
    super();

    this.body = new Body({
      type: Body.STATIC,
      position,
      fixedRotation: true,
    });

    this.sprite = new Sprite();
    this.sprite.layerName = Layer.ITEMS;

    this.helpText = new Text({
      text: text,
      style: {
        align: "center",
        fill: "red",
        fontSize: 32,
        fontFamily: fontName("kgBrokenVesselsSketch"),
      },
    });
    this.helpText.anchor.set(0.5, 0.5);
    this.sprite.addChild(this.helpText);
    this.sprite.alpha = 0.8;

    this.sprite.setSize(1 / 64);
    this.sprite.position.set(...position);
  }
}
