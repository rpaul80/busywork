import { BaseAgent } from "./agents";
import { TaskState } from "../models";

export class ProjectManagerAgent extends BaseAgent {
  constructor() {
    super("pm", "Project Manager");
    this.tasks.push({
      id: "generate-weekly-report",
      name: "Generate Weekly Report",
      requiredContexts: [
        {
          id: "jira-board",
          name: "Jira Board",
          type: "jira-board",
          data: {},
        },
      ],
      state: TaskState.WaitingForContext,
      contexts: [],
    });
  }

  // Implement Project Manager specific methods here
}
