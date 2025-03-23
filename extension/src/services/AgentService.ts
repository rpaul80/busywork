import { Agent } from "../models";
import { ExecutiveAssistantAgent } from "../agents/executiveassistant";

export default class AgentService {
  private agents: Agent[] = [];

  constructor() {
    this.agents = [new ExecutiveAssistantAgent()];
  }

  getAgents() {
    return this.agents;
  }
}
