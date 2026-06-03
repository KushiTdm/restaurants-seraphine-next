'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Photo from '@/components/Photo';
import { S } from '@/lib/tokens';
import { PHOTOS } from '@/lib/photos';
import { Reveal } from '@/components/Anim';

const STEPS = ['Couverts', 'Date & service', 'Heure', 'Vos coordonnées'];

const fmtDay = (d: Date) =>
  new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(d).replace('.', '');
const fmtFull = (d: Date) =>
  new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);

const SLOTS: Record<string, [string, boolean?][]> = {
  midi: [['12:00'], ['12:15'], ['12:30', true], ['12:45'], ['13:00'], ['13:15'], ['13:30'], ['13:45'], ['14:00']],
  soir: [['19:00'], ['19:15'], ['19:30'], ['19:45', true], ['20:00'], ['20:15'], ['20:30'], ['21:00'], ['21:30'], ['22:00']],
};

const DAYS = (() => {
  const t = new Date(2026, 5, 2);
  const out: { d: Date; closed: boolean }[] = [];
  for (let i = 0; i < 18; i++) {
    const d = new Date(t);
    d.setDate(t.getDate() + i);
    const dow = d.getDay();
    out.push({ d, closed: dow === 0 || dow === 1 });
  }
  return out;
})();

type Reservation = {
  party: number;
  dateIdx: number | null;
  service: string | null;
  time: string | null;
  first: string;
  last: string;
  phone: string;
  email: string;
  occasion: string;
  notes: string;
};

const inputCss = (error?: string): React.CSSProperties => ({
  width: '100%',
  fontFamily: S.font,
  fontSize: 15,
  padding: '12px 16px',
  border: `1.5px solid ${error ? S.terra : 'rgba(28,43,34,.25)'}`,
  borderRadius: 2,
  outline: 'none',
  background: 'rgba(255,255,255,.9)',
  color: S.forest,
  boxSizing: 'border-box',
});

const kicker = (c: string): React.CSSProperties => ({
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '.28em',
  textTransform: 'uppercase',
  color: c,
});

export default function ReservationPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [r, setR] = useState<Reservation>({
    party: 2, dateIdx: null, service: null, time: null,
    first: '', last: '', phone: '', email: '', occasion: 'Aucune', notes: '',
  });
  const [touched, setTouched] = useState(false);
  const [ref] = useState(() => 'SER-' + Math.random().toString(36).slice(2, 6).toUpperCase());
  const [done, setDone] = useState(false);

  useEffect(() => {
    try { window.scrollTo({ top: 0 }); } catch {}
  }, [step, done]);

  const set = (patch: Partial<Reservation>) => setR((x) => ({ ...x, ...patch }));

  const errs = {
    first: !r.first.trim() ? 'requis' : '',
    last: !r.last.trim() ? 'requis' : '',
    phone: !r.phone.trim() ? 'requis' : !/^[0-9 +.()-]{8,}$/.test(r.phone.trim()) ? 'numéro invalide' : '',
    email: !r.email.trim() ? 'requis' : !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.email.trim()) ? 'email invalide' : '',
  };

  const canProceed = [!!r.party, r.dateIdx !== null && !!r.service, !!r.time, !errs.first && !errs.last && !errs.phone && !errs.email][step];

  const next = () => {
    if (step === 3) { if (!canProceed) { setTouched(true); return; } setDone(true); return; }
    if (!canProceed) { setTouched(true); return; }
    setTouched(false);
    setStep((s) => s + 1);
  };

  const back = () => {
    if (step === 0) router.push('/');
    else { setTouched(false); setStep((s) => s - 1); }
  };

  const recap = [
    { k: 'Couverts', v: r.party ? (r.party === 9 ? '9 et +' : r.party + (r.party > 1 ? ' personnes' : ' personne')) : null },
    { k: 'Date', v: r.dateIdx !== null ? fmtFull(DAYS[r.dateIdx].d) : null },
    { k: 'Service', v: r.service ? (r.service === 'midi' ? 'Le midi' : 'Le soir') : null },
    { k: 'Heure', v: r.time },
  ];

  const btnGold: React.CSSProperties = {
    fontSize: 14, fontWeight: 600, color: S.forest, background: S.gold,
    padding: '13px 28px', borderRadius: 2, border: 'none', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 8,
  };

  const btnOutline: React.CSSProperties = {
    fontSize: 14, fontWeight: 600, color: S.cream,
    background: 'transparent', padding: '13px 24px', borderRadius: 2,
    border: 'none', cursor: 'pointer', boxShadow: 'inset 0 0 0 1.5px rgba(239,231,214,.3)',
    display: 'inline-flex', alignItems: 'center', gap: 8,
  };

  if (done) {
    return (
      <div style={{ fontFamily: S.font, background: S.deep, color: S.cream, minHeight: '100vh' }}>
        <Reveal
          className="resa-confirm"
          stagger={0.1}
          staggerSelector=":scope > *"
          y={24}
          start="top 95%"
          style={{ maxWidth: 640, margin: '0 auto', padding: '64px 32px 90px', textAlign: 'center' }}
        >
          <div style={{ width: 64, height: 64, borderRadius: 999, background: S.gold, color: S.forest, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 28, fontWeight: 700 }}>
            ✓
          </div>
          <div style={{ marginTop: 24, ...kicker(S.gold) }}>Réservation confirmée</div>
          <h1 style={{ fontSize: 'clamp(36px,5vw,54px)', fontWeight: 500, letterSpacing: '-0.025em', margin: '12px 0 0' }}>
            À ce soir, {r.first || 'cher convive'}.
          </h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: S.muted, maxWidth: 440, margin: '14px auto 0' }}>
            Un e-mail de confirmation part à l&apos;instant. La maison vous attend.
          </p>

          <div style={{ background: 'rgba(28,43,34,.6)', border: '1px solid rgba(200,162,75,.25)', borderRadius: 4, textAlign: 'left', marginTop: 36, padding: '28px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid rgba(239,231,214,.12)', paddingBottom: 14, marginBottom: 16 }}>
              <span style={{ fontSize: 22, fontWeight: 500 }}>Séraphine</span>
              <span style={{ ...kicker(S.gold), fontSize: 11 }}>RÉF. {ref}</span>
            </div>
            <div className="resa-confirm-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
              {[
                ['Au nom de', `${r.first} ${r.last}`],
                ['Couverts', recap[0].v],
                ['Date', recap[1].v],
                ['Service', `${recap[2].v} · ${r.time}`],
                ['Téléphone', r.phone],
                ['Occasion', r.occasion],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: S.muted }}>{k}</div>
                  <div style={{ fontSize: 15, marginTop: 3, textTransform: k === 'Date' ? 'capitalize' : 'none', color: S.cream }}>{v}</div>
                </div>
              ))}
            </div>
            {r.notes && (
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(239,231,214,.1)', fontSize: 13.5, color: S.muted, fontStyle: 'italic' }}>
                « {r.notes} »
              </div>
            )}
          </div>

          <div className="resa-confirm-actions" style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/carte')} style={btnGold}>Voir la carte</button>
            <button onClick={() => router.push('/')} style={btnOutline}>Retour à l&apos;accueil</button>
          </div>
          <div style={{ marginTop: 20, fontSize: 13, color: S.muted }}>9 rue Saint-Maur, 75011 · 01 43 00 00 00</div>
        </Reveal>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: S.font, background: S.cream, color: S.forest, minHeight: '100vh' }}>
      {/* dark header */}
      <div className="resa-header" style={{ background: S.forest, color: S.cream, padding: '40px 56px 32px' }}>
        <Reveal stagger={0.1} staggerSelector=":scope > *" y={20} start="top 95%">
          <div style={kicker(S.gold)}>Réservation</div>
          <h1 style={{ fontSize: 'clamp(40px,5vw,60px)', fontWeight: 500, letterSpacing: '-0.025em', lineHeight: 1, margin: '10px 0 24px' }}>
            Réservez votre table
          </h1>
        </Reveal>
        {/* stepper */}
        <div style={{ display: 'flex', gap: 0, alignItems: 'center', flexWrap: 'wrap' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: i <= step ? 1 : 0.4 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  background: i < step ? S.gold : i === step ? S.gold : 'transparent',
                  color: i <= step ? S.forest : S.cream,
                  boxShadow: i > step ? 'inset 0 0 0 1.5px rgba(239,231,214,.3)' : 'none',
                }}>
                  {i < step ? '✓' : i + 1}
                </span>
                <span className="resa-stepper-label" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.02em', color: S.cream }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <span className="resa-stepper-sep" style={{ width: 24, height: 1, background: 'rgba(239,231,214,.2)', margin: '0 10px', display: 'inline-block' }} />}
            </div>
          ))}
        </div>
      </div>

      <div className="resa-body" style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 56px 80px' }}>
        <div className="resa-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 48, alignItems: 'start' }}>
          <div>
            {step === 0 && (
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', margin: '0 0 6px' }}>Vous serez combien&nbsp;?</h2>
                <p style={{ fontSize: 14, color: 'rgba(28,43,34,.6)', marginBottom: 24 }}>Choisissez le nombre de couverts.</p>
                <div className="resa-party-grid" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <button key={n} onClick={() => set({ party: n })} style={{
                      width: 60, height: 60, fontSize: 22, fontWeight: 600, cursor: 'pointer', borderRadius: 2,
                      border: `2px solid ${r.party === n ? S.gold : 'rgba(28,43,34,.15)'}`,
                      background: r.party === n ? S.gold : '#fff',
                      color: r.party === n ? S.forest : S.forest,
                      transition: 'all .14s',
                    }}>{n}</button>
                  ))}
                  <button onClick={() => set({ party: 9 })} style={{
                    height: 60, padding: '0 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', borderRadius: 2,
                    border: `2px solid ${r.party === 9 ? S.gold : 'rgba(28,43,34,.15)'}`,
                    background: r.party === 9 ? S.gold : '#fff',
                    color: S.forest, transition: 'all .14s',
                  }}>9 et +</button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', margin: '0 0 6px' }}>Quel soir&nbsp;?</h2>
                <p style={{ fontSize: 14, color: 'rgba(28,43,34,.6)', marginBottom: 20 }}>Ouvert du mardi au samedi.</p>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 24 }}>
                  {DAYS.map((day, i) => (
                    <button key={i} disabled={day.closed} onClick={() => set({ dateIdx: i })} style={{
                      flexShrink: 0, width: 62, padding: '10px 0', textAlign: 'center', borderRadius: 2,
                      cursor: day.closed ? 'not-allowed' : 'pointer',
                      border: `2px solid ${r.dateIdx === i ? S.gold : 'rgba(28,43,34,.12)'}`,
                      background: r.dateIdx === i ? S.gold : day.closed ? 'transparent' : '#fff',
                      color: day.closed ? 'rgba(28,43,34,.25)' : r.dateIdx === i ? S.forest : S.forest,
                      opacity: day.closed ? 0.6 : 1, transition: 'all .14s',
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>{fmtDay(day.d)}</div>
                      <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.2, marginTop: 2 }}>{day.d.getDate()}</div>
                      {day.closed && <div style={{ fontSize: 8.5, marginTop: 1 }}>fermé</div>}
                    </button>
                  ))}
                </div>
                <div style={{ ...kicker('rgba(28,43,34,.5)'), marginBottom: 10 }}>Service</div>
                <div className="resa-service-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 440 }}>
                  {[['midi', 'Le midi', '12h – 14h30'], ['soir', 'Le soir', '19h – 22h30']].map(([id, t, h]) => (
                    <button key={id} onClick={() => set({ service: id, time: null })} style={{
                      textAlign: 'left', padding: '18px 20px', borderRadius: 2, cursor: 'pointer',
                      border: `2px solid ${r.service === id ? S.gold : 'rgba(28,43,34,.12)'}`,
                      background: r.service === id ? S.forest : '#fff',
                      color: r.service === id ? S.cream : S.forest, transition: 'all .14s',
                    }}>
                      <div style={{ fontSize: 20, fontWeight: 500 }}>{t}</div>
                      <div style={{ fontSize: 13, opacity: 0.65, marginTop: 2 }}>{h}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', margin: '0 0 6px' }}>À quelle heure&nbsp;?</h2>
                <p style={{ fontSize: 14, color: 'rgba(28,43,34,.6)', marginBottom: 22 }}>
                  {r.service === 'midi' ? 'Service du midi' : 'Service du soir'} · {r.dateIdx !== null ? fmtFull(DAYS[r.dateIdx].d) : ''}
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 480 }}>
                  {(SLOTS[r.service || 'soir'] || []).map(([t, full]) => (
                    <button key={t} disabled={!!full} onClick={() => set({ time: t })} style={{
                      padding: '12px 18px', fontSize: 15, fontWeight: 600, borderRadius: 2,
                      cursor: full ? 'not-allowed' : 'pointer',
                      border: `2px solid ${r.time === t ? S.gold : 'rgba(28,43,34,.12)'}`,
                      background: r.time === t ? S.gold : full ? 'transparent' : '#fff',
                      color: full ? 'rgba(28,43,34,.3)' : r.time === t ? S.forest : S.forest,
                      textDecoration: full ? 'line-through' : 'none', transition: 'all .14s',
                    }}>
                      {t}
                      {full && <span style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>complet</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', margin: '0 0 6px' }}>Vos coordonnées</h2>
                <p style={{ fontSize: 14, color: 'rgba(28,43,34,.6)', marginBottom: 24 }}>Pour confirmer votre réservation.</p>
                <div className="resa-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 560 }}>
                  {[
                    ['first', 'Prénom', '', 'text', errs.first],
                    ['last', 'Nom', '', 'text', errs.last],
                    ['phone', 'Téléphone', '06 12 34 56 78', 'tel', errs.phone],
                    ['email', 'E-mail', 'vous@exemple.fr', 'email', errs.email],
                  ].map(([key, label, placeholder, type, err]) => (
                    <label key={key} style={{ display: 'block' }}>
                      <div style={{ ...kicker(touched && err ? S.terra : 'rgba(28,43,34,.5)'), marginBottom: 6 }}>
                        {label}{touched && err ? ` · ${err}` : ''}
                      </div>
                      <input
                        type={type}
                        value={r[key as keyof Reservation] as string}
                        onChange={(e) => set({ [key]: e.target.value })}
                        placeholder={placeholder}
                        style={inputCss(touched ? (err as string) : undefined)}
                      />
                    </label>
                  ))}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ ...kicker('rgba(28,43,34,.5)'), marginBottom: 6 }}>Occasion (facultatif)</div>
                    <select value={r.occasion} onChange={(e) => set({ occasion: e.target.value })} style={{ ...inputCss(), appearance: 'none', cursor: 'pointer' }}>
                      {['Aucune', 'Anniversaire', 'En amoureux', 'Entre amis', "Dîner d'affaires", 'Autre'].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ ...kicker('rgba(28,43,34,.5)'), marginBottom: 6 }}>Un mot pour la maison</div>
                    <textarea value={r.notes} onChange={(e) => set({ notes: e.target.value })} rows={3} placeholder="Allergies, occasion spéciale, terrasse…" style={{ ...inputCss(), resize: 'vertical' }} />
                  </div>
                </div>
              </div>
            )}

            <div className="resa-actions" style={{ display: 'flex', gap: 12, marginTop: 36, alignItems: 'center' }}>
              <button onClick={back} style={btnOutline}>← {step === 0 ? 'Annuler' : 'Retour'}</button>
              <button onClick={next} style={{ ...btnGold, opacity: !canProceed ? 0.55 : 1 }}>
                {step === 3 ? 'Confirmer →' : 'Continuer →'}
              </button>
            </div>
          </div>

          {/* sidebar */}
          <aside className="resa-aside" style={{ position: 'sticky', top: 86 }}>
            <Photo
              from="#2E4536"
              to="#0E1813"
              src={PHOTOS.salle}
              alt="Salle du restaurant"
              caption="Votre table vous attend"
              tag="salle"
              style={{ height: 140, borderRadius: 4 }}
            />
            <div style={{ background: S.deep, color: S.cream, border: '1px solid rgba(200,162,75,.2)', borderRadius: 4, padding: '22px 24px' }}>
              <div style={{ fontSize: 20, fontWeight: 500, borderBottom: '1px solid rgba(239,231,214,.1)', paddingBottom: 12, marginBottom: 14 }}>
                Votre réservation
              </div>
              {recap.map((x) => (
                <div key={x.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', gap: 10 }}>
                  <span style={{ ...kicker(S.muted), fontSize: 10 }}>{x.k}</span>
                  <span style={{ fontSize: 14, textAlign: 'right', textTransform: x.k === 'Date' ? 'capitalize' : 'none', color: x.v ? S.cream : 'rgba(239,231,214,.3)' }}>{x.v || '—'}</span>
                </div>
              ))}
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(239,231,214,.1)', fontSize: 12.5, color: S.muted, lineHeight: 1.6 }}>
                9 rue Saint-Maur, 75011 · Table gardée 15 min.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
