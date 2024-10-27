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
}

export interface AgentTask {
  id: string;
  name: string;
  requiredContexts: Context[];
  state: TaskState;
  contexts: Context[];
}

export interface Agent {
  id: string;
  name: string;
  state: AgentState;
  tasks: AgentTask[];
}

export interface ContextMenuEvent {
  type: "pageContext" | "selectionContext";
  data: string;
  url: string;
}

export interface ContextWithStatus extends Context {
  state: "empty" | "selecting" | "satisfied";
}
