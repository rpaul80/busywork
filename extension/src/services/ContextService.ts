import { ContextWithStatus } from "../models";
import { messagingService } from "./MessagingService";
import { AGENT_CONTEXT_SELECTION_MODE_REQUESTED } from "../messages";

export class ContextService {
  // Get the appropriate label for the context button
  getContextLabel({ state }: ContextWithStatus): string {
    if (state === "empty") {
      return "Add Context";
    } else if (state === "selecting") {
      return "Select Context";
    } else {
      return "Clear Context";
    }
  }

  // Check if button should be disabled
  isContextButtonDisabled({ state }: ContextWithStatus): boolean {
    return state === "selecting";
  }

  // Start context selection process
  requestContextSelection(contextId: string): void {
    messagingService.sendMessage({
      action: AGENT_CONTEXT_SELECTION_MODE_REQUESTED,
      contextId: contextId,
    });
  }

  // Validate context state
  isContextSatisfied(context: ContextWithStatus): boolean {
    return context.state === "satisfied" && !!context.data;
  }
}

export const contextService = new ContextService();
