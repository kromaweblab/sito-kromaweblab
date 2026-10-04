// Dati dell'attività usati in più punti (piè di pagina, contatti, SEO,
// configuratore). Si scrivono una volta sola qui.
// Un valore `null` significa "non lo abbiamo ancora": nel testo visibile
// si mostra [DA SCRIVERE], nei dati per Google (JSON-LD) si omette.

export const DA_SCRIVERE = '[DA SCRIVERE]';

export interface NumeroWhatsapp {
  /** Chi risponde a questo numero. */
  nome: string;
  /** Formato internazionale senza + né spazi, per il link wa.me. */
  numero: string;
  /** Come si scrive per le persone. */
  visibile: string;
}

/** I due numeri WhatsApp. Il primo è quello dei pulsanti "Scrivici su WhatsApp". */
export const numeriWhatsapp: NumeroWhatsapp[] = [
  { nome: 'Giovanni', numero: '393482839911', visibile: '348 283 9911' },
  { nome: 'Andrea', numero: '393669367721', visibile: '366 936 7721' },
];

export const sito = {
  nome: 'Kroma Web Lab',
  url: 'https://kromaweblab.it',
  comune: 'Scicli',
  provincia: 'Ragusa',
  siglaProvincia: 'RG',
  cap: '97018',
  regione: 'Sicilia',
  zoneServite: ['Scicli', 'Provincia di Ragusa', 'Italia'],
  email: 'kromaweblab@gmail.com' as string | null,
  telefono: null as string | null,
  /** Numero WhatsApp principale (quello dei pulsanti). */
  whatsapp: numeriWhatsapp[0]?.numero ?? null,
  indirizzo: null as string | null,
  /** Entro quanto ricontattiamo chi ci scrive. */
  tempoRisposta: '24 ore',
  /** Com'è il primo incontro. Senza "come preferisci/preferite": il tu o
   * il voi lo aggiunge la frase che lo usa (il modulo dà del tu, il resto
   * del sito del voi). */
  colloquio: 'di persona o in videochiamata',
  /** Pagina dell'informativa privacy (da scrivere prima del lancio). */
  privacy: '/privacy',
} as const;

/** Restituisce il valore o il segnaposto evidente. */
export const oSegnaposto = (valore: string | null) => valore ?? DA_SCRIVERE;

/** Link a una chat WhatsApp. */
export const linkChat = (numero: string) => `https://wa.me/${numero}`;

/** Link al WhatsApp principale, oppure null se il numero non c'è ancora. */
export const linkWhatsapp = sito.whatsapp ? linkChat(sito.whatsapp) : null;
