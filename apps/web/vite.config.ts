import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Sanity env is read from `apps/web/.env` (and `.env.local`, `.env.<mode>`, etc.).
 * Required: SANITY_PROJECT_ID, SANITY_DATASET. Optional: SANITY_TOKEN for
 * private datasets — proxied server-side so the browser never sees it.
 */

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const projectId = env.SANITY_PROJECT_ID ?? "";
  const dataset = env.SANITY_DATASET ?? "production";
  const token = env.SANITY_TOKEN ?? "";

  return {
    plugins: [react(), tailwindcss()],
    define: {
      "import.meta.env.VITE_SANITY_PROJECT_ID": JSON.stringify(projectId),
      "import.meta.env.VITE_SANITY_DATASET": JSON.stringify(dataset),
    },
    server: {
      port: 4321,
      proxy: projectId
        ? {
            // Proxy Sanity API traffic through the dev server so the browser
            // never issues a cross-origin request to *.apicdn.sanity.io. In
            // prod the client talks to the CDN directly; see `src/sanity.ts`.
            "/sanity-api": {
              target: `https://${projectId}.apicdn.sanity.io`,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/sanity-api/, ""),
              secure: true,
              configure: (proxy) => {
                if (!token) return;
                proxy.on("proxyReq", (proxyReq) => {
                  proxyReq.setHeader("Authorization", `Bearer ${token}`);
                });
              },
            },
          }
        : undefined,
    },
  };
});
