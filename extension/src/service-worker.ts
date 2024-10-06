chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  chrome.contextMenus.create({
    id: "generate-response",
    title: "Generate response",
    enabled: true,
    contexts: ["selection"],
  });
});

async function contextMenuClickHandler(
  info: chrome.contextMenus.OnClickData,
  tab: chrome.tabs.Tab | undefined
) {
  if (info.menuItemId == "generate-response") {
    chrome.runtime.sendMessage({
      action: "on-context-menu-click",
      selectionText: info.selectionText,
    });
    // @ts-ignore
    chrome.sidePanel.open({ windowId: tab?.windowId });
  }
}

chrome.contextMenus.onClicked.addListener(contextMenuClickHandler);
