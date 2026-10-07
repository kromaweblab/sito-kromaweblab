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
- [ ] Ricostruzione di Vivai Cintoli: ci sono i puntini ("Squadra B · 3
      persone", "Riga 1 · Potatura siepi"). Se l'app vera mostra i dati così
      restano (è una fotografia dell'app); altrimenti si tolgono.
- [ ] La home da telefono è lunga: rivalutare quando ci sono i contenuti veri.

## Pulizia del codice

- [ ] `src/sezioni/Problema.astro`: non lo usa nessuna pagina e contiene
      "Raccontaci la tua →". Da cancellare.
- [ ] `src/componenti/Pulsante.astro`: l'opzione `freccia` non la usa più
      nessuno, e il commento d'esempio dice "Raccontaci la tua attività".
- [ ] `src/componenti/PaginaSegnaposto.astro`: da togliere quando non ci
      sono più pagine provvisorie.
- [ ] Classe `.parliamone` nel configuratore (solo il nome, non si vede):
      rinominare in qualcosa come `.recapitiFinali` (Andrea).

## Per Andrea

- [ ] Lavagna dimostrativa (`src/isole/gestionale-dimostrativo/`): fuori
      dalla home; decidere se riusarla (es. `/gestionali`) e, se sì, colori
      scuri (usa `--kroma-arancione-testo`, `--kroma-carta*`).
- [ ] `src/dati/metodo.ts`: `fattiGestionale` e `domandeGestionali` danno del
      tu, e "Il server lo acquisti tu, insieme al dominio" è una promessa non
      ancora decisa (su `/siti` è `[DA DEFINIRE]`).
