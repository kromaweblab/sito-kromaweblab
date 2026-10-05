// Logica della prova "dal campo all'ufficio": tutto in memoria, nessun
// salvataggio. Funzioni pure (stesso ingresso, stessa uscita), così si
// provano con i test senza aprire il browser. L'interfaccia è in
// SquadraUfficio.tsx.
//
// L'orologio della prova è finto e fisso: parte alle 11:00 e ogni azione
// lo porta avanti di qualche minuto. Così gli orari sono plausibili e i test
// danno sempre lo stesso risultato.

import { operatoreDelTelefono, settori, type IdSettore, type Settore } from './settori';

export interface Rapporto {
  id: number;
  ora: string;
  operatore: string;
  cantiere: string;
  lavoro: string;
  ore: number;
  materiale: { nome: string; unita: string; quantita: number } | null;
  nota: string;
}

export interface Compito {
  id: number;
  operatore: string;
  cantiere: string;
  lavoro: string;
  assegnatoAlle: string;
  fattoAlle: string | null;
}

export interface Stato {
  settore: IdSettore;
  rapporti: Rapporto[];
  compiti: Compito[];
  /** Orologio finto, in minuti dalla mezzanotte. */
  minuti: number;
  prossimoId: number;
  /** Il rapporto appena arrivato in ufficio (evidenziato), o null. */
  ultimoRapporto: number | null;
  /** Il lavoro appena arrivato sul telefono (con "nuovo"), o null. */
  ultimoCompito: number | null;
  /** Novità non ancora guardate, per l'interruttore da telefono. */
  nuoviInUfficio: number;
  nuoviSulTelefono: number;
  /** Cosa è appena successo, in italiano semplice. */
  spiegazione: string;
}

export interface DatiRapporto {
  cantiere: string;
  lavoro: string;
  ore: number;
  /** Indice nei materiali del settore e quantità, oppure null. */
  materiale: { indice: number; quantita: number } | null;
  nota: string;
}

export interface DatiCompito {
  operatore: string;
  cantiere: string;
  lavoro: string;
}

export type Azione =
  | { tipo: 'settore'; settore: IdSettore }
  | { tipo: 'invia'; dati: DatiRapporto }
  | { tipo: 'assegna'; dati: DatiCompito }
  | { tipo: 'fatto'; id: number }
  | { tipo: 'guarda'; vista: 'telefono' | 'ufficio' };

/** Limiti del modulo del telefono. */
export const oreMinime = 0.5;
export const oreMassime = 12;
export const passoOre = 0.5;
export const lunghezzaMassimaNota = 200;

const inizioOrologio = 11 * 60;
const minutiPerAzione = 7;

export const spiegazioneIniziale =
  'Siete Operatore 1: mandate un rapporto dal telefono e guardate cosa arriva in ufficio.';

/** "11:05" dai minuti dalla mezzanotte. */
export function oraDa(minuti: number): string {
  const h = Math.floor(minuti / 60) % 24;
  const m = minuti % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** "2,5 h", con la virgola all'italiana. */
export function formattaOre(ore: number): string {
  return `${String(ore).replace('.', ',')} h`;
}

function materialeDa(settore: Settore, m: { indice: number; quantita: number } | null) {
  if (!m) return null;
  const materiale = settore.materiali[m.indice];
  if (!materiale) return null;
  return { nome: materiale.nome, unita: materiale.unita, quantita: m.quantita };
}

export function statoIniziale(id: IdSettore = 'verde'): Stato {
  const settore = settori[id];
  let prossimoId = 1;
  const rapporti: Rapporto[] = settore.rapportiIniziali.map((r) => ({
    id: prossimoId++,
    ora: r.ora,
    operatore: r.operatore,
    cantiere: r.cantiere,
    lavoro: r.lavoro,
    ore: r.ore,
    materiale: materialeDa(settore, r.materiale),
    nota: '',
  }));
  const compiti: Compito[] = settore.compitiIniziali.map((c) => ({
    id: prossimoId++,
    operatore: operatoreDelTelefono,
    cantiere: c.cantiere,
    lavoro: c.lavoro,
    assegnatoAlle: '07:00',
    fattoAlle: null,
  }));
  return {
    settore: id,
    rapporti,
    compiti,
    minuti: inizioOrologio,
    prossimoId,
    ultimoRapporto: null,
    ultimoCompito: null,
    nuoviInUfficio: 0,
    nuoviSulTelefono: 0,
    spiegazione: spiegazioneIniziale,
  };
}

/** Errore da mostrare sotto il modulo, oppure null se il rapporto va bene. */
export function controllaRapporto(dati: DatiRapporto, settore: Settore): string | null {
  if (!settore.cantieri.includes(dati.cantiere)) return 'Scegliete un cantiere.';
  if (!settore.lavori.includes(dati.lavoro)) return 'Scegliete un lavoro.';
  if (!(dati.ore >= oreMinime && dati.ore <= oreMassime)) {
    return `Le ore vanno da ${formattaOre(oreMinime)} a ${formattaOre(oreMassime)}.`;
  }
  if (dati.materiale && !(dati.materiale.quantita > 0)) {
    return 'Indicate quanto materiale, o togliete il materiale.';
  }
  if (dati.nota.length > lunghezzaMassimaNota) {
    return `La nota può avere al massimo ${lunghezzaMassimaNota} caratteri.`;
  }
  return null;
}

/** Ore totali per cantiere, nell'ordine dei cantieri del settore. */
export function orePerCantiere(stato: Stato): { cantiere: string; ore: number }[] {
  return settori[stato.settore].cantieri.map((cantiere) => ({
    cantiere,
    ore: stato.rapporti
      .filter((r) => r.cantiere === cantiere)
      .reduce((somma, r) => somma + r.ore, 0),
  }));
}

/** Materiali usati oggi, sommati; solo quelli con una quantità. */
export function materialiUsati(stato: Stato): { nome: string; unita: string; quantita: number }[] {
  return settori[stato.settore].materiali
    .map((m) => ({
      nome: m.nome,
      unita: m.unita,
      quantita: stato.rapporti
        .filter((r) => r.materiale?.nome === m.nome)
        .reduce((somma, r) => somma + (r.materiale?.quantita ?? 0), 0),
    }))
    .filter((m) => m.quantita > 0);
}

/** I lavori sul telefono: prima quelli da fare (i più nuovi in cima), poi i fatti. */
export function compitiDelTelefono(stato: Stato): Compito[] {
  const miei = stato.compiti.filter((c) => c.operatore === operatoreDelTelefono);
  const daFare = miei.filter((c) => !c.fattoAlle).reverse();
  const fatti = miei.filter((c) => c.fattoAlle);
  return [...daFare, ...fatti];
}

export function aggiorna(stato: Stato, azione: Azione): Stato {
  const settore = settori[stato.settore];

  switch (azione.tipo) {
    case 'settore': {
      if (azione.settore === stato.settore) return stato;
      const nuovo = statoIniziale(azione.settore);
      return {
        ...nuovo,
        spiegazione: `Settore ${settori[azione.settore].nome}: lavori, cantieri e materiali sono cambiati. Mandate un rapporto dal telefono.`,
      };
    }

    case 'invia': {
      if (controllaRapporto(azione.dati, settore)) return stato;
      const minuti = stato.minuti + minutiPerAzione;
      const ora = oraDa(minuti);
      const rapporto: Rapporto = {
        id: stato.prossimoId,
        ora,
        operatore: operatoreDelTelefono,
        cantiere: azione.dati.cantiere,
        lavoro: azione.dati.lavoro,
        ore: azione.dati.ore,
        materiale: materialeDa(settore, azione.dati.materiale),
        nota: azione.dati.nota.trim(),
      };
      const rapporti = [...stato.rapporti, rapporto];
      const totale = rapporti
        .filter((r) => r.cantiere === rapporto.cantiere)
        .reduce((somma, r) => somma + r.ore, 0);
      const m = rapporto.materiale;
      const sulMateriale = m
        ? `, e ${String(m.quantita).replace('.', ',')} ${m.unita} di ${m.nome.toLowerCase()} si sono aggiunti ai materiali`
        : '';
      return {
        ...stato,
        rapporti,
        minuti,
        prossimoId: stato.prossimoId + 1,
        ultimoRapporto: rapporto.id,
        nuoviInUfficio: stato.nuoviInUfficio + 1,
        spiegazione: `Il rapporto è arrivato in ufficio alle ${ora}: ${rapporto.cantiere} ora conta ${formattaOre(totale)} in tutto${sulMateriale}.`,
      };
    }

    case 'assegna': {
      const { operatore, cantiere, lavoro } = azione.dati;
      if (!settore.cantieri.includes(cantiere) || !settore.lavori.includes(lavoro)) return stato;
      const minuti = stato.minuti + minutiPerAzione;
      const compito: Compito = {
        id: stato.prossimoId,
        operatore,
        cantiere,
        lavoro,
        assegnatoAlle: oraDa(minuti),
        fattoAlle: null,
      };
      const alTelefono = operatore === operatoreDelTelefono;
      return {
        ...stato,
        compiti: [...stato.compiti, compito],
        minuti,
        prossimoId: stato.prossimoId + 1,
        ultimoCompito: alTelefono ? compito.id : stato.ultimoCompito,
        nuoviSulTelefono: stato.nuoviSulTelefono + (alTelefono ? 1 : 0),
        spiegazione: alTelefono
          ? `"${lavoro}" a ${cantiere} è arrivato sul telefono di ${operatore}, in cima a "Da fare".`
          : `"${lavoro}" è arrivato sul telefono di ${operatore}. Qui vedete solo il telefono di ${operatoreDelTelefono}: provate ad assegnarlo a lui.`,
      };
    }

    case 'fatto': {
      const compito = stato.compiti.find((c) => c.id === azione.id);
      if (!compito || compito.fattoAlle) return stato;
      const minuti = stato.minuti + minutiPerAzione;
      const ora = oraDa(minuti);
      return {
        ...stato,
        compiti: stato.compiti.map((c) => (c.id === azione.id ? { ...c, fattoAlle: ora } : c)),
        minuti,
        ultimoCompito: stato.ultimoCompito === azione.id ? null : stato.ultimoCompito,
        nuoviInUfficio: stato.nuoviInUfficio + 1,
        spiegazione: `${compito.operatore} ha segnato "${compito.lavoro}" come fatto alle ${ora}: in ufficio lo vedono subito, tra i lavori assegnati.`,
      };
    }

    case 'guarda':
      return azione.vista === 'ufficio'
        ? { ...stato, nuoviInUfficio: 0 }
        : { ...stato, nuoviSulTelefono: 0 };
  }
}
