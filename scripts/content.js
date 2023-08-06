console.log("Hey I am running from a chrome extension, do you know it");
import '../modal.css'
// content.js
// Function to create and show the modal
let isModalOpen = false;

function createModal() {
  // Create the modal container
  if (isModalOpen) {
    return null;
  }
  const modalContainer = document.createElement("div");
  let input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("id", "input");
  input.setAttribute("placeholder", "Search ...");

  modalContainer.id = "customModal";
  modalContainer.classList.add("modal-container");

  // Create the modal content
  const modalContent = document.createElement("div");
  modalContent.classList.add("modalContent");

  // Create the form element with the desired semantic
  const form = document.createElement("form");
  form.classList.add("form");

  const button1 = document.createElement("button");
  button1.innerHTML = `
    <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
        <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `;

  const input2 = document.createElement("input");
  input2.classList.add("input");
  input2.setAttribute("placeholder", "Type your text");
  input2.setAttribute("required", "");
  input2.setAttribute("type", "text");

  const button2 = document.createElement("button");
  button2.classList.add("reset");
  button2.setAttribute("type", "reset");
  button2.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  `;

  // Append the elements to the form
  form.appendChild(button1);
  form.appendChild(input2);
  form.appendChild(button2);

  // Add the form to the modal content
  modalContent.appendChild(form);

  // Add the content to the container
  modalContainer.appendChild(modalContent);

  // Add the container to the body
  document.body.appendChild(modalContainer);
  isModalOpen = true;

  // Close the modal when clicking outside of it or pressing Esc key
  const closeModal = () => {
    modalContainer.remove();
    document.body.classList.remove("modal-open");
    document.removeEventListener("click", handleOutsideClick);
    document.removeEventListener("keydown", handleEscKeyPress);
    isModalOpen = false;
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
