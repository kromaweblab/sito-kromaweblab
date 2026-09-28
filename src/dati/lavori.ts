// I lavori mostrati sul sito. Nomi veri: abbiamo il consenso dei clienti.
// Il primo è quello in evidenza in home.

export interface Lavoro {
  id: string;
  nome: string;
  href: string;
  /** Tipo di lavoro, scritto piccolo accanto al nome. */
  tipo: string;
  descrizione: string;
}

export const lavori: Lavoro[] = [
  {
    id: 'vivai-cintoli',
    nome: 'Vivai Cintoli',
    href: '/lavori/vivai-cintoli',
    tipo: 'gestionale su misura',
    descrizione:
      "Un'app che collega chi lavora in vivaio e nei cantieri con chi sta in ufficio. Niente più rapporti su WhatsApp né ore sommate a mano.",
  },
  {
    id: 'casale-allibrio',
    nome: 'Casale Allibrio',
    href: '/lavori/casale-allibrio',
    tipo: 'sito web',
    descrizione: 'Il sito di un agriturismo, rifatto da capo.',
  },
  {
    id: 'estro-atelier',
    nome: 'Estrò Atelier',
    href: '/lavori/estro-atelier',
    tipo: 'sito web',
    descrizione: 'Il sito di un negozio di abiti da sposa.',
  },
];

/** Dati veri sull'uso dell'app di Vivai Cintoli (forniti da Giovanni, 28/09/2026). */
export const usoVivai = {
  inUsoDa: 'settembre 2026',
  persone: 'una ventina di operatori, 2 persone in ufficio, 3 amministratori',
};
