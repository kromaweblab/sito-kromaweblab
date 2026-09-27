import { describe, expect, it } from 'vitest';
import { attivita, ordineAttivita } from './attivita';
import {
  aggiornaLavagna,
  controllaNuova,
  descriviDove,
  descriviQuanti,
  prenotazioniDelGiorno,
  statoIniziale,
  statoSuccessivo,
  type DatiNuova,
} from './logica';

const ristorante = attivita.ristorante;

const nuovaAlRistorante: DatiNuova = {
  giorno: 1,
  ora: '20:30',
  nome: '  Esposito ',
  quanti: 4,
  dove: 'Tavolo 7',
};

describe('dati di esempio', () => {
  // Un errore di battitura nei dati si vedrebbe solo nella demo pubblicata:
  // qui si controlla che ogni esempio sia valido come una prenotazione vera.
  it.each(ordineAttivita)('%s: ogni esempio passa i controlli del modulo', (id) => {
    const a = attivita[id];
    for (const esempio of a.esempi) {
      expect(controllaNuova(esempio, a), `${id} ${esempio.id}`).toEqual({});
    }
  });

  it.each(ordineAttivita)('%s: id diversi e almeno una richiesta oggi', (id) => {
    const esempi = attivita[id].esempi;
    expect(new Set(esempi.map((e) => e.id)).size).toBe(esempi.length);
    expect(esempi.some((e) => e.giorno === 0 && e.stato === 'richiesta')).toBe(true);
  });

  it("l'ordine del selettore contiene tutte le attività, una volta", () => {
    expect([...ordineAttivita].sort()).toEqual(Object.keys(attivita).sort());
  });
});

describe('stati', () => {
  it('vanno solo avanti: richiesta → confermata → completata', () => {
    expect(statoSuccessivo('richiesta')).toBe('confermata');
    expect(statoSuccessivo('confermata')).toBe('completata');
    expect(statoSuccessivo('completata')).toBeNull();
  });

  it('avanza cambia solo la prenotazione scelta', () => {
    const prima = statoIniziale('ristorante');
    const dopo = aggiornaLavagna(prima, { tipo: 'avanza', id: 'e4' });
    expect(dopo.prenotazioni.find((p) => p.id === 'e4')?.stato).toBe('confermata');
    expect(dopo.prenotazioni.filter((p) => p.id !== 'e4')).toEqual(
      prima.prenotazioni.filter((p) => p.id !== 'e4'),
    );
  });

  it('una prenotazione completata resta completata, e la lavagna non cambia', () => {
    const prima = statoIniziale('ristorante');
    expect(aggiornaLavagna(prima, { tipo: 'avanza', id: 'e1' })).toBe(prima);
  });

  it('non modifica lo stato di partenza (immutabilità, come vuole React)', () => {
    const prima = statoIniziale('ristorante');
    const copia = structuredClone(prima);
    aggiornaLavagna(prima, { tipo: 'avanza', id: 'e4' });
    aggiornaLavagna(prima, { tipo: 'elimina', id: 'e4' });
    expect(prima).toEqual(copia);
  });
});

describe('eliminare', () => {
  it('toglie solo quella prenotazione', () => {
    const dopo = aggiornaLavagna(statoIniziale('ristorante'), { tipo: 'elimina', id: 'e3' });
    expect(dopo.prenotazioni.map((p) => p.id)).not.toContain('e3');
    expect(dopo.prenotazioni).toHaveLength(ristorante.esempi.length - 1);
  });

  it('un id che non esiste non cambia niente', () => {
    const prima = statoIniziale('ristorante');
    expect(aggiornaLavagna(prima, { tipo: 'elimina', id: 'nessuno' })).toBe(prima);
  });
});

describe('aggiungere', () => {
  it('crea una richiesta, con il nome ripulito, e passa al suo giorno', () => {
    const dopo = aggiornaLavagna(statoIniziale('ristorante'), {
      tipo: 'aggiungi',
      dati: nuovaAlRistorante,
    });
    const nuova = dopo.prenotazioni.at(-1);
    expect(nuova).toEqual({
      id: 'n1',
      giorno: 1,
      ora: '20:30',
      nome: 'Esposito',
      quanti: 4,
      dove: 'Tavolo 7',
      stato: 'richiesta',
    });
    expect(dopo.giorno).toBe(1);
  });

  it('dà id sempre nuovi, anche dopo un cambio di attività', () => {
    let stato = aggiornaLavagna(statoIniziale('ristorante'), {
      tipo: 'aggiungi',
      dati: nuovaAlRistorante,
    });
    stato = aggiornaLavagna(stato, { tipo: 'scegliAttivita', attivita: 'ristorante' });
    stato = aggiornaLavagna(stato, { tipo: 'aggiungi', dati: nuovaAlRistorante });
    expect(stato.prenotazioni.at(-1)?.id).toBe('n2');
  });

  it("scarta i campi che l'attività non usa", () => {
    const dati: DatiNuova = {
      giorno: 0,
      ora: '09:00',
      nome: 'Neri',
      cosa: 'Controllo',
      quanti: 3,
      dove: 'Tavolo 1',
    };
    const dopo = aggiornaLavagna(statoIniziale('studio-medico'), { tipo: 'aggiungi', dati });
    const nuova = dopo.prenotazioni.at(-1);
    expect(nuova).not.toHaveProperty('quanti');
    expect(nuova).not.toHaveProperty('dove');
  });

  it('ignora dati non validi', () => {
    const prima = statoIniziale('ristorante');
    const dopo = aggiornaLavagna(prima, {
      tipo: 'aggiungi',
      dati: { ...nuovaAlRistorante, nome: '   ' },
    });
    expect(dopo).toBe(prima);
  });
});

describe('controlli del modulo', () => {
  it('dati giusti: nessun errore', () => {
    expect(controllaNuova(nuovaAlRistorante, ristorante)).toEqual({});
  });

  it("segnala ogni campo sbagliato, con le parole dell'attività", () => {
    const errori = controllaNuova(
      { giorno: 0, ora: '25:00', nome: '', quanti: 0, dove: 'Tavolo 99' },
      ristorante,
    );
    expect(errori).toEqual({
      nome: 'Scrivi il nome del cliente.',
      ora: 'Scegli un orario.',
      quanti: 'Da 1 a 20 coperti.',
      dove: 'Scegli tavolo.',
    });
  });

  it('nome troppo lungo', () => {
    const errori = controllaNuova({ ...nuovaAlRistorante, nome: 'x'.repeat(41) }, ristorante);
    expect(errori.nome).toBe('Al massimo 40 caratteri.');
  });

  it('numero di persone non intero', () => {
    expect(controllaNuova({ ...nuovaAlRistorante, quanti: 2.5 }, ristorante).quanti).toBeDefined();
  });
});

describe('filtro per giorno', () => {
  it('mostra solo quel giorno, in ordine di orario', () => {
    const { prenotazioni } = statoIniziale('ristorante');
    const oggi = prenotazioniDelGiorno(prenotazioni, 0);
    expect(oggi.every((p) => p.giorno === 0)).toBe(true);
    expect(oggi.map((p) => p.ora)).toEqual(['13:00', '20:00', '20:30', '21:15']);
  });

  it('riordina anche prenotazioni inserite in disordine', () => {
    // Gli esempi sono già scritti in ordine: senza questo test, un
    // ordinamento rotto passerebbe inosservato.
    const base = { giorno: 0, nome: 'X', stato: 'richiesta' } as const;
    const disordinate = [
      { ...base, id: 'a', ora: '21:00' },
      { ...base, id: 'b', ora: '09:30' },
      { ...base, id: 'c', ora: '13:00' },
    ];
    expect(prenotazioniDelGiorno(disordinate, 0).map((p) => p.ora)).toEqual([
      '09:30',
      '13:00',
      '21:00',
    ]);
  });

  it("non riordina l'elenco originale", () => {
    const { prenotazioni } = statoIniziale('ristorante');
    const copia = [...prenotazioni];
    prenotazioniDelGiorno(prenotazioni, 0);
    expect(prenotazioni).toEqual(copia);
  });

  it('cambiare attività riporta agli esempi di oggi', () => {
    let stato = aggiornaLavagna(statoIniziale('ristorante'), { tipo: 'scegliGiorno', giorno: 2 });
    stato = aggiornaLavagna(stato, { tipo: 'scegliAttivita', attivita: 'parrucchiere' });
    expect(stato.giorno).toBe(0);
    expect(stato.prenotazioni).toEqual(attivita.parrucchiere.esempi);
  });
});

describe('come si mostra', () => {
  it('singolare e plurale', () => {
    expect(descriviQuanti(1, ristorante)).toBe('1 coperto');
    expect(descriviQuanti(4, ristorante)).toBe('4 coperti');
  });

  it('"con" davanti all\'estetista, niente davanti al tavolo', () => {
    expect(descriviDove('Giulia', attivita['centro-estetico'])).toBe('con Giulia');
    expect(descriviDove('Tavolo 7', ristorante)).toBe('Tavolo 7');
  });
});

describe('riga di spiegazione', () => {
  it("accorda il genere: la prenotazione è confermata, l'appuntamento è confermato", () => {
    const r = aggiornaLavagna(statoIniziale('ristorante'), { tipo: 'avanza', id: 'e4' });
    expect(r.spiegazione).toMatch(/^La prenotazione di Caruso è confermata/);

    const p = aggiornaLavagna(statoIniziale('parrucchiere'), { tipo: 'avanza', id: 'e3' });
    expect(p.spiegazione).toMatch(/^L'appuntamento di Bruno è confermato/);
  });

  it('conta le richieste del giorno scelto', () => {
    const stato = aggiornaLavagna(statoIniziale('ristorante'), { tipo: 'scegliGiorno', giorno: 1 });
    expect(stato.spiegazione).toBe('Domani: 2 prenotazioni, 1 richiesta da confermare.');
  });

  it('giorno vuoto', () => {
    let stato = statoIniziale('agriturismo');
    stato = aggiornaLavagna(stato, { tipo: 'elimina', id: 'e4' });
    stato = aggiornaLavagna(stato, { tipo: 'scegliGiorno', giorno: 2 });
    expect(stato.spiegazione).toBe("Dopodomani non c'è ancora niente in lista.");
  });

  it('nuovo appuntamento: pronome al maschile', () => {
    const dati: DatiNuova = { giorno: 2, ora: '10:00', nome: 'Neri', cosa: 'Prima consulenza' };
    const stato = aggiornaLavagna(statoIniziale('studio-professionale'), {
      tipo: 'aggiungi',
      dati,
    });
    expect(stato.spiegazione).toBe(
      'Nuovo appuntamento per dopodomani alle 10:00: Neri. Resta una richiesta finché non lo confermi.',
    );
  });

  it.each(ordineAttivita)("%s: la frase iniziale nomina l'attività", (id) => {
    expect(statoIniziale(id).spiegazione).toContain(attivita[id].conArticolo);
  });
});
