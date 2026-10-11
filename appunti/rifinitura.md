# Lista per la rifinitura

Punti raccolti mentre si costruiva lo scheletro (dal 04/10/2026). Si
riprendono tutti insieme quando le sezioni sono complete. Chi chiude un
punto lo cancella da qui nella stessa PR.

## Accessibilità e movimento

- [ ] **Passaggio tra le pagine con il movimento ridotto.** Chi ha ridotto il
      movimento nel sistema vede comunque la dissolvenza tra le pagine: la
      regola generale in `base.css` non arriva agli pseudo-elementi delle
      View Transitions. Correzione: mettere `@view-transition` dentro
      `@media (prefers-reduced-motion: no-preference)`.
- [ ] **"Salta al contenuto"** porta a `#contenuto` ma non sposta davvero il
      cursore: aggiungere `tabindex="-1"` a `<main>` in `Base.astro`.

## Testi

- [ ] Descrizione per Google della home (oggi `[DA SCRIVERE]`). Proposta:
      "Gestionali e web app su misura per chi lavora con una squadra, siti e
      manutenzione. Giovanni e Andrea, Scicli (RG): di persona o in
      videochiamata."
- [ ] "Cosa facciamo": la frase della manutenzione è lunga per la dimensione
      grande (due frasi).
- [ ] Casale Allibrio: per "Com'era prima" ci sono fatti in
      `appunti/lavori.md` (da raccontare senza mettere in imbarazzo la
      titolare); "Cosa abbiamo fatto" e "Come si usa oggi" da scrivere.
      Estrò Atelier: tutto da scrivere.

## Grafica

- [ ] Logo di Casale Allibrio più piccolo degli altri nei riquadri (il disegno
      ha molto spazio vuoto intorno): ritagliarlo o dargli un'altezza sua.
- [ ] La home da telefono è lunga: rivalutare quando ci sono i contenuti veri.

## Pulizia del codice

- [ ] `src/sezioni/Problema.astro`: non lo usa nessuna pagina e contiene
      "Raccontaci la tua →". Da cancellare.
- [ ] `src/componenti/Pulsante.astro`: l'opzione `freccia` non la usa più
      nessuno, e il commento d'esempio dice "Raccontaci la tua attività".
- [ ] `src/componenti/PaginaSegnaposto.astro`: da togliere quando non ci
      sono più pagine provvisorie (dall'11/10/2026 la usa solo `/privacy`).
- [ ] Classe `.parliamone` nel configuratore (solo il nome, non si vede):
      rinominare in qualcosa come `.recapitiFinali` (Andrea).

## Per Andrea

- [ ] Token `--kroma-vivai-*` in `tokens.css`: dall'08/10/2026 non li usa
      più nessuno (la ricostruzione di Vivai è stata sostituita dalle
      schermate vere). Toglierli, o tenerli se torna una ricostruzione.
- [ ] Prova "dal campo all'ufficio" (Giovanni): in `Telefono.tsx` e
      `Ufficio.tsx` si usano le classi `cosa`, `quando` ed `etichettaBarra`,
      che nel CSS non ci sono (c'era già prima dell'11/10/2026, non rompe
      niente): aggiungerle o togliere i riferimenti.
