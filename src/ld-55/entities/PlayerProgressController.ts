import { Container, Text } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Persistence } from "../constants/constants";
import { fontName } from "../../core/resources/resourceUtils";
import { Layer } from "../config/layers";
import Game from "../../core/Game";

interface Item {
  name: string;
  description: string;
}

interface Milestone {
  name: string;
  description: string;
}

interface Objective {
  name: string;
  incompleteDescription: string;
  completeDescription: string;
  showOnComplete: boolean;
  requiredItems: string[];
  requiredMilestones: string[];
}

export default class PlayerProgressController
  extends BaseEntity
  implements Entity
{
  persistenceLevel: Persistence = Persistence.Permanent;
  id = "playerProgressController";

  tags = ["playerProgressController"];

  titleText: Text;
  objectiveText: Text;

  items: Item[] = [];
  milestones: Milestone[] = [];
  incompleteObjectives: Objective[];
  completeObjectives: Objective[];

  handlers = {
    addItem: (event: { name: string; description: string }) => {
      this.items.push({ name: event.name, description: event.description });
      this.checkObjectives();
    },

    addMilestone: (event: { name: string; description: string }) => {
      this.milestones.push({
        name: event.name,
        description: event.description,
      });
    },

    clearLevel: () => {
      this.clearLevel();
    },

    finishLevel: (event: { level: number }) => {
      console.log("Finished level", event.level);
    },

    addObjective: (event: { objectives: Objective[] }) => {
      this.incompleteObjectives.push(...event.objectives);
    },

    clearObjectives: () => {
      this.incompleteObjectives = [];
      this.completeObjectives = [];
    },
  };

  constructor() {
    super();

    this.incompleteObjectives = [];
    this.completeObjectives = [];

    this.sprite = new Container();
    this.sprite.layerName = Layer.HUD;

    this.titleText = new Text({
      text: "Objectives\n",
      style: {
        align: "right",
        fill: "white",
        fontSize: 24,
        fontFamily: fontName("kgBrokenVesselsSketch"),
      },
    });
    this.titleText.anchor.set(1.0, 1.0);
    this.sprite.addChild(this.titleText);

    this.objectiveText = new Text({
      text: "",
      style: {
        align: "right",
        fill: "white",
        fontSize: 16,
        fontFamily: fontName("kgBrokenVesselsSketch"),
      },
    });
    this.objectiveText.anchor.set(1.0, 0.0);
    this.sprite.addChild(this.objectiveText);
  }

  onAdd(game: Game) {
    this.titleText.alpha = 0;
    this.objectiveText.alpha = 0;
  }

  onResize([width, height]: [number, number]): void {
    this.titleText.position.set(width - 20, 80);
    this.objectiveText.position.set(width - 20, 80);
  }

  onRender(dt: number): void {
    if (
      this.incompleteObjectives.length > 0 ||
      this.completeObjectives.length > 0
    ) {
      this.titleText.alpha = 1;
      this.objectiveText.alpha = 1;

      let objectiveDescriptions = "";
      for (const objective of this.completeObjectives) {
        objectiveDescriptions +=
          objective.name + "\n" + objective.completeDescription + "\n";
      }
      for (const objective of this.incompleteObjectives) {
        objectiveDescriptions +=
          objective.name + "\n" + objective.incompleteDescription + "\n";
      }
      this.objectiveText.text = objectiveDescriptions;
    } else {
      this.titleText.alpha = 0;
      this.objectiveText.alpha = 0;
    }
  }

  hasItem(name: string): boolean {
    return this.items.some((item) => item.name === name);
  }

  hasMilestone(name: string): boolean {
    return this.milestones.some((milestone) => milestone.name === name);
  }

  clearLevel() {
    this.items = [];
    this.milestones = [];
    this.incompleteObjectives = [];
    this.completeObjectives = [];
  }

  checkObjectives() {
    for (const objective of this.incompleteObjectives) {
      if (
        objective.requiredItems.every((item) => this.hasItem(item)) &&
        objective.requiredMilestones.every((milestone) =>
          this.hasMilestone(milestone)
        )
      ) {
        const completedObjective = this.incompleteObjectives.find(
          (o) => o.name == objective.name
        );
        if (completedObjective) {
          this.completeObjective(completedObjective);
        }
      }
    }
  }

  completeObjective(objective: Objective) {
    this.incompleteObjectives = this.incompleteObjectives.filter(
      (o) => o !== objective
    );
    if (objective.showOnComplete) {
      this.completeObjectives.push(objective);
    }
  }
}
