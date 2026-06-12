// Logique partagée du click & collect (démo) — commandes stockées en localStorage,
// lues à la fois par le parcours client (/commande) et la vue équipe (/admin).

export type OrderStatus = 'recue' | 'preparation' | 'prete' | 'retiree';

export interface CCOrderItem {
  n: string;
  qty: number;
  p: number;
}

export interface CCOrder {
  id: string;
  code: string; // code de retrait à 4 chiffres
  name: string;
  mode: 'sur_place' | 'a_emporter';
  slot: string | null; // créneau de retrait (click & collect)
  items: CCOrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
}

const KEY = 'seraphine_cc_orders';

export const STATUS_FLOW: OrderStatus[] = ['recue', 'preparation', 'prete', 'retiree'];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  recue: 'Reçue',
  preparation: 'En préparation',
  prete: 'Prête à retirer',
  retiree: 'Retirée',
};

export const STATUS_COLOR: Record<OrderStatus, string> = {
  recue: '#B5552F',
  preparation: '#C8A24B',
  prete: '#2e7d32',
  retiree: '#7c857f',
};

export function readOrders(): CCOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as CCOrder[];
  } catch {
    return [];
  }
}

export function writeOrders(orders: CCOrder[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(orders));
  } catch {
    /* ignore */
  }
}

export function addOrder(o: CCOrder): void {
  const all = readOrders();
  all.unshift(o);
  writeOrders(all);
}

export function updateStatus(id: string, status: OrderStatus): void {
  writeOrders(readOrders().map((o) => (o.id === id ? { ...o, status } : o)));
}

export function nextStatus(s: OrderStatus): OrderStatus | null {
  const i = STATUS_FLOW.indexOf(s);
  return i >= 0 && i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : null;
}
