'use strict';

/*
  IALS DEAL LEDGER + MISFIT 10% COMMISSION LOCK
  ------------------------------------------------
  Browser-local prototype only. This module tracks commercial deal progress,
  cash collected, and the 10% Misfit Mediahouse commission. It does not replace
  a signed agreement, accounting system, secure database, invoice, or payment
  routing. Production data must move to authenticated encrypted storage.
*/
(() => {
  if (window.__IALS_DEAL_LEDGER_LOCK__) return;
  window.__IALS_DEAL_LEDGER_LOCK__ = true;

  const STORAGE_KEY = 'ials_deal_ledger_v1';
  const MISFIT_RATE = 0.10;
  const STAGES = ['LEAD', 'QUALIFYING', 'QUOTED', 'NEGOTIATING', 'WON', 'INVOICED', 'PARTIALLY PAID', 'PAID', 'HOLD', 'LOST', 'ARCHIVED'];

  const esc = value => window.IALS?.esc
    ? window.IALS.esc(value)
    : String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));

  const number = value => {
    const parsed = Number(String(value ?? '').replace(/[$,\s]/g, ''));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  };

  const usd = value => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(number(value));

  function emptyDb() {
    return { version: 1, commissionRate: MISFIT_RATE, deals: [], audit: [] };
  }

  function getDb() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!parsed || !Array.isArray(parsed.deals)) return emptyDb();
      parsed.version = 1;
      parsed.commissionRate = MISFIT_RATE;
      parsed.audit = Array.isArray(parsed.audit) ? parsed.audit : [];
      parsed.deals = parsed.deals.map(deal => ({
        ...deal,
        misfitRate: MISFIT_RATE,
        commissionBasis: 'gross cash collected'
      }));
      return parsed;
    } catch (error) {
      console.error('IALS deal ledger read failed', error);
      return emptyDb();
    }
  }

  function saveDb(db) {
    db.version = 1;
    db.commissionRate = MISFIT_RATE;
    db.deals = (db.deals || []).map(deal => ({
      ...deal,
      misfitRate: MISFIT_RATE,
      commissionBasis: 'gross cash collected'
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  function totals(deals) {
    return deals.reduce((sum, deal) => {
      const gross = number(deal.expectedGross);
      const collected = number(deal.cashCollected);
      const earned = collected * MISFIT_RATE;
      const paid = number(deal.misfitPaid);
      sum.pipeline += ['LOST', 'ARCHIVED'].includes(deal.stage) ? 0 : gross;
      sum.collected += collected;
      sum.earned += earned;
      sum.paid += paid;
      sum.due += Math.max(0, earned - paid);
      return sum;
    }, { pipeline: 0, collected: 0, earned: 0, paid: 0, due: 0 });
  }

  function audit(db, dealId, action, amount = 0, detail = '') {
    db.audit.unshift({
      id: Date.now() + Math.random(),
      dealId,
      action,
      amount: number(amount),
      detail,
      at: new Date().toISOString()
    });
    db.audit = db.audit.slice(0, 1000);
  }

  function input(id) {
    return document.getElementById(id)?.value?.trim() || '';
  }

  function clearForm() {
    ['dealNumber','dealBuyer','dealPart','dealQty','dealExpectedGross','dealCashCollected','dealMisfitPaid','dealSource','dealNotes']
      .forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
      });
    const stage = document.getElementById('dealStage');
    if (stage) stage.value = 'LEAD';
  }

  function injectStyles() {
    if (document.getElementById('ialsDealLedgerStyles')) return;
    const style = document.createElement('style');
    style.id = 'ialsDealLedgerStyles';
    style.textContent = `
      .deal-lock{border:2px solid #d8aa4a;background:linear-gradient(135deg,#17170d,#07141d);box-shadow:0 0 30px rgba(216,170,74,.12);padding:18px;border-radius:14px;margin:16px 0}
      .deal-lock strong{color:#f0c96f}.deal-lock code{color:#f0c96f}
      .deal-totals{display:grid;grid-template-columns:repeat(5,minmax(130px,1fr));gap:10px;margin:16px 0}
      .deal-total{border:1px solid #314b5b;background:#061722;padding:14px;border-radius:10px}
      .deal-total b{display:block;color:#f0c96f;font-size:23px}.deal-total span{font-size:10px;letter-spacing:.11em;text-transform:uppercase;color:#9fb1bc}
      .deal-due{color:#ffbf69!important}.deal-clear{color:#8ad0a5!important}
      .deal-actions{display:flex;gap:6px;flex-wrap:wrap}.deal-actions button{padding:8px 10px;font-size:10px}
      .deal-table td,.deal-table th{white-space:nowrap}.deal-table td.notes{white-space:normal;min-width:220px}
      @media(max-width:900px){.deal-totals{grid-template-columns:repeat(2,minmax(0,1fr))}.deal-total:last-child{grid-column:1/-1}}
    `;
    document.head.appendChild(style);
  }

  function injectUi() {
    if (document.getElementById('dealLedgerPanel')) return;
    injectStyles();

    const tabs = document.querySelector('.tabs');
    if (tabs) {
      const button = document.createElement('button');
      button.className = 'btn dark tab';
      button.dataset.panel = 'dealLedgerPanel';
      button.textContent = 'Deal Ledger · Misfit 10%';
      button.addEventListener('click', () => window.IALS?.admin?.switch('dealLedgerPanel'));
      tabs.appendChild(button);
    }

    const kpis = document.querySelector('.kpis');
    if (kpis) {
      const due = document.createElement('div');
      due.className = 'kpi';
      due.innerHTML = '<b id="misfitDueKpi">$0</b><span>Misfit commission due</span>';
      kpis.appendChild(due);
    }

    const panel = document.createElement('section');
    panel.id = 'dealLedgerPanel';
    panel.className = 'panel';
    panel.innerHTML = `
      <div class="section-head"><div><span class="eyebrow">Commercial control · commission protection</span><h2>Track every deal. <span>Protect Misfit's 10%.</span></h2></div><p>Every recorded IALS deal carries a fixed 10% Misfit Mediahouse commission calculated on gross cash actually collected. The rate is not editable in this interface.</p></div>
      <div class="deal-lock"><strong>COMMISSION LOCK:</strong> Misfit Mediahouse receives <strong>10%</strong> of gross cash collected on every tracked deal. Commission becomes earned as customer money is received—not merely when a quote is issued. <br><span class="subtle">This browser-local control is evidence and workflow support, not legal enforcement. Put the same rule in a signed agreement and route payment/accounting through a system both parties can audit.</span></div>
      <div id="dealTotals" class="deal-totals"></div>
      <div class="section-head"><div><span class="eyebrow">New deal / opportunity</span><h2>Open the <span>money file.</span></h2></div><p>Use the same control or RFQ number as the compliance case whenever possible.</p></div>
      <div class="form">
        <label>Deal / RFQ / control number<input id="dealNumber" placeholder="IALS-2026-001"></label>
        <label>Stage<select id="dealStage">${STAGES.map(stage => `<option>${stage}</option>`).join('')}</select></label>
        <label>Buyer / account<input id="dealBuyer" placeholder="Aviatt / repair shop / broker"></label>
        <label>Source / relationship owner<input id="dealSource" placeholder="Elmo relationship, Misfit outreach, inbound RFQ..."></label>
        <label>Part number / lot<input id="dealPart" placeholder="6873233 / mixed T56 lot"></label>
        <label>Quantity<input id="dealQty" placeholder="76 pending physical count"></label>
        <label>Expected gross deal value<input id="dealExpectedGross" inputmode="decimal" placeholder="0.00"></label>
        <label>Cash collected to date<input id="dealCashCollected" inputmode="decimal" placeholder="0.00"></label>
        <label>Misfit commission already paid<input id="dealMisfitPaid" inputmode="decimal" placeholder="0.00"></label>
        <label>Commission rate<input value="10% — LOCKED" disabled></label>
        <label class="full">Notes / next action<textarea id="dealNotes" placeholder="Demand source, condition assumption, paperwork needed, next follow-up, repair quote..."></textarea></label>
        <button class="btn gold full" type="button" onclick="IALSDeals.addDeal()">Create Deal With 10% Lock</button>
      </div>
      <div class="section-head" style="margin-top:24px"><div><span class="eyebrow">Pipeline and collections</span><h2>Cash in. <span>Commission out.</span></h2></div><div class="actions"><button class="btn dark" type="button" onclick="IALSDeals.copyBackup()">Copy Ledger Backup</button></div></div>
      <div class="table-scroll"><table class="deal-table"><thead><tr><th>Deal</th><th>Buyer</th><th>Part / qty</th><th>Stage</th><th>Expected</th><th>Collected</th><th>Misfit earned</th><th>Paid</th><th>Due</th><th>Actions</th><th>Notes</th></tr></thead><tbody id="dealRows"></tbody></table></div>
      <div class="notice danger" style="margin-top:18px">Do not store controlled technical data, payment-card numbers, passports, government identifiers, signed export documents, sensitive customer records or banking credentials in this browser-local prototype.</div>
    `;

    const attribution = document.getElementById('attributionPanel');
    if (attribution?.parentNode) attribution.parentNode.insertBefore(panel, attribution);
    else document.getElementById('adminApp')?.appendChild(panel);
  }

  function render() {
    const db = getDb();
    const summary = totals(db.deals);
    const dueKpi = document.getElementById('misfitDueKpi');
    if (dueKpi) {
      dueKpi.textContent = usd(summary.due);
      dueKpi.className = summary.due > 0 ? 'deal-due' : 'deal-clear';
    }

    const totalBox = document.getElementById('dealTotals');
    if (totalBox) totalBox.innerHTML = `
      <div class="deal-total"><b>${usd(summary.pipeline)}</b><span>Open pipeline</span></div>
      <div class="deal-total"><b>${usd(summary.collected)}</b><span>Cash collected</span></div>
      <div class="deal-total"><b>${usd(summary.earned)}</b><span>Misfit 10% earned</span></div>
      <div class="deal-total"><b>${usd(summary.paid)}</b><span>Misfit paid</span></div>
      <div class="deal-total"><b class="${summary.due > 0 ? 'deal-due' : 'deal-clear'}">${usd(summary.due)}</b><span>Misfit due now</span></div>
    `;

    const rows = document.getElementById('dealRows');
    if (!rows) return;
    rows.innerHTML = db.deals.map(deal => {
      const collected = number(deal.cashCollected);
      const earned = collected * MISFIT_RATE;
      const paid = number(deal.misfitPaid);
      const due = Math.max(0, earned - paid);
      return `<tr>
        <td><b>${esc(deal.dealNumber || deal.id)}</b><br><span class="subtle">${esc(new Date(deal.created).toLocaleDateString())}</span></td>
        <td>${esc(deal.buyer || '—')}<br><span class="subtle">${esc(deal.source || '')}</span></td>
        <td class="pn">${esc(deal.part || '—')}<br><span class="subtle">Qty: ${esc(deal.quantity || '—')}</span></td>
        <td><span class="chip">${esc(deal.stage || 'LEAD')}</span></td>
        <td>${usd(deal.expectedGross)}</td>
        <td>${usd(collected)}</td>
        <td>${usd(earned)}</td>
        <td>${usd(paid)}</td>
        <td><b class="${due > 0 ? 'deal-due' : 'deal-clear'}">${usd(due)}</b></td>
        <td><div class="deal-actions"><button class="btn dark" onclick="IALSDeals.addCollection('${esc(deal.id)}')">+ Cash</button><button class="btn dark" onclick="IALSDeals.payMisfit('${esc(deal.id)}')">Pay Misfit</button><button class="btn ghost" onclick="IALSDeals.advance('${esc(deal.id)}')">Advance</button><button class="btn ghost" onclick="IALSDeals.copySummary('${esc(deal.id)}')">Copy</button><button class="btn ghost" onclick="IALSDeals.archive('${esc(deal.id)}')">Archive</button></div></td>
        <td class="notes">${esc(deal.notes || '—')}</td>
      </tr>`;
    }).join('') || '<tr><td colspan="11">No deals recorded yet. Open the first T56 buyer conversation as a deal before sending the quote.</td></tr>';
  }

  function findDeal(db, id) {
    return db.deals.find(deal => String(deal.id) === String(id));
  }

  const api = {
    rate: MISFIT_RATE,
    addDeal() {
      const deal = {
        id: `IALS-${Date.now()}`,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        dealNumber: input('dealNumber'),
        buyer: input('dealBuyer'),
        source: input('dealSource'),
        part: input('dealPart'),
        quantity: input('dealQty'),
        stage: input('dealStage') || 'LEAD',
        expectedGross: number(input('dealExpectedGross')),
        cashCollected: number(input('dealCashCollected')),
        misfitRate: MISFIT_RATE,
        misfitPaid: number(input('dealMisfitPaid')),
        commissionBasis: 'gross cash collected',
        notes: input('dealNotes')
      };
      if (!deal.dealNumber && !deal.buyer && !deal.part) {
        alert('Enter at least a deal number, buyer, or part/lot.');
        return;
      }
      const db = getDb();
      db.deals.unshift(deal);
      audit(db, deal.id, 'DEAL_CREATED', deal.expectedGross, `${deal.buyer} · ${deal.part}`);
      if (deal.cashCollected > 0) audit(db, deal.id, 'CASH_COLLECTED', deal.cashCollected, 'Initial collected amount');
      if (deal.misfitPaid > 0) audit(db, deal.id, 'MISFIT_PAYMENT', deal.misfitPaid, 'Initial commission payment');
      saveDb(db);
      clearForm();
      render();
    },
    addCollection(id) {
      const amount = number(prompt('Customer cash received on this deal:'));
      if (!amount) return;
      const db = getDb();
      const deal = findDeal(db, id);
      if (!deal) return;
      deal.cashCollected = number(deal.cashCollected) + amount;
      deal.updated = new Date().toISOString();
      if (deal.stage === 'WON' || deal.stage === 'INVOICED') deal.stage = 'PARTIALLY PAID';
      audit(db, deal.id, 'CASH_COLLECTED', amount, `Misfit earned ${usd(amount * MISFIT_RATE)}`);
      saveDb(db);
      render();
    },
    payMisfit(id) {
      const db = getDb();
      const deal = findDeal(db, id);
      if (!deal) return;
      const earned = number(deal.cashCollected) * MISFIT_RATE;
      const currentPaid = number(deal.misfitPaid);
      const currentDue = Math.max(0, earned - currentPaid);
      if (currentDue <= 0) {
        alert('No unpaid Misfit commission is currently due on this deal.');
        return;
      }
      const amount = number(prompt(`Misfit commission due is ${usd(currentDue)}. Record payment amount:`));
      if (!amount) return;
      if (amount > currentDue && !confirm(`This exceeds the current commission due by ${usd(amount - currentDue)}. Record it as an advance?`)) return;
      deal.misfitPaid = currentPaid + amount;
      deal.updated = new Date().toISOString();
      audit(db, deal.id, 'MISFIT_PAYMENT', amount, amount > currentDue ? 'Includes commission advance' : 'Commission payment');
      saveDb(db);
      render();
    },
    advance(id) {
      const db = getDb();
      const deal = findDeal(db, id);
      if (!deal) return;
      const currentIndex = Math.max(0, STAGES.indexOf(deal.stage));
      const selectable = STAGES.filter(stage => stage !== 'ARCHIVED');
      const proposed = prompt(`Current stage: ${deal.stage}\nEnter next stage:\n${selectable.join(', ')}`, selectable[Math.min(currentIndex + 1, selectable.length - 1)] || deal.stage);
      if (!proposed) return;
      const normalized = proposed.trim().toUpperCase();
      if (!STAGES.includes(normalized)) {
        alert('Invalid stage.');
        return;
      }
      const previous = deal.stage;
      deal.stage = normalized;
      deal.updated = new Date().toISOString();
      audit(db, deal.id, 'STAGE_CHANGED', 0, `${previous} → ${normalized}`);
      saveDb(db);
      render();
    },
    archive(id) {
      if (!confirm('Archive this deal? The record and commission history remain in the ledger.')) return;
      const db = getDb();
      const deal = findDeal(db, id);
      if (!deal) return;
      deal.stage = 'ARCHIVED';
      deal.updated = new Date().toISOString();
      audit(db, deal.id, 'ARCHIVED');
      saveDb(db);
      render();
    },
    copySummary(id) {
      const db = getDb();
      const deal = findDeal(db, id);
      if (!deal) return;
      const earned = number(deal.cashCollected) * MISFIT_RATE;
      const due = Math.max(0, earned - number(deal.misfitPaid));
      const text = [
        `IALS DEAL: ${deal.dealNumber || deal.id}`,
        `Buyer: ${deal.buyer || '—'}`,
        `Source: ${deal.source || '—'}`,
        `Part / lot: ${deal.part || '—'}`,
        `Quantity: ${deal.quantity || '—'}`,
        `Stage: ${deal.stage}`,
        `Expected gross: ${usd(deal.expectedGross)}`,
        `Cash collected: ${usd(deal.cashCollected)}`,
        `Misfit commission rate: 10% of gross cash collected`,
        `Misfit earned: ${usd(earned)}`,
        `Misfit paid: ${usd(deal.misfitPaid)}`,
        `Misfit due: ${usd(due)}`,
        `Notes: ${deal.notes || '—'}`
      ].join('\n');
      navigator.clipboard.writeText(text).then(() => alert('Deal summary copied.'));
    },
    copyBackup() {
      const payload = JSON.stringify(getDb(), null, 2);
      navigator.clipboard.writeText(payload).then(() => alert('Deal-ledger backup copied. Store it privately.'));
    },
    render,
    getDb
  };

  window.IALSDeals = api;

  function boot() {
    injectUi();
    const admin = window.IALS?.admin;
    if (admin && !admin.__dealLedgerRenderPatched) {
      const originalRender = admin.render?.bind(admin);
      admin.render = function patchedRender(...args) {
        const result = originalRender ? originalRender(...args) : undefined;
        render();
        return result;
      };
      admin.__dealLedgerRenderPatched = true;
    }
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
