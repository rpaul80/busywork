import { Agent, AgentTask, TaskState, AgentState, Context } from "../models";

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

  startTask(taskId: string): boolean {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task && task.state === TaskState.WaitingForContext) {
      task.state = TaskState.Working;
      this.state = AgentState.Working;
      return true;
    }
    return false;
  }

  completeTask(taskId: string): void {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.state = TaskState.Complete;
      this.state = AgentState.Idle;
    }
  }
}
