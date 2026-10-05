import { describe, expect, it } from 'vitest';
import { operatoreDelTelefono, ordineSettori, settori } from './settori';
import {
  aggiorna,
  compitiDelTelefono,
  controllaRapporto,
  formattaOre,
  materialiUsati,
  oraDa,
  orePerCantiere,
  statoIniziale,
  type DatiRapporto,
} from './logica';

const rapportoInSerra: DatiRapporto = {
  cantiere: 'Serra 2',
  lavoro: 'Irrigazione',
  ore: 2.5,
  materiale: { indice: 0, quantita: 3 },
  nota: '',
};

describe('settori', () => {
  it('ogni settore ha dati di partenza coerenti con i suoi elenchi', () => {
    for (const id of ordineSettori) {
      const s = settori[id];
      for (const r of s.rapportiIniziali) {
        expect(s.cantieri).toContain(r.cantiere);
        expect(s.lavori).toContain(r.lavoro);
        if (r.materiale) expect(s.materiali[r.materiale.indice]).toBeDefined();
      }
      for (const c of s.compitiIniziali) {
        expect(s.cantieri).toContain(c.cantiere);
        expect(s.lavori).toContain(c.lavoro);
      }
    }
  });

  it('nessun cognome: gli operatori sono numerati', () => {
    for (const id of ordineSettori) {
      for (const r of settori[id].rapportiIniziali) {
        expect(r.operatore).toMatch(/^Operatore \d$/);
      }
    }
  });
});

describe('formati', () => {
  it('scrive le ore con la virgola', () => {
    expect(formattaOre(2.5)).toBe('2,5 h');
    expect(formattaOre(3)).toBe('3 h');
  });

  it('scrive gli orari con due cifre', () => {
    expect(oraDa(11 * 60 + 5)).toBe('11:05');
    expect(oraDa(7 * 60)).toBe('07:00');
  });
});

describe('stato iniziale', () => {
  it('parte con i rapporti degli altri e due lavori sul telefono', () => {
    const s = statoIniziale('verde');
    expect(s.rapporti).toHaveLength(3);
    expect(compitiDelTelefono(s)).toHaveLength(2);
    expect(s.nuoviInUfficio).toBe(0);
  });

  it('somma le ore per cantiere, nell’ordine dei cantieri', () => {
    const ore = orePerCantiere(statoIniziale('verde'));
    expect(ore.map((o) => o.cantiere)).toEqual(settori.verde.cantieri);
    expect(ore.find((o) => o.cantiere === 'Villa al mare')?.ore).toBe(4.5);
    expect(ore.find((o) => o.cantiere === 'Serra 2')?.ore).toBe(0);
  });
});

describe('dal telefono all’ufficio', () => {
  it('il rapporto arriva in ufficio, evidenziato, e le ore si sommano', () => {
    const s = aggiorna(statoIniziale('verde'), { tipo: 'invia', dati: rapportoInSerra });
    const ultimo = s.rapporti.at(-1)!;
    expect(ultimo.operatore).toBe(operatoreDelTelefono);
    expect(s.ultimoRapporto).toBe(ultimo.id);
    expect(s.nuoviInUfficio).toBe(1);
    expect(orePerCantiere(s).find((o) => o.cantiere === 'Serra 2')?.ore).toBe(2.5);
    expect(s.spiegazione).toContain('Serra 2 ora conta 2,5 h');
    expect(ultimo.ora).toBe('11:07');
  });

  it('il materiale si aggiunge al totale di oggi', () => {
    const prima = materialiUsati(statoIniziale('verde')).find((m) => m.nome === 'Concime')!;
    const s = aggiorna(statoIniziale('verde'), { tipo: 'invia', dati: rapportoInSerra });
    const dopo = materialiUsati(s).find((m) => m.nome === 'Concime')!;
    expect(dopo.quantita).toBe(prima.quantita + 3);
  });

  it('un rapporto sbagliato non parte', () => {
    const iniziale = statoIniziale('verde');
    const senzaOre = { ...rapportoInSerra, ore: 0 };
    expect(controllaRapporto(senzaOre, settori.verde)).toMatch(/ore/);
    expect(aggiorna(iniziale, { tipo: 'invia', dati: senzaOre })).toBe(iniziale);
    const altroSettore = { ...rapportoInSerra, cantiere: 'Scuola' };
    expect(controllaRapporto(altroSettore, settori.verde)).toMatch(/cantiere/);
  });
});

describe('dall’ufficio al telefono', () => {
  it('un lavoro assegnato a Operatore 1 compare in cima al telefono', () => {
    const s = aggiorna(statoIniziale('verde'), {
      tipo: 'assegna',
      dati: { operatore: operatoreDelTelefono, cantiere: 'Villa al mare', lavoro: 'Potatura' },
    });
    const primo = compitiDelTelefono(s)[0]!;
    expect(primo.lavoro).toBe('Potatura');
    expect(s.ultimoCompito).toBe(primo.id);
    expect(s.nuoviSulTelefono).toBe(1);
  });

  it('un lavoro per un altro operatore non arriva su questo telefono', () => {
    const iniziale = statoIniziale('verde');
    const s = aggiorna(iniziale, {
      tipo: 'assegna',
      dati: { operatore: 'Operatore 3', cantiere: 'Villa al mare', lavoro: 'Potatura' },
    });
    expect(compitiDelTelefono(s)).toHaveLength(compitiDelTelefono(iniziale).length);
    expect(s.nuoviSulTelefono).toBe(0);
    expect(s.spiegazione).toContain('Operatore 3');
  });

  it('un lavoro segnato come fatto scende in fondo, con l’ora', () => {
    const iniziale = statoIniziale('verde');
    const primo = compitiDelTelefono(iniziale)[0]!;
    const s = aggiorna(iniziale, { tipo: 'fatto', id: primo.id });
    const lista = compitiDelTelefono(s);
    expect(lista.at(-1)!.id).toBe(primo.id);
    expect(lista.at(-1)!.fattoAlle).toBe('11:07');
    // Una seconda volta non cambia niente.
    expect(aggiorna(s, { tipo: 'fatto', id: primo.id })).toBe(s);
  });
});

describe('settore e novità', () => {
  it('cambiare settore riparte da capo con i dati del settore', () => {
    const s = aggiorna(aggiorna(statoIniziale('verde'), { tipo: 'invia', dati: rapportoInSerra }), {
      tipo: 'settore',
      settore: 'pulizie',
    });
    expect(s.settore).toBe('pulizie');
    expect(s.rapporti).toHaveLength(settori.pulizie.rapportiIniziali.length);
    expect(s.nuoviInUfficio).toBe(0);
  });

  it('guardare l’ufficio azzera le sue novità', () => {
    const s = aggiorna(statoIniziale('verde'), { tipo: 'invia', dati: rapportoInSerra });
    expect(aggiorna(s, { tipo: 'guarda', vista: 'ufficio' }).nuoviInUfficio).toBe(0);
  });
});
