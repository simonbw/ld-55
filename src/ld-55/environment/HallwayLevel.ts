import Game from "../../core/Game.ts";
import { V } from "../../core/Vector";
import { Door } from "../entities/Door.ts";
import { Enemy } from "../entities/Enemy.ts";
import { Player } from "../entities/Player.ts";
import { Wall } from "../entities/Wall.ts";

function addLevelEntities(game: Game) {
  game.addEntity(new Wall(V(0, 0), V(25, 0)));
  game.addEntity(new Wall(V(25, 0), V(25, 40)));
  game.addEntity(new Wall(V(25, 40), V(10, 40)));

  game.addEntity(new Door(V(10, 40), V(9, 39)));
  game.addEntity(new Door(V(8, 38), V(9, 39)));

  game.addEntity(new Wall(V(8, 38), V(8, 36)));
  game.addEntity(new Wall(V(8, 36), V(0, 36)));
  game.addEntity(new Wall(V(0, 36), V(0, 0)));

  game.addEntity(new Player(V(12.5, 2)));

  game.addEntity(new Wall(V(0, 12), V(10, 12)));
  game.addEntity(new Wall(V(0, 24), V(10, 24)));
  game.addEntity(new Wall(V(15, 12), V(25, 12)));
  game.addEntity(new Wall(V(15, 24), V(25, 24)));
  game.addEntity(new Wall(V(15, 32), V(25, 32)));

  game.addEntity(new Wall(V(10, 0), V(10, 1)));
  game.addEntity(new Door(V(10, 1), V(10, 3)));
  game.addEntity(new Wall(V(10, 3), V(10, 13)));
  game.addEntity(new Door(V(10, 13), V(10, 15)));
  game.addEntity(new Wall(V(10, 15), V(10, 25)));
  game.addEntity(new Door(V(10, 25), V(10, 27)));
  game.addEntity(new Wall(V(10, 27), V(10, 36)));
  game.addEntity(new Wall(V(10, 36), V(8, 36)));

  game.addEntity(new Wall(V(15, 0), V(15, 1)));
  game.addEntity(new Door(V(15, 1), V(15, 3)));
  game.addEntity(new Wall(V(15, 3), V(15, 13)));
  game.addEntity(new Door(V(15, 13), V(15, 15)));
  game.addEntity(new Wall(V(15, 15), V(15, 25)));
  game.addEntity(new Door(V(15, 25), V(15, 27)));
  game.addEntity(new Wall(V(15, 27), V(15, 33)));
  game.addEntity(new Door(V(15, 33), V(15, 35)));
  game.addEntity(new Wall(V(15, 35), V(15, 40)));

  game.addEntity(new Wall(V(10, 36), V(11, 36)));
  game.addEntity(new Door(V(11, 36), V(12.5, 36)));
  game.addEntity(new Door(V(12.5, 36), V(14, 36)));
  game.addEntity(new Wall(V(14, 36), V(15, 36)));

  game.addEntity(new Enemy(V(5, 5), 0));
}

export default { addLevelEntities };
