import p2, { Body } from "p2";
import { Graphics } from "pixi.js";
import Game from "../../core/Game";
import { V, V2d } from "../../core/Vector";
import Entity from "../../core/entity/Entity";
import DampedRotationalSpring from "../../core/physics/DampedRotationalSpring";
import { PositionalSound } from "../../core/sound/PositionalSound";
import { degToRad, normalizeAngle } from "../../core/util/MathUtil";
import { rUniform } from "../../core/util/Random";
import { CollisionGroups } from "../CollisionGroups";
import { Layer } from "../config/layers";
import { Persistence } from "../constants/constants";
import { SerializableEntity, SerializedEntity } from "../editor/serializeTypes";
import { getLevelController } from "./LevelController";

export class Door extends SerializableEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Game;
  body: Body;

  restAngle: number;
  lastDistanceFromClosed: number = 0;

  constructor(
    public hinge: V2d,
    public end: V2d,
    public requirement?: string
  ) {
    super();

    this.restAngle = normalizeAngle(end.sub(hinge).angle);

    this.body = new Body({
      mass: 0.2,
      position: hinge.clone(),
      angle: this.restAngle,
      type: p2.Body.DYNAMIC,
    });
    this.body.angle = this.restAngle;

    const width = hinge.sub(end).magnitude;
    const height = 0.2;

    const shape = new p2.Box({ height, width });
    shape.collisionGroup = CollisionGroups.Walls;
    shape.collisionMask = CollisionGroups.All ^ CollisionGroups.Walls; // Don't run into other walls
    this.body.addShape(shape, [width / 2, 0]);

    const graphics = new Graphics();
    // door handle stuff
    const handleX = width - 0.4;
    const handleLength = 0.4;
    const handleThickness = 0.07;
    const stemLengthStickout = 0.1;
    const stemThickness = 0.15;

    graphics
      .rect(0, -height / 2, width, height)
      .fill(0x775533)
      // door handle
      // stem
      .rect(
        handleX,
        -height / 2 - stemLengthStickout,
        stemThickness,
        stemLengthStickout
      )
      // handle
      .rect(
        handleX - (handleLength - stemThickness),
        -height / 2 - stemLengthStickout - handleThickness,
        handleLength,
        handleThickness
      )
      .fill(0x999999)
      .rect(handleX, height / 2, stemThickness, stemLengthStickout)
      .rect(
        handleX - (handleLength - stemThickness),
        height / 2 + stemLengthStickout,
        handleLength,
        handleThickness
      )
      .fill(0x999999);

    const shadowGraphics = new Graphics();
    shadowGraphics
      .rect(0, -height, width, height * 2)
      .fill({ color: 0x333333, alpha: 0.1 });

    this.sprites = [graphics, shadowGraphics];
    this.sprites[0].layerName = Layer.WALLS;
    this.sprites[1].layerName = Layer.FLOOR_DECALS;
  }

  onAdd(game: Game): void {
    this.constraints = [
      new p2.RevoluteConstraint(this.body, game.ground, {
        worldPivot: this.hinge.clone(),
      }),
    ];

    this.springs = [
      new DampedRotationalSpring(game.ground, this.body, {
        worldAnchorA: this.body.position,
        worldAnchorB: this.body.position,
        restAngle: this.restAngle,
        damping: 400,
        stiffness: 1000,
        maxTorque: 10,
      }),

      new DampedRotationalSpring(game.ground, this.body, {
        worldAnchorA: this.body.position,
        worldAnchorB: this.body.position,
        restAngle: this.restAngle,
        damping: 10,
        stiffness: 2000,
        maxTorque: 10,
      }),
    ];
  }

  isLocked() {
    if (!this.requirement) return false;
    const levelController = getLevelController(this.game!);
    return !levelController?.hasRequirement(this.requirement);
  }

  onTick(dt: number): void {
    if (this.isLocked()) {
      this.body.angle = this.restAngle;
      this.body.angularVelocity = 0;
      this.body.type = p2.Body.STATIC;
      this.body.mass = Infinity;
      return;
    }

    this.body.type = p2.Body.DYNAMIC;
    this.body.mass = 0.2;

    const distanceFromClosed = Math.abs(this.body.angle - this.restAngle);

    const threshold = degToRad(1);
    if (
      distanceFromClosed < threshold &&
      this.lastDistanceFromClosed > threshold
    ) {
      this.addChild(
        new PositionalSound("doorShut1", this.end, {
          speed: rUniform(0.99, 1.1),
        })
      );
    }

    if (
      distanceFromClosed > threshold &&
      this.lastDistanceFromClosed < threshold
    ) {
      this.addChild(
        new PositionalSound("doorOpen1", this.end, {
          speed: rUniform(0.99, 1.1),
        })
      );
    }

    this.lastDistanceFromClosed = distanceFromClosed;
  }

  /** Called every frame, right before rendering */
  onRender(): void {
    for (const sprite of this.sprites!) {
      sprite.position.set(...this.body.position);
      sprite.rotation = this.body.angle;
    }
  }

  static deserialize(e: SerializedEntity): Entity {
    return new Door(V(e.hinge), V(e.end));
  }

  static defaultSerializedEntity(p: V2d): SerializedEntity {
    return {
      hinge: [...p],
      end: [...p.add([1.4, 1.4])],
    };
  }

  serialize(): SerializedEntity {
    return {
      hinge: [...this.hinge],
      end: [...this.end],
    };
  }
}
