import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import Nav from '@/components/Nav';
import './globals.css';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-main',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Séraphine — Cantine Paris 11ᵉ',
  description: 'Cantine du soir & bar à vins. Le 11ᵉ, à la nuit tombée.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={bricolageGrotesque.variable}>
      <body
        style={{
          fontFamily: 'var(--font-main), system-ui, sans-serif',
        }}
      >
        <Nav />
        {children}
      </body>
    </html>
  );
}
