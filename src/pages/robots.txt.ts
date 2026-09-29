// robots.txt generato alla build: tutto il sito si può leggere, e la
// sitemap sta all'indirizzo di `site` in astro.config.mjs. Quando cambia il
// dominio, cambia anche qui da solo.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
