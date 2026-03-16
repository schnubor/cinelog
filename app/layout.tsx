import type { Metadata } from 'next';
import { Instrument_Serif, DM_Sans } from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cinelog — 2026 Movie Journal',
  description: 'A personal journal of every film watched in 2026.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
