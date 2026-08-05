'use strict';
(()=>{if(!window.IALSMediaReady){const s=document.createElement('script');s.src=new URL('media-loader.js',document.currentScript.src).href;s.async=false;document.head.appendChild(s);}})();
const IALSGuide={
  replies:{
    start:`Welcome, Elmo. I am the IALS Admin Copilot. I can walk you through the public command-center website, inventory, live lead inbox, opportunity ranking, compliance workflow, End User Certificates, private repair relationships, outreach campaigns and attribution. This preview is browser-local, so do not enter signed documents, card data, controlled technical data or sensitive customer records yet.`,
    public:`The public site is the buyer-and-seller front door. Buyers can search exact part numbers and NSNs, while RFQs and inventory offers are now saved into the Lead Inbox on this same device before the share or text flow opens.`,
    viper:`The Viper lane remains active acquisition work because buyer demand has been identified. Seek Viper 500-series, Viper 600-series and units described as 522-series or T62T-522, plus complete starters, accessories, data plates, serial records and original logbooks. Every international path still requires identity, end-use, destination and transfer review.`,
    inventory:`The public inventory now loads from the real IALS catalog. The Money Queue ranks records by demand evidence, NSN coverage, alternate-number reach, documentation and application fit. Every quantity, condition, ownership, application and eligibility statement still requires verification before marketing.`,
    compliance:`Use NEW COMPLIANCE CASE before quoting elevated-risk, military, international or unclear-end-use material. Every case starts on HOLD. The Dashboard now exposes all six release gates so the workflow can actually be reviewed and documented.`,
    euc:`The End User Certificate is generated from a compliance case. Create the case, review all six gates, then use the Dashboard EUC button. A signed form supports review but never replaces classification, screening, licensing or qualified human approval.`,
    repair:`PRIVATE REPAIR NETWORK is for relationships that must never appear publicly: repair-shop names, contacts, capabilities, quoted prices, turnaround times and commercial terms. In this preview, records stay only in this browser.`,
    agents:`OPPORTUNITY AGENTS defines the human-gated research lanes: incoming RFQ matching, buyer matching, old-bearing acquisition, refurbishment routing, government opportunities, Viper engine acquisition and legacy-engine placement. Agents may research and draft. They may not autonomously quote, publish eligibility, accept contracts or ship material.`,
    campaigns:`OUTREACH CAMPAIGNS creates a focused draft around one exact part and one legitimate buyer segment. Use the Money Queue to choose the highest-value supported target, then review every claim and recipient before sending.`,
    attribution:`ATTRIBUTION shows browser-local events such as inventory searches, part views, RFQ starts, seller leads and phone clicks. Production tracking still needs consent controls, a privacy policy and real analytics configuration.`,
    today:`Best use of the system today: 1) clear new leads, 2) convert elevated-risk RFQs into compliance cases, 3) work the top Money Queue part, 4) confirm physical inventory and documentation, 5) build one precise buyer or sourcing campaign, and 6) record every outcome.`,
    security:`The PIN is only a preview gate, not true security. Do not store signed EUCs, payment-card information, passports, government identifiers, controlled technical data, customer documents or confidential pricing here. Production protection requires real authentication, roles, encrypted storage, audit logs, backups and secure document handling.`,
    default:`I can help with the public site, Lead Inbox, Money Queue, inventory, compliance cases, End User Certificates, private repair partners, opportunity agents, outreach campaigns, attribution, security, or today’s best next move.`
  },
  esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));},
  say(text,who='copilot'){const log=document.getElementById('copilotLog');if(!log)return;const bubble=document.createElement('div');bubble.className=`copilot-bubble ${who}`;bubble.innerHTML=`<b>${who==='copilot'?'IALS Copilot':'Elmo'}</b><p>${this.esc(text)}</p>`;log.appendChild(bubble);log.scrollTop=log.scrollHeight;},
  answer(input){const q=String(input||'').trim();if(!q)return;this.say(q,'user');const s=q.toLowerCase();let key='default';if(/viper|500 series|600 series|522|starter|logbook/.test(s))key='viper';else if(/lead|inbox|rfq/.test(s))key='public';else if(/public|website|site|front/.test(s))key='public';else if(/inventory|part list|quantity|stock|catalog|money queue/.test(s))key='inventory';else if(/end user|certificate|euc/.test(s))key='euc';else if(/compliance|screen|export|hold|release/.test(s))key='compliance';else if(/repair|refurb|overhaul|partner/.test(s))key='repair';else if(/agent|government|contract|opportun/.test(s))key='agents';else if(/campaign|email|outreach|buyer/.test(s))key='campaigns';else if(/attribution|analytics|tracking|traffic/.test(s))key='attribution';else if(/secure|security|private|pin|password/.test(s))key='security';else if(/today|next|first|best move/.test(s))key='today';setTimeout(()=>this.say(this.replies[key]),180);},
  ask(key){this.answer(key);},
  openPanel(id,message){IALS.admin.switch(id);if(message)setTimeout(()=>alert(message),80);},
  init(){const input=document.getElementById('copilotInput'),send=document.getElementById('copilotSend');if(send)send.addEventListener('click',()=>{this.answer(input.value);input.value='';});if(input)input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();send.click();}});document.querySelectorAll('[data-guide]').forEach(b=>b.addEventListener('click',()=>this.ask(b.dataset.guide)));this.say(this.replies.start);}
};
window.IALSGuide=IALSGuide;

(()=>{
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const fmtDate=value=>{try{return new Date(value).toLocaleString();}catch(_){return value||'';}};
  const setup=()=>{
    if(!window.IALS||!IALS.admin||!document.querySelector('.tabs'))return false;
    if(IALS.admin.__operationalAdmin)return true;
    IALS.admin.__operationalAdmin=true;

    const rawGet=IALS.admin.get.bind(IALS.admin);
    IALS.admin.get=function(){
      let db;
      try{db=rawGet()||{};}catch(_){db={};}
      db.cases=Array.isArray(db.cases)?db.cases:[];
      db.partners=Array.isArray(db.partners)?db.partners:[];
      db.campaigns=Array.isArray(db.campaigns)?db.campaigns:[];
      db.leads=Array.isArray(db.leads)?db.leads:[];
      db.opportunityNotes=Array.isArray(db.opportunityNotes)?db.opportunityNotes:[];
      return db;
    };

    const tabs=document.querySelector('.tabs');
    const leadTab=document.createElement('button');
    leadTab.className='btn dark tab';
    leadTab.dataset.panel='leadPanel';
    leadTab.textContent='Lead Inbox';
    tabs.insertBefore(leadTab,tabs.children[1]||null);

    const leadPanel=document.createElement('section');
    leadPanel.id='leadPanel';
    leadPanel.className='panel';
    leadPanel.innerHTML=`<div class="section-head"><div><span class="eyebrow">Public intake connected</span><h2>Lead <span>Inbox.</span></h2></div><p>RFQs and inventory offers submitted on the public site are stored here on this device before the customer share/text flow opens.</p></div><div class="notice">Browser-local prototype: leads are available only on this browser and origin. Copy or back up important records before clearing browser data.</div><div class="search-panel" style="margin-top:16px"><div class="table-scroll"><table><thead><tr><th>Received</th><th>Type</th><th>Part</th><th>Contact</th><th>Destination / location</th><th>Status</th><th>Action</th></tr></thead><tbody id="leadRows"></tbody></table></div></div>`;
    document.getElementById('copilotPanel').after(leadPanel);

    const leadKpi=document.createElement('div');
    leadKpi.className='kpi';
    leadKpi.innerHTML='<b id="leadCount">0</b><span>New leads</span>';
    document.querySelector('.kpis')?.appendChild(leadKpi);

    const operations=document.createElement('div');
    operations.id='operationalControls';
    operations.style.marginTop='18px';
    operations.innerHTML=`
      <div class="split">
        <section class="card"><span class="eyebrow">Six-gate review</span><h3 style="margin-top:14px">Compliance case control</h3><select id="reviewCaseSelect" style="width:100%;margin:8px 0 12px"><option value="">Select a case</option></select><div id="reviewCaseSummary" class="subtle">Select a case to review identity, screening, end use, classification, documentation and officer approval.</div><div id="reviewChecklist" style="margin-top:12px"></div></section>
        <section class="card"><span class="eyebrow">Browser-local continuity</span><h3 style="margin-top:14px">Backup and restore</h3><p class="subtle">Copy an encrypted-storage-ready JSON backup before moving devices or clearing browser data. This backup may contain private business records—handle it accordingly.</p><div class="actions"><button id="copyAdminBackup" class="btn dark">Copy Backup JSON</button><button id="restoreAdminBackup" class="btn ghost">Restore Backup</button></div></section>
      </div>
      <section class="card" style="margin-top:18px"><div class="section-head" style="margin-bottom:12px"><div><span class="eyebrow">Revenue priority</span><h3 style="margin-top:12px">Money Queue</h3></div><p>Ranks loaded inventory and active sourcing records. Scores are research priorities—not appraisals, interchangeability findings or eligibility decisions.</p></div><div id="moneyQueue" class="grid"><p class="subtle">Loading real inventory intelligence…</p></div></section>`;
    document.getElementById('dashboardPanel')?.appendChild(operations);

    tabs.querySelectorAll('[data-panel]').forEach(button=>button.addEventListener('click',()=>IALS.admin.switch(button.dataset.panel)));

    IALS.admin.leadText=function(lead){return `${lead.type||'LEAD'}\nReceived: ${lead.created||''}\nPart / NSN: ${lead.part||''}\nQty: ${lead.quantity||''}\nCondition: ${lead.condition||''}\nUrgency: ${lead.urgency||''}\nEnd use: ${lead.endUse||''}\nDestination: ${lead.destination||lead.location||''}\nContact: ${lead.contact||''}\nNotes: ${lead.notes||''}`;};
    IALS.admin.copyLead=async function(id){const lead=this.get().leads.find(item=>item.id===id);if(!lead)return;await navigator.clipboard.writeText(this.leadText(lead));alert('Lead copied.');};
    IALS.admin.setLeadStatus=function(id,status){const db=this.get();const lead=db.leads.find(item=>item.id===id);if(!lead)return;lead.status=status;lead.updated=new Date().toISOString();this.save(db);this.render();};
    IALS.admin.deleteLead=function(id){if(!confirm('Delete this browser-local lead?'))return;const db=this.get();db.leads=db.leads.filter(item=>item.id!==id);this.save(db);this.render();};
    IALS.admin.convertLead=function(id){
      const db=this.get();const lead=db.leads.find(item=>item.id===id);if(!lead)return;
      const caseRecord={id:Date.now(),created:new Date().toISOString(),status:'HOLD — SCREENING REQUIRED',sale:`LEAD-${lead.id}`,buyer:lead.contact||'',buyerAddress:'',endUser:'',endUserAddress:'',part:lead.part||'',serials:'',quantity:lead.quantity||'',application:'',endUse:lead.endUse||'',destination:lead.destination||lead.location||'',consignee:'',forwarder:'',classification:'UNRESOLVED',screening:'NOT STARTED',license:'UNRESOLVED',notes:`Converted from ${lead.type||'lead'} received ${lead.created||''}. ${lead.notes||''}`,checks:{identity:false,screening:false,endUse:false,classification:false,docs:false,approval:false}};
      db.cases.unshift(caseRecord);lead.status='CONVERTED TO COMPLIANCE';lead.caseId=caseRecord.id;this.save(db);this.render();this.switch('dashboardPanel');this.loadReviewCase(caseRecord.id);
    };

    IALS.admin.renderLeads=function(){
      const db=this.get();const rows=document.getElementById('leadRows');const count=document.getElementById('leadCount');
      if(count)count.textContent=String(db.leads.filter(lead=>lead.status==='NEW').length);
      if(rows)rows.innerHTML=db.leads.map(lead=>`<tr><td>${esc(fmtDate(lead.created))}</td><td><span class="tag">${esc(lead.type)}</span></td><td class="pn">${esc(lead.part||'—')}</td><td>${esc(lead.contact||'—')}</td><td>${esc(lead.destination||lead.location||'—')}</td><td>${esc(lead.status||'NEW')}</td><td><button class="btn dark" onclick="IALS.admin.copyLead(${lead.id})">Copy</button> <button class="btn ghost" onclick="IALS.admin.setLeadStatus(${lead.id},'CONTACTED')">Contacted</button> ${lead.type==='RFQ'?`<button class="btn gold" onclick="IALS.admin.convertLead(${lead.id})">Compliance</button>`:''} <button class="btn ghost" onclick="IALS.admin.deleteLead(${lead.id})">Delete</button></td></tr>`).join('')||'<tr><td colspan="7">No public leads on this device yet.</td></tr>';
    };

    IALS.admin.loadReviewCase=function(id){
      const numeric=Number(id);const c=this.get().cases.find(item=>item.id===numeric);const summary=document.getElementById('reviewCaseSummary');const list=document.getElementById('reviewChecklist');
      if(!c){if(summary)summary.textContent='Select a case to review.';if(list)list.innerHTML='';return;}
      if(summary)summary.innerHTML=`<b>${esc(c.sale||c.id)}</b> · ${esc(c.buyer||'Unknown buyer')} · <span class="pn">${esc(c.part||'Unknown part')}</span><br>${esc(c.destination||'Unknown destination')} · ${esc(c.status)}`;
      const labels={identity:'Buyer / beneficial-owner identity',screening:'Restricted-party screening',endUse:'End user and intended use',classification:'ECCN / USML / license determination',docs:'Trace, condition and eligibility documents',approval:'Qualified officer release'};
      if(list)list.innerHTML=Object.entries(labels).map(([key,label])=>`<label style="display:flex;gap:9px;align-items:flex-start;margin:10px 0;color:#d6e0e4"><input type="checkbox" ${c.checks?.[key]?'checked':''} onchange="IALS.admin.updateCheck(${c.id},'${key}',this.checked)"> <span>${esc(label)}</span></label>`).join('')+`<div class="notice ${c.status.startsWith('HOLD')?'danger':''}" style="margin-top:12px"><b>Status:</b> ${esc(c.status)}</div>`;
    };

    IALS.admin.renderReviewSelector=function(){
      const db=this.get();const select=document.getElementById('reviewCaseSelect');if(!select)return;
      const selected=select.value;select.innerHTML='<option value="">Select a case</option>'+db.cases.map(c=>`<option value="${c.id}">${esc(c.sale||c.id)} · ${esc(c.part||'No part')} · ${esc(c.status)}</option>`).join('');
      if(selected&&db.cases.some(c=>String(c.id)===String(selected))){select.value=selected;this.loadReviewCase(selected);}
    };

    IALS.admin.copyBackup=async function(){await navigator.clipboard.writeText(JSON.stringify({version:1,exportedAt:new Date().toISOString(),data:this.get()},null,2));alert('Private browser-local backup copied. Store it securely.');};
    IALS.admin.restoreBackup=function(){
      const text=prompt('Paste an IALS backup JSON. Existing browser-local records will be replaced.');if(!text)return;
      try{const parsed=JSON.parse(text);const data=parsed.data||parsed;if(!Array.isArray(data.cases)||!Array.isArray(data.leads))throw new Error('Invalid backup');if(!confirm('Replace current browser-local IALS records with this backup?'))return;this.save(data);this.render();alert('Backup restored.');}catch(error){alert('Backup could not be restored: '+error.message);}
    };

    IALS.admin.createCampaignFromPart=function(pn,segment,angle){this.switch('campaignPanel');document.getElementById('campPart').value=pn||'';document.getElementById('campSegment').value=segment||'';document.getElementById('campAngle').value=angle||'';document.getElementById('campPart').focus();};
    IALS.admin.renderMoneyQueue=async function(){
      const target=document.getElementById('moneyQueue');if(!target)return;await IALS.load();const rows=[...(IALS.data?.inventory||[])].sort((a,b)=>IALS.score(b)-IALS.score(a)).slice(0,9);
      target.innerHTML=rows.map((item,index)=>{const info=IALS.info(item);const profile=IALS.profile(item);return `<article class="card ${index===0?'gold-edge':''}"><div class="score">${IALS.score(item)}</div><span class="tag">${index===0?'P0':'PRIORITY'}</span><h3>${esc(item.pn)}</h3><p>${esc(info.application)}${item.nsn?` · ${esc(item.nsn)}`:''}</p><p class="subtle">${esc(info.signal)}</p>${profile.targetValue?`<p><b>Known evidence value:</b> $${Number(profile.targetValue).toLocaleString()} — verify before use.</p>`:''}<button class="btn dark" onclick="IALS.admin.createCampaignFromPart('${esc(item.pn)}','${esc(profile.buyerSegment||info.application)}','${esc(info.signal)}')">Build Campaign</button></article>`;}).join('')||'<p class="subtle">Inventory feed unavailable.</p>';
    };

    document.getElementById('reviewCaseSelect')?.addEventListener('change',event=>IALS.admin.loadReviewCase(event.target.value));
    document.getElementById('copyAdminBackup')?.addEventListener('click',()=>IALS.admin.copyBackup());
    document.getElementById('restoreAdminBackup')?.addEventListener('click',()=>IALS.admin.restoreBackup());

    const rawRender=IALS.admin.render.bind(IALS.admin);
    IALS.admin.render=function(){rawRender();this.renderLeads();this.renderReviewSelector();this.renderMoneyQueue();};
    return true;
  };

  const boot=()=>{if(setup())return;let attempts=0;const timer=setInterval(()=>{attempts+=1;if(setup()||attempts>120)clearInterval(timer);},25);};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
