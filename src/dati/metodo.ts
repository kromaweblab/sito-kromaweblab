// Come lavoriamo: i passi dal primo contatto alla consegna, e cosa succede
// dopo. Fatti forniti da Andrea (29/09/2026), portati al "voi" della nuova
// veste (04/10/2026). Li usano la home e /gestionali: si scrivono una volta
// sola qui.

import { sito } from './sito';

export interface Passo {
  titolo: string;
  testo: string;
}

export const passi: Passo[] = [
  {
    titolo: 'Ci fate vedere come lavorate',
    testo: `Rispondiamo entro ${sito.tempoRisposta} e ci incontriamo ${sito.colloquio}, come preferite.`,
  },
  {
    titolo: 'Vi mandiamo una proposta',
    testo: 'Pensiamo lo strumento adatto alla vostra attività: cosa faremmo e quanto costa.',
  },
  {
    titolo: 'Se vi convince, iniziamo',
    testo: 'Lavoriamo sulla proposta che avete accettato.',
  },
  {
    titolo: 'Vi mostriamo una prima versione',
    testo: 'Ve la facciamo vedere prima della consegna.',
  },
  {
    titolo: 'Consegna e formazione',
    testo: 'Mostriamo come si usa a chi lo userà: la prima formazione è compresa.',
  },
];

/** Cosa sappiamo dire, con certezza, su come funziona un nostro gestionale. */
export const fattiGestionale = {
  installazione:
    "Non va installato niente: si apre dal browser, come un sito. Se volete, lo aggiungete alla schermata del telefono o al computer e si apre come un'app.",
  // Chi acquista server e dominio non è ancora deciso (Andrea, 11/10/2026):
  // lo stesso punto su /siti è [DA DEFINIRE].
  dati: 'I dati stanno in un database su un server sicuro, e si entra con nome utente e password. [DA DEFINIRE] chi acquista server e dominio, e a nome di chi.',
  formazione: 'Una prima formazione a chi lo userà è compresa.',
  dopo: 'Dopo la consegna facciamo assistenza e modifiche, a pagamento: è la manutenzione.',
};

export interface Domanda {
  domanda: string;
  risposta: string;
}

/**
 * Le domande frequenti di /gestionali, al voi. Stesso testo nella pagina e
 * nei dati strutturati per Google (FAQPage), così le due cose non possono
 * divergere.
 */
export const domandeGestionali: Domanda[] = [
  { domanda: 'Bisogna installare qualcosa?', risposta: fattiGestionale.installazione },
  { domanda: 'Dove stanno i dati?', risposta: fattiGestionale.dati },
  {
    domanda: 'Chi lo userà deve imparare da solo?',
    risposta: `No. ${fattiGestionale.formazione}`,
  },
  {
    domanda: "Che differenza c'è tra l'app pronta e il gestionale su misura?",
    risposta:
      "L'app di prenotazione è quella che potete provare qui, preparata con il vostro nome, i vostri colori, il vostro logo, i vostri servizi e orari. Il gestionale su misura lo costruiamo da capo per la vostra attività, come servizio in più: le schermate, le regole e i collegamenti che vi servono.",
  },
  { domanda: 'E dopo la consegna?', risposta: fattiGestionale.dopo },
  {
    domanda: 'Quanto costa?',
    risposta:
      'Dipende da cosa vi serve: ogni attività è diversa. Ve lo diciamo nella proposta, dopo il primo incontro.',
  },
];
