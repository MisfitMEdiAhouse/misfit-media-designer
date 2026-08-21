'use strict';

/*
  IALS VOICE GUIDE
  ----------------
  ContextForge-style browser voice tour for the private IALS command center.
  Uses Web Speech synthesis only; no microphone capture, no external AI API,
  and no autonomous commercial/compliance action. The guide can navigate the
  existing admin panels, spotlight the active workflow, and speak Copilot text.
*/
(() => {
  if (window.__IALS_VOICE_GUIDE__) return;
  window.__IALS_VOICE_GUIDE__ = true;

  const state = {
    step: -1,
    voiceOn: true,
    copilotVoiceOn: true,
    speaking: false
  };

  const steps = [
    {
      panel: 'copilotPanel',
      target: 'moneyOpportunityBoard',
      label: 'MISSION CONTROL',
      action: 'Lead Inbox',
      text: 'Welcome to IALS Command. Start with the Money Opportunity Board. It separates real demand, deadlines, historical benchmarks and quote-dependent opportunities so the team works the highest-value move first.'
    },
    {
      panel: 'leadPanel',
      target: 'leadPanel',
      label: 'INBOUND RFQS',
      action: 'Export Gate',
      text: 'The Lead Inbox is where inbound RFQs and seller offers become work. Exact part number, quantity, condition, destination and buyer intent should be captured before anybody promises inventory or price.'
    },
    {
      panel: 'exportGatePanel',
      target: 'exportGatePanel',
      label: 'EXPORT / QUOTE GATE',
      action: 'Six-Gate Case',
      text: 'International and elevated-risk deals enter the Export and Quote Gate. The goal is not to kill revenue. The goal is to find the legal path: buyer identity, end user, application, screening, classification, licensing, trace and quote approval.'
    },
    {
      panel: 'casePanel',
      target: 'casePanel',
      label: 'COMPLIANCE FILE',
      action: 'Case Dashboard',
      text: 'Create the six-gate compliance case next. This preserves buyer, end user, consignee, freight forwarder, classification evidence and screening evidence in one controlled workflow. Every case starts on hold.'
    },
    {
      panel: 'dashboardPanel',
      target: 'dashboardPanel',
      label: 'RELEASE PATH',
      action: 'End User Certificate',
      text: 'The compliance dashboard shows the release path. Identity, party screening, end use, classification and license, trace documents, and officer release must all be complete before shipment is treated as cleared.'
    },
    {
      panel: 'certificatePanel',
      target: 'certificatePanel',
      label: 'END USER CERTIFICATE',
      action: 'Repair Network',
      text: 'The customer-facing End Use Certificate is a single-page purchaser certification covering the products, declared destination, intended use, downstream transfer responsibility and signature. Detailed downstream-party information stays in the internal compliance case. A signed certificate supports the review, but it never replaces screening, classification, licensing or government authorization.'
    },
    {
      panel: 'partnerPanel',
      target: 'partnerPanel',
      label: 'OVERHAUL ECONOMICS',
      action: 'Deal Ledger',
      text: 'The private repair network is where candidate bearings move from inventory to real economics. Compare inspection cost, overhaul cost, turnaround time, rejection risk, certification, trace requirements and volume pricing before committing cash.'
    },
    {
      panel: 'dealLedgerPanel',
      target: 'dealLedgerPanel',
      label: 'MONEY FILE',
      action: 'Campaigns',
      text: 'The Deal Ledger tracks pipeline, cash collected and the fixed Misfit ten percent commission on gross cash actually collected. Use the same RFQ or control number across the deal and compliance files whenever possible.'
    },
    {
      panel: 'campaignPanel',
      target: 'campaignPanel',
      label: 'BUYER + SHOP OUTREACH',
      action: 'Elmo Updates',
      text: 'Campaigns stay precise: one exact part, one legitimate buyer or repair segment, one supported claim and one next action. The public IALS site is attached to outbound drafts so the market sees a serious turbine logistics operation, not a random broker email.'
    },
    {
      panel: 'operatorUpdatePanel',
      target: 'operatorUpdatePanel',
      label: 'OWNER VISIBILITY',
      action: 'Opportunity Agents',
      text: 'Elmo Updates keeps ownership in the loop without publishing private contact data. Send concise updates when deal status, compliance, overhaul economics, buyer intent or collections materially change.'
    },
    {
      panel: 'agentPanel',
      target: 'agentPanel',
      label: 'AI OPERATIONS',
      action: 'Finish',
      text: 'The opportunity agents define the operating model: inbound RFQ matching, buyer matching, bearing recovery, refurbishment routing, government opportunities and legacy-engine placement. Human approval remains the boundary for outreach, quotes, eligibility claims and contracts.'
    },
    {
      panel: 'copilotPanel',
      target: 'copilotPanel',
      label: 'READY',
      action: 'Restart Tour',
      text: 'IALS Command is now set up as a revenue system with compliance built into the deal flow. Work the buyer demand, prove the legal path, verify the part and trace, get real overhaul economics, price the margin, close the purchase order and track collected cash.'
    }
  ];

  function injectStyles() {
    if (document.getElementById('ialsVoiceGuideStyles')) return;
    const style = document.createElement('style');
    style.id = 'ialsVoiceGuideStyles';
    style.textContent = `
      .ials-voice-dock{position:fixed;z-index:9999;left:50%;bottom:14px;transform:translateX(-50%);width:min(920px,calc(100vw - 22px));border:1px solid #d8aa4a;background:linear-gradient(135deg,#061722,#0b1d26 60%,#171205);box-shadow:0 18px 70px rgba(0,0,0,.65),0 0 35px rgba(216,170,74,.16);border-radius:16px;padding:14px 16px;display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center}
      .ials-voice-dock[hidden]{display:none!important}.ials-voice-kicker{font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:#e8bd63;font-weight:900}.ials-voice-text{margin-top:4px;color:#d9e3e8;font-size:14px;line-height:1.45}.ials-voice-actions{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.ials-voice-actions button{white-space:nowrap}.ials-voice-spotlight{outline:2px solid #d8aa4a!important;outline-offset:5px;box-shadow:0 0 0 9999px rgba(0,0,0,.18),0 0 40px rgba(216,170,74,.24)!important;position:relative;z-index:20}.ials-voice-pulse{animation:ialsVoicePulse 1.2s ease-in-out infinite alternate}@keyframes ialsVoicePulse{from{box-shadow:0 0 0 rgba(216,170,74,0)}to{box-shadow:0 0 24px rgba(216,170,74,.28)}}
      .ials-voice-launch{border-color:#d8aa4a!important}.ials-voice-status{font-size:10px;color:#93a8b4;margin-top:4px}
      @media(max-width:720px){.ials-voice-dock{grid-template-columns:1fr}.ials-voice-actions{justify-content:flex-start}.ials-voice-text{font-size:13px}}
    `;
    document.head.appendChild(style);
  }

  function bestVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = speechSynthesis.getVoices() || [];
    return voices.find(v => /en-US/i.test(v.lang) && /Google|Samantha|Microsoft|Natural/i.test(v.name))
      || voices.find(v => /en-US/i.test(v.lang))
      || voices.find(v => /^en/i.test(v.lang))
      || voices[0]
      || null;
  }

  function speak(text, force = false) {
    if (!('speechSynthesis' in window) || (!state.voiceOn && !force)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text || ''));
    const voice = bestVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => { state.speaking = true; renderVoiceButton(); };
    utterance.onend = utterance.onerror = () => { state.speaking = false; renderVoiceButton(); };
    speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    state.speaking = false;
    renderVoiceButton();
  }

  function clearSpotlights() {
    document.querySelectorAll('.ials-voice-spotlight').forEach(el => el.classList.remove('ials-voice-spotlight'));
  }

  function openPanel(id) {
    if (!id) return;
    if (window.IALS?.admin?.switch) window.IALS.admin.switch(id);
    else {
      document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
      document.getElementById(id)?.classList.add('active');
    }
  }

  function targetFor(step) {
    return document.getElementById(step.target) || document.getElementById(step.panel) || document.getElementById('adminApp');
  }

  function renderVoiceButton() {
    const button = document.getElementById('ialsGuideVoice');
    if (!button) return;
    if (!('speechSynthesis' in window)) {
      button.textContent = 'Voice unavailable';
      button.disabled = true;
      return;
    }
    button.textContent = state.voiceOn ? (state.speaking ? '🔊 Speaking' : '🔊 Voice On') : '🔇 Voice Off';
  }

  function renderStep() {
    const step = steps[state.step];
    if (!step) return;
    openPanel(step.panel);
    clearSpotlights();
    const target = targetFor(step);
    if (target) {
      target.classList.add('ials-voice-spotlight');
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
    }
    const label = document.getElementById('ialsGuideStepLabel');
    const text = document.getElementById('ialsGuideText');
    const next = document.getElementById('ialsGuideNext');
    const back = document.getElementById('ialsGuideBack');
    if (label) label.textContent = `Step ${state.step + 1} of ${steps.length} · ${step.label}`;
    if (text) text.textContent = step.text;
    if (next) next.textContent = step.action;
    if (back) back.disabled = state.step <= 0;
    if (state.voiceOn) speak(step.text);
  }

  function start() {
    state.step = 0;
    state.voiceOn = true;
    const dock = document.getElementById('ialsVoiceDock');
    if (dock) dock.hidden = false;
    renderVoiceButton();
    renderStep();
  }

  function close() {
    state.step = -1;
    clearSpotlights();
    stopSpeaking();
    const dock = document.getElementById('ialsVoiceDock');
    if (dock) dock.hidden = true;
  }

  function next() {
    if (state.step >= steps.length - 1) {
      state.step = 0;
      renderStep();
      return;
    }
    state.step += 1;
    renderStep();
  }

  function back() {
    if (state.step <= 0) return;
    state.step -= 1;
    renderStep();
  }

  function toggleVoice() {
    state.voiceOn = !state.voiceOn;
    if (!state.voiceOn) stopSpeaking();
    else if (state.step >= 0) speak(steps[state.step].text);
    renderVoiceButton();
  }

  function toggleCopilotVoice() {
    state.copilotVoiceOn = !state.copilotVoiceOn;
    const button = document.getElementById('ialsCopilotVoiceToggle');
    if (button) button.textContent = state.copilotVoiceOn ? '🔊 Copilot Voice' : '🔇 Copilot Voice';
    if (!state.copilotVoiceOn) stopSpeaking();
  }

  function patchCopilot() {
    const guide = window.IALSGuide;
    if (!guide || guide.__ialsVoicePatched || typeof guide.say !== 'function') return;
    guide.__ialsVoicePatched = true;
    const originalSay = guide.say.bind(guide);
    guide.say = function sayWithVoice(text, who = 'copilot') {
      originalSay(text, who);
      if (who === 'copilot' && state.copilotVoiceOn) speak(text, true);
    };
  }

  function injectLaunchers() {
    const quick = document.querySelector('.quick-actions');
    if (quick && !document.getElementById('ialsVoiceTourLaunch')) {
      const tour = document.createElement('button');
      tour.id = 'ialsVoiceTourLaunch';
      tour.className = 'btn gold ials-voice-launch ials-voice-pulse';
      tour.type = 'button';
      tour.textContent = '▶ AI Voice Tour';
      tour.addEventListener('click', start);
      quick.prepend(tour);

      const voice = document.createElement('button');
      voice.id = 'ialsCopilotVoiceToggle';
      voice.className = 'btn dark';
      voice.type = 'button';
      voice.textContent = '🔊 Copilot Voice';
      voice.addEventListener('click', toggleCopilotVoice);
      quick.appendChild(voice);
    }
  }

  function injectDock() {
    if (document.getElementById('ialsVoiceDock')) return;
    const dock = document.createElement('aside');
    dock.id = 'ialsVoiceDock';
    dock.className = 'ials-voice-dock';
    dock.hidden = true;
    dock.setAttribute('aria-live', 'polite');
    dock.innerHTML = `
      <div>
        <div class="ials-voice-kicker" id="ialsGuideStepLabel">IALS AI Voice Guide</div>
        <div class="ials-voice-text" id="ialsGuideText">Start the tour to walk the command center.</div>
        <div class="ials-voice-status">Browser speech only · no microphone · no autonomous quote, contract or compliance decision.</div>
      </div>
      <div class="ials-voice-actions">
        <button class="btn ghost" type="button" id="ialsGuideBack">Back</button>
        <button class="btn dark" type="button" id="ialsGuideVoice">🔊 Voice On</button>
        <button class="btn gold" type="button" id="ialsGuideNext">Next</button>
        <button class="btn ghost" type="button" id="ialsGuideClose">Close</button>
      </div>`;
    document.body.appendChild(dock);
    document.getElementById('ialsGuideBack').addEventListener('click', back);
    document.getElementById('ialsGuideVoice').addEventListener('click', toggleVoice);
    document.getElementById('ialsGuideNext').addEventListener('click', next);
    document.getElementById('ialsGuideClose').addEventListener('click', close);
    renderVoiceButton();
  }

  function init() {
    if (!window.IALS?.admin || !document.getElementById('adminApp')) {
      setTimeout(init, 100);
      return;
    }
    injectStyles();
    injectDock();
    injectLaunchers();
    patchCopilot();
    if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => renderVoiceButton();
  }

  window.IALSVoiceGuide = { start, close, next, back, speak, toggleVoice, state };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
