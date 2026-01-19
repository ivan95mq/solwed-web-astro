import type { APIRoute } from 'astro';

const site = 'https://solwed.es';

const pages = [
  { url: '', changefreq: 'weekly', priority: '1.0' },
  { url: '/precios', changefreq: 'weekly', priority: '0.9' },
  { url: '/proyectos', changefreq: 'weekly', priority: '0.8' },
  { url: '/contacto', changefreq: 'monthly', priority: '0.7' },
  { url: '/legal/privacidad', changefreq: 'yearly', priority: '0.3' },
  { url: '/legal/terminos', changefreq: 'yearly', priority: '0.3' },
  { url: '/legal/cookies', changefreq: 'yearly', priority: '0.3' },
  { url: '/legal/cancelacion', changefreq: 'yearly', priority: '0.3' },
  { url: '/legal/devoluciones', changefreq: 'yearly', priority: '0.3' },
  { url: '/legal/registro-dominios', changefreq: 'yearly', priority: '0.3' },
];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${site}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
