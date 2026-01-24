// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://solwed.es',
  output: 'static',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    esbuild: {
      jsx: 'automatic',
      jsxImportSource: 'react',
    },
    server: {
      allowedHosts: ['dev.solwed.es', 'localhost', '127.0.0.1']
    }
  },
  redirects: {
    '/tienda': '/precios',
    '/almacenamiento': '/precios',
    '/desarrollo-web': '/contacto',
    '/login': '/',
    '/registro': '/',
  },
});
