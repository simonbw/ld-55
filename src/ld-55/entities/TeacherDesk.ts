import { Body, Box } from "p2";
import { Sprite } from "pixi.js";
import { V2d } from "../../core/Vector";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { imageName } from "../../core/resources/resourceUtils";
import { SerializableEntity, SerializedEntity } from "../editor/serializeTypes";
import { CollisionGroups } from "../CollisionGroups";

export class TeacherDesk extends SerializableEntity implements Entity {
  sprite?: GameSprite & Sprite;

  constructor(position: V2d, angle: number = 0) {
    super();

    this.sprite = Sprite.from(imageName("classroomTeacherDesk"));
    this.sprite.position.set(...position);
    this.sprite.rotation = angle;
    this.sprite.anchor.set(0.5);

    const aspectRatio = this.sprite.height / this.sprite.width;

    const height = 0.8;
    const width = height / aspectRatio;
    this.sprite.setSize(width, height);

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

    // TODO: Add random books, apples, etc
  }

  static deserialize(e: SerializedEntity): Entity {
    throw new Error("Method not implemented.");
  }
  serialize(): SerializedEntity {
    throw new Error("Method not implemented.");
  }
}
