import Game from "../../core/Game.ts";
import { LevelData, SerializableEntity } from "./serializeTypes.tsx";

const version = 1;

function serializeLevel(game: Game): LevelData {
  const serializedLevel : LevelData = {
    version,
    entities : [],
  };
  for (const e of game.entities) {
    let sE;
    if (e instanceof SerializableEntity) {
      sE = e.serialize();
    }

    if (sE) {
      serializedLevel.entities.push(
        {
          type: e.constructor.name,
          version: 1, // can be overriden by .serialize method
          ...sE
        });
    }
  }
  return serializedLevel;
}

function deserializeLevel(level: LevelData): Entity[] {
  const arr = [];
  for (const e of level.entities) {
    const t = SerializableEntity.typeNameToType(e.type);
    if (t) {
      arr.push((t as any).deserialize(e));
    }
  }
  return arr;
}

export {
  deserializeLevel, serializeLevel
};

