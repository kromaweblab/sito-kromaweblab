// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Indirizzo definitivo: serve per link canonici, Open Graph e JSON-LD.
  // Il dominio non è ancora acquistato; va bene lo stesso.
  site: 'https://kromaweblab.it',

  // Output statico: la build produce solo file HTML/CSS/JS in dist/,
  // che Netlify pubblica così come sono. Nessun adattatore finché non
  // serve una funzione serverless.
  output: 'static',

  // React serve solo per le isole in src/isole/. Tutto il resto è .astro
  // e non manda JavaScript al browser.
  // sitemap: genera /sitemap-index.xml con tutte le pagine, per Google.
  // Usa `site` qui sopra per gli indirizzi. Niente priority/changefreq
  // (Google li ignora) e niente lastmod (meglio nessuna data che una data
  // uguale per tutte). Le pagine di prova (/prova-…) restano fuori.
  integrations: [
    react(),
    sitemap({
      filter: (pagina) => !new URL(pagina).pathname.startsWith('/prova-'),
    }),
  ],

  // Solo per `npm run dev`. Senza questo, Vite scopre React la prima volta
  // che una pagina con un'isola viene aperta, lo prepara di nuovo a server
  // avviato e cambia i nomi dei file: una scheda aperta prima resta con i
  // file vecchi e l'isola si rompe ("_jsxDEV is not a function").
  // Elencandoli qui, Vite li prepara una volta sola all'avvio.
  // Non cambia niente nella build pubblicata.
  vite: {
    optimizeDeps: {
      include: [
        'react',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-dom',
        'react-dom/client',
        '@astrojs/react/client.js',
      ],
    },
  },

  // Caratteri: i file vengono dai pacchetti npm @fontsource-variable
  // (versione fissata in package-lock.json) e Astro li copia nel sito.
  // Nessuna richiesta a Google o ad altri server. Astro crea anche un
  // carattere di riserva con le stesse misure, così il testo non "salta"
  // quando il carattere vero finisce di caricarsi.
  // Solo l'alfabeto latino di base: copre l'italiano, accenti compresi.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Geist',
      cssVariable: '--font-geist',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['@fontsource-variable/geist/files/geist-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [
          {
            src: [
              '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
            ],
            weight: '100 800',
            style: 'normal',
          },
        ],
      },
    },
  ],
});
