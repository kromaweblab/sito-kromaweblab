// Le sei attività del gestionale dimostrativo: parole e dati di esempio.
// Le etichette seguono la tabella in CLAUDE.md. I dati di esempio sono
// finti ma plausibili: il componente mostra sempre "Dati di esempio".

import type { Prenotazione } from './logica';

export type IdAttivita =
  | 'ristorante'
  | 'parrucchiere'
  | 'centro-estetico'
  | 'agriturismo'
  | 'studio-medico'
  | 'studio-professionale';

/** Un campo a scelta del modulo (tavolo, servizio, notti…). */
export interface CampoAScelta {
  /** Etichetta del campo nel modulo: "Tavolo", "Estetista". */
  etichetta: string;
  /** Per il messaggio d'errore: "Scegli il tavolo." */
  conArticolo: string;
  scelte: string[];
  /** Parola davanti al valore nella lavagna: "con Giulia". */
  prefisso?: string;
}

export interface Attivita {
  id: IdAttivita;
  /** Nome nel selettore: "Ristorante". */
  nome: string;
  /** Per le frasi: "un ristorante", "uno studio medico". */
  conArticolo: string;
  /** Chi prenota: "cliente", "paziente", "ospite". */
  chi: string;
  /** Come si chiama una prenotazione in questa attività, per le frasi. */
  evento: { singolare: string; plurale: string; articolo: string; femminile: boolean };
  /** Numero di persone, se conta: "4 coperti". */
  quanti?: { singolare: string; plurale: string; massimo: number };
  dove?: CampoAScelta;
  cosa?: CampoAScelta;
  esempi: Prenotazione[];
}

const numerati = (parola: string, quanti: number) =>
  Array.from({ length: quanti }, (_, i) => `${parola} ${i + 1}`);

export const attivita: Record<IdAttivita, Attivita> = {
  ristorante: {
    id: 'ristorante',
    nome: 'Ristorante',
    conArticolo: 'un ristorante',
    chi: 'cliente',
    evento: {
      singolare: 'prenotazione',
      plurale: 'prenotazioni',
      articolo: 'la ',
      femminile: true,
    },
    quanti: { singolare: 'coperto', plurale: 'coperti', massimo: 20 },
    dove: { etichetta: 'Tavolo', conArticolo: 'il tavolo', scelte: numerati('Tavolo', 12) },
    esempi: [
      {
        id: 'e1',
        giorno: 0,
        ora: '13:00',
        nome: 'Russo',
        quanti: 2,
        dove: 'Tavolo 3',
        stato: 'completata',
      },
      {
        id: 'e2',
        giorno: 0,
        ora: '20:00',
        nome: 'Greco',
        quanti: 6,
        dove: 'Tavolo 9',
        stato: 'confermata',
      },
      {
        id: 'e3',
        giorno: 0,
        ora: '20:30',
        nome: 'Bianchi',
        quanti: 4,
        dove: 'Tavolo 7',
        stato: 'confermata',
      },
      {
        id: 'e4',
        giorno: 0,
        ora: '21:15',
        nome: 'Caruso',
        quanti: 2,
        dove: 'Tavolo 2',
        stato: 'richiesta',
      },
      {
        id: 'e5',
        giorno: 1,
        ora: '13:30',
        nome: 'Lombardo',
        quanti: 8,
        dove: 'Tavolo 10',
        stato: 'confermata',
      },
      {
        id: 'e6',
        giorno: 1,
        ora: '20:30',
        nome: 'Marino',
        quanti: 3,
        dove: 'Tavolo 5',
        stato: 'richiesta',
      },
      {
        id: 'e7',
        giorno: 2,
        ora: '21:00',
        nome: 'Rizzo',
        quanti: 5,
        dove: 'Tavolo 8',
        stato: 'richiesta',
      },
    ],
  },

  parrucchiere: {
    id: 'parrucchiere',
    nome: 'Parrucchiere',
    conArticolo: 'un parrucchiere',
    chi: 'cliente',
    evento: {
      singolare: 'appuntamento',
      plurale: 'appuntamenti',
      articolo: "l'",
      femminile: false,
    },
    dove: {
      etichetta: 'Postazione',
      conArticolo: 'la postazione',
      scelte: numerati('Postazione', 4),
    },
    cosa: {
      etichetta: 'Servizio',
      conArticolo: 'il servizio',
      scelte: ['Taglio', 'Piega', 'Taglio e piega', 'Colore', 'Barba'],
    },
    esempi: [
      {
        id: 'e1',
        giorno: 0,
        ora: '09:00',
        nome: 'Gallo',
        dove: 'Postazione 1',
        cosa: 'Taglio',
        stato: 'completata',
      },
      {
        id: 'e2',
        giorno: 0,
        ora: '10:30',
        nome: 'Ferrara',
        dove: 'Postazione 2',
        cosa: 'Colore',
        stato: 'confermata',
      },
      {
        id: 'e3',
        giorno: 0,
        ora: '16:00',
        nome: 'Bruno',
        dove: 'Postazione 1',
        cosa: 'Taglio e piega',
        stato: 'richiesta',
      },
      {
        id: 'e4',
        giorno: 1,
        ora: '09:30',
        nome: 'Costa',
        dove: 'Postazione 3',
        cosa: 'Barba',
        stato: 'confermata',
      },
      {
        id: 'e5',
        giorno: 1,
        ora: '11:00',
        nome: 'Messina',
        dove: 'Postazione 1',
        cosa: 'Piega',
        stato: 'richiesta',
      },
      {
        id: 'e6',
        giorno: 2,
        ora: '15:30',
        nome: 'Leone',
        dove: 'Postazione 2',
        cosa: 'Taglio',
        stato: 'richiesta',
      },
    ],
  },

  'centro-estetico': {
    id: 'centro-estetico',
    nome: 'Centro estetico',
    conArticolo: 'un centro estetico',
    chi: 'cliente',
    evento: {
      singolare: 'appuntamento',
      plurale: 'appuntamenti',
      articolo: "l'",
      femminile: false,
    },
    dove: {
      etichetta: 'Estetista',
      conArticolo: "l'estetista",
      scelte: ['Giulia', 'Sara', 'Marta'],
      prefisso: 'con',
    },
    cosa: {
      etichetta: 'Trattamento',
      conArticolo: 'il trattamento',
      scelte: ['Pulizia del viso', 'Manicure', 'Pedicure', 'Ceretta', 'Massaggio'],
    },
    esempi: [
      {
        id: 'e1',
        giorno: 0,
        ora: '10:00',
        nome: 'Rizzo',
        dove: 'Giulia',
        cosa: 'Manicure',
        stato: 'completata',
      },
      {
        id: 'e2',
        giorno: 0,
        ora: '15:00',
        nome: 'Marino',
        dove: 'Sara',
        cosa: 'Pulizia del viso',
        stato: 'confermata',
      },
      {
        id: 'e3',
        giorno: 0,
        ora: '17:30',
        nome: 'Greco',
        dove: 'Giulia',
        cosa: 'Massaggio',
        stato: 'richiesta',
      },
      {
        id: 'e4',
        giorno: 1,
        ora: '11:00',
        nome: 'Caruso',
        dove: 'Marta',
        cosa: 'Ceretta',
        stato: 'confermata',
      },
      {
        id: 'e5',
        giorno: 2,
        ora: '09:30',
        nome: 'Bianchi',
        dove: 'Sara',
        cosa: 'Pedicure',
        stato: 'richiesta',
      },
      {
        id: 'e6',
        giorno: 2,
        ora: '16:30',
        nome: 'Russo',
        dove: 'Giulia',
        cosa: 'Manicure',
        stato: 'richiesta',
      },
    ],
  },

  agriturismo: {
    id: 'agriturismo',
    nome: 'Agriturismo',
    conArticolo: 'un agriturismo',
    chi: 'ospite',
    evento: {
      singolare: 'prenotazione',
      plurale: 'prenotazioni',
      articolo: 'la ',
      femminile: true,
    },
    quanti: { singolare: 'persona', plurale: 'persone', massimo: 8 },
    dove: {
      etichetta: 'Camera',
      conArticolo: 'la camera',
      scelte: ['Camera Carrubo', 'Camera Ulivo', 'Camera Mandorlo', 'Camera Fico'],
    },
    cosa: {
      etichetta: 'Notti',
      conArticolo: 'quante notti',
      scelte: ['1 notte', '2 notti', '3 notti', '4 notti', '5 notti', '6 notti', '7 notti'],
    },
    esempi: [
      {
        id: 'e1',
        giorno: 0,
        ora: '15:00',
        nome: 'Lombardo',
        quanti: 2,
        dove: 'Camera Ulivo',
        cosa: '3 notti',
        stato: 'confermata',
      },
      {
        id: 'e2',
        giorno: 0,
        ora: '18:00',
        nome: 'Costa',
        quanti: 4,
        dove: 'Camera Carrubo',
        cosa: '2 notti',
        stato: 'richiesta',
      },
      {
        id: 'e3',
        giorno: 1,
        ora: '16:00',
        nome: 'Ferrara',
        quanti: 2,
        dove: 'Camera Fico',
        cosa: '1 notte',
        stato: 'confermata',
      },
      {
        id: 'e4',
        giorno: 2,
        ora: '14:30',
        nome: 'Gallo',
        quanti: 3,
        dove: 'Camera Mandorlo',
        cosa: '4 notti',
        stato: 'richiesta',
      },
    ],
  },

  'studio-medico': {
    id: 'studio-medico',
    nome: 'Studio medico',
    conArticolo: 'uno studio medico',
    chi: 'paziente',
    evento: { singolare: 'visita', plurale: 'visite', articolo: 'la ', femminile: true },
    cosa: {
      etichetta: 'Visita',
      conArticolo: 'il tipo di visita',
      scelte: ['Prima visita', 'Controllo', 'Pulizia dei denti', 'Certificato', 'Medicazione'],
    },
    esempi: [
      { id: 'e1', giorno: 0, ora: '09:00', nome: 'Bruno', cosa: 'Controllo', stato: 'completata' },
      {
        id: 'e2',
        giorno: 0,
        ora: '09:30',
        nome: 'Messina',
        cosa: 'Pulizia dei denti',
        stato: 'completata',
      },
      {
        id: 'e3',
        giorno: 0,
        ora: '11:00',
        nome: 'Leone',
        cosa: 'Prima visita',
        stato: 'confermata',
      },
      { id: 'e4', giorno: 0, ora: '17:00', nome: 'Greco', cosa: 'Medicazione', stato: 'richiesta' },
      {
        id: 'e5',
        giorno: 1,
        ora: '10:00',
        nome: 'Caruso',
        cosa: 'Certificato',
        stato: 'confermata',
      },
      {
        id: 'e6',
        giorno: 2,
        ora: '16:00',
        nome: 'Rizzo',
        cosa: 'Prima visita',
        stato: 'richiesta',
      },
    ],
  },

  'studio-professionale': {
    id: 'studio-professionale',
    nome: 'Studio professionale',
    conArticolo: 'uno studio professionale',
    chi: 'cliente',
    evento: {
      singolare: 'appuntamento',
      plurale: 'appuntamenti',
      articolo: "l'",
      femminile: false,
    },
    cosa: {
      etichetta: 'Appuntamento',
      conArticolo: 'il tipo di appuntamento',
      scelte: [
        'Prima consulenza',
        'Dichiarazione dei redditi',
        'Firma documenti',
        'Aggiornamento pratica',
      ],
    },
    esempi: [
      {
        id: 'e1',
        giorno: 0,
        ora: '09:30',
        nome: 'Ferrara',
        cosa: 'Firma documenti',
        stato: 'completata',
      },
      {
        id: 'e2',
        giorno: 0,
        ora: '11:00',
        nome: 'Marino',
        cosa: 'Dichiarazione dei redditi',
        stato: 'confermata',
      },
      {
        id: 'e3',
        giorno: 0,
        ora: '16:30',
        nome: 'Costa',
        cosa: 'Prima consulenza',
        stato: 'richiesta',
      },
      {
        id: 'e4',
        giorno: 1,
        ora: '10:00',
        nome: 'Gallo',
        cosa: 'Aggiornamento pratica',
        stato: 'confermata',
      },
      {
        id: 'e5',
        giorno: 2,
        ora: '15:00',
        nome: 'Lombardo',
        cosa: 'Prima consulenza',
        stato: 'richiesta',
      },
    ],
  },
};

/** L'ordine in cui compaiono nel selettore. */
export const ordineAttivita: IdAttivita[] = [
  'ristorante',
  'parrucchiere',
  'centro-estetico',
  'agriturismo',
  'studio-medico',
  'studio-professionale',
];
