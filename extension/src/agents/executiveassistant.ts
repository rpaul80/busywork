import { BaseAgent } from "./agents";
import { TaskState } from "../models";

export class ExecutiveAssistantAgent extends BaseAgent {
  constructor() {
    super("ea", "Executive Assistant");
    this.tasks.push({
      id: "summarize_document",
      name: "Summarize Document",
      requiredContexts: [
        {
          id: "document",
          name: "Document",
          type: "document",
          data: {},
        },
      ],
      state: TaskState.WaitingForContext,
      contexts: [],
    });
  }
}
