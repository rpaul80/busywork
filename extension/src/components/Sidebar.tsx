import React, { useState, useMemo } from "react";
import { Agent, AgentTask, ContextWithStatus } from "../models";
import { AGENT_CONTEXT_SELECTION_MODE_REQUESTED } from "../messages";
import "./sidebar.css";
import { createRoot } from "react-dom/client";
import { useMessageListener } from "../hooks/useMessagesListener";
import { useAgents } from "../hooks/useAgents";
import TaskList from "./TaskList";
import ContextList from "./ContextList";
import { Loading } from "./common/Loading";
import { Error } from "./common/Error";
import AgentTaskService from "../services/AgentTaskService";

const AgentList: React.FC = () => {
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);
    const [contexts, setContexts] = useState<ContextWithStatus[]>([]);
    const [selectingContextId, setSelectingContextId] = useState<
        string | undefined
    >();
    const { agents, isLoading, error } = useAgents();

    useMessageListener(selectingContextId, setContexts);

    const handleRunTask = async () => {
        if (!selectedAgent || !selectedTask) return;

        const taskService = new AgentTaskService(selectedAgent);
        try {
            await taskService.runTask(selectedTask, contexts);
        } catch (error) {
            console.error("Failed to run task:", error);
            // TODO: Add error handling UI
        }
    };

    const handleAgentClick = (agent: Agent) => {
        setSelectedAgent(agent);
        setSelectedTask(null);
        setContexts([]);
    };

    const handleTaskClick = (task: AgentTask | null) => {
        setSelectedTask(task);
        setContexts(
            task?.requiredContexts.map((context) => ({
                ...context,
                state: "empty",
            })) || []
        );
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <Error message={error} />;
    }

    const handleAddContext = (contextId: string) => {
        // send a message to the service worker to start the context selection process
        chrome.runtime.sendMessage({
            action: AGENT_CONTEXT_SELECTION_MODE_REQUESTED,
            contextId: contextId,
        });

        setContexts((prevContexts) =>
            prevContexts.map((context) =>
                context.id === contextId ? { ...context, state: "selecting" } : context
            )
        );
        setSelectingContextId(contextId);
    };

    return (
        <div className="agent-list">
            <h2>Available Agents</h2>
            {agents.length === 0 ? (
                <p>No agents available.</p>
            ) : (
                <ul>
                    {agents.map((agent) => (
                        <li
                            key={agent.id}
                            className={`agent-item ${selectedAgent?.id === agent.id ? "selected" : ""
                                }`}
                            onClick={() => handleAgentClick(agent)}
                        >
                            {agent.name}
                        </li>
                    ))}
                </ul>
            )}
            {selectedAgent && (
                <TaskList
                    tasks={selectedAgent.tasks}
                    agentName={selectedAgent.name}
                    selectedTask={selectedTask}
                    onTaskSelect={handleTaskClick}
                />
            )}
            {selectedTask && (
                <div className="task-details">
                    <h4>{selectedTask.name}</h4>
                    <ContextList contexts={contexts} onAddContext={handleAddContext} />
                    <input type="button" onClick={() => handleRunTask()} value="Submit" />
                </div>
            )}
        </div>
    );
};

function Sidebar() {
    return (
        <div className="sidebar">
            <header className="sidebar-header">
                <h1>AI Assistant</h1>
            </header>
            <AgentList />
        </div>
    );
}

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("root");
    if (root) {
        createRoot(root).render(<Sidebar />);
    }
});
