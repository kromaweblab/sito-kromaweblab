// I lavori mostrati sul sito. Nomi e loghi veri: abbiamo il consenso dei
// clienti. Il primo è quello in evidenza (riquadro grande in home).
// Finché una schermata non c'è, `schermata: null` mostra un segnaposto
// evidente dentro la cornice (telefono per le app, browser per i siti).
//
// I loghi stanno in src/assets/lavori/ (non in public/): così Astro li
// ottimizza e li serve nella misura giusta per ogni schermo.

import type { ImageMetadata } from 'astro';
import logoVivai from '../assets/lavori/vivai-cintoli.png';
import logoCasale from '../assets/lavori/casale-allibrio.svg';
import logoEstro from '../assets/lavori/estro-atelier.png';
import { DA_SCRIVERE } from './sito';

// Schermate vere dell'app di Vivai Cintoli, fatte da Giovanni il 07/10/2026
// su un database di prova: dipendenti e mezzi rinominati ("Operatore N"),
// numeri dell'azienda oscurati. Spiegazioni in appunti/vivai-schermate.md.
import vivaiAccesso from '../assets/lavori/vivai/accesso-telefono.jpg';
import vivaiProgrammaAvvisi from '../assets/lavori/vivai/programma-avvisi.png';
import vivaiProgrammaPdf from '../assets/lavori/vivai/programma-pdf.png';
import vivaiOperatore from '../assets/lavori/vivai/operatore-dashboard.jpg';
import vivaiSempliceDashboard from '../assets/lavori/vivai/semplice-dashboard.jpg';
import vivaiSempliceDomanda from '../assets/lavori/vivai/semplice-domanda.jpg';
import vivaiSempliceOre from '../assets/lavori/vivai/semplice-ore.jpg';
import vivaiUfficioRapporti from '../assets/lavori/vivai/ufficio-rapporti.png';
import vivaiUfficioDashboard from '../assets/lavori/vivai/ufficio-dashboard.png';

/** Una schermata nella pagina di un caso, con la sua cornice. */
export interface Schermata {
  src: ImageMetadata;
  /** Cosa si vede, per chi non vede l'immagine. */
  alt: string;
  cornice: 'telefono' | 'computer' | 'documento';
}

export interface Lavoro {
  id: string;
  nome: string;
  href: string;
  /** Tipo di lavoro, scritto piccolo accanto al nome. */
  tipo: string;
  descrizione: string;
  /** Logo del cliente, in bianco per il fondo scuro. */
  logo: ImageMetadata;
  /** In che cornice si mostra la schermata. */
  cornice: 'telefono' | 'browser';
  /** Schermata del lavoro (solo dati finti o oscurati), o null. */
  schermata: ImageMetadata | null;
  /** Indirizzo del sito, scritto nella barra della cornice browser. */
  indirizzo: string | null;
  /** Fatti veri, in breve. Vuoto finché non ce ne sono. */
  fatti: { etichetta: string; valore: string }[];
  /** La pagina del caso completo (/lavori/<id>). */
  caso: {
    /** Descrizione per Google. */
    descrizione: string;
    /** Com'era prima: punti brevi. */
    prima: string[];
    /** Cosa abbiamo fatto: punti brevi, cose vere. */
    fatto: string[];
    /** Come si usa oggi, in una o due frasi. */
    oggi: string;
    /** Com'è nata, in qualche paragrafo. Facoltativo. */
    nascita?: string[];
    /** Una giornata con l'app, in ordine: al posto della cornice unica. */
    giornata?: { titolo: string; testo: string; schermate: Schermata[] }[];
    /** Le scelte fatte per chi la usa, con le schermate che le mostrano. */
    perChiLaUsa?: { punti: string[]; schermate: Schermata[] };
  };
}

/** Dati veri sull'uso dell'app di Vivai Cintoli (forniti da Giovanni, 28/09/2026). */
export const usoVivai = {
  inUsoDa: 'settembre 2026',
  /** Account Operatore: circa 20-25. */
  operatori: '20-25',
  /** 2 account Ufficio e 3 Admin. */
  ufficio: '5 persone',
};

export const lavori: Lavoro[] = [
  {
    id: 'vivai-cintoli',
    nome: 'Vivai Cintoli',
    href: '/lavori/vivai-cintoli',
    tipo: 'gestionale su misura',
    logo: logoVivai,
    descrizione:
      'Chi lavora in vivaio e nei cantieri manda il rapporto dal telefono. In ufficio le ore arrivano già sommate e si prepara il programma del giorno dopo.',
    cornice: 'telefono',
    schermata: vivaiSempliceDomanda,
    indirizzo: null,
    fatti: [
      { etichetta: 'Operatori sul campo', valore: usoVivai.operatori },
      { etichetta: 'In ufficio', valore: usoVivai.ufficio },
      { etichetta: 'In uso da', valore: usoVivai.inUsoDa },
    ],
    caso: {
      descrizione:
        'Il gestionale di Vivai Cintoli: rapporti dal telefono, ore già sommate in ufficio, programma del giorno dopo. Fatto da Kroma Web Lab, Scicli.',
      // Da appunti/lavori.md (fatti dati da Giovanni il 27/09/2026).
      prima: [
        'I rapporti arrivavano con messaggi su WhatsApp, o si dettavano a voce in ufficio a fine turno.',
        'In ufficio si ricopiavano su un foglio e le ore si sommavano con la calcolatrice.',
        'Il programma del giorno si faceva su Excel, ricordando a memoria chi e cosa era disponibile.',
      ],
      fatto: [
        'Il rapporto parte dal telefono, anche senza campo: si invia da solo quando torna la rete.',
        "Il programma si prepara in due, anche dal telefono, e l'app segna da sola chi è occupato o in permesso.",
        "L'ufficio approva i rapporti o li rimanda indietro con una nota, poi esporta tutto per il gestionale dell'azienda.",
        "Ognuno vede solo i moduli che gli servono: li sceglie l'ufficio, persona per persona.",
      ],
      oggi: `In uso da ${usoVivai.inUsoDa}: ${usoVivai.operatori} operatori dal telefono, ${usoVivai.ufficio} tra ufficio e amministrazione dal computer.`,
      // Raccontata senza dire chi in azienda ci lavora (scelta A, 08/10/2026).
      nascita: [
        "È nata dentro l'azienda, da un lavoro dell'ufficio: le giacenze delle piante in serra. Si girava fila per fila con blocco e penna, scrivendo per ogni partita codice, lotto, fila e quantità, e i fogli arrivavano in ufficio sporchi e bagnati.",
        "La prima versione faceva solo quello. Ogni partita ha un QR: lo si inquadra e l'app compila codice, lotto e fila, l'operatore scrive la quantità, e l'ufficio riceve le giacenze di tutti in un PDF pulito da stampare.",
        'Ha funzionato. Poi sono arrivati i rapporti di lavoro, il programma del giorno, i permessi: oggi segue quasi tutto il lavoro interno.',
      ],
      giornata: [
        {
          titolo: 'Il giorno prima: il programma',
          testo:
            "Il titolare prepara le attività del vivaio, il responsabile quelle dei cantieri: ognuno aggiunge le sue righe, anche dal telefono, e l'altro le ritrova. Mentre scelgono persone e mezzi, l'app segna da sola chi è già occupato, chi è in permesso e quale mezzo è fermo. Il PDF finito va nel gruppo WhatsApp dello staff.",
          schermate: [
            {
              src: vivaiProgrammaAvvisi,
              alt: 'Una riga del programma: accanto ai nomi degli operatori compaiono "occupato: riga 3" e "in permesso".',
              cornice: 'computer',
            },
            {
              src: vivaiProgrammaPdf,
              alt: 'Il PDF del programma del giorno, con attività, persone e priorità.',
              cornice: 'documento',
            },
          ],
        },
        {
          titolo: 'In campo: ognuno vede il suo',
          testo:
            "Ogni operatore ha solo i moduli che gli servono: li sceglie l'ufficio, persona per persona. Da qui chiede un permesso, e l'esito gli arriva sul telefono; segnala un guasto con una foto; legge gli avvisi dell'ufficio.",
          schermate: [
            {
              src: vivaiOperatore,
              alt: 'La pagina iniziale di un operatore: rapporto e programma di oggi, permessi, segnalazioni, comunicazioni, le mie ore.',
              cornice: 'telefono',
            },
          ],
        },
        {
          titolo: 'A fine turno: il rapporto',
          testo:
            "La prima riga è già scritta: arriva dal programma. L'operatore aggiunge ore, mezzi e gli altri lavori; se le ore non tornano con il totale, il rapporto non parte. Per chi è meno pratico c'è la modalità semplice: una domanda alla volta, tasti grandi, e alla fine una nota vocale, come su WhatsApp.",
          schermate: [
            {
              src: vivaiSempliceDashboard,
              alt: 'Modalità semplice: un solo grande pulsante, "Fai il rapporto di oggi".',
              cornice: 'telefono',
            },
            {
              src: vivaiSempliceDomanda,
              alt: 'Modalità semplice: "Oggi hai fatto questo lavoro?", con il lavoro del programma e i pulsanti Sì e No.',
              cornice: 'telefono',
            },
            {
              src: vivaiSempliceOre,
              alt: 'Modalità semplice: "Quante ore?", con i tasti da 1 a 12 e "più mezz\'ora".',
              cornice: 'telefono',
            },
          ],
        },
        {
          titolo: "La mattina dopo: l'ufficio",
          testo:
            "È la prima cosa che l'ufficio apre: vede chi ha mandato il rapporto e chi no, lo approva o lo rimanda indietro con una nota, poi esporta tutto per il gestionale dell'azienda. Senza telefonate e senza fogli.",
          schermate: [
            {
              src: vivaiUfficioRapporti,
              alt: 'La pagina dei rapporti in ufficio: per ogni operatore lo stato del rapporto, le ore e i pulsanti Compila e Assente.',
              cornice: 'computer',
            },
          ],
        },
      ],
      perChiLaUsa: {
        punti: [
          'In quattro lingue: italiano, inglese, punjabi e albanese, per chi in azienda si trova meglio nella sua.',
          'Funziona anche senza campo: le pagine già aperte restano sul telefono, e quello che si invia parte appena torna la rete.',
          "Gli account li crea solo l'amministratore, e il PIN si cambia al primo accesso.",
          'In ufficio ognuno si sistema la sua pagina iniziale, con i moduli che usa di più in cima.',
        ],
        schermate: [
          {
            src: vivaiAccesso,
            alt: "La pagina d'accesso, con la scelta della lingua: italiano, inglese, punjabi, albanese.",
            cornice: 'telefono',
          },
          {
            src: vivaiUfficioDashboard,
            alt: "La pagina iniziale dell'ufficio, con i moduli divisi per area e i preferiti in cima.",
            cornice: 'computer',
          },
        ],
      },
    },
  },
  {
    id: 'casale-allibrio',
    nome: 'Casale Allibrio',
    href: '/lavori/casale-allibrio',
    tipo: 'sito web',
    logo: logoCasale,
    descrizione: 'Il sito di un agriturismo, rifatto da capo.',
    cornice: 'browser',
    schermata: null,
    // Va online insieme al nostro sito (CLAUDE.md, "Lavori mostrati").
    indirizzo: null,
    fatti: [],
    caso: {
      descrizione:
        'Il sito di Casale Allibrio, agriturismo, rifatto da capo da Kroma Web Lab, Scicli.',
      prima: [DA_SCRIVERE],
      fatto: [DA_SCRIVERE],
      oggi: DA_SCRIVERE,
    },
  },
  {
    id: 'estro-atelier',
    nome: 'Estrò Atelier',
    href: '/lavori/estro-atelier',
    tipo: 'sito web',
    logo: logoEstro,
    descrizione: 'Il sito di un atelier di abiti da sposa.',
    cornice: 'browser',
    schermata: null,
    indirizzo: null,
    fatti: [],
    caso: {
      descrizione:
        'Il sito di Estrò Atelier, atelier di abiti da sposa, fatto da Kroma Web Lab, Scicli.',
      prima: [DA_SCRIVERE],
      fatto: [DA_SCRIVERE],
      oggi: DA_SCRIVERE,
    },
  },
];

/** Testo del segnaposto nella cornice, finché la schermata non c'è. */
export const segnapostoSchermata = (lavoro: Lavoro) =>
  `${DA_SCRIVERE} schermata ${lavoro.cornice === 'telefono' ? "dell'app dal telefono" : 'del sito'}`;
