import "./style.css";
import { nanoid } from "nanoid";

let data;

chrome.runtime.sendMessage({ action: "getData" }, (response) => {
  if (response) {
    console.log("Received data from background:");
    data = response;
    console.log(response);
    updateDataInMainContent(data)
    // Process the received data here
  } else {
    console.error("Failed to retrieve data from background");
  }
});

// popup.js
function faviconURL(u) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", u);
  url.searchParams.set("size", "32");
  return url.toString();
}
async function fetchWithTimeout(url, timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  console;
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function fetchTitleAndDescription(url) {
  try {
    const response = await fetchWithTimeout(url, 10000); // Timeout after 10 seconds
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const title = doc.querySelector("title").textContent;
    const metaDescription = doc.querySelector('meta[name="description"]');
    const description = metaDescription
      ? metaDescription.getAttribute("content")
      : "";
    console.log(title, description);
    return { title, description };
  } catch (error) {
    console.error("Error fetching or parsing content:", error);
    return { title: "", description: "" };
  }
}

// Example usage

// const keyToRemove = "storage"; // Replace with the key you want to remove
// chrome.storage.local.remove(keyToRemove, function () {
//   console.log("Item removed from storage:", keyToRemove);
// });

const form = document.getElementById("form");
const linkInput = document.getElementById("url");
const title = document.getElementById("title");
const description = document.getElementById("description");
const isPinned = document.getElementById("isPinned");

// chrome.storage.local.get("storage", function (result) {
//   const storageData = result.storage; // Retrieve the "storage" value

//   if (typeof storageData !== "undefined") {
//     try {
//       const storage = JSON.parse(storageData); // Parse the JSON data
//       console.log("Get", storage);
//     } catch (error) {
//       console.error("Error parsing JSON:", error);
//     }
//   } else {
//     console.log("Storage data is undefined.");
//   }
// });

// chrome.storage.onChanged.addListener(function (changes, area) {
//   if (area === "local" && changes.storage) {
//     const newStorage = changes.storage.newValue || [];
//     console.log("Updated Storage:", newStorage);
//   }
// });
let debounceTimeout;
linkInput.addEventListener("input", async function () {
  clearTimeout(debounceTimeout); // Clear the previous timeout if it exists

  debounceTimeout = setTimeout(async () => {
    const url = linkInput.value;

    if (url) {
      const { title: fetchedTitle, description: fetchedDescription } =
        await fetchTitleAndDescription(url);
      title.value = fetchedTitle;
      description.value = fetchedDescription;
    } else {
      title.value = ""; // Clear title if URL is invalid
      description.value = ""; // Clear description if URL is invalid
    }
  }, 1000); // Adjust the debounce delay as needed
});
// function isValidURL(url) {
//   const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
//   return pattern.test(url);
// }

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const url = linkInput.value;
  const titleValue = title.value;
  const descriptionValue = description.value;
  const isPin = isPinned.checked;
  const img = faviconURL(url);
  fetchTitleAndDescription(url);
  const newData = {
    id: nanoid(),
    url,
    titleValue,
    descriptionValue,
    img,
    isPin,
  };
  chrome.runtime.sendMessage(
    { action: "addData", data: newData },
    (response) => {
      if (response.success) {
        console.log("Data added to IndexedDB successfully");
        linkInput.value = "";
        title.value = "";
        description.value = "";
        isPinned.checked = false;

        // Fetch updated data and update UI
        chrome.runtime.sendMessage({ action: "getData" }, (response) => {
          if (response) {
            console.log("Received data from background:");
            console.log(response);
            updateDataInMainContent(response);
          } else {
            console.error("Failed to retrieve data from background");
          }
        });
      } else {
        console.error("Failed to add data to IndexedDB");
      }
    }
  );
});



function deleteData(idToDelete) {
  console.log("Deleting data with ID:", idToDelete);
  chrome.runtime.sendMessage(
    { action: "deleteData", id: idToDelete },
    (response) => {
      if (response.success) {
        console.log("Data deleted successfully");

        // Fetch updated data and update UI
        chrome.runtime.sendMessage({ action: "getData" }, (response) => {
          if (response) {
            console.log("Received data from background:");
            data = response;
            console.log(response);
            updateDataInMainContent(data);
          } else {
            console.error("Failed to retrieve data from background");
          }
        });

        // Handle UI updates or other actions after successful deletion
      } else {
        console.error("Failed to delete data");
      }
    }
  );
}


const form2 = document.getElementById("delete");
const deleteId = document.getElementById("id");

form2.addEventListener("submit", function (e) {
  e.preventDefault();
  const idToDelete = deleteId.value;
  deleteData(idToDelete);
});

const mainContent = document.querySelector("body > main");
console.log(mainContent);
mainContent.textContent = JSON.stringify(data);

function updateDataInMainContent(data) {
  const html = data.map((item) => {
    return `
      <div class="card">
        <div class="card__img">
          <img src="${item.img}" alt="" />
        </div>
        <div class="card__content">
          <h3 class="card__title">${item.titleValue}</h3>
          <p class="card__description">${item.descriptionValue}</p>
          <div>
            <a href="${item.url}" class="card__link">Visit</a>
            <button class="card__delete" data-id="${item.id}">Delete</button>
            <button class="card__edit" data-id="${item.id}">Edit</button>
          </div>
        </div>
      </div>
    `;
  });

  mainContent.innerHTML = html.join("");

  // Add event listener to the container element
  mainContent.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("card__delete")) {
      const itemId = target.getAttribute("data-id");
      // Call the deleteData function with the itemId
      deleteData(itemId);
    }
    // Add similar logic for edit button if needed
  });
}


