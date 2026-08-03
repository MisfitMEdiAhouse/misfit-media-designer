import BookingForm from './components/BookingForm';

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

  const bookingPhone = process.env.NEXT_PUBLIC_BOOKING_PHONE || '';
  const smsBody = encodeURIComponent(
    'I need a Weber County junk-removal quote. I can send photos and the pickup address.'
  );
  const smsHref = bookingPhone ? `sms:${bookingPhone}?body=${smsBody}` : '#book';
  const checkoutCancelled = first(query.cancelled) === '1';
  const checkoutError = first(query.error) === 'checkout';

  return (
    <main>
      <div className="site-shell">
        <nav className="topbar">
          <a className="brand-lockup" href="#top" aria-label="Weber Junk Rescue home">
            <span className="brand-mark">WJR</span>
            <span>
              <strong>Weber Junk Rescue</strong>
              <small>A Misfit Mediahouse local service</small>
            </span>
          </a>
          <div className="nav-actions">
            <a className="text-link" href="#pricing">Pricing</a>
            <a className="button button-small" href="#book">Get a Quote</a>
          </div>
        </nav>

        <section className="hero" id="top">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot" /> Weber County • 14ft high-wall trailer</div>
            <h1>Clear the mess.<br /><span>Reclaim the space.</span></h1>
            <p className="hero-sub">
              Trailer-sized junk removal for garages, move-outs, rental cleanups, furniture,
              appliances, yard debris, and full-property cleanouts. Send the details, reserve
              the pickup, and choose a normal-business-hours appointment.
            </p>
            <div className="hero-actions">
              <a className="button" href="#book">Get My Haul Quote</a>
              <a className="button button-secondary" href={smsHref}>Text Photos</a>
            </div>
            <div className="trust-row" aria-label="Service highlights">
              <span>Local crew</span><span>Up-front range</span><span>Secure Stripe deposit</span><span>Calendar booking</span>
            </div>
          </div>

          <aside className="hero-console" aria-label="Booking path">
            <div className="console-head">
              <span className="status-chip">BOOKING SYSTEM ONLINE</span>
              <span className="source-chip">SOURCE: {attribution.referral.toUpperCase()}</span>
            </div>
            <div className="trailer-art" aria-hidden="true">
              <svg viewBox="0 0 560 230" role="img">
                <path d="M44 68h350l42 34v64H44z" className="trailer-body" />
                <path d="M394 68h64l53 55v43h-75v-64z" className="truck-cab" />
                <path d="M511 166h35" className="hitch" />
                <circle cx="131" cy="177" r="27" className="wheel" />
                <circle cx="348" cy="177" r="27" className="wheel" />
                <circle cx="466" cy="177" r="24" className="wheel" />
                <path d="M64 92h302M64 119h302" className="trailer-line" />
              </svg>
            </div>
            <div className="flow-list">
              <div><b>01</b><span>Describe the load</span><em>2 minutes</em></div>
              <div><b>02</b><span>Pay dispatch deposit</span><em>$150 applied</em></div>
              <div><b>03</b><span>Book pickup window</span><em>Mon–Fri</em></div>
              <div><b>04</b><span>We haul it away</span><em>Done</em></div>
            </div>
          </aside>
        </section>

        {(checkoutCancelled || checkoutError) && (
          <div className="alert-banner" role="alert">
            {checkoutError
              ? 'Checkout could not start. Your card was not charged. Please try again or text us.'
              : 'Your reservation was not completed. Your card was not charged, and your form details are still here.'}
          </div>
        )}

        <section className="metric-strip" aria-label="Service facts">
          <div><strong>14FT</strong><span>High-wall dump trailer</span></div>
          <div><strong>$150</strong><span>Deposit applied to job</span></div>
          <div><strong>9–5</strong><span>Normal business hours</span></div>
          <div><strong>WEBER</strong><span>County-first routing</span></div>
        </section>

        <section className="section" id="pricing">
          <div className="section-heading">
            <div>
              <span className="section-kicker">LOAD-BASED PRICING</span>
              <h2>Enough capacity to make a cleanout count.</h2>
            </div>
            <p>
              These are planning ranges, not bait prices. Final pricing is confirmed before
              anything is loaded and depends on volume, weight, access, labor, and disposal fees.
            </p>
          </div>
          <div className="price-grid">
            <article className="price-card">
              <span className="load-meter"><i style={{width:'22%'}} /></span>
              <small>ROUTE-FIT MINIMUM</small><h3>$275+</h3>
              <p>Small curb or driveway pickup that fits an existing Weber County route.</p>
            </article>
            <article className="price-card">
              <span className="load-meter"><i style={{width:'38%'}} /></span>
              <small>STARTER LOAD</small><h3>$375–$525</h3>
              <p>Furniture, appliances, garage corners, boxes, and smaller move-out piles.</p>
            </article>
            <article className="price-card featured">
              <span className="best-value">MOST POPULAR</span>
              <span className="load-meter"><i style={{width:'58%'}} /></span>
              <small>HALF TRAILER</small><h3>$575–$750</h3>
              <p>A meaningful cleanout with labor, hauling, and disposal built into the range.</p>
            </article>
            <article className="price-card">
              <span className="load-meter"><i style={{width:'100%'}} /></span>
              <small>FULL 14FT TRAILER</small><h3>$950–$1,400</h3>
              <p>Large garages, rentals, estates, sheds, and major property cleanouts.</p>
            </article>
          </div>
          <p className="pricing-note">
            Concrete, dirt, roofing, tile, shingles, hot tubs, sheds, paint, chemicals, tires,
            mattresses, refrigerators, and unusually heavy material require custom confirmation.
          </p>
        </section>

        <section className="section service-section">
          <div className="section-heading">
            <div><span className="section-kicker">WHAT WE REMOVE</span><h2>One crew. One trailer. A lot more room.</h2></div>
            <p>Residential, landlord, estate, light commercial, and contractor cleanup jobs throughout Weber County.</p>
          </div>
          <div className="service-grid">
            {[
              ['Garage & basement cleanouts','Boxes, furniture, storage overflow, household junk.'],
              ['Move-outs & rental turns','Left-behind belongings, tenant debris, quick property resets.'],
              ['Furniture & appliances','Couches, beds, tables, cabinets, and accepted appliances.'],
              ['Yard & storm debris','Branches, fencing, outdoor clutter, and non-hazardous debris.'],
              ['Estate & downsizing','Respectful, organized removal for larger household transitions.'],
              ['Contractor cleanup','Light demolition debris and jobsite cleanup after material review.'],
            ].map(([title, copy], index) => (
              <article className="service-card" key={title}><b>{String(index + 1).padStart(2,'0')}</b><h3>{title}</h3><p>{copy}</p></article>
            ))}
          </div>
        </section>

        <section className="section booking-section" id="book">
          <div className="booking-intro">
            <span className="section-kicker">RESERVE A PICKUP</span>
            <h2>Give us the load. We’ll handle the rest.</h2>
            <p>
              Your $150 dispatch deposit goes through secure Stripe Checkout and is credited
              toward the final job total. After payment, you’ll choose the exact Calendly window.
            </p>
            <ul className="check-list">
              <li>No surprise loading before price approval</li>
              <li>Deposit credited to completed service</li>
              <li>Normal business-hours scheduling</li>
              <li>Automatic operator notification</li>
            </ul>
          </div>
          <BookingForm attribution={attribution} bookingPhone={bookingPhone} />
        </section>

        <section className="section areas-section">
          <div className="areas-copy">
            <span className="section-kicker">LOCAL ROUTING</span>
            <h2>Built for Weber County.</h2>
            <p>
              Primary service includes Ogden, Roy, West Haven, Riverdale, South Ogden,
              North Ogden, Harrisville, Pleasant View, Plain City, and nearby Weber County areas.
              Outlying jobs can be reviewed based on route and load size.
            </p>
          </div>
          <div className="route-map" aria-hidden="true">
            <span className="route-line route-one" /><span className="route-line route-two" />
            {['OGDEN','ROY','WEST HAVEN','NORTH OGDEN','RIVERDALE'].map((city, i) => <i key={city} className={`map-pin pin-${i+1}`}>{city}</i>)}
          </div>
        </section>

        <section className="section faq-section">
          <div className="section-heading"><div><span className="section-kicker">STRAIGHT ANSWERS</span><h2>Before we roll the truck.</h2></div></div>
          <div className="faq-grid">
            <details><summary>Is the online price the final price?</summary><p>No. The ranges help you choose the right load category. We confirm the final total before loading based on actual volume, weight, access, labor, and disposal requirements.</p></details>
            <details><summary>What does the $150 deposit do?</summary><p>It reserves dispatch and is applied to your completed job total. If we decline the job because we cannot safely or legally haul the material, the deposit is refunded.</p></details>
            <details><summary>Can I send photos?</summary><p>Yes. Add a share link in the form or use the Text Photos button. Wide shots plus close-ups of heavy or special items produce the fastest quote.</p></details>
            <details><summary>What can’t go in the trailer?</summary><p>Hazardous chemicals, explosives, biohazards, unknown liquids, and prohibited landfill materials are not accepted. Heavy materials and specialty items require approval first.</p></details>
          </div>
        </section>

        <section className="final-cta">
          <div><span className="section-kicker">READY WHEN YOU ARE</span><h2>Your space is worth more than the junk in it.</h2></div>
          <a className="button" href="#book">Start My Booking</a>
        </section>

        <footer className="footer">
          <div><strong>Weber Junk Rescue</strong><span>A Misfit Mediahouse local service</span></div>
          <p>Load ranges are estimates. Final price is approved before loading. Service subject to access, safety, material, disposal, and route availability.</p>
        </footer>
      </div>
      <div className="mobile-cta"><a className="button" href="#book">Get Quote + Reserve</a></div>
    </main>
  );
}
