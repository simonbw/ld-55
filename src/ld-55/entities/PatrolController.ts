import { V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Persistence } from "../constants/constants";
import { Teacher } from "./Teacher";

export class PatrolController extends BaseEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Game;
  currentTarget: number;
  positions: V2d[];

  constructor(
    private teacher: Teacher,
    ...positions: V2d[]
  ) {
    super();

    this.positions = positions;
    this.currentTarget = 0;
    this.teacher.setTargetLocation(positions[this.currentTarget]);
  }

  onTick(dt: number): void {
    if (this.teacher.isTargettingPlayer()) {
      return;
    }

    if (this.teacher.isAtTargetLocation()) {
      this.currentTarget = (this.currentTarget + 1) % this.positions.length;
      this.teacher.setTargetLocation(this.positions[this.currentTarget]);
    }
  }

}
