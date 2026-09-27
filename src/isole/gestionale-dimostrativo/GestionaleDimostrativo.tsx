// Gestionale dimostrativo: una lavagna di prenotazioni che il visitatore
// può usare davvero, con dati di esempio e tutto in memoria.
// Nella pagina: <GestionaleDimostrativo client:visible />
//
// Tutta la logica è in logica.ts; qui c'è solo l'interfaccia.

import { useEffect, useReducer, useRef, useSyncExternalStore } from 'react';
import { attivita, ordineAttivita, type IdAttivita } from './attivita';
import {
  aggiornaLavagna,
  descriviDove,
  descriviQuanti,
  etichettaData,
  giorni,
  nomiGiorni,
  prenotazioniDelGiorno,
  statoIniziale,
  testoPulsanteAvanza,
  type Prenotazione,
} from './logica';
import { ModuloNuovaPrenotazione } from './ModuloNuovaPrenotazione';
import stili from './GestionaleDimostrativo.module.css';

export function GestionaleDimostrativo() {
  const [stato, invia] = useReducer(aggiornaLavagna, 'ristorante', statoIniziale);
  const a = attivita[stato.attivita];
  const delGiorno = prenotazioniDelGiorno(stato.prenotazioni, stato.giorno);
  const oggi = useOggiNelBrowser();

  // Se il pulsante appena premuto sparisce (prenotazione eliminata o
  // completata), il cursore della tastiera finirebbe in cima alla pagina.
  // Lo riportiamo sulla lista.
  const lista = useRef<HTMLDivElement>(null);
  const fuocoPerso = useRef(false);
  useEffect(() => {
    if (fuocoPerso.current && !lista.current?.contains(document.activeElement)) {
      lista.current?.focus();
    }
    fuocoPerso.current = false;
  }, [stato.prenotazioni]);

  const azionePrenotazione = (azione: { tipo: 'avanza' | 'elimina'; id: string }) => {
    fuocoPerso.current = true;
    invia(azione);
  };

  return (
    <div className={stili.gestionale}>
      <p className={stili.avviso}>Dati di esempio</p>

      <fieldset>
        <legend>Tipo di attività</legend>
        {ordineAttivita.map((id) => (
          <label key={id}>
            <input
              type="radio"
              name="attivita"
              value={id}
              checked={stato.attivita === id}
              onChange={() => invia({ tipo: 'scegliAttivita', attivita: id })}
            />
            {attivita[id].nome}
          </label>
        ))}
      </fieldset>

      {/* La riga che spiega cosa succede. aria-live: i lettori di schermo
          la leggono da soli ogni volta che cambia. */}
      <p className={stili.spiegazione} aria-live="polite">
        {stato.spiegazione}
      </p>

      <fieldset>
        <legend>Giorno</legend>
        {giorni.map((g) => (
          <label key={g}>
            <input
              type="radio"
              name="giorno"
              value={g}
              checked={stato.giorno === g}
              onChange={() => invia({ tipo: 'scegliGiorno', giorno: g })}
            />
            {nomiGiorni[g]}
            {/* Vuota alla build, riempita nel browser: vedi useOggiNelBrowser. */}
            <span className={stili.data}>{oggi !== null && etichettaData(new Date(oggi), g)}</span>
          </label>
        ))}
      </fieldset>

      <div ref={lista} tabIndex={-1} className={stili.lista}>
        {delGiorno.length === 0 ? (
          <p>
            Nessun{a.evento.femminile ? 'a' : ''} {a.evento.singolare} per questo giorno.
          </p>
        ) : (
          <ul
            aria-label={`${maiuscola(a.evento.plurale)}: ${nomiGiorni[stato.giorno].toLowerCase()}`}
          >
            {delGiorno.map((p) => (
              <RigaPrenotazione
                key={p.id}
                prenotazione={p}
                idAttivita={stato.attivita}
                onAvanza={() => azionePrenotazione({ tipo: 'avanza', id: p.id })}
                onElimina={() => azionePrenotazione({ tipo: 'elimina', id: p.id })}
              />
            ))}
          </ul>
        )}
      </div>

      <ModuloNuovaPrenotazione
        key={stato.attivita}
        attivita={a}
        giornoProposto={stato.giorno}
        onAggiungi={(dati) => invia({ tipo: 'aggiungi', dati })}
      />
    </div>
  );
}

interface PropsRiga {
  prenotazione: Prenotazione;
  idAttivita: IdAttivita;
  onAvanza: () => void;
  onElimina: () => void;
}

function RigaPrenotazione({ prenotazione: p, idAttivita, onAvanza, onElimina }: PropsRiga) {
  const a = attivita[idAttivita];
  // Per i lettori di schermo "Conferma" da solo, ripetuto su ogni riga,
  // non basta: si aggiunge di chi è la prenotazione, senza mostrarlo.
  const diChi = ` ${a.evento.articolo}${a.evento.singolare} di ${p.nome}`;

  return (
    <li className={stili.prenotazione} data-stato={p.stato}>
      <span className={stili.ora}>{p.ora}</span>
      <span className={stili.nome}>{p.nome}</span>
      {p.quanti !== undefined && <span>{descriviQuanti(p.quanti, a)}</span>}
      {p.dove && <span>{descriviDove(p.dove, a)}</span>}
      {p.cosa && <span>{p.cosa}</span>}
      <span className={stili.stato}>
        <span className={stili.quadretto} aria-hidden="true" />
        {p.stato}
      </span>
      <span className={stili.azioni}>
        {p.stato !== 'completata' && (
          <button type="button" onClick={onAvanza}>
            {testoPulsanteAvanza(p.stato, a)}
            <span className={stili.soloLettori}>{diChi}</span>
          </button>
        )}
        <button type="button" onClick={onElimina}>
          Elimina
          <span className={stili.soloLettori}>{diChi}</span>
        </button>
      </span>
    </li>
  );
}

// ---------------------------------------------------------------------------
// La data di oggi, solo nel browser.
//
// useSyncExternalStore ha due "letture": una per il server (qui: la build)
// e una per il browser. Durante l'idratazione React usa quella del server,
// così il primo disegno coincide con l'HTML della build; subito dopo
// ridisegna con quella del browser. È il modo previsto da React per i
// valori che esistono solo nel browser, senza errori di idratazione.

const nessunaIscrizione = () => () => {};
/** Mezzanotte di oggi, come numero: resta uguale per tutto il giorno. */
const oggiNelBrowser = () => new Date().setHours(0, 0, 0, 0);
const oggiAllaBuild = () => null;

function useOggiNelBrowser(): number | null {
  return useSyncExternalStore(nessunaIscrizione, oggiNelBrowser, oggiAllaBuild);
}

const maiuscola = (testo: string) => testo.charAt(0).toUpperCase() + testo.slice(1);
