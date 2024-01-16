import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Recipe Metric Converter.',
  description: 'An OCR app to convert imperial recipes to metric units.',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: [
    'cooking',
    'recipe',
    'metric',
    'converter',
    'OCR',
    'imperial',
    'units',
  ],
  authors: [{ name: 'Max Hammer' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
