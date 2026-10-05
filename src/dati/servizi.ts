// I servizi, in ordine di importanza, e i lavori di tutti i giorni che un
// gestionale toglie di mezzo. Stessi dati per la sezione "Cosa facciamo"
// della home e per /servizi: si scrivono una volta sola qui.

import { usoVivai } from './lavori';

/**
 * I lavori di tutti i giorni che risolviamo, ognuno col suo servizio.
 * Li usa la pagina /servizi.
 */
export interface Lavoro {
  lavoro: string;
  dettaglio: string;
  /** Gestionali e web app ora sono un servizio solo: /servizi li mostra insieme. */
  servizio: 'gestionali' | 'web-app' | 'siti';
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
 * lavori e la manutenzione che si aggiunge a entrambi. Li usano la sezione
 * "Cosa facciamo" della home e /servizi. Ogni punto è una cosa vera, non uno
 * slogan.
 */
export interface Offerta {
  id: 'gestionali' | 'siti' | 'manutenzione';
  nome: string;
  /** Nome corto, per le linguette di "Cosa facciamo" (da telefono). */
  breve: string;
  href: string;
  frase: string;
  punti: string[];
  /** Testo del link verso la pagina del servizio. */
  invito: string;
  /** Il riquadro accanto in "Cosa facciamo": un esempio vero o un limite. */
  nota: { titolo: string; testo: string; link: { testo: string; href: string } | null };
}

export const offerta: Offerta[] = [
  {
    id: 'gestionali',
    nome: 'Gestionali e web app su misura',
    breve: 'Gestionali',
    href: '/gestionali',
    frase:
      "Il lavoro che oggi tenete su Excel, WhatsApp e quaderni, in un'app sola per tutta la squadra.",
    punti: [
      "si installa sul telefono e sul computer come un'app",
      'può funzionare anche senza rete, sul campo',
      'ognuno vede solo quello che gli serve',
      'la prima formazione è compresa',
    ],
    invito: 'Come funzionano i gestionali',
    nota: {
      titolo: 'Un esempio vero',
      testo: `Vivai Cintoli: ${usoVivai.operatori} operatori mandano il rapporto dal telefono, e in ufficio le ore arrivano già sommate.`,
      link: { testo: 'Vedi il lavoro', href: '/lavori/vivai-cintoli' },
    },
  },
  {
    id: 'siti',
    nome: 'Siti web',
    breve: 'Siti',
    href: '/siti',
    frase: 'Per farvi trovare da chi vi cerca: chi siete, cosa fate, come contattarvi.',
    punti: [
      'testi scritti insieme a voi',
      'pensati per chi vi cerca in zona su Google',
      'telefono e WhatsApp a un tocco dal telefono',
    ],
    invito: 'Come facciamo i siti',
    nota: {
      titolo: 'Due esempi veri',
      testo:
        'Il sito di un agriturismo, Casale Allibrio, e quello di un atelier di abiti da sposa, Estrò Atelier.',
      link: { testo: 'Vedi i lavori', href: '/lavori' },
    },
  },
  {
    id: 'manutenzione',
    nome: 'Manutenzione',
    breve: 'Manutenzione',
    href: '/manutenzione',
    frase:
      'Dopo la consegna restiamo noi: aggiornamenti, modifiche e assistenza, con un contratto chiaro. Si aggiunge a un gestionale o a un sito.',
    punti: [
      'aggiornamenti e controlli',
      'piccole modifiche a testi, foto e orari',
      'assistenza diretta da Giovanni o Andrea',
      'copie di sicurezza dei dati dei gestionali',
    ],
    invito: 'Come funziona la manutenzione',
    nota: {
      titolo: 'Cosa resta fuori',
      testo:
        'Una funzione nuova o un cambiamento grande è un lavoro a parte: prima ne parliamo, poi lo concordiamo.',
      link: null,
    },
  },
];
