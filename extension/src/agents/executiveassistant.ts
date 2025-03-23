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
          prompt:
            "Golden Signals, examine these to determine if there are are any blips",
        },
        {
          id: "teamhealth",
          name: "Team Health",
          type: "document",
          data: {},
          prompt: "",
        },
      ],
      state: TaskState.WaitingForContext,
      contexts: [],
    });
  }
}
