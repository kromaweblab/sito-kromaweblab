// Copia i token da src/stili/ (originale) a public/brand/ (copia da
// condividere come materiale del marchio). Parte da solo prima di
// npm run dev e npm run build, così le due copie restano uguali.

import { copyFile, mkdir } from 'node:fs/promises';

await mkdir('public/brand', { recursive: true });
await copyFile('src/stili/tokens.css', 'public/brand/kroma-tokens.css');
