// Assign things to groups so that we can easily enable/disable collisions between different groups
export const CollisionGroups = {
  None: 0,
  Walls: 0b1,
  Furniture: 0b10,
  Player: 0b100,
  Enemies: 0b1000,
  Students: 0b10000,
  All: 0b11111111111111111111111111111111,
};
