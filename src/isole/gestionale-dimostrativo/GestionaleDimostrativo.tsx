// Prova "dal cliente all'attività": il telefono di un cliente che prenota e
// il computer dell'attività che riceve e conferma, collegati. Il visitatore
// sceglie il tipo di attività e può dare all'app il suo nome e il suo
// colore. Dati di esempio, tutto in memoria.
// Nella pagina: <GestionaleDimostrativo client:visible oggi={Date.now()} />
//
// La logica è in logica.ts (con i test); qui, in Telefono.tsx, Ufficio.tsx
// e Calendario.tsx c'è solo l'interfaccia.
//
// Da computer telefono e attività stanno affiancati. Quando lo spazio è
// poco (container query, misurata sull'isola) se ne vede uno alla volta,
// con un interruttore in alto che segnala le novità dell'altro, come nella
// prova "dal campo all'ufficio" di Giovanni.

import {
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from 'react';
import { attivita, ordineAttivita } from './attivita';
import {
  aggiorna,
  coloreLeggibile,
  lunghezzaMassimaNome,
  nomeMostrato,
  statoIniziale,
  testoSuColore,
} from './logica';
import { Telefono } from './Telefono';
import { Ufficio } from './Ufficio';
import stili from './GestionaleDimostrativo.module.css';

interface Props {
  /**
   * Il giorno della build, passato dalla pagina: uguale alla build e
   * nell'idratazione, così il primo disegno coincide. Nel browser arriva
   * subito dopo la data vera (vedi useOggiNelBrowser).
   */
  oggi: number;
}

export function GestionaleDimostrativo({ oggi: oggiAllaBuild }: Props) {
  const [stato, invia] = useReducer(aggiorna, undefined, () =>
    statoIniziale('ristorante', new Date(oggiAllaBuild)),
  );

  // Arrivata la data vera, gli esempi si rifanno attorno a oggi. Si fa
  // durante il disegno (come consiglia React), non con un effetto.
  const oggi = useOggiNelBrowser();
  if (oggi !== null && oggi !== stato.oggi) invia({ tipo: 'oggi', oggi });

  const [vista, setVista] = useState<Vista>('cliente');
  const radice = useRef<HTMLDivElement>(null);
  const vai = (nuova: Vista, scorri = false) => {
    setVista(nuova);
    invia({ tipo: 'guarda', vista: nuova });
    // Dal pulsante sotto la spiegazione: si torna in cima alla prova, dove
    // comincia lo schermo appena scelto.
    if (scorri) radice.current?.scrollIntoView({ block: 'start' });
  };
  const altra: Vista = vista === 'cliente' ? 'ufficio' : 'cliente';
  const novitaAltrove = stato.novita[altra];

  const nomeApp = nomeMostrato(stato);
  const id = useId();
  // Il colore scelto, per tutto quello che sta dentro gli schermi: il colore
  // stesso (fondi, barre), il testo da metterci sopra, e la versione scurita
  // per le scritte colorate sul fondo chiaro. Tutti e tre leggibili (logica.ts).
  const tema = {
    '--tema': stato.tema,
    '--tema-su':
      testoSuColore(stato.tema) === 'chiaro'
        ? 'var(--kroma-app-superficie)'
        : 'var(--kroma-app-testo)',
    '--tema-testo': coloreLeggibile(stato.tema),
  } as CSSProperties;

  return (
    <div className={stili.prova} style={tema} ref={radice}>
      <div className={stili.testa}>
        <fieldset className={stili.attivita}>
          <legend>Tipo di attività</legend>
          <div className={stili.scelte}>
            {ordineAttivita.map((id) => (
              // Il radio vero resta, invisibile ma raggiungibile da tastiera;
              // si vede il riquadro accanto (vedi .radio nel CSS).
              <label key={id} className={stili.etichettaScelta}>
                <input
                  type="radio"
                  className={stili.radio}
                  name="prova-attivita"
                  value={id}
                  checked={stato.attivita === id}
                  onChange={() => invia({ tipo: 'scegliAttivita', attivita: id })}
                />
                <span className={stili.scelta}>{attivita[id].nome}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <p className={stili.suMisura}>
          Qui provate nome e colore. Per voi la prepariamo con il vostro nome, i vostri colori, il
          vostro logo, i vostri servizi e orari. E se vi serve di più, vi costruiamo un gestionale
          tutto su misura.
        </p>

        {/* Nome e colore: chiusi finché non servono, così la prova parte subito. */}
        <details className={stili.personalizza}>
          <summary>Personalizza: nome, colore e logo</summary>
          <div className={stili.campiPersonalizza}>
            <div className={stili.campoNome}>
              <label htmlFor={`${id}-nome`}>Nome della vostra attività</label>
              <input
                id={`${id}-nome`}
                type="text"
                autoComplete="organization"
                maxLength={lunghezzaMassimaNome}
                placeholder={attivita[stato.attivita].nome}
                value={stato.nome}
                onChange={(e) => invia({ tipo: 'nomeAttivita', valore: e.target.value })}
              />
            </div>
            <div className={stili.campoColore}>
              <label htmlFor={`${id}-colore`}>Colore dell&apos;app</label>
              <span className={stili.selettoreColore}>
                {/* Il selettore del browser: qualsiasi colore. */}
                <input
                  id={`${id}-colore`}
                  type="color"
                  value={stato.tema}
                  onChange={(e) => invia({ tipo: 'tema', tema: e.target.value })}
                />
                <span className={stili.codiceColore}>{stato.tema}</span>
              </span>
            </div>
            <CampoLogo logo={stato.logo} onLogo={(url) => invia({ tipo: 'logo', url })} />
          </div>
        </details>

        <p className={stili.avviso}>Dati di esempio. Niente viene salvato.</p>
      </div>

      <div className={stili.impianto} data-vista={vista}>
        {/* Solo quando c'è spazio per uno schermo alla volta (vedi il CSS). */}
        <div className={stili.interruttore} role="group" aria-label="Quale schermo guardare">
          {(['cliente', 'ufficio'] as const).map((v) => (
            <button key={v} type="button" aria-pressed={vista === v} onClick={() => vai(v)}>
              {v === 'cliente' ? 'Il cliente' : "L'attività"}
              {stato.novita[v] > 0 && (
                <span className={stili.contatoreNovita}>
                  {stato.novita[v]} {stato.novita[v] === 1 ? 'nuova' : 'nuove'}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* key: cambiando attività gli schermi ripartono da capo. */}
        <div className={stili.colonnaTelefono}>
          <Telefono key={stato.attivita} stato={stato} invia={invia} nomeApp={nomeApp} />
        </div>
        <div className={stili.colonnaUfficio}>
          <Ufficio key={stato.attivita} stato={stato} invia={invia} nomeApp={nomeApp} />
        </div>
      </div>

      {/* La riga che spiega cosa succede. aria-live: i lettori di schermo la
          leggono da soli ogni volta che cambia. */}
      <div className={stili.spiegazione}>
        <p aria-live="polite">{stato.spiegazione}</p>
        {novitaAltrove > 0 && (
          <button type="button" className={stili.vaiAltrove} onClick={() => vai(altra, true)}>
            {altra === 'ufficio' ? "Guardate l'attività" : 'Guardate il telefono'}
          </button>
        )}
      </div>
    </div>
  );
}

type Vista = 'cliente' | 'ufficio';

// ---------------------------------------------------------------------------
// Il logo del visitatore
//
// Il file non lascia il suo computer: il browser lo legge e ne fa un
// indirizzo "blob:" che vale solo in questa pagina. Niente viene caricato.

/** Un logo più grande di così è quasi certamente una foto, non un logo. */
const pesoMassimoLogo = 2 * 1024 * 1024;

function CampoLogo({
  logo,
  onLogo,
}: {
  logo: string | null;
  onLogo: (url: string | null) => void;
}) {
  const id = useId();
  const [errore, setErrore] = useState<string | null>(null);
  const campo = useRef<HTMLInputElement>(null);

  // Quando il logo cambia (o la prova sparisce), il vecchio indirizzo si
  // libera: altrimenti il browser terrebbe il file in memoria.
  useEffect(
    () => () => {
      if (logo) URL.revokeObjectURL(logo);
    },
    [logo],
  );

  const scegli = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrore('Scegliete un’immagine: PNG, JPG, SVG o WebP.');
      return;
    }
    if (file.size > pesoMassimoLogo) {
      setErrore('Il logo è troppo pesante: al massimo 2 MB.');
      return;
    }
    setErrore(null);
    onLogo(URL.createObjectURL(file));
  };

  return (
    <div className={stili.campoLogo}>
      <label htmlFor={`${id}-logo`}>Il vostro logo</label>
      <div className={stili.selettoreLogo}>
        {logo && <img src={logo} alt="" className={stili.anteprimaLogo} />}
        <input
          ref={campo}
          id={`${id}-logo`}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          aria-describedby={`${id}-logo-nota`}
          onChange={(e) => scegli(e.target.files?.[0])}
        />
        {logo && (
          <button
            type="button"
            className={stili.togliLogo}
            onClick={() => {
              onLogo(null);
              if (campo.current) campo.current.value = '';
              campo.current?.focus();
            }}
          >
            Togli il logo
          </button>
        )}
      </div>
      <p id={`${id}-logo-nota`} className={stili.notaLogo}>
        Resta sul vostro dispositivo: non viene caricato da nessuna parte.
      </p>
      {errore && (
        <p className={stili.erroreLogo} role="alert">
          {errore}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// La data di oggi, solo nel browser.
//
// useSyncExternalStore ha due "letture": una per il server (qui: la build)
// e una per il browser. Durante l'idratazione React usa quella del server,
// così il primo disegno coincide con l'HTML della build; subito dopo
// ridisegna con quella del browser.

const nessunaIscrizione = () => () => {};
/** Mezzanotte di oggi, come numero: resta uguale per tutto il giorno. */
const oggiNelBrowser = () => new Date().setHours(0, 0, 0, 0);
const oggiAllaBuildNulla = () => null;

function useOggiNelBrowser(): number | null {
  return useSyncExternalStore(nessunaIscrizione, oggiNelBrowser, oggiAllaBuildNulla);
}
