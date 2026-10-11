import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Dev only: forward /api to the Express backend on port 4000, so the
    // browser calls the Vite origin — same as it does in production.
    proxy: { "/api": "http://localhost:4000" },
  },
});
