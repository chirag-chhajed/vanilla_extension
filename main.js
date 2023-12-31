import "./style.css";
import { nanoid } from "nanoid";

let data;
let formContainer = document.querySelector("div.form-container");

chrome.runtime.sendMessage({ action: "getData" }, (response) => {
  if (response) {
    console.log("Received data from background:");
    data = response;
    console.log(response);
    updateDataInMainContent(data);
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

const form = document.getElementById("form");
const linkInput = document.getElementById("url");
const title = document.getElementById("title");
const description = document.getElementById("description");
const isPinned = document.getElementById("isPinned");

let debounceTimeout;
linkInput.addEventListener("input", async function () {
  clearTimeout(debounceTimeout); // Clear the previous timeout if it exists

  debounceTimeout = setTimeout(async () => {
    let url = linkInput.value.trim();
    console.log(url);

    if (
      !url.startsWith("https://") &&
      !url.startsWith("http://") &&
      !url.startsWith("www.")
    ) {
      url = `https://${url}`;
    }

    if (url) {
      const { title: fetchedTitle, description: fetchedDescription } =
        await fetchTitleAndDescription(url);
      title.value = fetchedTitle;
      description.value = fetchedDescription;
      linkInput.value = url;
    } else {
      title.value = ""; // Clear title if URL is invalid
      description.value = ""; // Clear description if URL is invalid
    }
  }, 1000); // Adjust the debounce delay as needed
});

// function isValidURL(url) {
//   const regex = /https/i;
//   return regex.test(url);
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
    updatedAt: new Date(), // Set the current date and time
    createdAt: new Date(), // Set the current date and time
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
            showToast("Link added successfully", 3000, "success");
            formContainer.classList.toggle("visible");
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

const mainContent = document.querySelector("body > main");
// console.log(mainContent);
// mainContent.textContent = JSON.stringify(data);

const updateForm = document.querySelector(".update-form-container");
const updateUrlInput = document.getElementById("update-url");
const updateTitleInput = document.getElementById("update-title");
const updateDescriptionInput = document.getElementById("update-description");
const updateIsPinnedInput = document.getElementById("update-isPinned");
const updateIdInput = document.getElementById("update-id");

function updateDataInMainContent(data) {
  const html = data.map((item) => {
    return `
      <div class="card">
        <div class="card__img">
          <img src="${item.img}" alt="" />
        </div>
        <div class="card__content">
          <a target="_blank" href="${item.url}" class="card__link"><h3 title="${item.titleValue}" class="card__title">${item.titleValue}</h3></a>
          <p title="${item.descriptionValue}" class="card__description">${item.descriptionValue}</p>
          <div class="card__buttons">
            <button class="card__delete" data-id="${item.id}">
  <svg data-id="${item.id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path data-id="${item.id}" d="M7 6V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7ZM9 4V6H15V4H9Z"></path>
  </svg>
</button>
<button class="card__edit" data-id="${item.id}">
  <svg data-id="${item.id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path data-id="${item.id}" d="M12.8995 6.85431L17.1421 11.0969L7.24264 20.9964H3V16.7538L12.8995 6.85431ZM14.3137 5.44009L16.435 3.31877C16.8256 2.92825 17.4587 2.92825 17.8492 3.31877L20.6777 6.1472C21.0682 6.53772 21.0682 7.17089 20.6777 7.56141L18.5563 9.68273L14.3137 5.44009Z"></path>
  </svg>
</button>
          </div>

        </div>
      </div>
    `;
  });

  mainContent.innerHTML = html.join("");

  // Add event listener to the container element
  mainContent.addEventListener("click", async (event) => {
    const target = event.target;
    console.log(target);
    if (
      target.classList.contains("card__delete") ||
      target.closest(".card__delete svg") ||
      target.closest(".card__delete path")
    ) {

      const itemId = target.getAttribute("data-id");
      console.log("Deleting item with ID:", itemId);

      // Disable the button
      target.disabled = true;

      try {
        deleteData(itemId);
        console.log("Deletion finished successfully.");
      } catch (error) {
        console.error("Error while deleting:", error);
      }

      // Re-enable the button after the deletion is done
      target.disabled = false;
    } else if (
      target.classList.contains("card__edit") ||
      target.closest(".card__edit svg") ||
      target.closest(".card__edit path")
    ) {
      const itemId = target.getAttribute("data-id");
      console.log("Editing item with ID:", itemId);
      const selectedItem = data.find((item) => item.id === itemId);
      console.log(selectedItem);
      // Prefill the update form fields with existing values
      if (selectedItem) {
        updateForm.classList.toggle("visible");
        updateUrlInput.value = selectedItem.url;
        updateTitleInput.value = selectedItem.titleValue;
        updateDescriptionInput.value = selectedItem.descriptionValue;
        updateIsPinnedInput.checked = selectedItem.isPin;
        updateIdInput.value = selectedItem.id;
      }
      // Display the update form
    }
    // Add similar logic for edit button if needed
  });
}

let button = document.querySelector("button.button");
button.addEventListener("click", () => {
  // console.log("clicked")
  formContainer.classList.toggle("visible");
});

let closeButton = document.querySelector("span.close-button");
closeButton.addEventListener("click", () => {
  console.log("clicked");
  formContainer.classList.toggle("visible");
});
let updateCloseButton = document.querySelector("span.close-button-update");
updateCloseButton.addEventListener("click", () => {
  console.log("clicked");
  updateForm.classList.toggle("visible");
});

// const showToastButton = document.getElementById("show-toast");
const toastContainer = document.getElementById("toast-container");

function showToast(message, duration, variant) {
  const newToast = document.createElement("div");
  newToast.classList.add("toast", variant);
  newToast.textContent = message;

  toastContainer.appendChild(newToast);

  // Trigger a reflow to apply the initial opacity and transition
  newToast.offsetHeight;

  newToast.style.opacity = "1";

  setTimeout(() => {
    newToast.style.opacity = "0";
    newToast.addEventListener("transitionend", () => {
      toastContainer.removeChild(newToast);
    });
  }, duration);
}

// showToast("Success message", 5000, "success");
// showToast("Error message", 5000, "error");
// showToast("Info message", 5000, "info");

// Event listener for submitting the update form
updateForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const idToUpdate = updateIdInput.value;
  const updatedData = {
    url: updateUrlInput.value,
    titleValue: updateTitleInput.value,
    descriptionValue: updateDescriptionInput.value,
    isPin: updateIsPinnedInput.checked,
    updatedAt: new Date(),
  };

  // Send the updated data to your background script for updating
  chrome.runtime.sendMessage(
    { action: "updateData", data: updatedData, id: idToUpdate },
    (response) => {
      console.log(response, "response");
      if (response.success) {
        console.log("Data updated successfully");
        updateForm.classList.toggle("visible");
        // Update your UI or perform any other actions
      } else {
        console.error("Failed to update data");
      }
    }
  );
});
