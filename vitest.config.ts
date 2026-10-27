// Configurazione dei test (Vitest). Di solito Vitest legge i file CSS come
// vuoti: qui gli diciamo di leggere davvero tokens.css, così un test può
// controllare che i valori copiati nel codice siano uguali ai token.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    css: { include: [/tokens\.css/] },
  },
});
