import { Agent, AgentTask, TaskState, AgentState } from "../models";

export abstract class BaseAgent implements Agent {
  id: string;
  name: string;
  state: AgentState;
  tasks: AgentTask[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.state = AgentState.Idle;
    this.tasks = [];
  }

  getTasks(): AgentTask[] {
    return this.tasks;
  }

  private updateTaskState(taskId: string, newState: TaskState): boolean {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return false;

    task.state = newState;
    this.state =
      newState === TaskState.Working ? AgentState.Working : AgentState.Idle;
    return true;
  }

  protected abstract executeTask(taskId: string): Promise<boolean>;

  async startTask(taskId: string): Promise<boolean> {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task || task.state !== TaskState.WaitingForContext) return false;

    if (!this.updateTaskState(taskId, TaskState.Working)) return false;

    try {
      const success = await this.executeTask(taskId);

      if (success) {
        this.updateTaskState(taskId, TaskState.Complete);
      } else {
        this.updateTaskState(taskId, TaskState.Failed);
      }

      return success;
    } catch (error) {
      this.updateTaskState(taskId, TaskState.Failed);
      return false;
    }
  }

  completeTask(taskId: string): boolean {
    return this.updateTaskState(taskId, TaskState.Complete);
  }
}
