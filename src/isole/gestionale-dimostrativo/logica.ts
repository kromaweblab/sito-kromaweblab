// Logica della prova "dal cliente all'attività": solo funzioni pure, senza
// React. La usano i componenti; i test sono in logica.test.ts.
//
// Le date non si salvano come date ma come "giorno": quanti giorni dopo
// oggi (0 = oggi, -1 = ieri). Così la prova funziona qualunque sia oggi, e
// quando nel browser arriva la data vera basta rifare gli esempi.

import { attivita, nomiDiEsempio, type Attivita, type IdAttivita, type Stato } from './attivita';

export type { Stato };

/** Il cliente prenota da domani fino a quattro settimane da oggi. */
export const ultimoGiornoPrenotabile = 28;
/** Il nome dell'attività scritto dal visitatore. */
export const lunghezzaMassimaNome = 30;
/** Il nome di chi prenota. */
export const lunghezzaMassimaNomeCliente = 40;

export interface Prenotazione {
  id: string;
  giorno: number;
  /** "20:30" */
  ora: string;
  nome: string;
  servizio: string;
  persone?: number;
  stato: Stato;
  /** Arrivata dal telefono del cliente, non scritta dall'attività. */
  daCliente?: boolean;
}

// ---------------------------------------------------------------------------
// Il colore dell'app
//
// Il visitatore sceglie un colore qualsiasi. Perché resti tutto leggibile
// (WCAG AA), da quel colore se ne calcolano altri due: il testo da mettere
// sopra (chiaro o scuro) e una versione scurita per le scritte colorate sul
// fondo chiaro dell'app.

/** Uguale al token --kroma-app-tema in tokens.css (lo controlla un test). */
export const colorePredefinito = '#1d4ed8';

const canali = (colore: string) => [1, 3, 5].map((i) => parseInt(colore.slice(i, i + 2), 16) / 255);

/** Luminanza relativa, come la definisce la WCAG. */
function luminanza(colore: string): number {
  const [r, g, b] = canali(colore).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  ) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Il rapporto di contrasto WCAG tra due colori: da 1 a 21. */
export function contrasto(a: string, b: string): number {
  const [chiaro, scuro] = [luminanza(a), luminanza(b)].sort((x, y) => y - x) as [number, number];
  return (chiaro + 0.05) / (scuro + 0.05);
}

/** Sopra il colore va il testo chiaro o quello scuro: quello che si legge meglio. */
export function testoSuColore(colore: string): 'chiaro' | 'scuro' {
  return contrasto(colore, '#ffffff') >= contrasto(colore, '#000000') ? 'chiaro' : 'scuro';
}

/**
 * Il colore per le scritte sul fondo chiaro: lo stesso, scurito a piccoli
 * passi finché sul bianco arriva a 5,6:1 (così sul fondo dell'app, appena
 * più scuro del bianco, resta sopra 5:1).
 */
export function coloreLeggibile(colore: string): string {
  let [r, g, b] = canali(colore);
  const esadecimale = () =>
    '#' +
    [r, g, b]
      .map((c) =>
        Math.round(c * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('');
  while (contrasto(esadecimale(), '#ffffff') < 5.6) {
    [r, g, b] = [r * 0.92, g * 0.92, b * 0.92];
  }
  return esadecimale();
}

// ---------------------------------------------------------------------------
// Date

// Scritti a mano invece di Intl: ogni browser formatta le date a modo suo,
// e qui serve sempre la stessa forma.
const giorniSettimana = [
  'Domenica',
  'Lunedì',
  'Martedì',
  'Mercoledì',
  'Giovedì',
  'Venerdì',
  'Sabato',
];
const mesi = [
  'gennaio',
  'febbraio',
  'marzo',
  'aprile',
  'maggio',
  'giugno',
  'luglio',
  'agosto',
  'settembre',
  'ottobre',
  'novembre',
  'dicembre',
];

/** La data vera di un giorno: new Date(anno, mese, 32) passa da solo al mese dopo. */
export function dataDi(oggi: Date, giorno: number): Date {
  return new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate() + giorno);
}

/** Quanti mesi dopo quello di oggi cade un giorno (0 = questo mese). */
export function mesiDopo(oggi: Date, giorno: number): number {
  const d = dataDi(oggi, giorno);
  return (d.getFullYear() - oggi.getFullYear()) * 12 + d.getMonth() - oggi.getMonth();
}

/** "Martedì 13 ottobre" */
export function dataCorta(oggi: Date, giorno: number): string {
  const d = dataDi(oggi, giorno);
  return `${giorniSettimana[d.getDay()]} ${d.getDate()} ${mesi[d.getMonth()]}`;
}

/** "Martedì 13 ottobre 2026" */
export function dataEstesa(oggi: Date, giorno: number): string {
  return `${dataCorta(oggi, giorno)} ${dataDi(oggi, giorno).getFullYear()}`;
}

export function giornoChiuso(a: Attivita, oggi: Date, giorno: number): boolean {
  return a.chiuso.includes(dataDi(oggi, giorno).getDay());
}

/** Una casella del calendario: il numero del giorno e quanti giorni dopo oggi. */
export interface Cella {
  numero: number;
  giorno: number;
}

/**
 * Il mese da mostrare nel calendario: 0 = il mese di oggi, 1 = il dopo.
 * Settimane da lunedì a domenica, con caselle vuote (null) prima del primo
 * giorno e dopo l'ultimo.
 */
export function mese(oggi: Date, spostamento: number) {
  const primo = new Date(oggi.getFullYear(), oggi.getMonth() + spostamento, 1);
  const quanti = new Date(primo.getFullYear(), primo.getMonth() + 1, 0).getDate();
  const mezzanotte = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate()).getTime();
  // getDay() conta da domenica: spostiamo perché la settimana parta da lunedì.
  const vuotePrima = (primo.getDay() + 6) % 7;

  const celle: (Cella | null)[] = Array.from({ length: vuotePrima }, () => null);
  for (let numero = 1; numero <= quanti; numero++) {
    const data = new Date(primo.getFullYear(), primo.getMonth(), numero).getTime();
    // Math.round: con il cambio dell'ora legale un giorno dura 23 o 25 ore.
    celle.push({ numero, giorno: Math.round((data - mezzanotte) / 86_400_000) });
  }
  while (celle.length % 7 !== 0) celle.push(null);

  const settimane: (Cella | null)[][] = [];
  for (let i = 0; i < celle.length; i += 7) settimane.push(celle.slice(i, i + 7));
  return {
    titolo: `${maiuscola(mesi[primo.getMonth()]!)} ${primo.getFullYear()}`,
    settimane,
  };
}

// ---------------------------------------------------------------------------
// Disponibilità

/** Tutti gli orari dell'attività, di tutti i servizi, in ordine. */
function tuttiGliOrari(a: Attivita): string[] {
  return [...new Set(a.servizi.flatMap((s) => s.orari))].sort();
}

const quanteAlle = (prenotazioni: Prenotazione[], giorno: number, ora: string) =>
  prenotazioni.filter((p) => p.giorno === giorno && p.ora === ora).length;

/**
 * Gli orari ancora liberi di un servizio in un giorno. I posti (tavoli,
 * poltrone) valgono per tutti i servizi insieme.
 */
export function orariLiberi(
  a: Attivita,
  prenotazioni: Prenotazione[],
  giorno: number,
  servizio: string,
): string[] {
  const s = a.servizi.find((x) => x.nome === servizio);
  if (!s) return [];
  return s.orari.filter((ora) => quanteAlle(prenotazioni, giorno, ora) < a.posti);
}

export type StatoGiorno = 'passato' | 'oggi' | 'chiuso' | 'fuori' | 'pieno' | 'libero';
export interface InfoGiorno {
  stato: StatoGiorno;
  liberi: number;
}

/**
 * Un giorno visto dal cliente. Si prenota da domani a quattro settimane;
 * per oggi si telefona. Senza servizio scelto contano gli orari di tutti.
 */
export function infoGiornoCliente(
  a: Attivita,
  prenotazioni: Prenotazione[],
  oggi: Date,
  giorno: number,
  servizio: string | null,
): InfoGiorno {
  if (giorno < 0) return { stato: 'passato', liberi: 0 };
  if (giorno === 0) return { stato: 'oggi', liberi: 0 };
  if (giorno > ultimoGiornoPrenotabile) return { stato: 'fuori', liberi: 0 };
  if (giornoChiuso(a, oggi, giorno)) return { stato: 'chiuso', liberi: 0 };
  const liberi =
    servizio === null
      ? tuttiGliOrari(a).filter((ora) => quanteAlle(prenotazioni, giorno, ora) < a.posti).length
      : orariLiberi(a, prenotazioni, giorno, servizio).length;
  return { stato: liberi === 0 ? 'pieno' : 'libero', liberi };
}

/** Quello che un lettore di schermo legge per ogni giorno del calendario. */
export function etichettaGiorno(oggi: Date, giorno: number, info: InfoGiorno): string {
  const come: Record<StatoGiorno, string> = {
    libero: `${info.liberi} ${info.liberi === 1 ? 'orario libero' : 'orari liberi'}`,
    pieno: 'pieno',
    chiuso: 'chiuso',
    passato: 'passato',
    fuori: 'non ancora prenotabile',
    oggi: 'oggi: per oggi telefonate',
  };
  return `${dataCorta(oggi, giorno)}, ${come[info.stato]}`;
}

// ---------------------------------------------------------------------------
// Esempi

/**
 * Le prenotazioni di partenza attorno a oggi: quelle scritte in attivita.ts,
 * sui giorni aperti, più un giorno tutto pieno, per far vedere "pieno".
 */
export function esempiIniziali(a: Attivita, oggi: Date): Prenotazione[] {
  const aperti: number[] = [];
  for (let g = 0; g <= ultimoGiornoPrenotabile; g++) {
    if (!giornoChiuso(a, oggi, g)) aperti.push(g);
  }

  const elenco: Prenotazione[] = a.esempi.map((e, i) => {
    const giorno = aperti[e.aperto]!;
    return {
      id: `e${i + 1}`,
      giorno,
      ora: e.ora,
      nome: e.nome,
      servizio: e.servizio,
      ...(e.persone !== undefined && { persone: e.persone }),
      // "Completata" ha senso solo oggi: se oggi si è chiusi, è confermata.
      stato: e.stato === 'completata' && giorno !== 0 ? 'confermata' : e.stato,
    };
  });

  const pieno = aperti[a.giornoPieno]!;
  let n = 0;
  for (const ora of tuttiGliOrari(a)) {
    const servizio = a.servizi.find((s) => s.orari.includes(ora))!.nome;
    while (quanteAlle(elenco, pieno, ora) < a.posti) {
      elenco.push({
        id: `e${elenco.length + 1}`,
        giorno: pieno,
        ora,
        nome: nomiDiEsempio[n++ % nomiDiEsempio.length]!,
        servizio,
        ...(a.persone && { persone: 2 }),
        stato: 'confermata',
      });
    }
  }
  return elenco;
}

// ---------------------------------------------------------------------------
// Lo stato della prova

/** Quello che il cliente sta compilando sul telefono. */
export interface Cliente {
  servizio: string | null;
  giorno: number | null;
  ora: string | null;
  persone: number;
  nome: string;
  /** L'id della richiesta inviata, finché non se ne fa un'altra. */
  inviata: string | null;
  errore: string | null;
}

export interface StatoProva {
  /** Mezzanotte di oggi, come numero. */
  oggi: number;
  attivita: IdAttivita;
  /** Il nome scritto dal visitatore; vuoto = il nome del tipo di attività. */
  nome: string;
  /** Il colore dell'app, scelto dal visitatore: "#rrggbb". */
  tema: string;
  /**
   * Il logo caricato dal visitatore: un indirizzo "blob:" che vive solo nel
   * suo browser (il file non va da nessuna parte). null = l'iniziale del nome.
   */
  logo: string | null;
  prenotazioni: Prenotazione[];
  prossimoId: number;
  cliente: Cliente;
  /** Il giorno aperto sul computer dell'attività, e la richiesta appena arrivata. */
  ufficio: { giorno: number; nuova: string | null };
  /** Le novità da segnalare quando si vede uno schermo alla volta. */
  novita: { cliente: number; ufficio: number };
  /** La riga che spiega in italiano semplice cosa è appena successo. */
  spiegazione: string;
}

export interface DatiAggiunta {
  giorno: number;
  ora: string;
  nome: string;
  servizio: string;
  persone: number;
}

type CampoTesto = 'servizio' | 'ora' | 'nome';
type CampoNumero = 'giorno' | 'persone';

export type Azione =
  /** Nel browser arriva la data vera (alla build non c'è). */
  | { tipo: 'oggi'; oggi: number }
  | { tipo: 'scegliAttivita'; attivita: IdAttivita }
  | { tipo: 'nomeAttivita'; valore: string }
  | { tipo: 'tema'; tema: string }
  | { tipo: 'logo'; url: string | null }
  | { tipo: 'cliente'; campo: CampoTesto; valore: string }
  | { tipo: 'cliente'; campo: CampoNumero; valore: number }
  | { tipo: 'invia' }
  | { tipo: 'nuovaRichiesta' }
  | { tipo: 'ufficioGiorno'; giorno: number }
  | { tipo: 'avanza'; id: string }
  | { tipo: 'elimina'; id: string }
  | { tipo: 'aggiungi'; dati: DatiAggiunta }
  | { tipo: 'guarda'; vista: 'cliente' | 'ufficio' };

const clienteVuoto = (): Cliente => ({
  servizio: null,
  giorno: null,
  ora: null,
  persone: 2,
  nome: '',
  inviata: null,
  errore: null,
});

export function statoIniziale(id: IdAttivita, oggi: Date): StatoProva {
  const a = attivita[id];
  const mezzanotte = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate());
  let primoAperto = 0;
  while (giornoChiuso(a, mezzanotte, primoAperto)) primoAperto++;
  return {
    oggi: mezzanotte.getTime(),
    attivita: id,
    nome: '',
    tema: colorePredefinito,
    logo: null,
    prenotazioni: esempiIniziali(a, mezzanotte),
    prossimoId: 1,
    cliente: clienteVuoto(),
    ufficio: { giorno: primoAperto, nuova: null },
    novita: { cliente: 0, ufficio: 0 },
    spiegazione: spiegaInizio(a),
  };
}

export function statoSuccessivo(stato: Stato): Stato | null {
  if (stato === 'richiesta') return 'confermata';
  if (stato === 'confermata') return 'completata';
  return null;
}

export function aggiorna(stato: StatoProva, azione: Azione): StatoProva {
  const a = attivita[stato.attivita];
  const oggi = new Date(stato.oggi);

  switch (azione.tipo) {
    case 'oggi': {
      if (azione.oggi === stato.oggi) return stato;
      const nuovo = statoIniziale(stato.attivita, new Date(azione.oggi));
      return { ...nuovo, nome: stato.nome, tema: stato.tema, logo: stato.logo };
    }

    case 'scegliAttivita':
      return {
        ...statoIniziale(azione.attivita, oggi),
        tema: stato.tema,
        logo: stato.logo,
        prossimoId: stato.prossimoId,
      };

    case 'nomeAttivita':
      return { ...stato, nome: azione.valore.slice(0, lunghezzaMassimaNome) };

    case 'tema':
      // Dal selettore del browser arriva sempre "#rrggbb"; il resto si scarta.
      return /^#[0-9a-f]{6}$/i.test(azione.tema)
        ? { ...stato, tema: azione.tema.toLowerCase() }
        : stato;

    case 'logo':
      return { ...stato, logo: azione.url };

    case 'cliente':
      return { ...stato, cliente: aggiornaCliente(stato, azione) };

    case 'invia': {
      if (stato.cliente.inviata) return stato;
      const errore = controllaRichiesta(stato);
      if (errore) return { ...stato, cliente: { ...stato.cliente, errore } };
      const c = stato.cliente;
      const nuova: Prenotazione = {
        id: `r${stato.prossimoId}`,
        giorno: c.giorno!,
        ora: c.ora!,
        nome: c.nome.trim(),
        servizio: c.servizio!,
        ...(a.persone && { persone: c.persone }),
        stato: 'richiesta',
        daCliente: true,
      };
      return {
        ...stato,
        prenotazioni: [...stato.prenotazioni, nuova],
        prossimoId: stato.prossimoId + 1,
        cliente: { ...c, inviata: nuova.id, errore: null },
        ufficio: { giorno: nuova.giorno, nuova: nuova.id },
        novita: { ...stato.novita, ufficio: stato.novita.ufficio + 1 },
        spiegazione:
          `Richiesta di ${nuova.nome} per ${dataCorta(oggi, nuova.giorno).toLowerCase()} alle ` +
          `${nuova.ora}: è arrivata all'attività, da confermare. Sul telefono ` +
          `${nuova.nome} vede "In attesa di conferma".`,
      };
    }

    case 'nuovaRichiesta':
      return { ...stato, cliente: clienteVuoto() };

    case 'ufficioGiorno':
      return { ...stato, ufficio: { ...stato.ufficio, giorno: azione.giorno } };

    case 'avanza': {
      const vecchia = stato.prenotazioni.find((p) => p.id === azione.id);
      const nuovoStato = vecchia && statoSuccessivo(vecchia.stato);
      if (!vecchia || !nuovoStato) return stato;
      const delCliente = vecchia.id === stato.cliente.inviata && nuovoStato === 'confermata';
      return {
        ...stato,
        prenotazioni: stato.prenotazioni.map((p) =>
          p.id === azione.id ? { ...p, stato: nuovoStato } : p,
        ),
        novita: delCliente ? { ...stato.novita, cliente: stato.novita.cliente + 1 } : stato.novita,
        spiegazione: delCliente
          ? `${etichettaStato('confermata', a)}: ${vecchia.nome} lo vede subito sul telefono, ` +
            `senza telefonate né messaggi.`
          : spiegaAvanzamento(a, vecchia.nome, nuovoStato),
      };
    }

    case 'elimina': {
      const tolta = stato.prenotazioni.find((p) => p.id === azione.id);
      if (!tolta) return stato;
      const delCliente = tolta.id === stato.cliente.inviata;
      return {
        ...stato,
        prenotazioni: stato.prenotazioni.filter((p) => p.id !== azione.id),
        ufficio: {
          ...stato.ufficio,
          nuova: stato.ufficio.nuova === tolta.id ? null : stato.ufficio.nuova,
        },
        novita: delCliente ? { ...stato.novita, cliente: stato.novita.cliente + 1 } : stato.novita,
        spiegazione: delCliente
          ? `Avete tolto la richiesta di ${tolta.nome}: sul telefono vede che non è stata accettata.`
          : `${soggetto(a)} di ${tolta.nome} è cancellat${fin(a)}.`,
      };
    }

    case 'aggiungi': {
      if (Object.keys(controllaAggiunta(stato, azione.dati)).length > 0) return stato;
      const d = azione.dati;
      const nuova: Prenotazione = {
        id: `n${stato.prossimoId}`,
        giorno: d.giorno,
        ora: d.ora,
        nome: d.nome.trim(),
        servizio: d.servizio,
        ...(a.persone && { persone: d.persone }),
        stato: 'confermata',
      };
      return {
        ...stato,
        prenotazioni: [...stato.prenotazioni, nuova],
        prossimoId: stato.prossimoId + 1,
        ufficio: { ...stato.ufficio, giorno: d.giorno },
        spiegazione:
          `${maiuscola(`nuov${fin(a)}`)} ${a.evento.singolare} di ${nuova.nome}, aggiunt${fin(a)} ` +
          `a mano per chi telefona: è già confermat${fin(a)}, e sul telefono quel posto non è più libero.`,
      };
    }

    case 'guarda':
      return { ...stato, novita: { ...stato.novita, [azione.vista]: 0 } };
  }
}

/** Cambia un campo del telefono. Cambiando servizio o giorno, l'orario scelto si toglie. */
function aggiornaCliente(stato: StatoProva, azione: Extract<Azione, { tipo: 'cliente' }>): Cliente {
  const a = attivita[stato.attivita];
  const c: Cliente = { ...stato.cliente, errore: null };
  switch (azione.campo) {
    case 'servizio': {
      const resta =
        c.giorno !== null &&
        c.ora !== null &&
        orariLiberi(a, stato.prenotazioni, c.giorno, azione.valore).includes(c.ora);
      return { ...c, servizio: azione.valore, ora: resta ? c.ora : null };
    }
    case 'giorno':
      return { ...c, giorno: azione.valore, ora: null };
    case 'ora':
      return { ...c, ora: azione.valore };
    case 'persone': {
      const massimo = a.persone?.massimo ?? 1;
      return { ...c, persone: Math.min(Math.max(Math.round(azione.valore), 1), massimo) };
    }
    case 'nome':
      return { ...c, nome: azione.valore.slice(0, lunghezzaMassimaNomeCliente) };
  }
}

// ---------------------------------------------------------------------------
// Controlli

/** Il primo passo che manca sul telefono, dando del tu al cliente. null = si può inviare. */
export function controllaRichiesta(stato: StatoProva): string | null {
  const c = stato.cliente;
  const a = attivita[stato.attivita];
  if (c.servizio === null) return 'Scegli un servizio.';
  if (c.giorno === null) return 'Scegli un giorno nel calendario.';
  if (c.ora === null) return 'Scegli un orario.';
  if (c.nome.trim() === '') return 'Scrivi il tuo nome.';
  const info = infoGiornoCliente(a, stato.prenotazioni, new Date(stato.oggi), c.giorno, c.servizio);
  if (
    info.stato !== 'libero' ||
    !orariLiberi(a, stato.prenotazioni, c.giorno, c.servizio).includes(c.ora)
  ) {
    return 'Questo orario è appena stato preso: scegline un altro.';
  }
  return null;
}

export type CampoAggiunta = 'giorno' | 'nome' | 'ora' | 'persone';
export type ErroriAggiunta = Partial<Record<CampoAggiunta, string>>;

/** I controlli del modulo dell'attività (voi). Oggetto vuoto = tutto a posto. */
export function controllaAggiunta(stato: StatoProva, d: DatiAggiunta): ErroriAggiunta {
  const a = attivita[stato.attivita];
  const errori: ErroriAggiunta = {};
  if (d.giorno < 0) errori.giorno = 'Quel giorno è già passato.';
  else if (giornoChiuso(a, new Date(stato.oggi), d.giorno))
    errori.giorno = 'Quel giorno siete chiusi.';

  if (d.nome.trim() === '') {
    errori.nome = `Scrivete il nome ${a.chi === 'ospite' ? "dell'ospite" : `del ${a.chi}`}.`;
  }
  if (!orariLiberi(a, stato.prenotazioni, d.giorno, d.servizio).includes(d.ora)) {
    errori.ora = 'Scegliete un orario libero.';
  }
  if (
    a.persone &&
    (!Number.isInteger(d.persone) || d.persone < 1 || d.persone > a.persone.massimo)
  ) {
    errori.persone = `Da 1 a ${a.persone.massimo} ${a.persone.plurale}.`;
  }
  return errori;
}

// ---------------------------------------------------------------------------
// Come si mostra

/** Lo stato della richiesta sul telefono del cliente. */
export function statoRichiesta(
  stato: StatoProva,
): 'attesa' | 'confermata' | 'completata' | 'annullata' | null {
  const id = stato.cliente.inviata;
  if (!id) return null;
  const p = stato.prenotazioni.find((x) => x.id === id);
  if (!p) return 'annullata';
  return p.stato === 'richiesta' ? 'attesa' : p.stato;
}

/** Il nome dell'app: quello scritto dal visitatore, o il tipo di attività. */
export function nomeMostrato(stato: StatoProva): string {
  return stato.nome.trim() || attivita[stato.attivita].nome;
}

/** "Da confermare", "Confermata", "Completato". */
export function etichettaStato(stato: Stato, a: Attivita): string {
  if (stato === 'richiesta') return 'Da confermare';
  return `${stato === 'confermata' ? 'Confermat' : 'Completat'}${fin(a)}`;
}

/** "Cena, 4 coperti" */
export function descriviDettagli(p: Prenotazione, a: Attivita): string {
  const persone =
    a.persone && p.persone !== undefined
      ? `${p.persone} ${p.persone === 1 ? a.persone.singolare : a.persone.plurale}`
      : '';
  return [p.servizio, persone].filter(Boolean).join(', ');
}

/** Il pulsante che fa avanzare lo stato: corto, come "Compila" nei gestionali veri. */
export function testoPulsanteAvanza(stato: 'richiesta' | 'confermata'): string {
  return stato === 'richiesta' ? 'Conferma' : 'Completa';
}

/** Le prenotazioni di un giorno, in ordine di orario. */
export function prenotazioniDelGiorno(elenco: Prenotazione[], giorno: number): Prenotazione[] {
  return elenco.filter((p) => p.giorno === giorno).sort((x, y) => x.ora.localeCompare(y.ora));
}

export function contaDelGiorno(elenco: Prenotazione[], giorno: number): number {
  return elenco.filter((p) => p.giorno === giorno).length;
}

// ---------------------------------------------------------------------------
// La riga di spiegazione (voi, la voce del sito)

/** Desinenza al singolare: confermat-a / confermat-o. */
const fin = (a: Attivita) => (a.evento.femminile ? 'a' : 'o');
/** "La prenotazione", "L'appuntamento". */
const soggetto = (a: Attivita) => maiuscola(`${a.evento.articolo}${a.evento.singolare}`);
function maiuscola(testo: string): string {
  return testo.charAt(0).toUpperCase() + testo.slice(1);
}
/** "cliente" → "clienti", "ospite" → "ospiti". */
const plurale = (parola: string) => parola.replace(/e$/, 'i');

function spiegaInizio(a: Attivita): string {
  return (
    `Il telefono è la pagina dove i ${plurale(a.chi)} di ${a.conArticolo} prenotano; il ` +
    `computer è il gestionale dell'attività. Provate a prenotare dal telefono: la richiesta ` +
    `arriva al computer.`
  );
}

function spiegaAvanzamento(a: Attivita, nome: string, nuovoStato: Stato): string {
  if (nuovoStato === 'confermata') return `${soggetto(a)} di ${nome} è confermat${fin(a)}.`;
  const [quante, fatte] = a.evento.femminile ? ['quante', 'fatte'] : ['quanti', 'fatti'];
  return (
    `${soggetto(a)} di ${nome} è completat${fin(a)}. Resta nell'elenco: ` +
    `a fine mese sapete ${quante} ne avete ${fatte}.`
  );
}
