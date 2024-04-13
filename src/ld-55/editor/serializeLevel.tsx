import Game from "../../core/Game.ts";
import { SerializableEntity, SerializedEntity } from "./serializeTypes.tsx";

const version = 1;

type Level = {
  version: number,
  entities: SerializedEntity[],
};

function serializeLevel(game: Game): Level {
  const serializedLevel : Level = {
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

function deserializeLevel(game: Game, level: Level) {
  for (const e of level.entities) {
    const t = SerializableEntity.typeNameToType(e.type);
    if (t) {
      game.addEntity((t as any).deserialize(e));
    }
  }
}

export {
  deserializeLevel, serializeLevel
};

