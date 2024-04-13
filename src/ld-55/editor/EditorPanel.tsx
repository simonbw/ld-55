import React from "react";
import Game from "../../core/Game";
import { ReactEntity } from "../../core/ReactEntity";
import { V } from "../../core/Vector";
import Entity from "../../core/entity/Entity";
import { EditAngleController } from "./EditAngleController";
import { EditPositionController } from "./EditPositionController";
import { serializeLevel } from "./serializeLevel";


export class EditorPanel extends ReactEntity<any> implements Entity {

  constructor(private myGame: Game) {
    super(() => <button onClick={() => this.onButtonClick(this.myGame) }>Save file</button>);

    const stuff = serializeLevel(myGame);
    for (const e of stuff.entities) {
      console.log(e);
      for (const [key, value] of Object.entries(e)) {
        switch (key) {
          case 'position':
          case 'position1':
          case 'position2':
          case 'hinge':
          case 'end':
            this.addChild(new EditPositionController(V(value as any)));
            break;
          case 'angle':
            this.addChild(new EditAngleController(e.position, value));
            break;
        }
      }
    }
  }

  async onButtonClick(myGame: Game) {
    const stuff = serializeLevel(myGame);
    var file = new Blob([JSON.stringify(stuff, null, 2)], {type: 'json'});
    if ((window as any).showSaveFilePicker) {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: 'level.json',
        types: [{accept: {'application/json': ['.json']}}]
      });
      const writable = await handle.createWritable();
      await writable.write( file );
      writable.close();
    }
  }
}