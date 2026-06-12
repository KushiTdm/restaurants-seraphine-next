'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { S } from '@/lib/tokens';
import {
  readOrders,
  writeOrders,
  updateStatus,
  nextStatus,
  STATUS_LABEL,
  STATUS_COLOR,
  type CCOrder,
} from '@/lib/cc-orders';
import { ITEMS, CATS } from '@/lib/menu-items';
import {
  readDeals,
  setDeal,
  removeDeal,
  clearDeals,
  dealPrice,
  euro,
  DEAL_LABELS,
  DEAL_PERCENTS,
} from '@/lib/deals';
import type { Deal } from '@/lib/deals';

const selectCss: React.CSSProperties = {
  fontFamily: S.font,
  fontSize: 14,
  padding: '9px 12px',
  border: '1.5px solid rgba(28,43,34,.2)',
  borderRadius: 2,
  background: '#fff',
  color: S.forest,
  cursor: 'pointer',
  outline: 'none',
};

const kicker = (c: string): React.CSSProperties => ({
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '.28em',
  textTransform: 'uppercase',
  color: c,
});

const ago = (t: number) => {
  const m = Math.floor((Date.now() - t) / 60000);
  return m < 1 ? "à l'instant" : `il y a ${m} min`;
};

type Filter = 'actives' | 'retirees';

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState<CCOrder[]>([]);
  const [filter, setFilter] = useState<Filter>('actives');
  const [mounted, setMounted] = useState(false);
  const [section, setSection] = useState<'commandes' | 'promos'>('commandes');
  const [deals, setDeals] = useState<Record<number, Deal>>({});
  const [brushLabel, setBrushLabel] = useState(DEAL_LABELS[0]);
  const [brushPercent, setBrushPercent] = useState(DEAL_PERCENTS[1]);

  // Reçoit les commandes du parcours client en temps réel (polling localStorage).
  useEffect(() => {
    setMounted(true);
    const refresh = () => {
      setOrders(readOrders());
      setDeals(readDeals());
    };
    refresh();
    const t = setInterval(refresh, 2500);
    return () => clearInterval(t);
  }, []);

  const advance = (o: CCOrder) => {
    const nx = nextStatus(o.status);
    if (nx) {
      updateStatus(o.id, nx);
      setOrders(readOrders());
    }
  };

  const clearAll = () => {
    writeOrders([]);
    setOrders([]);
  };

  const applyDeal = (id: number) => {
    setDeal(id, { label: brushLabel, percent: brushPercent });
    setDeals(readDeals());
  };
  const dropDeal = (id: number) => {
    removeDeal(id);
    setDeals(readDeals());
  };
  const dropAllDeals = () => {
    clearDeals();
    setDeals({});
  };

  const actives = orders.filter((o) => o.status !== 'retiree').sort((a, b) => a.createdAt - b.createdAt);
  const retirees = orders.filter((o) => o.status === 'retiree').sort((a, b) => b.createdAt - a.createdAt);
  const shown = filter === 'actives' ? actives : retirees;

  const counts = {
    recue: orders.filter((o) => o.status === 'recue').length,
    preparation: orders.filter((o) => o.status === 'preparation').length,
    prete: orders.filter((o) => o.status === 'prete').length,
  };

  return (
    <div style={{ fontFamily: S.font, background: S.cream, color: S.forest, minHeight: '100vh' }}>
      {/* header */}
      <div style={{ background: S.forest, color: S.cream, padding: '32px 32px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={kicker(S.gold)}>Espace équipe · cuisine</div>
              <h1 style={{ fontSize: 'clamp(30px,4vw,44px)', fontWeight: 500, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>
                {section === 'commandes' ? 'Commandes — Click & collect' : 'Promotions & invendus'}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 12, color: S.muted, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#65d27e', display: 'inline-block' }} />
                temps réel
              </span>
              <Link href="/commande" style={{ fontSize: 12, color: S.muted, textDecoration: 'none' }}>← Côté client</Link>
            </div>
          </div>

          {/* section nav */}
          <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
            {([['commandes', 'Commandes'], ['promos', 'Promotions / Invendus']] as ['commandes' | 'promos', string][]).map(
              ([id, label]) => (
                <button
                  key={id}
                  onClick={() => setSection(id)}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    padding: '9px 18px',
                    borderRadius: 2,
                    cursor: 'pointer',
                    border: `1.5px solid ${section === id ? S.gold : 'rgba(239,231,214,.3)'}`,
                    background: section === id ? S.gold : 'transparent',
                    color: section === id ? S.forest : S.cream,
                    transition: 'all .14s',
                  }}
                >
                  {label}
                </button>
              )
            )}
          </div>

          {/* stats */}
          {section === 'commandes' && (
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              {([
                ['Reçues', counts.recue, STATUS_COLOR.recue],
                ['En préparation', counts.preparation, STATUS_COLOR.preparation],
                ['Prêtes', counts.prete, STATUS_COLOR.prete],
              ] as [string, number, string][]).map(([label, n, c]) => (
                <div key={label} style={{ background: 'rgba(28,43,34,.5)', border: '1px solid rgba(200,162,75,.18)', borderRadius: 4, padding: '12px 18px', minWidth: 120 }}>
                  <div style={{ fontSize: 11, color: S.muted, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: c }}>{n}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {section === 'commandes' && (
        <>
      {/* toolbar */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {([['actives', `À traiter (${actives.length})`], ['retirees', `Retirées (${retirees.length})`]] as [Filter, string][]).map(
            ([id, label]) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '9px 18px',
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: `1.5px solid ${filter === id ? S.forest : 'rgba(28,43,34,.2)'}`,
                  background: filter === id ? S.forest : 'transparent',
                  color: filter === id ? S.cream : S.forest,
                  transition: 'all .14s',
                }}
              >
                {label}
              </button>
            )
          )}
        </div>
        <button
          onClick={clearAll}
          style={{ fontSize: 12, fontWeight: 600, padding: '8px 14px', borderRadius: 2, cursor: 'pointer', border: '1px solid rgba(181,85,47,.4)', background: 'transparent', color: S.terra }}
        >
          Vider (démo)
        </button>
      </div>

      {/* board */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 32px 80px' }}>
        {!mounted ? null : shown.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', color: 'rgba(28,43,34,.55)' }}>
            <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 6 }}>
              {filter === 'actives' ? 'Aucune commande à traiter.' : 'Aucune commande retirée.'}
            </div>
            <div style={{ fontSize: 14 }}>
              Passez une commande depuis{' '}
              <Link href="/commande" style={{ color: S.terra }}>la page commande</Link>{' '}
              pour la voir arriver ici en direct.
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {shown.map((o) => {
              const nx = nextStatus(o.status);
              return (
                <div key={o.id} style={{ background: '#fff', border: `1px solid ${S.border}`, borderRadius: 6, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: 4, background: STATUS_COLOR[o.status] }} />
                  <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* head */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 11, color: 'rgba(28,43,34,.5)', fontWeight: 600 }}>RÉF. {o.id}</div>
                        <div style={{ fontSize: 26, fontWeight: 700, color: S.forest, letterSpacing: '.06em', lineHeight: 1.1 }}>
                          {o.mode === 'a_emporter' ? `#${o.code}` : o.name}
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: `${STATUS_COLOR[o.status]}1f`, color: STATUS_COLOR[o.status] }}>
                        {STATUS_LABEL[o.status]}
                      </span>
                    </div>

                    {/* meta */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: o.mode === 'a_emporter' ? 'rgba(200,162,75,.18)' : 'rgba(28,43,34,.08)', color: o.mode === 'a_emporter' ? '#9a7a00' : S.forest }}>
                        {o.mode === 'a_emporter' ? 'Click & collect' : 'Sur place'}
                      </span>
                      {o.slot && <span style={{ fontSize: 12.5, color: 'rgba(28,43,34,.65)' }}>Retrait : <strong>{o.slot}</strong></span>}
                      <span style={{ fontSize: 12, color: 'rgba(28,43,34,.45)', marginLeft: 'auto' }}>{ago(o.createdAt)}</span>
                    </div>

                    {o.mode === 'a_emporter' && (
                      <div style={{ fontSize: 12.5, color: 'rgba(28,43,34,.6)', marginBottom: 10 }}>Au nom de {o.name}</div>
                    )}

                    {/* items */}
                    <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 10, marginBottom: 12 }}>
                      {o.items.map((it, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 13.5 }}>
                          <span>
                            <strong style={{ color: S.terra }}>{it.qty}×</strong> {it.n}
                          </span>
                          <span style={{ color: 'rgba(28,43,34,.6)' }}>{it.p * it.qty}€</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontWeight: 700, fontSize: 14 }}>
                        <span>Total</span>
                        <span style={{ color: S.terra }}>{o.total}€</span>
                      </div>
                    </div>

                    {/* action */}
                    <div style={{ marginTop: 'auto' }}>
                      {nx ? (
                        <button
                          onClick={() => advance(o)}
                          style={{ width: '100%', padding: '12px', borderRadius: 2, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#fff', background: STATUS_COLOR[nx], letterSpacing: '.02em' }}
                        >
                          {nx === 'retiree' ? 'Marquer retirée ✓' : `→ ${STATUS_LABEL[nx]}`}
                        </button>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '12px', fontSize: 13, color: 'rgba(28,43,34,.4)', fontWeight: 600 }}>
                          Commande retirée ✓
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
        </>
      )}

      {/* === PROMOTIONS / INVENDUS === */}
      {section === 'promos' && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 32px 80px' }}>
          {/* brush */}
          <div style={{ background: '#fff', border: `1px solid ${S.border}`, borderRadius: 6, padding: '18px 20px', marginBottom: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
              <div style={{ maxWidth: 470 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: S.forest }}>Remises anti-gaspillage</div>
                <p style={{ fontSize: 13, color: 'rgba(28,43,34,.6)', margin: '4px 0 0', lineHeight: 1.5 }}>
                  Choisissez le motif et la remise, puis appliquez-la d&apos;un clic aux produits concernés.
                  Les prix se mettent à jour <strong>en direct</strong> sur la carte client.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <label>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(28,43,34,.5)', marginBottom: 5 }}>Motif</div>
                  <select value={brushLabel} onChange={(e) => setBrushLabel(e.target.value)} style={selectCss}>
                    {DEAL_LABELS.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(28,43,34,.5)', marginBottom: 5 }}>Remise</div>
                  <select value={brushPercent} onChange={(e) => setBrushPercent(Number(e.target.value))} style={selectCss}>
                    {DEAL_PERCENTS.map((p) => (
                      <option key={p} value={p}>−{p}%</option>
                    ))}
                  </select>
                </label>
                <button onClick={dropAllDeals} style={{ fontSize: 12, fontWeight: 600, padding: '10px 14px', borderRadius: 2, cursor: 'pointer', border: '1px solid rgba(181,85,47,.4)', background: 'transparent', color: S.terra }}>
                  Tout retirer
                </button>
              </div>
            </div>
            {mounted && Object.keys(deals).length > 0 && (
              <div style={{ marginTop: 12, fontSize: 12.5, color: '#2e7d32', fontWeight: 600 }}>
                {Object.keys(deals).length} produit(s) en promotion actuellement.
              </div>
            )}
          </div>

          {/* produits par catégorie */}
          {CATS.map((cat) => (
            <div key={cat.id} style={{ marginBottom: 26 }}>
              <div style={{ ...kicker('rgba(28,43,34,.5)'), marginBottom: 12 }}>{cat.label}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                {ITEMS.filter((it) => it.cat === cat.id).map((it) => {
                  const deal = deals[it.id];
                  return (
                    <div key={it.id} style={{ background: '#fff', border: `1px solid ${deal ? S.terra : S.border}`, borderRadius: 6, padding: '14px 16px' }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: S.forest, marginBottom: 8 }}>{it.n}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                        <div>
                          {deal ? (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                              <span style={{ fontSize: 13, color: 'rgba(28,43,34,.4)', textDecoration: 'line-through' }}>{euro(it.p)}</span>
                              <span style={{ fontSize: 18, fontWeight: 700, color: S.terra }}>{euro(dealPrice(it.p, deal))}</span>
                            </div>
                          ) : (
                            <span style={{ fontSize: 18, fontWeight: 700, color: S.forest }}>{euro(it.p)}</span>
                          )}
                          {deal && (
                            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: S.terra, marginTop: 4 }}>
                              {deal.label} · −{deal.percent}%
                            </div>
                          )}
                        </div>
                        {deal ? (
                          <button onClick={() => dropDeal(it.id)} style={{ fontSize: 12.5, fontWeight: 600, padding: '8px 12px', borderRadius: 2, cursor: 'pointer', border: '1px solid rgba(28,43,34,.2)', background: 'transparent', color: S.forest, whiteSpace: 'nowrap' }}>
                            Retirer
                          </button>
                        ) : (
                          <button onClick={() => applyDeal(it.id)} style={{ fontSize: 12.5, fontWeight: 700, padding: '8px 14px', borderRadius: 2, cursor: 'pointer', border: 'none', background: S.terra, color: '#fff', whiteSpace: 'nowrap' }}>
                            −{brushPercent}%
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
