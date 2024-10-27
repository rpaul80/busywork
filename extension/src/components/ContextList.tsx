import React from "react";
import { ContextWithStatus } from "../models";

interface ContextListProps {
    contexts: ContextWithStatus[];
    onAddContext: (contextId: string) => void;
}

const renderContextDetails = (context: ContextWithStatus, onAddContext: (contextId: string) => void) => {
    const label = () => {
        if (context.state === "empty") {
            return "Add Context";
        } else if (context.state === "selecting") {
            return "Select Context";
        } else {
            return "Clear Context";
        }
    }
    return (
        <div className="context-details">
            <h5>{context.name}</h5>
            <p>Type: {context.type}</p>
            {context.state === "satisfied" && <div className="context-details-content">
                <p>{context.data}</p>
            </div>}
            <button disabled={context.state === "selecting"} onClick={() => onAddContext(context.id)}>
                {label()}
            </button>
            {context.state === "satisfied" && <span className="checkmark">✓ Context Added</span>}
        </div>
    );
};

const ContextList: React.FC<ContextListProps> = ({ contexts, onAddContext }) => {
    return (
        <div className="context-list">
            <h5>Required Contexts</h5>
            {contexts.map((context) => (
                <div key={context.id} className="context-item">
                    {renderContextDetails(context, onAddContext)}
                </div>
            ))}
        </div>
    );
};

export default ContextList;