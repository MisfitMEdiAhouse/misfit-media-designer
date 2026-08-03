type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || '' : value || '';
}

export const metadata = {
  title: 'Campaign Command',
  robots: { index: false, follow: false },
};

export default async function CampaignPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const key = first(query.key);
  if (!process.env.SETUP_KEY || key !== process.env.SETUP_KEY) {
    return <main className="setup-shell"><div className="setup-card"><h1>Campaign access denied.</h1></div></main>;
  }

  const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://YOUR-LIVE-DOMAIN').replace(/\/$/, '');
  const links = {
    facebook: `${site}?ref=FACEBOOK&utm_source=facebook&utm_medium=organic&utm_campaign=weber-launch`,
    instagram: `${site}?ref=INSTAGRAM&utm_source=instagram&utm_medium=social&utm_campaign=weber-launch`,
    brandon: `${site}?ref=BRANDON&utm_source=brandon&utm_medium=referral&utm_campaign=weber-launch`,
    ogdenFlyer: `${site}?ref=FLYER-OGDEN&utm_source=door-hanger&utm_medium=qr&utm_campaign=ogden-launch`,
    royFlyer: `${site}?ref=FLYER-ROY&utm_source=door-hanger&utm_medium=qr&utm_campaign=roy-launch`,
  };

  return (
    <main className="setup-shell">
      <div className="eyebrow"><span className="live-dot" /> Private campaign command</div>
      <h1 style={{fontSize:'clamp(42px,8vw,78px)',lineHeight:.9,letterSpacing:'-.07em',margin:'22px 0'}}>Fill the trailer.<br /><span style={{color:'var(--lime)'}}>Prove the machine.</span></h1>

      <div className="setup-card">
        <h2>Tracked launch links</h2>
        {Object.entries(links).map(([name, link]) => <p key={name}><b>{name}</b><br /><code style={{wordBreak:'break-all'}}>{link}</code></p>)}
        <p><a className="button button-small" href={`/qr?ref=FLYER-OGDEN`}>Open Ogden QR Flyer</a></p>
      </div>

      <div className="setup-card">
        <h2>Facebook Marketplace / local group post</h2>
        <pre style={{whiteSpace:'pre-wrap',fontFamily:'inherit',lineHeight:1.55,color:'var(--muted)'}}>{`WEBER COUNTY JUNK REMOVAL — 14FT HIGH-WALL TRAILER

Garage packed? Moving out? Rental left full of junk? Send us the address, load details, and photos for a fast planning range.

• Garage and basement cleanouts
• Furniture and accepted appliances
• Move-outs and rental turns
• Yard debris and property cleanup
• Half and full trailer loads

Route-fit minimum starts at $275. Half-trailer cleanouts generally run $575–$750. Full 14ft trailer cleanouts generally run $950–$1,400. Final price is approved before loading.

Reserve through secure Stripe Checkout and choose the pickup window online:
${links.facebook}`}</pre>
      </div>

      <div className="setup-card">
        <h2>Instagram / Reel caption</h2>
        <pre style={{whiteSpace:'pre-wrap',fontFamily:'inherit',lineHeight:1.55,color:'var(--muted)'}}>{`A 14ft trailer can give you your garage back.

Weber County cleanouts: garages, move-outs, furniture, yard junk, rentals, and trailer-sized loads. Send the job details, reserve the pickup, and choose the time online.

Book here: ${links.instagram}

#OgdenUtah #WeberCounty #JunkRemoval #GarageCleanout #UtahSmallBusiness`}</pre>
      </div>

      <div className="setup-card">
        <h2>First five short-form videos</h2>
        <ol className="check-list">
          <li><b>Before/after:</b> “This garage was unusable this morning.” Show the pile, loading, empty floor, and trailer.</li>
          <li><b>Capacity proof:</b> “Here is what actually fits inside a 14ft high-wall trailer.” Walk the load before the dump.</li>
          <li><b>Price education:</b> “Why real junk removal is not a $99 pickup.” Explain truck, trailer, labor, fuel, and disposal without insulting customers.</li>
          <li><b>Speed:</b> Time-lapse one cleanout from arrival to swept space. End with the tracked booking URL.</li>
          <li><b>Local proof:</b> “Another Weber County mess gone.” Name the city, not the customer or address.</li>
        </ol>
      </div>

      <div className="setup-card">
        <h2>72-hour launch sequence</h2>
        <ol className="check-list">
          <li>Complete one internal test booking with Stripe test mode and verify owner/Brandon notifications.</li>
          <li>Switch to live mode only after the full test passes.</li>
          <li>Post the Facebook copy to Marketplace and relevant Weber County groups without spamming duplicates.</li>
          <li>Publish the Instagram/Reel post and put the tracked Instagram link in the bio.</li>
          <li>Print or save separate Ogden and Roy QR flyers so each neighborhood has its own attribution.</li>
          <li>Photograph every completed job with customer/property privacy protected.</li>
          <li>Ask every completed customer for a Google review and referral after payment.</li>
        </ol>
      </div>

      <div className="setup-card">
        <h2>Referral rule</h2>
        <p className="pricing-note">Every person or flyer batch gets a unique `ref` code. Commission is earned only after the job is completed and fully paid. Set the exact payout before giving codes to outside reps.</p>
      </div>
    </main>
  );
}
