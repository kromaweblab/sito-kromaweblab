# Per Andrea: cosa è successo dal 30/09 al 05/10/2026

Scritto da Giovanni con il suo assistente (Claude Code), il 05/10/2026.

**Se sei l'assistente di Andrea:** all'inizio della sessione riassumi questo
file ad Andrea, sezione per sezione, mettendo in cima la parte "Cosa tocca a
te". Poi chiedigli da cosa vuole partire. I dettagli e i motivi di ogni scelta
stanno in `DECISIONI.md` (voci dal 03/10/2026 in poi). Quando Andrea ha letto
tutto, cancellate questo file e il rimando in cima a `CLAUDE.md`, con una PR.

---

## In breve

Il sito somigliava troppo a quello di un altro studio di Scicli
(epressio.it), nel tono e nella struttura. Giovanni l'ha ridisegnato da capo:
nuova veste **"Officina"**. Tutto il lavoro sta sul branch lungo
**`feat/nuova-veste`**, che **non è ancora su `main`**: su `main` c'è ancora
il sito vecchio. Alla fine ci sarà una sola PR `feat/nuova-veste` → `main`,
che **devi approvare tu**.

Le PR unite in `feat/nuova-veste`, in ordine: dalla #28 alla #47 (fondamenta,
apertura, pagine, menu, piè di pagina, poi la nuova impostazione della home).

## Cosa tocca a te

1. **`/gestionali` (la tua PR #26).** È ferma: va rifatta nella nuova veste,
   partendo da `feat/nuova-veste` (non da `main`) e con la PR verso
   `feat/nuova-veste`. Oggi `/gestionali` è una pagina provvisoria. È la
   pagina del servizio principale: è la più importante tra quelle che
   mancano.
   - In `src/dati/metodo.ts` i tuoi testi per `/gestionali`
     (`fattiGestionale`, `domandeGestionali`) danno ancora del **tu**: il sito
     ora dà del **voi** (vedi "Regole nuove").
   - `fattiGestionale.dati` dice "Il server lo acquisti tu, insieme al
     dominio": è una promessa, mentre su `/siti` la stessa cosa è ancora
     `[DA DEFINIRE]` (chi compra dominio e spazio, a nome di chi). Da decidere
     con Giovanni prima di pubblicarla.
   - `passi` (gli stessi file) li ha riscritti Giovanni al voi, con un quinto
     passo "Consegna e formazione": li usa la sezione "Come lavoriamo".
2. **PR #27 (menu, `aria-current`).** È aperta verso `main`, ma
   l'intestazione (`src/componenti/Intestazione.astro`) nel frattempo è
   cambiata parecchio. Va riportata su `feat/nuova-veste` (o chiusa, se non
   serve più).
3. **La tua lavagna di prenotazioni** (`src/isole/gestionale-dimostrativo/`)
   **non è più in home**: al suo posto c'è una prova nuova (vedi sotto). I
   tuoi file **sono ancora tutti lì**, non li ha cancellati nessuno: decidi
   tu se riusarla (per esempio in `/gestionali`) o toglierla. Se la riusi,
   va portata ai colori scuri: usa ancora token per fondo chiaro
   (`--kroma-arancione-testo`, `--kroma-carta*`).
4. **Controlla le modifiche ai tuoi file** (fatte da Giovanni, d'accordo con
   te su Discord): elenco nella sezione "Cosa è cambiato nei tuoi file".
5. **Approva la PR finale** `feat/nuova-veste` → `main`, guardando
   l'anteprima Netlify.

## La nuova veste "Officina", in poche righe

- **Sito scuro**, fondo pieno (niente più trama a puntini). Nei componenti si
  usano i **ruoli**: `--kroma-fondo`, `--kroma-superficie`, `--kroma-testo`,
  `--kroma-testo-tenue`, `--kroma-linea`, `--kroma-bordo`, `--kroma-link`
  (arancione), `--kroma-focus` (giallo). Tabella completa in `CLAUDE.md`.
- **Carattere Geist** per titoli e testo (al posto di Space Grotesk, tolto);
  JetBrains Mono solo per dati veri (orari, numeri).
- **Movimento (scelta C):** transizioni morbide in risposta a un gesto,
  passaggio tra le pagine con le View Transitions (solo CSS), un solo momento
  animato: i pixel del marchio che si compongono all'apertura della home. In
  più, dietro l'apertura, un **campo di pixel** che si accende dove passa il
  mouse o il dito (piccolo script su `<canvas>`).
- **Posizionamento:** 1. gestionali e web app su misura per chi lavora con una
  squadra (la prova è Vivai Cintoli), 2. siti, 3. **manutenzione** con
  contratto (nuova pagina `/manutenzione`).

## Regole nuove (sono anche in `CLAUDE.md`)

- **Si dà del voi** in tutto il sito. Unica eccezione: **il configuratore dà
  del tu** ("tu nel modulo, voi intorno"), perché lo compila una persona sola.
- **Pulsante principale: "Fissa un primo incontro"** (nel menu "Fissa un
  incontro"). Formule da non usare: "Raccontaci…", "Parliamone", "senza
  tecnicismi", "colloquio" (si dice "primo incontro").
- **Titoli senza punto finale.**
- Mai dati in fila separati da puntini ("A · B · C"), mai piccole etichette
  in monospazio, mai frecce "→" nei pulsanti. (La lavagna dimostrativa li usa
  come da vecchia specifica: se la riusi, da rivedere insieme.)
- **Il sito non mostra prezzi né tempi di consegna**, da nessuna parte.
- **Niente cognomi** negli esempi, nemmeno inventati: "Operatore 1",
  "squadra A" (Greco, Colombo e Russo sono dipendenti veri di Vivai Cintoli).
- **Recapiti** (WhatsApp, email) solo nella Chiusura in fondo a ogni pagina e
  in `/contatti`: il piè di pagina non li ripete più.

## Cosa è cambiato nei tuoi file

**Configuratore** (`src/isole/configuratore/`, PR #40):

- Testi: "Parliamone" → "I tuoi recapiti"; "Raccontaci la tua attività" →
  "Due righe sulla tua attività"; pulsante "Fissiamo un colloquio" → "Fissa un
  primo incontro"; "colloquio" → "primo incontro" anche nelle frasi di
  conferma (`logica.ts`, test aggiornati).
- Il riepilogo sopra il pulsante usa le virgole al posto dei puntini
  (`riepilogo()` in `logica.ts`, test aggiornato).
- Colori per il fondo scuro in `Configuratore.module.css`: campi su fondo con
  bordo `--kroma-bordo`, scelta fatta chiara su scuro, focus giallo, errori
  in arancione. Il pulsante arancione al passaggio del mouse diventa chiaro,
  come nel resto del sito.
- **Non cambiano:** nomi dei campi, logica, invio con `fetch`, modulo
  nascosto. Netlify continua a riconoscere il modulo `richiesta`.
- `sito.colloquio` (in `src/dati/sito.ts`) ora è solo "di persona o in
  videochiamata": "come preferisci" lo aggiunge la tua frase in "Cosa succede
  dopo".

**Dati in comune** (`src/dati/`):

- `servizi.ts`: tolta la vecchia lista `servizi` (non la usava più nessuno);
  c'è `offerta` (gestionali, siti, manutenzione) con `breve` e `nota`, usata
  da "Cosa facciamo" in home e da `/servizi`. `lavori` (i lavori di tutti i
  giorni) è rimasto.
- `metodo.ts`: `passi` al voi (vedi sopra).
- `sito.ts`: nuovo campo `partitaIva` (null finché non c'è).
- `lavori.ts`: i tre lavori con cornice, schermata, fatti e testi della
  pagina del caso.

**La pagina `/servizi`** (`src/sezioni/PaginaServizi.astro`, tua): la tua
impaginazione è rimasta; cambiati i contenuti (i tre servizi di `offerta`) e
il titolo: "Automatizziamo il lavoro ripetitivo della vostra attività".
**`/web-app` non esiste più**: in `netlify.toml` un reindirizzamento 301 la
manda a `/gestionali` (anche `/come-lavoriamo` → `/`).

## La prova nuova in home: `src/isole/squadra-ufficio/`

Isola React nuova nella tua cartella `isole/`, fatta da Giovanni con
l'assistente (d'accordo con te). Sezione "Provalo: dal campo all'ufficio":

- il telefono di un operatore e il computer dell'ufficio, collegati: dal
  telefono si manda un rapporto (cantiere, lavoro, ore, materiale, nota) e lo
  si vede arrivare in ufficio, con ore per cantiere e materiali sommati;
  dall'ufficio si assegna un lavoro, che compare sul telefono;
- scelta del settore: verde e giardini, edilizia, pulizie, impianti;
- da telefono una vista alla volta, con un interruttore che segnala le
  novità ("1 nuovo");
- dentro le cornici l'app è chiara, con angoli tondi (nuovi token
  `--kroma-app-*`): si capisce che sono schermi;
- logica pura in `logica.ts` con 14 test, stessa impostazione delle tue isole
  (CSS Modules, container query).

Se vuoi cambiarla o prenderla in carico, dillo a Giovanni: è nella tua
cartella apposta.

## Il sito oggi (su `feat/nuova-veste`)

- **Home:** apertura (marchio a pixel + campo di pixel), Lavori (tre
  riquadri), Provalo (squadra e ufficio), Cosa facciamo (linguette, solo
  CSS), Come lavoriamo, Chiusura.
- **Pagine fatte:** `/lavori` e le tre pagine dei casi (un solo file,
  `src/pages/lavori/[id].astro`), `/servizi`, `/siti`, `/manutenzione`,
  `/chi-siamo`, `/contatti` (con il tuo configuratore).
- **Ancora provvisorie:** `/gestionali` (tua), `/privacy` (testo da
  scrivere prima del lancio).
- **Segnaposto `[DA SCRIVERE]` / `[DA DEFINIRE]`** dove mancano contenuti:
  foto e testi di `/chi-siamo`, schermate e testi dei lavori, durata della
  manutenzione, Partita IVA.
- Lighthouse da telefono, in locale: 100 in tutte e quattro le voci sulle
  pagine principali.

## Come si lavora adesso

- Ogni lavoro su un branch `feat/nuova-veste-<cosa>` che parte da
  `feat/nuova-veste`, con la PR **verso `feat/nuova-veste`**. Quel branch non
  chiede approvazioni; `main` sì (la tua).
- Prima di ogni PR: portare dentro l'ultima `feat/nuova-veste` e lanciare
  `npm run verifica`.
- **Netlify:** i crediti del piano gratuito sono finiti fino al 26/10/2026,
  per questo si pubblica una volta sola alla fine. Le anteprime delle PR
  verso `main` sono gratuite.

## Dopo lo scheletro: la rifinitura

Giovanni ha scelto di finire prima lo scheletro di tutte le sezioni e poi
rifinire tutto insieme. I punti già raccolti stanno in
`appunti/rifinitura.md`: alcuni riguardano te (lavagna dimostrativa,
`metodo.ts`).
