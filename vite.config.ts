import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "og-image.png"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,woff2}"],
        navigateFallbackDenylist: [/^\/~oauth/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.github\.com\/.*/i,
            handler: "NetworkFirst",
            options: { cacheName: "github-api", expiration: { maxEntries: 20, maxAgeSeconds: 300 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts", expiration: { maxEntries: 10, maxAgeSeconds: 31536000 } },
          },
        ],
      },
      manifest: {
        name: "Morris Darren Babu — AI Engineer Portfolio",
        short_name: "Darren.dev",
        description: "MLOps Engineer & AI Specialist — portfolio, blog, tools, and games",
        theme_color: "#c2733a",
        background_color: "#faf8f5",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/favicon.png", sizes: "64x64", type: "image/png" },
          { src: "/og-image.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
}));
