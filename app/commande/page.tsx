'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { S } from '@/lib/tokens';

const kicker = (c: string): React.CSSProperties => ({
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '.28em',
  textTransform: 'uppercase',
  color: c,
});

type Cat = 'grignoter' | 'entrees' | 'plats' | 'desserts';
type Mode = 'sur_place' | 'a_emporter';

interface Item {
  id: number;
  cat: Cat;
  n: string;
  d: string;
  p: number;
}

const ITEMS: Item[] = [
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

const CATS: { id: Cat; label: string }[] = [
  { id: 'grignoter', label: 'À grignoter' },
  { id: 'entrees', label: 'Entrées' },
  { id: 'plats', label: 'Grandes assiettes' },
  { id: 'desserts', label: 'Pour finir' },
];

export default function CommandePage() {
  const [panier, setPanier] = useState<Record<number, number>>({});
  const [mode, setMode] = useState<Mode>('a_emporter');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [activeCat, setActiveCat] = useState<Cat>('plats');

  const add = (id: number) => setPanier((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const remove = (id: number) =>
    setPanier((p) => {
      const n = { ...p };
      if ((n[id] || 0) > 1) n[id]--;
      else delete n[id];
      return n;
    });

  const total = Object.entries(panier).reduce((acc, [id, qty]) => {
    const item = ITEMS.find((i) => i.id === Number(id));
    return acc + (item ? item.p * qty : 0);
  }, 0);

  const count = Object.values(panier).reduce((a, b) => a + b, 0);
  const panierItems = Object.entries(panier)
    .map(([id, qty]) => ({ item: ITEMS.find((i) => i.id === Number(id))!, qty }))
    .filter((x) => x.item);

  if (done) {
    return (
      <div
        style={{
          fontFamily: S.font,
          background: S.deep,
          color: S.cream,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: S.gold,
              color: S.forest,
              fontSize: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            ✓
          </div>
          <div style={{ ...kicker(S.gold), marginTop: 24 }}>Commande confirmée</div>
          <h1
            style={{
              fontSize: 'clamp(34px,6vw,54px)',
              fontWeight: 500,
              letterSpacing: '-0.025em',
              margin: '12px 0 0',
            }}
          >
            À tout à l&apos;heure.
          </h1>
          <p style={{ fontSize: 15, color: S.muted, marginTop: 16, lineHeight: 1.7 }}>
            Votre commande est en préparation.{' '}
            {mode === 'a_emporter'
              ? 'Elle sera prête dans environ 25 minutes — présentez-vous au comptoir.'
              : 'Elle vous sera apportée à table dans quelques instants.'}
          </p>
          <div
            style={{
              background: 'rgba(28,43,34,.6)',
              border: `1px solid rgba(200,162,75,.2)`,
              borderRadius: 4,
              padding: '22px 24px',
              marginTop: 28,
              textAlign: 'left',
            }}
          >
            <div style={{ ...kicker(S.gold), marginBottom: 14 }}>Récapitulatif</div>
            {panierItems.map(({ item, qty }) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(239,231,214,.08)',
                  fontSize: 15,
                }}
              >
                <span>
                  {qty > 1 && (
                    <span style={{ color: S.gold, marginRight: 6 }}>{qty}×</span>
                  )}
                  {item.n}
                </span>
                <span style={{ color: S.gold }}>{item.p * qty}€</span>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 14,
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              <span>Total</span>
              <span style={{ color: S.gold }}>{total}€</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
            <Link
              href="/"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: S.forest,
                background: S.gold,
                padding: '13px 28px',
                borderRadius: 2,
                textDecoration: 'none',
              }}
            >
              Retour à l&apos;accueil
            </Link>
          </div>
          <p style={{ fontSize: 12, color: S.muted, marginTop: 14 }}>
            9 rue Saint-Maur, 75011 · 01 43 00 00 00
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: S.font, background: S.cream, color: S.forest, minHeight: '100vh' }}>
      {/* header */}
      <div style={{ background: S.forest, color: S.cream, padding: '40px 56px 36px' }}>
        <div style={kicker(S.gold)}>Commander</div>
        <h1
          style={{
            fontSize: 'clamp(38px,5vw,60px)',
            fontWeight: 500,
            letterSpacing: '-0.025em',
            lineHeight: 1,
            margin: '10px 0 24px',
          }}
        >
          La carte du soir
        </h1>

        {/* mode selector */}
        <div style={{ display: 'flex', gap: 10 }}>
          {([['sur_place', 'Sur place'], ['a_emporter', 'À emporter']] as [Mode, string][]).map(
            ([id, label]) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '9px 20px',
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: `1.5px solid ${mode === id ? S.gold : 'rgba(239,231,214,.3)'}`,
                  background: mode === id ? S.gold : 'transparent',
                  color: mode === id ? S.forest : S.muted,
                  transition: 'all .14s',
                }}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* category tabs */}
      <div
        style={{
          background: S.deep,
          borderBottom: `1px solid rgba(200,162,75,.15)`,
          overflowX: 'auto',
        }}
      >
        <div style={{ display: 'flex', gap: 0, padding: '0 56px', whiteSpace: 'nowrap' }}>
          {CATS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveCat(id)}
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '.06em',
                padding: '16px 24px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: activeCat === id ? S.gold : S.muted,
                borderBottom: `2px solid ${activeCat === id ? S.gold : 'transparent'}`,
                transition: 'all .14s',
              }}
            >
              {label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* items */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 120px' }}>
        {ITEMS.filter((item) => item.cat === activeCat).map((item) => {
          const qty = panier[item.id] || 0;
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '18px 0',
                borderBottom: `1px solid rgba(28,43,34,.1)`,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 500 }}>{item.n}</div>
                <div style={{ fontSize: 13.5, color: 'rgba(28,43,34,.6)', marginTop: 3 }}>
                  {item.d}
                </div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: S.terra, minWidth: 38 }}>
                {item.p}€
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {qty > 0 && (
                  <button
                    onClick={() => remove(item.id)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      border: `1.5px solid rgba(28,43,34,.2)`,
                      background: '#fff',
                      cursor: 'pointer',
                      fontSize: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: S.forest,
                    }}
                  >
                    −
                  </button>
                )}
                {qty > 0 && (
                  <span style={{ fontSize: 16, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
                    {qty}
                  </span>
                )}
                <button
                  onClick={() => add(item.id)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 2,
                    border: `1.5px solid ${S.gold}`,
                    background: qty > 0 ? S.gold : 'transparent',
                    cursor: 'pointer',
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: qty > 0 ? S.forest : S.gold,
                    transition: 'all .14s',
                  }}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* panier bar */}
      {count > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: S.forest,
            borderTop: `1px solid rgba(200,162,75,.2)`,
            padding: '0 24px',
            zIndex: 100,
          }}
        >
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <button
              onClick={() => setDrawerOpen((v) => !v)}
              style={{
                width: '100%',
                padding: '18px 0',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: S.cream,
              }}
            >
              <span style={{ fontSize: 14, color: S.muted }}>
                {count} article{count > 1 ? 's' : ''}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                Mon panier · {total}€ {drawerOpen ? '▲' : '▼'}
              </span>
            </button>

            {drawerOpen && (
              <div style={{ paddingBottom: 20 }}>
                {panierItems.map(({ item, qty }) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderTop: '1px solid rgba(239,231,214,.08)',
                      fontSize: 14,
                      color: S.cream,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button
                        onClick={() => remove(item.id)}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 2,
                          border: '1px solid rgba(239,231,214,.2)',
                          background: 'transparent',
                          cursor: 'pointer',
                          color: S.muted,
                          fontSize: 14,
                        }}
                      >
                        −
                      </button>
                      <span>{qty}× {item.n}</span>
                    </div>
                    <span style={{ color: S.gold }}>{item.p * qty}€</span>
                  </div>
                ))}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '14px 0 0',
                    borderTop: `1px solid rgba(200,162,75,.3)`,
                    fontWeight: 700,
                    color: S.cream,
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: S.gold }}>{total}€</span>
                </div>
                <button
                  onClick={() => setDone(true)}
                  style={{
                    width: '100%',
                    marginTop: 16,
                    padding: '15px',
                    background: S.gold,
                    border: 'none',
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontSize: 15,
                    fontWeight: 700,
                    color: S.forest,
                    letterSpacing: '.04em',
                  }}
                >
                  Valider la commande — {total}€
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
