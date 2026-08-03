export default function Page({ searchParams }: { searchParams?: { ref?: string } }) {
  const ref = (searchParams?.ref || 'DIRECT').toUpperCase();
  return (
    <main>
      <div className="wrap">
        <nav className="nav">
          <div className="brand">WEBER JUNK RESCUE <span className="pill">Powered by Misfit Mediahouse</span></div>
          <a className="btn alt" href="#book">Reserve Pickup</a>
        </nav>

        <section className="hero">
          <div>
            <span className="pill">14FT HIGH-WALL TRAILER • WEBER COUNTY</span>
            <h1>Trailer-sized junk cleanouts that actually show up.</h1>
            <p className="sub">Garage cleanouts, move-outs, rental cleanups, yard junk, furniture, appliances, and full trailer loads. Send job details, pay the dispatch deposit through our Stripe, book the pickup window, and Brandon gets notified.</p>
            <div className="btns">
              <a className="btn" href="#book">Send Photos + Book</a>
              <a className="btn alt" href="#pricing">See Pricing</a>
            </div>
            <div className="notice"><b>No $99 nonsense.</b> Dispatching a diesel truck, 14ft trailer, labor, fuel, and dump run has to make margin. This funnel sells real cleanouts, not charity runs.</div>
          </div>
          <aside className="command">
            <span className="pill">LIVE FUNNEL CONTROL</span>
            <h2>Ad / QR → Deposit → Calendar → Brandon SMS</h2>
            <p className="muted">Referral source locked: <b>{ref}</b></p>
            <div className="meter"><span /></div>
            <div className="statgrid">
              <div className="stat"><b>$150</b><p className="muted">Dispatch deposit</p></div>
              <div className="stat"><b>$575+</b><p className="muted">Half trailer target</p></div>
              <div className="stat"><b>$950+</b><p className="muted">Full trailer target</p></div>
              <div className="stat"><b>9–5</b><p className="muted">Normal business hours</p></div>
            </div>
          </aside>
        </section>

        <section className="section" id="pricing">
          <h2>Pricing that leaves room to pay the subcontractor.</h2>
          <div className="cards">
            <div className="card"><h3>Minimum Dispatch</h3><div className="price">$275+</div><p className="muted">Small curb/driveway pickup only when it fits the route.</p></div>
            <div className="card"><h3>Starter Load</h3><div className="price">$375–$525</div><p className="muted">Furniture, appliance mix, garage corner, small move-out pile.</p></div>
            <div className="card"><h3>Half Trailer</h3><div className="price">$575–$750</div><p className="muted">Primary ad offer. Solid margin and worth showing up.</p></div>
            <div className="card"><h3>Full 14ft Trailer</h3><div className="price">$950–$1,400</div><p className="muted">Full garage, rental, shed, estate, or major cleanout.</p></div>
          </div>
        </section>

        <section className="section" id="book">
          <h2>Book / Request Quote</h2>
          <p className="muted">The form submits the job to the Stripe checkout flow. Stripe payment succeeds, then webhook sends the Brandon/owner notification.</p>
          <form className="formbox" action="/api/create-checkout-session" method="POST">
            <input type="hidden" name="referral" value={ref} />
            <div className="two">
              <div><label>Name</label><input name="name" required placeholder="Customer name" /></div>
              <div><label>Phone</label><input name="phone" required placeholder="Customer phone" /></div>
            </div>
            <label>Address / City</label><input name="address" required placeholder="Ogden, Roy, West Haven, North Ogden..." />
            <div className="two">
              <div><label>Load size</label><select name="loadSize"><option>Minimum Dispatch $275+</option><option>Starter Load $375-$525</option><option>Half Trailer $575-$750</option><option>Full 14ft Trailer $950-$1400</option><option>Custom Heavy/Special Quote</option></select></div>
              <div><label>Where is the junk?</label><select name="junkLocation"><option>Curb / driveway</option><option>Garage</option><option>Basement</option><option>Upstairs</option><option>Yard</option><option>Construction site</option></select></div>
            </div>
            <label>Describe the junk</label><textarea name="description" placeholder="Couches, boxes, old fence panels, appliances, garage pile, move-out trash..."></textarea>
            <label>Special/heavy items</label><input name="specialItems" placeholder="Mattress, fridge, tires, TV, dirt, concrete, shingles, hot tub, shed, etc." />
            <div className="two">
              <div><label>Preferred pickup window</label><input name="preferredWindow" placeholder="Mon-Fri normal business hours" /></div>
              <div><label>Photo link</label><input name="photoLink" placeholder="Google Photos/iCloud link, or text after deposit" /></div>
            </div>
            <div className="btns">
              <button className="btn" type="submit">Pay $150 Dispatch Deposit</button>
              <a className="btn alt" href="/success">Preview Success Page</a>
            </div>
            <p className="fine">Deposit applies to the final total. Final price is confirmed before loading. Heavy/special items can change the final quote.</p>
          </form>
        </section>

        <section className="section">
          <h2>Campaign plan</h2>
          <div className="steps">
            <div className="card"><h3>QR Links</h3><p className="muted">Use ?ref=BRANDON, ?ref=JON, ?ref=FLYER-OGDEN, ?ref=FACEBOOK, ?ref=INSTAGRAM for tracking.</p></div>
            <div className="card"><h3>Viral Hook</h3><p className="muted">“We fill a 14ft trailer and make the mess disappear. Send photos, reserve pickup, done.”</p></div>
            <div className="card"><h3>Ops Flow</h3><p className="muted">Customer pays your Stripe. Brandon gets notified. Brandon performs as sub. You control collection and payout.</p></div>
          </div>
        </section>

        <footer className="footer">© Weber Junk Rescue / Misfit Mediahouse. Brandon trailer operator. Stripe + Calendly + Twilio ready.</footer>
      </div>
    </main>
  );
}
