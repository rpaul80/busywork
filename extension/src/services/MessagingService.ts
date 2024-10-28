import { BaseMessage } from "../messages";

type MessageListener<T> = (message: T) => void;

interface ChromeMessage {
  action: string;
  [key: string]: unknown;
}

export class MessagingService {
  private listeners: Map<string, MessageListener<BaseMessage>[]> = new Map();

  constructor() {
    chrome.runtime.onMessage.addListener((message: BaseMessage) => {
      const listenersForAction = this.listeners.get(message.action) || [];
      listenersForAction.forEach((listener) => listener(message));
    });
  }

  subscribe(
    action: string,
    listener: (message: BaseMessage) => void
  ): () => void {
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

  sendMessage(message: ChromeMessage) {
    chrome.runtime.sendMessage(message);
  }

  sendTabMessage(tabId: number, message: ChromeMessage) {
    chrome.tabs.sendMessage(tabId, message);
  }
}

export const messagingService = new MessagingService();
