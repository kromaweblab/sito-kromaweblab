// Una giornata tipo in un'attività della zona, ora per ora: lo strumento
// usato oggi e cosa succede. La usano "Una giornata tipo" in home
// (Problema.astro) e /gestionali, che mostra la stessa giornata con un
// gestionale.
//
// Le frasi "oggi" sono fatti veri (vivaio, agriturismo, un vecchio sito);
// gli orari sono indicativi. Le frasi "dopo" vengono da quello che fa
// davvero il gestionale di Vivai Cintoli; il momento del sito non ha un
// "dopo" con un gestionale (è un lavoro da sito web).

export interface Momento {
  /** "07:30" */
  ora: string;
  strumento: string;
  testo: string;
  /** La stessa cosa con un gestionale, se il gestionale la risolve. */
  dopo?: string;
}

export const giornata: Momento[] = [
  {
    ora: '07:30',
    strumento: 'WhatsApp',
    testo: 'Le prenotazioni della notte sono in chat. Vanno ricopiate nel calendario.',
    dopo: 'Le prenotazioni sono già in un posto solo, e le vedono tutti.',
  },
  {
    ora: '12:00',
    strumento: 'Messaggi',
    testo: 'Chi è in permesso domani? Si cerca tra le conversazioni.',
    dopo: 'I permessi sono segnati nel gestionale: si vede subito chi manca domani.',
  },
  {
    ora: '17:30',
    strumento: 'A voce',
    testo: 'Finito il turno, la squadra passa in ufficio a dettare cosa ha fatto.',
    dopo: 'Ognuno segna dal telefono cosa ha fatto, a fine turno.',
  },
  {
    ora: '18:30',
    strumento: 'Calcolatrice',
    testo: 'Le ore di lavoro si sommano a mano, una per una.',
    dopo: 'Le ore di lavoro si sommano da sole.',
  },
  {
    ora: '19:00',
    strumento: 'Excel',
    testo:
      'Il programma di domani si fa a memoria: chi è in permesso, quale mezzo è fermo, chi è già impegnato altrove.',
    dopo: 'Il programma di domani mostra chi è in permesso, quale mezzo è fermo e chi è già impegnato.',
  },
  {
    ora: '21:00',
    strumento: 'Il sito',
    testo: 'Un cliente cerca la tua attività su internet e trova una pagina sola, confusa.',
  },
];
