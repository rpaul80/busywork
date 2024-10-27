import { useEffect } from "react";
import { AGENT_CONTEXT_SELECTION_MODE_COMPLETED } from "../messages";
import { ContextWithStatus } from "../models";

export function useMessageListener(
  contextId: string | undefined,
  setContexts: React.Dispatch<React.SetStateAction<ContextWithStatus[]>>
) {
  useEffect(() => {
    if (!contextId) return;

    const messageListener = (message: any, sender: any, sendResponse: any) => {
      console.log("message listener got message", message);
      if (message.action === AGENT_CONTEXT_SELECTION_MODE_COMPLETED) {
        setContexts((prevContexts) =>
          prevContexts.map((context) =>
            context.id === contextId
              ? { ...context, state: "satisfied", data: message.context }
              : context
          )
        );
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup listener when component unmounts or contextId changes
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [contextId, setContexts]);
}
