// Il computer dell'attività: il calendario del mese con quante prenotazioni
// ha ogni giorno, e l'elenco del giorno scelto. La richiesta appena arrivata
// dal telefono è evidenziata; si conferma, si completa, si elimina, e si
// aggiunge a mano chi telefona. Parte della prova "dal cliente
// all'attività" (GestionaleDimostrativo).
//
// Qui parla il gestionale a chi ci lavora: frasi impersonali, e il voi
// nei messaggi d'errore, come nel resto del sito.

import { useEffect, useId, useRef, useState, type SubmitEvent } from 'react';
import { attivita } from './attivita';
import { Calendario, type GiornoCalendario } from './Calendario';
import {
  contaDelGiorno,
  controllaAggiunta,
  dataCorta,
  dataEstesa,
  descriviDettagli,
  etichettaStato,
  giornoChiuso,
  lunghezzaMassimaNomeCliente,
  mesiDopo,
  orariLiberi,
  prenotazioniDelGiorno,
  testoPulsanteAvanza,
  ultimoGiornoPrenotabile,
  type Azione,
  type CampoAggiunta,
  type ErroriAggiunta,
  type Prenotazione,
  type StatoProva,
} from './logica';
import stili from './GestionaleDimostrativo.module.css';

interface Props {
  stato: StatoProva;
  invia: (azione: Azione) => void;
  nomeApp: string;
}

export function Ufficio({ stato, invia, nomeApp }: Props) {
  const a = attivita[stato.attivita];
  const f = a.evento.femminile;
  const oggi = new Date(stato.oggi);
  const g = stato.ufficio.giorno;
  const delGiorno = prenotazioniDelGiorno(stato.prenotazioni, g);
  const daConfermare = delGiorno.filter((p) => p.stato === 'richiesta').length;
  const chiuso = giornoChiuso(a, oggi, g);
  const titolo = maiuscola(a.evento.plurale);

  const [moduloAperto, setModuloAperto] = useState(false);
  const apriModulo = useRef<HTMLButtonElement>(null);
  const chiudiModulo = () => {
    setModuloAperto(false);
    apriModulo.current?.focus();
  };

  // Se il pulsante appena premuto sparisce (prenotazione eliminata o
  // completata), il cursore della tastiera finirebbe in cima alla pagina.
  // Lo riportiamo sull'elenco.
  const lista = useRef<HTMLDivElement>(null);
  const fuocoPerso = useRef(false);
  useEffect(() => {
    if (fuocoPerso.current && !lista.current?.contains(document.activeElement)) {
      lista.current?.focus();
    }
    fuocoPerso.current = false;
  }, [stato.prenotazioni]);
  const azione = (tipo: 'avanza' | 'elimina', id: string) => {
    fuocoPerso.current = true;
    invia({ tipo, id });
  };

  // Quando arriva una richiesta dal telefono, lo schermo del computer scorre
  // fino alla sua riga. Solo dentro lo schermo: la pagina resta dov'è.
  const contenuto = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scatola = contenuto.current;
    const riga = scatola?.querySelector<HTMLElement>('[data-nuova]');
    if (!scatola || !riga) return;
    const sopra = riga.getBoundingClientRect().top - scatola.getBoundingClientRect().top;
    scatola.scrollTop += sopra - scatola.clientHeight / 3;
  }, [stato.ufficio.nuova]);

  const giorno = (x: number): GiornoCalendario => {
    const quante = contaDelGiorno(stato.prenotazioni, x);
    const eChiuso = giornoChiuso(a, oggi, x);
    return {
      attivo: true,
      etichetta: `${dataCorta(oggi, x)}, ${
        eChiuso ? 'chiuso' : `${quante} ${quante === 1 ? a.evento.singolare : a.evento.plurale}`
      }`,
      // I giorni passati si guardano ancora, ma spenti.
      tipo: eChiuso || x < 0 ? 'spento' : 'conta',
      conta: quante,
    };
  };

  return (
    // Sagoma del MacBook, comune a tutto il sito (stili/dispositivi.css).
    <div className="macbook">
      <div className="macbook-schermo">
        <p className={stili.barraFinestra}>Gestionale, {nomeApp}</p>
        <div className="macbook-contenuto" ref={contenuto}>
          <div className={`${stili.schermo} ${stili.schermoUfficio}`}>
            <header className={stili.barraApp}>
              {/* Il logo del visitatore, se l'ha caricato; se no l'iniziale del nome. */}
              {stato.logo ? (
                <img src={stato.logo} alt="" className={stili.logoApp} />
              ) : (
                <span className={stili.marchioApp} aria-hidden="true">
                  {nomeApp.charAt(0).toUpperCase()}
                </span>
              )}
              <p className={stili.nomeApp}>{nomeApp}</p>
              <p className={stili.paginaApp}>{titolo}</p>
            </header>

            <div className={stili.cruscotto}>
              <section className={stili.blocco} aria-label="Calendario">
                <Calendario
                  oggi={oggi}
                  scelto={g}
                  ultimoMese={mesiDopo(oggi, ultimoGiornoPrenotabile)}
                  giorno={giorno}
                  onScegli={(x) => {
                    setModuloAperto(false);
                    invia({ tipo: 'ufficioGiorno', giorno: x });
                  }}
                  legenda={[
                    { tipo: 'conta', testo: 'Aperto' },
                    { tipo: 'spento', testo: 'Chiuso o passato' },
                  ]}
                />
                <p className={stili.nota}>Il numero in alto: {a.evento.plurale} del giorno.</p>
              </section>

              <section className={stili.blocco} aria-labelledby={`${stato.attivita}-giorno`}>
                <div className={stili.intestazioneGiorno}>
                  <div>
                    <h3 id={`${stato.attivita}-giorno`} className={stili.titoloGiorno}>
                      {dataEstesa(oggi, g)}
                    </h3>
                    <p className={stili.nota}>
                      {chiuso
                        ? 'Giorno di chiusura.'
                        : `${delGiorno.length} ${delGiorno.length === 1 ? a.evento.singolare : a.evento.plurale}, ${daConfermare} da confermare.`}
                    </p>
                  </div>
                  {!chiuso && g >= 0 && (
                    <button
                      type="button"
                      ref={apriModulo}
                      className={stili.pulsantePieno}
                      aria-expanded={moduloAperto}
                      aria-controls={`${stato.attivita}-aggiungi`}
                      onClick={() => (moduloAperto ? chiudiModulo() : setModuloAperto(true))}
                    >
                      + Aggiungi
                    </button>
                  )}
                </div>

                {moduloAperto && (
                  <ModuloAggiunta
                    // key: cambiando giorno il modulo riparte da capo.
                    key={g}
                    id={`${stato.attivita}-aggiungi`}
                    stato={stato}
                    onAggiungi={(dati) => {
                      invia({ tipo: 'aggiungi', dati });
                      chiudiModulo();
                    }}
                    onAnnulla={chiudiModulo}
                  />
                )}

                <div ref={lista} tabIndex={-1} className={stili.elenco}>
                  {delGiorno.length === 0 ? (
                    <p className={stili.nota}>
                      Nessun{f ? 'a' : ''} {a.evento.singolare} questo giorno.
                    </p>
                  ) : (
                    <ul aria-label={`${titolo}: ${dataCorta(oggi, g).toLowerCase()}`}>
                      {delGiorno.map((p) => (
                        <Riga
                          key={p.id}
                          p={p}
                          stato={stato}
                          onAvanza={() => azione('avanza', p.id)}
                          onElimina={() => azione('elimina', p.id)}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Una prenotazione

interface PropsRiga {
  p: Prenotazione;
  stato: StatoProva;
  onAvanza: () => void;
  onElimina: () => void;
}

function Riga({ p, stato, onAvanza, onElimina }: PropsRiga) {
  const a = attivita[stato.attivita];
  const nuova = stato.ufficio.nuova === p.id;
  // Per i lettori di schermo "Conferma" da solo, ripetuto su ogni riga,
  // non basta: si aggiunge di chi è, senza mostrarlo.
  const diChi = ` ${a.evento.articolo}${a.evento.singolare} di ${p.nome}`;

  return (
    <li className={stili.riga} data-stato={p.stato} data-nuova={nuova || undefined}>
      <span className={`${stili.ora} ${stili.dato}`}>{p.ora}</span>
      <span className={stili.chi}>
        <span className={stili.nome}>
          {p.nome}
          {nuova && <span className={stili.etichettaNuova}>nuova</span>}
        </span>
        <span className={stili.dettagli}>
          {descriviDettagli(p, a)}
          {p.daCliente && ', prenotata online'}
        </span>
      </span>
      <span className={stili.stato}>{etichettaStato(p.stato, a)}</span>
      <span className={stili.azioni}>
        {p.stato !== 'completata' && (
          <button
            type="button"
            className={p.stato === 'richiesta' ? stili.pulsantePieno : stili.pulsanteChiaro}
            onClick={onAvanza}
          >
            {testoPulsanteAvanza(p.stato)}
            <span className={stili.soloLettori}>{diChi}</span>
          </button>
        )}
        <button type="button" className={stili.pulsanteChiaro} onClick={onElimina}>
          Elimina
          <span className={stili.soloLettori}>{diChi}</span>
        </button>
      </span>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Aggiungere a mano chi telefona

interface PropsModulo {
  id: string;
  stato: StatoProva;
  onAggiungi: (dati: {
    giorno: number;
    ora: string;
    nome: string;
    servizio: string;
    persone: number;
  }) => void;
  onAnnulla: () => void;
}

function ModuloAggiunta({ id, stato, onAggiungi, onAnnulla }: PropsModulo) {
  const a = attivita[stato.attivita];
  const g = stato.ufficio.giorno;
  const base = useId();
  const campo = (nome: string) => `${base}-${nome}`;

  const [servizio, setServizio] = useState(a.servizi[0]!.nome);
  const liberi = orariLiberi(a, stato.prenotazioni, g, servizio);
  const [ora, setOra] = useState(liberi[0] ?? '');
  const [nome, setNome] = useState('');
  const [persone, setPersone] = useState('2');
  const [errori, setErrori] = useState<ErroriAggiunta>({});

  // Appena aperto, il cursore va sul nome: si comincia a scrivere.
  const campoNome = useRef<HTMLInputElement>(null);
  useEffect(() => campoNome.current?.focus(), []);

  const cambiaServizio = (nuovo: string) => {
    setServizio(nuovo);
    const nuoviLiberi = orariLiberi(a, stato.prenotazioni, g, nuovo);
    if (!nuoviLiberi.includes(ora)) setOra(nuoviLiberi[0] ?? '');
  };

  const salva = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dati = { giorno: g, ora, nome, servizio, persone: Number(persone) };
    const trovati = controllaAggiunta(stato, dati);
    setErrori(trovati);
    const primo = (['nome', 'ora', 'persone'] as CampoAggiunta[]).find((c) => trovati[c]);
    if (primo) {
      // Il cursore va sul primo campo da correggere.
      document.getElementById(campo(primo))?.focus();
      return;
    }
    if (!trovati.giorno) onAggiungi(dati);
  };

  const errore = (c: CampoAggiunta) =>
    errori[c] && (
      <p id={campo(`${c}-errore`)} className={stili.errore}>
        {errori[c]}
      </p>
    );
  const collega = (c: CampoAggiunta) => ({
    id: campo(c),
    'aria-invalid': errori[c] ? true : undefined,
    'aria-describedby': errori[c] ? campo(`${c}-errore`) : undefined,
  });

  return (
    <section id={id} className={stili.modulo} aria-labelledby={campo('titolo')}>
      <h4 id={campo('titolo')} className={stili.titoloModulo}>
        Chi telefona: {dataCorta(new Date(stato.oggi), g).toLowerCase()}
      </h4>
      {/* noValidate: i messaggi d'errore sono i nostri, uguali su ogni browser. */}
      <form className={stili.campi} onSubmit={salva} noValidate>
        <div className={`${stili.campo} ${stili.campoLargo}`}>
          <label htmlFor={campo('nome')}>
            Nome {a.chi === 'ospite' ? "dell'ospite" : `del ${a.chi}`}
          </label>
          <input
            ref={campoNome}
            type="text"
            autoComplete="off"
            maxLength={lunghezzaMassimaNomeCliente}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            {...collega('nome')}
          />
          {errore('nome')}
        </div>

        <div className={stili.campo}>
          <label htmlFor={campo('servizio')}>Servizio</label>
          <span className={stili.tendina}>
            <select
              id={campo('servizio')}
              value={servizio}
              onChange={(e) => cambiaServizio(e.target.value)}
            >
              {a.servizi.map((s) => (
                <option key={s.nome}>{s.nome}</option>
              ))}
            </select>
          </span>
        </div>

        <div className={stili.campo}>
          <label htmlFor={campo('ora')}>Ora</label>
          <span className={stili.tendina}>
            <select value={ora} onChange={(e) => setOra(e.target.value)} {...collega('ora')}>
              {liberi.length === 0 && <option value="">Nessun orario libero</option>}
              {liberi.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </span>
          {errore('ora')}
        </div>

        {a.persone && (
          <div className={stili.campo}>
            <label htmlFor={campo('persone')}>{maiuscola(a.persone.plurale)}</label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={a.persone.massimo}
              value={persone}
              onChange={(e) => setPersone(e.target.value)}
              {...collega('persone')}
            />
            {errore('persone')}
          </div>
        )}

        <div className={stili.bottoniModulo}>
          <button type="submit" className={stili.pulsantePieno}>
            Salva
          </button>
          <button type="button" className={stili.pulsanteChiaro} onClick={onAnnulla}>
            Annulla
          </button>
        </div>
      </form>
    </section>
  );
}

const maiuscola = (testo: string) => testo.charAt(0).toUpperCase() + testo.slice(1);
