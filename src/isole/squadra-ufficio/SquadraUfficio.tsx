// Prova "dal campo all'ufficio": il telefono di un operatore e il computer
// dell'ufficio, collegati. Si manda un rapporto dal telefono e lo si vede
// arrivare in ufficio; dall'ufficio si manda un lavoro al telefono.
// Dati di esempio, tutto in memoria.
// Nella pagina: <SquadraUfficio client:visible />
//
// La logica è in logica.ts (con i test); qui e in Telefono.tsx e
// Ufficio.tsx c'è solo l'interfaccia.
//
// Da computer telefono e ufficio stanno affiancati. Quando lo spazio è poco
// (container query, misurata sull'isola) si vede uno dei due alla volta,
// con un interruttore in alto che segnala le novità dell'altro.

import { useReducer, useRef, useState } from 'react';
import { ordineSettori, settori } from './settori';
import { aggiorna, statoIniziale, type Azione } from './logica';
import { Telefono } from './Telefono';
import { Ufficio } from './Ufficio';
import stili from './SquadraUfficio.module.css';

type Vista = 'telefono' | 'ufficio';

export function SquadraUfficio() {
  const [stato, inviaAlReducer] = useReducer(aggiorna, 'verde', statoIniziale);
  const [vista, setVista] = useState<Vista>('telefono');
  const radice = useRef<HTMLDivElement>(null);

  const invia = (azione: Azione) => inviaAlReducer(azione);

  const vai = (nuova: Vista, scorri = false) => {
    setVista(nuova);
    inviaAlReducer({ tipo: 'guarda', vista: nuova });
    // Dal pulsante sotto la spiegazione: si torna in cima alla prova, dove
    // comincia la vista appena scelta.
    if (scorri) radice.current?.scrollIntoView({ block: 'start' });
  };

  // Le novità dell'altra vista, da segnalare quando se ne vede una sola.
  const novitaAltrove = vista === 'telefono' ? stato.nuoviInUfficio : stato.nuoviSulTelefono;
  const altra: Vista = vista === 'telefono' ? 'ufficio' : 'telefono';

  return (
    <div className={stili.prova} ref={radice}>
      <div className={stili.impianto} data-vista={vista}>
        <div className={stili.testa}>
          <fieldset className={stili.settori}>
            <legend>Settore</legend>
            <div className={stili.scelte}>
              {ordineSettori.map((id) => (
                <label key={id} className={stili.scelta}>
                  <input
                    type="radio"
                    name="settore-prova"
                    value={id}
                    checked={stato.settore === id}
                    onChange={() => invia({ tipo: 'settore', settore: id })}
                  />
                  <span>{settori[id].nome}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className={stili.avviso}>Dati di esempio. Niente viene salvato.</p>
        </div>

        {/* Solo quando c'è spazio per una vista alla volta (vedi il CSS). */}
        <div className={stili.interruttore} role="group" aria-label="Cosa guardare">
          <button type="button" aria-pressed={vista === 'telefono'} onClick={() => vai('telefono')}>
            Telefono
            {stato.nuoviSulTelefono > 0 && (
              <span className={stili.contatore}>{stato.nuoviSulTelefono} nuovo</span>
            )}
          </button>
          <button type="button" aria-pressed={vista === 'ufficio'} onClick={() => vai('ufficio')}>
            Ufficio
            {stato.nuoviInUfficio > 0 && (
              <span className={stili.contatore}>
                {stato.nuoviInUfficio} {stato.nuoviInUfficio === 1 ? 'nuovo' : 'nuovi'}
              </span>
            )}
          </button>
        </div>

        {/* key: cambiando settore i moduli ripartono da capo, con le voci
            del nuovo settore. */}
        <div className={stili.telefono}>
          <Telefono key={stato.settore} stato={stato} invia={invia} />
        </div>
        <div className={stili.ufficio}>
          <Ufficio key={stato.settore} stato={stato} invia={invia} />
        </div>

        <div className={stili.spiegazione}>
          <p aria-live="polite">{stato.spiegazione}</p>
          {novitaAltrove > 0 && (
            <button type="button" className={stili.vaiAltrove} onClick={() => vai(altra, true)}>
              {altra === 'ufficio' ? 'Guardate in ufficio' : 'Guardate il telefono'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
