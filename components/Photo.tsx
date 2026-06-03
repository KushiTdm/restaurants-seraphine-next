import React from 'react';
import { GRAIN } from '@/lib/tokens';

interface PhotoProps {
  from: string;
  to: string;
  src?: string;
  alt?: string;
  caption?: string;
  tag?: string;
  dark?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function Photo({
  from,
  to,
  src,
  alt,
  caption,
  tag,
  dark,
  children,
  style,
  className,
}: PhotoProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(155deg, ${from}, ${to})`,
        ...style,
      }}
    >
      {src && (
        <img
          src={src}
          alt={alt || caption || tag || ''}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: GRAIN,
          backgroundSize: '160px',
          mixBlendMode: 'soft-light',
          opacity: src ? 0.25 : 0.45,
          pointerEvents: 'none',
        }}
      />
      {src && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(14,24,19,0) 40%, rgba(14,24,19,.55) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}
      {tag && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            right: 16,
            fontSize: 10,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: dark ? 'rgba(28,43,34,.85)' : 'rgba(239,231,214,.85)',
            textShadow: src && !dark ? '0 1px 4px rgba(0,0,0,.5)' : 'none',
          }}
        >
          ✶ {tag}
        </div>
      )}
      {caption && (
        <div
          style={{
            position: 'absolute',
            left: 18,
            bottom: 16,
            fontSize: 14,
            fontStyle: 'italic',
            color: 'rgba(239,231,214,.95)',
            textShadow: '0 1px 10px rgba(0,0,0,.55)',
          }}
        >
          {caption}
        </div>
      )}
      {children}
    </div>
  );
}
