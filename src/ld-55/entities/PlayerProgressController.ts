import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Persistence } from "../constants/constants";

interface Item {
  name: string;
  description: string;
}

interface Milestone {
  name: string;
  description: string;
}

export default class PlayerProgressController extends BaseEntity implements Entity {
  persistenceLevel: Persistence = Persistence.Permanent;
  
  tags = ["playerProgressController"]

  items: Item[] = [];
  milestones: Milestone[] = [];

  handlers = {
    addItem: (event: any) => this.addItem(event.name, event.description),
    addMilestone: (event: any) => this.addMilestone(event.name),
    clearProgress: () => this.clearProgress(),
    finishLevel: (event: any) => console.log("Finished level", event.level)
  };

  constructor(
  ) {
    super();    
  }

  addItem(name: string, description: string) {
    this.items.push({name, description});
    console.log(`Added item: ${name}`)
  }

  hasItem(name: string): boolean {
    return this.items.some((item) => item.name === name);
  }

  addMilestone(name: string) {
    this.milestones.push({name, description: ""});
  }

  clearProgress() {
    this.items = [];
    this.milestones = [];
  }

  hasMilestone(name: string): boolean {
    return this.milestones.some((milestone) => milestone.name === name);
  }
}
