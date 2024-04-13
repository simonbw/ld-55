import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

export type SerializedEntity = {[key:string]: any};

export abstract class SerializableEntity extends BaseEntity {
  abstract serialize() : SerializedEntity;

  static deserialize(e: SerializedEntity): Entity {
    throw new Error("not implemented!");
  }
};
