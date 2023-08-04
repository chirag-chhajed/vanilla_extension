// background.js
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "open-popup") {
    // Get the active tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // Send a message to the content script to open the popup
    chrome.tabs.sendMessage(tab.id, { command: "open-popup" });
  }
});
