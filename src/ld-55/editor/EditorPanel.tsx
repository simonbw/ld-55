import React from "react";
import Game from "../../core/Game";
import { ReactEntity } from "../../core/ReactEntity";
import Entity from "../../core/entity/Entity";
import { serializeLevel } from "./serializeLevel";
import { LevelData } from "./serializeTypes";


export class EditorPanel extends ReactEntity<any> implements Entity {

  constructor(private myGame: Game, private levelData: LevelData) {
    super(() => <button onClick={() => this.onButtonClick(this.myGame) }>Save file</button>);
    
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