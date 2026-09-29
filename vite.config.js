import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// React handles the UI, Tailwind handles styling. No backend server needed.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
