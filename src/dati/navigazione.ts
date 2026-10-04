// Voci del menu, usate dall'intestazione e dal piè di pagina.
// "Fissa un incontro" (la pagina contatti) è separato perché nel menu ha
// l'aspetto di un pulsante.

export interface Voce {
  testo: string;
  href: string;
}

export const vociMenu: Voce[] = [
  { testo: 'Lavori', href: '/lavori' },
  { testo: 'Servizi', href: '/servizi' },
  { testo: 'Chi siamo', href: '/chi-siamo' },
];

export const voceContatti: Voce = { testo: 'Fissa un incontro', href: '/contatti' };

/** Le pagine dei tre servizi, per il piè di pagina (nomi brevi). */
export const vociServizi: Voce[] = [
  { testo: 'Gestionali e web app', href: '/gestionali' },
  { testo: 'Siti web', href: '/siti' },
  { testo: 'Manutenzione', href: '/manutenzione' },
];
