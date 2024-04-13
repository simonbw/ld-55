import Game from "../../core/Game.ts";
import { Door } from "../entities/Door.ts";
import { Enemy } from "../entities/Enemy.ts";
import { Player } from "../entities/Player.ts";
import { Wall } from "../entities/Wall.ts";
import { SerializableEntity, SerializedEntity } from "./serializeTypes.tsx";

const typeNameToType: {[key:string]: any} = {
  'Wall': Wall,
  'Player': Player,
  'Enemy': Enemy,
  'Door': Door,
};

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
    if (e.constructor.name == 'Enemy') {
      console.log(e.constructor.name);
      console.log(e instanceof SerializableEntity);
      console.log(e);
    }
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
    // console.log(e.type);
    if (e.type in typeNameToType) {
      game.addEntity(typeNameToType[e.type].deserialize(e));
    }
  }
}

export {
  deserializeLevel, serializeLevel
};

