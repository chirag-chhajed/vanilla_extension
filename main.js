import './style.css'
// popup.js
function faviconURL(u) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", u);
  url.searchParams.set("size", "32");
  return url.toString();
}


  const linkInput = document.getElementById("linkInput");
  const getFaviconButton = document.getElementById("getFaviconButton");
//   const faviconContainer = document.getElementById("faviconContainer");

  getFaviconButton.addEventListener("click", function () {
    const url = linkInput.value;
    console.log(url)
    const img = document.createElement("img");
    img.src = faviconURL(url);
    document.body.appendChild(img);
  });

