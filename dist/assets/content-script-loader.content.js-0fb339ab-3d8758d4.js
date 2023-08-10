(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/content.js-0fb339ab.js")
    );
  })().catch(console.error);

})();
