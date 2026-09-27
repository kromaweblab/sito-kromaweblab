// Configurazione di ESLint: segnala errori ed errori di accessibilità
// prima che arrivino in una pull request. Si lancia con: npm run lint

import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default defineConfig([
  { ignores: ['dist/', '.astro/', 'node_modules/', 'public/', '.netlify/'] },

  js.configs.recommended,
  tseslint.configs.recommended,

  // File .astro, con le regole di accessibilità sull'HTML.
  astro.configs.recommended,
  astro.configs['jsx-a11y-recommended'],

  // Isole React (Andrea): regole degli hook e accessibilità.
  {
    files: ['src/isole/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, jsxA11y.flatConfigs.recommended],
    languageOptions: { globals: globals.browser },
  },

  // Script e file di configurazione girano in Node, non nel browser.
  {
    files: ['scripts/**/*.mjs', '*.config.{js,mjs,ts}'],
    languageOptions: { globals: globals.node },
  },
]);
