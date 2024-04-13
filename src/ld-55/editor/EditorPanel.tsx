import React from "react";
import Game from "../../core/Game";
import { ReactEntity } from "../../core/ReactEntity";
import { V } from "../../core/Vector";
import Entity from "../../core/entity/Entity";
import { EditPositionController } from "./EditPositionController";
import Level from "./Level";
import RootController from "./RootController";
import { deserializeLevel, serializeLevel } from "./serializeLevel";
import { LevelData } from "./serializeTypes";

const MAXIMUM_SELECTABLE_DISTANCE = 0.5;

export class EditorPanel extends ReactEntity<any> implements Entity {

  selectedEntityIndices: number[];

  constructor(private myGame: Game, private levelData: LevelData) {
    super(() => <button onClick={() => this.onButtonClick(this.myGame) }>Save file</button>);

    this.selectedEntityIndices = [];

    this.refreshEntities();
  }

  refreshEntities() {
    while (this.children.length) {
      this.children[0].destroy();
    }
  
    const controllers = [];
    for (let entityInd = 0; entityInd < this.levelData.entities.length; entityInd++) {
      const e = this.levelData.entities[entityInd];
      for (const [key, value] of Object.entries(e)) {
        switch (key) {
          case 'position':
          case 'position1':
          case 'position2':
          case 'hinge':
          case 'end':
            controllers.push(new EditPositionController(V(value as any), entityInd, key));
            break;
          // case 'angle':
          //   this.addChild(new EditAngleController(e.position, value));
          //   break;
        }
      }
    }

    this.addChild(new Level(deserializeLevel(this.levelData)));
    this.addChild(new RootController(controllers));
  }

  onTick() {
    const rootController = this.children[1];
    if (!this.game!.io.lmb) {
      if (this.selectedEntityIndices.length === 0) {
        return;
      }
      const clickPosition = this.myGame.camera.toWorld(this.game!.io.mousePosition);
      for (const ind of this.selectedEntityIndices) {
        const controllerE = rootController.children![ind];
        if (controllerE instanceof EditPositionController) {
          this.levelData.entities[controllerE.entityInd][controllerE.property] = [ ... clickPosition ];
        }
      }
      this.refreshEntities();
      this.selectedEntityIndices = [];
      return;
    }
    const clickPosition = this.myGame.camera.toWorld(this.game!.io.mousePosition);

    if (this.selectedEntityIndices.length === 0) {
      let minDist = MAXIMUM_SELECTABLE_DISTANCE + 1;
      for (let idx = 0; idx < rootController.children!.length; idx++) {
        const e = rootController.children![idx];
        if (e instanceof EditPositionController) {
          const dist = e.getDistance(clickPosition);
          if (dist <= minDist && dist < MAXIMUM_SELECTABLE_DISTANCE) {
            if (dist == minDist) {
              this.selectedEntityIndices.push(idx);
            } else {
              this.selectedEntityIndices = [idx];
            }
            minDist = dist;
          }
        }
      }
    }
    
    if (this.selectedEntityIndices.length === 0) {
      return;
    }

    for (const ind of this.selectedEntityIndices) {
      const e = rootController.children![ind];
      if (e instanceof EditPositionController) {
        e.onSelected();
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