// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://solwed.es',
  output: 'static',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  },
  redirects: {
    '/tienda': '/precios',
    '/almacenamiento': '/precios',
    '/desarrollo-web': '/contacto',
    '/login': '/',
    '/registro': '/',
  },
});
