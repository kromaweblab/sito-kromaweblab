// I settori della prova "dal campo all'ufficio": per ognuno i lavori, i
// cantieri, i materiali e i dati con cui la prova parte (così non è vuota).
// Tutto di esempio: nessun cognome, nessun indirizzo vero (CLAUDE.md).

export type IdSettore = 'verde' | 'edilizia' | 'pulizie' | 'impianti';

export interface Materiale {
  nome: string;
  /** Come si scrive la quantità: "kg", "pz", "m²"… */
  unita: string;
  /** Di quanto sale o scende la quantità con + e −. */
  passo: number;
}

/** Un rapporto già arrivato in ufficio all'apertura della prova. */
export interface RapportoIniziale {
  ora: string;
  operatore: string;
  cantiere: string;
  lavoro: string;
  ore: number;
  /** Indice in `materiali` e quantità, oppure null. */
  materiale: { indice: number; quantita: number } | null;
}

export interface Settore {
  nome: string;
  lavori: string[];
  cantieri: string[];
  materiali: Materiale[];
  rapportiIniziali: RapportoIniziale[];
  /** I lavori che l'ufficio ha già assegnato a Operatore 1 per oggi. */
  compitiIniziali: { cantiere: string; lavoro: string }[];
}

/** Gli operatori della prova. Il telefono è sempre quello del primo. */
export const operatori = ['Operatore 1', 'Operatore 2', 'Operatore 3', 'Operatore 4'];
export const operatoreDelTelefono = operatori[0]!;
export const squadraDelTelefono = 'squadra A';

export const ordineSettori: IdSettore[] = ['verde', 'edilizia', 'pulizie', 'impianti'];

export const settori: Record<IdSettore, Settore> = {
  verde: {
    nome: 'Verde e giardini',
    lavori: ['Potatura', 'Taglio prato', 'Irrigazione', 'Trapianto'],
    cantieri: ['Villa al mare', 'Condominio Le Palme', 'Serra 2'],
    materiali: [
      { nome: 'Concime', unita: 'kg', passo: 1 },
      { nome: 'Piante', unita: 'pz', passo: 5 },
    ],
    rapportiIniziali: [
      {
        ora: '07:40',
        operatore: 'Operatore 2',
        cantiere: 'Villa al mare',
        lavoro: 'Taglio prato',
        ore: 3,
        materiale: null,
      },
      {
        ora: '09:15',
        operatore: 'Operatore 3',
        cantiere: 'Condominio Le Palme',
        lavoro: 'Potatura',
        ore: 2,
        materiale: { indice: 0, quantita: 4 },
      },
      {
        ora: '10:30',
        operatore: 'Operatore 4',
        cantiere: 'Villa al mare',
        lavoro: 'Trapianto',
        ore: 1.5,
        materiale: { indice: 1, quantita: 20 },
      },
    ],
    compitiIniziali: [
      { cantiere: 'Serra 2', lavoro: 'Irrigazione' },
      { cantiere: 'Condominio Le Palme', lavoro: 'Taglio prato' },
    ],
  },
  edilizia: {
    nome: 'Edilizia',
    lavori: ['Massetto', 'Intonaco', 'Posa piastrelle'],
    cantieri: ['Casa al mare', 'Palazzina A', 'Negozio in centro'],
    materiali: [
      { nome: 'Cemento', unita: 'sacchi', passo: 1 },
      { nome: 'Piastrelle', unita: 'm²', passo: 2 },
    ],
    rapportiIniziali: [
      {
        ora: '07:30',
        operatore: 'Operatore 2',
        cantiere: 'Palazzina A',
        lavoro: 'Massetto',
        ore: 4,
        materiale: { indice: 0, quantita: 6 },
      },
      {
        ora: '09:00',
        operatore: 'Operatore 3',
        cantiere: 'Casa al mare',
        lavoro: 'Intonaco',
        ore: 3,
        materiale: null,
      },
      {
        ora: '10:45',
        operatore: 'Operatore 4',
        cantiere: 'Palazzina A',
        lavoro: 'Posa piastrelle',
        ore: 2,
        materiale: { indice: 1, quantita: 12 },
      },
    ],
    compitiIniziali: [
      { cantiere: 'Negozio in centro', lavoro: 'Posa piastrelle' },
      { cantiere: 'Casa al mare', lavoro: 'Intonaco' },
    ],
  },
  pulizie: {
    nome: 'Pulizie',
    lavori: ['Pulizia ordinaria', 'Vetri', 'Sanificazione'],
    cantieri: ['Uffici in centro', 'Condominio Aurora', 'Scuola'],
    materiali: [
      { nome: 'Detergente', unita: 'l', passo: 1 },
      { nome: 'Sacchi', unita: 'pz', passo: 5 },
    ],
    rapportiIniziali: [
      {
        ora: '06:30',
        operatore: 'Operatore 2',
        cantiere: 'Uffici in centro',
        lavoro: 'Pulizia ordinaria',
        ore: 2,
        materiale: { indice: 0, quantita: 2 },
      },
      {
        ora: '08:00',
        operatore: 'Operatore 3',
        cantiere: 'Scuola',
        lavoro: 'Sanificazione',
        ore: 3,
        materiale: { indice: 0, quantita: 3 },
      },
      {
        ora: '10:15',
        operatore: 'Operatore 4',
        cantiere: 'Condominio Aurora',
        lavoro: 'Vetri',
        ore: 1.5,
        materiale: { indice: 1, quantita: 10 },
      },
    ],
    compitiIniziali: [
      { cantiere: 'Condominio Aurora', lavoro: 'Pulizia ordinaria' },
      { cantiere: 'Uffici in centro', lavoro: 'Vetri' },
    ],
  },
  impianti: {
    nome: 'Impianti',
    lavori: ['Impianto elettrico', 'Caldaia', 'Quadro elettrico'],
    cantieri: ['Appartamento 3B', 'Negozio', 'Capannone'],
    materiali: [
      { nome: 'Cavo', unita: 'm', passo: 5 },
      { nome: 'Interruttori', unita: 'pz', passo: 1 },
    ],
    rapportiIniziali: [
      {
        ora: '08:00',
        operatore: 'Operatore 2',
        cantiere: 'Capannone',
        lavoro: 'Impianto elettrico',
        ore: 4,
        materiale: { indice: 0, quantita: 40 },
      },
      {
        ora: '09:30',
        operatore: 'Operatore 3',
        cantiere: 'Appartamento 3B',
        lavoro: 'Caldaia',
        ore: 2,
        materiale: null,
      },
      {
        ora: '10:50',
        operatore: 'Operatore 4',
        cantiere: 'Negozio',
        lavoro: 'Quadro elettrico',
        ore: 1.5,
        materiale: { indice: 1, quantita: 6 },
      },
    ],
    compitiIniziali: [
      { cantiere: 'Negozio', lavoro: 'Impianto elettrico' },
      { cantiere: 'Appartamento 3B', lavoro: 'Quadro elettrico' },
    ],
  },
};
