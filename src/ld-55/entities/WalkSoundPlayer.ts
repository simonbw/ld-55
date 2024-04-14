import { SoundName } from "../../../resources/resources";
import { V } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import { PositionalSound } from "../../core/sound/PositionalSound";
import { choose, rUniform } from "../../core/util/Random";

export class WalkSoundPlayer extends BaseEntity {
  stepProgress: number = 0.5;

  constructor(private emittingBody: p2.Body) {
    super();
  }

  advance(walkAmount: number, sprinting: boolean) {
    this.stepProgress += walkAmount;
    if (this.stepProgress > 1) {
      this.stepProgress -= 1;
      const name = sprinting ? choose(...runSounds) : choose(...walkSounds);
      this.addChild(
        new PositionalSound(name, V(this.emittingBody.position), {
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
