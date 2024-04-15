import { ImageName } from "../../../resources/resources";
import Game from "../../core/Game";
import { V } from "../../core/Vector";
import { clamp, degToRad } from "../../core/util/MathUtil";
import { choose } from "../../core/util/Random";
import { Floor } from "../entities/Floor";
import { Student } from "../entities/Student";
import { StudentDesk } from "../entities/StudentDesk";
import { Teacher } from "../entities/Teacher";
import { TeacherDesk } from "../entities/TeacherDesk";

const classroomFloors: ImageName[] = [
  "floorCarpet1",
  "floorCarpet2",
  "floorCarpet3",
  "floorCarpet4",
  "herringboneFloor",
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
