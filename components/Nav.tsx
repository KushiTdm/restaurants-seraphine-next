'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { S } from '@/lib/tokens';

const LINKS = [
  { label: 'La carte', path: '/carte' },
  { label: 'Commander', path: '/commande' },
  { label: 'Le soir', path: '/#soir' },
  { label: 'La maison', path: '/#maison' },
  { label: 'Accès', path: '/#acces' },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkColor = (path: string) =>
    pathname === path ? S.cream : 'rgba(239,231,214,.75)';

  // Same-page hash links (e.g. /#acces) don't scroll reliably with the App
  // Router, so we handle the scroll ourselves when already on the home page.
  const handleHashClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    const hash = path.split('#')[1];
    if (!hash) return;
    setOpen(false);
    if (pathname !== '/') return; // cross-page: let the Link navigate + scroll
    const target = document.getElementById(hash);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', `#${hash}`);
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(28,43,34,.97)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(200,162,75,.2)',
      }}
    >
      <div className="nav-row">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true">
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
          <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.02em', color: S.cream }}>
            Séraphine
          </span>
        </Link>

        <div className="nav-links">
          {LINKS.map(({ label, path }) => (
            <Link
              key={label}
              href={path}
              onClick={(e) => handleHashClick(e, path)}
              style={{
                textDecoration: 'none',
                fontSize: 14.5,
                color: linkColor(path),
                transition: 'color .15s',
              }}
            >
              {label}
            </Link>
          ))}
          <Link href="/reservation" style={{ textDecoration: 'none' }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: S.forest,
                background: S.gold,
                padding: '11px 22px',
                borderRadius: 2,
                display: 'inline-block',
              }}
            >
              Réserver
            </span>
          </Link>
        </div>

        <button
          className="nav-burger"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke={S.cream} strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke={S.cream}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="nav-drawer">
          {LINKS.map(({ label, path }) => (
            <Link key={label} href={path} onClick={(e) => handleHashClick(e, path)}>
              {label}
            </Link>
          ))}
          <Link href="/reservation" className="nav-cta" onClick={() => setOpen(false)}>
            Réserver
          </Link>
        </div>
      )}
    </nav>
  );
}
