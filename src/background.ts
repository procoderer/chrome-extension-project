export {};

interface GetJobDescriptionMsg {
  type: "GET_JOB_DESCRIPTION";
}

// Extend later if you add more message kinds
type InboundMessage = ScrapedJobDescriptionMsg | GetJobDescriptionMsg;

let latestJobDescription = "";

// MV3 background service‑worker lifecycle
chrome.runtime.onInstalled.addListener(async () => {
  // Open the side‑panel when the user clicks the toolbar icon
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

  // Register example context‑menu entry
  chrome.contextMenus.create({
    id: "exampleContextMenu",
    title: "Context Menu",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "exampleContextMenu") {
    const selectedText = info.selectionText ?? "(nothing)";
    console.log(Date.now(), "Selected text:", selectedText);
  }
});

chrome.runtime.onMessage.addListener(
  (
    msg: InboundMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => {
    switch (msg.type) {
      case "SCRAPED_JOB_DESCRIPTION":
        latestJobDescription = msg.payload.text;
        // Notify side panel
        chrome.runtime.sendMessage({
          type: "JOB_DESCRIPTION_UPDATED",
          payload: { text: latestJobDescription },
        });
        sendResponse({ status: "received" });
        break;

      case "GET_JOB_DESCRIPTION":
        sendResponse({ text: latestJobDescription });
        break;
    }

    // Return true if you ever respond asynchronously
    return false;
  }
);
