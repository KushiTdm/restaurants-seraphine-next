const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

export const PHOTOS = {
  // ambiance bar à vins, lumière basse
  barAmbiance: U('1414235077428-338989a2e8c0', 1100),
  // épaule d'agneau braisée / plat
  agneau: U('1544025162-d76694265947', 900),
  // cave à vins / bouteilles
  cave: U('1506377247377-2a5b3b417ebb', 700),
  // mise en place / cuisine
  table: U('1551218808-94e220e084d2', 700),
  // salle de restaurant
  salle: U('1517248135467-4c7edcad34c4', 900),
} as const;
