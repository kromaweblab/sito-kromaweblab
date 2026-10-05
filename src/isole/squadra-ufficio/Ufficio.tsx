// Il computer dell'ufficio: i rapporti di oggi (quello appena arrivato è
// evidenziato), le ore per cantiere, i materiali usati, i lavori assegnati e
// il modulo per mandarne uno a un operatore. Parte di SquadraUfficio.

import { useId, useState, type SubmitEvent } from 'react';
import { operatori, operatoreDelTelefono, settori } from './settori';
import {
  formattaOre,
  materialiUsati,
  oraDa,
  orePerCantiere,
  type Azione,
  type Stato,
} from './logica';
import stili from './SquadraUfficio.module.css';

interface Props {
  stato: Stato;
  invia: (azione: Azione) => void;
}

export function Ufficio({ stato, invia }: Props) {
  const settore = settori[stato.settore];
  const id = useId();

  const rapporti = [...stato.rapporti].reverse();
  const ore = orePerCantiere(stato);
  const oreMassime = Math.max(...ore.map((o) => o.ore), 1);
  const materiali = materialiUsati(stato);
  const assegnati = [...stato.compiti].reverse();

  const [operatore, setOperatore] = useState(operatoreDelTelefono);
  const [cantiere, setCantiere] = useState(settore.cantieri[0]!);
  const [lavoro, setLavoro] = useState(settore.lavori[0]!);

  const assegna = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    invia({ tipo: 'assegna', dati: { operatore, cantiere, lavoro } });
  };

  return (
    <div className={stili.cornice + ' ' + stili.corniceUfficio}>
      <p className={stili.barraFinestra}>Gestionale, ufficio</p>
      <div className={stili.schermo}>
        <header className={stili.barraApp}>
          <p className={stili.chi}>Ufficio</p>
          <p className={stili.quando}>
            Oggi, ore <span className={stili.dato}>{oraDa(stato.minuti)}</span>
          </p>
        </header>

        <div className={stili.cruscotto}>
          <section
            className={stili.blocco + ' ' + stili.rapporti}
            aria-labelledby={`${id}-rapporti`}
          >
            <h3 id={`${id}-rapporti`}>Rapporti di oggi</h3>
            <table className={stili.tabella}>
              <thead>
                <tr>
                  <th scope="col">Ora</th>
                  <th scope="col">Chi e dove</th>
                  <th scope="col" className={stili.numero}>
                    Ore
                  </th>
                  <th scope="col" className={stili.colonnaMateriale}>
                    Materiale
                  </th>
                </tr>
              </thead>
              <tbody>
                {rapporti.map((r) => (
                  <tr key={r.id} className={r.id === stato.ultimoRapporto ? stili.nuovo : ''}>
                    <td className={stili.dato}>{r.ora}</td>
                    <td>
                      <span className={stili.lavoro}>
                        {r.operatore}
                        {r.id === stato.ultimoRapporto && (
                          <span className={stili.etichettaNuovo}>nuovo</span>
                        )}
                      </span>
                      <span className={stili.dove}>
                        {r.lavoro}, {r.cantiere}
                      </span>
                      {r.materiale && (
                        <span className={stili.dove + ' ' + stili.soloStretto}>
                          {r.materiale.nome}: {r.materiale.quantita} {r.materiale.unita}
                        </span>
                      )}
                      {r.nota && <span className={stili.nota}>{r.nota}</span>}
                    </td>
                    <td className={stili.dato + ' ' + stili.numero}>{formattaOre(r.ore)}</td>
                    <td className={stili.colonnaMateriale}>
                      <span className={stili.dove}>
                        {r.materiale ? (
                          <>
                            <span className={stili.dato}>
                              {r.materiale.quantita} {r.materiale.unita}
                            </span>{' '}
                            {r.materiale.nome.toLowerCase()}
                          </>
                        ) : (
                          'nessuno'
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className={stili.blocco} aria-labelledby={`${id}-ore`}>
            <h3 id={`${id}-ore`}>Ore per cantiere</h3>
            <ul className={stili.barre}>
              {ore.map((o) => (
                <li key={o.cantiere}>
                  <span className={stili.etichettaBarra}>{o.cantiere}</span>
                  <span className={stili.binario} aria-hidden="true">
                    <span
                      className={stili.barra}
                      style={{ inlineSize: `${(o.ore / oreMassime) * 100}%` }}
                    />
                  </span>
                  <span className={stili.dato + ' ' + stili.valoreBarra}>{formattaOre(o.ore)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={stili.blocco} aria-labelledby={`${id}-materiali`}>
            <h3 id={`${id}-materiali`}>Materiali usati oggi</h3>
            <ul className={stili.materiali}>
              {materiali.map((m) => (
                <li key={m.nome}>
                  <span>{m.nome}</span>
                  <span className={stili.dato}>
                    {m.quantita} {m.unita}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className={stili.blocco} aria-labelledby={`${id}-assegnati`}>
            <h3 id={`${id}-assegnati`}>Lavori assegnati</h3>
            <ul className={stili.assegnati}>
              {assegnati.map((c) => (
                <li key={c.id}>
                  <span className={stili.cosa}>
                    <span className={stili.lavoro}>
                      {c.lavoro}, {c.cantiere}
                    </span>
                    <span className={stili.dove}>{c.operatore}</span>
                  </span>
                  <span className={c.fattoAlle ? stili.statoFatto : stili.stato}>
                    {c.fattoAlle ? (
                      <>
                        fatto alle <span className={stili.dato}>{c.fattoAlle}</span>
                      </>
                    ) : (
                      'da fare'
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <form className={stili.assegna} onSubmit={assegna}>
              <p className={stili.titoletto}>Assegna un lavoro</p>
              <div className={stili.campo}>
                <label htmlFor={`${id}-operatore`}>A chi</label>
                <select
                  id={`${id}-operatore`}
                  value={operatore}
                  onChange={(e) => setOperatore(e.target.value)}
                >
                  {operatori.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
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
                <select
                  id={`${id}-lavoro`}
                  value={lavoro}
                  onChange={(e) => setLavoro(e.target.value)}
                >
                  {settore.lavori.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className={stili.pulsante}>
                Manda sul telefono
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
