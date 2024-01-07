import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
  icons: [
    { rel: 'apple-touch-icon', url: 'icons/apple-touch-icon.png' },
    { rel: 'android-chrome', url: 'icons/android-chrome-192x192.png' },
    { rel: 'apple-touch-icon', url: 'icons/apple-touch-icon.png' },
    {
      media: '(prefers-color-scheme: light)',
      url: '/icons/favicon.png',
      href: '/icons/favicon.png',
    },
    {
      media: '(prefers-color-scheme: dark)',
      url: '/icons/favicon-dark.png',
      href: '/icons/favicon-dark.png',
    },
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#fff' }],
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
