import { Graphics } from "pixi.js";
import { V } from "../../core/Vector";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { EditPositionController } from "./EditPositionController";
import Level from "./Level";
import RootController from "./RootController";
import { deserializeLevel } from "./serializeLevel";
import { LevelData } from "./serializeTypes";

const MAXIMUM_SELECTABLE_DISTANCE = 0.5;

export class EditorController extends BaseEntity implements Entity {

  selectedEntityIndices: number[];
  createEntityType: string;

  constructor(private levelData: LevelData) {
    super();

    this.selectedEntityIndices = [];

    this.refreshEntities();

    const graphics = new Graphics();
    this.sprite = graphics;
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
          case 'topLeft':
          case 'bottomRight':
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
    this.createEntityType = 'Wall';
  }

  onCreateEntityTypeChange(type: string) {
    this.createEntityType = type;
  }

  onRightClick() {
    const clickPosition = this.game!.camera.toWorld(this.game!.io.mousePosition);
    const snapToGrid = this.game!.io.keyIsDown('ControlLeft');
    const position = snapToGrid ? V(Math.round(clickPosition.x), Math.round(clickPosition.y)) : clickPosition;
    this.levelData.entities.push({ type: 'Wall', version: 1, position1: position, position2: V(position.x, position.y + 2.2) });
    
    this.refreshEntities();
    this.selectedEntityIndices = [];
  }

  onTick() {
    const rootController = this.children[1];
    const clickPosition = this.game!.camera.toWorld(this.game!.io.mousePosition);
    const snapToGrid = this.game!.io.keyIsDown('ControlLeft');
    const snapToEntity = !snapToGrid && this.game!.io.keyIsDown('ShiftLeft');
    const position = snapToGrid ? V(Math.round(clickPosition.x), Math.round(clickPosition.y)) : clickPosition;
    if (!this.game!.io.lmb) {
      if (this.selectedEntityIndices.length === 0) {
        return;
      }
      for (const ind of this.selectedEntityIndices) {
        const controllerE = rootController.children![ind];
        if (controllerE instanceof EditPositionController) {
          this.levelData.entities[controllerE.entityInd][controllerE.property] = [ ... position ];
        }
      }
      this.refreshEntities();
      this.selectedEntityIndices = [];
      return;
    }

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
        e.onSelected(position);
      }
    }

  }

  onRender(dt: number): void {
    const snapToGrid = this.game!.io.keyIsDown('ControlLeft');
    const worldViewPort = this.game!.camera.getWorldViewport(); 

    if (snapToGrid) {
      for (let x = Math.floor(worldViewPort.left); x < Math.ceil(worldViewPort.right); x++) {
        (this.sprite! as Graphics)
          // .moveTo(x, worldViewPort.top)
          // .lineTo(x, worldViewPort.bottom/2)
          .moveTo(worldViewPort.top, x)
          .lineTo(worldViewPort.bottom, x)
          .stroke({ color: 0xbbbbbb, width: 0.05 });
      }
      for (let y = Math.floor(worldViewPort.top); y < Math.ceil(worldViewPort.bottom); y++) {
        (this.sprite! as Graphics)
          // .moveTo(worldViewPort.left, y)
          // .lineTo(worldViewPort.right/2, y)
          .moveTo(y, worldViewPort.left)
          .lineTo(y, worldViewPort.right)
          .stroke({ color: 0xbbbbbb, width: 0.05 });
      }
    } else {
      (this.sprite! as Graphics).clear();
    }
  }
}