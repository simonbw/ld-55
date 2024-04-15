import Game from "../../core/Game.ts";
import { V } from "../../core/Vector";
import { Door } from "../entities/Door.ts";
import { ExitConstraints } from "../entities/ExitConstraints.ts";
import { ExitZone } from "../entities/ExitZone.ts";
import { Floor } from "../entities/Floor.ts";
import { Grass } from "../entities/Grass.ts";
import HelpText from "../entities/HelpText.ts";
import { Key } from "../entities/Key.ts";
import { Player } from "../entities/Player.ts";
import { Teacher } from "../entities/Teacher.ts";
import { Wall } from "../entities/Wall.ts";
import { makeRoom } from "./level-utilities.ts";

function addLevelEntities(game: Game, levelN: number) {
  // Left side classrooms
  makeRoom(game, 0, 0, 10, 12);
  makeRoom(game, 0, 12, 10, 12);
  makeRoom(game, 0, 24, 10, 12);

  // Right side classrooms
  makeRoom(game, 15, 0, 10, 12);
  makeRoom(game, 15, 12, 10, 12);
  makeRoom(game, 15, 24, 10, 8);
  makeRoom(game, 15, 32, 10, 8);

  game.addEntity(new Floor(V(10, 0), V(15, 36), "hallwayFloor"));

  game.addEntity(new Floor(V(10, 36), V(15, 40), "bathroomFloor"));

  game.addEntity(new Wall(V(0, 0), V(10, 0)));
  game.addEntity(new Wall(V(10, 0), V(15, 0)));
  game.addEntity(new Wall(V(15, 0), V(25, 0)));
  game.addEntity(new Wall(V(25, 0), V(25, 12)));
  game.addEntity(new Wall(V(25, 12), V(25, 24)));
  game.addEntity(new Wall(V(25, 24), V(25, 32)));
  game.addEntity(new Wall(V(25, 32), V(25, 40)));
  game.addEntity(new Wall(V(25, 40), V(15, 40)));
  // game.addEntity(new Wall(V(15, 40), V(10, 40)));

  // game.addEntity(new Door(V(10, 40), V(9, 39)));
  // game.addEntity(new Door(V(8, 38), V(9, 39)));

  // game.addEntity(new Wall(V(8, 38), V(8, 36)));
  game.addEntity(new Wall(V(8, 36), V(0, 36)));
  game.addEntity(new Wall(V(0, 36), V(0, 24)));
  game.addEntity(new Wall(V(0, 24), V(0, 12)));
  game.addEntity(new Wall(V(0, 12), V(0, 0)));

  game.addEntity(new Player(V(12.5, 2)));

  game.addEntity(new HelpText(V(12.5, 2), "Use WASD\nto move."));

  game.addEntity(new HelpText(V(12.5, 10), "Use E\nto interact."));

  game.addEntity(new HelpText(V(12.5, 18), "Use Shift\nto sprint."));

  game.addEntity(new Wall(V(0, 12), V(10, 12)));
  game.addEntity(new Wall(V(0, 24), V(10, 24)));
  game.addEntity(new Wall(V(15, 12), V(25, 12)));
  game.addEntity(new Wall(V(15, 24), V(25, 24)));
  game.addEntity(new Wall(V(15, 32), V(25, 32)));

  game.addEntity(new Wall(V(10, 0), V(10, 1)));
  game.addEntity(new Door(V(10, 1), V(10, 3)));
  game.addEntity(new Wall(V(10, 3), V(10, 12)));
  game.addEntity(new Wall(V(10, 12), V(10, 13)));
  game.addEntity(new Door(V(10, 13), V(10, 15)));
  game.addEntity(new Wall(V(10, 15), V(10, 24)));
  game.addEntity(new Wall(V(10, 24), V(10, 25)));
  game.addEntity(new Door(V(10, 25), V(10, 27)));
  game.addEntity(new Wall(V(10, 27), V(10, 36)));
  game.addEntity(new Wall(V(10, 36), V(8, 36)));

  game.addEntity(new Wall(V(15, 0), V(15, 1)));
  game.addEntity(new Door(V(15, 1), V(15, 3)));
  game.addEntity(new Wall(V(15, 3), V(15, 12)));
  game.addEntity(new Wall(V(15, 12), V(15, 13)));
  game.addEntity(new Door(V(15, 13), V(15, 15)));
  game.addEntity(new Wall(V(15, 15), V(15, 24)));
  game.addEntity(new Wall(V(15, 24), V(15, 25)));
  game.addEntity(new Door(V(15, 25), V(15, 27)));
  game.addEntity(new Wall(V(15, 27), V(15, 32)));
  game.addEntity(new Wall(V(15, 32), V(15, 33)));
  game.addEntity(new Door(V(15, 33), V(15, 35)));
  game.addEntity(new Wall(V(15, 35), V(15, 36)));
  game.addEntity(new Wall(V(15, 36), V(15, 40)));

  game.addEntity(new Wall(V(10, 36), V(11, 36)));
  game.addEntity(new Door(V(11, 36), V(12.5, 36)));
  game.addEntity(new Door(V(14, 36), V(12.5, 36)));
  game.addEntity(new Wall(V(14, 36), V(15, 36)));

  const hallwayPatroller1 = new Teacher(V(10.5, 25), 0);
  const hallwayPatroller2 = new Teacher(V(14.5, 25), Math.PI);
  game.addEntity(hallwayPatroller1);
  game.addEntity(hallwayPatroller2);
  game.addEntity(new Grass());
  game.addEntity(new Key(V(12.5, 11)));
  game.addEntity(
    new ExitZone(V(12.5, 38), new ExitConstraints(["key"], []), levelN)
  );
}

export default { addLevelEntities };
