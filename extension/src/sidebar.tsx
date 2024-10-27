import React, { useState, useEffect } from 'react';
import { Agent, AgentTask, Context } from './models';
import AgentService from './agents/service';
import { AGENT_CONTEXT_SELECTION_MODE_REQUESTED, AGENT_CONTEXT_SELECTION_MODE_COMPLETED } from './messages';
import './sidebar.css';
import { createRoot } from 'react-dom/client';

interface ContextWithStatus extends Context {
    isSatisfied: boolean;
}

const AgentList: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);
    const [contexts, setContexts] = useState<ContextWithStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const service = new AgentService();

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
        console.log(agent.tasks);
        setSelectedTask(null);
        setContexts([]);
    };

    const handleTaskClick = (task: AgentTask | null) => {
        console.log("task", task);
        setSelectedTask(task);
        console.log(task?.requiredContexts);
        setContexts(task?.requiredContexts.map(context => ({ ...context, isSatisfied: false })) || []);
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

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log("sidebar got message", message);
            if (message.action === AGENT_CONTEXT_SELECTION_MODE_COMPLETED) {
                setContexts(prevContexts =>
                    prevContexts.map(context =>
                        context.id === contextId ? { ...context, isSatisfied: true } : context
                    )
                );
            }
        });
    };

    const renderContextDetails = (context: ContextWithStatus) => {
        return (
            <div className="context-details">
                <h5>{context.name}</h5>
                <p>Type: {context.type}</p>
                <button onClick={() => handleAddContext(context.id)}>
                    {context.isSatisfied ? 'Clear' : 'Add Context'}
                </button>
                {context.isSatisfied && <span className="checkmark">✓ Context Added</span>}
            </div>
        );
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
                <div className="task-selection">
                    <h3>{selectedAgent.name} Tasks</h3>
                    <ul>
                        {selectedAgent.tasks.map((task) => (
                            <li
                                key={task.id}
                                className={`task-item ${selectedTask === task ? 'selected' : ''}`}
                                onClick={() => handleTaskClick(task)}
                            >
                                {task.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {selectedTask && (
                <div className="task-details">
                    <h4>{selectedTask.name}</h4>
                    <div className="context-list">
                        <h5>Required Contexts</h5>
                        {contexts.map((context) => (
                            <div key={context.id} className="context-item">
                                {renderContextDetails(context)}
                            </div>
                        ))}
                    </div>
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
// print the sidebar
// mount the component on root after the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    if (root) {
        createRoot(root).render(<Sidebar />);
    }
});