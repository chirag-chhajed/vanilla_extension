import "./style.css";

// popup.js
function faviconURL(u) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", u);
  url.searchParams.set("size", "32");
  return url.toString();
}
const keyToRemove = "storage"; // Replace with the key you want to remove
// chrome.storage.local.remove(keyToRemove, function () {
//   console.log("Item removed from storage:", keyToRemove);
// });

const form = document.getElementById("form");
const linkInput = document.getElementById("url");
const title = document.getElementById("title");
const description = document.getElementById("description");

chrome.storage.local.get("storage", function (result) {
  const storageData = result.storage; // Retrieve the "storage" value

  if (typeof storageData !== "undefined") {
    try {
      const storage = JSON.parse(storageData); // Parse the JSON data
      console.log("Get", storage);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  } else {
    console.log("Storage data is undefined.");
  }
});

chrome.storage.onChanged.addListener(function (changes, area) {
  if (area === "local" && changes.storage) {
    const newStorage = changes.storage.newValue || [];
    console.log("Updated Storage:", newStorage);
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const url = linkInput.value;
  const titleValue = title.value;
  const descriptionValue = description.value;
  const img = faviconURL(url);
  const data = { url, titleValue, descriptionValue, img };

  chrome.storage.local.get("storage", function (result) {
    const storedData = result.storage; // Retrieve the "storage" value

    const newStorage = storedData ? JSON.parse(storedData) : [];
    const updatedStorage = [...newStorage, data];

    chrome.storage.local.set(
      { storage: JSON.stringify(updatedStorage) },
      function () {
        console.log("Storage updated:", updatedStorage);
      }
    );
  });
});

