import { Agent, ContextMenuEvent } from "./models";
import AgentService from "./agents/service";

class BackgroundService {
  private agentsService: AgentService;

  constructor(agentsService: AgentService) {
    this.agentsService = agentsService;
    this.setupContextMenus();
  }

  private setupContextMenus() {
    chrome.contextMenus.create({
      id: "addPageContext",
      title: "Add page as context",
      contexts: ["page"],
    });

    chrome.contextMenus.create({
      id: "addSelectionContext",
      title: "Add selection as context",
      contexts: ["selection"],
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (tab && tab.id) {
        if (info.menuItemId === "addPageContext") {
          this.handleContextMenuEvent({
            type: "pageContext",
            data: tab.url || "",
            url: tab.url || "",
          });
        } else if (info.menuItemId === "addSelectionContext") {
          chrome.tabs.sendMessage(
            tab.id,
            { action: "getSelection" },
            (response) => {
              this.handleContextMenuEvent({
                type: "selectionContext",
                data: response.selection,
                url: tab.url || "",
              });
            }
          );
        }
      }
    });
  }

  private handleContextMenuEvent(event: ContextMenuEvent) {
    // Here you would typically update the relevant agent or task with the new context
    console.log("Context menu event:", event);
    // For example:
    // const relevantAgent = this.agents.find(agent => agent.needsContext(event.type));
    // if (relevantAgent) {
    //   relevantAgent.addContext(event);
    // }
  }
}

new BackgroundService(new AgentService());

// Allows users to open the side panel by clicking on the action toolbar icon
//@ts-ignore
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error: any) => console.error(error));
