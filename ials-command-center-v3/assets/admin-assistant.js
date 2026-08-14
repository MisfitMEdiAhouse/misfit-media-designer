'use strict';

/*
  IALS ADMIN BRAND + FEATURE + COMMISSION + EXPORT + OUTREACH + VOICE + T56 LOCK
  ------------------------------------------------------------------------------
  Parser-ordered bootstrap:
  1) shared captain-logo/media runtime;
  2) verified Money Board/admin feature bundle from commit 41797d06;
  3) browser-local Deal Ledger;
  4) Export / Quote Gate;
  5) outreach website-sync and Elmo update controls;
  6) ContextForge-style AI voice guide;
  7) T56/501D bearing recovery + prospecting + repair-pricing intelligence lane.

  The feature bundle remains commit-pinned so cosmetic edits cannot silently remove
  the Money Board, Lead Inbox, compliance review, Money Queue, backup/restore or Copilot.
*/
(() => {
  if (window.__IALS_ADMIN_BRAND_FEATURE_LOCK__) return;
  window.__IALS_ADMIN_BRAND_FEATURE_LOCK__ = true;

  const current = document.currentScript;
  const assetRoot = new URL('./', current?.src || new URL('assets/admin-assistant.js', location.href));
  const mediaUrl = new URL('media-loader.js?v=ials-brand-lock-20260805a', assetRoot).href;
  const dealLedgerUrl = new URL('deal-ledger.js?v=ials-misfit-commission-lock-20260805a', assetRoot).href;
  const exportGateUrl = new URL('export-compliance-gate.js?v=ials-export-gate-20260808a', assetRoot).href;
  const outreachSyncUrl = new URL('outreach-brand-sync.js?v=ials-outreach-sync-20260808b', assetRoot).href;
  const voiceGuideUrl = new URL('ials-voice-guide.js?v=ials-voice-guide-20260808a', assetRoot).href;
  const t56RecoveryUrl = new URL('t56-recovery-lane.js?v=ials-t56-recovery-20260813b', assetRoot).href;
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

  document.write('<style id="ialsBrandLockStyle">.admin-header img{opacity:0!important}.ials-logo-ready .admin-header img{opacity:1!important;transition:opacity .18s ease}.ials-logo-failed .admin-header img{display:none!important}.ials-logo-failed .admin-header a:first-child:before{content:"IALS";display:block;color:#e8bd63;font:900 34px/1 Georgia,serif;letter-spacing:.08em}</style>');

  document.write('<script src="' + mediaUrl + '"></' + 'script>');
  document.write('<script src="' + lockedFeatureUrl + '"></' + 'script>');
  document.write('<script src="' + dealLedgerUrl + '"></' + 'script>');
  document.write('<script src="' + exportGateUrl + '"></' + 'script>');
  document.write('<script src="' + outreachSyncUrl + '"></' + 'script>');
  document.write('<script src="' + voiceGuideUrl + '"></' + 'script>');
  document.write('<script src="' + t56RecoveryUrl + '"></' + 'script>');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wirePublicSiteButton, { once: true });
  } else {
    wirePublicSiteButton();
  }
})();
