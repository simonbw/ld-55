import React from "react";
import Game from "../../core/Game";
import { ReactEntity } from "../../core/ReactEntity";
import Entity from "../../core/entity/Entity";
import { EditorController } from "./EditorController";
import { serializeLevel } from "./serializeLevel";
import { LevelData, SerializableEntity } from "./serializeTypes";


export class EditorPanel extends ReactEntity<any> implements Entity {

  controller : EditorController;

  constructor(myGame: Game, private levelData: LevelData) {
    super(() => <>
      <select value='Wall' onChange={(e) => this.onCreateEntityTypeChange(e)}>
        {SerializableEntity.listTypeNames().map((name: string) => <option value={name}>{name}</option>)}
      </select>
      {/* <button onClick={() => this.onSave(myGame) }>Add Entity</button> */}
      <button onClick={() => this.onSave(myGame) }>Save file</button>
    </>);
    this.controller = new EditorController(levelData)
    this.controller.onCreateEntityTypeChange('Wall');
    this.addChild(this.controller); 
  }

  onCreateEntityTypeChange(e: Event) {
    this.controller.onCreateEntityTypeChange(e.target!.value);
  }

  async onSave(myGame: Game) {
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