import { leads } from '../../../data/leads';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || '' : value || '';
}

export const metadata = {
  title: 'Lead Radar',
  robots: { index: false, follow: false },
};

export default async function LeadRadarPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const key = first(query.key);
  if (!process.env.SETUP_KEY || key !== process.env.SETUP_KEY) {
    return <main className="setup-shell"><div className="setup-card"><h1>Lead Radar access denied.</h1></div></main>;
  }

  const sorted = [...leads].sort((a, b) => b.score - a.score);
  const propertyManagers = sorted.filter((lead) => lead.category.includes('Property') || lead.category.includes('Apartment'));
  const realEstate = sorted.filter((lead) => lead.category.includes('Real Estate') || lead.category.includes('Broker'));
  const ready = sorted.filter((lead) => lead.status === 'READY').length;
  const averageScore = Math.round(sorted.reduce((sum, lead) => sum + lead.score, 0) / Math.max(sorted.length, 1));

  return (
    <main className="setup-shell lead-radar-shell">
      <div className="eyebrow"><span className="live-dot" /> Private growth command</div>
      <h1 style={{fontSize:'clamp(42px,8vw,78px)',lineHeight:.9,letterSpacing:'-.07em',margin:'22px 0'}}>Lead Radar<br /><span style={{color:'var(--lime)'}}>Weber Junk Rescue</span></h1>

      <div className="lead-scorecard">
        <article><strong>{sorted.length}</strong><span>verified public contacts</span></article>
        <article><strong>{ready}</strong><span>ready for outreach</span></article>
        <article><strong>{propertyManagers.length}</strong><span>property / apartment lane</span></article>
        <article><strong>{averageScore}</strong><span>average fit score</span></article>
      </div>

      <div className="pipeline-strip">
        <div><small>DISCOVER</small><strong>Public business sources</strong></div>
        <b>→</b><div><small>VERIFY</small><strong>Email + local fit</strong></div>
        <b>→</b><div><small>OUTREACH</small><strong>Targeted B2B email</strong></div>
        <b>→</b><div><small>BOOK</small><strong>Tracked site / calendar</strong></div>
        <b>→</b><div><small>REPEAT</small><strong>Vendor account</strong></div>
      </div>

      <section className="setup-card">
        <div className="panel-head"><div><p className="eyebrow">P0 LANE</p><h2>Property managers & apartment operators</h2></div><span className="status-chip">REPEAT JOB POTENTIAL</span></div>
        <div className="lead-grid">
          {propertyManagers.map((lead) => <LeadCard key={lead.id} lead={lead} />)}
        </div>
      </section>

      <section className="setup-card">
        <div className="panel-head"><div><p className="eyebrow">P1 LANE</p><h2>Brokerages, agents & investors</h2></div><span className="source-chip">REFERRAL NETWORK</span></div>
        <div className="lead-grid">
          {realEstate.map((lead) => <LeadCard key={lead.id} lead={lead} />)}
        </div>
      </section>

      <section className="setup-card">
        <div className="panel-head"><div><p className="eyebrow">EMAIL DOCTRINE</p><h2>Sniper outreach, not spam.</h2></div><span className="status-chip">DELIVERABILITY FIRST</span></div>
        <div className="decision-grid">
          <article><small>EVIDENCE</small><strong>Only publicly listed business contact addresses</strong></article>
          <article><small>FIT</small><strong>Turnovers, seller prep, abandoned items, estates, investor rehab</strong></article>
          <article><small>MESSAGE</small><strong>Short local vendor offer with tracked booking URL</strong></article>
          <article><small>STOP RULE</small><strong>No reply after sequence or opt-out → do not keep blasting</strong></article>
        </div>
      </section>

      <section className="setup-card">
        <div className="panel-head"><div><p className="eyebrow">NEXT VERTICALS</p><h2>Free lead-gen expansion map</h2></div></div>
        <div className="service-grid">
          {[
            ['Estate / probate','Estate-sale operators, probate attorneys, executors, senior move managers.'],
            ['Moving / storage','Moving companies, storage facilities, abandoned-unit cleanouts.'],
            ['Restoration','Water/fire remediation firms that need debris removed fast.'],
            ['Contractors / flippers','Remodelers, GCs, house flippers, flooring, roofing, demo crews.'],
            ['Senior living','Downsizing, unit turns, family cleanouts, assisted-living transitions.'],
            ['Commercial / HOA','Retail managers, office parks, HOA managers, maintenance coordinators.'],
          ].map(([title, copy], index) => <article className="service-card" key={title}><b>{String(index + 1).padStart(2,'0')}</b><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>
    </main>
  );
}

function LeadCard({ lead }: { lead: (typeof leads)[number] }) {
  const subject = encodeURIComponent(`Local junk-removal vendor for ${lead.business}`);
  const body = encodeURIComponent(`Hi ${lead.business} team,\n\nWe run a local Weber County junk-removal service with a 14ft high-wall dump trailer and online booking. We help with tenant move-outs, abandoned items, seller prep, garage/property cleanouts, and turnover debris.\n\nIf you ever need a fast local haul, I’d like to be one of the vendors you can text or book.\n\nReply if you'd like our vendor pricing / booking link.\n\nMisfit Mediahouse / Weber Junk Rescue\n\nIf this isn't relevant, reply no thanks and I won't follow up.`);
  return (
    <article className="lead-card">
      <div className="lead-card-head"><span className="status-chip">{lead.status}</span><b>{lead.score}</b></div>
      <h3>{lead.business}</h3>
      <p className="lead-meta">{lead.category} • {lead.city}</p>
      <p>{lead.reason}</p>
      <div className="lead-contact"><a href={`mailto:${lead.email}?subject=${subject}&body=${body}`}>{lead.email}</a>{lead.phone ? <span>{lead.phone}</span> : null}</div>
      <div className="lead-actions"><a className="button button-small" href={`mailto:${lead.email}?subject=${subject}&body=${body}`}>Draft Outreach</a><a className="button button-secondary button-small" href={lead.sourceUrl}>Verify Source</a></div>
    </article>
  );
}
