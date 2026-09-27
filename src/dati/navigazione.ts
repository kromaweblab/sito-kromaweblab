// Voci del menu, usate dall'intestazione e dal piè di pagina.
// "Contatti" è separato perché nel menu ha l'aspetto di un pulsante.

export interface Voce {
  testo: string;
  href: string;
}

export const vociMenu: Voce[] = [
  { testo: 'Servizi', href: '/servizi' },
  { testo: 'Lavori', href: '/lavori' },
  { testo: 'Come lavoriamo', href: '/come-lavoriamo' },
  { testo: 'Chi siamo', href: '/chi-siamo' },
];

export const voceContatti: Voce = { testo: 'Contatti', href: '/contatti' };
