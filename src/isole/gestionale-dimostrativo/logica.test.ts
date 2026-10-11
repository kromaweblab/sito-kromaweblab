import { describe, expect, it } from 'vitest';
// ?raw: Vite legge il file come testo (niente fs di Node, niente tipi in più).
import testoToken from '../../stili/tokens.css?raw';
import { attivita, nomiDiEsempio, ordineAttivita } from './attivita';
import {
  aggiorna,
  colorePredefinito,
  coloreLeggibile,
  contrasto,
  contaDelGiorno,
  controllaAggiunta,
  controllaRichiesta,
  dataEstesa,
  descriviDettagli,
  esempiIniziali,
  etichettaGiorno,
  etichettaStato,
  giornoChiuso,
  infoGiornoCliente,
  lunghezzaMassimaNome,
  mese,
  mesiDopo,
  nomeMostrato,
  orariLiberi,
  prenotazioniDelGiorno,
  statoIniziale,
  statoRichiesta,
  testoPulsanteAvanza,
  testoSuColore,
  ultimoGiornoPrenotabile,
  type DatiAggiunta,
  type Prenotazione,
  type StatoProva,
} from './logica';

// Domenica 11 ottobre 2026: il giorno 1 è lunedì 12, il 2 martedì 13…
const oggi = new Date(2026, 9, 11);
const ristorante = attivita.ristorante;
const parrucchiere = attivita.parrucchiere;

const pren = (valori: Partial<Prenotazione>): Prenotazione => ({
  id: 'x',
  giorno: 2,
  ora: '19:30',
  nome: 'Rosa',
  servizio: 'Cena',
  persone: 2,
  stato: 'confermata',
  ...valori,
});

/** Lo stato della prova con prenotazioni scelte, per provare una cosa sola. */
const con = (prenotazioni: Prenotazione[], id = 'ristorante' as const): StatoProva => ({
  ...statoIniziale(id, oggi),
  prenotazioni,
});

/** Il cliente compila tutto e invia. */
const inviaRichiesta = (stato: StatoProva, dati: Partial<StatoProva['cliente']>): StatoProva =>
  aggiorna({ ...stato, cliente: { ...stato.cliente, ...dati } }, { tipo: 'invia' });

// ---------------------------------------------------------------------------

describe('le attività', () => {
  it.each(ordineAttivita)('%s: servizi con orari in ordine, posti, giorni di chiusura', (id) => {
    const a = attivita[id];
    expect(a.servizi.length).toBeGreaterThan(0);
    for (const s of a.servizi) {
      expect(s.orari.length).toBeGreaterThan(0);
      for (const ora of s.orari) expect(ora).toMatch(/^\d\d:\d\d$/);
      expect([...s.orari].sort()).toEqual(s.orari);
    }
    expect(a.posti).toBeGreaterThan(0);
    expect(a.chiuso.length).toBeLessThan(7);
    for (const g of a.chiuso) expect(g).toBeGreaterThanOrEqual(0);
  });

  it('il ristorante è chiuso il lunedì', () => {
    expect(giornoChiuso(ristorante, oggi, 1)).toBe(true); // lunedì 12
    expect(giornoChiuso(ristorante, oggi, 2)).toBe(false); // martedì 13
  });
});

describe('date', () => {
  it('per esteso, anche a cavallo di mese e di anno', () => {
    expect(dataEstesa(oggi, 0)).toBe('Domenica 11 ottobre 2026');
    expect(dataEstesa(oggi, 21)).toBe('Domenica 1 novembre 2026');
    expect(dataEstesa(new Date(2026, 11, 31), 1)).toBe('Venerdì 1 gennaio 2027');
  });
});

describe('il mese del calendario', () => {
  it('settimane da lunedì a domenica, con oggi al suo posto', () => {
    const ottobre = mese(oggi, 0);
    expect(ottobre.titolo).toBe('Ottobre 2026');
    const celle = ottobre.settimane.flat();
    expect(ottobre.settimane.every((s) => s.length === 7)).toBe(true);
    // Il 1° ottobre 2026 è giovedì: tre caselle vuote prima.
    expect(celle.slice(0, 3)).toEqual([null, null, null]);
    expect(celle[3]).toEqual({ numero: 1, giorno: -10 });
    expect(celle.find((c) => c?.numero === 11)?.giorno).toBe(0);
    expect(celle.filter((c) => c !== null)).toHaveLength(31);
  });

  it('quanti mesi dopo cade un giorno', () => {
    expect(mesiDopo(oggi, 0)).toBe(0);
    expect(mesiDopo(oggi, 20)).toBe(0); // 31 ottobre
    expect(mesiDopo(oggi, 21)).toBe(1); // 1° novembre
    expect(mesiDopo(new Date(2026, 11, 20), 15)).toBe(1); // gennaio dell'anno dopo
  });

  it('il mese dopo', () => {
    const novembre = mese(oggi, 1);
    expect(novembre.titolo).toBe('Novembre 2026');
    // Il 1° novembre 2026 è domenica: sei caselle vuote prima.
    expect(novembre.settimane[0]!.slice(0, 6)).toEqual([null, null, null, null, null, null]);
    expect(novembre.settimane[0]![6]).toEqual({ numero: 1, giorno: 21 });
  });
});

describe('orari liberi', () => {
  it('un orario è pieno quando le prenotazioni arrivano ai posti', () => {
    // Il ristorante ha due prenotazioni per orario.
    expect(ristorante.posti).toBe(2);
    const due = [pren({ id: 'a' }), pren({ id: 'b' })];
    expect(orariLiberi(ristorante, due, 2, 'Cena')).not.toContain('19:30');
    expect(orariLiberi(ristorante, [pren({})], 2, 'Cena')).toContain('19:30');
  });

  it('i posti valgono per tutti i servizi: una poltrona sola dal parrucchiere', () => {
    const taglio = pren({ servizio: 'Taglio', ora: '10:00', persone: undefined });
    expect(orariLiberi(parrucchiere, [taglio], 2, 'Colore')).not.toContain('10:00');
  });

  it('solo gli orari del servizio scelto', () => {
    expect(orariLiberi(ristorante, [], 2, 'Pranzo')).toEqual(['12:30', '13:30']);
  });
});

describe('il giorno, visto dal cliente', () => {
  it('passato, oggi, chiuso, oltre le quattro settimane', () => {
    expect(infoGiornoCliente(ristorante, [], oggi, -1, 'Cena').stato).toBe('passato');
    expect(infoGiornoCliente(ristorante, [], oggi, 0, 'Cena').stato).toBe('oggi');
    expect(infoGiornoCliente(ristorante, [], oggi, 1, 'Cena').stato).toBe('chiuso');
    expect(infoGiornoCliente(ristorante, [], oggi, ultimoGiornoPrenotabile + 1, 'Cena').stato).toBe(
      'fuori',
    );
  });

  it('libero, con il numero degli orari; pieno quando non ne resta nessuno', () => {
    expect(infoGiornoCliente(ristorante, [], oggi, 2, 'Cena')).toEqual({
      stato: 'libero',
      liberi: 3,
    });
    const tutto = ['19:30', '20:30', '21:30'].flatMap((ora) => [
      pren({ id: `${ora}a`, ora }),
      pren({ id: `${ora}b`, ora }),
    ]);
    expect(infoGiornoCliente(ristorante, tutto, oggi, 2, 'Cena').stato).toBe('pieno');
  });

  it('senza servizio scelto conta gli orari di tutti i servizi', () => {
    expect(infoGiornoCliente(ristorante, [], oggi, 2, null).liberi).toBe(5);
  });

  it('un’etichetta che si legge per intero, anche senza vedere i colori', () => {
    expect(etichettaGiorno(oggi, 2, { stato: 'libero', liberi: 3 })).toBe(
      'Martedì 13 ottobre, 3 orari liberi',
    );
    expect(etichettaGiorno(oggi, 2, { stato: 'libero', liberi: 1 })).toBe(
      'Martedì 13 ottobre, 1 orario libero',
    );
    expect(etichettaGiorno(oggi, 1, { stato: 'chiuso', liberi: 0 })).toBe(
      'Lunedì 12 ottobre, chiuso',
    );
    expect(etichettaGiorno(oggi, 2, { stato: 'pieno', liberi: 0 })).toBe(
      'Martedì 13 ottobre, pieno',
    );
    expect(etichettaGiorno(oggi, 0, { stato: 'oggi', liberi: 0 })).toBe(
      'Domenica 11 ottobre, oggi: per oggi telefonate',
    );
  });
});

describe('le prenotazioni di esempio', () => {
  it.each(ordineAttivita)('%s: mai in un giorno di chiusura, mai oltre un orario pieno', (id) => {
    const a = attivita[id];
    const esempi = esempiIniziali(a, oggi);
    expect(esempi.length).toBeGreaterThan(0);
    for (const p of esempi) {
      expect(giornoChiuso(a, oggi, p.giorno)).toBe(false);
      const stessoOrario = esempi.filter((q) => q.giorno === p.giorno && q.ora === p.ora);
      expect(stessoOrario.length).toBeLessThanOrEqual(a.posti);
      expect(a.servizi.map((s) => s.nome)).toContain(p.servizio);
    }
  });

  it.each(ordineAttivita)('%s: c’è un giorno pieno da far vedere al cliente', (id) => {
    const a = attivita[id];
    const esempi = esempiIniziali(a, oggi);
    const pieni = Array.from({ length: ultimoGiornoPrenotabile }, (_, i) => i + 1).filter(
      (g) => infoGiornoCliente(a, esempi, oggi, g, null).stato === 'pieno',
    );
    expect(pieni.length).toBeGreaterThan(0);
  });

  it.each(ordineAttivita)('%s: solo nomi di battesimo, nessun cognome', (id) => {
    // CLAUDE.md: niente cognomi, nemmeno inventati. Greco, Colombo e Russo
    // sono anche dipendenti veri di un nostro cliente.
    const cognomiVietati = ['Greco', 'Colombo', 'Russo', 'Bianchi', 'Caruso', 'Rizzo'];
    for (const p of esempiIniziali(attivita[id], oggi)) {
      expect(nomiDiEsempio).toContain(p.nome);
      expect(cognomiVietati).not.toContain(p.nome);
    }
  });
});

describe('il cliente prenota', () => {
  it('controlla un passo alla volta, dando del tu al cliente', () => {
    const s = statoIniziale('ristorante', oggi);
    expect(controllaRichiesta(s)).toBe('Scegli un servizio.');
    const conServizio = { ...s, cliente: { ...s.cliente, servizio: 'Cena' } };
    expect(controllaRichiesta(conServizio)).toBe('Scegli un giorno nel calendario.');
    const conGiorno = { ...conServizio, cliente: { ...conServizio.cliente, giorno: 2 } };
    expect(controllaRichiesta(conGiorno)).toBe('Scegli un orario.');
    const conOra = { ...conGiorno, cliente: { ...conGiorno.cliente, ora: '20:30' } };
    expect(controllaRichiesta(conOra)).toBe('Scrivi il tuo nome.');
  });

  it('la richiesta arriva all’attività, da confermare e segnata come nuova', () => {
    const dopo = inviaRichiesta(con([]), {
      servizio: 'Cena',
      giorno: 2,
      ora: '20:30',
      persone: 4,
      nome: ' Giada ',
    });
    const nuova = dopo.prenotazioni.find((p) => p.id === dopo.cliente.inviata);
    expect(nuova).toMatchObject({
      giorno: 2,
      ora: '20:30',
      nome: 'Giada',
      servizio: 'Cena',
      persone: 4,
      stato: 'richiesta',
      daCliente: true,
    });
    expect(dopo.ufficio.giorno).toBe(2);
    expect(dopo.ufficio.nuova).toBe(nuova!.id);
    expect(dopo.novita.ufficio).toBe(1);
    expect(statoRichiesta(dopo)).toBe('attesa');
    expect(dopo.spiegazione).toContain('Giada');
  });

  it('un orario preso nel frattempo non si può prenotare', () => {
    const pieno = con([pren({ id: 'a', ora: '20:30' }), pren({ id: 'b', ora: '20:30' })]);
    const s = {
      ...pieno,
      cliente: { ...pieno.cliente, servizio: 'Cena', giorno: 2, ora: '20:30', nome: 'Giada' },
    };
    expect(controllaRichiesta(s)).toBe('Questo orario è appena stato preso: scegline un altro.');
    expect(aggiorna(s, { tipo: 'invia' }).prenotazioni).toHaveLength(2);
  });

  it('cambiando servizio o giorno, l’orario scelto si toglie', () => {
    let s = statoIniziale('ristorante', oggi);
    s = aggiorna(s, { tipo: 'cliente', campo: 'servizio', valore: 'Cena' });
    s = aggiorna(s, { tipo: 'cliente', campo: 'giorno', valore: 2 });
    s = aggiorna(s, { tipo: 'cliente', campo: 'ora', valore: '20:30' });
    expect(aggiorna(s, { tipo: 'cliente', campo: 'giorno', valore: 3 }).cliente.ora).toBeNull();
    expect(
      aggiorna(s, { tipo: 'cliente', campo: 'servizio', valore: 'Pranzo' }).cliente.ora,
    ).toBeNull();
  });

  it('dopo l’invio, una nuova richiesta riparte da capo', () => {
    const inviata = inviaRichiesta(con([]), {
      servizio: 'Cena',
      giorno: 2,
      ora: '20:30',
      nome: 'Giada',
    });
    const nuova = aggiorna(inviata, { tipo: 'nuovaRichiesta' });
    expect(nuova.cliente.inviata).toBeNull();
    expect(nuova.cliente.ora).toBeNull();
    expect(nuova.prenotazioni).toEqual(inviata.prenotazioni);
  });
});

describe('l’attività risponde', () => {
  const inviata = () =>
    inviaRichiesta(con([]), { servizio: 'Cena', giorno: 2, ora: '20:30', nome: 'Giada' });

  it('conferma: il cliente lo vede sul telefono', () => {
    const s = inviata();
    const dopo = aggiorna(s, { tipo: 'avanza', id: s.cliente.inviata! });
    expect(statoRichiesta(dopo)).toBe('confermata');
    expect(dopo.novita.cliente).toBe(1);
    expect(dopo.spiegazione).toContain('telefono');
  });

  it('elimina: per il cliente la richiesta non è stata accettata', () => {
    const s = inviata();
    const dopo = aggiorna(s, { tipo: 'elimina', id: s.cliente.inviata! });
    expect(statoRichiesta(dopo)).toBe('annullata');
    expect(dopo.novita.cliente).toBe(1);
  });

  it('guardare uno schermo spegne le sue novità', () => {
    const s = inviata();
    expect(aggiorna(s, { tipo: 'guarda', vista: 'ufficio' }).novita.ufficio).toBe(0);
  });

  it('aggiunge a mano chi telefona: già confermata', () => {
    const dati: DatiAggiunta = {
      giorno: 3,
      ora: '19:30',
      nome: 'Marco',
      servizio: 'Cena',
      persone: 2,
    };
    const dopo = aggiorna(con([]), { tipo: 'aggiungi', dati });
    expect(dopo.prenotazioni.at(-1)).toMatchObject({ ...dati, stato: 'confermata' });
    expect(dopo.ufficio.giorno).toBe(3);
  });

  it('il modulo dell’attività controlla nome, orario libero e persone', () => {
    const vuoti: DatiAggiunta = { giorno: 3, ora: '', nome: '', servizio: 'Cena', persone: 0 };
    expect(controllaAggiunta(con([]), vuoti)).toEqual({
      nome: 'Scrivete il nome del cliente.',
      ora: 'Scegliete un orario libero.',
      persone: 'Da 1 a 12 coperti.',
    });
    const chiuso: DatiAggiunta = {
      giorno: 1,
      ora: '19:30',
      nome: 'Marco',
      servizio: 'Cena',
      persone: 2,
    };
    expect(controllaAggiunta(con([]), chiuso)).toEqual({ giorno: 'Quel giorno siete chiusi.' });
  });

  it('confermata, poi completata: i passi dell’attività', () => {
    let s = con([pren({ id: 'a', stato: 'richiesta' })]);
    s = aggiorna(s, { tipo: 'avanza', id: 'a' });
    expect(s.prenotazioni[0]!.stato).toBe('confermata');
    s = aggiorna(s, { tipo: 'avanza', id: 'a' });
    expect(s.prenotazioni[0]!.stato).toBe('completata');
    // Completata è l'ultimo passo: un altro "avanza" non cambia niente.
    expect(aggiorna(s, { tipo: 'avanza', id: 'a' })).toEqual(s);
  });
});

describe('il colore dell’app, scelto liberamente', () => {
  const bianco = '#ffffff';

  it('il colore di partenza è quello del token --kroma-app-tema', () => {
    const riga = testoToken.match(/--kroma-app-tema:\s*(#[0-9a-f]{6})/i);
    expect(riga).not.toBeNull();
    expect(riga![1]!.toLowerCase()).toBe(colorePredefinito);
  });

  it('sopra il colore: testo chiaro sui colori scuri, scuro sui colori chiari', () => {
    expect(testoSuColore('#1d4ed8')).toBe('chiaro');
    expect(testoSuColore('#ffeb3b')).toBe('scuro');
    expect(testoSuColore('#000000')).toBe('chiaro');
    expect(testoSuColore('#ffffff')).toBe('scuro');
  });

  it('per le scritte colorate sul fondo chiaro, il colore si scurisce finché si legge', () => {
    for (const colore of ['#ffeb3b', '#00ffff', '#ff8800', '#ffffff', '#1d4ed8']) {
      expect(contrasto(coloreLeggibile(colore), bianco)).toBeGreaterThanOrEqual(5.6);
    }
    // Un colore già scuro resta com'è.
    expect(coloreLeggibile('#1d4ed8')).toBe('#1d4ed8');
  });

  it('accetta solo colori #rrggbb, e li scrive in minuscolo', () => {
    const s = statoIniziale('ristorante', oggi);
    expect(aggiorna(s, { tipo: 'tema', tema: '#AA00CC' }).tema).toBe('#aa00cc');
    expect(aggiorna(s, { tipo: 'tema', tema: 'rosso' }).tema).toBe(colorePredefinito);
  });
});

describe('il logo dell’attività', () => {
  it('si mette e si toglie', () => {
    let s = statoIniziale('ristorante', oggi);
    expect(s.logo).toBeNull();
    s = aggiorna(s, { tipo: 'logo', url: 'blob:logo-1' });
    expect(s.logo).toBe('blob:logo-1');
    expect(aggiorna(s, { tipo: 'logo', url: null }).logo).toBeNull();
  });

  it('resta quando si cambia tipo di attività o arriva la data vera', () => {
    let s = aggiorna(statoIniziale('ristorante', new Date(2026, 0, 1)), {
      tipo: 'logo',
      url: 'blob:logo-1',
    });
    s = aggiorna(s, { tipo: 'scegliAttivita', attivita: 'parrucchiere' });
    expect(s.logo).toBe('blob:logo-1');
    s = aggiorna(s, { tipo: 'oggi', oggi: oggi.getTime() });
    expect(s.logo).toBe('blob:logo-1');
  });
});

describe('personalizzazione', () => {
  it('nome dell’attività: al massimo 30 caratteri, vuoto vale il nome del tipo', () => {
    let s = statoIniziale('parrucchiere', oggi);
    expect(nomeMostrato(s)).toBe('Parrucchiere');
    s = aggiorna(s, { tipo: 'nomeAttivita', valore: 'Salone Rosa' });
    expect(nomeMostrato(s)).toBe('Salone Rosa');
    s = aggiorna(s, { tipo: 'nomeAttivita', valore: 'x'.repeat(40) });
    expect(s.nome).toHaveLength(lunghezzaMassimaNome);
    s = aggiorna(s, { tipo: 'nomeAttivita', valore: '   ' });
    expect(nomeMostrato(s)).toBe('Parrucchiere');
  });

  it('cambiando tipo di attività si riparte da capo, ma il colore resta', () => {
    let s = aggiorna(statoIniziale('ristorante', oggi), { tipo: 'tema', tema: '#6d28d9' });
    s = aggiorna(s, { tipo: 'nomeAttivita', valore: 'Da Rosa' });
    s = aggiorna(s, { tipo: 'scegliAttivita', attivita: 'parrucchiere' });
    expect(s.attivita).toBe('parrucchiere');
    expect(s.tema).toBe('#6d28d9');
    expect(nomeMostrato(s)).toBe('Parrucchiere');
    expect(s.cliente.servizio).toBeNull();
  });

  it('quando arriva la data vera del browser, gli esempi si rifanno attorno a oggi', () => {
    const allaBuild = statoIniziale('ristorante', new Date(2026, 0, 1));
    const nelBrowser = aggiorna(allaBuild, { tipo: 'oggi', oggi: oggi.getTime() });
    expect(nelBrowser.oggi).toBe(oggi.getTime());
    expect(nelBrowser.prenotazioni).toEqual(esempiIniziali(ristorante, oggi));
  });
});

describe('come si mostra', () => {
  it('stato, dettagli e pulsanti', () => {
    expect(etichettaStato('richiesta', ristorante)).toBe('Da confermare');
    expect(etichettaStato('confermata', parrucchiere)).toBe('Confermato');
    expect(descriviDettagli(pren({ servizio: 'Cena', persone: 4 }), ristorante)).toBe(
      'Cena, 4 coperti',
    );
    expect(descriviDettagli(pren({ servizio: 'Taglio', persone: undefined }), parrucchiere)).toBe(
      'Taglio',
    );
    expect(testoPulsanteAvanza('richiesta')).toBe('Conferma');
    expect(testoPulsanteAvanza('confermata')).toBe('Completa');
  });

  it('il giorno dell’attività: in ordine di orario, e quante sono', () => {
    const elenco = [
      pren({ id: 'b', ora: '21:30' }),
      pren({ id: 'a', ora: '19:30' }),
      pren({ id: 'c', giorno: 3 }),
    ];
    expect(prenotazioniDelGiorno(elenco, 2).map((p) => p.id)).toEqual(['a', 'b']);
    expect(contaDelGiorno(elenco, 2)).toBe(2);
  });
});
