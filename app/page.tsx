'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Photo from '@/components/Photo';
import { Reveal, Parallax, CountUp } from '@/components/Anim';
import { S } from '@/lib/tokens';
import { PHOTOS } from '@/lib/photos';

const kicker = (c: string): React.CSSProperties => ({
  fontSize: 12.5,
  fontWeight: 600,
  letterSpacing: '.28em',
  textTransform: 'uppercase',
  color: c,
});

export default function HomePage() {
  const router = useRouter();

  return (
    <div style={{ fontFamily: S.font, background: S.cream, color: S.forest, width: '100%' }}>
      {/* dark hero */}
      <div style={{ background: S.forest, color: S.cream }}>
        <div
          className="home-hero"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 0.85fr',
            gap: 48,
            padding: '60px 56px 72px',
            alignItems: 'center',
          }}
        >
          <Reveal stagger={0.12} staggerSelector=":scope > *" y={32} start="top 95%">
            <div style={kicker(S.gold)}>Cantine du soir · Paris 11ᵉ</div>
            <h1
              style={{
                fontSize: 'clamp(52px,6vw,82px)',
                lineHeight: 1.0,
                fontWeight: 500,
                letterSpacing: '-0.03em',
                margin: '24px 0 0',
              }}
            >
              On s&apos;attable,
              <br />
              on s&apos;attarde,
              <br />
              <span style={{ color: S.gold }}>on recommence.</span>
            </h1>
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: 'rgba(239,231,214,.75)',
                maxWidth: 480,
                margin: '26px 0 0',
              }}
            >
              La cantine quand le jour tombe&nbsp;: lumière basse, vin nature, plats généreux à partager.
              Chaleureuse comme à la maison, dressée comme au restaurant.
            </p>
            <div className="home-hero-ctas" style={{ display: 'flex', gap: 14, marginTop: 36, alignItems: 'center' }}>
              <button
                onClick={() => router.push('/reservation')}
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: S.forest,
                  background: S.gold,
                  padding: '15px 32px',
                  borderRadius: 2,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Réserver le soir
              </button>
              <button
                onClick={() => router.push('/carte')}
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: S.cream,
                  boxShadow: 'inset 0 0 0 1.5px rgba(239,231,214,.35)',
                  padding: '15px 30px',
                  borderRadius: 2,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                Découvrir la carte
              </button>
            </div>
          </Reveal>
          <Parallax amount={70} className="home-hero-photo" style={{ height: 540, borderRadius: 4, boxShadow: '0 30px 80px rgba(0,0,0,.4)' }}>
            <Photo
              from="#2E4536"
              to="#0E1813"
              src={PHOTOS.barAmbiance}
              alt="Bar à vins à lumière basse"
              caption="Le bar à vins, 20h"
              tag="ambiance"
              style={{ height: '100%', width: '100%' }}
            />
          </Parallax>
        </div>
      </div>

      {/* ardoise du soir */}
      <div id="soir" className="home-ardoise" style={{ padding: '76px 56px' }}>
        <Reveal
          className="home-ardoise-head"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 36,
          }}
        >
          <h2 style={{ fontSize: 40, fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>
            À l&apos;ardoise, ce soir
          </h2>
          <span style={{ ...kicker(S.terra), fontSize: 13 }}>Mardi 2 juin · à partager</span>
        </Reveal>
        <Reveal className="home-ardoise-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 44 }} stagger={0.15} staggerSelector=":scope > *">
          {(
            [
              [
                'À grignoter',
                [
                  ['Gougères au comté', '8'],
                  ['Anchois, pain grillé, beurre', '10'],
                  ['Olives, amandes torréfiées', '6'],
                ],
              ],
              [
                'Les grandes assiettes',
                [
                  ["Épaule d'agneau confite 7h", '28'],
                  ['Poularde rôtie, vin jaune', '26'],
                  ['Légumes du moment, sarrasin', '21'],
                ],
              ],
              [
                'Pour finir',
                [
                  ['Tarte au chocolat, fleur de sel', '10'],
                  ['Île flottante, pralin', '9'],
                  ['Comté affiné 24 mois', '8'],
                ],
              ],
            ] as [string, [string, string][]][]
          ).map(([head, rows]) => (
            <div key={head}>
              <div
                style={{
                  ...kicker(S.terra),
                  marginBottom: 18,
                  borderBottom: `1.5px solid ${S.forest}`,
                  paddingBottom: 12,
                }}
              >
                {head}
              </div>
              {rows.map(([n, p]) => (
                <div
                  key={n}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 10,
                    padding: '12px 0',
                    borderBottom: `1px solid ${S.border}`,
                  }}
                >
                  <span style={{ fontSize: 16.5 }}>{n}</span>
                  <span
                    style={{
                      flex: 1,
                      borderBottom: 'dotted 1px rgba(28,43,34,.3)',
                      transform: 'translateY(-4px)',
                    }}
                  />
                  <span
                    style={{ fontSize: 16, fontWeight: 600, color: S.terra, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {p}€
                  </span>
                </div>
              ))}
            </div>
          ))}
        </Reveal>
      </div>

      {/* la maison */}
      <div
        id="maison"
        className="home-maison"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: 0,
          padding: '0 56px 76px',
          alignItems: 'stretch',
        }}
      >
        <div
          className="home-maison-left"
          style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 16, paddingRight: 16 }}
        >
          <Parallax amount={60} style={{ borderRadius: 4, minHeight: 240 }}>
            <Photo
              from="#B5552F"
              to="#7A331A"
              src={PHOTOS.agneau}
              alt="Épaule d'agneau confite"
              caption="Épaule d'agneau, 7 heures"
              tag="plat"
              style={{ height: '100%', width: '100%' }}
            />
          </Parallax>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Parallax amount={50} style={{ borderRadius: 4, minHeight: 200 }}>
              <Photo
                from="#3A5240"
                to="#1C2B22"
                src={PHOTOS.cave}
                alt="Bouteilles dans la cave"
                tag="cave"
                style={{ height: '100%', width: '100%' }}
              />
            </Parallax>
            <Parallax amount={50} style={{ borderRadius: 4, minHeight: 200 }}>
              <Photo
                from="#D8B45E"
                to="#A9803A"
                src={PHOTOS.table}
                alt="Mise en place en cuisine"
                tag="cuisine"
                dark
                style={{ height: '100%', width: '100%' }}
              />
            </Parallax>
          </div>
        </div>
        <Reveal
          className="home-maison-block"
          y={36}
          style={{
            background: S.deep,
            color: S.cream,
            padding: '52px 44px',
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={kicker(S.gold)}>La maison</div>
          <h2
            style={{
              fontSize: 46,
              fontWeight: 500,
              letterSpacing: '-0.025em',
              lineHeight: 1.06,
              margin: '18px 0 0',
            }}
          >
            Le luxe discret du sans-façon.
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: 'rgba(239,231,214,.72)',
              marginTop: 20,
            }}
          >
            Vingt-huit couverts, une cave vivante, un menu qui change au gré du marché. On y soigne
            tout — sauf l&apos;ambiance, qu&apos;on laisse libre.
          </p>
          <div className="home-maison-stats" style={{ display: 'flex', gap: 32, marginTop: 30 }}>
            <div>
              <CountUp to={28} style={{ fontSize: 32, fontWeight: 600, color: S.gold, display: 'block' }} />
              <div style={{ fontSize: 13, color: 'rgba(239,231,214,.6)' }}>couverts</div>
            </div>
            <div>
              <CountUp to={60} suffix="+" style={{ fontSize: 32, fontWeight: 600, color: S.gold, display: 'block' }} />
              <div style={{ fontSize: 13, color: 'rgba(239,231,214,.6)' }}>vins nature</div>
            </div>
            <div>
              <CountUp to={7} suffix="h" style={{ fontSize: 32, fontWeight: 600, color: S.gold, display: 'block' }} />
              <div style={{ fontSize: 13, color: 'rgba(239,231,214,.6)' }}>de cuisson lente</div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* réservation */}
      <Reveal
        className="home-cta"
        y={36}
        style={{
          background: S.forest,
          color: S.cream,
          padding: '70px 56px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 40,
        }}
      >
        <div>
          <div style={kicker(S.gold)}>Le soir vous attend</div>
          <div className="home-cta-title" style={{ fontSize: 52, fontWeight: 500, letterSpacing: '-0.025em', marginTop: 12 }}>
            Réservez votre table.
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

      {/* footer */}
      <footer
        id="acces"
        className="home-footer"
        style={{
          background: S.deep,
          color: 'rgba(239,231,214,.85)',
          padding: '52px 56px',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr',
          gap: 40,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="26" height="26" viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r="23" fill="none" stroke={S.gold} strokeWidth="1.2" />
              <text
                x="24"
                y="31"
                textAnchor="middle"
                fontFamily="Bricolage Grotesque, system-ui, sans-serif"
                fontSize="22"
                fontWeight="600"
                fill={S.gold}
              >
                S
              </text>
            </svg>
            <span style={{ fontSize: 20, fontWeight: 500, color: S.cream }}>Séraphine</span>
          </div>
          <p style={{ fontSize: 14, marginTop: 14, maxWidth: 290, lineHeight: 1.6, color: S.muted }}>
            Cantine du soir &amp; bar à vins. Le 11ᵉ, à la nuit tombée.
          </p>
        </div>
        <div>
          <div
            style={{ ...kicker(S.gold), fontSize: 11, marginBottom: 14 }}
          >
            Nous trouver
          </div>
          <div style={{ fontSize: 14.5, lineHeight: 1.8 }}>
            9 rue Saint-Maur
            <br />
            75011 Paris
            <br />
            01 43 00 00 00
          </div>
        </div>
        <div>
          <div style={{ ...kicker(S.gold), fontSize: 11, marginBottom: 14 }}>Le service</div>
          <div style={{ fontSize: 14.5, lineHeight: 1.8 }}>
            Mar–Sam · dès 19h
            <br />
            Dernier service 22h30
            <br />
            Bar jusqu&apos;à minuit
          </div>
        </div>
      </footer>
    </div>
  );
}
