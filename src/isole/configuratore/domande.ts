// Le domande del configuratore e le loro risposte, scritte una volta sola.
// Le decisioni su parole e risposte sono in DECISIONI.md (28/09/2026).
//
// Il valore inviato a Netlify è il testo della risposta, così nel pannello
// dei moduli si legge "Ristorante o bar" e non un codice.

/** I campi del modulo che corrispondono a una domanda a scelta. */
export type CampoDomanda = 'attivita' | 'servizio' | 'sito_attuale' | 'tempo_perso';

export interface Domanda {
  campo: CampoDomanda;
  testo: string;
  /** Riga in piccolo sotto la domanda. */
  aiuto?: string;
  risposte: readonly string[];
  /** Riquadri per le risposte brevi, righe per quelle lunghe. */
  aspetto: 'riquadri' | 'righe';
}

export const domande: readonly Domanda[] = [
  {
    campo: 'attivita',
    testo: 'Che attività hai?',
    risposte: [
      'Ristorante o bar',
      'Agriturismo o B&B',
      'Negozio',
      'Artigiano o laboratorio',
      'Azienda agricola o vivaio',
      'Parrucchiere o centro estetico',
      'Studio medico o professionale',
      'Altro',
    ],
    aspetto: 'riquadri',
  },
  {
    campo: 'servizio',
    testo: 'Di cosa hai bisogno?',
    risposte: ['Sito web', 'Gestionale', 'Web App', 'Ancora non lo so'],
    aspetto: 'riquadri',
  },
  {
    campo: 'sito_attuale',
    testo: 'Hai già un sito?',
    risposte: [
      'No',
      'Solo una pagina social o su Google Maps',
      'Sì, ma è da rifare',
      'Sì, e va bene così',
    ],
    aspetto: 'righe',
  },
  {
    campo: 'tempo_perso',
    testo: 'Quanto tempo ci perdi ogni giorno?',
    aiuto: 'A ricopiare, rispondere ai messaggi, ricontrollare.',
    risposte: ["Meno di mezz'ora", "Da mezz'ora a un'ora", "Più di un'ora", 'Non saprei'],
    aspetto: 'riquadri',
  },
];

/** Chi sceglie un sito non ha il problema del tempo perso (DECISIONI.md). */
export const servizioSenzaTempoPerso = 'Sito web';

export const preferenze = ['Telefonata', 'WhatsApp', 'Email', 'Di persona'] as const;
export type Preferenza = (typeof preferenze)[number];
