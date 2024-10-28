import {
  AGENT_CONTEXT_SELECTION_MODE_REQUESTED,
  AGENT_CONTEXT_SELECTION_MODE_COMPLETED,
  SET_CONTEXT_SELECTION_MODE,
  CONTEXT_SELECTED,
} from "./messages";
import { messagingService } from "./services/MessagingService";
import { MessageContextSelected } from "./messages";
class BackgroundService {
  constructor() {
    this.setupListeners();
  }

  async getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  private setupListeners() {
    messagingService.subscribe(
      AGENT_CONTEXT_SELECTION_MODE_REQUESTED,
      async (message) => {
        const activeTab = await this.getCurrentTab();
        if (activeTab?.id) {
          messagingService.sendTabMessage(activeTab.id, {
            action: SET_CONTEXT_SELECTION_MODE,
          });
        }
      }
    );

    messagingService.subscribe(CONTEXT_SELECTED, (message) => {
      messagingService.sendMessage({
        action: AGENT_CONTEXT_SELECTION_MODE_COMPLETED,
        context: message.context,
      });
    });
  }
}

new BackgroundService();

// Allows users to open the side panel by clicking on the action toolbar icon
//@ts-ignore
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error: any) => console.error(error));
