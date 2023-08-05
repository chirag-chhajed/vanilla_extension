console.log("Hey I am running from a chrome extension, do you know it");
import '../modal.css'
// content.js
// Function to create and show the modal
function createModal() {
  // Create the modal container
  const modalContainer = document.createElement("div");
  modalContainer.id = "customModal";
  modalContainer.classList.add("modal-container");

  // Create the modal content
  const modalContent = document.createElement("div");
  modalContent.classList.add("modalContent");

  // Add some content to the modal
  modalContent.textContent =
    "This is a modal. Click outside or press Esc to close.";

  // Add the content to the container
  modalContainer.appendChild(modalContent);

  // Add the container to the body
  document.body.appendChild(modalContainer);

  // Close the modal when clicking outside of it or pressing Esc key
  const closeModal = () => {
    modalContainer.remove();
    document.body.classList.remove("modal-open");
    document.removeEventListener("click", handleOutsideClick);
    document.removeEventListener("keydown", handleEscKeyPress);
  };

  const handleOutsideClick = (event) => {
    if (event.target === modalContainer) {
      closeModal();
    }
  };

  const handleEscKeyPress = (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  document.body.classList.add("modal-open");
  document.addEventListener("click", handleOutsideClick);
  document.addEventListener("keydown", handleEscKeyPress);
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
