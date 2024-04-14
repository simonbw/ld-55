import PlayerProgressController from "./PlayerProgressController";

export class ExitConstraints {  
  constructor(
    private requiredItems: string[],
    private requiredMilestones: string[]
  ) {
    this.requiredItems = requiredItems;
    this.requiredMilestones = requiredMilestones;
  }

  checkExitConstraints(playerProgress: PlayerProgressController): boolean {
    return this.requiredItems.every((item) => playerProgress.hasItem(item)) &&
      this.requiredMilestones.every((milestone) => playerProgress.hasMilestone(milestone));
  }
}
