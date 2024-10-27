import React, { useState, useEffect } from 'react';
import { Agent, AgentTask, ContextWithStatus } from '../models';
import AgentService from '../agents/service';
import { AGENT_CONTEXT_SELECTION_MODE_REQUESTED, AGENT_CONTEXT_SELECTION_MODE_COMPLETED } from '../messages';
import './sidebar.css';
import { createRoot } from 'react-dom/client';
import { useMessageListener } from '../hooks/useMessagesListener';
import TaskList from './TaskList';
import ContextList from './ContextList';
const AgentList: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);
    const [contexts, setContexts] = useState<ContextWithStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const service = new AgentService();

    const [selectingContextId, setSelectingContextId] = useState<string | undefined>();
    useMessageListener(selectingContextId, setContexts);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                setIsLoading(true);
                const fetchedAgents = service.getAgents();
                setAgents(fetchedAgents);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch agents. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchAgents();
    }, []);

    const handleAgentClick = (agent: Agent) => {
        setSelectedAgent(agent);
        setSelectedTask(null);
        setContexts([]);
    };

    const handleTaskClick = (task: AgentTask | null) => {
        setSelectedTask(task);
        setContexts(task?.requiredContexts.map(context => ({ ...context, state: "empty" })) || []);
    };

    if (isLoading) {
        return <div className="loading">Loading agents...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    const handleAddContext = (contextId: string) => {
        // send a message to the service worker to start the context selection process
        chrome.runtime.sendMessage({
            action: AGENT_CONTEXT_SELECTION_MODE_REQUESTED,
            contextId: contextId
        });

        setContexts(prevContexts =>
            prevContexts.map(context =>
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
                            className={`agent-item ${selectedAgent?.id === agent.id ? 'selected' : ''}`}
                            onClick={() => handleAgentClick(agent)}
                        >
                            {agent.name}
                        </li>
                    ))}
                </ul>
            )}
            {selectedAgent && (
                <TaskList tasks={selectedAgent.tasks} agentName={selectedAgent.name} selectedTask={selectedTask} onTaskSelect={handleTaskClick} />
            )}
            {selectedTask && (
                <div className="task-details">
                    <h4>{selectedTask.name}</h4>
                    <ContextList contexts={contexts} onAddContext={handleAddContext} />
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

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    if (root) {
        createRoot(root).render(<Sidebar />);
    }
});