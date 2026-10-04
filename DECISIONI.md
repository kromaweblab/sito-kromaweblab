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

## 2026-09-27 — Stati delle prenotazioni: parola + quadretto del marchio

**Scelta:** lo stato è sempre scritto a parole; accanto, un quadretto:
richiesta = giallo (`--kroma-giallo`) con bordo nero sottile, confermata =
verde (`--kroma-verde-scuro`), completata = quadretto vuoto e riga in
`--kroma-testo-tenue`.
**Perché:** le richieste sono le cose da fare, e i quadretti gialli servono
proprio a marcare le cose importanti; le completate si "spengono". Il
bordo serve perché il giallo su carta (1,41:1) quasi non si vede.
L'informazione sta comunque nella parola, non solo nel colore.
**Alternativa scartata:** solo la parola, senza colore (più sobria, ma le
richieste non si trovano a colpo d'occhio).

## 2026-09-27 — Vitest per la logica pura delle isole

**Scelta:** la logica delle isole sta in file di sole funzioni pure (per
es. `logica.ts`), controllati da test Vitest (`logica.test.ts`) accanto al
file. Niente test dell'interfaccia. `npm run test` è dentro `verifica`.
**Perché:** Vitest usa Vite come Astro, quindi non serve configurazione; i
test proteggono gli errori silenziosi (stati, filtri, calcolo delle fasce
del configuratore) e girano in meno di un secondo. Per due isole piccole,
i test dell'interfaccia costerebbero più di quanto rendono.
**Nota:** tocca `package.json`, file condiviso: segnalato nella PR.

## 2026-09-27 — Gestionale: sei attività e le loro etichette

**Scelta:** "studio" diventa due voci, studio medico (paziente, visita) e
studio professionale (commercialista, avvocato: cliente, appuntamento),
senza colonna "dove". Nel centro estetico si prenota "con" l'estetista, non
in una cabina. Tabella completa in `CLAUDE.md`.
**Perché:** medico e commercialista usano parole diverse, e il titolare
deve riconoscere le sue; una voce sola con una sottoscelta aggiungeva un
passaggio. "Cabina" suonava poco naturale: nei centri estetici si prenota
con una persona.

## 2026-09-27 — Stato "completata": quadretto grigio pieno

**Sostituisce** la parte "completata = quadretto vuoto" della voce sugli
stati delle prenotazioni.
**Scelta:** quadretto pieno in `--kroma-testo-tenue`, lo stesso grigio
della riga completata.
**Perché:** un quadretto vuoto si legge come una casella non ancora
spuntata, cioè "da fare": il contrario di "completata". Giallo → verde →
grigio pieno si legge come da fare → a posto → chiuso. Il grigio è molto
più scuro del verde, quindi i due si distinguono anche per chiarezza, non
solo per tinta.

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

## 2026-09-27 — Pull request: ordine e main aggiornato

**Scelta:** le PR si uniscono nell'ordine di apertura; prima di aprirle e
prima di chiedere l'approvazione l'assistente unisce nel branch l'ultima
versione di main e risolve i conflitti. Dettagli in `CLAUDE.md`.
**Perché:** due PR aperte in parallelo avevano aggiunto voci in fondo a
`DECISIONI.md`: dopo il merge della prima, la seconda era in conflitto e non
si capiva perché il lavoro non comparisse su main.
**Alternativa scartata per ora:** un file per decisione (cartella
`decisioni/`). Si riprende se i conflitti si ripetono.

## 2026-09-27 — Home: "Cosa facciamo" dopo il gestionale dimostrativo

**Scelta:** ordine apertura → il problema → gestionale dimostrativo → cosa
facciamo → un lavoro → contatto. "Cosa facciamo" elenca i lavori di tutti i
giorni (prenotazioni, ordini, magazzino, turni, la squadra, farti trovare),
ognuno collegato al suo servizio, sotto il titolo "Non solo prenotazioni".
**Perché:** dopo la giornata tipo il titolare prova subito la lavagna, che
risponde al primo problema; poi vede che lo stesso vale per il resto del
suo lavoro. Così non si ripete l'apertura, che presenta già i tre servizi.
**Nota:** il gestionale sta dentro `ProvaGestionale.astro` (titolo e
introduzione di Giovanni, isola di Andrea nello slot): spostata la riga
dell'isola in `index.astro`.

## 2026-09-28 — "Un lavoro": Vivai Cintoli ricostruito, per ruolo

**Scelta:** Vivai Cintoli in evidenza, con una ricostruzione in HTML di
cosa vede ogni ruolo (selettore "Ufficio e admin" / "Operatore", ufficio
selezionato all'apertura; radio + `:has()`, niente JS). Casale Allibrio ed
Estrò Atelier sotto, in una riga ciascuno. Riga di dati veri: in uso da
settembre 2026, una ventina di operatori, 2 persone in ufficio, 3
amministratori.
**Stile:** fedele all'app (verde Vivai Cintoli, angoli tondi) tramite i
token `--kroma-vivai-*`: la ricostruzione è come una fotografia dell'app del
cliente. Eccezione limitata alla ricostruzione; niente emoji dell'app.
**Perché:** mostra il cuore del lavoro (campo e ufficio collegati, ognuno
vede solo ciò che gli serve) senza schermate con dati veri. Le schermate
vere con dati finti andranno nel caso completo.
**Dati di esempio:** niente cognomi, nemmeno inventati: "Operatore 1",
"Squadra B". Tre cognomi scelti a caso (Greco, Colombo, Russo) erano di
dipendenti veri.

## 2026-09-28 — "I nostri lavori": titolo di sezione e loghi dei clienti

**Scelta:** la sezione ha il titolo "I nostri lavori"; Vivai Cintoli,
Casale Allibrio ed Estrò Atelier sono mostrati con il loro logo, nei colori
originali, alla stessa altezza (80px Vivai, 64px gli altri). Il nome resta
nel testo alternativo.
**Perché:** senza titolo "Vivai Cintoli" sembrava il titolo della sezione;
i loghi veri sono una prova più forte dei nomi scritti.
**Nota:** il logo di Estrò Atelier esiste solo bianco su nero: ricavata la
versione nera su trasparente, ritagliata. Il logo di Vivai Cintoli c'è solo
in PNG (494×129): se arriva un SVG, va sostituito.

## 2026-09-28 — Logo di Vivai Cintoli in nero, righe dei lavori centrate

**Sostituisce** "colori originali" per Vivai Cintoli nella voce sui loghi.
**Scelta:** il logo a colori dell'app ha il fondo bianco; si usa la sua
versione bianca su trasparente (`logo-white.png`), colorata in
`--kroma-nero` e ritagliata. Nelle righe di Casale Allibrio ed Estrò Atelier
logo, descrizione e link sono centrati in verticale.

## 2026-09-28 — Le isole non hanno cornice

**Scelta:** le isole React non hanno larghezza massima né margini propri:
li dà la sezione `.astro` che le contiene (come `ProvaGestionale.astro`).
Tolto dal gestionale il contenitore aggiunto nella PR #11.
**Perché:** dopo la #12 il gestionale aveva due contenitori, quello della
sezione e il suo: in home rientrava di 32px rispetto al titolo e aveva il
doppio dello spazio sopra. Con la cornice nella sezione, nessuno tocca il
file dell'altro e l'isola si adatta a qualunque pagina.

## 2026-09-28 — Configuratore: scelte da servizi.ts, tempi da definire

**Scelta:** la domanda "Cosa ti serve?" del configuratore usa le scelte del
selettore in apertura, importate da `src/dati/servizi.ts`. Anche i tempi
indicativi, come le fasce di prezzo, restano `[DA DEFINIRE]`.
**Perché:** il visitatore trova la stessa domanda in home e in `/contatti`:
se le parole fossero diverse sembrerebbero due cose diverse. Importandole,
una modifica in `servizi.ts` vale per tutti e due. Per i tempi non ci sono
ancora numeri decisi, e un numero inventato sarebbe una promessa.

## 2026-09-28 — Configuratore: le attività tra cui scegliere

**Scelta:** otto voci a gruppi: Ristorante o bar, Agriturismo o B&B,
Negozio, Artigiano o laboratorio, Azienda agricola o vivaio, Parrucchiere o
centro estetico, Studio medico o professionale, Altro. Chi sceglie "Altro"
spiega nel campo messaggio del modulo, senza un campo in più.
**Perché:** coprono i clienti tipici scritti in `CLAUDE.md` (negozi,
artigiani, aziende agricole compresi), che le sei attività del gestionale
dimostrativo lasciavano fuori.
**Alternative scartate:** le sei del gestionale (mancano negozi, artigiani,
aziende agricole); testo libero (non è a scelta, e da telefono costa di più).

## 2026-09-28 — Configuratore: "Hai già un sito?"

**Scelta:** quattro risposte: No; Solo una pagina social o su Google Maps;
Sì, ma è da rifare; Sì, e va bene così. La domanda si fa sempre, qualunque
servizio sia stato scelto.
**Perché:** molte attività della zona hanno solo una pagina Facebook o una
scheda Google: con tre risposte avrebbero scritto "No" e l'informazione
sarebbe andata persa. Serve anche per i gestionali (es. collegare le
prenotazioni al sito). Chiedere cosa ha già il cliente non contraddice il
"niente social" di `CLAUDE.md`, che riguarda i servizi che vendiamo.

## 2026-09-28 — Configuratore: "Quanto tempo ci perdi ogni giorno?"

**Scelta:** risposte al giorno: Meno di mezz'ora; Da mezz'ora a un'ora; Più
di un'ora; Non saprei. Sotto la domanda: "A ricopiare, rispondere ai
messaggi, ricontrollare." La domanda compare solo per gestionali e web app:
chi sceglie "Farmi trovare su internet" risponde a tre domande.
**Perché:** il titolare ragiona a giornate ("ogni sera mezz'ora sul
quaderno"); "Non saprei" evita numeri a caso. Per chi vuole un sito il
problema è non essere trovato, non il tempo perso.
**Alternativa scartata:** tempo alla settimana (richiede un conto a mente).

## 2026-09-28 — Niente prezzi sul sito: colloquio

**Sostituisce** la fascia di prezzo alla fine del configuratore (brief
iniziale e voce del 28/09 "scelte da servizi.ts, tempi da definire").
**Scelta:** il sito non mostra prezzi, né nel configuratore né altrove.
Alla fine del configuratore c'è l'invito a un colloquio, con il modulo già
compilato. Tolto il campo `fascia_prezzo` dal modulo `richiesta`.
**Perché:** scelta di Giovanni e Andrea: preferiamo essere contattati e
parlarne a voce, capendo prima come lavora l'attività.

## 2026-09-28 — Niente tempi di consegna sul sito

**Sostituisce** la parte sui tempi indicativi delle voci del 28/09
("scelte da servizi.ts, tempi da definire" e "Niente prezzi sul sito").
**Scelta:** come per i prezzi, il sito non mostra tempi. Il configuratore
finisce con un riepilogo delle risposte e l'invito al colloquio. Tolto il
campo `tempo_stimato` dal modulo `richiesta`. Tolto da `CLAUDE.md` anche
il segnaposto `[DA DEFINIRE]`, che serviva solo per prezzi e tempi.
**Perché:** un tempo detto prima di sapere cosa serve è una promessa come
un prezzo; il configuratore serve a preparare bene il colloquio.

## 2026-09-28 — Modulo `richiesta`: recapiti e "Come preferisci sentirci?"

**Scelta:** campi `attivita`, `servizio`, `sito_attuale`, `tempo_perso`,
`nome`, `telefono`, `email`, `come_sentirci`, `messaggio`. Obbligatori il
nome e almeno uno tra telefono ed email. "Come preferisci sentirci?"
(Telefonata, WhatsApp, Email, Di persona) e il messaggio sono facoltativi;
sotto il messaggio un esempio di cosa scrivere.
**Perché:** due campi separati danno dati ordinati e la tastiera giusta sul
telefono; sapere come preferisce essere sentito fa partire il colloquio nel
modo più comodo per il cliente.
**Alternativa scartata:** un campo unico "Telefono o email".

## 2026-09-28 — Configuratore: tutte le domande in una pagina

**Scelta:** le domande stanno una sotto l'altra, seguite da "Parliamone"
(recapiti) e da una riga di riepilogo sopra il pulsante di invio. In
pratica è un unico modulo.
**Perché:** si vede tutto subito, ogni risposta si corregge con un tocco,
le domande funzionano anche prima che arrivi React e la copia nascosta per
Netlify è quasi identica. Senza prezzi né tempi, non serve fingere un
calcolo passo per passo.
**Alternativa scartata:** una domanda per schermata (più codice, più
insidie per tastiera e lettori di schermo, non si vede quanto manca).

## 2026-09-28 — Configuratore: "Di cosa hai bisogno?"

**Sostituisce** "Cosa ti serve?" con le scelte di `servizi.ts` (voce del
28/09 "scelte da servizi.ts") e la regola sul tempo perso "solo per
gestionali e web app".
**Scelta:** la domanda è "Di cosa hai bisogno?", con quattro risposte:
Sito web, Gestionale, Web App, Ancora non lo so. Il configuratore non
importa più da `servizi.ts`. La domanda sul tempo perso compare per tutte
le risposte tranne Sito web (anche per "Ancora non lo so").
**Perché:** scelta di Andrea: le risposte sono i nomi dei servizi, più una
per chi non sa ancora cosa gli serve. Il tempo perso si chiede anche a chi
è indeciso, perché può essere proprio il suo problema.
**Costo accettato:** in home e in `/contatti` la stessa domanda ha parole
diverse ("Cosa ti serve?" con frasi, "Di cosa hai bisogno?" con i nomi dei
servizi).

## 2026-09-28 — Configuratore: revisione con la skill CRO

**Scelta:** dopo una revisione del modulo con la skill `marketing-skills:cro`:

- le quattro domande a scelta sono **facoltative**; obbligatori solo il nome
  e un recapito;
- "Come preferisci sentirci?" viene prima dei recapiti e decide quale serve
  (WhatsApp o Telefonata → telefono, Email → email);
- "Basta uno dei due" è sempre visibile sotto i recapiti, non solo in caso
  di errore;
- in cima: "Quattro domande a scelta, poi ci lasci un recapito. Nessuna
  risposta è obbligatoria.";
- sopra il pulsante, "Cosa succede dopo" in tre passi, con i tempi di
  risposta e le modalità del colloquio `[DA SCRIVERE]`, e "Ti rispondiamo
  noi: Giovanni e Andrea.";
- il pulsante dice **"Fissiamo un colloquio"** invece di "Invia la
  richiesta".
  **Perché:** chi non sa cosa rispondere non deve bloccarsi; chi sceglie
  WhatsApp deve lasciare il numero; sapere quanto è lungo il modulo e cosa
  succede dopo toglie i dubbi che fanno abbandonare; nomi veri al posto di
  un'azienda senza volto. Scartati i consigli della skill che contraddicono
  `CLAUDE.md` (testimonianze e loghi di clienti vicino al pulsante).

## 2026-09-28 — Sezione "Contatto" della home: solo invito

**Scelta:** titolo "Raccontaci come lavori oggi.", frase "Di persona o in
videochiamata, come preferisci…", pulsante "Raccontaci la tua attività" →
`/contatti` e pulsante WhatsApp (segnaposto finché non c'è il numero).
Nessun modulo in home.
**Perché:** un modulo in home farebbe doppione con `/contatti`, dove ci sono
il configuratore di Andrea e il modulo contatto; e Andrea potrebbe già
lavorarci.

## 2026-09-28 — Coordinamento su Discord, niente PR in bozza obbligatorie

**Scelta:** chi inizia un lavoro lo dice all'altro su Discord. Scartate per
ora le PR in bozza obbligatorie e la bacheca GitHub Projects.

## 2026-09-28 — Zona: da Scicli, a distanza in tutta Italia

**Scelta:** tolto "Val di Noto" ovunque. Formula: "Da Scicli, di persona in
zona, a distanza in tutta Italia". Nei dati per Google (JSON-LD) l'area
servita è Scicli, provincia di Ragusa e Italia.
**Perché:** l'obiettivo è crescere anche fuori zona, ma per farsi trovare
all'inizio il locale è il vantaggio più forte (ricerche tipo "gestionale
Ragusa"); dire che si lavora a distanza non esclude nessuno.

## 2026-09-28 — Pagina /contatti e dati di contatto condivisi

**Scelta:** `/contatti` ha titolo, due righe (risposta entro 24 ore, primo
colloquio di persona o in videochiamata), poi lo spazio per il
configuratore di Andrea (slot, con testo di riserva finché è vuoto) e a
destra i contatti diretti. Un solo modulo, `richiesta`: niente modulo
`contatto` separato, per non confondere il cliente con due moduli.
"Cosa succede dopo" sta solo dentro il configuratore.
Dati in `src/dati/sito.ts`: email, due numeri WhatsApp con il nome
(Giovanni principale), tempo di risposta, colloquio, link alla privacy.
**Perché:** i dati si scrivono una volta sola e li usano home, piè di
pagina, contatti e configuratore.

## 2026-09-28 — Informativa privacy: la scriviamo noi (strada C)

Pagina `/privacy` segnaposto, linkata nel piè di pagina. Da scrivere prima
del lancio partendo da un modello; il titolare del trattamento va chiarito
col commercialista. Niente banner cookie: il sito non usa statistiche né
servizi di terze parti.

## 2026-09-29 — Pagina /servizi (fatta da Andrea per Giovanni)

**Scelta:** h1 "Gestionali, app e siti per le attività della provincia di
Ragusa.", una riga su come lavoriamo, poi i tre servizi con testi da
`servizi.ts`. I gestionali in primo piano (tutta la larghezza, quadretto
giallo, i lavori di tutti i giorni, "Provalo adesso" verso la lavagna);
app e siti affiancati, un gradino sotto. Chiusura con la sezione `Contatto`
della home. JSON-LD `Service` per ogni servizio, con zona servita e
fornitore: solo dati veri. L'elenco dei lavori di tutti i giorni si sposta
da `CosaFacciamo.astro` a `src/dati/servizi.ts` (`lavori`), usato da tutte
e due; la home costruita resta identica.
**Perché:** revisione con le skill copywriting, copy-editing, SEO, SEO
locale e frontend-design: città e servizio nel titolo, una pagina centrale
che collega le tre pagine dei servizi, niente numeri 01/02/03 (non è una
sequenza), niente elenchi con i punti in mezzo, un solo invito finale (una
riga per gli indecisi ripeteva la sezione Contatto ed è stata tolta).

## 2026-09-29 — Forma fiscale: tre domande per il commercialista

**Scelta:** in "Prima del lancio" (CLAUDE.md) la voce "prestazione
occasionale" diventa "forma fiscale", con tre domande: gestione INPS
(Gestione Separata senza minimo o contributi fissi), una o due Partite IVA
o società, costo del commercialista e da quando serve la Partita IVA.
**Perché:** i 5.000 euro sono la soglia dei contributi INPS, non un tetto
della prestazione occasionale; il vero limite è l'occasionalità, che un sito
d'agenzia con clienti continuativi non ha. Il timore di costi fissi senza
clienti dipende quasi tutto dalla gestione INPS. Da verificare col
commercialista: non è una consulenza.

## 2026-10-03 — Nuova veste "Officina"

**Perché:** il sito somigliava troppo, nel tono e nella struttura, a quello
di un altro studio di Scicli (epressio.it): stesso registro ("raccontaci",
"senza tecnicismi", "da Scicli lavoriamo ovunque"), stessa idea di demo,
fondo a puntini. Molti tratti erano quelli tipici dei siti generati: fondo
crema, linee sottili da giornale, etichette in monospazio, frecce nei
pulsanti, dati separati da puntini.
**Scelte (provate nella pagina "Direzioni grafiche Kroma"):**

- direzione **Officina**: sito scuro (#15181B), voi due in primo piano con
  foto vere, il marchio a pixel come protagonista dell'apertura;
- carattere **Geist** per titoli e testo al posto di Space Grotesk;
  JetBrains Mono solo per dati veri;
- **niente trama di fondo**;
- **movimento C**: transizioni morbide ai gesti, View Transitions tra le
  pagine (CSS), un solo momento animato (i pixel del marchio che si
  compongono all'apertura della home);
- posizionamento: web app e gestionali su misura, siti, manutenzione con
  contratto; i gestionali installabili sono l'obiettivo, non si promettono;
- home nuova: apertura, voi due, Vivai Cintoli, gestionale dimostrativo,
  servizi, come lavoriamo, altri lavori, chiusura. Escono dalla home il
  selettore "Cosa ti serve?" e "Una giornata tipo" (resta in /gestionali);
- `/web-app` confluisce in `/gestionali`; nasce `/manutenzione`; esce dal
  menu "Come lavoriamo" (diventa una sezione della home).
  **Come:** branch lungo `feat/nuova-veste` con PR intermedie, una sola PR
  finale verso `main`. Prima tappa: le fondamenta (colori, caratteri, fondo,
  intestazione, piè di pagina, pulsanti, regole).
  **Sostituisce:** trama a punti (27/09), menu con "Come lavoriamo", apertura
  con "Cosa ti serve?" e la frase "Strumenti digitali cuciti sulla tua
  attività", Space Grotesk.

## 2026-10-03 — Nuova veste: apertura della home

**Scelta:** marchio a pixel grande che si compone all'apertura (CSS, colori
dai token, posizioni di partenza calcolate alla build), titolo "Software per
chi lavora con una squadra.", due pulsanti "Fissa un primo incontro" e
"Vedi i lavori". Tolte dalla home "Una giornata tipo" e il selettore "Cosa
ti serve?" (i dati in `src/dati/servizi.ts` restano: li usa `/servizi`).

## 2026-10-03 — Nuova veste: sezione "Voi due"

**Scelta:** subito dopo l'apertura, su fondo superficie: "Parlate con chi
scrive il codice." e "Siamo in due. Chi vi ascolta al primo incontro è chi
poi costruisce l'app.", poi Giovanni e Andrea con foto, ruolo e una frase.
Dati in `src/dati/squadra.ts` (li userà anche `/chi-siamo`). Foto, ruolo e
frase sono segnaposto: le foto in 4:5, le frasi con parole loro.

## 2026-10-03 — Nuova veste: Vivai Cintoli e altri lavori

**Scelta:** "I nostri lavori" si divide in due sezioni della home.
`VivaiCintoli.astro` subito dopo "Voi due": logo, titolo "L'app con cui
lavora ogni giorno la squadra di Vivai Cintoli.", quattro fatti veri in
grande (in uso da settembre 2026, 20-25 operatori, 5 persone tra ufficio e
amministrazione, prima WhatsApp/fogli/Excel) e la ricostruzione per ruolo.
`AltriLavori.astro` più in basso: "Anche siti, per chi deve farsi trovare."
con Casale Allibrio ed Estrò Atelier.
**Loghi:** ora chiari su trasparente per il fondo scuro: Vivai Cintoli
dalla loro versione ufficiale per fondi scuri (`logo-white.png`, con il
cerchio giallo), Casale Allibrio dal loro SVG bianco, Estrò Atelier
ricavato bianco dal logo originale. Niente più filtro di inversione.

## 2026-10-04 — Nuova veste: sezione Servizi

**Scelta:** "Cosa facciamo" al posto di "Non solo prenotazioni": due lavori
(gestionali e web app su misura → `/gestionali`, siti web → `/siti`) e la
manutenzione, su fondo superficie, che "si aggiunge a un gestionale o a un
sito". Righe divise da linee, non schede uguali; il nome è il link alla
pagina; a destra le cose concrete, con un pixel davanti (verde; giallo per
la manutenzione, ancora da definire). Testi in `offerta`
(`src/dati/servizi.ts`). Cosa comprende la manutenzione e il canone:
`[DA DEFINIRE]`. Pagina `/manutenzione` segnaposto. Tolto
`CosaFacciamo.astro`.

## 2026-10-04 — Nuova veste: Come lavoriamo

**Scelta:** sezione "Come lavoriamo" dopo i Servizi: cinque passi numerati
(sono una sequenza), in fila su una linea da computer e in colonna da
telefono; il numero sta in un quadretto, l'ultimo (consegna) è giallo.
**Testi:** quelli di Andrea in `src/dati/metodo.ts` (dalla sua PR #26),
portati al "voi" della nuova veste, più il passo "Consegna e formazione"
dal suo `fattiGestionale.formazione`. Le domande frequenti e i fatti del
file restano al "tu": li usa `/gestionali`, da rivedere con quella pagina.

## 2026-10-04 — Nuova veste: chiusura della home

**Scelta:** "Iniziamo da un incontro." al posto di "Raccontaci come lavori
oggi." (tono da agenzia). Sotto: "Di persona a Scicli e dintorni, in
videochiamata da tutta Italia. Rispondiamo entro 24 ore.", il pulsante
"Fissa un primo incontro" e i recapiti con i nomi (WhatsApp Giovanni,
WhatsApp Andrea, email) in monospazio perché sono dati veri. Nuovo
`Chiusura.astro`, tolto `Contatto.astro`; anche `/servizi` ora chiude con
`Chiusura`.

## 2026-10-04 — Nuova veste: pagina /lavori

**Scelta:** titolo "Lavori" e una frase; Vivai Cintoli in evidenza su fondo
superficie (logo, "Gestionale su misura", descrizione, tre fatti veri,
pulsante al caso completo); sotto, "Siti web" con Casale Allibrio ed Estrò
Atelier in righe con logo; in fondo la Chiusura. Nei loghi `alt=""` perché
il nome è già scritto accanto. Le tre pagine dei casi completi restano
segnaposto finché non ci sono i materiali.

## 2026-10-04 — Nuova veste: pagina /chi-siamo

**Scelta:** titolo "Giovanni e Andrea." e "Due sviluppatori, a Scicli. Chi
vi ascolta al primo incontro è chi poi costruisce l'app."; le due persone in
grande con foto (4:5), ruolo e frase, la seconda più in basso da computer
(griglia asimmetrica); "Come è nato Kroma Web Lab" con storia e perché
(`studio` in `src/dati/squadra.ts`); "Dove ci trovate" con i fatti; la
Chiusura. Foto, ruoli, frasi e storia sono segnaposto: li scrivono loro.
