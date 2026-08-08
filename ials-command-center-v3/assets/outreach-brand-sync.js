'use strict';

/*
  IALS OUTREACH BRAND SYNC + OPERATOR UPDATES
  -------------------------------------------
  Keeps the live public IALS site attached to outbound campaign drafts and gives
  the admin operator one-click email/SMS update controls for Elmo. Contact details
  are browser-local and must be entered by the operator; this module does not send
  autonomously or store sensitive records in the repository.
*/
(() => {
  if (window.__IALS_OUTREACH_BRAND_SYNC__) return;
  window.__IALS_OUTREACH_BRAND_SYNC__ = true;

  const CONTACT_KEY = 'ials_elmo_update_contact_v1';
  const publicSiteUrl = new URL('index.html', location.href).href;

  const esc = value => window.IALS?.esc ? window.IALS.esc(value) : String(value ?? '');
  const getContact = () => {
    try { return JSON.parse(localStorage.getItem(CONTACT_KEY) || '{"email":"","phone":""}'); }
    catch (_) { return { email: '', phone: '' }; }
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
    return `IALS OPERATOR UPDATE\n\nPublic site: ${publicSiteUrl}\nCompliance cases: ${cases.length}\nCases on hold: ${holds}\nOpen commercial deals: ${openDeals}\n\nCurrent rule: no international or controlled transaction advances past quote/shipment gates without identity, party screening, end-use/end-user review, classification/license determination, trace/docs and human release.\n\nOperation Xiong Di Qian is active.`;
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
    if (el) el.textContent = `Email: ${email || 'not set'} · SMS: ${phone || 'not set'}`;
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
      <div class="form" style="margin-top:16px">
        <label>Elmo email<input id="elmoUpdateEmail" type="email" placeholder="Enter once on this browser"></label>
        <label>Elmo mobile<input id="elmoUpdatePhone" type="tel" placeholder="Enter once on this browser"></label>
        <button class="btn dark" type="button" id="saveElmoUpdateContact">Save browser-local contact</button>
        <div class="subtle" id="elmoUpdateStatus"></div>
        <button class="btn gold" type="button" id="emailElmoUpdate">Email Update</button>
        <button class="btn gold" type="button" id="textElmoUpdate">Text Update</button>
        <button class="btn dark" type="button" id="copyElmoUpdate">Copy Update</button>
      </div>
      <div class="notice danger" style="margin-top:16px">These buttons open the device email/SMS client for human-approved sending. They do not create autonomous outbound messaging and the contact data remains browser-local.</div>`;
    app.appendChild(panel);

    const c = getContact();
    document.getElementById('elmoUpdateEmail').value = c.email || '';
    document.getElementById('elmoUpdatePhone').value = c.phone || '';
    document.getElementById('saveElmoUpdateContact').addEventListener('click', saveContact);
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
      const text = `Subject: ${c.part ? c.part + ' availability / sourcing' : 'Turbine bearing opportunity'}\n\nHello,\n\nInternational Aviation Logistics Support is sourcing and marketing ${c.part || 'turbine-engine bearings and parts'} for ${c.segment || 'qualified operators, MROs and repair organizations'}. ${c.angle || 'We handle new surplus, serviceable, as-removed, repairable and core material, subject to documentation and compliance review.'}\n\nPlease send your requirement or available inventory with part number, quantity, condition, documentation, end use and destination.\n\nIALS capabilities and requirement intake:\n${publicSiteUrl}\n\nInternational Aviation Logistics Support\nEden, Utah\n801-888-7612\n\nAll offers remain subject to availability, documentation, classification, end-user/end-use review and final compliance approval.`;
      navigator.clipboard.writeText(text).then(() => alert('Website-synced outreach draft copied. Review recipient and claims before sending.'));
    };
  }

  function init() {
    if (!window.IALS?.admin) { setTimeout(init, 80); return; }
    injectUi();
    syncCampaignDrafts();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
