import AgentService from "./agents/service";
import { SET_CONTEXT_SELECTION_MODE, CONTEXT_SELECTED } from "./messages";
class BackgroundService {
  private agentsService: AgentService;

  constructor(agentsService: AgentService) {
    this.agentsService = agentsService;
    this.setupListeners();
  }

  async getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  private setupListeners() {
    // add a listener for messages from the sidebar
    // when user clicks add context in the sidebar, it will send a message here
    // at this page will be in a state so that the user can select the context
    console.log("service worker setup listeners");

    chrome.runtime.onMessage.addListener(
      async (message, sender, sendResponse) => {
        console.log("service worker got message", message);

        switch (message.action) {
          case SET_CONTEXT_SELECTION_MODE:
            // dispatch to the active tab
            const activeTab = await this.getCurrentTab();
            console.log("service worker got active tab", activeTab);
            if (activeTab && activeTab.id) {
              console.log("service worker sending message to content script");
              chrome.tabs.sendMessage(activeTab.id, {
                action: SET_CONTEXT_SELECTION_MODE,
              });
            }
            break;
          case CONTEXT_SELECTED:
            console.log("service worker got context selected", message.context);
            break;
          default:
            console.log("service worker got unknown message", message);
            break;
        }
      }
    );
  }
}

new BackgroundService(new AgentService());

// Allows users to open the side panel by clicking on the action toolbar icon
//@ts-ignore
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error: any) => console.error(error));
