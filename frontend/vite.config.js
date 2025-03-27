import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    proxy: {
      // Proxy requests from frontend dev server starting with /api
      "/api": {
        target: "http://localhost:3000", // Target the Elysia server
        changeOrigin: true,
      },
    },
  },
});
