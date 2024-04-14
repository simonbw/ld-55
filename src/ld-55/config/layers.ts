import Game from "../../core/Game";
import { V } from "../../core/Vector";
import { LayerInfo } from "../../core/graphics/LayerInfo";

// Layers for rendering stuff in front of other stuff
export enum Layer {
  // The floor under the floor
  SUBFLOOR = "subfloor",
  // The floor
  FLOOR = "floor",
  // stuff right on the floor, like a rug
  DECORATIONS = "decorations",
  // Stuff sprayed on the floor like blood/goo/paint
  FLOOR_DECALS = "floor_decals",
  // stuff sitting on top of the floor, like glowsticks and casings
  FLOOR_STUFF = "floor_stuff",
  // Furniture sitting on the ground
  FURNITURE = "furniture",
  // Pickupable items sitting on the ground
  ITEMS = "items",
  // Stuff above the floor but below people and weapons and stuff
  PARTICLES = "particles",
  // Walls n stuff
  WALLS = "walls",
  // Stuff at the human's level
  WORLD = "world",
  // Stuff above the humans
  WORLD_FRONT = "world_front",
  // Most top level thing for HUD elements that are placed in world coordinates
  WORLD_OVERLAY = "world_overlay",
  // Stuff not in the world
  HUD = "hud",
  // Stuff above even the HUD
  MENU = "menu",
  // Stuff that's on top of everything for debugging purposes
  DEBUG_HUD = "debug_hud",
}

// Special layers that don't move with the camera
const PARALAX_FREE_LAYERS = [Layer.HUD, Layer.MENU, Layer.DEBUG_HUD];

// Set up the game to use our layers
export function initLayers(game: Game) {
  for (const layerName of Object.values(Layer)) {
    game.renderer.createLayer(layerName, new LayerInfo({}));
  }

  for (const layerName of PARALAX_FREE_LAYERS) {
    game.renderer.layerInfos.get(layerName)!.paralax = V(0, 0);
  }

  game.renderer.defaultLayer = Layer.WORLD;
}
