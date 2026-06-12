// Remises produit posées par le restaurateur (dernière heure, invendus, produit du jour).
// Stockées en localStorage et lues par le client (/commande) en temps réel.

export interface Deal {
  percent: number;
  label: string;
}

const KEY = 'seraphine_deals';

export const DEAL_LABELS = ['Dernière heure', 'Invendu du jour', 'Produit du jour'];
export const DEAL_PERCENTS = [20, 30, 40, 50];

export function readDeals(): Record<number, Deal> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') as Record<number, Deal>;
  } catch {
    return {};
  }
}

export function writeDeals(d: Record<number, Deal>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    /* ignore */
  }
}

export function setDeal(id: number, deal: Deal): void {
  const all = readDeals();
  all[id] = deal;
  writeDeals(all);
}

export function removeDeal(id: number): void {
  const all = readDeals();
  delete all[id];
  writeDeals(all);
}

export function clearDeals(): void {
  writeDeals({});
}

// Prix remisé, arrondi à 2 décimales.
export function dealPrice(base: number, deal?: Deal): number {
  if (!deal) return base;
  return Math.round(base * (1 - deal.percent / 100) * 100) / 100;
}

// Format euro : entier sans décimale, sinon 2 décimales avec virgule.
export function euro(n: number): string {
  return Number.isInteger(n) ? `${n}€` : `${n.toFixed(2).replace('.', ',')}€`;
}
