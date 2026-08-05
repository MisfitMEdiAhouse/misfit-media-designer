'use strict';

const IALSMoney = {
  opportunities: [
    {
      id: 'l11686',
      priority: 'P0 — WORK NOW',
      title: 'L11686P01 / NSN 3110-00-627-3174',
      potential: '$28,500 per matched unit',
      basis: 'Internal IALS target value from the loaded opportunity profile. This is not a guaranteed sale or appraisal.',
      deadline: 'Immediate sourcing lane',
      next: 'Verify current stock, condition, trace, release documents, location and seller authority. Then place it against the known buyer requirement.',
      part: 'L11686P01',
      segment: 'LM2500 MRO / industrial / marine support',
      link: '../ials-command-center-v3/parts/l11686p01/'
    },
    {
      id: 'j85-117',
      priority: 'P0 — DEADLINE',
      title: '117 × J85 roller bearings — R1916E112 / 5014T13P06',
      potential: '≈ $420,000 illustrative gross',
      basis: '117 units multiplied by a historical 2025 benchmark of $14,370 for four units ($3,592.50 each). This is only a planning benchmark, not the current bid price, margin or award value.',
      deadline: 'Response due Aug. 17, 2026 · 3:00 PM CDT',
      next: 'Confirm source approval, manufacturing capability, quality requirements, delivery schedule and whether IALS must participate through an approved manufacturer or qualified prime.',
      part: 'R1916E112 / 5014T13P06',
      segment: 'J85 approved manufacturers, authorized distributors and qualified government primes',
      link: 'https://sam.gov/opp/7e3789cfb672420884bfc2870b08e935/view'
    },
    {
      id: 'dla-waiver',
      priority: 'P0 — AUG. 7',
      title: 'FY27-1A domestic bearing source package',
      potential: 'Multi-NSN pipeline — value not disclosed',
      basis: 'DLA is identifying viable domestic sources across an attached list of bearing NSNs and part numbers. It is a pipeline-building opportunity, not yet a disclosed award.',
      deadline: 'Response due Aug. 7, 2026 · 5:00 PM EDT',
      next: 'Get the attachment, cross-match every NSN/P/N against IALS inventory and partner capabilities, then identify a qualified U.S. manufacturer response lane.',
      part: 'FY27-1A BEARING PACKAGE',
      segment: 'Domestic bearing manufacturers and qualified DLA supply partners',
      link: 'https://sam.gov/opp/b149afeda8994542a2d668ddcbdecc2d/view'
    },
    {
      id: 'navsup-8',
      priority: 'P1 — QUALIFY',
      title: '8 × NAVSUP bearing — 7161D81G01 / NSN 3110-01-129-6569',
      potential: '8-unit opportunity — quote value TBD',
      basis: 'The notice discloses quantity but not price. Do not invent a dollar value until source, condition, data rights and quote evidence are confirmed.',
      deadline: 'Response date Aug. 17, 2026',
      next: 'Confirm approved-source/data-right restrictions, small-business eligibility and a legitimate supply source before quoting.',
      part: '7161D81G01',
      segment: 'NAVSUP-qualified small-business supply lane',
      link: 'https://sam.gov/opp/81af80a01faa4b76bc249d3888c1c064/view'
    }
  ],
  esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[character]));
  },
  briefing() {
    return `Elmo — the IALS money board is live in the Command Center.\n\nP0: L11686P01 / NSN 3110-00-627-3174. Internal target value is about $28,500 per matched unit. First move is verifying real stock, condition, trace and release documents, then matching it to the known buyer requirement.\n\nP0 DEADLINE: 117 J85 roller bearings, R1916E112 / 5014T13P06, response due Aug. 17. A historical award benchmark creates an illustrative gross opportunity around $420K, but that is not a current bid price or guaranteed award. We need an approved manufacturer, authorized source or qualified prime lane.\n\nP0 AUG. 7: DLA FY27-1A domestic-bearing source package. Dollar value is not disclosed, but it could open a multi-NSN government pipeline. We need the attachment cross-matched against inventory and U.S. manufacturing partners immediately.\n\nP1: NAVSUP needs 8 of 7161D81G01 / NSN 3110-01-129-6569 by the Aug. 17 response date. Value is quote-dependent; source and eligibility must be verified first.\n\nThe visible quantified gross potential is roughly $448K when the $28.5K internal L11686 target is combined with the J85 historical benchmark. That is opportunity value, not profit or guaranteed revenue. Let’s verify supply and work the deadlines first.`;
  },
  async copyBriefing() {
    try {
      await navigator.clipboard.writeText(this.briefing());
      alert('Elmo money briefing copied.');
    } catch (error) {
      prompt('Copy this Elmo briefing:', this.briefing());
    }
  },
  openOpportunity(id) {
    const opportunity = this.opportunities.find(item => item.id === id);
    if (opportunity?.link) window.open(opportunity.link, '_blank', 'noopener');
  },
  buildCampaign(id) {
    const opportunity = this.opportunities.find(item => item.id === id);
    if (!opportunity || !window.IALS?.admin?.createCampaignFromPart) return;
    IALS.admin.createCampaignFromPart(opportunity.part, opportunity.segment, `${opportunity.title}. ${opportunity.next} ${opportunity.basis}`);
  }
};
window.IALSMoney = IALSMoney;

const IALSGuide = {
  replies: {
    start: 'Elmo, start with the gold MONEY OPPORTUNITY BOARD at the top. It puts the quantified opportunities, deadlines, qualification gates and next actions in front of you before the rest of the admin tools.',
    money: 'The visible quantified gross potential is approximately $448K: the $28,500 internal L11686 target plus the roughly $420K historical-benchmark scenario for the 117-unit J85 requirement. This is opportunity value—not profit, a current quote or guaranteed revenue.',
    leads: 'Lead Inbox contains public RFQs and seller offers captured on this device. Work NEW leads first and convert elevated-risk RFQs into compliance cases.',
    compliance: 'Every international, military, controlled or unclear-end-use transaction starts on HOLD. Identity, screening, end use, classification, documents and qualified officer approval must all be completed.',
    default: 'Use the Money Opportunity Board first, then Lead Inbox, six-gate compliance review, Money Queue and focused outreach campaigns.'
  },
  esc(value) { return IALSMoney.esc(value); },
  say(text, who = 'copilot') {
    const log = document.getElementById('copilotLog');
    if (!log) return;
    const bubble = document.createElement('div');
    bubble.className = `copilot-bubble ${who}`;
    bubble.innerHTML = `<b>${who === 'copilot' ? 'IALS Copilot' : 'Elmo'}</b><p>${this.esc(text)}</p>`;
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
  },
  answer(input) {
    const question = String(input || '').trim();
    if (!question) return;
    this.say(question, 'user');
    const normalized = question.toLowerCase();
    let key = 'default';
    if (/money|value|dollar|revenue|profit|opportun/.test(normalized)) key = 'money';
    else if (/lead|inbox|rfq/.test(normalized)) key = 'leads';
    else if (/compliance|screen|export|hold|release|euc/.test(normalized)) key = 'compliance';
    setTimeout(() => this.say(this.replies[key]), 160);
  },
  init() {
    const input = document.getElementById('copilotInput');
    const send = document.getElementById('copilotSend');
    if (send && !send.dataset.bound) {
      send.dataset.bound = '1';
      send.addEventListener('click', () => {
        this.answer(input?.value || '');
        if (input) input.value = '';
      });
    }
    if (input && !input.dataset.bound) {
      input.dataset.bound = '1';
      input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          send?.click();
        }
      });
    }
    document.querySelectorAll('[data-guide]').forEach(button => {
      if (button.dataset.moneyGuideBound) return;
      button.dataset.moneyGuideBound = '1';
      button.addEventListener('click', () => this.answer(button.dataset.guide));
    });
    this.say(this.replies.start);
  }
};
window.IALSGuide = IALSGuide;

(() => {
  const esc = value => IALSMoney.esc(value);
  const formatDate = value => {
    try { return new Date(value).toLocaleString(); } catch (error) { return value || ''; }
  };

  function injectStyles() {
    if (document.getElementById('ialsMoneyStyles')) return;
    const style = document.createElement('style');
    style.id = 'ialsMoneyStyles';
    style.textContent = `
      .money-board{border:2px solid #d9ab50;background:linear-gradient(135deg,#171105,#071722 58%,#031019);box-shadow:0 24px 80px rgba(0,0,0,.55),0 0 38px rgba(217,171,80,.14);padding:22px;margin:0 0 22px;border-radius:16px}
      .money-board-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:18px}
      .money-board h2{font-size:clamp(34px,5vw,66px);margin:7px 0 8px;line-height:.92}.money-total{min-width:235px;text-align:center;border:1px solid #d9ab50;background:#090d0f;padding:15px;border-radius:12px}.money-total b{display:block;color:#f0c66d;font-size:34px}.money-total span{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#a9b8c1}
      .money-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.money-op{border:1px solid #36505f;background:#061722;padding:16px;border-radius:12px}.money-op.p0{border-color:#b9832d;box-shadow:inset 4px 0 #d9ab50}.money-op h3{margin:9px 0 5px}.money-op-value{font-size:24px;color:#f0c66d;font-weight:800}.money-op-deadline{color:#ffcf72;font-weight:700}.money-op p{margin:7px 0;color:#b7c4cb}.money-op .basis{font-size:11px;color:#8396a0}.money-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
      @media(max-width:760px){.money-board{padding:15px}.money-board-head{display:block}.money-total{margin-top:14px;width:auto}.money-grid{grid-template-columns:1fr}.money-op-value{font-size:21px}}
    `;
    document.head.appendChild(style);
  }

  function injectMoneyBoard() {
    if (document.getElementById('moneyOpportunityBoard')) return;
    const app = document.getElementById('adminApp');
    if (!app) return;
    const board = document.createElement('section');
    board.id = 'moneyOpportunityBoard';
    board.className = 'money-board';
    board.innerHTML = `
      <div class="money-board-head">
        <div><span class="eyebrow">Elmo — start here every time</span><h2>MONEY <span>OPPORTUNITY BOARD.</span></h2><p>Deadline-driven opportunities ranked by actionability. Values are clearly separated into internal targets, historical benchmarks and undisclosed quote-dependent lanes.</p></div>
        <div class="money-total"><b>≈ $448K</b><span>illustrative visible gross potential<br>not profit or guaranteed revenue</span></div>
      </div>
      <div class="money-grid">
        ${IALSMoney.opportunities.map(opportunity => `
          <article class="money-op ${opportunity.priority.startsWith('P0') ? 'p0' : ''}">
            <span class="tag">${esc(opportunity.priority)}</span>
            <h3>${esc(opportunity.title)}</h3>
            <div class="money-op-value">${esc(opportunity.potential)}</div>
            <div class="money-op-deadline">${esc(opportunity.deadline)}</div>
            <p><b>Next move:</b> ${esc(opportunity.next)}</p>
            <p class="basis"><b>Value basis:</b> ${esc(opportunity.basis)}</p>
            <div class="money-actions"><button class="btn gold" onclick="IALSMoney.buildCampaign('${esc(opportunity.id)}')">Build Campaign</button><button class="btn ghost" onclick="IALSMoney.openOpportunity('${esc(opportunity.id)}')">Open Source</button></div>
          </article>`).join('')}
      </div>
      <div class="money-actions" style="margin-top:16px"><button class="btn gold" onclick="IALSMoney.copyBriefing()">Copy Elmo Money Briefing</button><button class="btn dark" onclick="IALS.admin.switch('leadPanel')">Open Lead Inbox</button><button class="btn dark" onclick="IALS.admin.switch('dashboardPanel')">Open Compliance Dashboard</button></div>`;
    const firstNotice = app.querySelector('.notice.danger');
    if (firstNotice) firstNotice.after(board);
    else app.prepend(board);
  }

  function setupAdmin() {
    if (!window.IALS?.admin || !document.querySelector('.tabs')) return false;
    if (IALS.admin.__moneyOperational) return true;
    IALS.admin.__moneyOperational = true;
    injectStyles();
    injectMoneyBoard();

    const originalGet = IALS.admin.get.bind(IALS.admin);
    IALS.admin.get = function getNormalizedDatabase() {
      let database;
      try { database = originalGet() || {}; } catch (error) { database = {}; }
      database.cases = Array.isArray(database.cases) ? database.cases : [];
      database.partners = Array.isArray(database.partners) ? database.partners : [];
      database.campaigns = Array.isArray(database.campaigns) ? database.campaigns : [];
      database.leads = Array.isArray(database.leads) ? database.leads : [];
      database.opportunityNotes = Array.isArray(database.opportunityNotes) ? database.opportunityNotes : [];
      return database;
    };

    const tabs = document.querySelector('.tabs');
    if (!document.querySelector('[data-panel="leadPanel"]')) {
      const leadTab = document.createElement('button');
      leadTab.className = 'btn dark tab';
      leadTab.dataset.panel = 'leadPanel';
      leadTab.textContent = 'Lead Inbox';
      tabs.insertBefore(leadTab, tabs.children[1] || null);
    }

    if (!document.getElementById('leadPanel')) {
      const panel = document.createElement('section');
      panel.id = 'leadPanel';
      panel.className = 'panel';
      panel.innerHTML = `<div class="section-head"><div><span class="eyebrow">Public intake connected</span><h2>Lead <span>Inbox.</span></h2></div><p>RFQs and inventory offers submitted on the public site are stored here on this device before the customer share/text flow opens.</p></div><div class="notice">Browser-local prototype: leads are available only on this browser and origin. Back up important records before clearing browser data.</div><div class="search-panel" style="margin-top:16px"><div class="table-scroll"><table><thead><tr><th>Received</th><th>Type</th><th>Part</th><th>Contact</th><th>Destination / location</th><th>Status</th><th>Action</th></tr></thead><tbody id="leadRows"></tbody></table></div></div>`;
      document.getElementById('copilotPanel')?.after(panel);
    }

    if (!document.getElementById('leadCount')) {
      const kpi = document.createElement('div');
      kpi.className = 'kpi';
      kpi.innerHTML = '<b id="leadCount">0</b><span>New leads</span>';
      document.querySelector('.kpis')?.appendChild(kpi);
    }
    if (!document.getElementById('visiblePotential')) {
      const kpi = document.createElement('div');
      kpi.className = 'kpi';
      kpi.innerHTML = '<b id="visiblePotential">≈$448K</b><span>Illustrative visible gross</span>';
      document.querySelector('.kpis')?.appendChild(kpi);
    }

    if (!document.getElementById('operationalControls')) {
      const controls = document.createElement('div');
      controls.id = 'operationalControls';
      controls.style.marginTop = '18px';
      controls.innerHTML = `<div class="split"><section class="card"><span class="eyebrow">Six-gate review</span><h3 style="margin-top:14px">Compliance case control</h3><select id="reviewCaseSelect" style="width:100%;margin:8px 0 12px"><option value="">Select a case</option></select><div id="reviewCaseSummary" class="subtle">Select a case to review all six gates.</div><div id="reviewChecklist" style="margin-top:12px"></div></section><section class="card"><span class="eyebrow">Browser-local continuity</span><h3 style="margin-top:14px">Backup and restore</h3><p class="subtle">Copy a private JSON backup before moving devices or clearing browser data.</p><div class="actions"><button id="copyAdminBackup" class="btn dark">Copy Backup JSON</button><button id="restoreAdminBackup" class="btn ghost">Restore Backup</button></div></section></div><section class="card" style="margin-top:18px"><div class="section-head" style="margin-bottom:12px"><div><span class="eyebrow">Inventory revenue priority</span><h3 style="margin-top:12px">Money Queue</h3></div><p>Inventory scores are research priorities, not appraisals or eligibility decisions.</p></div><div id="moneyQueue" class="grid"><p class="subtle">Loading inventory intelligence…</p></div></section>`;
      document.getElementById('dashboardPanel')?.appendChild(controls);
    }

    IALS.admin.createCampaignFromPart = function createCampaignFromPart(part, segment, angle) {
      this.switch('campaignPanel');
      const partInput = document.getElementById('campPart');
      const segmentInput = document.getElementById('campSegment');
      const angleInput = document.getElementById('campAngle');
      if (partInput) partInput.value = part || '';
      if (segmentInput) segmentInput.value = segment || '';
      if (angleInput) angleInput.value = angle || '';
      partInput?.focus();
    };

    IALS.admin.copyLead = async function copyLead(id) {
      const lead = this.get().leads.find(item => item.id === id);
      if (!lead) return;
      const text = `${lead.type || 'LEAD'}\nReceived: ${lead.created || ''}\nPart / NSN: ${lead.part || ''}\nQty: ${lead.quantity || ''}\nCondition: ${lead.condition || ''}\nUrgency: ${lead.urgency || ''}\nEnd use: ${lead.endUse || ''}\nDestination: ${lead.destination || lead.location || ''}\nContact: ${lead.contact || ''}\nNotes: ${lead.notes || ''}`;
      try { await navigator.clipboard.writeText(text); alert('Lead copied.'); } catch (error) { prompt('Copy lead:', text); }
    };
    IALS.admin.setLeadStatus = function setLeadStatus(id, status) {
      const database = this.get();
      const lead = database.leads.find(item => item.id === id);
      if (!lead) return;
      lead.status = status;
      lead.updated = new Date().toISOString();
      this.save(database);
      this.render();
    };
    IALS.admin.deleteLead = function deleteLead(id) {
      if (!confirm('Delete this browser-local lead?')) return;
      const database = this.get();
      database.leads = database.leads.filter(item => item.id !== id);
      this.save(database);
      this.render();
    };
    IALS.admin.convertLead = function convertLead(id) {
      const database = this.get();
      const lead = database.leads.find(item => item.id === id);
      if (!lead) return;
      const complianceCase = {id:Date.now(),created:new Date().toISOString(),status:'HOLD — SCREENING REQUIRED',sale:`LEAD-${lead.id}`,buyer:lead.contact||'',buyerAddress:'',endUser:'',endUserAddress:'',part:lead.part||'',serials:'',quantity:lead.quantity||'',application:'',endUse:lead.endUse||'',destination:lead.destination||lead.location||'',consignee:'',forwarder:'',classification:'UNRESOLVED',screening:'NOT STARTED',license:'UNRESOLVED',notes:`Converted from ${lead.type||'lead'} received ${lead.created||''}. ${lead.notes||''}`,checks:{identity:false,screening:false,endUse:false,classification:false,docs:false,approval:false}};
      database.cases.unshift(complianceCase);
      lead.status = 'CONVERTED TO COMPLIANCE';
      lead.caseId = complianceCase.id;
      this.save(database);
      this.render();
      this.switch('dashboardPanel');
      this.loadReviewCase(complianceCase.id);
    };

    IALS.admin.renderLeads = function renderLeads() {
      const database = this.get();
      const rows = document.getElementById('leadRows');
      const count = document.getElementById('leadCount');
      if (count) count.textContent = String(database.leads.filter(lead => lead.status === 'NEW').length);
      if (rows) rows.innerHTML = database.leads.map(lead => `<tr><td>${esc(formatDate(lead.created))}</td><td><span class="tag">${esc(lead.type)}</span></td><td class="pn">${esc(lead.part||'—')}</td><td>${esc(lead.contact||'—')}</td><td>${esc(lead.destination||lead.location||'—')}</td><td>${esc(lead.status||'NEW')}</td><td><button class="btn dark" onclick="IALS.admin.copyLead(${lead.id})">Copy</button> <button class="btn ghost" onclick="IALS.admin.setLeadStatus(${lead.id},'CONTACTED')">Contacted</button> ${lead.type==='RFQ'?`<button class="btn gold" onclick="IALS.admin.convertLead(${lead.id})">Compliance</button>`:''} <button class="btn ghost" onclick="IALS.admin.deleteLead(${lead.id})">Delete</button></td></tr>`).join('') || '<tr><td colspan="7">No public leads on this device yet.</td></tr>';
    };

    IALS.admin.loadReviewCase = function loadReviewCase(id) {
      const selectedCase = this.get().cases.find(item => item.id === Number(id));
      const summary = document.getElementById('reviewCaseSummary');
      const checklist = document.getElementById('reviewChecklist');
      if (!selectedCase) {
        if (summary) summary.textContent = 'Select a case to review.';
        if (checklist) checklist.innerHTML = '';
        return;
      }
      if (summary) summary.innerHTML = `<b>${esc(selectedCase.sale||selectedCase.id)}</b> · ${esc(selectedCase.buyer||'Unknown buyer')} · <span class="pn">${esc(selectedCase.part||'Unknown part')}</span><br>${esc(selectedCase.destination||'Unknown destination')} · ${esc(selectedCase.status)}`;
      const labels = {identity:'Buyer / beneficial-owner identity',screening:'Restricted-party screening',endUse:'End user and intended use',classification:'ECCN / USML / license determination',docs:'Trace, condition and eligibility documents',approval:'Qualified officer release'};
      if (checklist) checklist.innerHTML = Object.entries(labels).map(([key,label]) => `<label style="display:flex;gap:9px;align-items:flex-start;margin:10px 0;color:#d6e0e4"><input type="checkbox" ${selectedCase.checks?.[key]?'checked':''} onchange="IALS.admin.updateCheck(${selectedCase.id},'${key}',this.checked)"><span>${esc(label)}</span></label>`).join('') + `<div class="notice ${selectedCase.status.startsWith('HOLD')?'danger':''}" style="margin-top:12px"><b>Status:</b> ${esc(selectedCase.status)}</div>`;
    };

    IALS.admin.renderReviewSelector = function renderReviewSelector() {
      const database = this.get();
      const select = document.getElementById('reviewCaseSelect');
      if (!select) return;
      const selected = select.value;
      select.innerHTML = '<option value="">Select a case</option>' + database.cases.map(item => `<option value="${item.id}">${esc(item.sale||item.id)} · ${esc(item.part||'No part')} · ${esc(item.status)}</option>`).join('');
      if (selected && database.cases.some(item => String(item.id) === String(selected))) {
        select.value = selected;
        this.loadReviewCase(selected);
      }
    };

    IALS.admin.copyBackup = async function copyBackup() {
      const backup = JSON.stringify({version:1,exportedAt:new Date().toISOString(),data:this.get()}, null, 2);
      try { await navigator.clipboard.writeText(backup); alert('Private backup copied. Store it securely.'); } catch (error) { prompt('Copy backup:', backup); }
    };
    IALS.admin.restoreBackup = function restoreBackup() {
      const text = prompt('Paste an IALS backup JSON. Existing browser-local records will be replaced.');
      if (!text) return;
      try {
        const parsed = JSON.parse(text);
        const data = parsed.data || parsed;
        if (!Array.isArray(data.cases) || !Array.isArray(data.leads)) throw new Error('Invalid backup');
        if (!confirm('Replace current browser-local IALS records with this backup?')) return;
        this.save(data);
        this.render();
        alert('Backup restored.');
      } catch (error) { alert(`Backup could not be restored: ${error.message}`); }
    };

    IALS.admin.renderMoneyQueue = async function renderMoneyQueue() {
      const target = document.getElementById('moneyQueue');
      if (!target) return;
      await IALS.load();
      const rows = [...(IALS.data?.inventory || [])].sort((a,b) => IALS.score(b)-IALS.score(a)).slice(0,9);
      target.innerHTML = rows.map((item,index) => {
        const info = IALS.info(item);
        const profile = IALS.profile(item);
        return `<article class="card ${index===0?'gold-edge':''}"><div class="score">${IALS.score(item)}</div><span class="tag">${index===0?'P0':'PRIORITY'}</span><h3>${esc(item.pn)}</h3><p>${esc(info.application)}${item.nsn?` · ${esc(item.nsn)}`:''}</p><p class="subtle">${esc(info.signal)}</p>${profile.targetValue?`<p><b>Internal target value:</b> $${Number(profile.targetValue).toLocaleString()} — verify before use.</p>`:''}<button class="btn dark" onclick="IALS.admin.createCampaignFromPart('${esc(item.pn)}','${esc(profile.buyerSegment||info.application)}','${esc(info.signal)}')">Build Campaign</button></article>`;
      }).join('') || '<p class="subtle">Inventory feed unavailable.</p>';
    };

    document.getElementById('reviewCaseSelect')?.addEventListener('change', event => IALS.admin.loadReviewCase(event.target.value));
    document.getElementById('copyAdminBackup')?.addEventListener('click', () => IALS.admin.copyBackup());
    document.getElementById('restoreAdminBackup')?.addEventListener('click', () => IALS.admin.restoreBackup());

    const originalRender = IALS.admin.render.bind(IALS.admin);
    IALS.admin.render = function operationalRender() {
      originalRender();
      this.renderLeads();
      this.renderReviewSelector();
      this.renderMoneyQueue();
    };
    return true;
  }

  const boot = () => {
    if (setupAdmin()) return;
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (setupAdmin() || attempts > 120) clearInterval(timer);
    }, 25);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
