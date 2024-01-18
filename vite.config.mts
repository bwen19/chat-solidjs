import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { resolve } from "path";

export default defineConfig({
  plugins: [solidPlugin()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:8080",
      "/ws": {
        target: "ws://localhost:8080",
        // changeOrigin: true,
        ws: true,
      },
    },
  },
  build: {
    target: "esnext",
  },
});
