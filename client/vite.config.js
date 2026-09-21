import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "WasteWise AI",
        short_name: "WasteWise",
        description: "AI-powered waste classification and disposal guidance.",
        theme_color: "#166534",
        background_color: "#f7f8f3",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          }
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            // Cache GET requests to non-auth APIs (dashboard, history, etc)
            urlPattern: ({ url, request }) => {
              return request.method === 'GET' && url.pathname.startsWith('/api/') && !url.pathname.startsWith('/api/auth');
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Specifically DO NOT cache AI or POST APIs
            urlPattern: ({ url }) => {
              return url.pathname.startsWith('/api/ai/') || url.pathname.startsWith('/api/auth');
            },
            handler: 'NetworkOnly',
          }
        ],
      },
    }),
  ],
});