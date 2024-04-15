import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { lerp, smoothStep } from "../../core/util/MathUtil";

export class MusicController extends BaseEntity implements Entity {
  lowIntensity: SoundInstance;
  highIntensity: SoundInstance;

  constructor() {
    super();
    this.lowIntensity = this.addChild(
      new SoundInstance("musicLowIntensity", { continuous: true, gain: 0.5 })
    );
    this.highIntensity = this.addChild(
      new SoundInstance("musicHighIntensity", { continuous: true, gain: 0 })
    );
  }

  handlers = {
    teacherSpottedPlayer: () => {
      this.wait(0.25, (dt, t) => {
        this.lowIntensity.gain = smoothStep(lerp(0.5, 0, t));
        this.highIntensity.gain = smoothStep(t);
      });
    },
  };
}
