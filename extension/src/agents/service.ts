import { Agent } from "../models";
import { ProjectManagerAgent } from "./projectmanager";
import { ExecutiveAssistantAgent } from "./executiveassistant";

export default class AgentService {
  private agents: Agent[] = [];

  constructor() {
    this.agents = [new ProjectManagerAgent(), new ExecutiveAssistantAgent()];
  }

  getAgents() {
    return this.agents;
  }
}
