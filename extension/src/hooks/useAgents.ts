import { useState, useEffect } from "react";
import AgentService from "../services/AgentService";
import { Agent } from "../models";
export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const service = new AgentService();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setIsLoading(true);
        const fetchedAgents = service.getAgents();
        setAgents(fetchedAgents);
      } catch (err) {
        setError("Failed to fetch agents. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return { agents, isLoading, error };
}
