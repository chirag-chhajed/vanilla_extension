console.log("Hey I am running from a chrome extension, do you know it");let i,s=!1;chrome.runtime.sendMessage({action:"getData"},e=>{e?(i=e,console.log("Received data from background:",e)):console.error("Failed to retrieve data from background")});function v(){if(s)return null;const e=document.createElement("div");e.id="customModal",e.classList.add("modal-container");const o=document.createElement("div");o.classList.add("modalContent");const d=document.createElement("form");d.classList.add("form");const u=document.createElement("button");u.innerHTML=`
    <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
        <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `;const n=document.createElement("input");n.classList.add("iinnppuutt"),n.setAttribute("placeholder","Type your text"),n.setAttribute("required",""),n.setAttribute("type","text");const a=document.createElement("button");a.classList.add("reset"),a.setAttribute("type","reset"),a.innerHTML=`
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  `,d.appendChild(u),d.appendChild(n),d.appendChild(a),n.focus();const c=document.createElement("button");c.textContent="Refresh Data";const r=document.createElement("ul");r.classList.add("data-list"),i.forEach(t=>{const f=document.createElement("li"),l=document.createElement("a");l.href=t.url,l.target="_blank",l.textContent=t.titleValue,f.appendChild(l),r.appendChild(f)}),c.addEventListener("click",()=>{console.log("Refresh button clicked"),chrome.runtime.sendMessage({action:"requestUpdatedData"},t=>{t?(i=t,console.log("Received updated data in content.js:",t)):console.error("Failed to retrieve updated data from background")})}),o.appendChild(d),o.appendChild(r),o.appendChild(c),e.appendChild(o),setTimeout(()=>{n.focus()},0),document.body.appendChild(e),s=!0;const m=()=>{e.remove(),document.body.classList.remove("modal-open"),document.removeEventListener("click",p),document.removeEventListener("keydown",h),s=!1},p=t=>{t.target===e&&m()},h=t=>{t.key==="Escape"&&m()};document.body.classList.add("modal-open"),document.addEventListener("click",p),document.addEventListener("keydown",h)}chrome.runtime.onMessage.addListener(e=>{console.log(e),e.command==="open-popup"?v():e.command==="open_index"?chrome.tabs.create({url:"index.html"}):e.action==="updateTheData"&&console.log("Received updated data in content.js:",e.response)});