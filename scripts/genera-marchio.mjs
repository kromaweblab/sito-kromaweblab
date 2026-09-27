// Genera tutti i file del marchio a partire dalle coordinate della griglia.
// Uso: npm run marchio
// I file prodotti vanno committati: questo script si lancia solo quando
// cambia il marchio, non a ogni build.
//
// La griglia: celle quadrate con passo 16, disegnate come quadrati 14x14
// (2 unità di spazio tra una cella e l'altra). Coppie (colonna, riga),
// righe 0-4 dall'alto. Coordinate complete in CLAUDE.md.

import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const PASSO = 16;
const CELLA = 14;

const COLORI = {
  nero: '#101010',
  bianco: '#FFFFFF',
  giallo: '#FFC53D',
  arancione: '#F25C05',
  verde: '#12B3A8',
  arancioneSuChiaro: '#D24F03',
  verdeSuChiaro: '#0E8F86',
};

// prettier-ignore
const K = [
  [0, 0], [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 0], [1, 1], [1, 2], [1, 3], [1, 4],
  [2, 2], [3, 1], [3, 3], [4, 0], [4, 4],
];
// prettier-ignore
const W = [
  [0, 0], [0, 1], [0, 2], [0, 3], [1, 4], [2, 2],
  [2, 3], [3, 4], [4, 0], [4, 1], [4, 2], [4, 3],
];
// prettier-ignore
const L = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 4], [2, 4], [3, 4]];
const CURSORE = [17, 4];

const uguale = (a, b) => a[0] === b[0] && a[1] === b[1];
const sposta = (celle, dx) => celle.map(([c, r]) => [c + dx, r]);

/**
 * Colori di un tema. `base` è il colore della K; `k*` servono solo
 * alla versione solo-K, dove i bracci della K sono colorati.
 */
// prettier-ignore
const TEMI = {
  'su-scuro': {
    base: COLORI.bianco, giallo: COLORI.giallo,
    w: COLORI.arancione, l: COLORI.verde,
    kAlto: COLORI.arancione, kBasso: COLORI.verde,
  },
  'su-chiaro': {
    base: COLORI.nero, giallo: COLORI.giallo,
    w: COLORI.arancioneSuChiaro, l: COLORI.verdeSuChiaro,
    kAlto: COLORI.arancioneSuChiaro, kBasso: COLORI.verdeSuChiaro,
  },
};
const mono = (c) => ({ base: c, giallo: c, w: c, l: c, kAlto: c, kBasso: c });
TEMI['mono-nero'] = mono(COLORI.nero);
TEMI['mono-bianco'] = mono(COLORI.bianco);

/** Celle colorate del marchio completo K W L + cursore. */
function celleKwl(t) {
  return [
    ...K.map((p) => [p, uguale(p, [2, 2]) ? t.giallo : t.base]),
    ...sposta(W, 6).map((p) => [p, t.w]),
    ...sposta(L, 12).map((p) => [p, t.l]),
    [CURSORE, t.giallo],
  ];
}

/** Celle colorate della sola K: bracci alti arancioni, bassi verdi, centro giallo. */
function celleK(t) {
  return K.map((p) => {
    if (uguale(p, [2, 2])) return [p, t.giallo];
    if (uguale(p, [3, 1]) || uguale(p, [4, 0])) return [p, t.kAlto];
    if (uguale(p, [3, 3]) || uguale(p, [4, 4])) return [p, t.kBasso];
    return [p, t.base];
  });
}

/**
 * Disegna le celle in un SVG.
 * `passo`/`cella` in unità della viewBox; `margine` = spazio attorno;
 * `fondo` = colore di un quadrato pieno dietro (facoltativo).
 */
function svg(celle, { passo = PASSO, cella = CELLA, margine = 0, lato, fondo } = {}) {
  const colonne = Math.max(...celle.map(([[c]]) => c)) + 1;
  const righe = Math.max(...celle.map(([[, r]]) => r)) + 1;
  const larghezza = lato ?? colonne * passo - (passo - cella) + margine * 2;
  const altezza = lato ?? righe * passo - (passo - cella) + margine * 2;
  const rect = celle
    .map(
      ([[c, r], colore]) =>
        `<rect x="${margine + c * passo}" y="${margine + r * passo}" width="${cella}" height="${cella}" fill="${colore}"/>`,
    )
    .join('');
  const sfondo = fondo ? `<rect width="${larghezza}" height="${altezza}" fill="${fondo}"/>` : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${larghezza} ${altezza}" ` +
    `width="${larghezza}" height="${altezza}" role="img" aria-label="Kroma Web Lab">` +
    `<title>Kroma Web Lab</title>${sfondo}${rect}</svg>\n`
  );
}

/**
 * K su quadrato nero per favicon e icone, con celle a numero intero di
 * pixel così resta nitida. `passo` e `cella` sono in pixel reali.
 */
function iconaK(lato, passo, cella) {
  const larghezzaK = 4 * passo + cella;
  const margine = Math.floor((lato - larghezzaK) / 2);
  return svg(celleK(TEMI['su-scuro']), { passo, cella, margine, lato, fondo: COLORI.nero });
}

/** Impacchetta dei PNG in un file .ico (formato con PNG incorporati). */
function ico(immagini) {
  const testa = Buffer.alloc(6);
  testa.writeUInt16LE(0, 0);
  testa.writeUInt16LE(1, 2);
  testa.writeUInt16LE(immagini.length, 4);
  let posizione = 6 + 16 * immagini.length;
  const voci = immagini.map(({ lato, png }) => {
    const voce = Buffer.alloc(16);
    voce.writeUInt8(lato >= 256 ? 0 : lato, 0);
    voce.writeUInt8(lato >= 256 ? 0 : lato, 1);
    voce.writeUInt16LE(1, 4);
    voce.writeUInt16LE(32, 6);
    voce.writeUInt32LE(png.length, 8);
    voce.writeUInt32LE(posizione, 12);
    posizione += png.length;
    return voce;
  });
  return Buffer.concat([testa, ...voci, ...immagini.map((i) => i.png)]);
}

const png = (sorgente) => sharp(Buffer.from(sorgente)).png().toBuffer();

await mkdir('public/brand', { recursive: true });

for (const tema of Object.keys(TEMI)) {
  await writeFile(`public/brand/kwl-${tema}.svg`, svg(celleKwl(TEMI[tema])));
  await writeFile(`public/brand/k-${tema}.svg`, svg(celleK(TEMI[tema])));
}

// Favicon SVG: griglia da 32 px, celle 4 px con 1 px di spazio.
await writeFile('public/favicon.svg', iconaK(32, 5, 4));

// Favicon .ico con tre misure, ognuna disegnata sui suoi pixel.
await writeFile(
  'public/favicon.ico',
  ico([
    { lato: 16, png: await png(iconaK(16, 3, 2)) },
    { lato: 32, png: await png(iconaK(32, 5, 4)) },
    { lato: 48, png: await png(iconaK(48, 8, 7)) },
  ]),
);

// Icona per la schermata Home di iPhone (iOS arrotonda gli angoli da sé).
await writeFile('public/apple-touch-icon.png', await png(iconaK(180, 22, 19)));

// Immagine di anteprima per i link condivisi (Open Graph), provvisoria:
// marchio su nero, senza testo.
const marchio = svg(celleKwl(TEMI['su-scuro']), { passo: 32, cella: 28 });
await writeFile(
  'public/og-immagine.png',
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: COLORI.nero } })
    .composite([{ input: Buffer.from(marchio), gravity: 'center' }])
    .png()
    .toBuffer(),
);

console.log('Marchio generato in public/ e public/brand/');
