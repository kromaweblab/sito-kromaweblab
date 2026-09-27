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
    // Due contenitori: .gestionale dice al CSS quanto spazio ha l'isola
    // (container query), .impianto dispone i blocchi di conseguenza.
    <div className={stili.gestionale}>
      <div className={stili.impianto}>
        <p className={stili.avviso}>Dati di esempio</p>

        <fieldset className={stili.attivita}>
          <legend>Tipo di attività</legend>
          <div className={stili.scelte}>
            {ordineAttivita.map((id) => (
              // Il radio vero resta, invisibile ma raggiungibile da tastiera;
              // si vede il riquadro accanto (vedi .radio nel CSS).
              <label key={id}>
                <input
                  type="radio"
                  className={stili.radio}
                  name="attivita"
                  value={id}
                  checked={stato.attivita === id}
                  onChange={() => invia({ tipo: 'scegliAttivita', attivita: id })}
                />
                <span className={stili.scelta}>{attivita[id].nome}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={stili.giorni}>
          <legend>Giorno</legend>
          <div className={stili.sceltaGiorno}>
            {giorni.map((g) => (
              <label key={g}>
                <input
                  type="radio"
                  className={stili.radio}
                  name="giorno"
                  value={g}
                  checked={stato.giorno === g}
                  onChange={() => invia({ tipo: 'scegliGiorno', giorno: g })}
                />
                <span className={stili.scelta}>
                  <span className={stili.nomeGiorno}>{nomiGiorni[g]}</span>
                  {/* Vuota alla build, riempita nel browser: vedi useOggiNelBrowser. */}
                  <span className={stili.data}>
                    {oggi !== null && etichettaData(new Date(oggi), g)}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* La riga che spiega cosa succede, subito sopra la lista: chi tocca
            un pulsante la legge lì vicino. aria-live: i lettori di schermo
            la leggono da soli ogni volta che cambia. */}
        <p className={stili.spiegazione} aria-live="polite">
          {stato.spiegazione}
        </p>

        <div ref={lista} tabIndex={-1} className={stili.lista}>
          {delGiorno.length === 0 ? (
            <p className={stili.vuota}>
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
  const dettagli = [
    p.quanti !== undefined && descriviQuanti(p.quanti, a),
    p.dove && descriviDove(p.dove, a),
    p.cosa,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <li className={stili.prenotazione} data-stato={p.stato}>
      <span className={stili.ora}>{p.ora}</span>
      <span className={stili.nome}>{p.nome}</span>
      {dettagli && <span className={stili.dettagli}>{dettagli}</span>}
      <span className={stili.stato}>
        <span className={stili.quadretto} aria-hidden="true" />
        {p.stato}
      </span>
      <span className={stili.azioni}>
        {p.stato !== 'completata' && (
          <button
            type="button"
            className={p.stato === 'richiesta' ? stili.primario : stili.secondario}
            onClick={onAvanza}
          >
            {testoPulsanteAvanza(p.stato, a)}
            <span className={stili.soloLettori}>{diChi}</span>
          </button>
        )}
        <button type="button" className={stili.elimina} onClick={onElimina}>
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
