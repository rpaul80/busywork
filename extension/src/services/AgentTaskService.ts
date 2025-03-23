// an Agent has many tasks. This service is responsible for running a task, and broadcasting when it's complete

import { Agent, AgentTask, Context, TaskState } from "../models";

export default class AgentTaskService {
  private agent: Agent;

  constructor(agent: Agent) {
    this.agent = agent;
  }

  async runTask(task: AgentTask, contexts: Context[]): Promise<void> {
    if (!this.validateContexts(task, contexts)) {
      throw new Error("Missing required contexts for task");
    }

    try {
      // Update task state to working
      task.state = TaskState.Working;
      task.contexts = contexts;

      // Start the task on the agent
      this.agent.startTask(task.id);

      // TODO: Implement actual task execution logic here
      // This would involve:
      // 1. Creating the prompt using task.prompt and contexts
      // 2. Sending to LLM
      // 3. Processing response

      alert(
        "prompt LLM with overall prompt of:" +
          task.prompt +
          "context Names" +
          task.contexts.length +
          "contexts" +
          task.contexts.map((c) => c.prompt + " " + c.data)
      );

      // Mark task as complete
      this.agent.completeTask(task.id);

      // Broadcast completion
      chrome.runtime.sendMessage({
        action: "TASK_COMPLETED",
        taskId: task.id,
        agentId: this.agent.id,
      });
    } catch (error) {
      console.error("Error running task:", error);
      throw error;
    }
  }

  private validateContexts(
    task: AgentTask,
    providedContexts: Context[]
  ): boolean {
    return task.requiredContexts.every((required) =>
      providedContexts.some(
        (provided) =>
          provided.id === required.id && provided.type === required.type
      )
    );
  }
}
