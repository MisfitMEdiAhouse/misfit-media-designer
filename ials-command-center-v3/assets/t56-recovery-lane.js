'use strict';

/* IALS T56 / 501D RECOVERY LANE
   Public code contains sanitized lot summaries and non-sensitive pricing status only.
   Serial numbers, detailed condition notes, vendor price books and exact repair rates
   live in the private Misfit Command Center entities AviationInventoryLot and RepairPriceCatalog.
*/
(() => {
  if (window.__IALS_T56_RECOVERY_LANE__) return;
  window.__IALS_T56_RECOVERY_LANE__ = true;

  const lots = [
    {pn:'6850506',qty:91,nsn:'3110-01-399-3997',state:'P0 — LIVE BUYER',note:'Alt 23058594. Existing D&D OH demand. Safety/source approval gate.'},
    {pn:'6823232',qty:37,nsn:'—',state:'VERIFY',note:'Quantity tally captured; exact NSN/application still under review.'},
    {pn:'6845296',qty:26,nsn:'3110-00-078-5676',state:'VERIFY / CONDITION',note:'Condition notes include good, damage, reject and corrosion observations.'},
    {pn:'68229354 → 6829354?',qty:27,nsn:'3110-00-078-5676 candidate',state:'CONFLICT',note:'Raw handwritten P/N retained. Do not normalize until physical tag confirms 6829354.'},
    {pn:'6873732',qty:27,nsn:'3110-01-419-7975',state:'VERIFY',note:'Serial list captured privately; reconcile physical stock/trace.'},
    {pn:'6876007',qty:24,nsn:'3110-00-078-5669 cross-ref',state:'VERIFY',note:'Cross-reference cluster under 6829360; exact applicability must be verified.'},
    {pn:'676004',qty:17,nsn:'3110-01-537-0268',state:'HOLD — APPLICATION',note:'Public source points to Pratt & Whitney, not proven T56. Keep out of T56 marketing.'},
    {pn:'6873233',qty:6,nsn:'3110-00-182-8688',state:'CONFLICT',note:'Qty sheet says 6; private serial sheet contains ~14 entries. Reconcile before marketing.'},
    {pn:'462960',qty:6,nsn:'3110-00-182-8689',state:'VERIFY',note:'Candidate cross-reference to 6873232; serial sheet label #62960 requires confirmation.'},
    {pn:'NJ-217 VAA',qty:2,nsn:'—',state:'HOLD — ID',note:'Exact suffix/application unknown; generic NJ217 resemblance is not enough.'},
    {pn:'6854949',qty:'~19*',nsn:'—',state:'INFERRED ONLY',note:'19 serial entries captured privately; no confirmed physical quantity total.'},
    {pn:'6829358',qty:'~15*',nsn:'—',state:'INFERRED ONLY',note:'15 serial entries captured privately; base data cross-ref cluster only.'},
    {pn:'6873232',qty:'?',nsn:'3110-00-182-8689',state:'VERIFY',note:'Multiple serial/condition sheets captured privately; current on-hand qty unresolved.'}
  ];

  const pricing = {
    sourceRows:94,
    inventoryMatches:22,
    directCompare:4,
    knownQtyMatches:12,
    updated:'Aug 13 2026',
    priority:[
      {pn:'6850506',qty:91,status:'2 repair routes priced',decision:'P0 — existing D&D OH demand; compare scope, release docs and TAT before authorizing one unit.'},
      {pn:'6845296',qty:26,status:'2 repair routes priced',decision:'Large vendor-price spread; compare work scope and release basis before choosing route.'},
      {pn:'6873732',qty:27,status:'current OH price on file',decision:'Buyer-first lane: find live demand before authorizing shelf overhaul.'},
      {pn:'6876007',qty:24,status:'current OH price on file',decision:'Keep separate from 6876006; verify identity/trace before repair.'},
      {pn:'6876006',qty:'?',status:'2 repair routes priced',decision:'Mario confirms IALS stock; physical qty/serials/trace still need capture.'},
      {pn:'6829354',qty:'?',status:'1 priced route + 1 R&D hold',decision:'Resolve handwritten P/N conflict and physical identity before repair routing.'}
    ]
  };

  const prospects = [
    {p:'P0',name:'D&D Enterprises',lane:'Existing buyer',why:'P/N 23058594 / 6850506 Qty 1 — order in hand, wants OH after their unit scrapped.',next:'Get real OH quote/TAT/release path for one best-documented 6850506 unit.'},
    {p:'P0',name:'King Aero Management',lane:'US T56/501D buyer / consignment / MRO',why:'Supports T56/501D AMCs and worldwide end users; offers spare-parts, consignment, component/engine repairs.',next:'Buyer replied that they purchase 501D22/T56 inventory. Send sanitized, verified inventory list under human gate.'},
    {p:'P0',name:'Segers Aero',lane:'2026 USAF JFOC awardee / Rolls-Royce AMC',why:'Awarded T56 JFOC IDIQ and supports T56/501D engine/components.',next:'Request bearing/core purchase appetite + repair capability/price book; do not claim our lots are JFOC eligible.'},
    {p:'P0',name:'StandardAero',lane:'2026 USAF JFOC awardee / T56 depot',why:'Awarded JFOC and has extensive T56/501D component repair/remanufacturing capability.',next:'Route sanitized inventory/capability inquiry to T56 supply-chain / material team.'},
    {p:'P0',name:'Turbopower',lane:'2026 USAF JFOC awardee / Rolls-Royce AMC',why:'Full T56/501D repair/overhaul, parts and accessory support.',next:'Request current wanted bearing/core list and OH/inspection pricing by exact P/N.'},
    {p:'P1',name:'AllClear Aerospace & Defense',lane:'C-130 distributor / repair management',why:'Global C-130/L-100 parts, repairs, sustainment and C-130 supply-chain access.',next:'Ask procurement whether they purchase legacy T56 bearing inventory or accept consignment/repairable cores.'},
    {p:'P1',name:'AIROD',lane:'International T56/501D MRO',why:'Malaysia T56/501D MRO with international military/commercial program.',next:'Compliance-gated only: first determine export jurisdiction before sharing controlled inventory detail.'},
    {p:'P1',name:'Rolls-Royce / Boeing Aviall',lane:'OEM / global authorized distribution',why:'Rolls-Royce identifies Aviall as global authorized distributor for T56 engines, parts, modules and tooling.',next:'Map exact approved-source/distribution path and determine whether any legacy lots have recoverable OEM-channel value.'}
  ];

  const esc = v => window.IALS?.esc ? window.IALS.esc(v) : String(v ?? '');
  const qtySheetTotal = 263;
  const serialInferred = 34;
  const privateLotRecords = 60;

  function inject(){
    if (document.getElementById('t56RecoveryPanel')) return;
    const tabs=document.querySelector('.tabs'), app=document.getElementById('adminApp');
    if(!tabs||!app){setTimeout(inject,100);return;}
    const tab=document.createElement('button');
    tab.className='btn dark tab'; tab.dataset.panel='t56RecoveryPanel'; tab.textContent='T56 / 501D Recovery';
    tab.addEventListener('click',()=>window.IALS?.admin?.switch('t56RecoveryPanel'));
    tabs.appendChild(tab);
    const panel=document.createElement('section'); panel.id='t56RecoveryPanel'; panel.className='panel';
    panel.innerHTML=`
      <div class="section-head"><div><span class="eyebrow">Bearing recovery · C-130/T56 · human gated</span><h2>T56 / 501D <span>Recovery Command.</span></h2></div><p>Buyer-first recovery: demand → exact identity → trace/condition → repair economics → compliance/source approval → human-approved quote.</p></div>
      <div class="notice danger"><b>CONTROL RULE:</b> Uploaded serials, detailed condition notes, vendor price books and exact repair rates are stored in the private Misfit Command Center, not exposed in this public repository. No lot is JFOC-, flight-, export-, or source-approved merely because its P/N appears in a T56 notebook or repair price list.</div>
      <div class="kpi-grid" style="margin-top:14px">
        <div class="kpi"><b>${privateLotRecords}</b><span>private inventory-lot records</span></div>
        <div class="kpi"><b>${qtySheetTotal}</b><span>qty-sheet units captured</span></div>
        <div class="kpi"><b>${pricing.inventoryMatches}</b><span>inventory ↔ repair-price matches</span></div>
        <div class="kpi"><b>${pricing.sourceRows}</b><span>current repair-price P/N rows</span></div>
      </div>
      <div class="notice" style="margin-top:12px">${pricing.directCompare} P/Ns currently have direct multi-shop pricing comparisons. ${pricing.knownQtyMatches} priced matches also have a known warehouse quantity. Exact vendor rates remain in the private RepairPriceCatalog.</div>

      <div class="section-head" style="margin-top:24px"><div><span class="eyebrow">Repair economics · updated ${pricing.updated}</span><h2>Pricing intelligence <span>is live.</span></h2></div><p>Current Rolls-Royce/Allison repair pricing and direct quote data are matched against IALS inventory so overhaul decisions can be driven by buyer demand and margin instead of guesswork.</p></div>
      <div class="table-scroll"><table><thead><tr><th>P/N</th><th>IALS Qty</th><th>Pricing status</th><th>Decision gate</th></tr></thead><tbody>${pricing.priority.map(x=>`<tr><td class="pn">${esc(x.pn)}</td><td>${esc(x.qty)}</td><td><span class="chip">${esc(x.status)}</span></td><td>${esc(x.decision)}</td></tr>`).join('')}</tbody></table></div>
      <div class="next" style="margin-top:14px"><span class="eyebrow">Operator rule</span><h2>Do not overhaul inventory just because a price exists.</h2><p>Use the private RepairPriceCatalog to compare inspection/OH cost, TAT, scope and release basis. Authorize repair only after exact identity/trace, live buyer demand or a defensible stocking thesis, compliance/source approval and target margin are all reviewed.</p></div>

      <div class="section-head" style="margin-top:26px"><div><span class="eyebrow">Sanitized highlights</span><h2>Captured <span>inventory.</span></h2></div><p>These are public-safe highlights only. The full ${privateLotRecords}-record inventory, serials and detailed conditions remain private.</p></div>
      <div class="table-scroll"><table><thead><tr><th>P/N</th><th>Qty</th><th>NSN / cluster</th><th>Status</th><th>Operator note</th></tr></thead><tbody>${lots.map(x=>`<tr><td class="pn">${esc(x.pn)}</td><td>${esc(x.qty)}</td><td>${esc(x.nsn)}</td><td><span class="chip">${esc(x.state)}</span></td><td>${esc(x.note)}</td></tr>`).join('')}</tbody></table></div>
      <div class="section-head" style="margin-top:26px"><div><span class="eyebrow">Worldwide buyer / MRO map</span><h2>Prospecting <span>lanes.</span></h2></div><p>Domestic T56 buyers/MROs first; foreign military lanes remain classification/export gated.</p></div>
      <div class="grid">${prospects.map(x=>`<article class="card"><span class="tag">${esc(x.p)} · ${esc(x.lane)}</span><h3>${esc(x.name)}</h3><p>${esc(x.why)}</p><p class="subtle"><b>Next:</b> ${esc(x.next)}</p></article>`).join('')}</div>
      <div class="next" style="margin-top:18px"><span class="eyebrow">$343.2M ecosystem signal</span><h2>USAF T56 JFOC = repair/overhaul contract, not automatic bearing eligibility.</h2><p>The July 23, 2026 award is a maximum $343,201,556 IDIQ service contract to Segers, StandardAero and Turbopower for repair and overhaul of non-commercial aircraft parts for T56 engines used on C-130 aircraft. We treat those awardees as high-value supply-chain prospects, while exact NSN/ELIN, critical-safety/source-approval, replacement-material, trace and acceptance rules remain individual gates.</p></div>`;
    app.appendChild(panel);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true}); else inject();
})();
