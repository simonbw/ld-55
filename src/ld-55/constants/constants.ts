export enum Persistence {
  Level = 0, // cleared at the end of each level
  Game = 1, // cleared at the end of each game
  Menu = 2, // cleared between menus
  Permanent = 3, // never cleared
}
