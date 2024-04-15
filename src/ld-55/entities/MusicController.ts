import Game from "../../core/Game";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { lerp } from "../../core/util/MathUtil";

export class MusicController extends BaseEntity implements Entity {
  lowIntensity!: SoundInstance;
  highIntensity!: SoundInstance;

  musicVolumeNode!: GainNode;
  muted = false;

  onAdd(game: Game): void {
    this.musicVolumeNode = game.audio.createGain();

    this.musicVolumeNode.gain.value = 0.5;
    this.musicVolumeNode.connect(game.masterGain);

    this.lowIntensity = this.addChild(
      new SoundInstance("musicLowIntensity", {
        continuous: true,
        outnode: () => this.musicVolumeNode,
      })
    );
    this.highIntensity = this.addChild(
      new SoundInstance("musicHighIntensity", {
        continuous: true,
        gain: 0,
        outnode: () => this.musicVolumeNode,
      })
    );
  }

  onKeyDown(key: KeyCode, event: KeyboardEvent): void {
    if (key === "KeyM") {
      this.muted = !this.muted;
      this.musicVolumeNode.gain.value = this.muted ? 0 : 0.5;
    }
  }

  handlers = {
    teacherSpottedPlayer: () => {
      this.wait(0.25, (dt, t) => {
        this.lowIntensity.gain = 1 - t;
        this.highIntensity.gain = t;
      });
    },

    levelPreComplete: () => {
      const startValue = this.musicVolumeNode.gain.value;
      this.wait(1, (dt, t) => {
        this.musicVolumeNode.gain.value = lerp(startValue, 0, t);
      });
    },
  };
}
