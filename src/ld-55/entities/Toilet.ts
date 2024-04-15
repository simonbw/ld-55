import { Body, Box } from "p2";
import { Sprite } from "pixi.js";
import { ImageName } from "../../../resources/resources";
import { V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { choose } from "../../core/util/Random";
import { CollisionGroups } from "../CollisionGroups";

const toilets : ImageName [] = [
  'bathroomUrinal',
  'bathroomToiletOpen',
  'bathroomToiletClose',
];

export class Toilet extends BaseEntity implements Entity {
  sprite?: GameSprite & Sprite;

  constructor(position: V2d, angle: number = 0) {
    super();

    const image = choose(...toilets)
    this.sprite = Sprite.from(image);
    this.sprite.position.set(...position);
    this.sprite.rotation = angle;
    this.sprite.anchor.set(0.5, 0);

    const aspectRatio = this.sprite.height / this.sprite.width;

    const width = 0.8;
    const height = width * aspectRatio;
    this.sprite.setSize(width, height);

    this.body = new Body({
      type: Body.STATIC,
      position,
      angle,
    });

    const shape = new Box({ width, height });
    shape.collisionGroup = CollisionGroups.Furniture;
    shape.collisionMask = CollisionGroups.All;
    this.body.addShape(shape);
  }
}
