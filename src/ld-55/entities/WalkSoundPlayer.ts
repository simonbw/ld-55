import { SoundName } from "../../../resources/resources";
import BaseEntity from "../../core/entity/BaseEntity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { choose, rUniform } from "../../core/util/Random";

export class WalkSoundPlayer extends BaseEntity {
  stepProgress: number = 0.5;

  advance(walkAmount: number, sprinting: boolean) {
    this.stepProgress += walkAmount;
    if (this.stepProgress > 1) {
      this.stepProgress -= 1;
      const name = sprinting ? choose(...runSounds) : choose(...walkSounds);
      this.addChild(
        new SoundInstance(name, {
          speed: rUniform(0.9, 1.1),
        })
      );
    }
  }

  stop() {
    this.stepProgress = 0.5;
  }
}
export const walkSounds: SoundName[] = [
  "footstepSoft1",
  "footstepSoft2",
  "footstepSoft3",
];
export const runSounds: SoundName[] = ["footstepLoud1", "footstepLoud2"];
