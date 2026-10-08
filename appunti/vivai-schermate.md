# Vivai Cintoli: le schermate dell'app, spiegate da Giovanni

Schermate fatte da Giovanni il 07/10/2026 sull'app vera, con un database di
prova (`vivaio_demo`): dipendenti e mezzi rinominati ("Operatore N",
"Mezzo N"), nessun dato reale dell'azienda. Qui i fatti raccontati da
Giovanni per ogni schermata: servono per scrivere la pagina del caso.
Non sono testi da pubblicare così come sono.

Cose da non mostrare (oltre alle solite): il numero di dipendenti e di
mezzi nella dashboard dell'ufficio va **oscurato** (Giovanni, 07/10/2026).

## 1. Accesso (computer e telefono)

File: `schermata-accesso-pc.png`, `schermata-accesso-mobile.jpg`.

- È la stessa schermata per tutti: amministratori, ufficio, singoli
  dipendenti.
- **Quattro lingue (italiano, inglese, punjabi, albanese)**: in azienda
  lavorano persone straniere, che si trovano più a loro agio nella loro
  lingua madre.
- Ognuno ha un nome utente e un PIN. **Gli account li crea solo un
  amministratore**, non l'ufficio.
- Per il primo accesso si dà un PIN generale; **al primo ingresso l'app
  chiede subito di cambiarlo**, per la privacy.
- "Ricordami su questo dispositivo" salva l'accesso nell'app: all'apertura
  si entra da soli.

## 2. Dashboard dell'ufficio (computer)

File: `dashboard-ufficio.png` (numeri di dipendenti e mezzi oscurati).

- La vedono sia l'ufficio sia gli amministratori.
- I blocchi (Preferiti, Area Direzionale, Area Operativa, Vivaio, Area
  Verde) dividono i moduli per area di appartenenza.
- **Ognuno se la personalizza**: preferiti con la stella, card da
  trascinare per cambiare l'ordine.
- I moduli che l'ufficio usa di più: **programma giornaliero** e **rapporti
  di lavoro**.

## 3. Rapporti in ufficio (computer)

File: `area-rapporti-ufficio.png` (giornata ancora vuota: va bene così,
deve solo incuriosire).

- **È la prima cosa che l'ufficio apre la mattina dopo**: esporta tutti i
  dati raccolti e li inserisce nel gestionale ufficiale dell'azienda.
- **Gli stati li cambia l'ufficio:**
  - **Non inviato**: l'operatore non l'ha ancora mandato.
  - **Inviato**: l'operatore l'ha mandato.
  - **Approvato**: l'ufficio l'ha controllato e non ci sono errori.
  - **Da correggere**: l'ufficio trova un'anomalia e lo rimanda
    all'operatore, con delle note; l'operatore lo corregge e lo rimanda.
  - "Ricevuto" **non esiste più**: Giovanni l'ha tolto. (La ricostruzione
    in HTML che lo mostrava è stata tolta l'08/10/2026.)
- **Compila**: quando qualcuno non può inviarlo dal telefono, l'ufficio lo
  compila per lui.
- **Assente**: quando un dipendente manca quel giorno senza aver chiesto un
  permesso, e quindi l'app non lo sa.
- **Vivaio** è il lavoro interno del vivaio; **Area Verde** sono i cantieri
  fuori, dai clienti: giardini, aree verdi e tutti i lavori di giardinaggio.
- **PDF ed Excel** servono all'ufficio per raccogliere i dati e inserirli nel
  gestionale dell'azienda. **Nell'app non ci sono buste paga** né niente del
  genere: solo dati da esportare.
- **Rapporto di squadra**: lo manda un componente per tutta la squadra,
  quando tutti hanno fatto esattamente le stesse cose per l'intera giornata.
  All'ufficio arriva un rapporto per ciascun dipendente, con un solo invio.

## 4. Programma giornaliero e il suo PDF (computer)

File: `pdf-generato-programma-giornaliero.png` (il PDF), e il programma in
modifica fotografato dall'assistente il 05/10 (righe con "occupato: riga N",
"in permesso").

- **Lo preparano il giorno prima** il titolare (attività in vivaio) e il
  responsabile dell'Area Verde (cantieri).
- **Si manda su WhatsApp**, nel gruppo dello staff dove ci sono tutti i
  dipendenti.
- Perché l'app funziona così bene qui:
  - il programma si può fare **anche dal telefono**, se non si è in azienda;
  - **ognuno aggiunge le sue righe quando vuole**, e l'altro, quando entra,
    trova già le righe aggiunte: si costruisce in due senza parlarsi;
  - **mentre si scelgono dipendenti, mezzi e attrezzi** l'elenco mostra
    subito chi è già assegnato a un'altra riga, chi è assente e chi ha un
    permesso approvato per quel giorno (e i mezzi non disponibili).
- **Prima**: un file Excel condiviso. Ognuno inseriva la sua riga, ma doveva
  rileggere tutto il programma per capire se una persona era già occupata,
  andare su WhatsApp per vedere chi aveva detto di essere assente, e
  ricordarsi a memoria se un mezzo era guasto.
- Si fa **ogni giorno**.
- **Priorità**: se un dipendente ha più attività, le fa nell'ordine di
  priorità.
- **Collegamento con il rapporto**: il programma riempie già la prima riga
  del rapporto con l'attività programmata per quella persona quel giorno.
  Il dipendente inserisce solo ore e mezzi usati, e aggiunge altre righe se
  ha fatto altro.

## 5. Dashboard dell'operatore, modalità classica (telefono)

File: `dashboard-operatore-classico.jpg`.

- La usano **tutti gli operatori**, in modalità classica o semplice.
- **I moduli li sceglie l'ufficio per ogni operatore**, in base a quello che
  fa di solito, per non riempirgli il telefono di cose che non gli servono
  (scheda "Operatori app", lato ufficio).
- **Segnalazioni**: guasti, problemi in campo e simili, **con foto**.
- **Comunicazioni**: avvisi dell'ufficio, **a tutti o solo ad alcuni**.
- **Permessi**: il dipendente chiede il permesso d'assenza da qui; l'ufficio
  approva o rifiuta. **Quando l'ufficio decide, l'operatore riceve un avviso
  a comparsa con l'esito.** Prima: un messaggio WhatsApp a uno dei titolari,
  o lo si diceva in ufficio. (Il permesso approvato compare poi "in
  permesso" nel programma: vedi schermata 4.)
- **Senza rete**: le pagine vanno aperte una volta con la connessione; poi
  restano salvate e si usano anche offline. **Un rapporto inviato senza rete
  viene salvato sul telefono e parte da solo quando torna la connessione.**
- Registro carburante e Le mie ore: non ancora spiegati da Giovanni (dal
  README: rifornimenti dei mezzi con chiusura del mese; le ore lavorate
  dell'operatore).

## 6. Nuovo rapporto, modalità classica (telefono)

File: `inserimento-rapporto-operatore-classico.jpg` (modulo vuoto: va bene
come confronto con la modalità semplice).

- **La prima riga arriva già dal programma**; l'operatore aggiunge le altre.
- **Collega documento (rilievo)**: collega alla riga un rilievo fatto da
  quell'operatore (giacenza, misure, rinvasi, spostamenti).
- **Aggiungi mezzo**: per indicare un mezzo usato in quell'attività.
- La modalità classica la usa **chi è più pratico**.
- "Somma ore righe / Totale dichiarato": **se le ore delle righe non tornano
  con il totale dichiarato, l'app blocca l'invio.**

## 7. Modalità semplice (telefono)

File: `dashboard-operatore-semplice.jpg`, `inserimento-rapporto-semplice-01.jpg`
("Oggi hai fatto questo lavoro?"), `inserimento-rapporto-semplice-02.jpg`
("Quante ore?").

- Il rapporto diventa **una domanda alla volta**, con elenchi da cui
  scegliere.
- Si parte dal lavoro del programma: "Oggi hai fatto questo lavoro?".
  **Se risponde "No, non l'ho fatto"**, l'app fa scegliere prima l'area dove
  ha lavorato e poi l'attività.
- Le ore con tasti grandi da 1 a 12, più "+ mezz'ora".
- Alla fine si possono allegare **note vocali**, per dare indicazioni più
  precise.
- **Funziona in tutte e quattro le lingue.**
- Com'è andata: **alcuni operatori la usano da soli, altri hanno ancora
  difficoltà**. **Non scrivere numeri** su quanti la usano (Giovanni,
  07/10/2026).

## La storia del progetto (raccontata da Giovanni, 07/10/2026)

**Attenzione:** il 05/10/2026 Giovanni ha deciso che sul sito **non si dice
che lavora in Vivai Cintoli**. La storia qui sotto lo contiene: prima di
usarla va deciso come raccontarla senza quel dettaglio.

**Da dove nasce: le giacenze in serra.**

- Periodicamente in azienda bisognava fare le giacenze delle piante nelle
  serre e poi sistemarle sul gestionale ufficiale dell'azienda.
- Prima: blocco note e penna, in serra fila per fila, scrivendo a mano per
  ogni partita di piante nome, codice partita, lotto, fila e quantità
  rilevata. A fine giacenza si consegnavano i fogli scritti a mano, spesso
  sporchi e bagnati.
- Prima versione dell'app, che si chiamava **"Giacenze Vivaio"**: c'era solo
  il modulo giacenze. **Ogni partita ha un QR** con codice partita, lotto e
  fila (gli stessi registrati sul gestionale ufficiale): si scansiona il QR,
  l'app compila da sola quei campi, l'operatore inserisce la quantità e
  sistema la posizione. Poi salva e invia la giacenza a un profilo ufficio,
  che raccoglie le giacenze di tutti e **genera PDF puliti e stampabili**.

**Come è cresciuta.**

- Ha funzionato, e da lì sono nate le altre idee: togliere di mezzo le
  operazioni fatte in modo vecchio e ridurre i tempi.
- **Rapporti di lavoro** dal telefono, al posto di venire in ufficio a
  dettarli a voce o di mandarli su WhatsApp. L'ufficio li raccoglie puliti,
  senza fogli né penna, e li usa per **calcolare le ore lavorate e
  dividerle tra le aree dell'azienda e i centri di costo**.
- Pian piano l'app si è specializzata in **quasi tutte le attività interne**.
- **Modalità semplice** per i dipendenti meno pratici di tecnologia (spesso
  più avanti con l'età): il rapporto diventa una serie di domande semplici a
  cui rispondere, e alla fine si possono **allegare note vocali, come su
  WhatsApp**.
- Per gli operatori è un'app semplicissima; **per l'ufficio diventa un vero
  mini gestionale, "portatile" anche da telefono**.
