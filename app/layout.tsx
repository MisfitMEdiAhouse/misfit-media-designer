import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Weber Junk Rescue | 14ft Trailer Cleanouts',
  description: 'Weber County junk removal booking funnel. Send photos, pay dispatch deposit, book pickup.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
