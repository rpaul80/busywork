import { ContextWithStatus } from "./models";

// agent control signals
export const AGENT_CONTEXT_SELECTION_MODE_REQUESTED = "agentContextSelectionModeRequested";
export const AGENT_CONTEXT_SELECTION_MODE_STARTED = "agentContextSelectionModeStarted";
export const AGENT_CONTEXT_SELECTION_MODE_CANCELLED = "agentContextSelectionModeCancelled";
export const AGENT_CONTEXT_SELECTION_MODE_COMPLETED = "agentContextSelectionModeCompleted";


// action signals in response to agent control signals
export const SET_CONTEXT_SELECTION_MODE = "setContextSelectionMode";
export const CONTEXT_SELECTED = "contextSelected";

export interface MessageAgentContextSelectionModeCompleted {
    action: typeof AGENT_CONTEXT_SELECTION_MODE_COMPLETED;
    context: ContextWithStatus;
}

export interface MessageAgentContextSelectionModeRequested {
    action: typeof AGENT_CONTEXT_SELECTION_MODE_REQUESTED;
    contextId: string;
}

export interface MessageContextSelected {
    action: typeof CONTEXT_SELECTED;
    context: string;
}

export interface MessageSetContextSelectionMode {
    action: typeof SET_CONTEXT_SELECTION_MODE;
}
