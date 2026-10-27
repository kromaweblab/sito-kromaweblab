// Il calendario del mese, uguale sul telefono del cliente e sul computer
// dell'attività: cambia solo cosa dice ogni giorno (lo decide chi lo usa,
// con la funzione `giorno`).
//
// Accessibile come chiede lo schema "date picker" del W3C (APG): una
// tabella con ruolo "grid", un solo giorno raggiungibile con Tab, le frecce
// per muoversi di un giorno o di una settimana, Pagina su e giù per il mese,
// Inizio e Fine per la settimana. Ogni giorno si legge per intero
// ("Martedì 13 ottobre, 3 orari liberi"), non solo con il colore.

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { dataDi, mese, mesiDopo } from './logica';
import stili from './Calendario.module.css';

export interface GiornoCalendario {
  /** Si può scegliere. */
  attivo: boolean;
  /** Quello che legge un lettore di schermo. */
  etichetta: string;
  /** Per l'aspetto: libero, pieno, spento (chiuso o passato), o un numero da mostrare. */
  tipo: 'libero' | 'pieno' | 'spento' | 'conta';
  /** Un numero piccolo sotto il giorno (le prenotazioni, sul computer). */
  conta?: number;
}

interface Props {
  oggi: Date;
  scelto: number | null;
  /** Fino a quale mese si può andare: 0 = questo, 1 = il prossimo. */
  ultimoMese: number;
  giorno: (giorno: number) => GiornoCalendario;
  onScegli: (giorno: number) => void;
  /** La legenda sotto il calendario: cosa vogliono dire gli aspetti. */
  legenda: { tipo: GiornoCalendario['tipo']; testo: string }[];
}

const settimana = [
  ['Lun', 'Lunedì'],
  ['Mar', 'Martedì'],
  ['Mer', 'Mercoledì'],
  ['Gio', 'Giovedì'],
  ['Ven', 'Venerdì'],
  ['Sab', 'Sabato'],
  ['Dom', 'Domenica'],
] as const;

export function Calendario({ oggi, scelto, ultimoMese, giorno, onScegli, legenda }: Props) {
  // Il giorno raggiungibile con Tab ("tabindex mobile"): decide anche il mese.
  const [fuoco, setFuoco] = useState(scelto ?? 0);
  const spostamento = Math.min(Math.max(mesiDopo(oggi, fuoco), 0), ultimoMese);
  const { titolo, settimane } = mese(oggi, spostamento);
  const tabella = useRef<HTMLTableElement>(null);
  const daTastiera = useRef(false);
  const id = useId();

  // Se il giorno scelto cambia da fuori (una richiesta appena arrivata), il
  // calendario va a quel giorno. Si aggiusta durante il disegno, come
  // consiglia React, invece che con un effetto.
  const [sceltoPrima, setSceltoPrima] = useState(scelto);
  if (scelto !== sceltoPrima) {
    setSceltoPrima(scelto);
    if (scelto !== null) setFuoco(scelto);
  }

  // Dopo un tasto, il cursore va sul nuovo giorno (anche in un altro mese).
  useEffect(() => {
    if (!daTastiera.current) return;
    daTastiera.current = false;
    tabella.current?.querySelector<HTMLButtonElement>(`[data-giorno="${fuoco}"]`)?.focus();
  }, [fuoco]);

  // Il primo e l'ultimo giorno che si possono vedere.
  const primo = mese(oggi, 0)
    .settimane.flat()
    .find((c) => c !== null)!.giorno;
  const ultimo = mese(oggi, ultimoMese)
    .settimane.flat()
    .filter((c) => c !== null)
    .at(-1)!.giorno;
  const vaiA = (g: number) => setFuoco(Math.min(Math.max(g, primo), ultimo));

  const vaiAlMese = (direzione: -1 | 1) => {
    const nuovo = mese(oggi, spostamento + direzione)
      .settimane.flat()
      .find((c) => c !== null)!;
    // Nel mese di oggi si torna a oggi, non al primo del mese (già passato).
    vaiA(spostamento + direzione === 0 ? 0 : nuovo.giorno);
  };

  const tasto = (e: KeyboardEvent<HTMLButtonElement>) => {
    const giornoSettimana = (dataDi(oggi, fuoco).getDay() + 6) % 7; // 0 = lunedì
    const spostamenti: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      Home: -giornoSettimana,
      End: 6 - giornoSettimana,
      PageUp: -28,
      PageDown: 28,
    };
    const delta = spostamenti[e.key];
    if (delta === undefined) return;
    e.preventDefault();
    daTastiera.current = true;
    vaiA(fuoco + delta);
  };

  return (
    <div className={stili.calendario}>
      <div className={stili.testa}>
        <button
          type="button"
          className={stili.mese}
          disabled={spostamento === 0}
          onClick={() => vaiAlMese(-1)}
          aria-label="Mese precedente"
        >
          ‹
        </button>
        <p id={`${id}-titolo`} className={stili.titolo} aria-live="polite">
          {titolo}
        </p>
        <button
          type="button"
          className={stili.mese}
          disabled={spostamento === ultimoMese}
          onClick={() => vaiAlMese(1)}
          aria-label="Mese successivo"
        >
          ›
        </button>
      </div>

      <table ref={tabella} role="grid" className={stili.griglia} aria-labelledby={`${id}-titolo`}>
        <thead>
          <tr>
            {settimana.map(([corto, intero]) => (
              <th key={corto} scope="col" abbr={intero}>
                {/* Quando il calendario è stretto si vede solo l'iniziale;
                    il nome intero lo legge il lettore di schermo (abbr). */}
                <span className={stili.nomeLungo}>{corto}</span>
                <span className={stili.nomeCorto} aria-hidden="true">
                  {corto.charAt(0)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {settimane.map((righe, r) => (
            <tr key={r}>
              {righe.map((cella, c) => {
                if (cella === null) return <td key={c} />;
                const g = giorno(cella.giorno);
                const eScelto = scelto === cella.giorno;
                return (
                  <td key={c} aria-selected={eScelto}>
                    <button
                      type="button"
                      data-giorno={cella.giorno}
                      data-tipo={g.tipo}
                      className={stili.giorno}
                      tabIndex={cella.giorno === fuoco ? 0 : -1}
                      aria-label={g.etichetta}
                      aria-disabled={!g.attivo || undefined}
                      aria-current={cella.giorno === 0 ? 'date' : undefined}
                      onKeyDown={tasto}
                      onClick={() => {
                        setFuoco(cella.giorno);
                        if (g.attivo) onScegli(cella.giorno);
                      }}
                    >
                      <span className={stili.numero}>{cella.numero}</span>
                      {g.conta !== undefined && g.conta > 0 && (
                        <span className={stili.conta} aria-hidden="true">
                          {g.conta}
                        </span>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* La legenda è per l'occhio: ogni giorno dice già di sé per intero. */}
      <ul className={stili.legenda} aria-hidden="true">
        {legenda.map((l) => (
          <li key={l.tipo}>
            <span className={stili.campione} data-tipo={l.tipo}>
              9
            </span>
            {l.testo}
          </li>
        ))}
      </ul>
    </div>
  );
}
