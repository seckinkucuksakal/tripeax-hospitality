import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const DEFAULT_API_PROXY = "https://tripeax-voice-agent.up.railway.app";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, "."), "");
  const apiProxyTarget =
    env.DEV_API_PROXY_TARGET?.trim() || DEFAULT_API_PROXY;

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
