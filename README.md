# sito-kromaweblab

Il sito di Kroma Web Lab, Scicli (RG). Astro + TypeScript, React solo per
due componenti interattivi, CSS scritto a mano. Pubblicato su Netlify.

- **`CLAUDE.md`** — regole del progetto: identità, divieti di design,
  struttura, divisione del lavoro. Da leggere prima di tutto.
- **`DECISIONI.md`** — le scelte fatte, con data e motivo.

## Per iniziare

Serve Node 24 (la versione è scritta in `.nvmrc`). Con nvm:

```bash
nvm use
npm install
npm run dev
```

Il sito gira su http://localhost:4321 e si aggiorna a ogni salvataggio.

## Comandi

| Comando            | Cosa fa                                               |
| ------------------ | ----------------------------------------------------- |
| `npm run dev`      | sito in locale, con aggiornamento automatico          |
| `npm run build`    | controllo dei tipi + sito finale in `dist/`           |
| `npm run preview`  | mostra in locale il contenuto di `dist/`              |
| `npm run lint`     | ESLint: errori e problemi di accessibilità            |
| `npm run format`   | Prettier: formatta tutti i file                       |
| `npm run test`     | Vitest: controlla la logica delle isole (`*.test.ts`) |
| `npm run verifica` | formattazione + lint + test + build: prima di una PR  |
| `npm run marchio`  | rigenera logo, favicon e immagine Open Graph          |

## Come si lavora

1. Branch da `main`: `feat/nome-sezione`.
2. `npm run verifica` prima di aprire la pull request.
3. L'altro approva guardando anche l'anteprima di Netlify.
4. Nessun push diretto su `main`.
