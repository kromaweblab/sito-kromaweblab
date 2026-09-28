// Configuratore di richiesta: quattro domande facoltative, poi i recapiti.
// Nella pagina /contatti: <Configuratore client:visible /> più la copia
// nascosta <ModuloRichiestaNascosto /> (serve a Netlify per riconoscere il
// modulo).
//
// È un <form> vero: senza JavaScript si invia come un modulo HTML normale
// e Netlify lo riceve lo stesso. Con React, l'invio passa da fetch e la
// conferma compare qui, senza cambiare pagina.

import { useId, useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { DA_SCRIVERE } from '../../dati/sito';
import { preferenze, type Domanda } from './domande';
import {
  campoEsca,
  controlla,
  corpoInvio,
  domandeVisibili,
  fraseConferma,
  lunghezzaMassimaMessaggio,
  lunghezzaMassimaNome,
  nomeModulo,
  riepilogo,
  risposteVuote,
  type Campo,
  type Errori,
  type Risposte,
} from './logica';
import stili from './Configuratore.module.css';

type StatoInvio = 'modifica' | 'invio' | 'inviata' | 'errore';

/** In che ordine portare il cursore sul primo errore. */
const ordineErrori = ['nome', 'telefono', 'email', 'recapito', 'messaggio'] as const;

export function Configuratore() {
  const base = useId();
  const id = (nome: string) => `${base}-${nome}`;

  const [risposte, setRisposte] = useState<Risposte>(risposteVuote);
  const [errori, setErrori] = useState<Errori>({});
  // Gli errori si mostrano solo dopo il primo tentativo di invio; da lì in
  // poi si aggiornano mentre si scrive, così spariscono appena corretti.
  const [tentato, setTentato] = useState(false);
  const [stato, setStato] = useState<StatoInvio>('modifica');
  const conferma = useRef<HTMLHeadingElement>(null);

  function cambia(campo: Campo, valore: string) {
    const nuove = { ...risposte, [campo]: valore };
    setRisposte(nuove);
    if (tentato) setErrori(controlla(nuove));
  }
  const suCambio = (campo: Campo) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    cambia(campo, e.target.value);

  async function invia(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (stato === 'invio') return;
    setTentato(true);
    const trovati = controlla(risposte);
    setErrori(trovati);

    const primo = ordineErrori.find((c) => trovati[c]);
    if (primo) {
      // "recapito" non è un campo: il cursore va sul telefono.
      document.getElementById(id(primo === 'recapito' ? 'telefono' : primo))?.focus();
      return;
    }

    // Il campo esca non è nello stato di React: si legge dal modulo.
    const esca = new FormData(e.currentTarget).get(campoEsca);
    setStato('invio');
    try {
      const risposta = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: corpoInvio(risposte, String(esca ?? '')),
      });
      if (!risposta.ok) throw new Error(`Netlify ha risposto ${risposta.status}`);
      setStato('inviata');
      // Il cursore va sulla conferma: chi usa un lettore di schermo la sente.
      requestAnimationFrame(() => conferma.current?.focus());
    } catch {
      setStato('errore');
    }
  }

  if (stato === 'inviata') {
    return (
      <div className={stili.configuratore}>
        <div className={stili.inviata} role="status">
          <h2 ref={conferma} tabIndex={-1} className={stili.titoloConferma}>
            Richiesta inviata
          </h2>
          <p>{fraseConferma(risposte)}</p>
          <Riepilogo risposte={risposte} />
        </div>
      </div>
    );
  }

  const erroreDi = (chiave: keyof Errori) =>
    errori[chiave] && (
      <p id={id(`${chiave}-errore`)} className={stili.errore}>
        {errori[chiave]}
      </p>
    );
  const descritto = (...chiavi: string[]) => chiavi.filter(Boolean).join(' ') || undefined;
  const sintesi = riepilogo(risposte);

  return (
    <div className={stili.configuratore}>
      <form
        className={stili.impianto}
        name={nomeModulo}
        method="post"
        action="/"
        onSubmit={invia}
        noValidate
      >
        {/* Per l'invio senza JavaScript: Netlify riconosce il modulo da qui. */}
        <input type="hidden" name="form-name" value={nomeModulo} />
        {/* Campo esca contro lo spam: nascosto alle persone, i robot lo riempiono. */}
        <p className={stili.soloLettori} aria-hidden="true">
          <label>
            Non compilare questo campo: <input name={campoEsca} tabIndex={-1} autoComplete="off" />
          </label>
        </p>

        <div className={stili.domande}>
          <p className={stili.introduzione}>
            Quattro domande a scelta, poi ci lasci un recapito. Nessuna risposta è obbligatoria.
          </p>
          {domandeVisibili(risposte).map((d) => (
            <GruppoScelte
              key={d.campo}
              domanda={d}
              valore={risposte[d.campo]}
              onScegli={(v) => cambia(d.campo, v)}
            />
          ))}
        </div>

        <div className={stili.parliamone}>
          <div>
            <h2 className={stili.titolo}>Parliamone</h2>
            <p className={stili.sottotitolo}>
              Lasciaci un recapito: ti ricontattiamo per fissare un colloquio.
            </p>
          </div>

          <div className={stili.campo}>
            <label htmlFor={id('nome')}>Nome</label>
            <input
              id={id('nome')}
              name="nome"
              type="text"
              autoComplete="name"
              aria-required="true"
              maxLength={lunghezzaMassimaNome}
              value={risposte.nome}
              onChange={suCambio('nome')}
              aria-invalid={errori.nome ? true : undefined}
              aria-describedby={errori.nome && id('nome-errore')}
            />
            {erroreDi('nome')}
          </div>

          <fieldset className={stili.gruppo}>
            <legend>
              Come preferisci sentirci? <span className={stili.facoltativo}>(facoltativo)</span>
            </legend>
            <div className={stili.riquadri}>
              {preferenze.map((p) => (
                <Scelta
                  key={p}
                  nome="come_sentirci"
                  valore={p}
                  scelto={risposte.come_sentirci === p}
                  onScegli={() => cambia('come_sentirci', p)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className={stili.recapiti}>
            <legend>Come ti ricontattiamo?</legend>
            <p id={id('recapito-aiuto')} className={stili.aiuto}>
              Basta uno dei due.
            </p>
            {erroreDi('recapito')}
            <div className={stili.campo}>
              <label htmlFor={id('telefono')}>Telefono</label>
              <input
                id={id('telefono')}
                name="telefono"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className={stili.mono}
                value={risposte.telefono}
                onChange={suCambio('telefono')}
                aria-invalid={errori.telefono || errori.recapito ? true : undefined}
                aria-describedby={descritto(
                  id('recapito-aiuto'),
                  errori.recapito ? id('recapito-errore') : '',
                  errori.telefono ? id('telefono-errore') : '',
                )}
              />
              {erroreDi('telefono')}
            </div>
            <div className={stili.campo}>
              <label htmlFor={id('email')}>Email</label>
              <input
                id={id('email')}
                name="email"
                type="email"
                autoComplete="email"
                value={risposte.email}
                onChange={suCambio('email')}
                aria-invalid={errori.email || errori.recapito ? true : undefined}
                aria-describedby={descritto(
                  id('recapito-aiuto'),
                  errori.recapito ? id('recapito-errore') : '',
                  errori.email ? id('email-errore') : '',
                )}
              />
              {erroreDi('email')}
            </div>
          </fieldset>

          <div className={stili.campo}>
            <label htmlFor={id('messaggio')}>
              Raccontaci la tua attività <span className={stili.facoltativo}>(facoltativo)</span>
            </label>
            <textarea
              id={id('messaggio')}
              name="messaggio"
              rows={3}
              maxLength={lunghezzaMassimaMessaggio}
              value={risposte.messaggio}
              onChange={suCambio('messaggio')}
              aria-invalid={errori.messaggio ? true : undefined}
              aria-describedby={descritto(
                id('messaggio-esempio'),
                errori.messaggio ? id('messaggio-errore') : '',
              )}
            />
            <p id={id('messaggio-esempio')} className={stili.aiuto}>
              Ad esempio: prendo le prenotazioni su WhatsApp e le ricopio su un quaderno.
            </p>
            {erroreDi('messaggio')}
          </div>

          <div className={stili.dopo}>
            <p className={stili.titoloDopo}>Cosa succede dopo</p>
            <ol>
              <li>Ti ricontattiamo entro {DA_SCRIVERE}, nel modo che hai scelto.</li>
              <li>
                Ci racconti come lavori oggi. [DA SCRIVERE: di persona o al telefono, quanto dura,
                se è gratuito e senza impegno]
              </li>
              <li>Ti diciamo cosa faremmo, quanto costa e in quanto tempo.</li>
            </ol>
          </div>

          <div className={stili.invio}>
            {sintesi && <p className={stili.sintesi}>{sintesi}</p>}
            <p className={stili.firma}>Ti rispondiamo noi: Giovanni e Andrea.</p>

            {stato === 'errore' && (
              <div className={stili.nonPartita} role="alert">
                <p className={stili.titoloNonPartita}>La richiesta non è partita</p>
                <p>
                  Le tue risposte sono ancora qui. Riprova tra poco, oppure scrivici su WhatsApp:{' '}
                  {DA_SCRIVERE}.
                </p>
              </div>
            )}

            <button type="submit" className={stili.pulsante} aria-disabled={stato === 'invio'}>
              {stato === 'invio'
                ? 'Invio in corso…'
                : stato === 'errore'
                  ? 'Riprova'
                  : 'Fissiamo un colloquio'}
            </button>
            <p className={stili.privacy}>
              Usiamo i tuoi dati solo per ricontattarti. [DA SCRIVERE: link all&apos;informativa
              privacy]
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------

interface PropsGruppo {
  domanda: Domanda;
  valore: string;
  onScegli: (valore: string) => void;
}

function GruppoScelte({ domanda: d, valore, onScegli }: PropsGruppo) {
  const aiuto = useId();
  return (
    <fieldset className={stili.domanda} aria-describedby={d.aiuto ? aiuto : undefined}>
      <legend className={stili.testoDomanda}>{d.testo}</legend>
      {d.aiuto && (
        <p id={aiuto} className={stili.aiuto}>
          {d.aiuto}
        </p>
      )}
      <div className={d.aspetto === 'righe' ? stili.righe : stili.riquadri}>
        {d.risposte.map((r) => (
          <Scelta
            key={r}
            nome={d.campo}
            valore={r}
            scelto={valore === r}
            conQuadretto={d.aspetto === 'righe'}
            onScegli={() => onScegli(r)}
          />
        ))}
      </div>
    </fieldset>
  );
}

interface PropsScelta {
  nome: string;
  valore: string;
  scelto: boolean;
  conQuadretto?: boolean;
  onScegli: () => void;
}

/** Un radio vero, invisibile ma usabile da tastiera; si vede il riquadro. */
function Scelta({ nome, valore, scelto, conQuadretto, onScegli }: PropsScelta) {
  return (
    <label className={stili.etichettaScelta}>
      <input
        type="radio"
        className={stili.radio}
        name={nome}
        value={valore}
        checked={scelto}
        onChange={onScegli}
      />
      <span className={stili.scelta}>
        {conQuadretto && <span className={stili.quadretto} aria-hidden="true" />}
        {valore}
      </span>
    </label>
  );
}

function Riepilogo({ risposte }: { risposte: Risposte }) {
  const sintesi = riepilogo(risposte);
  if (!sintesi) return null;
  return <p className={stili.sintesi}>{sintesi}</p>;
}
