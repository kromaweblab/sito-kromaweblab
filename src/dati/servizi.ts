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
