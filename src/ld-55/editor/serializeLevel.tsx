import Game from "../../core/Game.ts";
import { Enemy } from "../entities/Enemy.ts";
import { Player } from "../entities/Player.ts";
import { Wall } from "../entities/Wall.ts";
import { SerializedEntity } from "./serializeTypes.tsx";

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
        if (e instanceof Wall) {
            sE = (e as Wall).serialize();
        } else if (e instanceof Player) {
            sE = (e as Player).serialize();
        } else if (e instanceof Enemy) {
            sE = (e as Enemy).serialize();
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
        if (e.type == 'Wall') {
            game.addEntity(Wall.deserialize(e));
        } else if (e.type == 'Player') {
            game.addEntity(Player.deserialize(e));
        } else if (e.type == 'Enemy') {
            game.addEntity(Enemy.deserialize(e));
        }
    }
}

export {
    deserializeLevel, serializeLevel
};

