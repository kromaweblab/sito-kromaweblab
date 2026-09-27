// Logica del gestionale dimostrativo: solo funzioni pure, senza React.
// Il componente la usa con useReducer; i test stanno in logica.test.ts.
//
// Niente date vere qui dentro: i giorni sono relativi (0 = oggi) perché
// il componente viene disegnato sia alla build sia nel browser, e i due
// disegni devono coincidere (vedi DECISIONI.md).

import { attivita, type Attivita, type IdAttivita } from './attivita';

export type Stato = 'richiesta' | 'confermata' | 'completata';

export type Giorno = 0 | 1 | 2;
export const giorni: Giorno[] = [0, 1, 2];
export const nomiGiorni: Record<Giorno, string> = { 0: 'Oggi', 1: 'Domani', 2: 'Dopodomani' };

export interface Prenotazione {
  id: string;
  giorno: Giorno;
  /** "20:30" */
  ora: string;
  nome: string;
  quanti?: number;
  dove?: string;
  cosa?: string;
  stato: Stato;
}

/** Quello che arriva dal modulo "aggiungi". */
export type DatiNuova = Omit<Prenotazione, 'id' | 'stato'>;

export interface StatoLavagna {
  attivita: IdAttivita;
  prenotazioni: Prenotazione[];
  giorno: Giorno;
  /** La riga che spiega in italiano semplice cosa è appena successo. */
  spiegazione: string;
  /** Contatore per gli id delle prenotazioni aggiunte: così resta tutto puro. */
  prossimoId: number;
}

export type Azione =
  | { tipo: 'scegliAttivita'; attivita: IdAttivita }
  | { tipo: 'scegliGiorno'; giorno: Giorno }
  | { tipo: 'aggiungi'; dati: DatiNuova }
  | { tipo: 'avanza'; id: string }
  | { tipo: 'elimina'; id: string };

export function statoSuccessivo(stato: Stato): Stato | null {
  if (stato === 'richiesta') return 'confermata';
  if (stato === 'confermata') return 'completata';
  return null;
}

export function statoIniziale(id: IdAttivita = 'ristorante'): StatoLavagna {
  const a = attivita[id];
  return {
    attivita: id,
    prenotazioni: a.esempi.map((p) => ({ ...p })),
    giorno: 0,
    spiegazione: spiegaInizio(a),
    prossimoId: 1,
  };
}

export function aggiornaLavagna(stato: StatoLavagna, azione: Azione): StatoLavagna {
  const a = attivita[stato.attivita];

  switch (azione.tipo) {
    case 'scegliAttivita':
      return { ...statoIniziale(azione.attivita), prossimoId: stato.prossimoId };

    case 'scegliGiorno':
      return {
        ...stato,
        giorno: azione.giorno,
        spiegazione: spiegaGiorno(
          a,
          prenotazioniDelGiorno(stato.prenotazioni, azione.giorno),
          azione.giorno,
        ),
      };

    case 'aggiungi': {
      // Il componente controlla già il modulo; qui si ricontrolla perché
      // la logica non deve mai accettare dati sbagliati.
      if (Object.keys(controllaNuova(azione.dati, a)).length > 0) return stato;
      const nuova = pulisciNuova(azione.dati, a, `n${stato.prossimoId}`);
      return {
        ...stato,
        prenotazioni: [...stato.prenotazioni, nuova],
        // Si passa al giorno della nuova prenotazione, altrimenti sparirebbe.
        giorno: nuova.giorno,
        spiegazione: spiegaAggiunta(a, nuova),
        prossimoId: stato.prossimoId + 1,
      };
    }

    case 'avanza': {
      const vecchia = stato.prenotazioni.find((p) => p.id === azione.id);
      const nuovoStato = vecchia && statoSuccessivo(vecchia.stato);
      if (!vecchia || !nuovoStato) return stato;
      return {
        ...stato,
        prenotazioni: stato.prenotazioni.map((p) =>
          p.id === azione.id ? { ...p, stato: nuovoStato } : p,
        ),
        spiegazione: spiegaAvanzamento(a, vecchia.nome, nuovoStato),
      };
    }

    case 'elimina': {
      const tolta = stato.prenotazioni.find((p) => p.id === azione.id);
      if (!tolta) return stato;
      return {
        ...stato,
        prenotazioni: stato.prenotazioni.filter((p) => p.id !== azione.id),
        spiegazione: spiegaEliminazione(a, tolta.nome),
      };
    }
  }
}

/** Le prenotazioni di un giorno, in ordine di orario. */
export function prenotazioniDelGiorno(
  prenotazioni: Prenotazione[],
  giorno: Giorno,
): Prenotazione[] {
  return prenotazioni.filter((p) => p.giorno === giorno).sort((x, y) => x.ora.localeCompare(y.ora));
}

// ---------------------------------------------------------------------------
// Modulo "aggiungi"

export type CampoModulo = 'nome' | 'ora' | 'quanti' | 'dove' | 'cosa';
export type ErroriModulo = Partial<Record<CampoModulo, string>>;

const orarioValido = /^([01]\d|2[0-3]):[0-5]\d$/;
export const lunghezzaMassimaNome = 40;

/** Controlla i dati del modulo. Oggetto vuoto = tutto a posto. */
export function controllaNuova(dati: DatiNuova, a: Attivita): ErroriModulo {
  const errori: ErroriModulo = {};
  const nome = dati.nome.trim();

  if (nome === '') errori.nome = `Scrivi il nome del ${a.chi}.`;
  else if (nome.length > lunghezzaMassimaNome)
    errori.nome = `Al massimo ${lunghezzaMassimaNome} caratteri.`;

  if (!orarioValido.test(dati.ora)) errori.ora = 'Scegli un orario.';

  if (a.quanti) {
    const n = dati.quanti;
    if (n === undefined || !Number.isInteger(n) || n < 1 || n > a.quanti.massimo) {
      errori.quanti = `Da 1 a ${a.quanti.massimo} ${a.quanti.plurale}.`;
    }
  }
  if (a.dove && !a.dove.scelte.includes(dati.dove ?? '')) {
    errori.dove = `Scegli ${a.dove.etichetta.toLowerCase()}.`;
  }
  if (a.cosa && !a.cosa.scelte.includes(dati.cosa ?? '')) {
    errori.cosa = `Scegli ${a.cosa.etichetta.toLowerCase()}.`;
  }
  return errori;
}

/** Tiene solo i campi che l'attività usa, con il nome ripulito dagli spazi. */
function pulisciNuova(dati: DatiNuova, a: Attivita, id: string): Prenotazione {
  return {
    id,
    giorno: dati.giorno,
    ora: dati.ora,
    nome: dati.nome.trim(),
    ...(a.quanti && { quanti: dati.quanti }),
    ...(a.dove && { dove: dati.dove }),
    ...(a.cosa && { cosa: dati.cosa }),
    stato: 'richiesta',
  };
}

// ---------------------------------------------------------------------------
// Come si mostra una prenotazione

/** "1 coperto", "4 coperti". */
export function descriviQuanti(n: number, a: Attivita): string {
  if (!a.quanti) return '';
  return `${n} ${n === 1 ? a.quanti.singolare : a.quanti.plurale}`;
}

/** "Tavolo 7", "con Giulia". */
export function descriviDove(valore: string, a: Attivita): string {
  return a.dove?.prefisso ? `${a.dove.prefisso} ${valore}` : valore;
}

// ---------------------------------------------------------------------------
// La riga di spiegazione. Dice cosa è successo e cosa si risparmia, senza
// promettere funzioni che la demo non ha (niente "il cliente riceve un SMS").

/** Desinenza al singolare: confermat-a / confermat-o. */
const fin = (a: Attivita) => (a.evento.femminile ? 'a' : 'o');
/** "La prenotazione", "L'appuntamento". */
const soggetto = (a: Attivita) => maiuscola(`${a.evento.articolo}${a.evento.singolare}`);
const maiuscola = (testo: string) => testo.charAt(0).toUpperCase() + testo.slice(1);

function spiegaInizio(a: Attivita): string {
  const [pronome, articoloPlurale] = a.evento.femminile ? ['una', 'le'] : ['uno', 'gli'];
  return (
    `Questa è la lavagna di ${a.conArticolo}, con ${articoloPlurale} ` +
    `${a.evento.plurale} dei prossimi tre giorni. Prova a confermare una richiesta o ad aggiungerne ${pronome}.`
  );
}

function spiegaGiorno(a: Attivita, delGiorno: Prenotazione[], giorno: Giorno): string {
  const quando = nomiGiorni[giorno];
  if (delGiorno.length === 0) return `${quando} non c'è ancora niente in lista.`;
  const totale = `${delGiorno.length} ${delGiorno.length === 1 ? a.evento.singolare : a.evento.plurale}`;
  const richieste = delGiorno.filter((p) => p.stato === 'richiesta').length;
  const daConfermare =
    richieste === 0
      ? 'nessuna richiesta da confermare'
      : `${richieste} ${richieste === 1 ? 'richiesta' : 'richieste'} da confermare`;
  return `${quando}: ${totale}, ${daConfermare}.`;
}

function spiegaAggiunta(a: Attivita, p: Prenotazione): string {
  const pronome = a.evento.femminile ? 'la' : 'lo';
  return (
    `Nuov${fin(a)} ${a.evento.singolare} per ${nomiGiorni[p.giorno].toLowerCase()} alle ${p.ora}: ` +
    `${p.nome}. Resta una richiesta finché non ${pronome} confermi.`
  );
}

function spiegaAvanzamento(a: Attivita, nome: string, nuovoStato: Stato): string {
  if (nuovoStato === 'confermata') {
    return (
      `${soggetto(a)} di ${nome} è confermat${fin(a)}: a colpo d'occhio sai che è sicur${fin(a)}, ` +
      `senza sfogliare il quaderno.`
    );
  }
  const [quante, fatte] = a.evento.femminile ? ['quante', 'fatte'] : ['quanti', 'fatti'];
  return (
    `${soggetto(a)} di ${nome} è completat${fin(a)}. Resta nell'elenco: ` +
    `a fine mese sai ${quante} ne hai ${fatte}.`
  );
}

function spiegaEliminazione(a: Attivita, nome: string): string {
  return `${soggetto(a)} di ${nome} è cancellat${fin(a)}: sparisce dalla lista, senza cancellature sul quaderno.`;
}
