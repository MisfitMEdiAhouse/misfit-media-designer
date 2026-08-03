import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

function clean(value: string | null, fallback: string) {
  return (value || fallback).replace(/[^a-zA-Z0-9_.\-]/g, '').slice(0, 80) || fallback;
}

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin).replace(/\/$/, '');
  const referral = clean(requestUrl.searchParams.get('ref'), 'DIRECT');
  const source = clean(requestUrl.searchParams.get('source'), 'qr');
  const campaign = clean(requestUrl.searchParams.get('campaign'), 'weber-junk-launch');

  const target = new URL(siteUrl);
  target.searchParams.set('ref', referral);
  target.searchParams.set('utm_source', source);
  target.searchParams.set('utm_medium', 'qr');
  target.searchParams.set('utm_campaign', campaign);

  const svg = await QRCode.toString(target.toString(), {
    type: 'svg',
    width: 640,
    margin: 1,
    errorCorrectionLevel: 'H',
    color: { dark: '#071009', light: '#ffffff' },
  });

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Content-Disposition': `inline; filename="weber-junk-${referral.toLowerCase()}.svg"`,
    },
  });
}
