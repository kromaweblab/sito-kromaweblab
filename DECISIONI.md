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

## 2026-09-27 — Trama di fondo: punti, 9%, passo 32px

**Scelta:** provata nella demo "Trama a pixel" tra celle, punti, reticolo e
celle sparse. Punti su tutto il sito, intensità 9%, passo 32px.
**Come:** `body::before` con il colore `--kroma-nero` e una maschera SVG che
dice solo dove stanno i punti: nessun colore scritto a mano.

## 2026-09-27 — Menu: barra da computer, pulsante a quadretti da telefono

**Scelta:** opzione C. Da telefono un `<details>` (funziona senza JS) con uno
script di comodità per Esc e tocco fuori; da computer (≥960px) barra con
tutte le voci, "Contatti" come pulsante arancione, linea che compare sotto la
voce al passaggio del mouse (CSS). Pagina attuale segnata in giallo.
**Regola cambiata:** fuori dalle isole è ammesso JS di sola comodità, mai
indispensabile.

## 2026-09-27 — Apertura: frase forte + "Cosa ti serve?"

**Scelta:** frase D, "Strumenti digitali cuciti sulla tua attività.", una
riga che nomina tutti e tre i servizi, poi il selettore "Cosa ti serve?" con
un pannello per servizio (gestionali selezionato all'apertura).
**Perché:** chi cerca solo un sito deve capire subito che lo facciamo, senza
togliere il primo piano ai gestionali. Scartato lo slider automatico:
movimento decorativo, e quasi nessuno vede oltre la prima slide.

## 2026-09-27 — Pagina /servizi

**Scelta:** una pagina che spiega i tre servizi, ognuno col link alla sua
pagina dedicata (`/gestionali`, `/web-app`, `/siti`).

## 2026-09-27 — Lavori: tre progetti veri, con i nomi

Vivai Cintoli (gestionale in uso da un mese), Casale Allibrio (sito
agriturismo rifatto da zero), Estrò Atelier (sito abiti da sposa). Consenso
per tutti; per Vivai Cintoli niente dati sensibili (nomi dei dipendenti,
prodotti dei trattamenti, dati reali del vivaio). Il sito si pubblica insieme
ai due siti in sviluppo. Sostituisce "due progetti in corso".

## 2026-09-27 — Pagine segnaposto per le voci del menu

**Perché:** niente link rotti nelle anteprime. Si sostituiscono man mano con
le pagine vere.

## 2026-09-27 — Da decidere più avanti

Come far provare il gestionale di Vivai Cintoli, che ha accesso con utente e
PIN e ruoli diversi (Ufficio/Admin, Operatore).

## 2026-09-27 — Componente Pulsante e dati dei servizi in un solo file

**Scelta:** `src/componenti/Pulsante.astro` (sempre un link; primario
arancione, secondario col bordo) con gli effetti al passaggio del mouse e al
clic in CSS. I testi dei tre servizi stanno in `src/dati/servizi.ts` e li
usano apertura, "Cosa facciamo" e `/servizi`.
**Perché:** stesso aspetto ovunque e testi da correggere in un posto solo.

## 2026-09-27 — "Il problema": una giornata tipo, senza nomi

**Scelta:** ibrido tra elenco e giornata: ogni riga ha ora, strumento e cosa
succede. Frasi vere (vivaio, agriturismo, vecchio sito), orari indicativi
(il sottotitolo lo dice). Chiude con il link "Raccontaci la tua →" verso
`/contatti`, ben visibile come link.
**Perché senza nomi:** il "prima" di un cliente, da solo, può metterlo in
imbarazzo. I nomi stanno nei lavori, insieme al "dopo".
I fatti raccolti per i casi completi sono in `appunti/lavori.md`.
