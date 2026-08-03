import './globals.css';
import type { Metadata, Viewport } from 'next';
import Analytics from './components/Analytics';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://weber-junk-rescue.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Weber Junk Rescue | 14ft Trailer Cleanouts',
    template: '%s | Weber Junk Rescue',
  },
  description: 'Weber County junk removal for garages, move-outs, rentals, furniture, yard debris, and trailer-sized cleanouts. Get a range, pay a secure deposit, and book pickup.',
  applicationName: 'Weber Junk Rescue',
  keywords: ['Weber County junk removal','Ogden junk removal','Roy junk removal','dump trailer cleanout','garage cleanout','rental cleanout'],
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Weber Junk Rescue — Clear the mess. Reclaim the space.',
    description: '14ft high-wall trailer junk removal throughout Weber County. Secure deposit and online pickup booking.',
    siteName: 'Weber Junk Rescue',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weber Junk Rescue',
    description: 'Trailer-sized junk cleanouts in Weber County.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#070909',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
