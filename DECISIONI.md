# Decisioni

Registro delle scelte di progetto: cosa, quando, perché. Le più recenti in
fondo. Se una decisione viene cambiata, non si cancella: si aggiunge una
nuova voce che la sostituisce.

---

## 2026-09-27 — Home riassuntiva + pagine di approfondimento

**Scelta:** una home che riassume tutto e pagine separate per servizi,
lavori, metodo, chi siamo, contatti (mappa in `CLAUDE.md`). Il brief
iniziale prevedeva una pagina sola.
**Perché:** una pagina per servizio può comparire nelle ricerche locali
specifiche ("gestionale prenotazioni ristorante Ragusa"); il caso Vivai
Cintoli ha lo spazio che merita; la home resta corta e subito chiara.
**Costo accettato:** più testi da scrivere; serve un menu. Per non perdere
l'obiettivo unico, ogni pagina si chiude con l'invito al contatto.

## 2026-09-27 — Gestionale dimostrativo in home, configuratore in /contatti

**Perché:** il gestionale è la prova più forte e deve vederlo subito chi
arriva; il configuratore serve a chi ha già deciso di scriverci.

## 2026-09-27 — Varianti scure per il testo su fondo chiaro

**Scelta:** aggiunte `--kroma-arancione-testo` #B84503 (4,84:1 su carta) e
`--kroma-verde-testo` #0C776F (4,85:1), stessa tinta, più scure.
#D24F03 e #0E8F86 restano per titoli grandi e grafica.
**Perché:** #D24F03 (3,87:1) e #0E8F86 (3,56:1) su carta non raggiungono il
4,5:1 richiesto dalle WCAG per il testo normale.

## 2026-09-27 — Testo nero sui pulsanti arancioni

**Perché:** bianco su #F25C05 = 3,33:1 (non basta); nero = 5,72:1.

## 2026-09-27 — Cella gialla del marchio su fondo chiaro: da valutare

**Stato:** aperta. Giallo #FFC53D su carta = 1,41:1, quasi invisibile. Per
ora i file seguono il brief (giallo pieno). Nota: i file del marchio in
`loghi-kroma/` sul Desktop di Giovanni usano un giallo scuro (#B07800) nella
versione su chiaro. Da decidere guardandoli.

## 2026-09-27 — Token: originale in src/, copia in public/brand/

**Scelta:** `src/stili/tokens.css` è l'originale, importato dal layout.
`scripts/copia-token.mjs` lo copia in `public/brand/kroma-tokens.css` prima
di ogni `dev` e `build`.
**Perché:** i file in `public/` Astro li copia senza elaborarli (una
richiesta in più per il browser). Importato da `src/`, il CSS viene unito e
compresso con il resto. La copia in `public/brand/` resta come materiale del
marchio da condividere.

## 2026-09-27 — Caratteri self-hosted con l'API Fonts di Astro

**Scelta:** pacchetti npm `@fontsource-variable/space-grotesk` e
`@fontsource-variable/jetbrains-mono` (versioni fisse nel lockfile), letti
dal provider `local` di Astro. Solo il sottoinsieme latino (copre
l'italiano). Space Grotesk precaricato, JetBrains Mono no.
**Perché:** niente richieste a Google (privacy: in UE ci sono state
sanzioni per Google Fonts) e build che funziona senza internet. Astro genera
un carattere di riserva con le stesse misure (basato su Arial locale, solo
per le metriche: non è mai visibile a lungo) così il testo non salta durante
il caricamento.
**Nota tecnica:** il provider `npm` di Astro scartava i file "variable"
dei pacchetti Fontsource; il provider `local` funziona.

## 2026-09-27 — Node 24 LTS, installato con nvm

**Perché:** Astro 7 richiede Node ≥ 22.12; Node 20 è fuori supporto da
aprile 2026. La 24 è l'LTS attiva con supporto più lungo. Fissata in
`.nvmrc` e in `netlify.toml`.

## 2026-09-27 — Output statico, niente adattatore Netlify

**Perché:** finché non serve una funzione serverless, Netlify pubblica la
cartella `dist/` così com'è. Si aggiunge `@astrojs/netlify` solo quando serve.

## 2026-09-27 — Impostazioni di Netlify in netlify.toml

**Perché:** scritte nel repository, passano dalle pull request e non
dipendono da cosa c'è nel pannello. Nel pannello resta solo da attivare la
rilevazione dei moduli.

## 2026-09-27 — Moduli: configuratore con modulo proprio + copia nascosta

**Scelta:** opzione B. Il configuratore ha il suo modulo `richiesta`; una
copia nascosta in HTML (stessi campi) permette a Netlify di riconoscerlo.
Il modulo `contatto` resta statico in `.astro`.
**Perché:** il componente di Andrea resta autonomo.
**Costo accettato:** i campi vanno tenuti uguali in due posti; la copia
nascosta sta nella cartella del configuratore, accanto al componente.

## 2026-09-27 — ESLint 10 con override per jsx-a11y

**Scelta:** in `package.json`, `overrides` fa accettare ESLint 10 a
`eslint-plugin-jsx-a11y`.
**Perché:** `eslint-plugin-astro` 3 richiede ESLint 10, mentre
`eslint-plugin-jsx-a11y` 6.10 dichiara compatibilità solo fino alla 9 (ma
funziona). Quando esce una versione di jsx-a11y che dichiara ESLint 10, si
toglie l'override.

## 2026-09-27 — Niente Stylelint, niente CODEOWNERS

**Perché:** scelta di Giovanni: per ora bastano Prettier, ESLint e la
revisione reciproca.

## 2026-09-27 — Codice in italiano

**Scelta:** nomi di file, componenti, variabili e classi CSS in italiano.

## 2026-09-27 — Favicon: K su quadrato nero, disegnata sui pixel

**Scelta:** favicon con la K a colori su quadrato #101010, uguale in ogni
tema. Per restare nitida a 16/32/48px ogni misura usa celle a numero intero
di pixel (es. a 32px: celle 4px, spazio 1px), quindi il rapporto
cella/spazio è leggermente diverso dal marchio (4:1 invece di 14:2).
**Perché:** un quadrato scuro fisso è leggibile su qualunque barra del
browser; Safari ignora i favicon che cambiano col tema.

## 2026-09-27 — Immagine Open Graph provvisoria

**Scelta:** `public/og-immagine.png` (1200×630): marchio su nero, senza
testo. Da rifare quando ci sono i testi definitivi.

## 2026-09-27 — Dati non ancora disponibili

Dominio `kromaweblab.it` verificato disponibile, non ancora acquistato: è
già impostato come `site`. Email, telefono, indirizzo: `[DA SCRIVERE]`.
Nessuna P.IVA per ora (prestazione occasionale): da verificare col
commercialista prima della pubblicazione.

## 2026-09-27 — Commit e push li fa l'assistente

**Scelta:** Giovanni ha chiesto che commit e push li faccia Claude Code (il
brief iniziale diceva il contrario). Sempre su branch e con pull request:
`main` resta protetto e l'approvazione resta umana.

## 2026-09-27 — Pagina di prova per le isole e montaggio nelle pagine

**Scelta:** Andrea sviluppa le isole in `src/pages/prova-isole.astro` (da
cancellare prima della PR) e, per montarle nelle pagine di Giovanni,
aggiunge solo l'import e la riga dell'isola, segnalandolo nella PR.
**Perché:** i due lavori possono andare avanti in parallelo anche quando le
pagine non sono ancora pronte, senza pestarsi i piedi.

## 2026-09-27 — CSS delle isole React: CSS Modules

**Scelta:** ogni isola ha il suo `NomeComponente.module.css`, con le classi
in camelCase (eccezione al kebab-case delle convenzioni).
**Perché:** in React Astro non confina gli stili come fa `<style>` nei
`.astro`; i CSS Modules sì (Vite li supporta senza configurazione), quindi
le classi delle isole e quelle delle sezioni non possono mescolarsi.
**Alternativa scartata:** un `.css` normale con prefisso (`.gestionale-…`):
più semplice da scrivere, ma globale, e protetto solo dalla disciplina.
**Costo accettato:** `className={stili.nome}` al posto della stringa, e
nessun controllo sui nomi: una classe scritta male dà `undefined` senza
errori (i tipi di Astro accettano qualunque nome).

## 2026-09-27 — Dati di esempio del gestionale dimostrativo

**Scelta:** cognomi comuni e dati plausibili, con la scritta "Dati di
esempio" sempre visibile sopra la lavagna.
**Perché:** il titolare deve riconoscere il suo quaderno; con "Cliente A"
la lavagna sembra finta e convince meno. La scritta fissa evita che qualcuno
li scambi per clienti veri di Kroma Web Lab.
**Alternative scartate:** segnaposto ("Cliente A"), solo nomi di battesimo.
**Nota:** "mai testo finto verosimile" resta valido per i dati mancanti del
sito; questa è un'eccezione solo per la demo.

## 2026-09-27 — Giorni del gestionale: relativi, con la data vera nel browser

**Scelta:** i dati di esempio usano giorni relativi (0, 1, 2) e il filtro
mostra `Oggi · Domani · Dopodomani`. Dopo il caricamento, nel browser, si
aggiunge la data vera accanto a ciascun giorno (`Oggi · dom 27/9`), in uno
spazio già riservato.
**Perché:** l'isola viene disegnata due volte, alla build (in Node) e nel
browser. Una data calcolata con `new Date()` darebbe due risultati diversi
e un errore di idratazione. I giorni relativi sono uguali ovunque; la data
vera, aggiunta in un `useEffect`, rende la lavagna credibile.
**Alternative scartate:** solo giorni relativi (meno credibile); date fisse
nei dati (dopo qualche settimana la demo sembra abbandonata).
