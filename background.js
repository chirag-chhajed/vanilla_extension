import Dexie from 'dexie';

const db = new Dexie('MyExtensionDatabase');

// Define the database schema
db.version(1).stores({
  storage: "++id, url, title, description, img, isPin",
});

// Open the database
db.open().catch(error => {
  console.error("Error opening database:", error);
});

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "addData") {
    // Add data to IndexedDB
    db.storage
      .add(request.data)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Error adding data to IndexedDB:", error);
        sendResponse({ success: false });
      });
    return true; // Indicate that you will respond asynchronously
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request,"request")
  if (request.action === "updateData") {
    // Update data in IndexedDB
    db.storage
      .update(request.id, request.data) // Where `request.id` is the ID of the data to update
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Error updating data in IndexedDB:", error);
        sendResponse({ success: false });
      });
    return true; // Indicate that you will respond asynchronously
  }
});




// Listen for messages from content scripts or other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getData") {
    db.storage.toArray().then(data => {
      sendResponse(data);
    });
    return true; // Indicate that you will respond asynchronously
  }
});

// Listen for messages from index html for deleting data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "deleteData") {
    db.storage
      .delete(request.id)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Error deleting data from IndexedDB:", error);
        sendResponse({ success: false });
      });
    return true; // Indicate that you will respond asynchronously
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  if (request.action === "requestUpdatedData") {
    db.storage.toArray().then((data) => {
      console.log("Sending updated data from background.js:", data)
      sendResponse({ action: "updatedData", response: data });
    });
    // Return true to indicate that you will send a response asynchronously
    return true;
  }
});


// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log(request);
//   if (request.action === "dataUpdated") {
//     db.storage.toArray().then((data) => {
//       sendResponse({ action: "updateTheData", response: data });
//     });
//     // Return true to indicate that you will send a response asynchronously
//     return true;
//   }
// });

