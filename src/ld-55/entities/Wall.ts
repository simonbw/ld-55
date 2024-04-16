import p2, { Body } from "p2";
import { Graphics } from "pixi.js";
import { V, V2d } from "../../core/Vector";
import Entity from "../../core/entity/Entity";
import { CollisionGroups } from "../CollisionGroups";
import { Layer } from "../config/layers";
import { Persistence } from "../constants/constants";
import { SerializableEntity, SerializedEntity } from "../editor/serializeTypes";

export class Wall extends SerializableEntity implements Entity {
  constructor(
    private position1: V2d,
    private position2: V2d
  ) {
    super();

    const angle = position1.sub(position2).angle;
    const position = position1.add(position2).mul(0.5);
    this.body = new Body({
      type: Body.STATIC,
      position,
      angle,
    });

    const height = 0.2;
    const width = position1.sub(position2).magnitude + height;

    const shape = new p2.Box({ height, width });
    shape.collisionGroup = CollisionGroups.Walls;
    shape.collisionMask = CollisionGroups.All;
    this.body.addShape(shape);

    const graphics = new Graphics();
    graphics.rect(-width / 2, -height / 2, width, height).fill(0xbbbbbb);
    graphics.position.set(...position);
    graphics.rotation = angle;

    const shadowGraphics = new Graphics();
    shadowGraphics
      .rect(-width / 2, -height, width, height * 2)
      .fill({ color: 0x333333, alpha: 0.1 });
    shadowGraphics.position.set(...position);
    shadowGraphics.rotation = angle;

    this.sprites = [graphics, shadowGraphics];
    this.sprites[0].layerName = Layer.WALLS;
    this.sprites[1].layerName = Layer.FLOOR_DECALS;
  }

  static deserialize(e: SerializedEntity): Entity {
    return new Wall(V(e.position1), V(e.position2));
  }

  serialize(): SerializedEntity {
    return {
      position1: [...this.position1],
      position2: [...this.position2],
    };
  }

  static defaultSerializedEntity(p: V2d): SerializedEntity {
    return {
      position1: [...p],
      position2: [...p.add([1.4, 1.4])],
    };
  }
}
