console.log("Hey I am running from a chrome extension, do you know it");
// content.js

// Function to create and show the modal
function createModal() {
  // Check if the modal already exists, if yes, remove it before creating a new one
  const existingModal = document.getElementById("customModal");
  if (existingModal) {
    existingModal.remove();
  }

  // Create the modal container
  const modalContainer = document.createElement("div");
  modalContainer.id = "customModal";
  modalContainer.style.display = "flex";
  modalContainer.style.justifyContent = "center";
  modalContainer.style.alignItems = "center";
  modalContainer.style.position = "fixed";
  modalContainer.style.top = "0";
  modalContainer.style.left = "0";
  modalContainer.style.width = "100%";
  modalContainer.style.height = "100%";
  modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

  // Create the modal content
  const modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "white";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "5px";

  // Add some content to the modal
  modalContent.textContent = "This is a modal. Click outside to close.";

  // Add the content to the container
  modalContainer.appendChild(modalContent);

  // Add the container to the body
  document.body.appendChild(modalContainer);

  // Close the modal when clicking outside of it
  modalContainer.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
      modalContainer.remove();
    }
  });
}

chrome.runtime.onMessage.addListener((message) => {
  console.log(message);
  if (message.command === "open-popup") {
    // Create and show the modal when the message is received
    createModal();
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.command === "open_index") {
    chrome.tabs.create({ url: "index.html" });
  }
})
