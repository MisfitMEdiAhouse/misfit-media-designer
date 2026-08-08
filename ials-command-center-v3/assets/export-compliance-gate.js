'use strict';

/*
  IALS EXPORT COMPLIANCE + QUOTE GATE
  -----------------------------------
  Browser-local workflow aid only. No customer, end-user, pricing, license,
  screening, or technical data is hard-coded here. Records stay in this browser.
  The module intentionally separates:
    1) pre-quote intake;
    2) party/end-use screening;
    3) item jurisdiction/classification;
    4) license determination;
    5) quote approval;
    6) shipment/release approval.
  Software does not make a legal determination. A qualified human reviewer owns
  classification, licensing, sanctions/end-use analysis, and final release.
*/
(() => {
  if (window.__IALS_EXPORT_GATE__) return;
  window.__IALS_EXPORT_GATE__ = true;

  const STORAGE_KEY = 'ials_export_gate_v1';
  const SCREENING_SOURCES = [
    ['U.S. Consolidated Screening List', 'https://www.trade.gov/consolidated-screening-list'],
    ['BIS Interactive Commerce Control List', 'https://www.bis.gov/regulations/ear/interactive-commerce-control-list'],
    ['EAR Part 744 — End-use / End-user Controls', 'https://www.bis.gov/regulations/ear/744'],
    ['eCFR ITAR §126.1', 'https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M/part-126/section-126.1']
  ];

  const esc = value => window.IALS?.esc
    ? window.IALS.esc(value)
    : String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));

  const norm = value => String(value || '').trim().toUpperCase();
  const val = id => document.getElementById(id)?.value?.trim() || '';
  const checked = id => !!document.getElementById(id)?.checked;

  function emptyDb() { return { version: 1, records: [], audit: [] }; }
  function getDb() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!parsed || !Array.isArray(parsed.records)) return emptyDb();
      parsed.audit = Array.isArray(parsed.audit) ? parsed.audit : [];
      return parsed;
    } catch (error) {
      console.error('IALS export gate read failed', error);
      return emptyDb();
    }
  }
  function saveDb(db) { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }
  function audit(db, id, action, detail = '') {
    db.audit.unshift({ id: Date.now() + Math.random(), recordId: id, action, detail, at: new Date().toISOString() });
    db.audit = db.audit.slice(0, 1000);
  }

  function isChina(record) {
    const destination = norm(record.destination);
    return destination === 'CHINA' || destination === 'PRC' || destination.includes('PEOPLE\'S REPUBLIC OF CHINA') || destination.includes('PEOPLES REPUBLIC OF CHINA');
  }

  function classificationFamily(record) {
    const c = norm(record.classification);
    if (!c || c === 'UNKNOWN' || c === 'UNRESOLVED') return 'UNRESOLVED';
    if (c.includes('USML') || c.includes('ITAR')) return 'USML';
    if (c.includes('9A619') || c.includes('600 SERIES') || c.includes('600-SERIES')) return '600_SERIES';
    if (c.includes('9A991')) return '9A991';
    if (c.includes('2A001')) return '2A001';
    if (c.includes('2A101')) return '2A101';
    if (c.includes('2A991')) return '2A991';
    if (c.includes('EAR99')) return 'EAR99';
    return 'OTHER';
  }

  function decision(record) {
    const blockers = [];
    const warnings = [];
    const family = classificationFamily(record);
    const china = isChina(record);
    const screening = norm(record.screeningResult);
    const license = norm(record.licenseDetermination);
    const military = norm(record.militaryEndUse);

    if (!record.buyer) blockers.push('Buyer legal identity is missing.');
    if (!record.endUser) blockers.push('Ultimate end user is missing.');
    if (!record.endUse) blockers.push('Detailed end use is missing.');
    if (!record.destination) blockers.push('Destination country is missing.');
    if (!record.part) blockers.push('Part number is missing.');
    if (family === 'UNRESOLVED') blockers.push('Item jurisdiction / classification is unresolved.');
    if (!record.classificationEvidence) blockers.push('Classification evidence/source is not recorded.');
    if (!screening || screening === 'NOT SCREENED') blockers.push('Restricted-party screening has not been completed.');
    if (screening === 'POSSIBLE MATCH' || screening === 'CONFIRMED MATCH') blockers.push(`Screening result is ${screening}. Resolve before proceeding.`);
    if (!record.screeningDate) blockers.push('Screening date/time is missing.');
    if (!record.screeningEvidence) blockers.push('Screening sources/evidence are not recorded.');
    if (!record.consignee) warnings.push('Ultimate consignee not recorded.');
    if (!record.forwarder) warnings.push('Freight forwarder / routing not recorded.');
    if (!record.eucReceived) blockers.push('End-use / end-user certification has not been received.');
    if (military === '' || military === 'UNKNOWN') blockers.push('Military/intelligence end-use status is unresolved.');
    if (record.redFlags) blockers.push('Unresolved red flags are present.');
    if (record.routeMismatch) blockers.push('Routing/payment/destination information is inconsistent.');

    if (china && family === 'USML') {
      blockers.push('China + USML/ITAR indication: STOP. Obtain qualified DDTC/export-counsel determination before a sales proposal, quote, transfer, or shipment.');
    }
    if (china && family === '600_SERIES') {
      blockers.push('China + 600-series / 9A619 indication: HOLD for BIS license/end-use/end-user review.');
    }
    if (china && ['9A991','2A001','2A101','2A991','OTHER'].includes(family) && (!license || license === 'UNRESOLVED')) {
      blockers.push('China destination + controlled/uncertain ECCN: license determination is unresolved.');
    }
    if (license === 'LICENSE REQUIRED' && !record.licenseApproved) blockers.push('License is required but approval is not recorded.');
    if (license === 'DENIED' || license === 'PROHIBITED') blockers.push(`License determination is ${license}.`);
    if (military === 'YES' && china) blockers.push('China military/intelligence end-use indication: stop and obtain qualified export-control review before proceeding.');

    const quoteReady = blockers.length === 0 && record.quoteReviewerApproved;
    const shipReady = quoteReady && record.traceDocsVerified && record.inventoryVerified && record.licenseSatisfied && record.releaseOfficerApproved;

    if (shipReady) return { level: 'green', status: 'READY FOR HUMAN RELEASE', blockers, warnings, quoteReady, shipReady };
    if (blockers.length === 0) return { level: 'amber', status: record.quoteReviewerApproved ? 'QUOTE APPROVED — SHIPMENT STILL GATED' : 'READY FOR QUOTE REVIEW', blockers, warnings, quoteReady, shipReady };
    if (china && (family === 'USML' || family === '600_SERIES') || screening === 'CONFIRMED MATCH' || license === 'DENIED' || license === 'PROHIBITED') {
      return { level: 'red', status: 'STOP / ESCALATE', blockers, warnings, quoteReady, shipReady };
    }
    return { level: 'hold', status: 'HOLD — DO NOT QUOTE YET', blockers, warnings, quoteReady, shipReady };
  }

  function recordFromForm() {
    return {
      id: Date.now(),
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      rfq: val('xgRfq'),
      buyer: val('xgBuyer'),
      buyerAddress: val('xgBuyerAddress'),
      endUser: val('xgEndUser'),
      endUserAddress: val('xgEndUserAddress'),
      consignee: val('xgConsignee'),
      forwarder: val('xgForwarder'),
      destination: val('xgDestination'),
      part: val('xgPart'),
      quantity: val('xgQty'),
      condition: val('xgCondition'),
      application: val('xgApplication'),
      classification: val('xgClassification'),
      classificationEvidence: val('xgClassEvidence'),
      screeningResult: val('xgScreeningResult'),
      screeningDate: val('xgScreeningDate'),
      screeningEvidence: val('xgScreeningEvidence'),
      endUse: val('xgEndUse'),
      militaryEndUse: val('xgMilitary'),
      eucReceived: checked('xgEuc'),
      redFlags: checked('xgRedFlags'),
      routeMismatch: checked('xgRouteMismatch'),
      licenseDetermination: val('xgLicense'),
      licenseEvidence: val('xgLicenseEvidence'),
      licenseApproved: checked('xgLicenseApproved'),
      licenseSatisfied: checked('xgLicenseSatisfied'),
      inventoryVerified: checked('xgInventoryVerified'),
      traceDocsVerified: checked('xgTraceVerified'),
      quoteReviewerApproved: checked('xgQuoteApproved'),
      releaseOfficerApproved: checked('xgReleaseApproved'),
      notes: val('xgNotes')
    };
  }

  function clearForm() {
    document.querySelectorAll('#exportGatePanel input, #exportGatePanel textarea, #exportGatePanel select').forEach(element => {
      if (element.type === 'checkbox') element.checked = false;
      else if (element.tagName === 'SELECT') element.selectedIndex = 0;
      else element.value = '';
    });
    const screening = document.getElementById('xgScreeningResult'); if (screening) screening.value = 'NOT SCREENED';
    const military = document.getElementById('xgMilitary'); if (military) military.value = 'UNKNOWN';
    const license = document.getElementById('xgLicense'); if (license) license.value = 'UNRESOLVED';
  }

  function addRecord() {
    const record = recordFromForm();
    const result = decision(record);
    const db = getDb();
    db.records.unshift(record);
    audit(db, record.id, 'CREATE', result.status);
    saveDb(db);
    clearForm();
    render();
    alert(`Export gate created: ${result.status}`);
  }

  function deleteRecord(id) {
    if (!confirm('Delete this browser-local export gate record?')) return;
    const db = getDb();
    db.records = db.records.filter(record => record.id !== id);
    audit(db, id, 'DELETE');
    saveDb(db);
    render();
  }

  function pushToComplianceCase(id) {
    const record = getDb().records.find(item => item.id === id);
    if (!record || !window.IALS?.admin) return;
    const db = IALS.admin.get();
    db.cases = Array.isArray(db.cases) ? db.cases : [];
    if (record.rfq && db.cases.some(c => String(c.sale || '') === String(record.rfq))) {
      alert('A six-gate compliance case already uses this RFQ/control number.');
      return;
    }
    const result = decision(record);
    const complianceCase = {
      id: Date.now(), created: new Date().toISOString(), status: 'HOLD — SCREENING REQUIRED',
      sale: record.rfq, buyer: record.buyer, buyerAddress: record.buyerAddress,
      endUser: record.endUser, endUserAddress: record.endUserAddress,
      part: record.part, serials: '', quantity: record.quantity,
      application: record.application, endUse: record.endUse,
      destination: record.destination, consignee: record.consignee, forwarder: record.forwarder,
      classification: record.classification,
      screening: [record.screeningResult, record.screeningDate, record.screeningEvidence].filter(Boolean).join(' | '),
      license: [record.licenseDetermination, record.licenseEvidence].filter(Boolean).join(' | '),
      notes: `Export Gate: ${result.status}. ${record.notes || ''}`.trim(),
      checks: {
        identity: !!record.buyer && !!record.endUser,
        screening: norm(record.screeningResult) === 'CLEAR',
        endUse: !!record.endUse && norm(record.militaryEndUse) !== 'UNKNOWN' && !!record.eucReceived && !record.redFlags,
        classification: classificationFamily(record) !== 'UNRESOLVED' && !!record.classificationEvidence,
        docs: !!record.traceDocsVerified && !!record.inventoryVerified,
        approval: false
      }
    };
    complianceCase.status = Object.values(complianceCase.checks).every(Boolean)
      ? 'READY FOR COMPLIANCE OFFICER RELEASE'
      : 'HOLD — SCREENING REQUIRED';
    db.cases.unshift(complianceCase);
    IALS.admin.save(db);
    const gateDb = getDb();
    audit(gateDb, id, 'PUSH_TO_SIX_GATE_CASE', record.rfq || record.part);
    saveDb(gateDb);
    IALS.admin.render();
    alert('Copied into the existing six-gate compliance dashboard.');
  }

  function copyBuyerRequest(id) {
    const record = getDb().records.find(item => item.id === id);
    if (!record) return;
    const text = `Subject: Compliance information required for ${record.rfq || record.part || 'your RFQ'}\n\nHello,\n\nBefore we can issue or finalize a commercial quotation, please provide the following for U.S. export-control review:\n\n• Full legal company name and registration details\n• Ultimate end user legal name and address\n• Ultimate consignee and delivery address\n• Intended engine / platform / application\n• Detailed civilian / commercial / industrial end use\n• Freight forwarder and planned shipping route\n• Confirmation whether any military, intelligence, weapons, nuclear, missile, UAV, or prohibited end use/end user is involved\n• End-use / end-user certification signed by an authorized representative\n\nAny quotation or transaction is subject to U.S. export-control review, restricted-party screening, item classification, license determination, availability, trace/document review, and final compliance approval.\n\nThank you.`;
    navigator.clipboard.writeText(text).then(() => alert('Compliance information request copied.')).catch(() => prompt('Copy this compliance request:', text));
  }

  function copyBackup() {
    const payload = JSON.stringify(getDb(), null, 2);
    navigator.clipboard.writeText(payload).then(() => alert('Export gate backup copied. Keep it secure.')).catch(() => prompt('Copy secure backup:', payload));
  }

  function statusBadge(result) {
    const map = { green: '#7fd09a', amber: '#f0c96f', red: '#ff7676', hold: '#ffbf69' };
    return `<span style="display:inline-block;border:1px solid ${map[result.level] || '#6d8592'};padding:5px 8px;border-radius:999px;font-size:10px;font-weight:800;letter-spacing:.05em">${esc(result.status)}</span>`;
  }

  function render() {
    const db = getDb();
    const rows = document.getElementById('exportGateRows');
    const blockedKpi = document.getElementById('exportBlockedKpi');
    if (blockedKpi) blockedKpi.textContent = db.records.filter(record => !decision(record).quoteReady).length;
    if (!rows) return;
    rows.innerHTML = db.records.map(record => {
      const result = decision(record);
      const blockers = result.blockers.length ? result.blockers.map(item => `<li>${esc(item)}</li>`).join('') : '<li>No automatic blockers detected; human review still required.</li>';
      return `<tr>
        <td>${esc(record.rfq || record.id)}</td>
        <td>${esc(record.part)}<br><span class="subtle">Qty ${esc(record.quantity || '—')}</span></td>
        <td>${esc(record.destination || '—')}</td>
        <td>${esc(record.classification || 'UNRESOLVED')}</td>
        <td>${statusBadge(result)}<details style="margin-top:7px"><summary>Why</summary><ul style="min-width:300px">${blockers}</ul></details></td>
        <td><div class="deal-actions">
          <button class="btn dark" type="button" onclick="IALSExportGate.copyBuyerRequest(${record.id})">Copy Buyer Compliance Request</button>
          <button class="btn dark" type="button" onclick="IALSExportGate.pushToComplianceCase(${record.id})">Push to 6-Gate Case</button>
          <button class="btn ghost" type="button" onclick="IALSExportGate.deleteRecord(${record.id})">Delete</button>
        </div></td>
      </tr>`;
    }).join('') || '<tr><td colspan="6">No export-gate records on this browser yet.</td></tr>';
  }

  function injectStyles() {
    if (document.getElementById('ialsExportGateStyles')) return;
    const style = document.createElement('style');
    style.id = 'ialsExportGateStyles';
    style.textContent = `
      .xg-lock{border:2px solid #d8aa4a;background:linear-gradient(135deg,#141206,#071722);padding:18px;border-radius:14px;margin:16px 0}
      .xg-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.xg-grid .full{grid-column:1/-1}
      .xg-checks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 16px;padding:12px;border:1px solid #314b5b;border-radius:10px;background:#061722}.xg-checks label{display:flex;gap:8px;align-items:flex-start}
      .xg-sources{display:flex;gap:7px;flex-wrap:wrap}.xg-sources a{font-size:10px}
      @media(max-width:760px){.xg-grid,.xg-checks{grid-template-columns:1fr}.xg-grid .full{grid-column:auto}}
    `;
    document.head.appendChild(style);
  }

  function injectUi() {
    if (document.getElementById('exportGatePanel')) return;
    const tabs = document.querySelector('.tabs');
    const app = document.getElementById('adminApp');
    if (!tabs || !app) return;
    injectStyles();

    const tab = document.createElement('button');
    tab.className = 'btn dark tab';
    tab.dataset.panel = 'exportGatePanel';
    tab.textContent = 'Export / Quote Gate';
    tab.addEventListener('click', () => { window.IALS?.admin?.switch('exportGatePanel'); render(); });
    tabs.insertBefore(tab, tabs.children[2] || null);

    const kpis = document.querySelector('.kpis');
    if (kpis && !document.getElementById('exportBlockedKpi')) {
      const kpi = document.createElement('div');
      kpi.className = 'kpi';
      kpi.innerHTML = '<b id="exportBlockedKpi">0</b><span>Quote / export holds</span>';
      kpis.appendChild(kpi);
    }

    const panel = document.createElement('section');
    panel.id = 'exportGatePanel';
    panel.className = 'panel';
    panel.innerHTML = `
      <div class="section-head"><div><span class="eyebrow">Revenue with a legal release path</span><h2>Export / Quote <span>Gate.</span></h2></div><p>Use this before pricing elevated-risk international RFQs. The goal is not to kill deals; it is to identify the legal path that lets IALS close and collect.</p></div>
      <div class="xg-lock"><strong>RULE:</strong> classification + parties + end use + license path must be known before a controlled or elevated-risk quote is approved. Quote approval does <strong>not</strong> equal shipment release. No signed EUC, screen result, or software checkbox overrides U.S. law or a required government authorization.</div>
      <div class="xg-sources">${SCREENING_SOURCES.map(([label, href]) => `<a class="btn ghost" href="${href}" target="_blank" rel="noopener">${esc(label)}</a>`).join('')}</div>
      <div class="form xg-grid" style="margin-top:16px">
        <label>RFQ / control number<input id="xgRfq" placeholder="ILSCVMR..."></label>
        <label>Destination country<input id="xgDestination" placeholder="China"></label>
        <label>Buyer legal name<input id="xgBuyer"></label>
        <label>Buyer legal address<input id="xgBuyerAddress"></label>
        <label>Ultimate end user<input id="xgEndUser"></label>
        <label>End user address<input id="xgEndUserAddress"></label>
        <label>Ultimate consignee<input id="xgConsignee"></label>
        <label>Freight forwarder / routing<input id="xgForwarder"></label>
        <label>Part number / NSN<input id="xgPart"></label>
        <label>Quantity<input id="xgQty"></label>
        <label>Condition<input id="xgCondition" placeholder="OH / NE / AR / repairable"></label>
        <label>Engine / platform / application<input id="xgApplication"></label>
        <label>ECCN / USML / EAR99<input id="xgClassification" placeholder="UNRESOLVED until documented"></label>
        <label>Classification evidence / source<input id="xgClassEvidence" placeholder="OEM classification, BIS CCATS, counsel memo, defensible source..."></label>
        <label>Screening result<select id="xgScreeningResult"><option>NOT SCREENED</option><option>CLEAR</option><option>POSSIBLE MATCH</option><option>CONFIRMED MATCH</option></select></label>
        <label>Screening date/time<input id="xgScreeningDate" placeholder="2026-08-08 15:30 MDT"></label>
        <label class="full">Screening sources / evidence<textarea id="xgScreeningEvidence" placeholder="CSL / Entity List / OFAC / debarred-party results, aliases checked, addresses checked..."></textarea></label>
        <label class="full">Detailed end use<textarea id="xgEndUse" placeholder="Who will install/use it, on what engine/platform, where, and for what civilian/commercial/industrial purpose?"></textarea></label>
        <label>Military / intelligence end use<select id="xgMilitary"><option>UNKNOWN</option><option>NO</option><option>YES</option></select></label>
        <label>License determination<select id="xgLicense"><option>UNRESOLVED</option><option>NLR / NO LICENSE REQUIRED</option><option>LICENSE REQUIRED</option><option>LICENSE EXCEPTION / AUTHORIZATION</option><option>DENIED</option><option>PROHIBITED</option></select></label>
        <label class="full">License determination evidence<textarea id="xgLicenseEvidence" placeholder="Country Chart / Part 744 / license exception analysis / BIS or DDTC authorization reference / counsel review..."></textarea></label>
        <div class="xg-checks full">
          <label><input id="xgEuc" type="checkbox"> End-use / end-user certification received</label>
          <label><input id="xgRedFlags" type="checkbox"> Unresolved red flags exist</label>
          <label><input id="xgRouteMismatch" type="checkbox"> Routing / payment / destination mismatch exists</label>
          <label><input id="xgLicenseApproved" type="checkbox"> Required license / authorization approved</label>
          <label><input id="xgLicenseSatisfied" type="checkbox"> License requirement satisfied / documented NLR</label>
          <label><input id="xgInventoryVerified" type="checkbox"> Exact inventory / P/N / quantity verified</label>
          <label><input id="xgTraceVerified" type="checkbox"> Trace / condition / release documents verified</label>
          <label><input id="xgQuoteApproved" type="checkbox"> Qualified human reviewer approved commercial quote</label>
          <label><input id="xgReleaseApproved" type="checkbox"> Compliance officer approved final release / shipment</label>
        </div>
        <label class="full">Internal notes<textarea id="xgNotes"></textarea></label>
        <button class="btn gold full" type="button" onclick="IALSExportGate.addRecord()">Create Export Gate Record</button>
      </div>
      <div class="section-head" style="margin-top:24px"><div><span class="eyebrow">Browser-local transaction controls</span><h2>Quote what is <span>legal.</span></h2></div><div class="actions"><button class="btn dark" type="button" onclick="IALSExportGate.copyBackup()">Copy Secure Backup</button></div></div>
      <div class="table-scroll"><table><thead><tr><th>RFQ</th><th>Part</th><th>Destination</th><th>Classification</th><th>Decision</th><th>Actions</th></tr></thead><tbody id="exportGateRows"></tbody></table></div>
      <div class="notice danger" style="margin-top:18px">PRIVATE DATA RULE: this prototype stores records only in this browser. Do not hard-code customer/end-user data into the public repository and do not store passports, government IDs, signed export documents, controlled technical data, banking credentials, or payment-card data here.</div>
    `;

    const dashboard = document.getElementById('dashboardPanel');
    if (dashboard?.parentNode) dashboard.parentNode.insertBefore(panel, dashboard);
    else app.appendChild(panel);
    render();
  }

  function setup() {
    if (!window.IALS?.admin || !document.querySelector('.tabs')) return false;
    injectUi();
    return true;
  }

  window.IALSExportGate = { getDb, decision, addRecord, deleteRecord, pushToComplianceCase, copyBuyerRequest, copyBackup, render };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!setup()) setTimeout(setup, 250);
    }, { once: true });
  } else if (!setup()) {
    setTimeout(setup, 250);
  }
})();
