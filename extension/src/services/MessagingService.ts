import {
  AGENT_CONTEXT_SELECTION_MODE_REQUESTED,
  AGENT_CONTEXT_SELECTION_MODE_COMPLETED,
  SET_CONTEXT_SELECTION_MODE,
  CONTEXT_SELECTED,
} from "../messages";

type MessageListener<T> = (message: T) => void;

export class MessagingService {
  private listeners: Map<string, MessageListener<any>[]> = new Map();

  constructor() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const listenersForAction = this.listeners.get(message.action) || [];
      listenersForAction.forEach((listener) => listener(message));
    });
  }

  subscribe<T>(action: string, listener: MessageListener<T>) {
    if (!this.listeners.has(action)) {
      this.listeners.set(action, []);
    }
    this.listeners.get(action)?.push(listener);

    return () => {
      const listeners = this.listeners.get(action) || [];
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  sendMessage(message: { action: string; [key: string]: any }) {
    chrome.runtime.sendMessage(message);
  }

  sendTabMessage(
    tabId: number,
    message: { action: string; [key: string]: any }
  ) {
    chrome.tabs.sendMessage(tabId, message);
  }
}

export const messagingService = new MessagingService();
