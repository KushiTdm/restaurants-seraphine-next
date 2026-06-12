// Catalogue produits de la commande — source unique partagée entre
// le parcours client (/commande) et la vue équipe (/admin).

export type Cat = 'grignoter' | 'entrees' | 'plats' | 'desserts';

export interface Item {
  id: number;
  cat: Cat;
  n: string;
  d: string;
  p: number;
}

export const ITEMS: Item[] = [
  { id: 1, cat: 'grignoter', n: 'Gougères au comté', d: 'Choux soufflés, comté 18 mois', p: 8 },
  { id: 2, cat: 'grignoter', n: 'Anchois de Collioure', d: 'Pain grillé, beurre demi-sel', p: 10 },
  { id: 3, cat: 'grignoter', n: 'Olives & amandes torréfiées', d: 'Picholines, romarin', p: 6 },
  { id: 4, cat: 'entrees', n: 'Burrata, tomates anciennes', d: 'Burrata des Pouilles, basilic', p: 12 },
  { id: 5, cat: 'entrees', n: 'Œuf parfait, girolles', d: 'Œuf bio 64°, girolles poêlées', p: 11 },
  { id: 6, cat: 'entrees', n: 'Tartare de bœuf', d: 'Aloyau au couteau, condiments', p: 14 },
  { id: 7, cat: 'plats', n: 'Cabillaud, beurre blanc', d: 'Dos de cabillaud, blettes', p: 24 },
  { id: 8, cat: 'plats', n: 'Volaille fermière, jus corsé', d: 'Suprême rôti, purée maison', p: 22 },
  { id: 9, cat: 'plats', n: 'Entrecôte, frites maison', d: "250g race à viande, beurre maître d'hôtel", p: 26 },
  { id: 10, cat: 'plats', n: "Risotto d'orge, courgettes", d: 'Parmesan, courgettes de Provence', p: 19 },
  { id: 11, cat: 'desserts', n: 'Tarte fine aux abricots', d: 'Feuilletée, abricots du Roussillon', p: 9 },
  { id: 12, cat: 'desserts', n: 'Paris-Brest', d: 'Praliné noisette maison, craquelin', p: 10 },
  { id: 13, cat: 'desserts', n: 'Faisselle, miel de Paris', d: 'Faisselle fermière, miel des toits', p: 8 },
];

export const CATS: { id: Cat; label: string }[] = [
  { id: 'grignoter', label: 'À grignoter' },
  { id: 'entrees', label: 'Entrées' },
  { id: 'plats', label: 'Grandes assiettes' },
  { id: 'desserts', label: 'Pour finir' },
];
