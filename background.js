chrome.commands.onCommand.addListener(async (command) => {
  if (command === "open-popup") {
    // Get the active tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // Check if a tab is found before sending the message
    if (tab) {
      // Send a message to the content script to open the popup
      chrome.tabs.sendMessage(tab.id, { command: "open-popup" });
    } else {
      console.error("No active tab found.");
    }
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "open_index") {
    // Get the active tab
    chrome.tabs.create({ url: "index.html" });
  }
});
