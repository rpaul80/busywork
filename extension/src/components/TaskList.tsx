import React from "react";
import { AgentTask } from "../models";

interface TaskListProps {
    tasks: AgentTask[];
    agentName: string;
    selectedTask: AgentTask | null;
    onTaskSelect: (task: AgentTask | null) => void;
}

const TaskList: React.FC<TaskListProps> = ({
    tasks,
    agentName,
    selectedTask,
    onTaskSelect
}) => {
    return (
        <div className="task-selection">
            <h3>{agentName} Tasks</h3>
            <ul>
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        className={`task-item ${selectedTask === task ? 'selected' : ''}`}
                        onClick={() => onTaskSelect(task)}
                    >
                        {task.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;