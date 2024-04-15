export enum Persistence {
  Default = 0, // cleared at the end of each level attemp
  Level = 1, // cleared at the end of each level
  Game = 2, // cleared at the end of each game
  Menu = 3, // cleared between menus
  Permanent = 4, // never cleared
}
