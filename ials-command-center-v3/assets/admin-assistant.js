'use strict';

/*
  IALS ADMIN BRAND + FEATURE + COMMISSION + EXPORT GATE LOCK
  ----------------------------------------------------------
  This bootstrap intentionally loads four known assets in parser order:
  1) the shared captain-logo/media runtime from the current site build;
  2) the verified Money Board/admin feature bundle from commit 41797d06;
  3) the current browser-local Deal Ledger with a fixed Misfit 10% commission;
  4) the browser-local Export / Quote Gate for compliance-controlled revenue.

  Keeping the feature bundle commit-pinned prevents a future cosmetic edit from
  silently deleting the Money Board, Lead Inbox, compliance review, Money Queue,
  backup/restore, or Copilot functionality again. The deal ledger and export gate
  are isolated so they can be upgraded without touching the locked feature bundle.
*/
(() => {
  if (window.__IALS_ADMIN_BRAND_FEATURE_LOCK__) return;
  window.__IALS_ADMIN_BRAND_FEATURE_LOCK__ = true;

  const current = document.currentScript;
  const assetRoot = new URL('./', current?.src || new URL('assets/admin-assistant.js', location.href));
  const mediaUrl = new URL('media-loader.js?v=ials-brand-lock-20260805a', assetRoot).href;
  const dealLedgerUrl = new URL('deal-ledger.js?v=ials-misfit-commission-lock-20260805a', assetRoot).href;
  const exportGateUrl = new URL('export-compliance-gate.js?v=ials-export-gate-20260808a', assetRoot).href;
  const lockedFeatureUrl = 'https://raw.githack.com/MisfitMEdiAhouse/misfit-media-designer/41797d06d24d3cf0473d4e83a515f376de849cb7/ials-command-center-v3/assets/admin-assistant.js?v=ials-feature-lock-20260804c';
  const publicSiteUrl = new URL('index.html', location.href).href;

  function wirePublicSiteButton() {
    document.querySelectorAll('.admin-header a').forEach(link => {
      if (!/public site/i.test(link.textContent || '')) return;
      link.href = publicSiteUrl;
      link.target = '_self';
      if (link.dataset.ialsPublicLinkBound === '1') return;
      link.dataset.ialsPublicLinkBound = '1';
      link.addEventListener('click', event => {
        event.preventDefault();
        window.location.assign(publicSiteUrl);
      }, true);
    });
  }

  /* Prevent the browser's broken-image icon while the real captain logo decodes. */
  document.write('<style id="ialsBrandLockStyle">.admin-header img{opacity:0!important}.ials-logo-ready .admin-header img{opacity:1!important;transition:opacity .18s ease}.ials-logo-failed .admin-header img{display:none!important}.ials-logo-failed .admin-header a:first-child:before{content:"IALS";display:block;color:#e8bd63;font:900 34px/1 Georgia,serif;letter-spacing:.08em}</style>');

  /* Parser-ordered loading keeps IALSGuide and all extensions available before admin.html initializes them. */
  document.write('<script src="' + mediaUrl + '"></' + 'script>');
  document.write('<script src="' + lockedFeatureUrl + '"></' + 'script>');
  document.write('<script src="' + dealLedgerUrl + '"></' + 'script>');
  document.write('<script src="' + exportGateUrl + '"></' + 'script>');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wirePublicSiteButton, { once: true });
  } else {
    wirePublicSiteButton();
  }
})();
