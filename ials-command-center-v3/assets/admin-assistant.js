'use strict';
const IALSGuide={
  replies:{
    start:`Welcome, Elmo. I am the IALS Admin Copilot. I can walk you through the public website, compliance workflow, End User Certificates, private repair relationships, opportunity agents, outreach campaigns and attribution. This preview is browser-local, so do not enter signed documents, card data, controlled technical data or sensitive customer records yet.`,
    public:`The public site is the buyer-and-seller front door. Use it to: 1) search a part number, NSN or alternate, 2) open an RFQ, 3) collect surplus and repairable-bearing leads, 4) explain CF6, CFM56, LM2500 and TF39 lanes, and 5) route F-4 engines and other legacy material into compliant special-project opportunities. Open it with the PUBLIC SITE button at the top.`,
    inventory:`The current public inventory is loaded from the existing bearing list. This preview admin does not yet safely edit the shared public catalog. For now, record physical quantity, condition, trace, serial or lot, location and application offline and send the verified update to Misfit for publishing. The production version needs a shared encrypted database and real user accounts before Elmo and Jonny can edit the same live inventory.`,
    compliance:`Use NEW COMPLIANCE CASE before quoting elevated-risk, military, international or unclear-end-use material. Enter the buyer, end user, destination, part, quantity, application, intended use, consignee, freight forwarder, classification and screening evidence. Every new case starts on HOLD. Nothing should ship until all six gates are satisfied and a qualified human approves release.`,
    euc:`The End User Certificate is generated from a compliance case. First create the case, then return to Dashboard and press EUC next to that case. Review the language, fill any missing facts, then print or save the certificate. A refusal to identify the end user or sign the certificate is a stop signal—not a paperwork inconvenience.`,
    repair:`PRIVATE REPAIR NETWORK is for relationships that must never appear publicly: repair-shop names, contacts, capabilities, quoted prices, turnaround times and commercial terms. In this preview, records stay only in this browser. Do not rely on that as permanent or secure storage. Public pages should say only that IALS can coordinate inspection, evaluation and repair through qualified partners.`,
    agents:`OPPORTUNITY AGENTS explains the future human-gated research lanes: incoming RFQ matching, buyer matching, old-bearing acquisition, refurbishment routing, government opportunities and legacy-engine placement. Agents may research and draft. They may not autonomously quote, contact, publish eligibility, accept a contract or ship material.`,
    campaigns:`OUTREACH CAMPAIGNS creates a focused draft around one exact part and one legitimate buyer segment. Good campaign: “L11686P01 availability and repairable-core sourcing for LM2500 maintenance organizations.” Bad campaign: a giant scraped-email blast. Every claim and recipient must be reviewed before sending.`,
    attribution:`ATTRIBUTION shows browser-local test events such as inventory searches, part views, RFQ starts, seller leads and phone clicks. It helps Misfit learn which part numbers and campaigns create demand. Production tracking still needs consent controls, a privacy policy and real analytics configuration.`,
    today:`Best use of the system today: 1) open the public site and search L11686P01, 2) verify what physical stock and documentation exists, 3) create a compliance case for any active international or controlled sale, 4) keep the bearing-refurbishment relationship private, 5) draft one precise LM2500 bearing outreach campaign, and 6) list the next ten highest-value parts that need quantity and condition verification.`,
    security:`The PIN is only a preview gate, not true security. Do not store signed EUCs, payment-card information, passports, government identifiers, controlled technical data, customer documents or confidential pricing here. Production protection requires real authentication, roles, encrypted storage, audit logs, backups and secure document handling.`,
    default:`I can help with: public site, inventory, compliance cases, End User Certificates, private repair partners, opportunity agents, outreach campaigns, attribution, security, or today’s best next move. Tap a quick action or ask a direct question.`
  },
  esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));},
  say(text,who='copilot'){
    const log=document.getElementById('copilotLog');
    if(!log)return;
    const bubble=document.createElement('div');
    bubble.className=`copilot-bubble ${who}`;
    bubble.innerHTML=`<b>${who==='copilot'?'IALS Copilot':'Elmo'}</b><p>${this.esc(text)}</p>`;
    log.appendChild(bubble);
    log.scrollTop=log.scrollHeight;
  },
  answer(input){
    const q=String(input||'').trim();
    if(!q)return;
    this.say(q,'user');
    const s=q.toLowerCase();
    let key='default';
    if(/public|website|site|front/.test(s))key='public';
    else if(/inventory|part list|quantity|stock|catalog/.test(s))key='inventory';
    else if(/end user|certificate|euc/.test(s))key='euc';
    else if(/compliance|screen|export|hold|release/.test(s))key='compliance';
    else if(/repair|refurb|overhaul|partner/.test(s))key='repair';
    else if(/agent|government|contract|opportun/.test(s))key='agents';
    else if(/campaign|email|outreach|buyer/.test(s))key='campaigns';
    else if(/attribution|analytics|tracking|traffic/.test(s))key='attribution';
    else if(/secure|security|private|pin|password/.test(s))key='security';
    else if(/today|next|first|best move/.test(s))key='today';
    setTimeout(()=>this.say(this.replies[key]),180);
  },
  ask(key){this.answer(key);},
  openPanel(id,message){
    IALS.admin.switch(id);
    if(message){setTimeout(()=>alert(message),80);}
  },
  init(){
    const input=document.getElementById('copilotInput');
    const send=document.getElementById('copilotSend');
    if(send)send.addEventListener('click',()=>{this.answer(input.value);input.value='';});
    if(input)input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();send.click();}});
    document.querySelectorAll('[data-guide]').forEach(b=>b.addEventListener('click',()=>this.ask(b.dataset.guide)));
    this.say(this.replies.start);
  }
};
