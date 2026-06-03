'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { S } from '@/lib/tokens';
import { MENU, WINES, type DietTag, type MenuCat } from '@/lib/menu-data';
import { Reveal } from '@/components/Anim';

const CATS = [
  { id: 'tout', label: 'Tout' },
  { id: 'grignoter', label: 'À grignoter' },
  { id: 'entrees', label: 'Entrées' },
  { id: 'plats', label: 'Plats' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'vins', label: 'Vins' },
];

const SECTIONS = [
  { id: 'grignoter' as MenuCat, head: 'À grignoter' },
  { id: 'entrees' as MenuCat, head: 'Entrées' },
  { id: 'plats' as MenuCat, head: 'Les plats' },
  { id: 'desserts' as MenuCat, head: 'Desserts' },
];

const DIETS: { id: DietTag; label: string }[] = [
  { id: 'vege', label: 'Végétarien' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'sansgluten', label: 'Sans gluten' },
  { id: 'signature', label: 'Signature' },
];

const TAGMETA: Record<DietTag, { label: string; c: string }> = {
  vege: { label: 'Végé', c: '#6baa62' },
  vegan: { label: 'Vegan', c: '#5aaa85' },
  sansgluten: { label: 'S. gluten', c: S.gold },
  signature: { label: 'Signature', c: S.terra },
};

const kicker = (c: string): React.CSSProperties => ({
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '.28em',
  textTransform: 'uppercase',
  color: c,
});

export default function CartePage() {
  const router = useRouter();
  const [cat, setCat] = useState('tout');
  const [diets, setDiets] = useState<Set<DietTag>>(new Set());
  const [q, setQ] = useState('');

  const toggleDiet = (id: DietTag) =>
    setDiets((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const match = (m: (typeof MENU)[0]) => {
    if (diets.size && ![...diets].every((d) => m.tags.includes(d))) return false;
    if (q.trim()) {
      const str = (m.n + ' ' + m.d).toLowerCase();
      if (!str.includes(q.toLowerCase().trim())) return false;
    }
    return true;
  };

  const showVins = cat === 'tout' || cat === 'vins';
  const visibleSections = SECTIONS
    .filter((s) => cat === 'tout' || cat === s.id)
    .map((s) => ({ ...s, items: MENU.filter((m) => m.cat === s.id && match(m)) }))
    .filter((s) => s.items.length);
  const total = visibleSections.reduce((a, s) => a + s.items.length, 0);
  const winesMatch = !q.trim() || WINES.some((w) => (w.n + w.d).toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ fontFamily: S.font, background: S.cream, color: S.forest }}>
      {/* dark header */}
      <div className="carte-header" style={{ background: S.forest, color: S.cream, padding: '52px 56px 40px' }}>
        <Reveal stagger={0.1} staggerSelector=":scope > *" y={24}>
          <div style={kicker(S.gold)}>L&apos;ardoise · à partager</div>
          <h1
            style={{
              fontSize: 'clamp(48px,7vw,76px)',
              lineHeight: 1.0,
              fontWeight: 500,
              letterSpacing: '-0.03em',
              margin: '16px 0 0',
            }}
          >
            La carte du soir
          </h1>
        </Reveal>
        <div
          className="carte-header-meta"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 10,
            paddingTop: 18,
            borderTop: '1px solid rgba(239,231,214,.15)',
          }}
        >
          <p style={{ fontSize: 15, color: 'rgba(239,231,214,.65)', margin: 0 }}>
            Dès 19h, du mardi au samedi · Bar jusqu&apos;à minuit
          </p>
          <span style={{ ...kicker(S.gold), fontSize: 12 }}>Mardi 2 juin</span>
        </div>
      </div>

      {/* filter bar */}
      <div
        style={{
          position: 'sticky',
          top: 68,
          zIndex: 20,
          background: 'rgba(239,231,214,.97)',
          backdropFilter: 'blur(8px)',
          borderBottom: `1.5px solid ${S.forest}`,
        }}
      >
        <div className="carte-filter" style={{ padding: '12px 56px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="carte-filter-row" style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            {CATS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '.02em',
                  cursor: 'pointer',
                  padding: '8px 18px',
                  borderRadius: 2,
                  border: 'none',
                  background: cat === c.id ? S.forest : 'transparent',
                  color: cat === c.id ? S.cream : S.forest,
                  transition: 'all .15s',
                  opacity: cat !== c.id ? 0.65 : 1,
                }}
              >
                {c.label}
              </button>
            ))}
            <div
              className="carte-search"
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                border: `1px solid rgba(28,43,34,.25)`,
                padding: '8px 16px',
                background: '#fff',
                borderRadius: 2,
                minWidth: 200,
              }}
            >
              <span style={{ color: S.forest, fontSize: 13, opacity: 0.5 }}>⌕</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher…"
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: S.font,
                  fontSize: 13,
                  width: '100%',
                  color: S.forest,
                }}
              />
              {q && (
                <button
                  onClick={() => setQ('')}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: S.forest, fontSize: 16, opacity: 0.5 }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(28,43,34,.5)', marginRight: 4 }}>
              Régime
            </span>
            {DIETS.map((d) => (
              <button
                key={d.id}
                onClick={() => toggleDiet(d.id)}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '6px 14px',
                  borderRadius: 2,
                  border: `1px solid ${diets.has(d.id) ? S.gold : 'rgba(28,43,34,.2)'}`,
                  background: diets.has(d.id) ? S.gold : 'transparent',
                  color: diets.has(d.id) ? S.forest : 'rgba(28,43,34,.6)',
                  transition: 'all .15s',
                }}
              >
                {d.label}
              </button>
            ))}
            {(diets.size > 0 || q) && (
              <button
                onClick={() => { setDiets(new Set()); setQ(''); setCat('tout'); }}
                style={{ fontSize: 12, color: S.terra, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Effacer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* plats */}
      <div className="carte-body" style={{ padding: '44px 56px 80px' }}>
        {visibleSections.map((s) => (
          <Reveal as="section" key={s.id} y={20} style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <h2 style={{ fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>
                {s.head}
              </h2>
              <div style={{ flex: 1, height: 1, background: `rgba(28,43,34,.12)` }} />
              <span style={{ fontSize: 12, color: 'rgba(28,43,34,.5)', fontWeight: 600 }}>
                {s.items.length} plat{s.items.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="carte-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 56px' }}>
              {s.items.map((m) => (
                <div
                  key={m.n}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 12,
                    padding: '14px 0',
                    borderBottom: `1px solid ${S.border}`,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 18, fontWeight: 500 }}>{m.n}</span>
                      {m.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: 9.5,
                            fontWeight: 700,
                            letterSpacing: '.08em',
                            textTransform: 'uppercase',
                            color: TAGMETA[t].c,
                            border: `1px solid ${TAGMETA[t].c}`,
                            borderRadius: 2,
                            padding: '2px 6px',
                          }}
                        >
                          {TAGMETA[t].label}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: 13.5, color: 'rgba(28,43,34,.6)', marginTop: 4 }}>{m.d}</div>
                  </div>
                  <span
                    style={{ fontSize: 18, fontWeight: 600, color: S.terra, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {m.p}€
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        ))}

        {/* vins */}
        {showVins && winesMatch && diets.size === 0 && (
          <Reveal
            as="section"
            className="carte-wines"
            y={28}
            style={{
              background: S.deep,
              color: S.cream,
              padding: '40px 44px 36px',
              borderRadius: 4,
            }}
          >
            <div style={kicker(S.gold)}>La cave vivante</div>
            <h2 style={{ fontSize: 28, fontWeight: 500, margin: '10px 0 24px', letterSpacing: '-0.02em' }}>
              60+ références nature
            </h2>
            <div className="carte-wines-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 48px' }}>
              {WINES.map((w) => (
                <div
                  key={w.n}
                  style={{
                    padding: '14px 0',
                    borderBottom: '1px solid rgba(239,231,214,.12)',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 500 }}>{w.n}</div>
                    <div style={{ fontSize: 13, color: S.muted, marginTop: 3 }}>{w.d}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ fontSize: 17, color: S.gold }}>{w.g}€</span>
                    <span style={{ fontSize: 12, color: 'rgba(239,231,214,.4)', margin: '0 5px' }}>/</span>
                    <span style={{ fontSize: 17 }}>{w.b}€</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {total === 0 && cat !== 'vins' && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(28,43,34,.5)' }}>
            <p style={{ fontSize: 18, fontWeight: 500, color: S.forest }}>Rien à cette table.</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Aucun plat ne correspond à ces filtres.</p>
            <button
              onClick={() => { setDiets(new Set()); setQ(''); setCat('tout'); }}
              style={{
                marginTop: 18,
                fontSize: 14,
                fontWeight: 600,
                color: S.forest,
                background: S.gold,
                border: 'none',
                borderRadius: 2,
                padding: '10px 24px',
                cursor: 'pointer',
              }}
            >
              Tout afficher
            </button>
          </div>
        )}
      </div>

      {/* CTA */}
      <Reveal
        className="carte-cta"
        y={32}
        style={{
          background: S.forest,
          color: S.cream,
          padding: '64px 56px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 32,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={kicker(S.gold)}>Le soir vous attend</div>
          <div className="carte-cta-title" style={{ fontSize: 44, fontWeight: 500, letterSpacing: '-0.025em', marginTop: 12 }}>
            Cette carte vous inspire&nbsp;?
          </div>
        </div>
        <button
          onClick={() => router.push('/reservation')}
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: S.forest,
            background: S.gold,
            padding: '18px 40px',
            borderRadius: 2,
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Réserver maintenant →
        </button>
      </Reveal>
    </div>
  );
}
