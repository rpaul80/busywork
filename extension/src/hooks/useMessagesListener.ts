import { useEffect } from "react";
import { AGENT_CONTEXT_SELECTION_MODE_COMPLETED } from "../messages";
import { ContextWithStatus } from "../models";
import { messagingService } from "../services/MessagingService";

export function useMessageListener(
  contextId: string | undefined,
  setContexts: React.Dispatch<React.SetStateAction<ContextWithStatus[]>>
) {
  useEffect(() => {
    if (!contextId) return;

    const unsubscribe = messagingService.subscribe(
      AGENT_CONTEXT_SELECTION_MODE_COMPLETED,
      (message) => {
        setContexts((prevContexts) =>
          prevContexts.map((context) =>
            context.id === contextId
              ? { ...context, state: "satisfied", data: message.context }
              : context
          )
        );
      }
    );

    return () => unsubscribe();
  }, [contextId, setContexts]);
}
