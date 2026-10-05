# CLAUDE.md — Sito di Kroma Web Lab

Memoria del progetto. La leggono Giovanni, Andrea e i loro assistenti
(Claude Code). Le scelte e i motivi stanno in `DECISIONI.md`: quando una
decisione cambia, si aggiornano tutti e due i file.

## Chi siamo e cosa vendiamo

Kroma Web Lab, Scicli (RG), Sicilia. Due sviluppatori: Giovanni e Andrea.
Clienti: attività della provincia di Ragusa, dove siamo; a distanza, in
tutta Italia (ristoranti,
agriturismi, negozi, artigiani, aziende agricole).

**Nuova veste "Officina" (decisa il 03/10/2026, lavori in corso su
`feat/nuova-veste`)**: il sito somigliava troppo a quello di un altro studio
di Scicli (epressio.it) nel tono e nella struttura. Si ridisegna tutto:
posizionamento, voce, grafica. Finché il branch non è unito, su `main` resta
il sito vecchio.

Cosa vendiamo, in ordine di come ci fa lavorare oggi:

1. **Web app e gestionali su misura** per chi lavora con una squadra:
   rapporti, programma, turni, ordini, magazzino. La prova è Vivai Cintoli.
2. **Siti web**, che fanno guadagnare prima.
3. **Manutenzione** con contratto: aggiornamenti, modifiche, assistenza.
   Entrata continua, da mettere in evidenza.

Obiettivo a lungo termine: gestionali "seri", anche installabili come i
software commerciali. **Sul sito non si promettono ancora**: si dice ciò che
è vero oggi (le web app si installano su telefono e computer come un'app e
funzionano anche senza rete).

NON siamo un'agenzia di marketing: niente social, niente campagne. Non
vendiamo "velocità" come argomento principale.

Cliente tipo: un titolare che non conosce il gergo tecnico e perde tempo
ogni giorno con quaderni, fogli Excel e prenotazioni su WhatsApp.

**Obiettivo unico del sito:** far sì che un titolare ci contatti
raccontandoci la sua attività. Ogni elemento che non porta lì va tolto.
Ogni pagina si chiude con un invito al contatto.

## Regole di scrittura (testi visibili)

- Italiano semplice, per chi non è del mestiere. Mai "stack", "deploy",
  "performance", "responsive".
- **Fatti al posto degli slogan**: numeri veri, cose che l'app fa davvero,
  i nostri nomi. Una frase concreta su Vivai Cintoli vale più di dieci frasi
  belle.
- **Voce nostra, non da agenzia**: niente "Raccontaci…", "Parliamone",
  "senza tecnicismi", "partiamo da una giornata reale", "da Scicli,
  lavoriamo ovunque" e simili (sono il tono del concorrente e dei siti
  generati). Pulsante principale: "Fissa un primo incontro".
- Frasi corte. Niente superlativi ("soluzioni innovative", "partner
  strategico", "eccellenza").
- Dati mancanti: segnaposto evidente `[DA SCRIVERE]` (`[DA DEFINIRE]` per
  ciò che va ancora deciso, es. la durata del contratto di manutenzione). Mai testo finto
  verosimile. Nel codice: `DA_SCRIVERE` da `src/dati/sito.ts`.

## Identità visiva

Tutti i valori stanno in `src/stili/tokens.css`. **Nel codice si usano
sempre le variabili `--kroma-*`, mai un colore, carattere o spaziatura
scritti a mano.** Uniche eccezioni: `scripts/genera-marchio.mjs` (i file
SVG/PNG non possono leggere variabili CSS) e `src/stili/tokens.css` stesso.

**Direzione "Officina"**: sito scuro, voi due in primo piano, il marchio a
pixel come protagonista dell'apertura. Nei componenti si usano i **ruoli**:

| Ruolo                 | Valore                    | Uso                                      |
| --------------------- | ------------------------- | ---------------------------------------- |
| `--kroma-fondo`       | #15181B (`--kroma-notte`) | fondo del sito                           |
| `--kroma-superficie`  | #1D2125                   | sezioni e riquadri un gradino più chiari |
| `--kroma-testo`       | #EDEBE7                   | testo principale (15:1)                  |
| `--kroma-testo-tenue` | #A3A9AE                   | testo secondario (7,5:1)                 |
| `--kroma-linea`       | #2F353A                   | separatori, solo grafica                 |
| `--kroma-bordo`       | #6B747C                   | bordi di campi e controlli (3,7:1)       |
| `--kroma-link`        | arancione #F25C05         | link e azioni (5,3:1)                    |
| `--kroma-focus`       | giallo #FFC53D            | contorno del focus da tastiera           |

- Colori del marchio invariati: arancione #F25C05, verde #12B3A8, giallo
  #FFC53D (solo marchio, cursore, attenzione: mai testo lungo). I token
  "su chiaro" (`--kroma-carta`, `--kroma-arancione-testo`…) restano per le
  parti chiare, come le ricostruzioni delle app dei clienti.
- Testo sopra l'arancione: **sempre nero** (bianco su arancione = 3,33).
- Caratteri: **Geist** per titoli e testo (`--kroma-font-testo`), titoli
  in peso 650 e spaziatura stretta, **senza punto finale** (05/10/2026: il
  punto in fondo ai titoli sa di testo generato). **JetBrains Mono**
  (`--kroma-font-mono`) **solo per dati veri** (orari, numeri), mai per
  etichette.
- **Nessuna trama di fondo**: fondo pieno. Le sezioni si distinguono con il
  passaggio fondo / superficie. Unica eccezione: il campo di pixel
  dell'apertura, invisibile da fermo (vedi Movimento).
- Spaziature: solo multipli di 8px → `--kroma-spazio-1` (8) …
  `--kroma-spazio-16` (128). Uniche eccezioni: le linee da 1–2px.
- Angoli vivi (`--kroma-raggio: 0`), tranne dentro le ricostruzioni delle
  app dei clienti.
- **Movimento (scelta C)**: transizioni morbide in risposta a un gesto
  (`--kroma-durata`, `--kroma-curva`), passaggio tra le pagine con le View
  Transitions del browser (CSS, niente JS), e **un solo momento animato**
  all'apertura della home: i pixel del marchio che si compongono. In più,
  dietro l'apertura, il **campo di pixel**: quadretti grandi come quelli del
  marchio che si accendono dove passa il mouse o il dito e si spengono piano
  (risponde a un gesto, non parte da solo; piccolo script con `<canvas>`).
  Sempre spento con `prefers-reduced-motion`.

### Divieti di design (importantissimo)

Il sito non deve sembrare fatto con un generatore. MAI:

- etichette in maiuscolo sopra i titoli ("I NOSTRI SERVIZI", "CHI SIAMO")
- piccole etichette in monospazio come decorazione
- frecce "→" aggiunte ai pulsanti e ai link (nelle parti nuove)
- dati in fila separati da puntini ("A · B · C")
- schede tutte uguali con icona + titolo + testo + pulsante
- gradienti, ombre diffuse, vetro smerigliato
- icone generiche al posto di contenuto vero
- Inter, Roboto, Arial, Poppins, Space Grotesk
- animazioni di comparsa a ogni scorrimento (l'unico momento animato è
  quello dell'apertura della home)
- testimonianze finte, loghi di clienti inventati, numeri gonfiati

Al loro posto: titoli grandi in Geist, testi corti e concreti, fatti veri,
le nostre facce, il marchio a pixel usato con misura.

**Se una richiesta contraddice questi divieti, segnalarlo invece di eseguire.**

### Scelte già fatte (dettagli in DECISIONI.md)

- **Apertura della home (Officina)**: marchio a pixel grande che si compone
  all'apertura, campo di pixel dietro, titolo "Software per chi lavora con
  una squadra", due
  pulsanti: "Fissa un primo incontro" → `/contatti`, "Vedi i lavori".
- **Menu**: Lavori, Servizi, Chi siamo, e il pulsante arancione "Fissa un
  incontro" (`/contatti`); da telefono pulsante a 9 quadretti che diventa
  una X.
- **Recapiti** (WhatsApp, email): grandi nella Chiusura, che sta in fondo a
  ogni pagina (anche le provvisorie), e in `/contatti`. Il piè di pagina non
  li ripete: marchio, collegamenti alle pagine, note legali (con la P.IVA).
- **Zona**: di persona a Scicli e dintorni, in videochiamata da tutta
  Italia (detto con parole nostre, non con la formula del concorrente).
  Mai "Val di Noto". Nei dati per Google: Scicli, provincia di Ragusa, Italia.
- **Ricostruzioni delle app dei clienti** (es. Vivai Cintoli in "I nostri lavori"):
  disegnate in HTML con dati di esempio, nei colori dell'app del cliente
  (token `--kroma-vivai-*`) e con i suoi angoli tondi. È l'unica eccezione
  ad angoli vivi e palette Kroma, e vale solo dentro la ricostruzione.
  Sempre marcate "ricostruzione con dati di esempio". Niente emoji.
  **Niente cognomi, nemmeno inventati** ("Operatore 1", "Squadra B"): quelli
  comuni rischiano di essere di dipendenti veri.

## Il marchio: griglia a pixel

Celle quadrate con passo 16 unità, disegnate come quadrati 14×14 (2 unità
di spazio). Coppie (colonna, riga), righe 0–4 dall'alto.

- **K** (colonne 0–4): (0,0)(0,1)(0,2)(0,3)(0,4)(1,0)(1,1)(1,2)(1,3)(1,4)(2,2)(3,1)(3,3)(4,0)(4,4)
- **W** (stesse forme spostate di +6 colonne): (0,0)(0,1)(0,2)(0,3)(1,4)(2,2)(2,3)(3,4)(4,0)(4,1)(4,2)(4,3)
- **L** (spostata di +12): (0,0)(0,1)(0,2)(0,3)(0,4)(1,4)(2,4)(3,4)
- **Cursore**: cella singola in colonna 17, riga 4.

Colori del marchio completo: K nel colore di base (bianco su scuro, nero su
chiaro) tranne (2,2) gialla; W arancione; L verde; cursore giallo. Su fondo
chiaro: arancione #D24F03 e verde #0E8F86.
Solo-K (icona, favicon): (3,1)(4,0) arancioni, (3,3)(4,4) verdi, (2,2) gialla.
Monocromatiche: tutte le celle dello stesso colore, cursore compreso.

Dimensioni: marchio completo 286×78, solo K 78×78. Area di rispetto: almeno
due celle libere su ogni lato. Sotto i 32px di altezza usare solo la K.

I file si generano con `npm run marchio` (`scripts/genera-marchio.mjs`) e
vanno committati. Si rilancia solo se cambia il marchio.

## Stack

- **Astro 7** con TypeScript (strict). Le pagine sono `.astro`: HTML e CSS
  statici, nessun JavaScript inviato al browser.
- **React 19 solo come isole interattive** (`client:visible`), solo per il
  gestionale dimostrativo e il configuratore.
- Fuori dalle isole, JavaScript solo **per comodità e mai indispensabile**:
  piccoli script senza librerie, e la pagina deve funzionare anche se non
  partono (es. il menu da telefono è un `<details>`; lo script aggiunge solo
  la chiusura con Esc e toccando fuori). Effetti al passaggio del mouse e al
  clic si fanno in CSS.
- **CSS scritto a mano** con i token. NIENTE Tailwind, librerie di
  componenti o framework CSS.
- **Netlify Forms** per i moduli; funzione serverless solo se serve.
- Output statico, nessun adattatore Netlify (finché non serve una funzione).
- Node 24 (`.nvmrc`, e `NODE_VERSION` in `netlify.toml`).
- Nessuna chiave nel repository: solo `.env` (ignorato da git), con
  `.env.example` come modello.

## Struttura delle cartelle

```
src/
  pages/        [Giovanni] un file = una pagina (index.astro → /)
  layout/       [Giovanni] Base.astro: <head>, SEO, JSON-LD, caratteri
  sezioni/      [Giovanni] blocchi .astro delle pagine
  componenti/   [Giovanni] piccoli pezzi .astro riutilizzabili
  stili/        [Giovanni] tokens.css (originale), base.css
  dati/         [condiviso] dati dell'attività in .ts
  isole/        [Andrea] componenti React
    gestionale-dimostrativo/
    configuratore/
public/         file copiati così come sono (favicon, marchio)
  brand/        SVG del marchio + kroma-tokens.css (COPIA generata, non modificare)
scripts/        genera-marchio.mjs, copia-token.mjs
```

Ciascuno lavora nelle sue cartelle. Se serve toccare la cartella dell'altro,
lo si dice nella pull request.

### Come le isole entrano nelle pagine

- Mentre sviluppa, Andrea prova le isole in una pagina sua,
  `src/pages/prova-isole.astro`, da **cancellare prima della pull request**
  (non deve finire su `main`).
- Per montare un'isola nella pagina vera, Andrea aggiunge **solo** l'import
  e la riga che la inserisce (es. `<Configuratore client:visible />`) nella
  pagina di Giovanni, e lo scrive nella descrizione della pull request.
  Il resto della pagina non si tocca.
- Eccezione: `src/isole/configuratore/ModuloRichiestaNascosto.astro` è di
  Andrea anche se è un `.astro`.
- Le isole non importano i token: le variabili `--kroma-*` sono già
  caricate dal layout.
- **Le isole non hanno cornice** (larghezza massima, margini, spazio
  sopra e sotto): la dà la sezione di Giovanni che le contiene, come
  `sezioni/ProvaGestionale.astro` con lo `<slot />`. L'isola misura solo il
  proprio spazio (`container-type`) per decidere come disporsi.

## Mappa del sito

```
/                        Home (Officina): apertura, lavori (riquadri),
                         provalo (gestionale dimostrativo), cosa facciamo
                         (linguette), come lavoriamo, chiusura
/lavori                  Elenco lavori, e una pagina per ogni lavoro
/servizi                 Panoramica dei servizi
/gestionali              Gestionali e web app su misura (assorbe /web-app)
/siti                    Siti web
/manutenzione            NUOVA: cosa comprende il contratto
/chi-siamo               Giovanni e Andrea, foto vere e storia
/contatti                Configuratore (Andrea) + contatti diretti
/privacy                 Informativa privacy (DA SCRIVERE prima del lancio)
```

## Isola 1 — Gestionale dimostrativo (Andrea)

Sta in home. Lavagna di prenotazioni funzionante con dati finti.

- In cima si sceglie il tipo di attività: ristorante, parrucchiere, centro
  estetico, agriturismo, studio medico, studio professionale. La scelta
  cambia le etichette e i dati di esempio:

  | Attività             | Chi      | Quanti  | Dove / con chi | Cosa         |
  | -------------------- | -------- | ------- | -------------- | ------------ |
  | Ristorante           | cliente  | coperti | tavolo         | —            |
  | Parrucchiere         | cliente  | —       | postazione     | servizio     |
  | Centro estetico      | cliente  | —       | estetista      | trattamento  |
  | Agriturismo          | ospite   | persone | camera         | notti        |
  | Studio medico        | paziente | —       | —              | visita       |
  | Studio professionale | cliente  | —       | —              | appuntamento |

- Si può: aggiungere una prenotazione, spostarla di stato (richiesta →
  confermata → completata), eliminarla, filtrare per giorno.
- Tutto in memoria: nessun database, nessun salvataggio.
- Deve funzionare bene da telefono.
- Accanto, una riga che spiega in italiano semplice cosa sta succedendo.
- Sobria: deve convincere, non stupire.
- **Dati di esempio**: cognomi comuni e dati plausibili ("20:30 · Bianchi ·
  4 coperti · Tavolo 7"), con la scritta "Dati di esempio" sempre visibile
  sopra la lavagna. È l'unica eccezione a "mai testo finto verosimile":
  quella regola vale per i dati mancanti del sito (email, telefono,
  indirizzo), che restano `[DA SCRIVERE]`.

## Isola 2 — Configuratore (Andrea)

Sta in `/contatti`. Tre o quattro domande a scelta multipla: che attività
hai, di cosa hai bisogno, hai già un sito, quanto tempo perdi oggi in quel
lavoro. Alla fine: **nessun
prezzo né tempo**, ma un riepilogo delle risposte e l'invito a un colloquio,
con il modulo di richiesta già compilato.

- "Di cosa hai bisogno?": Sito web, Gestionale, Web App, Ancora non lo so.
  Parole proprie del configuratore, diverse dal selettore "Cosa ti serve?"
  della home. La domanda sul tempo perso compare per tutte le risposte
  tranne Sito web.
- **Il sito non mostra prezzi né tempi di consegna**, né qui né altrove:
  preferiamo parlarne in un colloquio.
- Tutte le domande in una pagina, una sotto l'altra (non una per
  schermata), poi "I tuoi recapiti" e una riga di riepilogo (risposte
  separate da virgole) sopra il pulsante di invio.
- Sopra il pulsante "Fissa un primo incontro": "Cosa succede dopo" in tre
  passi (tempo di risposta e modalità dell'incontro da `src/dati/sito.ts`:
  `sito.tempoRisposta`, `sito.colloquio`) e
  "Ti rispondiamo noi: Giovanni e Andrea."
- **Tu nel modulo, voi intorno** (04/10/2026): il configuratore dà del tu
  (lo compila una persona sola); il resto di `/contatti` e del sito, del
  voi. Per questo `sito.colloquio` non contiene "come preferisci": il tu
  o il voi lo aggiunge la frase che lo usa.

### Moduli e Netlify Forms

Netlify riconosce i moduli leggendo l'HTML statico durante la pubblicazione:
un modulo disegnato solo da React non lo vede. Quindi:

- **Un solo modulo, `richiesta`**: niente modulo `contatto` separato
  (decisione del 28/09/2026). Accanto al configuratore, in `/contatti`, solo
  i contatti diretti (WhatsApp, email).
- **Modulo `richiesta`** (Andrea): vive nel configuratore React. Accanto
  serve una **copia nascosta in HTML** con lo stesso nome e gli stessi campi,
  in `src/isole/configuratore/ModuloRichiestaNascosto.astro`, inclusa nella
  pagina `/contatti`. Il componente React invia con `fetch` a `/`, in formato
  `application/x-www-form-urlencoded`, con il campo `form-name=richiesta`.
- **I campi dei due lati devono essere identici:** `attivita`, `servizio`,
  `sito_attuale`, `tempo_perso` (vuoto se il servizio è un sito), `nome`,
  `telefono`, `email`, `come_sentirci`, `messaggio`. Obbligatori solo
  `nome` e un recapito; le quattro domande a scelta sono facoltative.
  `come_sentirci` (Telefonata, WhatsApp, Email, Di persona) decide quale
  recapito serve: Telefonata o WhatsApp → `telefono`, Email → `email`;
  nessuna scelta o Di persona → almeno uno dei due. `messaggio` è
  facoltativo.
- Antispam: campo esca (`netlify-honeypot`).

## Lavori mostrati

- **Vivai Cintoli**: caso vero, in produzione. Abbiamo il permesso del
  cliente **a patto che non si vedano dati sensibili dell'azienda**:
  schermate solo con dati finti o oscurati (clienti, prezzi, fatturato,
  fornitori, quantità).
- **Casale Allibrio**: sito di un agriturismo, rifatto da zero (nessun
  sistema di prenotazione avanzato).
- **Estrò Atelier**: sito di un negozio di abiti da sposa.
- Tutti e tre con il nome vero: abbiamo il consenso. Casale Allibrio ed
  Estrò Atelier vanno online **insieme al nostro sito**: fino ad allora i
  loro indirizzi restano `[DA SCRIVERE]`.
- **Loghi dei clienti** al posto dei nomi, su fondo trasparente, in
  `src/assets/lavori/` (Astro li ottimizza). Il nome resta nel testo
  alternativo. Estrò Atelier: logo bianco su nero convertito in nero su
  trasparente (stesso logo, colori invertiti) per stare su carta. Vivai
  Cintoli: dalla versione bianca su trasparente dell'app. Con la veste
  scura tutti e tre i loghi sono **bianchi** su trasparente.
- **Riquadri dei lavori** (`componenti/RiquadroLavoro.astro`, home e
  `/lavori`): schermata nella sua cornice (telefono per le app, browser con
  l'indirizzo vero per i siti), logo, tipo, descrizione, fatti veri,
  pulsante "Vedi il lavoro". Due disposizioni, larga e stretta, perché non
  sembrino tutti uguali. Finché le schermate non ci sono: segnaposto
  `[DA SCRIVERE]` dentro la cornice (`schermata: null` in
  `src/dati/lavori.ts`).

## Dati condivisi di contatto

In `src/dati/sito.ts`, usati da chiusura, `/contatti` e
configuratore: email `kromaweblab@gmail.com`; WhatsApp Giovanni
348 283 9911 (principale, nei pulsanti) e Andrea 366 936 7721
(`numeriWhatsapp`); ricontattiamo entro 24 ore (`sito.tempoRisposta`);
primo incontro di persona o in videochiamata, sceglie il cliente
(`sito.colloquio`); informativa privacy in `sito.privacy`.

## Prima del lancio

- [ ] **Informativa privacy** in `/privacy`: la scrivono Giovanni e Andrea
      partendo da un modello (es. Garante). Senza, il modulo non si pubblica.
      Titolare del trattamento: dipende dalla forma fiscale (voce sotto).
- [ ] **Forma fiscale, col commercialista.** La prestazione occasionale non
      regge per un'agenzia con sito pubblico e clienti continuativi: serve
      quasi certamente la Partita IVA (probabilmente forfettaria). Domande:
  1. Con il codice ATECO per siti e software andiamo in **Gestione Separata
     INPS** (contributi solo su quanto si incassa, nessun minimo) o in una
     gestione con **contributi fissi** anche senza clienti?
  2. **Una Partita IVA sola** all'inizio, **due**, o **una società**?
  3. Quanto costa **il commercialista** all'anno, e **da quando** serve la
     Partita IVA rispetto al lancio del sito?
- [ ] Dominio `kromaweblab.it`.
- [ ] Descrizione per Google della home (`[DA SCRIVERE]`).
- [ ] Indirizzi dei siti di Casale Allibrio ed Estrò Atelier.
- [x] Lighthouse 95+ su mobile, misurato sul sito pubblicato (29/09/2026,
      mediana di 3, `npx lighthouse@13.5.0 <url>`, telefono simulato):
      home 98 · 100 · 100 · 100, `/contatti` 97 · 100 · 100 · 100
      (prestazioni · accessibilità · buone pratiche · SEO).
- [ ] Togliere dal pannello di Netlify la barra "Powered by Netlify"
      (`/.netlify/scripts/hud`, l'unico JavaScript fuori dalle isole): issue #20.
- [ ] Rimisurare Lighthouse sul dominio vero, quando c'è.
- [ ] Niente banner cookie finché non si aggiungono statistiche o servizi
      di terze parti: se si aggiungono, diventa obbligatorio.

## Qualità richiesta

- Mobile-first. Lighthouse 95+ su mobile.
- Accessibile: HTML semantico, `<button>` e `<a>` veri, etichette sui campi,
  contrasti rispettati (vedi tabella colori), navigabile da tastiera, focus
  sempre visibile.
- SEO locale: `title` e `description` per ogni pagina, JSON-LD
  `ProfessionalService` (Scicli, provincia di Ragusa) e Open Graph, già nel
  layout `Base.astro`. I dati mancanti (email, telefono, indirizzo) in
  `src/dati/sito.ts` restano `null`: nel JSON-LD si omettono.
- Dominio previsto: `kromaweblab.it` (non ancora acquistato). Nessuna P.IVA
  per ora: non inventarne una. Quando c'è va in `sito.partitaIva`: compare
  nel piè di pagina (oggi `[DA SCRIVERE]`) e nel JSON-LD (`vatID`).

## Convenzioni

- **Nomi in italiano**: file, componenti, variabili, classi CSS
  (`Configuratore.tsx`, `.salta-al-contenuto`).
- Componenti React e .astro in PascalCase; classi CSS in kebab-case.
- Gli stili di una sezione stanno nel suo `.astro` (`<style>` vale solo
  per quel file); in `base.css` solo le regole globali.
- Le isole React usano i **CSS Modules**: un file `NomeComponente.module.css`
  accanto al componente, importato con `import stili from '...'` e usato
  con `className={stili.nome}`. Le classi restano confinate al componente,
  come `<style>` nei `.astro`. Eccezione al kebab-case: nei CSS Modules le
  classi sono in camelCase (`.rigaVuota`), perché in JavaScript si leggono
  come `stili.rigaVuota`.
- Commenti in italiano, solo dove spiegano il perché.

## Come si lavora in due

- Giovanni: pagine `.astro`, contenuti, CSS, identità visiva.
- Andrea: le due isole React ed eventuale parte serverless.
- **Coordinamento su Discord:** chi inizia un lavoro lo scrive all'altro,
  soprattutto se tocca file condivisi o la pagina `/contatti` (moduli).
- `main` è protetto: si lavora su branch `feat/nome-sezione`, pull request,
  l'altro approva guardando anche l'anteprima Netlify. Nessun push diretto.
- **Nuova veste in corso**: tutto il lavoro di ridisegno va in PR verso il
  branch lungo **`feat/nuova-veste`**, non verso `main`. Alla fine una sola
  PR `feat/nuova-veste` → `main` (una sola pubblicazione Netlify: i crediti
  del piano gratuito sono 20 pubblicazioni al mese). Prima di ogni PR si
  porta dentro l'ultima versione di `feat/nuova-veste`.
- Prima di aprire una PR: `npm run verifica` (formattazione, lint, test, build).

### Pull request: ordine e conflitti

- **Ordine:** le PR si uniscono nell'ordine in cui sono state aperte.
  Se una PR parte dal branch di un'altra (PR "a catena"), nella descrizione
  si scrive "da unire dopo la #N" e si aspetta che quella sia unita.
- **Main aggiornato prima di ogni PR:** prima di aprire una PR, e di nuovo
  prima di chiedere l'approvazione, l'assistente porta nel branch l'ultima
  versione di main (`git fetch` e `git merge origin/main`), risolve i
  conflitti e rilancia `npm run verifica`.
- **Conflitti dopo l'apertura:** se nel frattempo viene unita un'altra PR e
  GitHub segnala un conflitto, lo risolve l'assistente di chi ha aperto la
  PR, con lo stesso procedimento. Chi approva non risolve conflitti.
- **Come si risolvono:** nei file di documentazione (`DECISIONI.md`,
  `CLAUDE.md`, `appunti/`) si tengono le parti di tutti e due, in ordine di
  data. Nel codice dell'altro non si sceglie da soli: si chiede.

## Istruzioni per l'assistente

- Prima domande su ciò che non è chiaro, poi un piano, poi fermarsi.
- Una sezione alla volta, fermandosi dopo ciascuna.
- Spiegare le scelte tecniche: Astro è nuovo per entrambi.
- **Commit e push li fa l'assistente**, sempre su un branch
  `feat/nome-sezione`, mai su `main`. Poi apre (o prepara) la pull request;
  l'approvazione la dà l'altro sviluppatore. Messaggi di commit in italiano.
- Quando ci sono più strade, presentarle con pro e contro invece di scegliere.
- Segnalare le richieste che contraddicono i divieti di design.
- Aggiornare `DECISIONI.md` quando si prende una decisione.
