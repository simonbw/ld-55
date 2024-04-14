import { V2d } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

export type SerializedEntity = {[key:string]: any};

export abstract class SerializableEntity extends BaseEntity {
  static derived = new Map<string, Function>;
  
  constructor() {
    super();

    SerializableEntity.derived.set(this.constructor.name, this.constructor);
  }

  abstract serialize() : SerializedEntity;

  static deserialize(e: SerializedEntity): Entity {
    throw new Error("not implemented!");
  }

  static defaultSerializedEntity(p: V2d): SerializedEntity {
    throw new Error("not implemented!");
  }

  static typeNameToType(typeName: string): Function | undefined {
    return SerializableEntity.derived.get(typeName);
  }

  static listTypeNames(): string[] {
    return Array.from(SerializableEntity.derived.keys());
  }
};

export type LevelData = {
  version: number,
  entities: SerializedEntity[],
};
