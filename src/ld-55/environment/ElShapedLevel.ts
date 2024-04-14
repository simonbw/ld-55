import { ImageName } from "../../../resources/resources.ts";
import Game from "../../core/Game.ts";
import { V } from "../../core/Vector";
import { clamp, degToRad } from "../../core/util/MathUtil.ts";
import { Door } from "../entities/Door.ts";
import { ExitConstraints } from "../entities/ExitConstraints.ts";
import { ExitZone } from "../entities/ExitZone.ts";
import { Floor } from "../entities/Floor.ts";
import { Grass } from "../entities/Grass.ts";
import { Key } from "../entities/Key.ts";
import { PatrolController } from "../entities/PatrolController.ts";
import { Player } from "../entities/Player.ts";
import { Student } from "../entities/Student.ts";
import { Teacher } from "../entities/Teacher.ts";
import { Wall } from "../entities/Wall.ts";

function makeRoom(
  game: Game,
  x: number,
  y: number,
  width: number,
  height: number,
  carpetType: ImageName = "carpet1"
) {
  game.addEntity(new Floor(V(x, y), V(x + width, y + height), carpetType));
  game.addEntity(new Teacher(V(x + width / 2, y + 2), degToRad(90)));

  const rows = clamp(Math.floor((height - 4) / 2), 0, 3);
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < rows; j++) {
      game.addEntity(
        new Student(V(x + 1 + i * 2, y + 5 + j * 2), degToRad(-90))
      );
    }
  }
}

function addLevelEntities(game: Game, levelN: number) {
  // Left side classrooms
  makeRoom(game, 0, 0, 10, 12, "carpet2");
  makeRoom(game, 0, 12, 10, 12, "carpet1");
  makeRoom(game, 0, 24, 10, 12, "herringboneFloor");

  // Right side classrooms
  makeRoom(game, 15, 0, 10, 12, "carpet1");
  makeRoom(game, 15, 12, 10, 12, "herringboneFloor");
  makeRoom(game, 15, 24, 10, 8, "carpet2");
  makeRoom(game, 15, 32, 10, 8, "carpet1");

  
  makeRoom(game, 15, -10, 10, 10, "carpet2");
  makeRoom(game, 3, -15, 12, 10, "carpet1");
  makeRoom(game, -7, -15, 10, 10, "herringboneFloor");
  makeRoom(game, -17, -15, 10, 10, "carpet2");
  makeRoom(game, -27, -15, 10, 10, "bathroomFloor");
  makeRoom(game, -27, 0, 14, 12, "herringboneFloor");
  makeRoom(game, -13, 0, 13, 12, "carpet1");


  game.addEntity(new Floor(V(10, 0), V(15, 36), "hallwayFloor"));
  game.addEntity(new Floor(V(-27, -5), V(15, 0), "hallwayFloor"));

  game.addEntity(new Floor(V(10, 36), V(15, 40), "bathroomFloor"));

  game.addEntity(new Wall(V(0, 0), V(10, 0)));
  game.addEntity(new Wall(V(15, 0), V(25, 0)));
  game.addEntity(new Wall(V(25, 0), V(25, 12)));
  game.addEntity(new Wall(V(25, 12), V(25, 24)));
  game.addEntity(new Wall(V(25, 24), V(25, 32)));
  game.addEntity(new Wall(V(25, 32), V(25, 40)));
  game.addEntity(new Wall(V(25, 40), V(15, 40)));
  game.addEntity(new Wall(V(15, 40), V(10, 40)));

  game.addEntity(new Door(V(10, 40), V(9, 39)));
  game.addEntity(new Door(V(8, 38), V(9, 39)));

  game.addEntity(new Wall(V(8, 38), V(8, 36)));
  game.addEntity(new Wall(V(8, 36), V(0, 36)));
  game.addEntity(new Wall(V(0, 36), V(0, 24)));
  game.addEntity(new Wall(V(0, 24), V(0, 12)));
  game.addEntity(new Wall(V(0, 12), V(0, 0)));

  game.addEntity(new Player(V(2, -2.5)));

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

  const hallwayPatroller = new Teacher(V(14.2, 6), Math.PI / 2);
  game.addEntity(hallwayPatroller);
  game.addEntity(new PatrolController(
    hallwayPatroller,
    V(14.2, 30),
    V(14.2, 6),
  ));

  const hallwayPatroller2 = new Teacher(V(10.8, 20), Math.PI/2);
  game.addEntity(hallwayPatroller2);
  game.addEntity(new PatrolController(
    hallwayPatroller2,
    V(10.8, 30),
    V(10.8, 6),
  )); 

  const hallwayPatroller3 = new Student(V(12.5, 20), Math.PI / 2);
  game.addEntity(hallwayPatroller3);
  game.addEntity(new PatrolController(
    hallwayPatroller3,
    V(12.5, 30),
    V(12.5, 6),
  ));

  const hallwayPatroller4 = new Student(V(11.5, 13), Math.PI / 2);
  game.addEntity(hallwayPatroller4);
  game.addEntity(new PatrolController(
    hallwayPatroller4,
    V(11.5, 6),
    V(11.5, 30),
  ));

  const hallwayPatroller5 = new Student(V(13.5, 23), Math.PI / 2);
  game.addEntity(hallwayPatroller5);
  game.addEntity(new PatrolController(
    hallwayPatroller5,
    V(13.5, 30),
    V(13.5, 6),
  ));

  game.addEntity(new Grass());
  game.addEntity(new Key(V(12.5, 5)));
  game.addEntity(
    new ExitZone(V(12.5, 38), new ExitConstraints(["key"], []), levelN)
  );

  game.addEntity(new Wall(V(15, -5), V(15, -3)));
  game.addEntity(new Wall(V(15, -1), V(15, 0)));

  game.addEntity(new Wall(V(-27, -5), V(-24, -5)));
  game.addEntity(new Wall(V(-22, -5), V(-17, -5)));
  game.addEntity(new Wall(V(-17, -5), V(-13, -5)));
  game.addEntity(new Wall(V(-11, -5), V(-7, -5)));
  game.addEntity(new Wall(V(-7, -5), V(-4, -5)));
  game.addEntity(new Wall(V(-2, -5), V(3, -5)));
  game.addEntity(new Wall(V(3, -5), V(6, -5)));
  game.addEntity(new Wall(V(8, -5), V(15, -5)));
  
  game.addEntity(new Wall(V(0, 0), V(-6, 0)));
  game.addEntity(new Wall(V(-8, 0), V(-13, 0)));
  game.addEntity(new Wall(V(-13, 0), V(-20, 0)));
  game.addEntity(new Wall(V(-22, 0), V(-27, 0)));

  game.addEntity(new Wall(V(25, -10), V(25, 0)));
  game.addEntity(new Wall(V(15, -10), V(15, -5)));
  game.addEntity(new Wall(V(15, -10), V(25, -10)));
  game.addEntity(new Wall(V(15, -15), V(15, -10)));
  game.addEntity(new Wall(V(25, -15), V(25, -10)));
  game.addEntity(new Wall(V(15, -15), V(25, -15)));
  game.addEntity(new Wall(V(-13, -15), V(15, -15)));
  game.addEntity(new Wall(V(-27, 0), V(-27, -15)));
  game.addEntity(new Wall(V(-27, -15), V(-13, -15)));
  game.addEntity(new Wall(V(-27, 0), V(-27, 12)));
  game.addEntity(new Wall(V(-27, 12), V(0, 12)));
  game.addEntity(new Wall(V(-13, 0), V(-13, 12)));
  game.addEntity(new Wall(V(3, -15), V(3, -5)));
  game.addEntity(new Wall(V(-7, -15), V(-7, -5)));
  game.addEntity(new Wall(V(-17, -15), V(-17, -5)));

  game.addEntity(new Door(V(-13, -5), V(-11, -5)));
  game.addEntity(new Door(V(-4, -5), V(-2, -5)));
  game.addEntity(new Door(V(6, -5), V(8, -5)));
  game.addEntity(new Door(V(-8, 0), V(-6, 0)));
  game.addEntity(new Door(V(-24, -5), V(-22, -5)));
  game.addEntity(new Door(V(-22, 0), V(-20, 0)));
  game.addEntity(new Door(V(15, -3), V(15, -1)));
}

export default { addLevelEntities };
