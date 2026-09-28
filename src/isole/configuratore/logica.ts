// Logica del configuratore: solo funzioni pure, senza React.
// La usano il componente (Configuratore.tsx) e la copia nascosta per
// Netlify (ModuloRichiestaNascosto.astro); i test sono in logica.test.ts.

import { domande, servizioSenzaTempoPerso, type Preferenza } from './domande';

// ---------------------------------------------------------------------------
// Il modulo per Netlify

/** Il nome del modulo: Netlify lo riconosce da qui. */
export const nomeModulo = 'richiesta';

/**
 * I campi del modulo, nell'ordine in cui arrivano a Netlify.
 * È l'UNICO elenco: lo importano sia il componente React sia la copia
 * nascosta in .astro, così i due lati non possono diventare diversi.
 */
export const campiModulo = [
  'attivita',
  'servizio',
  'sito_attuale',
  'tempo_perso',
  'nome',
  'telefono',
  'email',
  'come_sentirci',
  'messaggio',
] as const;
export type Campo = (typeof campiModulo)[number];

/** Campo esca contro lo spam: le persone non lo vedono, i robot lo riempiono. */
export const campoEsca = 'bot-field';

export type Risposte = Record<Campo, string>;

export function risposteVuote(): Risposte {
  return Object.fromEntries(campiModulo.map((c) => [c, ''])) as Risposte;
}

// ---------------------------------------------------------------------------
// Domande

/** La domanda sul tempo perso compare per tutti tranne chi vuole un sito. */
export function mostraTempoPerso(servizio: string): boolean {
  return servizio !== servizioSenzaTempoPerso;
}

/** Le domande da mostrare, date le risposte fin qui. */
export function domandeVisibili(r: Risposte) {
  return domande.filter((d) => d.campo !== 'tempo_perso' || mostraTempoPerso(r.servizio));
}

/**
 * Le risposte come partono davvero: spazi tolti, e tempo perso svuotato se
 * la domanda non è visibile (chi l'ha scelto e poi è passato a "Sito web").
 */
export function normalizza(r: Risposte): Risposte {
  const pulite = Object.fromEntries(campiModulo.map((c) => [c, r[c].trim()])) as Risposte;
  if (!mostraTempoPerso(pulite.servizio)) pulite.tempo_perso = '';
  return pulite;
}

// ---------------------------------------------------------------------------
// Controlli

export type CampoErrore = 'nome' | 'telefono' | 'email' | 'recapito' | 'messaggio';
export type Errori = Partial<Record<CampoErrore, string>>;

export const lunghezzaMassimaNome = 80;
export const lunghezzaMassimaMessaggio = 2000;

/** Un telefono plausibile: da 6 a 15 cifre, con spazi, +, trattini o punti. */
function telefonoPlausibile(telefono: string): boolean {
  if (!/^[+\d\s().-]+$/.test(telefono)) return false;
  const cifre = telefono.replace(/\D/g, '').length;
  return cifre >= 6 && cifre <= 15;
}

/** Controllo leggero: ci pensa chi ci scrive a dirci se è giusta. */
function emailPlausibile(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Obbligatori solo il nome e un recapito. La preferenza decide quale:
 * Telefonata o WhatsApp → telefono, Email → email, altrimenti uno dei due.
 * Oggetto vuoto = si può inviare.
 */
export function controlla(risposte: Risposte): Errori {
  const r = normalizza(risposte);
  const errori: Errori = {};

  if (r.nome === '') errori.nome = 'Scrivi il tuo nome.';
  else if (r.nome.length > lunghezzaMassimaNome)
    errori.nome = `Al massimo ${lunghezzaMassimaNome} caratteri.`;

  if (r.telefono !== '' && !telefonoPlausibile(r.telefono)) {
    errori.telefono = 'Controlla il numero: sembra incompleto.';
  }
  if (r.email !== '' && !emailPlausibile(r.email)) {
    errori.email = "Controlla l'email: manca qualcosa.";
  }

  const preferenza = r.come_sentirci as Preferenza | '';
  if ((preferenza === 'Telefonata' || preferenza === 'WhatsApp') && r.telefono === '') {
    const come = preferenza === 'WhatsApp' ? 'su WhatsApp' : 'con una telefonata';
    errori.telefono = `Per sentirci ${come} ci serve il tuo numero.`;
  } else if (preferenza === 'Email' && r.email === '') {
    errori.email = 'Per sentirci via email ci serve la tua email.';
  } else if (r.telefono === '' && r.email === '') {
    errori.recapito = "Lasciaci almeno un telefono o un'email.";
  }

  if (r.messaggio.length > lunghezzaMassimaMessaggio) {
    errori.messaggio = `Al massimo ${lunghezzaMassimaMessaggio} caratteri.`;
  }
  return errori;
}

// ---------------------------------------------------------------------------
// Riepilogo, invio, conferma

/** "Ristorante o bar · Gestionale · …": solo le domande con una risposta. */
export function riepilogo(risposte: Risposte): string {
  const r = normalizza(risposte);
  return domande
    .map((d) => r[d.campo])
    .filter((valore) => valore !== '')
    .join(' · ');
}

/**
 * Il corpo della richiesta a Netlify, nel formato di un modulo HTML
 * (application/x-www-form-urlencoded): form-name, tutti i campi (anche
 * vuoti, come farebbe il browser) e il campo esca con il suo valore.
 */
export function corpoInvio(risposte: Risposte, esca = ''): string {
  const r = normalizza(risposte);
  const dati = new URLSearchParams({ 'form-name': nomeModulo });
  for (const campo of campiModulo) dati.append(campo, r[campo]);
  // Il valore VERO del campo esca: se un robot l'ha riempito, Netlify deve
  // vederlo per scartare la richiesta.
  dati.append(campoEsca, esca);
  return dati.toString();
}

/** La frase dopo l'invio, con il canale che ha scelto. */
export function fraseConferma(risposte: Risposte): string {
  const come: Record<Preferenza, string> = {
    Telefonata: 'Ti chiamiamo per fissare il colloquio.',
    WhatsApp: 'Ti scriviamo su WhatsApp per fissare il colloquio.',
    Email: 'Ti scriviamo via email per fissare il colloquio.',
    'Di persona': 'Ti ricontattiamo per fissare dove e quando vederci.',
  };
  const preferenza = normalizza(risposte).come_sentirci as Preferenza | '';
  return `Grazie. ${preferenza === '' ? 'Ti ricontattiamo per fissare il colloquio.' : come[preferenza]}`;
}
