# CLAUDE.md — Sito di Kroma Web Lab

Memoria del progetto. La leggono Giovanni, Andrea e i loro assistenti
(Claude Code). Le scelte e i motivi stanno in `DECISIONI.md`: quando una
decisione cambia, si aggiornano tutti e due i file.

## Chi siamo e cosa vendiamo

Kroma Web Lab, Scicli (RG), Sicilia. Due sviluppatori: Giovanni e Andrea.
Clienti: attività della provincia di Ragusa e del Val di Noto (ristoranti,
agriturismi, negozi, artigiani, aziende agricole).

In ordine di importanza:

1. **Mini gestionali** che risolvono un ciclo di lavoro reale: prenotazioni,
   ordini, magazzino, turni. È ciò per cui vogliamo essere riconosciuti.
2. **Web app su misura**, costruite sul modo in cui quell'attività lavora già.
3. **Siti web** per chi sul web non esiste ancora.

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
- Problemi concreti ("prendi ancora le prenotazioni su un quaderno?"),
  non tecnologie.
- Frasi corte. Niente superlativi ("soluzioni innovative", "partner
  strategico", "eccellenza").
- Dati mancanti: segnaposto evidente `[DA SCRIVERE]` (o `[DA DEFINIRE]`
  per i prezzi). Mai testo finto verosimile. Nel codice: `DA_SCRIVERE` da
  `src/dati/sito.ts`.

## Identità visiva

Tutti i valori stanno in `src/stili/tokens.css`. **Nel codice si usano
sempre le variabili `--kroma-*`, mai un colore, carattere o spaziatura
scritti a mano.** Uniche eccezioni: `scripts/genera-marchio.mjs` (i file
SVG/PNG non possono leggere variabili CSS) e `src/stili/tokens.css` stesso.

| Token                     | Valore  | Uso                                                |
| ------------------------- | ------- | -------------------------------------------------- |
| `--kroma-nero`            | #101010 | testo, fondi scuri                                 |
| `--kroma-carta`           | #F5F2EE | fondo principale                                   |
| `--kroma-arancione`       | #F25C05 | primario su fondo scuro                            |
| `--kroma-verde`           | #12B3A8 | secondario su fondo scuro                          |
| `--kroma-giallo`          | #FFC53D | SOLO evidenziazioni e pixel del marchio, MAI testo |
| `--kroma-arancione-scuro` | #D24F03 | su chiaro: solo titoli grandi e grafica (3,87)     |
| `--kroma-verde-scuro`     | #0E8F86 | su chiaro: solo titoli grandi e grafica (3,56)     |
| `--kroma-arancione-testo` | #B84503 | su chiaro: testo piccolo e link (4,84)             |
| `--kroma-verde-testo`     | #0C776F | su chiaro: testo piccolo e link (4,85)             |
| `--kroma-testo-tenue`     | #5E5A55 | testo secondario su carta (6,13)                   |

- "Titolo grande" = almeno 24px, o 19px in grassetto (soglia WCAG).
- Testo sopra l'arancione: **sempre nero** (bianco su arancione = 3,33,
  non basta).
- Caratteri: **Space Grotesk** (titoli e testo) → `--kroma-font-testo`;
  **JetBrains Mono** (dati veri: orari, date, numeri, dettagli tecnici) →
  `--kroma-font-mono`. Self-hosted tramite l'API Fonts di Astro.
- Spaziature: solo multipli di 8px → `--kroma-spazio-1` (8) …
  `--kroma-spazio-16` (128). Uniche eccezioni: le linee da 1–2px.
- **Angoli vivi ovunque**: `border-radius: 0` (`--kroma-raggio`).

### Divieti di design (importantissimo)

Il sito non deve sembrare fatto con un generatore. MAI:

- etichette in maiuscolo sopra i titoli ("I NOSTRI SERVIZI", "CHI SIAMO")
- schede arrotondate con icona + titolo + testo + pulsante
- gradienti, ombre diffuse, vetro smerigliato
- icone generiche al posto di contenuto vero
- Inter, Roboto, Arial, Poppins
- animazioni di comparsa a ogni scorrimento
- testimonianze finte, loghi di clienti inventati, numeri gonfiati

Al loro posto:

- impianto editoriale: linee sottili come separatori, griglia asimmetrica,
  titoli molto grandi, testi corti
- monospazio per dati veri, non come decoro
- la griglia a pixel del logo come trama di fondo leggerissima; quadretti
  gialli per marcare le cose importanti
- movimento solo dove l'utente interagisce, mai decorativo

**Se una richiesta contraddice questi divieti, segnalarlo invece di eseguire.**

### Scelte già fatte (dettagli in DECISIONI.md)

- **Trama di fondo**: punti su tutto il sito, intensità 9%, passo 32px
  (`--kroma-trama-*`, in `base.css`). Le sezioni a fondo pieno la coprono.
- **Quadretti gialli** per marcare le cose importanti (sì).
- **Menu**: da computer barra completa con tutte le voci e "Contatti" come
  pulsante arancione; da telefono pulsante a 9 quadretti che diventa una X.
- **Apertura della home**: frase forte ("Strumenti digitali cuciti sulla tua
  attività.") + riga con i tre servizi e la zona + domanda "Cosa ti serve?"
  con tre scelte (radio + CSS `:has()`, niente JS), un pannello per scelta.
  All'apertura della pagina è selezionato "gestionali". Pulsanti: "Raccontaci
  la tua attività" → `/contatti`, secondo pulsante → pagina del servizio,
  link "Tutti i servizi" → `/servizi`. Niente slider automatici.
- **WhatsApp**: nella sezione contatti in fondo alla home e nel piè di pagina.
- **Ricostruzioni delle app dei clienti** (es. Vivai Cintoli in "Un lavoro"):
  disegnate in HTML con dati di esempio, nei colori dell'app del cliente
  (token `--kroma-vivai-*`) e con i suoi angoli tondi. È l'unica eccezione
  ad angoli vivi e palette Kroma, e vale solo dentro la ricostruzione.
  Sempre marcate "ricostruzione con dati di esempio". Niente emoji.

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

## Mappa del sito

```
/                        Home: apertura, il problema, gestionale dimostrativo,
                         cosa facciamo, un lavoro, contatto
/servizi                 I tre servizi spiegati, ognuno porta alla sua pagina
/gestionali              Mini gestionali (servizio principale)
/web-app                 Web app su misura
/siti                    Siti web
/lavori                  Elenco lavori
/lavori/vivai-cintoli    Caso completo (e una pagina per ogni lavoro)
/come-lavoriamo          Dal primo incontro alla consegna
/chi-siamo               Giovanni e Andrea (foto vere, segnaposto per ora)
/contatti                Configuratore + modulo di contatto
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
  quella regola vale per i dati mancanti del sito (email, telefono, prezzi),
  che restano `[DA SCRIVERE]` / `[DA DEFINIRE]`.

## Isola 2 — Configuratore (Andrea)

Sta in `/contatti`. Tre o quattro domande a scelta multipla: che attività
hai, cosa ti serve (presenza sul web / gestionale / app su misura), hai già
un sito, quanto tempo perdi oggi in quel lavoro. Alla fine: fascia di prezzo
indicativa (`[DA DEFINIRE]`) e tempo di massima, con il modulo di richiesta
già compilato con le risposte.

### Moduli e Netlify Forms

Netlify riconosce i moduli leggendo l'HTML statico durante la pubblicazione:
un modulo disegnato solo da React non lo vede. Quindi:

- **Modulo `contatto`** (Giovanni): statico, in `.astro`, con
  `data-netlify="true"`.
- **Modulo `richiesta`** (Andrea): vive nel configuratore React. Accanto
  serve una **copia nascosta in HTML** con lo stesso nome e gli stessi campi,
  in `src/isole/configuratore/ModuloRichiestaNascosto.astro`, inclusa nella
  pagina `/contatti`. Il componente React invia con `fetch` a `/`, in formato
  `application/x-www-form-urlencoded`, con il campo `form-name=richiesta`.
- **I campi dei due lati devono essere identici.** Proposta iniziale (Andrea
  può cambiarla, aggiornando qui): `attivita`, `servizio`, `sito_attuale`,
  `tempo_perso`, `fascia_prezzo`, `tempo_stimato`, `nome`, `contatto`,
  `messaggio`.
- Antispam: campo esca (`netlify-honeypot`) su entrambi i moduli.

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
  per ora: non inventarne una.

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
- `main` è protetto: si lavora su branch `feat/nome-sezione`, pull request,
  l'altro approva guardando anche l'anteprima Netlify. Nessun push diretto.
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
