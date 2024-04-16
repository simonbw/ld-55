export enum Persistence {
  /** DEFAULT, cleared at the end of each level */
  Level = 0,
  /** Cleared at the end of each game */
  Game = 1,
  /** Cleared between menus */
  Menu = 2,
  /** Never cleared */
  Permanent = 3,
}
