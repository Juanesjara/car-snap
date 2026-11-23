import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // En local no corren las funciones de Vercel: /api va al despliegue real.
  server: {
    proxy: {
      '/api': { target: 'https://car-snap-psi.vercel.app', changeOrigin: true },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      workbox: { navigateFallbackDenylist: [/^\/api\//] },
      manifest: {
        name: 'CarSnap',
        short_name: 'CarSnap',
        description: 'Identifica y guarda autos con IA',
        theme_color: '#0B0F17',
        background_color: '#0B0F17',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
