'use strict';

/*
  IALS OUTREACH BRAND SYNC + OPERATOR UPDATES
  -------------------------------------------
  Keeps the live public IALS site attached to outbound campaign drafts and gives
  the admin operator one-click email/SMS update controls for Elmo. Contact details
  remain browser-local; the public repository stores no private operator address.
  A browser-local owner-CC lock can be armed for the next external transaction
  communication so the operator is reminded to keep Mario/Elmo copied.
*/
(() => {
  if (window.__IALS_OUTREACH_BRAND_SYNC__) return;
  window.__IALS_OUTREACH_BRAND_SYNC__ = true;

  const CONTACT_KEY = 'ials_elmo_update_contact_v1';
  const CC_NEXT_KEY = 'ials_elmo_cc_next_v1';
  const publicSiteUrl = new URL('index.html', location.href).href;

  const esc = value => window.IALS?.esc ? window.IALS.esc(value) : String(value ?? '');
  const getContact = () => {
    try { return JSON.parse(localStorage.getItem(CONTACT_KEY) || '{"email":"","phone":""}'); }
    catch (_) { return { email: '', phone: '' }; }
  };
  const ccNext = () => localStorage.getItem(CC_NEXT_KEY) !== '0';
  const setCcNext = value => {
    localStorage.setItem(CC_NEXT_KEY, value ? '1' : '0');
    renderContactStatus();
  };
  const saveContact = () => {
    const email = document.getElementById('elmoUpdateEmail')?.value.trim() || '';
    const phone = document.getElementById('elmoUpdatePhone')?.value.trim() || '';
    localStorage.setItem(CONTACT_KEY, JSON.stringify({ email, phone }));
    renderContactStatus();
  };

  function summary() {
    let cases = [];
    try { cases = window.IALS?.admin?.get()?.cases || []; } catch (_) {}
    let deals = [];
    try { deals = JSON.parse(localStorage.getItem('ials_deal_ledger_v1') || '{}').deals || []; } catch (_) {}
    const holds = cases.filter(c => String(c.status || '').startsWith('HOLD')).length;
    const openDeals = deals.filter(d => !['LOST','ARCHIVED','PAID'].includes(String(d.stage || '').toUpperCase())).length;
    return `IALS OPERATOR UPDATE\n\nPublic site: ${publicSiteUrl}\nCompliance cases: ${cases.length}\nCases on hold: ${holds}\nOpen commercial deals: ${openDeals}\nOwner CC on next transaction communication: ${ccNext() ? 'ARMED' : 'OFF'}\n\nCurrent rule: no international or controlled transaction advances past quote/shipment gates without identity, party screening, end-use/end-user review, classification/license determination, trace/docs and human release.\n\nOperation Xiong Di Qian is active.`;
  }

  function emailUpdate() {
    saveContact();
    const { email } = getContact();
    if (!email) { alert('Add Elmo’s email first.'); return; }
    location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('IALS Operation Update')}&body=${encodeURIComponent(summary())}`;
  }

  function textUpdate() {
    saveContact();
    const { phone } = getContact();
    if (!phone) { alert('Add Elmo’s mobile number first.'); return; }
    location.href = `sms:${encodeURIComponent(phone)}?body=${encodeURIComponent(summary())}`;
  }

  function copyUpdate() {
    navigator.clipboard.writeText(summary()).then(() => alert('Elmo update copied.')).catch(() => prompt('Copy update:', summary()));
  }

  function renderContactStatus() {
    const { email, phone } = getContact();
    const el = document.getElementById('elmoUpdateStatus');
    if (el) el.textContent = `Email: ${email || 'not set'} · SMS: ${phone || 'not set'} · Next external CC: ${ccNext() ? 'ARMED' : 'OFF'}`;
    const cc = document.getElementById('elmoCcNext');
    if (cc) {
      cc.textContent = ccNext() ? '✓ Owner CC Armed' : 'Arm Owner CC';
      cc.className = ccNext() ? 'btn gold' : 'btn dark';
    }
  }

  function injectUi() {
    if (document.getElementById('operatorUpdatePanel')) return;
    const tabs = document.querySelector('.tabs');
    const app = document.getElementById('adminApp');
    if (!tabs || !app) return;

    const tab = document.createElement('button');
    tab.className = 'btn dark tab';
    tab.dataset.panel = 'operatorUpdatePanel';
    tab.textContent = 'Elmo Updates';
    tab.addEventListener('click', () => window.IALS?.admin?.switch('operatorUpdatePanel'));
    tabs.appendChild(tab);

    const panel = document.createElement('section');
    panel.id = 'operatorUpdatePanel';
    panel.className = 'panel';
    panel.innerHTML = `
      <div class="section-head"><div><span class="eyebrow">Owner visibility · website synced</span><h2>Keep Elmo <span>in the loop.</span></h2></div><p>The live public IALS site is injected into outbound campaign drafts and operator updates so buyers can verify the business and capabilities.</p></div>
      <div class="notice"><b>PUBLIC SITE:</b> <a href="${esc(publicSiteUrl)}" target="_blank" rel="noopener">${esc(publicSiteUrl)}</a></div>
      <div class="notice" style="margin-top:10px"><b>OWNER CC LOCK:</b> Arm this before the next external deal communication. If an owner email is stored on this browser, campaign-copy output will include it as the CC line. Private contact data is never committed to the public repository.</div>
      <div class="form" style="margin-top:16px">
        <label>Elmo email<input id="elmoUpdateEmail" type="email" placeholder="Stored only on this browser"></label>
        <label>Elmo mobile<input id="elmoUpdatePhone" type="tel" placeholder="Stored only on this browser"></label>
        <button class="btn dark" type="button" id="saveElmoUpdateContact">Save browser-local contact</button>
        <button class="btn gold" type="button" id="elmoCcNext">✓ Owner CC Armed</button>
        <div class="subtle full" id="elmoUpdateStatus"></div>
        <button class="btn gold" type="button" id="emailElmoUpdate">Email Update</button>
        <button class="btn gold" type="button" id="textElmoUpdate">Text Update</button>
        <button class="btn dark" type="button" id="copyElmoUpdate">Copy Update</button>
      </div>
      <div class="notice danger" style="margin-top:16px">Email/SMS buttons open the device client for human-approved sending. The CC lock is a workflow reminder, not autonomous mail delivery. Never expose stealth-lane information, unsupported airworthiness, exportability or unverified pricing.</div>`;
    app.appendChild(panel);

    const c = getContact();
    document.getElementById('elmoUpdateEmail').value = c.email || '';
    document.getElementById('elmoUpdatePhone').value = c.phone || '';
    document.getElementById('saveElmoUpdateContact').addEventListener('click', saveContact);
    document.getElementById('elmoCcNext').addEventListener('click', () => setCcNext(!ccNext()));
    document.getElementById('emailElmoUpdate').addEventListener('click', emailUpdate);
    document.getElementById('textElmoUpdate').addEventListener('click', textUpdate);
    document.getElementById('copyElmoUpdate').addEventListener('click', copyUpdate);
    renderContactStatus();
  }

  function syncCampaignDrafts() {
    const admin = window.IALS?.admin;
    if (!admin || admin.__ialsWebsiteSyncedCopyCampaign) return;
    admin.__ialsWebsiteSyncedCopyCampaign = true;
    admin.copyCampaign = function copyCampaignWithWebsite(id) {
      const c = this.get().campaigns.find(x => x.id === id);
      if (!c) return;
      const contact = getContact();
      const ccLine = ccNext() ? `CC: ${contact.email || '[Mario/Elmo — use private operator contact]'}\n` : '';
      const text = `Subject: ${c.part ? c.part + ' availability / sourcing' : 'Turbine bearing opportunity'}\n${ccLine}\nHello,\n\nInternational Aviation Logistics Support is sourcing and marketing ${c.part || 'turbine-engine bearings and parts'} for ${c.segment || 'qualified operators, MROs and repair organizations'}. ${c.angle || 'We handle new surplus, serviceable, as-removed, repairable and core material, subject to documentation and compliance review.'}\n\nPlease send your requirement or available inventory with part number, quantity, condition, documentation, end use and destination.\n\nIALS capabilities and requirement intake:\n${publicSiteUrl}\n\nInternational Aviation Logistics Support\nEden, Utah\n801-888-7612\n\nAll offers remain subject to availability, documentation, classification, end-user/end-use review and final compliance approval.`;
      navigator.clipboard.writeText(text).then(() => alert(`Website-synced outreach draft copied.${ccNext() ? ' Owner CC is ARMED—keep Mario/Elmo copied on the next external transaction communication.' : ''} Review every recipient and claim before sending.`));
    };
  }

  function init() {
    if (!window.IALS?.admin) { setTimeout(init, 80); return; }
    if (localStorage.getItem(CC_NEXT_KEY) === null) localStorage.setItem(CC_NEXT_KEY, '1');
    injectUi();
    syncCampaignDrafts();
  }

  window.IALSOperatorUpdates = { summary, getContact, ccNext, setCcNext };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
