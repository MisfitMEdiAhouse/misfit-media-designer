import BookingForm from './components/BookingForm';
import GuidedBooking from './components/GuidedBooking';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined, fallback = '') {
  return Array.isArray(value) ? value[0] || fallback : value || fallback;
}

function clean(value: string, fallback: string, max = 80) {
  const normalized = value.replace(/[^a-zA-Z0-9_.\- ]/g, '').trim();
  return (normalized || fallback).slice(0, max);
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const attribution = {
    referral: clean(first(query.ref), 'DIRECT'),
    utmSource: clean(first(query.utm_source), 'direct'),
    utmMedium: clean(first(query.utm_medium), ''),
    utmCampaign: clean(first(query.utm_campaign), ''),
    utmContent: clean(first(query.utm_content), ''),
  };

  const bookingPhone = process.env.NEXT_PUBLIC_BOOKING_PHONE || '+13853673217';
  const smsBody = encodeURIComponent('I need a Weber County junk-removal quote. I can send photos and the pickup address.');
  const smsHref = `sms:${bookingPhone}?body=${smsBody}`;
  const checkoutCancelled = first(query.cancelled) === '1';
  const checkoutError = first(query.error) === 'checkout';

  return (
    <main>
      <div className="site-shell">
        <nav className="topbar">
          <a className="brand-lockup" href="#top" aria-label="Weber Junk Rescue home">
            <img className="brand-logo" src="/misfit-skull-rose.svg" alt="Misfit skull and rose" />
            <span><strong>Weber Junk Rescue</strong><small>Powered by Misfit Mediahouse</small></span>
          </a>
          <div className="nav-actions"><a className="text-link" href="#pricing">Pricing</a><a className="button button-small" href="#book">Book Fast</a></div>
        </nav>

        <section className="hero" id="top">
          <img className="hero-watermark" src="/misfit-skull-rose.svg" alt="" aria-hidden="true" />
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot" /> Weber County • 14ft high-wall trailer</div>
            <h1>Big trailer.<br /><span>Clean space.</span></h1>
            <p className="hero-sub">Real junk removal for garages, move-outs, rental turns, furniture, yard debris, estates, and full-property cleanouts. Choose the fast form or let the Misfit Booking Guide walk you through it out loud.</p>
            <div className="hero-actions">
              <GuidedBooking attribution={attribution} />
              <a className="button button-secondary" href="#book">Book It Myself</a>
              <a className="button button-ghost" href={smsHref}>Text Photos</a>
            </div>
            <div className="trust-row"><span>Local crew</span><span>Up-front range</span><span>Secure deposit when enabled</span><span>Voice-guided booking</span></div>
          </div>

          <aside className="hero-console" aria-label="Booking path">
            <div className="console-head"><span className="status-chip">MISFIT BOOKING SYSTEM ONLINE</span><span className="source-chip">SOURCE: {attribution.referral.toUpperCase()}</span></div>
            <div className="console-brand"><img src="/misfit-skull-rose.svg" alt="Misfit skull and rose" /></div>
            <div className="flow-list">
              <div><b>01</b><span>Tell us what needs to go</span><em>Voice or tap</em></div>
              <div><b>02</b><span>Confirm planning range</span><em>No bait pricing</em></div>
              <div><b>03</b><span>Approve quote</span><em>Before loading</em></div>
              <div><b>04</b><span>Choose pickup window</span><em>Done</em></div>
            </div>
          </aside>
        </section>

        {(checkoutCancelled || checkoutError) && <div className="alert-banner" role="alert">{checkoutError ? 'Checkout is not enabled yet. Your card was not charged. Please text or call us for the quote.' : 'Your reservation was not completed. Your card was not charged.'}</div>}

        <section className="metric-strip"><div><strong>14FT</strong><span>High-wall trailer</span></div><div><strong>TEXT</strong><span>Photos to 385-367-3217</span></div><div><strong>9–5</strong><span>Business hours</span></div><div><strong>WEBER</strong><span>County-first</span></div></section>

        <section className="section" id="pricing">
          <div className="section-heading"><div><span className="section-kicker">LOAD-BASED PRICING</span><h2>Enough capacity to make a cleanout count.</h2></div><p>Planning ranges, not bait prices. Final pricing is approved before anything gets loaded.</p></div>
          <div className="price-grid">
            <article className="price-card"><span className="load-meter"><i style={{width:'22%'}} /></span><small>ROUTE-FIT MINIMUM</small><h3>$275+</h3><p>Small curb or driveway pickup that fits an existing route.</p></article>
            <article className="price-card"><span className="load-meter"><i style={{width:'38%'}} /></span><small>STARTER LOAD</small><h3>$375–$525</h3><p>Furniture, appliances, garage corners, boxes, and smaller piles.</p></article>
            <article className="price-card featured"><span className="best-value">MOST POPULAR</span><span className="load-meter"><i style={{width:'58%'}} /></span><small>HALF TRAILER</small><h3>$575–$750</h3><p>A meaningful cleanout with labor, hauling, and disposal.</p></article>
            <article className="price-card"><span className="load-meter"><i style={{width:'100%'}} /></span><small>FULL 14FT TRAILER</small><h3>$950–$1,400</h3><p>Large garages, rentals, estates, sheds, and major cleanouts.</p></article>
          </div>
          <p className="pricing-note">Concrete, dirt, roofing, tile, shingles, hot tubs, sheds, paint, chemicals, tires, mattresses, refrigerators, and unusually heavy material require custom confirmation.</p>
        </section>

        <section className="section service-section">
          <div className="section-heading"><div><span className="section-kicker">WHAT WE REMOVE</span><h2>One crew. One trailer. A lot more room.</h2></div><p>Residential, landlord, estate, light commercial, and contractor cleanup jobs throughout Weber County.</p></div>
          <div className="service-grid">{[
            ['Garage & basement cleanouts','Boxes, furniture, storage overflow, household junk.'],
            ['Move-outs & rental turns','Left-behind belongings, tenant debris, quick property resets.'],
            ['Furniture & appliances','Couches, beds, tables, cabinets, and accepted appliances.'],
            ['Yard & storm debris','Branches, fencing, outdoor clutter, and non-hazardous debris.'],
            ['Estate & downsizing','Respectful, organized removal for larger household transitions.'],
            ['Contractor cleanup','Light demolition debris and jobsite cleanup after material review.'],
          ].map(([title, copy], index) => <article className="service-card" key={title}><b>{String(index + 1).padStart(2,'0')}</b><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </section>

        <section className="guided-promo section">
          <div className="guided-promo-art"><img src="/misfit-skull-rose.svg" alt="Misfit skull and rose" /></div>
          <div><span className="section-kicker">DON'T WANT TO FILL OUT A FORM?</span><h2>Talk to the booking guide.</h2><p>The guide speaks each step, lets you answer text fields by voice, keeps a visible progress bar, and turns the answers into the same quote request.</p><GuidedBooking attribution={attribution} /></div>
        </section>

        <section className="section booking-section" id="book">
          <div className="booking-intro"><span className="section-kicker">BOOK FAST</span><h2>Know what you need? Knock it out here.</h2><p>Send the job details and photos first. We confirm the planning range and final price before loading. Deposit checkout will be enabled when the junk-removal Stripe destination is configured.</p><ul className="check-list"><li>No loading before price approval</li><li>Text photos to the monitored Google Voice line</li><li>Normal business-hours scheduling</li><li>Brandon dispatch alerts when backend notification is enabled</li></ul></div>
          <BookingForm attribution={attribution} bookingPhone={bookingPhone} />
        </section>

        <section className="section areas-section"><div className="areas-copy"><span className="section-kicker">LOCAL ROUTING</span><h2>Built for Weber County.</h2><p>Ogden, Roy, West Haven, Riverdale, South Ogden, North Ogden, Harrisville, Pleasant View, Plain City, and nearby Weber County areas.</p></div><div className="route-map" aria-hidden="true"><span className="route-line route-one" /><span className="route-line route-two" />{['OGDEN','ROY','WEST HAVEN','NORTH OGDEN','RIVERDALE'].map((city, i) => <i key={city} className={`map-pin pin-${i+1}`}>{city}</i>)}</div></section>

        <section className="section faq-section"><div className="section-heading"><div><span className="section-kicker">STRAIGHT ANSWERS</span><h2>Before we roll the truck.</h2></div></div><div className="faq-grid"><details><summary>Is the online price final?</summary><p>No. The ranges help choose the right category. We confirm the final total before loading.</p></details><details><summary>Can I send photos?</summary><p>Yes. Text wide shots and close-ups of heavy items to (385) 367-3217.</p></details><details><summary>Can I reserve online?</summary><p>Quote requests are live now. Secure deposit checkout will be enabled when the junk-removal payment destination is configured.</p></details><details><summary>What can’t go in the trailer?</summary><p>Hazardous chemicals, explosives, biohazards, unknown liquids, and prohibited landfill materials are not accepted.</p></details></div></section>

        <section className="final-cta"><div><span className="section-kicker">READY WHEN YOU ARE</span><h2>Your space is worth more than the junk in it.</h2></div><a className="button" href={smsHref}>Text the Load</a></section>
        <footer className="footer"><div className="footer-brand"><img src="/misfit-skull-rose.svg" alt="Misfit skull and rose" /><span><strong>Weber Junk Rescue</strong><small>Powered by Misfit Mediahouse</small></span></div><p>Call or text (385) 367-3217 • misfitmediahouse@gmail.com • Final price approved before loading.</p></footer>
      </div>
      <div className="mobile-cta"><a className="button" href="#book">Fast Quote</a><a className="button button-secondary" href={smsHref}>Text Photos</a></div>
    </main>
  );
}
