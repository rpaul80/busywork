import { BaseAgent } from "./agents";
import { TaskState } from "../models";

export class ExecutiveAssistantAgent extends BaseAgent {
  constructor() {
    super("ea", "Executive Assistant");
    this.tasks.push({
      id: "generated_weekly_dev_managers_update",
      name: "Generate Weekly Update",
      prompt: `
        Your job is to summarize the following into a report with following format, using the <contexts> below.:

        Golden Signals
        Operatioanl metrics; using contexts from datadog links and summarize. 

        Team Health Signals: Use context from data 

        <contexts>
            {contexts}
        </contexts>


      `,
      requiredContexts: [
        {
          id: "datadog",
          name: "Golden Signals",
          type: "document",
          data: {},
          prompt: "prompt 1",
        },
        {
          id: "teamhealth",
          name: "Team Health",
          type: "document",
          data: {},
          prompt: "prompt 2",
        },
      ],
      state: TaskState.WaitingForContext,
      contexts: [],
    });
  }

  protected async executeTask(taskId: string): Promise<boolean> {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return false;

    alert(
      "now we can handle the llm thing here " +
        task.contexts.map((c) => c.prompt)
    );

    try {
      // TODO: Implement actual LLM call here
      // For now, we'll just simulate a successful execution
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error(`Failed to execute task ${taskId}:`, error);
      return false;
    }
  }
}
