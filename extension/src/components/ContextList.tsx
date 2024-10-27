import React from "react";
import { ContextWithStatus } from "../models";
import { contextService } from '../services/ContextService';

interface ContextListProps {
    contexts: ContextWithStatus[];
    onAddContext: (contextId: string) => void;
}

const renderContextDetails = (context: ContextWithStatus, onAddContext: (contextId: string) => void) => {
    return (
        <div className="context-details">
            <h5>{context.name}</h5>
            <p>Type: {context.type}</p>
            {contextService.isContextSatisfied(context) && (
                <div className="context-details-content">
                    <p>{context.data}</p>
                </div>
            )}
            <button
                disabled={contextService.isContextButtonDisabled(context)}
                onClick={() => onAddContext(context.id)}
            >
                {contextService.getContextLabel(context)}
            </button>
            {contextService.isContextSatisfied(context) && (
                <span className="checkmark">✓ Context Added</span>
            )}
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