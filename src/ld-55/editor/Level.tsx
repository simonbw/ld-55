
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

export default class Level extends BaseEntity implements Entity {

  constructor(
    entities: Entity []
  ) {
    super();

    this.addChildren(...entities);
  }

}
