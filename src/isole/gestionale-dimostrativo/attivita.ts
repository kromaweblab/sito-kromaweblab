// Le sei attività della prova "dal cliente all'attività": servizi, orari,
// giorni di chiusura, posti, e le prenotazioni di esempio. Dati finti ma
// plausibili: la prova mostra sempre "Dati di esempio".
//
// Solo nomi di battesimo: niente cognomi, nemmeno inventati (CLAUDE.md).

export type IdAttivita =
  | 'ristorante'
  | 'parrucchiere'
  | 'centro-estetico'
  | 'agriturismo'
  | 'studio-medico'
  | 'studio-professionale';

export type Stato = 'richiesta' | 'confermata' | 'completata';

/** Un servizio che il cliente può prenotare, con gli orari in cui si fa. */
export interface Servizio {
  nome: string;
  /** "19:30", in ordine. */
  orari: string[];
}

/**
 * Una prenotazione di esempio. Non ha una data: "aperto" è il numero del
 * giorno di apertura a partire da oggi (0 = il primo giorno aperto), così
 * gli esempi non cadono mai in un giorno di chiusura, qualunque sia oggi.
 */
export interface Esempio {
  aperto: number;
  ora: string;
  nome: string;
  servizio: string;
  persone?: number;
  stato: Stato;
}

export interface Attivita {
  id: IdAttivita;
  /** Nome nel selettore, e nome dell'app finché il visitatore non ne scrive uno. */
  nome: string;
  /** Per le frasi: "un ristorante", "uno studio medico". */
  conArticolo: string;
  /** Chi prenota: "cliente", "paziente", "ospite". */
  chi: string;
  /** Come si chiama una prenotazione in questa attività, per le frasi. */
  evento: { singolare: string; plurale: string; articolo: string; femminile: boolean };
  /** La domanda sul servizio, sul telefono del cliente. */
  domandaServizio: string;
  servizi: Servizio[];
  /** Numero di persone, se conta: "4 coperti". */
  persone?: { singolare: string; plurale: string; massimo: number };
  /** Quante prenotazioni ci stanno nello stesso orario (tavoli, poltrone). */
  posti: number;
  /** Giorni della settimana di chiusura: 0 = domenica, 1 = lunedì… */
  chiuso: number[];
  esempi: Esempio[];
  /** Il giorno aperto da riempire tutto, per far vedere "pieno" al cliente. */
  giornoPieno: number;
}

/** I nomi delle prenotazioni di esempio. */
export const nomiDiEsempio = [
  'Rosa',
  'Marco',
  'Lucia',
  'Paolo',
  'Elena',
  'Teresa',
  'Luca',
  'Anna',
  'Giorgio',
  'Pietro',
  'Chiara',
  'Davide',
  'Irene',
  'Matteo',
  'Sofia',
  'Franco',
];

const orariParrucchiere = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00'];
const orariEstetica = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const orariMedico = ['08:30', '09:30', '10:30', '11:30', '15:00', '16:00', '17:00', '18:00'];
const orariStudio = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'];

/** Più servizi con gli stessi orari: "Taglio", "Piega"… */
const conOrari = (orari: string[], ...nomi: string[]): Servizio[] =>
  nomi.map((nome) => ({ nome, orari }));

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
    domandaServizio: 'Pranzo o cena?',
    servizi: [
      { nome: 'Pranzo', orari: ['12:30', '13:30'] },
      { nome: 'Cena', orari: ['19:30', '20:30', '21:30'] },
    ],
    persone: { singolare: 'coperto', plurale: 'coperti', massimo: 12 },
    posti: 2,
    chiuso: [1],
    esempi: [
      {
        aperto: 0,
        ora: '13:30',
        nome: 'Rosa',
        servizio: 'Pranzo',
        persone: 2,
        stato: 'completata',
      },
      { aperto: 0, ora: '19:30', nome: 'Marco', servizio: 'Cena', persone: 6, stato: 'confermata' },
      { aperto: 0, ora: '20:30', nome: 'Lucia', servizio: 'Cena', persone: 4, stato: 'confermata' },
      { aperto: 0, ora: '21:30', nome: 'Paolo', servizio: 'Cena', persone: 2, stato: 'richiesta' },
      { aperto: 1, ora: '20:30', nome: 'Elena', servizio: 'Cena', persone: 8, stato: 'confermata' },
      { aperto: 1, ora: '19:30', nome: 'Teresa', servizio: 'Cena', persone: 3, stato: 'richiesta' },
      { aperto: 2, ora: '12:30', nome: 'Luca', servizio: 'Pranzo', persone: 5, stato: 'richiesta' },
    ],
    giornoPieno: 4,
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
    domandaServizio: 'Che servizio?',
    servizi: conOrari(orariParrucchiere, 'Taglio', 'Piega', 'Taglio e piega', 'Colore', 'Barba'),
    posti: 1,
    chiuso: [0, 1],
    esempi: [
      { aperto: 0, ora: '09:00', nome: 'Anna', servizio: 'Taglio', stato: 'completata' },
      { aperto: 0, ora: '11:00', nome: 'Giorgio', servizio: 'Barba', stato: 'confermata' },
      { aperto: 0, ora: '16:00', nome: 'Chiara', servizio: 'Colore', stato: 'richiesta' },
      { aperto: 1, ora: '10:00', nome: 'Pietro', servizio: 'Taglio', stato: 'confermata' },
      { aperto: 1, ora: '17:00', nome: 'Davide', servizio: 'Taglio e piega', stato: 'richiesta' },
      { aperto: 2, ora: '15:00', nome: 'Irene', servizio: 'Piega', stato: 'confermata' },
    ],
    giornoPieno: 3,
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
    domandaServizio: 'Che trattamento?',
    servizi: conOrari(
      orariEstetica,
      'Pulizia del viso',
      'Manicure',
      'Pedicure',
      'Ceretta',
      'Massaggio',
    ),
    posti: 1,
    chiuso: [0],
    esempi: [
      { aperto: 0, ora: '09:00', nome: 'Rosa', servizio: 'Pulizia del viso', stato: 'completata' },
      { aperto: 0, ora: '11:00', nome: 'Teresa', servizio: 'Manicure', stato: 'confermata' },
      { aperto: 0, ora: '16:00', nome: 'Elena', servizio: 'Massaggio', stato: 'richiesta' },
      { aperto: 1, ora: '10:00', nome: 'Sofia', servizio: 'Ceretta', stato: 'confermata' },
      { aperto: 1, ora: '15:00', nome: 'Chiara', servizio: 'Pedicure', stato: 'richiesta' },
    ],
    giornoPieno: 3,
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
    domandaServizio: 'Cosa vuoi prenotare?',
    servizi: [
      { nome: 'Pranzo', orari: ['12:30', '13:30'] },
      { nome: 'Degustazione', orari: ['17:00'] },
      { nome: 'Cena', orari: ['19:30', '20:30'] },
    ],
    persone: { singolare: 'persona', plurale: 'persone', massimo: 10 },
    posti: 2,
    chiuso: [2],
    esempi: [
      {
        aperto: 0,
        ora: '12:30',
        nome: 'Luca',
        servizio: 'Pranzo',
        persone: 4,
        stato: 'completata',
      },
      {
        aperto: 0,
        ora: '17:00',
        nome: 'Anna',
        servizio: 'Degustazione',
        persone: 6,
        stato: 'confermata',
      },
      { aperto: 0, ora: '20:30', nome: 'Marco', servizio: 'Cena', persone: 2, stato: 'richiesta' },
      {
        aperto: 1,
        ora: '19:30',
        nome: 'Franco',
        servizio: 'Cena',
        persone: 5,
        stato: 'confermata',
      },
      {
        aperto: 1,
        ora: '12:30',
        nome: 'Irene',
        servizio: 'Pranzo',
        persone: 3,
        stato: 'richiesta',
      },
    ],
    giornoPieno: 4,
  },

  'studio-medico': {
    id: 'studio-medico',
    nome: 'Studio medico',
    conArticolo: 'uno studio medico',
    chi: 'paziente',
    evento: { singolare: 'visita', plurale: 'visite', articolo: 'la ', femminile: true },
    domandaServizio: 'Che visita?',
    servizi: conOrari(
      orariMedico,
      'Prima visita',
      'Controllo',
      'Pulizia dei denti',
      'Certificato',
      'Medicazione',
    ),
    posti: 1,
    chiuso: [0, 6],
    esempi: [
      { aperto: 0, ora: '08:30', nome: 'Pietro', servizio: 'Controllo', stato: 'completata' },
      {
        aperto: 0,
        ora: '10:30',
        nome: 'Davide',
        servizio: 'Pulizia dei denti',
        stato: 'confermata',
      },
      { aperto: 0, ora: '17:00', nome: 'Marco', servizio: 'Medicazione', stato: 'richiesta' },
      { aperto: 1, ora: '09:30', nome: 'Paolo', servizio: 'Certificato', stato: 'confermata' },
      { aperto: 1, ora: '16:00', nome: 'Luca', servizio: 'Prima visita', stato: 'richiesta' },
    ],
    giornoPieno: 3,
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
    domandaServizio: 'Per cosa?',
    servizi: conOrari(
      orariStudio,
      'Prima consulenza',
      'Dichiarazione dei redditi',
      'Firma documenti',
      'Aggiornamento pratica',
    ),
    posti: 1,
    chiuso: [0, 6],
    esempi: [
      {
        aperto: 0,
        ora: '09:00',
        nome: 'Giorgio',
        servizio: 'Firma documenti',
        stato: 'completata',
      },
      {
        aperto: 0,
        ora: '11:00',
        nome: 'Chiara',
        servizio: 'Dichiarazione dei redditi',
        stato: 'confermata',
      },
      { aperto: 0, ora: '16:00', nome: 'Matteo', servizio: 'Prima consulenza', stato: 'richiesta' },
      {
        aperto: 1,
        ora: '10:00',
        nome: 'Lucia',
        servizio: 'Aggiornamento pratica',
        stato: 'confermata',
      },
      { aperto: 1, ora: '15:00', nome: 'Elena', servizio: 'Prima consulenza', stato: 'richiesta' },
    ],
    giornoPieno: 3,
  },
};

export const ordineAttivita: IdAttivita[] = [
  'ristorante',
  'parrucchiere',
  'centro-estetico',
  'agriturismo',
  'studio-medico',
  'studio-professionale',
];
