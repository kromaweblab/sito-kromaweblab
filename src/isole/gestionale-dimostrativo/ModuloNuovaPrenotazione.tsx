// Il modulo "aggiungi una prenotazione". Sta dentro un <details>: chiuso
// non occupa spazio sul telefono, e si apre da tastiera senza JavaScript.
//
// Il componente padre lo monta con key={attività}: cambiando attività il
// modulo riparte da zero, perché tavoli e servizi della vecchia attività
// non avrebbero più senso.

import { useId, useState, type SubmitEvent } from 'react';
import type { Attivita } from './attivita';
import {
  controllaNuova,
  giorni,
  lunghezzaMassimaNome,
  nomiGiorni,
  type CampoModulo,
  type DatiNuova,
  type ErroriModulo,
  type Giorno,
} from './logica';
import stili from './GestionaleDimostrativo.module.css';

interface Props {
  attivita: Attivita;
  /** Il giorno che il visitatore sta guardando: proposto come predefinito. */
  giornoProposto: Giorno;
  onAggiungi: (dati: DatiNuova) => void;
}

/** I valori dei campi come li scrive il browser: sempre stringhe. */
interface Campi {
  giorno: string;
  ora: string;
  nome: string;
  quanti: string;
  dove: string;
  cosa: string;
}

const ordineCampi: CampoModulo[] = ['nome', 'ora', 'quanti', 'dove', 'cosa'];

export function ModuloNuovaPrenotazione({ attivita: a, giornoProposto, onAggiungi }: Props) {
  const base = useId();
  const id = (campo: string) => `${base}-${campo}`;

  const [campi, setCampi] = useState<Campi>({
    giorno: String(giornoProposto),
    ora: '',
    nome: '',
    quanti: '',
    dove: '',
    cosa: '',
  });
  const [errori, setErrori] = useState<ErroriModulo>({});

  const cambia = (campo: keyof Campi) => (e: { target: { value: string } }) =>
    setCampi((c) => ({ ...c, [campo]: e.target.value }));

  function invia(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const dati: DatiNuova = {
      giorno: Number(campi.giorno) as Giorno,
      ora: campi.ora,
      nome: campi.nome,
      ...(a.quanti && { quanti: campi.quanti === '' ? undefined : Number(campi.quanti) }),
      ...(a.dove && { dove: campi.dove }),
      ...(a.cosa && { cosa: campi.cosa }),
    };
    const trovati = controllaNuova(dati, a);
    setErrori(trovati);

    const primoSbagliato = ordineCampi.find((campo) => trovati[campo]);
    if (primoSbagliato) {
      // Il cursore va sul primo campo da correggere: chi usa la tastiera o
      // un lettore di schermo sente subito l'errore.
      document.getElementById(id(primoSbagliato))?.focus();
      return;
    }
    onAggiungi(dati);
    // Si svuota solo il nome: chi aggiunge più prenotazioni di fila
    // di solito cambia la persona, non il giorno o il tavolo.
    setCampi((c) => ({ ...c, nome: '' }));
  }

  /** Attributi comuni: errore collegato al campo, per i lettori di schermo. */
  const collegaErrore = (campo: CampoModulo) => ({
    id: id(campo),
    'aria-invalid': errori[campo] ? true : undefined,
    'aria-describedby': errori[campo] ? id(`${campo}-errore`) : undefined,
  });

  const messaggioErrore = (campo: CampoModulo) =>
    errori[campo] && (
      <p id={id(`${campo}-errore`)} className={stili.errore}>
        {errori[campo]}
      </p>
    );

  return (
    <details className={stili.modulo}>
      <summary>
        Aggiungi {a.evento.femminile ? 'una' : 'un'} {a.evento.singolare}
      </summary>

      {/* noValidate: i messaggi d'errore sono i nostri, uguali su ogni browser. */}
      <form onSubmit={invia} noValidate>
        <div className={stili.campo}>
          <label htmlFor={id('nome')}>
            Nome {a.chi === 'ospite' ? "dell'ospite" : `del ${a.chi}`}
          </label>
          <input
            type="text"
            autoComplete="off"
            maxLength={lunghezzaMassimaNome}
            value={campi.nome}
            onChange={cambia('nome')}
            {...collegaErrore('nome')}
          />
          {messaggioErrore('nome')}
        </div>

        <div className={stili.campo}>
          <label htmlFor={id('giorno')}>Giorno</label>
          <select id={id('giorno')} value={campi.giorno} onChange={cambia('giorno')}>
            {giorni.map((g) => (
              <option key={g} value={g}>
                {nomiGiorni[g]}
              </option>
            ))}
          </select>
        </div>

        <div className={stili.campo}>
          <label htmlFor={id('ora')}>Ora</label>
          <input type="time" value={campi.ora} onChange={cambia('ora')} {...collegaErrore('ora')} />
          {messaggioErrore('ora')}
        </div>

        {a.quanti && (
          <div className={stili.campo}>
            <label htmlFor={id('quanti')}>{maiuscola(a.quanti.plurale)}</label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={a.quanti.massimo}
              value={campi.quanti}
              onChange={cambia('quanti')}
              {...collegaErrore('quanti')}
            />
            {messaggioErrore('quanti')}
          </div>
        )}

        {a.dove && (
          <div className={stili.campo}>
            <label htmlFor={id('dove')}>{a.dove.etichetta}</label>
            <select value={campi.dove} onChange={cambia('dove')} {...collegaErrore('dove')}>
              <option value="">Scegli…</option>
              {a.dove.scelte.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {messaggioErrore('dove')}
          </div>
        )}

        {a.cosa && (
          <div className={stili.campo}>
            <label htmlFor={id('cosa')}>{a.cosa.etichetta}</label>
            <select value={campi.cosa} onChange={cambia('cosa')} {...collegaErrore('cosa')}>
              <option value="">Scegli…</option>
              {a.cosa.scelte.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {messaggioErrore('cosa')}
          </div>
        )}

        <button type="submit">Aggiungi</button>
      </form>
    </details>
  );
}

const maiuscola = (testo: string) => testo.charAt(0).toUpperCase() + testo.slice(1);
