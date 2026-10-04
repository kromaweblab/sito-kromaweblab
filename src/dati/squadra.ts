// Chi siamo: le due persone dello studio. Li usano la sezione "Voi due"
// della home e, più avanti, la pagina /chi-siamo.
// Le frasi le scrivono Giovanni e Andrea con parole loro: finché non ci
// sono resta il segnaposto. `foto` è null finché non ci sono le foto vere.

import { DA_SCRIVERE } from './sito';

export interface Persona {
  nome: string;
  /** Cosa fa nello studio, in poche parole. */
  ruolo: string;
  /** Una frase sua: come lavora, cosa gli piace costruire. */
  frase: string;
  /** Percorso della foto in src/assets/squadra/, oppure null. */
  foto: string | null;
}

export const squadra: Persona[] = [
  { nome: 'Giovanni', ruolo: DA_SCRIVERE, frase: DA_SCRIVERE, foto: null },
  { nome: 'Andrea', ruolo: DA_SCRIVERE, frase: DA_SCRIVERE, foto: null },
];

/**
 * La storia dello studio, per /chi-siamo. La scrivono Giovanni e Andrea:
 * finché non c'è resta il segnaposto.
 */
export const studio = {
  /** Come è nato Kroma Web Lab, in due o tre frasi. */
  storia: DA_SCRIVERE,
  /** Perché lavoriamo così: due persone, niente reparti, chi ascolta costruisce. */
  perche: DA_SCRIVERE,
};
