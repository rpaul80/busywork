// when receiving a message with action setContextSelectionMode, we need to update the current tab visually so that the user knows that they are in context selection mode
import { SET_CONTEXT_SELECTION_MODE, CONTEXT_SELECTED } from "./messages";

console.log("content script adding listeners");

function injectCSS() {
  const href = chrome.runtime.getURL("content_styles.css");
  console.log("injecting CSS", href);
  const link = document.createElement("link");
  link.href = href;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

injectCSS();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("content script got message", message);
  if (message.action === SET_CONTEXT_SELECTION_MODE) {
    console.log("active tab -- setting context selection mode");
    enableContextSelectionMode();
  }
});

function enableContextSelectionMode() {
  let hoveredElement: Element | null = null;

  const mouseoverHandler = (e: MouseEvent) => {
    if (hoveredElement) {
      hoveredElement.classList.remove("ai-context-hover");
    }
    hoveredElement = e.target as Element;
    hoveredElement.classList.add("ai-context-hover");
  };

  const clickHandler = (e: MouseEvent) => {
    e.preventDefault();
    const target = e.target as Element;
    const contextHtml = target.outerHTML;
    chrome.runtime.sendMessage({
      action: CONTEXT_SELECTED,
      context: contextHtml,
    });
    disableContextSelectionMode();
  };

  const keydownHandler = (e: KeyboardEvent) => {
    console.log("keydownHandler", e.key);
    if (e.key === "Escape") {
      disableContextSelectionMode();
    }
  };

  document.body.style.cursor = "crosshair";
  document.addEventListener("mouseover", mouseoverHandler);
  document.addEventListener("click", clickHandler);
  document.addEventListener("keydown", keydownHandler);

  function disableContextSelectionMode() {
    document.body.style.cursor = "";
    document.removeEventListener("mouseover", mouseoverHandler);
    document.removeEventListener("click", clickHandler);
    document.removeEventListener("keydown", keydownHandler);
    if (hoveredElement) {
      hoveredElement.classList.remove("ai-context-hover");
    }
  }
}

console.log("content script loaded");
