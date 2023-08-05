import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [crx({ manifest })],
  build: {
    rollupOptions: {
      // Add index.html as an additional resource to be bundled
      input: {
        main: "./main.js",
        index: "./index.html",
      },
    },
  },
});
