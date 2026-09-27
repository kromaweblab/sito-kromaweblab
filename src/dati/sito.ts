// Dati dell'attività usati in più punti (piè di pagina, contatti, SEO).
// Un valore `null` significa "non lo abbiamo ancora": nel testo visibile
// si mostra [DA SCRIVERE], nei dati per Google (JSON-LD) si omette.

export const DA_SCRIVERE = '[DA SCRIVERE]';

export const sito = {
  nome: 'Kroma Web Lab',
  url: 'https://kromaweblab.it',
  comune: 'Scicli',
  provincia: 'Ragusa',
  siglaProvincia: 'RG',
  cap: '97018',
  regione: 'Sicilia',
  zoneServite: ['Scicli', 'Provincia di Ragusa', 'Val di Noto'],
  email: null as string | null,
  telefono: null as string | null,
  indirizzo: null as string | null,
} as const;

/** Restituisce il valore o il segnaposto evidente. */
export const oSegnaposto = (valore: string | null) => valore ?? DA_SCRIVERE;
