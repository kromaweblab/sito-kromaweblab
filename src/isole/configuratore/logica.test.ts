import { describe, expect, it } from 'vitest';
// ?raw: Vite legge il file come testo (niente fs di Node, niente tipi in più).
import testoClaude from '../../../CLAUDE.md?raw';
import { domande, preferenze } from './domande';
import {
  campiModulo,
  campoEsca,
  controlla,
  corpoInvio,
  domandeVisibili,
  fraseConferma,
  lunghezzaMassimaNome,
  mostraTempoPerso,
  nomeModulo,
  normalizza,
  riepilogo,
  risposteVuote,
  type Risposte,
} from './logica';

const con = (valori: Partial<Risposte>): Risposte => ({ ...risposteVuote(), ...valori });

describe('campi del modulo', () => {
  it('sono quelli scritti in CLAUDE.md, nello stesso ordine', () => {
    // CLAUDE.md dice "I campi dei due lati devono essere identici": se
    // qualcuno cambia l'elenco in un posto solo, questo test se ne accorge.
    const riga = testoClaude.slice(
      testoClaude.indexOf('I campi dei due lati devono essere identici'),
    );
    const elenco = riga.slice(0, riga.indexOf('Obbligatori'));
    const nomi = [...elenco.matchAll(/`([a-z_]+)`/g)].map((m) => m[1]);
    expect(nomi).toEqual([...campiModulo]);
  });

  it('ogni domanda ha il suo campo', () => {
    for (const d of domande) expect(campiModulo).toContain(d.campo);
  });

  it('nome del modulo e campo esca', () => {
    expect(nomeModulo).toBe('richiesta');
    expect(campiModulo).not.toContain(campoEsca);
  });
});

describe('domande', () => {
  it('le risposte sono quelle decise (DECISIONI.md, 28/09)', () => {
    const risposte = Object.fromEntries(domande.map((d) => [d.campo, d.risposte]));
    expect(risposte.servizio).toEqual(['Sito web', 'Gestionale', 'Web App', 'Ancora non lo so']);
    expect(risposte.attivita).toHaveLength(8);
    expect(risposte.attivita).toContain('Altro');
    expect(risposte.sito_attuale).toContain('Solo una pagina social o su Google Maps');
    expect(risposte.tempo_perso).toContain('Non saprei');
    expect([...preferenze]).toEqual(['Telefonata', 'WhatsApp', 'Email', 'Di persona']);
  });

  it('niente risposte doppie', () => {
    for (const d of domande) expect(new Set(d.risposte).size).toBe(d.risposte.length);
  });

  it('il tempo perso si chiede a tutti tranne a chi vuole un sito', () => {
    expect(mostraTempoPerso('Sito web')).toBe(false);
    expect(mostraTempoPerso('Gestionale')).toBe(true);
    expect(mostraTempoPerso('Web App')).toBe(true);
    expect(mostraTempoPerso('Ancora non lo so')).toBe(true);
    expect(mostraTempoPerso('')).toBe(true);
    expect(domandeVisibili(con({ servizio: 'Sito web' })).map((d) => d.campo)).not.toContain(
      'tempo_perso',
    );
  });

  it('se passa a "Sito web", il tempo perso scelto prima non parte', () => {
    const r = normalizza(con({ servizio: 'Sito web', tempo_perso: "Più di un'ora" }));
    expect(r.tempo_perso).toBe('');
  });
});

describe('controlli', () => {
  it('le domande a scelta sono facoltative: bastano nome e un recapito', () => {
    expect(controlla(con({ nome: 'Rosa', telefono: '333 123 4567' }))).toEqual({});
    expect(controlla(con({ nome: 'Rosa', email: 'rosa@esempio.it' }))).toEqual({});
  });

  it('modulo vuoto: nome e recapito', () => {
    expect(controlla(risposteVuote())).toEqual({
      nome: 'Scrivi il tuo nome.',
      recapito: "Lasciaci almeno un telefono o un'email.",
    });
  });

  it('solo spazi vale come vuoto', () => {
    expect(controlla(con({ nome: '   ', telefono: '  ' }))).toHaveProperty('nome');
  });

  it('WhatsApp o Telefonata: serve il numero', () => {
    expect(
      controlla(con({ nome: 'Rosa', email: 'rosa@esempio.it', come_sentirci: 'WhatsApp' })),
    ).toEqual({
      telefono: 'Per sentirci su WhatsApp ci serve il tuo numero.',
    });
    expect(
      controlla(con({ nome: 'Rosa', email: 'rosa@esempio.it', come_sentirci: 'Telefonata' }))
        .telefono,
    ).toBe('Per sentirci con una telefonata ci serve il tuo numero.');
  });

  it("Email: serve l'email", () => {
    expect(
      controlla(con({ nome: 'Rosa', telefono: '3331234567', come_sentirci: 'Email' })),
    ).toEqual({
      email: 'Per sentirci via email ci serve la tua email.',
    });
  });

  it('Di persona: basta uno dei due', () => {
    expect(
      controlla(con({ nome: 'Rosa', telefono: '3331234567', come_sentirci: 'Di persona' })),
    ).toEqual({});
    expect(controlla(con({ nome: 'Rosa', come_sentirci: 'Di persona' }))).toHaveProperty(
      'recapito',
    );
  });

  it.each(['333 123 4567', '+39 0932 123456', '0932-123456', '(0932) 12.34.56'])(
    'telefono valido: %s',
    (t) => {
      expect(controlla(con({ nome: 'Rosa', telefono: t }))).toEqual({});
    },
  );

  it.each(['123', 'tre tre tre', '3331234567890123'])('telefono da controllare: %s', (t) => {
    expect(controlla(con({ nome: 'Rosa', telefono: t })).telefono).toBe(
      'Controlla il numero: sembra incompleto.',
    );
  });

  it.each(['rosa', 'rosa@', 'rosa@esempio', 'rosa @esempio.it'])(
    'email da controllare: %s',
    (e) => {
      expect(controlla(con({ nome: 'Rosa', email: e })).email).toBe(
        "Controlla l'email: manca qualcosa.",
      );
    },
  );

  it('nome troppo lungo', () => {
    expect(
      controlla(con({ nome: 'x'.repeat(lunghezzaMassimaNome + 1), telefono: '3331234567' })).nome,
    ).toBeDefined();
  });
});

describe('riepilogo', () => {
  it("solo le risposte date, nell'ordine delle domande", () => {
    const r = con({
      attivita: 'Ristorante o bar',
      servizio: 'Gestionale',
      tempo_perso: "Più di un'ora",
    });
    expect(riepilogo(r)).toBe("Ristorante o bar · Gestionale · Più di un'ora");
  });

  it('nessuna risposta: riepilogo vuoto', () => {
    expect(riepilogo(risposteVuote())).toBe('');
  });
});

describe('invio a Netlify', () => {
  it('form-name, tutti i campi e il campo esca, in formato modulo', () => {
    const corpo = new URLSearchParams(
      corpoInvio(
        con({
          nome: ' Rosa ',
          telefono: '333 123 4567',
          servizio: 'Sito web',
          tempo_perso: 'Non saprei',
        }),
      ),
    );
    expect(corpo.get('form-name')).toBe('richiesta');
    expect([...corpo.keys()]).toEqual(['form-name', ...campiModulo, campoEsca]);
    expect(corpo.get('nome')).toBe('Rosa');
    expect(corpo.get('tempo_perso')).toBe('');
    expect(corpo.get(campoEsca)).toBe('');
  });

  it("il campo esca riempito da un robot arriva a Netlify così com'è", () => {
    const corpo = new URLSearchParams(corpoInvio(con({ nome: 'Rosa' }), 'spam'));
    expect(corpo.get(campoEsca)).toBe('spam');
  });

  it('i caratteri speciali arrivano intatti', () => {
    const corpo = new URLSearchParams(
      corpoInvio(con({ attivita: 'Agriturismo o B&B', messaggio: 'Più di 3 € & più' })),
    );
    expect(corpo.get('attivita')).toBe('Agriturismo o B&B');
    expect(corpo.get('messaggio')).toBe('Più di 3 € & più');
  });
});

describe('frase di conferma', () => {
  it('usa il canale scelto', () => {
    expect(fraseConferma(con({ come_sentirci: 'WhatsApp' }))).toBe(
      'Grazie. Ti scriviamo su WhatsApp per fissare il colloquio.',
    );
    expect(fraseConferma(con({ come_sentirci: 'Di persona' }))).toContain('dove e quando vederci');
    expect(fraseConferma(risposteVuote())).toBe(
      'Grazie. Ti ricontattiamo per fissare il colloquio.',
    );
  });
});
