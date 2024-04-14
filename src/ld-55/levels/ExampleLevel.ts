import Game from "../../core/Game.ts";
import { V } from "../../core/Vector";
import { Door } from "../entities/Door.ts";
import { Teacher } from "../entities/Teacher.ts";
import { Player } from "../entities/Player.ts";
import { Wall } from "../entities/Wall.ts";

function addLevelEntities(game: Game) {
  game.addEntity(new Player(V(2, 2)));

  game.addEntity(new Wall(V(-1, 0), V(-1, 10)));
  game.addEntity(new Wall(V(5, 0), V(5, 10)));

  game.addEntity(new Wall(V(-5, 0), V(0, 0)));
  game.addEntity(new Wall(V(4, 0), V(9, 0)));

  game.addEntity(new Door(V(0, 0), V(4, 0)));

  game.addEntity(new Teacher(V(10, 5), Math.PI));
}

export default { addLevelEntities };
