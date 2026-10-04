// I tre servizi, in ordine di importanza. Stessi dati per l'apertura della
// home, la sezione "Cosa facciamo" e la pagina /servizi: si scrivono una
// volta sola qui.

export interface Servizio {
  /** Identificativo breve, usato negli id HTML. */
  id: 'gestionali' | 'web-app' | 'siti';
  nome: string;
  href: string;
  /** Risposta alla domanda "Cosa ti serve?" nell'apertura. */
  scelta: string;
  /** Titolo del pannello nell'apertura. */
  titolo: string;
  testo: string;
  /** Testo del link verso la pagina del servizio. */
  invito: string;
}

export const servizi: Servizio[] = [
  {
    id: 'gestionali',
    nome: 'Gestionali',
    href: '/gestionali',
    scelta: 'Meno fogli e messaggi da ricopiare',
    titolo: 'Prenotazioni, ordini, magazzino e turni in un posto solo.',
    testo:
      'Un gestionale piccolo, fatto su come lavori già. Lo usi dal telefono e dal computer, e smetti di ricopiare le stesse cose.',
    invito: 'Come funziona un gestionale',
  },
  {
    id: 'web-app',
    nome: 'Web app su misura',
    href: '/web-app',
    scelta: "Un'app per la mia squadra",
    titolo: "Un'app che collega chi lavora fuori con chi sta in ufficio.",
    testo:
      'Rapporti di lavoro, programma del giorno, mezzi e attrezzi. Costruita attorno a come lavora la tua squadra, come abbiamo fatto per Vivai Cintoli.',
    invito: 'Scopri le app su misura',
  },
  {
    id: 'siti',
    nome: 'Siti web',
    href: '/siti',
    scelta: 'Farmi trovare su internet',
    titolo: 'Un sito che dice chi sei, dove sei e come contattarti.',
    testo:
      "Per chi su internet non c'è ancora, o ha un sito che non lo rappresenta più. Come abbiamo fatto per Casale Allibrio ed Estrò Atelier.",
    invito: 'Scopri i siti',
  },
];

/**
 * I lavori di tutti i giorni che risolviamo, ognuno col suo servizio.
 * Li usa la
 * pagina /servizi: si scrivono una volta sola qui.
 */
export interface Lavoro {
  lavoro: string;
  dettaglio: string;
  servizio: Servizio['id'];
}

export const lavori: Lavoro[] = [
  { lavoro: 'Prenotazioni', dettaglio: 'tavoli, camere, appuntamenti', servizio: 'gestionali' },
  { lavoro: 'Ordini', dettaglio: 'dal cliente al magazzino', servizio: 'gestionali' },
  { lavoro: 'Magazzino', dettaglio: 'giacenze che si aggiornano da sole', servizio: 'gestionali' },
  { lavoro: 'Turni', dettaglio: 'chi lavora, quando, dove', servizio: 'gestionali' },
  {
    lavoro: 'La squadra',
    dettaglio: "rapporti e programma, dal campo all'ufficio",
    servizio: 'web-app',
  },
  {
    lavoro: 'Farti trovare',
    dettaglio: 'un sito che dice chi sei e come contattarti',
    servizio: 'siti',
  },
];

/**
 * Quello che vendiamo, nella nuova veste "Officina" (03/10/2026): due
 * lavori e la manutenzione che si aggiunge a entrambi. Li usa la sezione
 * Servizi della home. Ogni punto è una cosa vera, non uno slogan.
 */
export interface Offerta {
  id: 'gestionali' | 'siti' | 'manutenzione';
  nome: string;
  href: string;
  frase: string;
  punti: string[];
}

export const offerta: Offerta[] = [
  {
    id: 'gestionali',
    nome: 'Gestionali e web app su misura',
    href: '/gestionali',
    frase:
      "Il lavoro che oggi tenete su Excel, WhatsApp e quaderni, in un'app sola per tutta la squadra.",
    punti: [
      "si installa sul telefono e sul computer come un'app",
      'può funzionare anche senza rete, sul campo',
      'ognuno vede solo quello che gli serve',
      'la prima formazione è compresa',
    ],
  },
  {
    id: 'siti',
    nome: 'Siti web',
    href: '/siti',
    frase: 'Per farvi trovare da chi vi cerca: chi siete, cosa fate, come contattarvi.',
    punti: [
      'testi scritti insieme a voi',
      'pensati per chi vi cerca in zona su Google',
      'telefono e WhatsApp a un tocco dal telefono',
    ],
  },
  {
    id: 'manutenzione',
    nome: 'Manutenzione',
    href: '/manutenzione',
    frase:
      'Dopo la consegna restiamo noi: aggiornamenti, modifiche e assistenza, con un contratto chiaro. Si aggiunge a un gestionale o a un sito.',
    punti: ['[DA DEFINIRE] cosa comprende', '[DA DEFINIRE] canone'],
  },
];
