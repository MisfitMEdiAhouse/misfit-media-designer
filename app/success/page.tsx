export default function SuccessPage() {
  const calendly = process.env.NEXT_PUBLIC_CALENDLY_URL || '#';
  return (
    <main>
      <div className="wrap">
        <section className="hero">
          <div>
            <span className="pill">DEPOSIT RECEIVED</span>
            <h1>Your pickup is reserved.</h1>
            <p className="sub">Next step: book the exact pickup window. Brandon and the owner get notified after Stripe confirms payment. Final price is confirmed before loading.</p>
            <div className="btns">
              <a className="btn" href={calendly}>Book Pickup Window</a>
              <a className="btn alt" href="/">Back to Site</a>
            </div>
          </div>
          <aside className="command">
            <h2>What happens next</h2>
            <div className="steps" style={{gridTemplateColumns:'1fr'}}>
              <div className="card"><b>1. Calendar</b><p className="muted">Choose a normal business-hours window.</p></div>
              <div className="card"><b>2. Confirm</b><p className="muted">We confirm final price before loading.</p></div>
              <div className="card"><b>3. Gone</b><p className="muted">Truck, 14ft trailer, labor, haul, dump run.</p></div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
