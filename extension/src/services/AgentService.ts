import { Agent } from "../models";
import { ProjectManagerAgent } from "../agents/projectmanager";
import { ExecutiveAssistantAgent } from "../agents/executiveassistant";

export default class AgentService {
  private agents: Agent[] = [];

  constructor() {
    this.agents = [new ProjectManagerAgent(), new ExecutiveAssistantAgent()];
  }

  getAgents() {
    return this.agents;
  }
}
