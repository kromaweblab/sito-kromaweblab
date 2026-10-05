// I lavori mostrati sul sito. Nomi e loghi veri: abbiamo il consenso dei
// clienti. Il primo è quello in evidenza (riquadro grande in home).
// Le schermate non ci sono ancora: `schermata: null` mostra un segnaposto
// evidente dentro la cornice (telefono per le app, browser per i siti).
//
// I loghi stanno in src/assets/lavori/ (non in public/): così Astro li
// ottimizza e li serve nella misura giusta per ogni schermo.

import type { ImageMetadata } from 'astro';
import logoVivai from '../assets/lavori/vivai-cintoli.png';
import logoCasale from '../assets/lavori/casale-allibrio.svg';
import logoEstro from '../assets/lavori/estro-atelier.png';
import { DA_SCRIVERE } from './sito';

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
    schermata: null,
    indirizzo: null,
    fatti: [
      { etichetta: 'Operatori sul campo', valore: usoVivai.operatori },
      { etichetta: 'In ufficio', valore: usoVivai.ufficio },
      { etichetta: 'In uso da', valore: usoVivai.inUsoDa },
    ],
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
  },
];

/** Testo del segnaposto nella cornice, finché la schermata non c'è. */
export const segnapostoSchermata = (lavoro: Lavoro) =>
  `${DA_SCRIVERE} schermata ${lavoro.cornice === 'telefono' ? "dell'app dal telefono" : 'del sito'}`;
