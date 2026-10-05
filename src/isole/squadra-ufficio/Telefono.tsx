// Il telefono dell'operatore: i lavori di oggi mandati dall'ufficio e il
// modulo del rapporto. Parte di SquadraUfficio.

import { useEffect, useId, useRef, useState, type SubmitEvent } from 'react';
import { operatoreDelTelefono, settori, squadraDelTelefono } from './settori';
import {
  compitiDelTelefono,
  controllaRapporto,
  formattaOre,
  lunghezzaMassimaNota,
  oreMassime,
  oreMinime,
  passoOre,
  type Azione,
  type DatiRapporto,
  type Stato,
} from './logica';
import stili from './SquadraUfficio.module.css';

interface Props {
  stato: Stato;
  invia: (azione: Azione) => void;
}

export function Telefono({ stato, invia }: Props) {
  const settore = settori[stato.settore];
  const id = useId();
  const compiti = compitiDelTelefono(stato);

  const [cantiere, setCantiere] = useState(settore.cantieri[0]!);
  const [lavoro, setLavoro] = useState(settore.lavori[0]!);
  const [ore, setOre] = useState(2);
  const [indiceMateriale, setIndiceMateriale] = useState(-1);
  const [quantita, setQuantita] = useState(0);
  const [nota, setNota] = useState('');
  const [errore, setErrore] = useState<string | null>(null);

  const materiale = settore.materiali[indiceMateriale];

  const scegliMateriale = (indice: number) => {
    setIndiceMateriale(indice);
    setQuantita(settore.materiali[indice]?.passo ?? 0);
  };

  // Quando un lavoro segnato come fatto perde il suo pulsante, il cursore
  // della tastiera torna sulla lista invece di finire in cima alla pagina.
  const lista = useRef<HTMLUListElement>(null);
  const fuocoPerso = useRef(false);
  useEffect(() => {
    if (fuocoPerso.current) lista.current?.focus();
    fuocoPerso.current = false;
  }, [stato.compiti]);

  const inviaRapporto = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dati: DatiRapporto = {
      cantiere,
      lavoro,
      ore,
      materiale: materiale ? { indice: indiceMateriale, quantita } : null,
      nota,
    };
    const problema = controllaRapporto(dati, settore);
    setErrore(problema);
    if (problema) return;
    invia({ tipo: 'invia', dati });
    setNota('');
  };

  const ultimoMio = stato.rapporti.find(
    (r) => r.id === stato.ultimoRapporto && r.operatore === operatoreDelTelefono,
  );

  return (
    <div className={stili.cornice + ' ' + stili.corniceTelefono}>
      <div className={stili.schermo}>
        <header className={stili.barraApp}>
          <p className={stili.chi}>
            {operatoreDelTelefono}, {squadraDelTelefono}
          </p>
          <p className={stili.quando}>Oggi</p>
        </header>

        <section className={stili.blocco} aria-labelledby={`${id}-dafare`}>
          <h3 id={`${id}-dafare`}>Da fare</h3>
          <ul className={stili.compiti} ref={lista} tabIndex={-1}>
            {compiti.map((c) => (
              <li
                key={c.id}
                className={
                  c.fattoAlle ? stili.fatto : c.id === stato.ultimoCompito ? stili.nuovo : ''
                }
              >
                <span className={stili.cosa}>
                  <span className={stili.lavoro}>{c.lavoro}</span>
                  <span className={stili.dove}>{c.cantiere}</span>
                </span>
                {c.fattoAlle ? (
                  <span className={stili.stato}>
                    fatto alle <span className={stili.dato}>{c.fattoAlle}</span>
                  </span>
                ) : (
                  <>
                    {c.id === stato.ultimoCompito && (
                      <span className={stili.etichettaNuovo}>nuovo</span>
                    )}
                    <button
                      type="button"
                      className={stili.pulsantePiccolo}
                      onClick={() => {
                        fuocoPerso.current = true;
                        invia({ tipo: 'fatto', id: c.id });
                      }}
                    >
                      Fatto<span className={stili.soloLettori}>: {c.lavoro}</span>
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        <form className={stili.blocco} onSubmit={inviaRapporto} noValidate>
          <h3>Nuovo rapporto</h3>

          <div className={stili.campo}>
            <label htmlFor={`${id}-cantiere`}>Cantiere</label>
            <select
              id={`${id}-cantiere`}
              value={cantiere}
              onChange={(e) => setCantiere(e.target.value)}
            >
              {settore.cantieri.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>

          <div className={stili.campo}>
            <label htmlFor={`${id}-lavoro`}>Lavoro</label>
            <select id={`${id}-lavoro`} value={lavoro} onChange={(e) => setLavoro(e.target.value)}>
              {settore.lavori.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>

          <fieldset className={stili.contatoreCampo}>
            <legend>Ore</legend>
            <button
              type="button"
              onClick={() => setOre((o) => Math.max(oreMinime, o - passoOre))}
              disabled={ore <= oreMinime}
            >
              −<span className={stili.soloLettori}> mezz'ora</span>
            </button>
            <output className={stili.dato} aria-live="polite">
              {formattaOre(ore)}
            </output>
            <button
              type="button"
              onClick={() => setOre((o) => Math.min(oreMassime, o + passoOre))}
              disabled={ore >= oreMassime}
            >
              +<span className={stili.soloLettori}> mezz'ora</span>
            </button>
          </fieldset>

          <div className={stili.campo}>
            <label htmlFor={`${id}-materiale`}>Materiale usato</label>
            <select
              id={`${id}-materiale`}
              value={indiceMateriale}
              onChange={(e) => scegliMateriale(Number(e.target.value))}
            >
              <option value={-1}>Nessuno</option>
              {settore.materiali.map((m, i) => (
                <option key={m.nome} value={i}>
                  {m.nome} ({m.unita})
                </option>
              ))}
            </select>
          </div>

          {materiale && (
            <fieldset className={stili.contatoreCampo}>
              <legend>Quanto</legend>
              <button
                type="button"
                onClick={() => setQuantita((q) => Math.max(materiale.passo, q - materiale.passo))}
                disabled={quantita <= materiale.passo}
              >
                −
                <span className={stili.soloLettori}>
                  {' '}
                  {materiale.passo} {materiale.unita}
                </span>
              </button>
              <output className={stili.dato} aria-live="polite">
                {quantita} {materiale.unita}
              </output>
              <button type="button" onClick={() => setQuantita((q) => q + materiale.passo)}>
                +
                <span className={stili.soloLettori}>
                  {' '}
                  {materiale.passo} {materiale.unita}
                </span>
              </button>
            </fieldset>
          )}

          <div className={stili.campo}>
            <label htmlFor={`${id}-nota`}>
              Nota <span className={stili.facoltativo}>(facoltativa)</span>
            </label>
            <textarea
              id={`${id}-nota`}
              rows={2}
              maxLength={lunghezzaMassimaNota}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
          </div>

          {errore && (
            <p className={stili.errore} role="alert">
              {errore}
            </p>
          )}

          <button type="submit" className={stili.pulsante}>
            Invia all'ufficio
          </button>
          {ultimoMio && (
            <p className={stili.inviato}>
              Inviato alle <span className={stili.dato}>{ultimoMio.ora}</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
