import Stripe from 'stripe';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || '' : value || '';
}

export const metadata = {
  title: 'Deposit Received',
  robots: { index: false, follow: false },
};

export default async function SuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const sessionId = first(query.session_id);
  const baseCalendly = process.env.NEXT_PUBLIC_CALENDLY_URL || '';
  let name = '';
  let email = '';
  let loadSize = '';
  let referral = '';

  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      name = session.metadata?.name || session.customer_details?.name || '';
      email = session.metadata?.email || session.customer_details?.email || '';
      loadSize = session.metadata?.loadSize || '';
      referral = session.metadata?.referral || '';
    } catch (error) {
      console.error('Unable to load completed Checkout Session', error);
    }
  }

  let calendlyUrl = baseCalendly;
  if (baseCalendly) {
    const url = new URL(baseCalendly);
    if (name) url.searchParams.set('name', name);
    if (email) url.searchParams.set('email', email);
    if (referral) url.searchParams.set('utm_source', referral);
    if (loadSize) url.searchParams.set('utm_content', loadSize);
    calendlyUrl = url.toString();
  }

  return (
    <main>
      <div className="site-shell">
        <nav className="topbar">
          <a className="brand-lockup" href="/">
            <span className="brand-mark">WJR</span>
            <span><strong>Weber Junk Rescue</strong><small>Secure booking complete</small></span>
          </a>
        </nav>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot" /> Deposit received</div>
            <h1>Your haul is <span>reserved.</span></h1>
            <p className="hero-sub">
              Your $150 deposit is applied to the final approved total. Finish the booking by
              choosing the exact pickup window below. The local operator has already received
              the paid-job alert.
            </p>
            {loadSize ? <div className="trust-row"><span>{loadSize}</span><span>Deposit paid</span><span>Final approval before loading</span></div> : null}
            <div className="hero-actions">
              {calendlyUrl ? <a className="button" href={calendlyUrl}>Choose Pickup Window</a> : <a className="button" href="/">Return to Site</a>}
              <a className="button button-secondary" href="/">Back to Home</a>
            </div>
          </div>
          <aside className="hero-console">
            <div className="console-head"><span className="status-chip">PAYMENT CONFIRMED</span><span className="source-chip">NEXT: CALENDAR</span></div>
            <div className="flow-list" style={{marginTop:'26px'}}>
              <div><b>✓</b><span>Job details submitted</span><em>Complete</em></div>
              <div><b>✓</b><span>$150 deposit paid</span><em>Complete</em></div>
              <div><b>03</b><span>Choose pickup window</span><em>Do this now</em></div>
              <div><b>04</b><span>Final quote + haul</span><em>At pickup</em></div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
