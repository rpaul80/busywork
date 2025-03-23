export enum AgentState {
  Idle,
  Working,
}

export enum TaskState {
  WaitingForContext,
  Working,
  InReview,
  Complete,
}

export interface Context {
  id: string;
  name: string;
  type: string;
  data: any;
  prompt: string;
}

export interface AgentTask {
  id: string;
  name: string;
  requiredContexts: Context[];
  state: TaskState;
  contexts: Context[];
  prompt: string;
}

export interface Agent {
  id: string;
  name: string;
  state: AgentState;
  tasks: AgentTask[];

  startTask(taskId: string): boolean;
  completeTask(task: string): void;
}

export interface ContextMenuEvent {
  type: "pageContext" | "selectionContext";
  data: string;
  url: string;
}

export interface ContextWithStatus extends Context {
  state: "empty" | "selecting" | "satisfied";
}
