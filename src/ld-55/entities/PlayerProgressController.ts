import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

interface Item {
  name: string;
  description: string;
}

interface Milestone {
  name: string;
  description: string;
}

export default class PlayerProgressController extends BaseEntity implements Entity {
  items: Item[] = [];
  milestones: Milestone[] = [];

  handlers = {
    addItem: (event: any) => this.addItem(event.name, event.description),
    addMilestone: (event: any) => this.addMilestone(event.name)
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

  hasMilestone(name: string): boolean {
    return this.milestones.some((milestone) => milestone.name === name);
  }
}
