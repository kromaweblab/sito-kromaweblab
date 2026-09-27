// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';

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
  integrations: [react()],

  // Caratteri: i file vengono dai pacchetti npm @fontsource-variable
  // (versione fissata in package-lock.json) e Astro li copia nel sito.
  // Nessuna richiesta a Google o ad altri server. Astro crea anche un
  // carattere di riserva con le stesse misure, così il testo non "salta"
  // quando il carattere vero finisce di caricarsi.
  // Solo l'alfabeto latino di base: copre l'italiano, accenti compresi.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Space Grotesk',
      cssVariable: '--font-space-grotesk',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2'],
            weight: '300 700',
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
