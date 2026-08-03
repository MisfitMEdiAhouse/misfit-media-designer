type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || '' : value || '';
}

export const metadata = {
  title: 'Launch Setup',
  robots: { index: false, follow: false },
};

export default async function SetupPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const key = first(query.key);
  const allowed = Boolean(process.env.SETUP_KEY && key === process.env.SETUP_KEY);

  if (!allowed) {
    return <main className="setup-shell"><div className="setup-card"><h1>Setup access denied.</h1><p className="pricing-note">Open this page with your private setup key.</p></div></main>;
  }

  const items = [
    ['Public site URL', Boolean(process.env.NEXT_PUBLIC_SITE_URL)],
    ['Stripe secret key', Boolean(process.env.STRIPE_SECRET_KEY)],
    ['Stripe webhook secret', Boolean(process.env.STRIPE_WEBHOOK_SECRET)],
    ['Twilio account', Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)],
    ['Twilio sender', Boolean(process.env.TWILIO_FROM_PHONE || process.env.TWILIO_MESSAGING_SERVICE_SID)],
    ['Owner phone', Boolean(process.env.OWNER_PHONE)],
    ['Brandon phone', Boolean(process.env.BRANDON_PHONE)],
    ['Calendly booking URL', Boolean(process.env.NEXT_PUBLIC_CALENDLY_URL)],
    ['Calendly API token', Boolean(process.env.CALENDLY_PAT)],
    ['Calendly webhook key', Boolean(process.env.CALENDLY_WEBHOOK_KEY)],
    ['Public booking/text number', Boolean(process.env.NEXT_PUBLIC_BOOKING_PHONE)],
    ['Google Analytics', Boolean(process.env.NEXT_PUBLIC_GA_ID)],
    ['Meta Pixel', Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID)],
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || '';
  const stripeWebhook = siteUrl ? `${siteUrl}/api/stripe-webhook` : 'Set NEXT_PUBLIC_SITE_URL first';
  const calendlySetup = siteUrl ? `${siteUrl}/api/calendly/setup?key=${encodeURIComponent(key)}` : '#';
  const qrLink = siteUrl ? `${siteUrl}/qr?ref=FLYER-OGDEN` : '#';

  return (
    <main className="setup-shell">
      <div className="eyebrow"><span className="live-dot" /> Private launch control</div>
      <h1 style={{fontSize:'clamp(42px,8vw,78px)',lineHeight:.9,letterSpacing:'-.07em',margin:'22px 0'}}>Weber Junk Rescue<br /><span style={{color:'var(--lime)'}}>Launch Setup</span></h1>
      <div className="setup-card">
        <h2>Configuration status</h2>
        <div className="setup-grid">
          {items.map(([label, ready]) => (
            <div className="setup-item" key={String(label)}><span>{label}</span><b className={ready ? 'status-good' : 'status-bad'}>{ready ? 'READY' : 'MISSING'}</b></div>
          ))}
        </div>
      </div>
      <div className="setup-card">
        <h2>URLs to finish from your phone</h2>
        <p><b>Stripe webhook endpoint</b><br /><code>{stripeWebhook}</code></p>
        <p><b>Stripe event</b><br /><code>checkout.session.completed</code></p>
        <p><b>Calendly automatic webhook registration</b><br /><a className="button button-small" href={calendlySetup}>Register Calendly Webhook</a></p>
        <p><b>Printable Ogden flyer / QR</b><br /><a className="button button-secondary button-small" href={qrLink}>Open QR Flyer</a></p>
        <p><b>Health JSON</b><br /><a href={`/api/health?key=${encodeURIComponent(key)}`}>Open technical status</a></p>
      </div>
      <div className="setup-card">
        <h2>Launch order</h2>
        <ol className="check-list">
          <li>Deploy this GitHub repository in Vercel.</li>
          <li>Add the environment values listed in the repository README.</li>
          <li>Redeploy once after adding environment values.</li>
          <li>Add the Stripe webhook endpoint shown above.</li>
          <li>Tap Register Calendly Webhook.</li>
          <li>Run one $150 Stripe test-mode booking before switching to live keys.</li>
          <li>Open the QR flyer and start distributing tracked links.</li>
        </ol>
      </div>
    </main>
  );
}
