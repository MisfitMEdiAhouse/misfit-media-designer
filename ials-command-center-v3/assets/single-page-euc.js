(function () {
  'use strict';

  if (window.__IALS_SINGLE_PAGE_EUC__) return;
  window.__IALS_SINGLE_PAGE_EUC__ = true;

  function install() {
    if (!window.IALS?.admin) {
      setTimeout(install, 100);
      return;
    }

    if (!document.getElementById('ialsSinglePageEucStyles')) {
      const style = document.createElement('style');
      style.id = 'ialsSinglePageEucStyles';
      style.textContent = `
        .euc-simple{font-size:11px;line-height:1.35}
        .euc-simple .euc-top{display:flex;justify-content:space-between;gap:20px;border-bottom:3px solid #102a3a;padding-bottom:9px}
        .euc-simple .euc-brand{font-size:16px;letter-spacing:.035em;color:#102a3a}
        .euc-simple h1{margin:13px 0 7px;font-size:25px;color:#102a3a}
        .euc-simple .euc-intro{margin:0 0 11px;padding:8px 10px;border:1px solid #b86a23;background:#fff3e5}
        .euc-simple .euc-section{margin:10px 0 5px;padding:5px 7px;background:#102a3a;color:#fff;font-weight:700;letter-spacing:.04em}
        .euc-simple .cert-table{width:100%;table-layout:fixed;border-collapse:collapse}
        .euc-simple .cert-table th{width:19%;font-size:10px;text-align:left;background:#e8eff3;color:#102a3a}
        .euc-simple .cert-table td{font-size:10.5px}
        .euc-simple ol{margin:5px 0 0;padding-left:22px}
        .euc-simple li{margin:0 0 5px;font-size:10.3px;line-height:1.25}
        .euc-simple .signature-grid{margin-top:8px}
        .euc-simple .cert-field{font-size:10px;min-height:36px}
        .euc-simple .euc-foot{font-size:9px;margin-top:9px;color:#333}
        @media print{
          @page{size:letter;margin:.35in}
          .euc-simple{font-size:10px}
          .euc-simple h1{font-size:23px;margin:9px 0 5px}
          .euc-simple .euc-intro{margin-bottom:7px;padding:6px 8px}
          .euc-simple .euc-section{margin:7px 0 4px;padding:4px 6px}
          .euc-simple li{font-size:9.5px;margin-bottom:3px}
          .euc-simple .cert-table td,.euc-simple .cert-table th{padding:5px}
          .euc-simple .cert-field{min-height:30px;padding:5px}
          .euc-simple .euc-foot{font-size:8px;margin-top:6px}
        }
      `;
      document.head.appendChild(style);
    }

    IALS.admin.certificateHtml = function certificateHtml(c) {
      const esc = IALS.esc;
      const control = esc(c.sale || c.id);
      const buyer = esc(c.buyer || '');
      const buyerAddress = esc(c.buyerAddress || '');
      const destination = esc(c.destination || '');
      const part = esc(c.part || '');
      const quantity = esc(c.quantity || '');
      const serials = esc(c.serials || 'N/A / pending');
      const application = esc(c.application || '');
      const endUse = esc(c.endUse || c.application || '');

      return `<div class="certificate euc-simple">
        <div class="euc-top">
          <div><b class="euc-brand">INTERNATIONAL AVIATION LOGISTICS SUPPORT (IALS)</b><br><small>741 N Highway 158 · Eden, Utah 84310 · 801-888-7612</small></div>
          <div><b>CONTROL NO.</b><br>${control}</div>
        </div>
        <h1>End Use Certificate</h1>
        <p class="euc-intro"><b>Purchaser certification.</b> The purchaser signs for the declared destination and use and remains responsible for lawful downstream transfer. This customer-facing certificate does not require disclosure of the purchaser's downstream customer.</p>

        <div class="euc-section">1. PURCHASER / CONSIGNEE</div>
        <table class="cert-table">
          <tr><th>Legal company</th><td>${buyer}</td><th>Destination</th><td>${destination}</td></tr>
          <tr><th>Registered address</th><td colspan="3">${buyerAddress}</td></tr>
        </table>

        <div class="euc-section">2. PRODUCTS AND DECLARED END USE</div>
        <table class="cert-table">
          <tr><th>Part / NSN</th><td>${part}</td><th>Quantity</th><td>${quantity}</td></tr>
          <tr><th>Serial / lot</th><td colspan="3">${serials}</td></tr>
          <tr><th>Application</th><td colspan="3">${application}</td></tr>
          <tr><th>Declared end use</th><td colspan="3">${endUse}</td></tr>
        </table>

        <div class="euc-section">3. PURCHASER REPRESENTATIONS</div>
        <ol>
          <li>The information in this certificate is accurate and complete, and the signer is authorized to bind the purchaser.</li>
          <li>The products will be used only for the declared civilian, industrial, commercial, marine, or other lawful application and destination stated above.</li>
          <li>The products will not be used for a prohibited military, weapons, missile, nuclear explosive, chemical or biological weapons, or other prohibited end use.</li>
          <li>The purchaser will not export, reexport, resell, transfer, transship, or divert the products contrary to applicable U.S. export-control or sanctions laws, including the EAR and, when applicable, ITAR, and will obtain all required authorizations.</li>
          <li>The purchaser is responsible for screening and controlling any downstream customer, consignee, or transferee and will not supply a prohibited or restricted party, destination, or end use.</li>
          <li>The purchaser will notify IALS before any material change in destination or end use and will provide reasonable records needed to confirm compliance.</li>
          <li>IALS may rely on this certificate and may suspend or cancel the transaction. To the fullest extent permitted by law, the purchaser will indemnify and hold IALS harmless from claims, penalties, losses, or expenses caused by false statements, breach of this certificate, or unauthorized diversion or transfer.</li>
        </ol>

        <div class="euc-section">4. AUTHORIZED PURCHASER SIGNATURE</div>
        <div class="signature-grid">
          <div class="cert-field"><b>Authorized Name / Title</b><br><br></div>
          <div class="cert-field"><b>Company</b><br>${buyer}<br></div>
          <div class="cert-field"><b>Signature</b><br><br></div>
          <div class="cert-field"><b>Date</b><br><br></div>
        </div>
        <p class="euc-foot">This certificate is a purchaser representation, not a government license or classification decision. Any required authorization must be obtained before export, reexport, transfer, or shipment. IALS retains the right to hold or cancel a transaction pending its internal review.</p>
      </div>`;
    };
  }

  install();
})();
