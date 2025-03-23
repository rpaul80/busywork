// an Agent has many tasks. This service is responsible for running a task, and broadcasting when it's complete

import { Agent, AgentTask, Context } from "../models";

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
      // Update task with contexts
      task.contexts = contexts;

      // Start the task on the agent - this will trigger executeTask
      const success = await this.agent.startTask(task.id);

      if (!success) {
        throw new Error("Failed to execute task");
      }
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
