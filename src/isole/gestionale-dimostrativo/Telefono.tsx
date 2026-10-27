// Il telefono del cliente: la pagina dove prenota. Sceglie il servizio, il
// giorno nel calendario, un orario libero, e lascia il nome; poi vede la
// sua richiesta passare da "in attesa" a "confermata". Parte della prova
// "dal cliente all'attività" (GestionaleDimostrativo).
//
// Qui l'attività parla al suo cliente, una persona sola: gli dà del tu,
// come il configuratore in /contatti.

import { useId } from 'react';
import { attivita } from './attivita';
import { Calendario, type GiornoCalendario } from './Calendario';
import {
  dataCorta,
  etichettaGiorno,
  infoGiornoCliente,
  lunghezzaMassimaNomeCliente,
  mesiDopo,
  orariLiberi,
  statoRichiesta,
  ultimoGiornoPrenotabile,
  type Azione,
  type StatoProva,
} from './logica';
import stili from './GestionaleDimostrativo.module.css';

interface Props {
  stato: StatoProva;
  invia: (azione: Azione) => void;
  nomeApp: string;
}

export function Telefono({ stato, invia, nomeApp }: Props) {
  return (
    // Sagoma dell'iPhone, comune a tutto il sito (stili/dispositivi.css).
    <div className={`iphone ${stili.corniceTelefono}`}>
      <div className="iphone-schermo">
        <div className="iphone-contenuto">
          <div className={stili.schermo}>
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
            </header>
            <div className={stili.paginaTelefono}>
              {stato.cliente.inviata ? (
                <Esito stato={stato} invia={invia} />
              ) : (
                <Prenota stato={stato} invia={invia} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Il modulo

function Prenota({ stato, invia }: Omit<Props, 'nomeApp'>) {
  const a = attivita[stato.attivita];
  const c = stato.cliente;
  const oggi = new Date(stato.oggi);
  const id = useId();
  const liberi =
    c.servizio !== null && c.giorno !== null
      ? orariLiberi(a, stato.prenotazioni, c.giorno, c.servizio)
      : [];

  const giorno = (g: number): GiornoCalendario => {
    const info = infoGiornoCliente(a, stato.prenotazioni, oggi, g, c.servizio);
    return {
      attivo: info.stato === 'libero',
      etichetta: etichettaGiorno(oggi, g, info),
      tipo: info.stato === 'libero' ? 'libero' : info.stato === 'pieno' ? 'pieno' : 'spento',
    };
  };

  return (
    <form
      className={stili.prenota}
      onSubmit={(e) => {
        e.preventDefault();
        invia({ tipo: 'invia' });
      }}
      noValidate
    >
      <h3 className={stili.titoloTelefono}>Prenota online</h3>

      <fieldset className={stili.passo}>
        <legend className={stili.domanda}>{a.domandaServizio}</legend>
        <div className={stili.gettoni}>
          {a.servizi.map((s) => (
            <label key={s.nome} className={stili.gettone}>
              <input
                type="radio"
                name={`${id}-servizio`}
                value={s.nome}
                checked={c.servizio === s.nome}
                onChange={() => invia({ tipo: 'cliente', campo: 'servizio', valore: s.nome })}
              />
              <span>{s.nome}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {a.persone && (
        <fieldset className={stili.passo}>
          <legend className={stili.domanda}>Quante persone?</legend>
          <div className={stili.contatore}>
            <button
              type="button"
              disabled={c.persone <= 1}
              onClick={() => invia({ tipo: 'cliente', campo: 'persone', valore: c.persone - 1 })}
            >
              <span aria-hidden="true">−</span>
              <span className={stili.soloLettori}>Una persona in meno</span>
            </button>
            <output aria-live="polite">
              {c.persone} {c.persone === 1 ? a.persone.singolare : a.persone.plurale}
            </output>
            <button
              type="button"
              disabled={c.persone >= a.persone.massimo}
              onClick={() => invia({ tipo: 'cliente', campo: 'persone', valore: c.persone + 1 })}
            >
              <span aria-hidden="true">+</span>
              <span className={stili.soloLettori}>Una persona in più</span>
            </button>
          </div>
        </fieldset>
      )}

      <fieldset className={stili.passo}>
        <legend className={stili.domanda}>Quando?</legend>
        <Calendario
          oggi={oggi}
          scelto={c.giorno}
          ultimoMese={mesiDopo(oggi, ultimoGiornoPrenotabile)}
          giorno={giorno}
          onScegli={(g) => invia({ tipo: 'cliente', campo: 'giorno', valore: g })}
          legenda={[
            { tipo: 'libero', testo: 'Libero' },
            { tipo: 'pieno', testo: 'Pieno' },
            { tipo: 'spento', testo: 'Chiuso' },
          ]}
        />
      </fieldset>

      <fieldset className={stili.passo}>
        <legend className={stili.domanda}>A che ora?</legend>
        {c.servizio === null || c.giorno === null ? (
          <p className={stili.nota}>
            {c.servizio === null
              ? 'Scegli prima il servizio e il giorno.'
              : 'Scegli prima un giorno.'}
          </p>
        ) : liberi.length === 0 ? (
          <p className={stili.nota}>Nessun orario libero quel giorno: prova un altro giorno.</p>
        ) : (
          <>
            <p className={stili.nota}>{dataCorta(oggi, c.giorno)}</p>
            <div className={stili.gettoni}>
              {liberi.map((ora) => (
                <label key={ora} className={stili.gettone}>
                  <input
                    type="radio"
                    name={`${id}-ora`}
                    value={ora}
                    checked={c.ora === ora}
                    onChange={() => invia({ tipo: 'cliente', campo: 'ora', valore: ora })}
                  />
                  <span className={stili.dato}>{ora}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </fieldset>

      <div className={stili.campo}>
        <label htmlFor={`${id}-nome`} className={stili.domanda}>
          Il tuo nome
        </label>
        <input
          id={`${id}-nome`}
          type="text"
          autoComplete="off"
          maxLength={lunghezzaMassimaNomeCliente}
          value={c.nome}
          onChange={(e) => invia({ tipo: 'cliente', campo: 'nome', valore: e.target.value })}
        />
      </div>

      {/* Il messaggio arriva solo dopo "Invia richiesta": role="alert" lo fa
          leggere subito. */}
      {c.errore && (
        <p className={stili.errore} role="alert">
          {c.errore}
        </p>
      )}

      <button type="submit" className={stili.invia}>
        Invia richiesta
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Dopo l'invio

function Esito({ stato, invia }: Omit<Props, 'nomeApp'>) {
  const a = attivita[stato.attivita];
  const c = stato.cliente;
  const oggi = new Date(stato.oggi);
  const esito = statoRichiesta(stato);
  const f = a.evento.femminile ? 'a' : 'o';

  const titolo =
    esito === 'annullata'
      ? 'Richiesta non accettata'
      : esito === 'attesa'
        ? 'Richiesta inviata'
        : `${maiuscola(a.evento.singolare)} confermat${f}`;

  return (
    <div className={stili.esito}>
      {/* role="status": quando l'attività risponde, il lettore di schermo lo legge. */}
      <div role="status" className={stili.esitoTesta}>
        <h3 className={stili.titoloTelefono}>{titolo}</h3>
        <p className={stili.etichettaEsito} data-esito={esito}>
          {esito === 'attesa'
            ? 'In attesa di conferma'
            : esito === 'annullata'
              ? 'Scegli un altro giorno o un altro orario.'
              : 'Ti aspettiamo.'}
        </p>
      </div>

      {esito !== 'annullata' && c.giorno !== null && (
        <dl className={stili.riepilogo}>
          <div>
            <dt>Servizio</dt>
            <dd>{c.servizio}</dd>
          </div>
          <div>
            <dt>Giorno</dt>
            <dd>{dataCorta(oggi, c.giorno)}</dd>
          </div>
          <div>
            <dt>Ora</dt>
            <dd className={stili.dato}>{c.ora}</dd>
          </div>
          {a.persone && (
            <div>
              <dt>Persone</dt>
              <dd>{c.persone}</dd>
            </div>
          )}
          <div>
            <dt>Nome</dt>
            <dd>{c.nome.trim()}</dd>
          </div>
        </dl>
      )}

      <button
        type="button"
        className={stili.invia}
        onClick={() => invia({ tipo: 'nuovaRichiesta' })}
      >
        {maiuscola(`nuov${f}`)} {a.evento.singolare}
      </button>
    </div>
  );
}

const maiuscola = (testo: string) => testo.charAt(0).toUpperCase() + testo.slice(1);
