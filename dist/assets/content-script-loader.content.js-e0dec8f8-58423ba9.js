(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/content.js-e0dec8f8.js")
    );
  })().catch(console.error);

})();
