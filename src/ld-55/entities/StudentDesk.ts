import { Body, Box } from "p2";
import { Container, Sprite } from "pixi.js";
import { ImageName } from "../../../resources/resources";
import { V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { imageName } from "../../core/resources/resourceUtils";
import { choose, rBool } from "../../core/util/Random";
import { CollisionGroups } from "../CollisionGroups";

const decorationImages: ImageName[] = [
  "classroomBookBlue",
  "classroomBookGreen",
  "classroomBookRed",
  "classroomBookOrange",
  "classroomOpenBookWithPen",
  "classroomPaper",
];

export class StudentDesk extends BaseEntity implements Entity {
  sprite?: GameSprite;

  constructor(position: V2d, angle: number = 0) {
    super();

    this.sprite = new Container();
    this.sprite.position.set(...position);
    this.sprite.rotation = angle;

    const deskSprite = Sprite.from(imageName("classroomDesk"));
    deskSprite.anchor.set(0.5);
    this.sprite.addChild(deskSprite);

    if (rBool(0.7)) {
      const decoration = Sprite.from(choose(...decorationImages));
      decoration.anchor.set(0.5);
      decoration.position.set(choose(-10, 0, 10), 0);
      decoration.angle = choose(-10, 0, 0, 10);
      this.sprite.addChild(decoration);
    }

    const aspectRatio = deskSprite.height / deskSprite.width;
    const height = 0.8;
    const width = height / aspectRatio;

    this.sprite.scale.set(width / deskSprite.width, height / deskSprite.height);

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
