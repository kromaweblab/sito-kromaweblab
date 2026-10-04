// I lavori mostrati sul sito. Nomi e loghi veri: abbiamo il consenso dei
// clienti. Il primo è quello in evidenza in home.
//
// I loghi stanno in src/assets/lavori/ (non in public/): così Astro li
// ottimizza e li serve nella misura giusta per ogni schermo.

import type { ImageMetadata } from 'astro';
import logoVivai from '../assets/lavori/vivai-cintoli.png';
import logoCasale from '../assets/lavori/casale-allibrio.svg';
import logoEstro from '../assets/lavori/estro-atelier.png';

export interface Lavoro {
  id: string;
  nome: string;
  href: string;
  /** Tipo di lavoro, scritto piccolo accanto al nome. */
  tipo: string;
  descrizione: string;
  /** Logo del cliente, nei suoi colori originali. */
  logo: ImageMetadata;
}

export const lavori: Lavoro[] = [
  {
    id: 'vivai-cintoli',
    nome: 'Vivai Cintoli',
    href: '/lavori/vivai-cintoli',
    tipo: 'gestionale su misura',
    logo: logoVivai,
    descrizione:
      "Un'app che collega chi lavora in vivaio e nei cantieri con chi sta in ufficio. Niente più rapporti su WhatsApp né ore sommate a mano.",
  },
  {
    id: 'casale-allibrio',
    nome: 'Casale Allibrio',
    href: '/lavori/casale-allibrio',
    tipo: 'sito web',
    logo: logoCasale,
    descrizione: 'Il sito di un agriturismo, rifatto da capo.',
  },
  {
    id: 'estro-atelier',
    nome: 'Estrò Atelier',
    href: '/lavori/estro-atelier',
    tipo: 'sito web',
    logo: logoEstro,
    descrizione: 'Il sito di un negozio di abiti da sposa.',
  },
];

/** Dati veri sull'uso dell'app di Vivai Cintoli (forniti da Giovanni, 28/09/2026). */
export const usoVivai = {
  inUsoDa: 'settembre 2026',
  /** Account Operatore: circa 20-25. */
  operatori: '20-25',
  /** 2 account Ufficio e 3 Admin. */
  ufficio: '5 persone',
};
