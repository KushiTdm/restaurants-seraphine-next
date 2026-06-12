'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { S } from '@/lib/tokens';
import { addOrder, readOrders, STATUS_FLOW, STATUS_LABEL } from '@/lib/cc-orders';
import type { CCOrder, OrderStatus } from '@/lib/cc-orders';
import { ITEMS, CATS } from '@/lib/menu-items';
import type { Cat, Item } from '@/lib/menu-items';
import { readDeals, dealPrice, euro } from '@/lib/deals';
import type { Deal } from '@/lib/deals';

const PICKUP_SLOTS = ['Dès que possible', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00'];

const kicker = (c: string): React.CSSProperties => ({
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '.28em',
  textTransform: 'uppercase',
  color: c,
});

type Mode = 'sur_place' | 'a_emporter';

const payInput: React.CSSProperties = {
  width: '100%',
  fontFamily: S.font,
  fontSize: 15,
  padding: '11px 14px',
  border: '1.5px solid rgba(28,43,34,.2)',
  borderRadius: 2,
  outline: 'none',
  background: '#fff',
  color: S.forest,
  boxSizing: 'border-box',
};
const payLabel: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: '.1em',
  textTransform: 'uppercase',
  color: 'rgba(28,43,34,.5)',
  marginBottom: 6,
};
const cardBadge: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  color: '#fff',
  padding: '3px 6px',
  borderRadius: 3,
  letterSpacing: '.05em',
};

export default function CommandePage() {
  const [panier, setPanier] = useState<Record<number, number>>({});
  const [mode, setMode] = useState<Mode>('a_emporter');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [activeCat, setActiveCat] = useState<Cat>('plats');
  const [paying, setPaying] = useState(false);
  const [promo, setPromo] = useState('');
  const [promoOk, setPromoOk] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [card, setCard] = useState({ name: '', num: '', exp: '', cvc: '' });
  const [processing, setProcessing] = useState(false);
  const [slot, setSlot] = useState('');
  const [liveOrder, setLiveOrder] = useState<CCOrder | null>(null);
  const [liveStatus, setLiveStatus] = useState<OrderStatus>('recue');
  const [deals, setDeals] = useState<Record<number, Deal>>({});

  // Remises posées par le restaurateur dans /admin → répercutées en direct sur la carte.
  useEffect(() => {
    const sync = () => setDeals(readDeals());
    sync();
    const t = setInterval(sync, 3500);
    return () => clearInterval(t);
  }, []);

  // Suivi en direct : si l'équipe fait avancer la commande dans /admin, le client le voit.
  useEffect(() => {
    if (!done || !liveOrder) return;
    const tick = () => {
      const o = readOrders().find((x) => x.id === liveOrder.id);
      if (o) setLiveStatus(o.status);
    };
    tick();
    const t = setInterval(tick, 2500);
    return () => clearInterval(t);
  }, [done, liveOrder]);

  const add = (id: number) => setPanier((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const remove = (id: number) =>
    setPanier((p) => {
      const n = { ...p };
      if ((n[id] || 0) > 1) n[id]--;
      else delete n[id];
      return n;
    });

  const priceOf = (item: Item) => dealPrice(item.p, deals[item.id]);
  const total = Object.entries(panier).reduce((acc, [id, qty]) => {
    const item = ITEMS.find((i) => i.id === Number(id));
    return acc + (item ? priceOf(item) * qty : 0);
  }, 0);

  const count = Object.values(panier).reduce((a, b) => a + b, 0);
  const panierItems = Object.entries(panier)
    .map(([id, qty]) => ({ item: ITEMS.find((i) => i.id === Number(id))!, qty }))
    .filter((x) => x.item);

  const discount = promoOk ? Math.round(total * 0.1) : 0;
  const toPay = total - discount;

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (code === 'SERAPHINE10' || code === 'BIENVENUE10') {
      setPromoOk(true);
      setPromoError('');
    } else {
      setPromoOk(false);
      setPromoError('Code non reconnu');
    }
  };

  const fmtCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExp = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };
  const cardValid =
    !!card.name.trim() &&
    card.num.replace(/\s/g, '').length === 16 &&
    /^\d{2}\/\d{2}$/.test(card.exp) &&
    card.cvc.length >= 3;

  const slotOk = mode !== 'a_emporter' || !!slot;
  const payReady = cardValid && slotOk;

  const pay = () => {
    if (!payReady) return;
    setProcessing(true);
    setTimeout(() => {
      const order: CCOrder = {
        id: 'SER-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
        code: String(Math.floor(1000 + Math.random() * 9000)),
        name: card.name.trim() || 'Client',
        mode,
        slot: mode === 'a_emporter' ? slot : null,
        items: panierItems.map(({ item, qty }) => ({ n: item.n, qty, p: priceOf(item) })),
        total: toPay,
        status: 'recue',
        createdAt: Date.now(),
      };
      addOrder(order);
      setLiveOrder(order);
      setProcessing(false);
      setDone(true);
    }, 1400);
  };

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
            {liveOrder?.mode === 'a_emporter'
              ? 'Click & collect — suivez votre commande ci-dessous, vous êtes prévenu dès qu’elle est prête au comptoir.'
              : 'Votre commande part en cuisine, elle vous sera apportée à table.'}
          </p>

          {/* click & collect — code + créneau de retrait */}
          {liveOrder?.mode === 'a_emporter' && (
            <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
              <div style={{ flex: 1, background: S.gold, color: S.forest, borderRadius: 4, padding: '16px 18px', textAlign: 'left' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', opacity: 0.75 }}>Code de retrait</div>
                <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '.1em', lineHeight: 1.1 }}>{liveOrder.code}</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(28,43,34,.6)', border: '1px solid rgba(200,162,75,.2)', borderRadius: 4, padding: '16px 18px', textAlign: 'left' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: S.muted }}>Créneau</div>
                <div style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>{liveOrder.slot}</div>
                <div style={{ fontSize: 11.5, color: S.muted, marginTop: 2 }}>9 rue Saint-Maur</div>
              </div>
            </div>
          )}

          {/* suivi en direct */}
          {liveOrder && (
            <div style={{ background: 'rgba(28,43,34,.6)', border: '1px solid rgba(200,162,75,.2)', borderRadius: 4, padding: '20px 22px', marginTop: 18, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={kicker(S.gold)}>Suivi en direct</div>
                <span style={{ fontSize: 11, color: S.muted }}>● mise à jour automatique</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                {STATUS_FLOW.map((st, i) => {
                  const idx = STATUS_FLOW.indexOf(liveStatus);
                  const reached = i <= idx;
                  const labels = ['Reçue', 'En préparation', liveOrder.mode === 'a_emporter' ? 'Prête' : 'Servie', 'Terminée'];
                  return (
                    <React.Fragment key={st}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', width: 64 }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: reached ? S.gold : 'transparent', color: reached ? S.forest : S.muted, border: `1.5px solid ${reached ? S.gold : 'rgba(239,231,214,.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                          {reached ? '✓' : i + 1}
                        </div>
                        <div style={{ fontSize: 10.5, marginTop: 6, textAlign: 'center', color: reached ? S.cream : S.muted, lineHeight: 1.2 }}>{labels[i]}</div>
                      </div>
                      {i < STATUS_FLOW.length - 1 && (
                        <div style={{ flex: 1, height: 1.5, background: i < idx ? S.gold : 'rgba(239,231,214,.2)', marginTop: 13 }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              {liveStatus === 'prete' && (
                <div style={{ marginTop: 16, background: 'rgba(46,125,50,.18)', border: '1px solid rgba(46,125,50,.4)', borderRadius: 3, padding: '10px 14px', fontSize: 13.5, color: '#a8e0ab', fontWeight: 600 }}>
                  ✓ Votre commande vous attend{liveOrder.mode === 'a_emporter' ? ` au comptoir — code ${liveOrder.code}` : ''}.
                </div>
              )}
            </div>
          )}
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
            {(liveOrder?.items ?? []).map((it, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(239,231,214,.08)',
                  fontSize: 15,
                }}
              >
                <span>
                  {it.qty > 1 && (
                    <span style={{ color: S.gold, marginRight: 6 }}>{it.qty}×</span>
                  )}
                  {it.n}
                </span>
                <span style={{ color: S.gold }}>{euro(it.p * it.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(239,231,214,.12)', marginTop: 10, paddingTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontWeight: 600, fontSize: 16 }}>
                <span>Payé par carte</span>
                <span style={{ color: S.gold }}>{euro(liveOrder?.total ?? 0)}</span>
              </div>
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
          <Link
            href="/admin"
            style={{ display: 'inline-block', marginTop: 16, fontSize: 12, color: S.gold, textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            Démo équipe — tableau des commandes →
          </Link>
        </div>
      </div>
    );
  }

  if (paying) {
    return (
      <div style={{ fontFamily: S.font, background: S.cream, color: S.forest, minHeight: '100vh' }}>
        <div style={{ background: S.forest, color: S.cream, padding: '32px 24px 28px' }}>
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <button
              onClick={() => setPaying(false)}
              style={{ background: 'transparent', border: 'none', color: S.muted, cursor: 'pointer', fontSize: 13, padding: 0, marginBottom: 14 }}
            >
              ← Retour au panier
            </button>
            <div style={kicker(S.gold)}>Paiement sécurisé</div>
            <h1 style={{ fontSize: 'clamp(30px,5vw,44px)', fontWeight: 500, letterSpacing: '-0.025em', lineHeight: 1, margin: '8px 0 0' }}>
              Finaliser la commande
            </h1>
          </div>
        </div>

        <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 24px 90px' }}>
          {/* recap */}
          <div style={{ background: '#fff', border: `1px solid ${S.border}`, borderRadius: 4, padding: '20px 22px' }}>
            <div style={{ ...kicker('rgba(28,43,34,.5)'), marginBottom: 12 }}>
              Votre commande · {mode === 'a_emporter' ? 'À emporter' : 'Sur place'}
            </div>
            {panierItems.map(({ item, qty }) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: 14.5 }}>
                <span>
                  {qty > 1 && <span style={{ color: S.terra, marginRight: 6 }}>{qty}×</span>}
                  {item.n}
                </span>
                <span style={{ fontWeight: 600 }}>{euro(priceOf(item) * qty)}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${S.border}`, marginTop: 8, paddingTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'rgba(28,43,34,.65)', padding: '2px 0' }}>
                <span>Sous-total</span>
                <span>{euro(total)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: S.terra, padding: '2px 0' }}>
                  <span>Réduction (-10%)</span>
                  <span>−{euro(discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, marginTop: 6 }}>
                <span>Total</span>
                <span style={{ color: S.terra }}>{euro(toPay)}</span>
              </div>
            </div>
          </div>

          {/* créneau de retrait (click & collect) */}
          {mode === 'a_emporter' && (
            <div style={{ marginTop: 18 }}>
              <div style={{ ...kicker('rgba(28,43,34,.5)'), marginBottom: 8 }}>Créneau de retrait</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PICKUP_SLOTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    style={{
                      padding: '9px 14px',
                      fontSize: 13,
                      fontWeight: 600,
                      borderRadius: 2,
                      cursor: 'pointer',
                      border: `1.5px solid ${slot === s ? S.terra : 'rgba(28,43,34,.2)'}`,
                      background: slot === s ? S.terra : '#fff',
                      color: slot === s ? '#fff' : S.forest,
                      transition: 'all .14s',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(28,43,34,.5)', marginTop: 8 }}>
                Retrait au comptoir · 9 rue Saint-Maur, 75011
              </div>
            </div>
          )}

          {/* promo */}
          <div style={{ marginTop: 18 }}>
            <div style={{ ...kicker('rgba(28,43,34,.5)'), marginBottom: 8 }}>Code promo</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={promo}
                onChange={(e) => { setPromo(e.target.value); setPromoError(''); }}
                placeholder="Ex. SERAPHINE10"
                style={{ flex: 1, fontFamily: S.font, fontSize: 14, padding: '11px 14px', border: `1.5px solid ${promoError ? S.terra : 'rgba(28,43,34,.2)'}`, borderRadius: 2, outline: 'none', background: '#fff', color: S.forest, boxSizing: 'border-box' }}
              />
              <button
                onClick={applyPromo}
                style={{ padding: '0 20px', background: S.forest, color: S.cream, border: 'none', borderRadius: 2, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                Appliquer
              </button>
            </div>
            {promoOk && <div style={{ fontSize: 12.5, color: '#2e7d32', marginTop: 6 }}>✓ Code appliqué — 10% de réduction</div>}
            {promoError && <div style={{ fontSize: 12.5, color: S.terra, marginTop: 6 }}>{promoError}</div>}
          </div>

          {/* card */}
          <div style={{ marginTop: 24, background: '#fff', border: `1px solid ${S.border}`, borderRadius: 4, padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={kicker('rgba(28,43,34,.5)')}>Carte bancaire</div>
              <div style={{ display: 'flex', gap: 5 }}>
                <span style={{ ...cardBadge, background: '#1a1f71' }}>VISA</span>
                <span style={{ ...cardBadge, background: '#eb001b' }}>MC</span>
              </div>
            </div>
            <label style={{ display: 'block', marginBottom: 12 }}>
              <div style={payLabel}>Titulaire</div>
              <input value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} placeholder="Prénom Nom" style={payInput} />
            </label>
            <label style={{ display: 'block', marginBottom: 12 }}>
              <div style={payLabel}>Numéro de carte</div>
              <input value={card.num} onChange={(e) => setCard((c) => ({ ...c, num: fmtCard(e.target.value) }))} placeholder="4242 4242 4242 4242" inputMode="numeric" style={payInput} />
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              <label style={{ display: 'block', flex: 1 }}>
                <div style={payLabel}>Expiration</div>
                <input value={card.exp} onChange={(e) => setCard((c) => ({ ...c, exp: fmtExp(e.target.value) }))} placeholder="MM/AA" inputMode="numeric" style={payInput} />
              </label>
              <label style={{ display: 'block', flex: 1 }}>
                <div style={payLabel}>CVC</div>
                <input value={card.cvc} onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) }))} placeholder="123" inputMode="numeric" style={payInput} />
              </label>
            </div>
          </div>

          <button
            onClick={pay}
            disabled={!payReady || processing}
            style={{ width: '100%', marginTop: 20, padding: '16px', background: payReady ? S.terra : 'rgba(28,43,34,.25)', color: '#fff', border: 'none', borderRadius: 2, cursor: payReady && !processing ? 'pointer' : 'not-allowed', fontSize: 16, fontWeight: 700, letterSpacing: '.02em', transition: 'all .15s' }}
          >
            {processing
              ? 'Paiement en cours…'
              : mode === 'a_emporter' && !slot
              ? 'Choisissez un créneau de retrait'
              : `Payer ${euro(toPay)}`}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14, fontSize: 12, color: 'rgba(28,43,34,.5)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Paiement sécurisé — propulsé par <strong style={{ color: '#635bff' }}>Stripe</strong>
          </div>
          <p style={{ textAlign: 'center', fontSize: 11.5, color: 'rgba(28,43,34,.4)', marginTop: 10 }}>
            Démo — carte de test 4242 4242 4242 4242, date future, CVC libre
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
            margin: '10px 0 12px',
          }}
        >
          La carte du soir
        </h1>
        <p style={{ fontSize: 14, color: S.muted, margin: '0 0 24px', maxWidth: 460, lineHeight: 1.5 }}>
          Commandez et payez en ligne — <strong style={{ color: S.gold }}>click &amp; collect</strong> à emporter, ou service sur place.
        </p>

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
          const deal = deals[item.id];
          const eff = priceOf(item);
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
                <div style={{ fontSize: 17, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {item.n}
                  {deal && (
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#fff', background: S.terra, padding: '2px 7px', borderRadius: 99 }}>
                      {deal.label} −{deal.percent}%
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13.5, color: 'rgba(28,43,34,.6)', marginTop: 3 }}>
                  {item.d}
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 44 }}>
                {deal ? (
                  <>
                    <div style={{ fontSize: 12, color: 'rgba(28,43,34,.4)', textDecoration: 'line-through' }}>{euro(item.p)}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: S.terra }}>{euro(eff)}</div>
                  </>
                ) : (
                  <div style={{ fontSize: 16, fontWeight: 600, color: S.terra }}>{euro(item.p)}</div>
                )}
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
                Mon panier · {euro(total)} {drawerOpen ? '▲' : '▼'}
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
                    <span style={{ color: S.gold }}>{euro(priceOf(item) * qty)}</span>
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
                  <span style={{ color: S.gold }}>{euro(total)}</span>
                </div>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    setPaying(true);
                  }}
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
                  Passer au paiement — {euro(total)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
