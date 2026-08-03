import PrintButton from './PrintButton';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined, fallback = '') {
  return Array.isArray(value) ? value[0] || fallback : value || fallback;
}

function clean(value: string, fallback: string) {
  return (value || fallback).replace(/[^a-zA-Z0-9_.\-]/g, '').slice(0, 80) || fallback;
}

export const metadata = {
  title: 'QR Flyer',
  robots: { index: false, follow: false },
};

export default async function QrFlyerPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const referral = clean(first(query.ref), 'FLYER-OGDEN');
  const source = clean(first(query.source), 'qr');
  const campaign = clean(first(query.campaign), 'weber-junk-launch');
  const qrSrc = `/api/qr?ref=${encodeURIComponent(referral)}&source=${encodeURIComponent(source)}&campaign=${encodeURIComponent(campaign)}`;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const target = siteUrl ? `${siteUrl}?ref=${encodeURIComponent(referral)}&utm_source=${encodeURIComponent(source)}&utm_medium=qr&utm_campaign=${encodeURIComponent(campaign)}` : '';

  return (
    <main className="qr-page">
      <section className="qr-flyer">
        <div className="eyebrow"><span className="live-dot" /> Weber County local service</div>
        <h1>GOT <span>JUNK?</span></h1>
        <p className="hero-sub" style={{margin:'0 auto',maxWidth:'600px'}}>Garage cleanouts • move-outs • furniture • appliances • yard debris • rental cleanups</p>
        <div className="qr-box"><img src={qrSrc} alt={`QR code for referral ${referral}`} /></div>
        <h2 style={{fontSize:'34px',marginBottom:'8px'}}>SCAN FOR A FAST QUOTE</h2>
        <p style={{color:'var(--lime)',fontWeight:1000,fontSize:'22px'}}>14FT HIGH-WALL TRAILER</p>
        <p style={{color:'#b8c2bc'}}>Send details • Pay secure deposit • Book pickup</p>
        <div className="trust-row" style={{justifyContent:'center',marginTop:'20px'}}><span>$275+ minimum</span><span>Half trailer $575+</span><span>Full trailer $950+</span></div>
        <p style={{fontSize:'11px',color:'#78847d',marginTop:'22px'}}>TRACKING CODE: {referral.toUpperCase()}</p>
        {target ? <p style={{fontSize:'10px',color:'#667269',wordBreak:'break-all'}}>{target}</p> : null}
        <PrintButton />
      </section>
    </main>
  );
}
