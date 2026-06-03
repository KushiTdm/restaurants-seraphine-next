export type DietTag = 'vege' | 'vegan' | 'sansgluten' | 'signature';
export type MenuCat = 'grignoter' | 'entrees' | 'plats' | 'desserts';

export interface MenuItem {
  cat: MenuCat;
  n: string;
  d: string;
  p: number;
  tags: DietTag[];
}

export interface WineItem {
  n: string;
  d: string;
  g: number;
  b: number;
}

export const MENU: MenuItem[] = [
  { cat: 'grignoter', n: 'Gougères au comté', d: 'Choux soufflés, comté 18 mois, poivre du moulin', p: 8, tags: ['vege'] },
  { cat: 'grignoter', n: 'Anchois de Collioure', d: 'Pain de campagne grillé, beurre demi-sel', p: 10, tags: [] },
  { cat: 'grignoter', n: 'Olives & amandes torréfiées', d: 'Picholines, romarin, fleur de sel', p: 6, tags: ['vegan', 'sansgluten'] },
  { cat: 'grignoter', n: 'Houmous de saison, crudités', d: "Pois chiches, huile d'olive, légumes croquants", p: 9, tags: ['vegan', 'sansgluten'] },

  { cat: 'entrees', n: 'Velouté de petits pois & menthe', d: 'Crème fouettée, lard croustillant (option sans)', p: 9, tags: ['sansgluten'] },
  { cat: 'entrees', n: 'Burrata, tomates anciennes', d: 'Burrata des Pouilles, basilic, huile de Ligurie', p: 12, tags: ['vege', 'sansgluten'] },
  { cat: 'entrees', n: 'Œuf parfait, girolles', d: 'Œuf bio 64°, girolles poêlées, jus de viande', p: 11, tags: ['vege'] },
  { cat: 'entrees', n: 'Tartare de bœuf au couteau', d: 'Aloyau, condiments, frites maison', p: 14, tags: ['signature'] },

  { cat: 'plats', n: 'Cabillaud, beurre blanc', d: "Dos de cabillaud, blettes, beurre blanc à l'échalote", p: 24, tags: ['sansgluten'] },
  { cat: 'plats', n: 'Volaille fermière, jus corsé', d: 'Suprême rôti, purée maison, jus réduit', p: 22, tags: ['sansgluten'] },
  { cat: 'plats', n: 'Entrecôte, frites maison', d: "Race à viande 250g, beurre maître d'hôtel", p: 26, tags: ['signature'] },
  { cat: 'plats', n: "Risotto d'orge, courgettes", d: 'Orge perlé, courgettes de Provence, parmesan', p: 19, tags: ['vege'] },
  { cat: 'plats', n: 'Pavé de chou-fleur rôti', d: 'Chou-fleur entier, tahini, grenade, dukkah', p: 18, tags: ['vegan', 'sansgluten'] },

  { cat: 'desserts', n: 'Tarte fine aux abricots', d: 'Pâte feuilletée, abricots du Roussillon, amande', p: 9, tags: ['vege'] },
  { cat: 'desserts', n: 'Paris-Brest', d: 'Praliné noisette maison, craquelin', p: 10, tags: ['vege', 'signature'] },
  { cat: 'desserts', n: 'Faisselle, miel de Paris', d: 'Faisselle fermière, miel des toits du 11ᵉ', p: 8, tags: ['vege', 'sansgluten'] },
  { cat: 'desserts', n: 'Sorbets de saison', d: 'Trois parfums du jour, fruits frais', p: 8, tags: ['vegan', 'sansgluten'] },
];

export const WINES: WineItem[] = [
  { n: 'Côtes du Rhône, Domaine Gramenon', d: 'Grenache · nature · Drôme', g: 7, b: 34 },
  { n: 'Sancerre, Vincent Pinard', d: 'Sauvignon · Loire', g: 9, b: 42 },
  { n: 'Beaujolais, Jean Foillard', d: 'Gamay · Morgon', g: 8, b: 38 },
  { n: 'Champagne brut, Marie-Courtin', d: 'Blanc de noirs · extra-brut', g: 14, b: 72 },
];

export const ARDOISE_DU_JOUR = {
  entrees: [
    ['Velouté de petits pois, menthe', '9'],
    ['Burrata, tomates anciennes', '12'],
    ['Œuf parfait, girolles', '11'],
  ],
  plats: [
    ['Cabillaud, beurre blanc, blettes', '24'],
    ['Volaille fermière, jus corsé', '22'],
    ["Risotto d'orge, courgettes", '19'],
  ],
  desserts: [
    ['Tarte fine aux abricots', '9'],
    ['Faisselle, miel de Paris', '8'],
    ['Glace vanille de Madagascar', '7'],
  ],
} as const;
