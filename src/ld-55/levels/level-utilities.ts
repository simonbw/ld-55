import { ImageName } from "../../../resources/resources";
import Game from "../../core/Game";
import { V } from "../../core/Vector";
import { clamp, degToRad } from "../../core/util/MathUtil";
import { choose } from "../../core/util/Random";
import { Floor } from "../entities/Floor";
import { Sink } from "../entities/Sink";
import { Student } from "../entities/Student";
import { StudentDesk } from "../entities/StudentDesk";
import { Teacher } from "../entities/Teacher";
import { TeacherDesk } from "../entities/TeacherDesk";
import { Toilet } from "../entities/Toilet";

const classroomFloors: ImageName[] = [
  "floorCarpet1",
  "floorCarpet2",
  "floorCarpet3",
  "floorCarpet4",
  "carpetFloor5",
  "carpetFloor6",
  "carpetFloor7",
  "herringboneFloor",
  "herringboneFloor",
  "herringboneFloor",
];

const bathroomFloors: ImageName[] = [
  "bathroomFloor",
  "bathroomTilefloorPink",
  "bathroomTilefloorBlue",
];

export function makeRoom(
  game: Game,
  x: number,
  y: number,
  width: number,
  height: number,
  floorType: ImageName = choose(...classroomFloors)
) {
  game.addEntity(new Floor(V(x, y), V(x + width, y + height), floorType));
  game.addEntity(new Teacher(V(x + width / 2, y + 1), degToRad(90)));
  game.addEntity(new TeacherDesk(V(x + width / 2, y + 2)));

  const rows = clamp(Math.floor((height - 4) / 2), 0, 3);
  const cols = Math.floor((width) / 2);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      game.addEntity(
        new Student(V(x + 1 + i * 2, y + 5 + j * 2), degToRad(-90))
      );
      game.addEntity(new StudentDesk(V(x + 1 + i * 2, y + 4.2 + j * 2)));
    }
  }
}

export function makeBathRoom(
  game: Game,
  x: number,
  y: number,
  width: number,
  height: number,
  floorType: ImageName = choose(...bathroomFloors)
) {
  game.addEntity(new Floor(V(x, y), V(x + width, y + height), floorType));

  const rows = Math.floor((height - 4) / 1);
  const cols = Math.floor((width) / 1.2);
  for (let i = 0; i < cols; i++) {
    game.addEntity(new Toilet(V(x + 1 + i * 1.2, y + 0.1)));
  }
  for (let j = 0; j < rows; j++) {
    game.addEntity(new Sink(V(x + 0.5, y + 4.2 + j * 1), 3 * Math.PI / 2));
  }
}

export function makeGym(
  game: Game,
  x: number,
  y: number,
  width: number,
  height: number,
  floorType: ImageName = choose(...bathroomFloors)
) {
  game.addEntity(new Floor(V(x, y), V(x + width, y + height), floorType));

  const rows = Math.floor((height - 4) / 1);
  const cols = Math.floor((width) / 1.2);
  for (let i = 0; i < cols; i++) {
    game.addEntity(new Toilet(V(x + 1 + i * 1.2, y + 0.1)));
  }
  for (let j = 0; j < rows; j++) {
    game.addEntity(new Sink(V(x + 0.5, y + 4.2 + j * 1), 3 * Math.PI / 2));
  }
}
