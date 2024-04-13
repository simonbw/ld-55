// This file autogenerated by generate-asset-types.js
// Do not modify it by hand. Any changes will be overwritten.
const sounds = {
    vocalModeStep2: require("./audio/vocal-mode-step-2.flac"),
  vocalModeStep1: require("./audio/vocal-mode-step-1.flac"),
  snap: require("./audio/snap.flac"),
  rawSoftFootsteps: require("./audio/raw_soft-footsteps.flac"),
  rawFootstepsToeHeel: require("./audio/raw_footsteps-toe-heel.flac"),
  rawFootsteps2: require("./audio/raw_footsteps-2.flac"),
  paAnnouncement3: require("./audio/pa-announcement-3.flac"),
  paAnnouncement2: require("./audio/pa-announcement-2.flac"),
  paAnnouncement1: require("./audio/pa-announcement-1.flac"),
  footstepSoft3: require("./audio/footstep-soft-3.flac"),
  footstepSoft2: require("./audio/footstep-soft-2.flac"),
  footstepSoft1: require("./audio/footstep-soft-1.flac"),
  footstepSlide: require("./audio/footstep-slide.flac"),
  footstepLoud2: require("./audio/footstep-loud-2.flac"),
  footstepLoud1: require("./audio/footstep-loud-1.flac")
};
export type SoundName = keyof typeof sounds;

const images = {
    player: require("./images/player.png"),
  hallwayFloor: require("./images/hallway-floor.png"),
  favicon: require("./images/favicon.png"),
  enemy: require("./images/enemy.png"),
  player8: require("./images/player/player8.png"),
  player7: require("./images/player/player7.png"),
  player6: require("./images/player/player6.png"),
  player5: require("./images/player/player5.png"),
  player4: require("./images/player/player4.png"),
  player3: require("./images/player/player3.png"),
  player2: require("./images/player/player2.png"),
  player1: require("./images/player/player1.png"),
  teacherGym8: require("./images/enemies/teacher-gym8.png"),
  teacherGym7: require("./images/enemies/teacher-gym7.png"),
  teacherGym6: require("./images/enemies/teacher-gym6.png"),
  teacherGym5: require("./images/enemies/teacher-gym5.png"),
  teacherGym4: require("./images/enemies/teacher-gym4.png"),
  teacherGym3: require("./images/enemies/teacher-gym3.png"),
  teacherGym2: require("./images/enemies/teacher-gym2.png"),
  teacherGym1: require("./images/enemies/teacher-gym1.png")
};
export type ImageName = keyof typeof images;

const fonts = {
    rubikIsoRegular: require("./fonts/RubikIso-Regular.ttf")
};
export type FontName = keyof typeof fonts;

const levels = {
    hallway: require("./levels/hallway.json")
};
export type LevelName = keyof typeof levels;

export const RESOURCES = { sounds, images, fonts };
