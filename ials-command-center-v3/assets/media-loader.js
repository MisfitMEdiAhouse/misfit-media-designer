(()=>{
  'use strict';

  const loaderScript=document.currentScript;
  const base=loaderScript?.src||new URL('assets/media-loader.js',location.href).href;
  const root=document.documentElement;
  const logoSelector='img[data-ials-logo],img[src*="ials-warbird.svg"],.brand-lockup img,.admin-header img,.footer img';

  const critical=document.createElement('style');
  critical.dataset.ialsRuntime='launch-readiness-v1';
  critical.textContent=`
    html,body{max-width:100%;overflow-x:hidden}
    .hero{min-height:0!important}
    .hero:before,.hero:after,.metal-stack,.shield-grid,.engine-orb,.bearing-icon{display:none!important}
    .metal-stack,.shield-grid,.engine-orb{height:0!important;min-height:0!important;margin:0!important;border:0!important;background:none!important}
    ${logoSelector}{display:block!important;object-fit:contain!important;object-position:center!important;background:transparent!important}
    .ials-toast{position:fixed;left:50%;bottom:22px;z-index:9999;width:min(92vw,560px);transform:translateX(-50%);padding:14px 16px;border:1px solid #b88435;border-radius:10px;background:#081722;color:#f4e4bd;box-shadow:0 18px 55px rgba(0,0,0,.65);font:600 13px/1.5 Inter,Arial,sans-serif}
    .ials-toast b{display:block;color:#f0c871;text-transform:uppercase;letter-spacing:.08em}
    .ials-runtime-alert{margin:14px;padding:14px;border:1px solid #8a5b28;background:#211606;color:#f1cd85;border-radius:8px}
    @media(max-width:760px){.site-nav,.admin-header{min-height:0!important}.hero{margin-top:0!important}.radar-screen{display:none!important}}
  `;
  document.head.appendChild(critical);

  const decode=src=>new Promise((resolve,reject)=>{
    const image=new Image();
    const timer=setTimeout(()=>reject(new Error('image timeout')),15000);
    image.onload=()=>{clearTimeout(timer);resolve(image)};
    image.onerror=()=>{clearTimeout(timer);reject(new Error('image decode failed'))};
    image.src=src;
  });

  const installLogo=async()=>{
    try{
      const response=await fetch(new URL('./media/captain-logo.txt?v=launch1',base),{cache:'no-store'});
      if(!response.ok)throw new Error(`captain logo unavailable (${response.status})`);
      const encoded=(await response.text()).replace(/\s+/g,'');
      if(!encoded.startsWith('l2dX'))throw new Error('captain logo payload invalid');
      const logoUrl=`data:image/webp;base64,${encoded}`;
      await decode(logoUrl);
      const apply=()=>{
        document.querySelectorAll(logoSelector).forEach(img=>{
          img.removeAttribute('srcset');
          img.src=logoUrl;
          img.style.opacity='1';
          img.style.visibility='visible';
          img.style.display='block';
        });
        document.querySelectorAll('link[rel~="icon"]').forEach(link=>link.href=logoUrl);
      };
      apply();
      if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
      root.classList.add('ials-logo-ready','ials-media-ready');
      return logoUrl;
    }catch(error){
      console.error('IALS captain logo failed to load',error);
      root.classList.add('ials-logo-failed','ials-media-ready');
      return null;
    }
  };

  const toast=(title,message)=>{
    document.querySelector('.ials-toast')?.remove();
    const el=document.createElement('div');
    el.className='ials-toast';
    el.innerHTML=`<b>${title}</b>${message}`;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),6500);
  };

  const safeAdminDb=()=>{
    try{
      const parsed=JSON.parse(localStorage.getItem('ials_admin_v3')||'{}');
      return {
        cases:Array.isArray(parsed.cases)?parsed.cases:[],
        partners:Array.isArray(parsed.partners)?parsed.partners:[],
        campaigns:Array.isArray(parsed.campaigns)?parsed.campaigns:[],
        leads:Array.isArray(parsed.leads)?parsed.leads:[],
        opportunityNotes:Array.isArray(parsed.opportunityNotes)?parsed.opportunityNotes:[]
      };
    }catch(_){return{cases:[],partners:[],campaigns:[],leads:[],opportunityNotes:[]};}
  };

  const saveLead=(type,record)=>{
    const db=safeAdminDb();
    const lead={id:Date.now(),created:new Date().toISOString(),type,status:'NEW',source:location.pathname,...record};
    db.leads.unshift(lead);
    localStorage.setItem('ials_admin_v3',JSON.stringify(db));
    return lead;
  };

  const shareText=async text=>{
    try{
      if(navigator.share){await navigator.share({title:'IALS requirement',text});return;}
    }catch(error){if(error?.name==='AbortError')return;}
    try{await navigator.clipboard.writeText(text);toast('Saved and copied','The request is in the IALS admin lead inbox and copied to your clipboard. Opening text messaging now.');}catch(_){toast('Saved to lead inbox','The request is stored in the IALS admin on this device. Opening text messaging now.');}
    setTimeout(()=>{location.href=`sms:+18018887612?body=${encodeURIComponent(text)}`;},250);
  };

  const normalizeInventory=data=>{
    const normalized=data&&typeof data==='object'?data:{inventory:[],profiles:{}};
    normalized.inventory=Array.isArray(normalized.inventory)?normalized.inventory:[];
    normalized.profiles=normalized.profiles&&typeof normalized.profiles==='object'?normalized.profiles:{};
    Object.entries(normalized.profiles).forEach(([pn,profile])=>{
      if(!normalized.inventory.some(item=>String(item.pn).toUpperCase()===String(pn).toUpperCase())){
        normalized.inventory.push({pn,nsn:profile.nsn||'',alts:profile.alts||[],qty:profile.qty||'',condition:profile.condition||'UNVERIFIED',status:profile.status||'RESEARCH',application:profile.application||'UNVERIFIED',eligibility:profile.eligibility||'UNVERIFIED / HOLD',targetValue:profile.targetValue||'',buyerSegment:profile.buyerSegment||'',docs:profile.docs||'UNVERIFIED',location:profile.location||'',notes:profile.notes||''});
      }
    });
    return normalized;
  };

  const enhanceIALS=()=>{
    if(!window.IALS||window.IALS.__launchReadyPatched)return false;
    const I=window.IALS;
    I.__launchReadyPatched=true;

    I.dataUrl=()=>{
      const marker='/ials-command-center-v3/';
      const path=location.pathname;
      const prefix=path.includes(marker)?path.split(marker)[0]:'';
      return `${prefix}/ials-command-center-v2/inventory.json`;
    };

    I.load=async function(){
      if(this.data)return this.data;
      try{
        const response=await fetch(this.dataUrl(),{cache:'no-store'});
        if(!response.ok)throw new Error(`Inventory unavailable (${response.status})`);
        this.data=normalizeInventory(await response.json());
        this.inventoryHealthy=true;
      }catch(error){
        console.error(error);
        this.data={inventory:[],profiles:{}};
        this.inventoryHealthy=false;
      }
      return this.data;
    };

    I.bindForms=function(){
      const sell=document.getElementById('sellForm');
      if(sell&&!sell.dataset.ialsBound){
        sell.dataset.ialsBound='1';
        if(!sell.querySelector('[name="contact"]')){
          const label=document.createElement('label');
          label.className='full';
          label.innerHTML='Your name / company / phone / email<input name="contact" required placeholder="How IALS should reach you">';
          sell.querySelector('button[type="submit"]')?.before(label);
        }
        sell.addEventListener('submit',event=>{
          event.preventDefault();
          const record=Object.fromEntries(new FormData(sell).entries());
          saveLead('INVENTORY OFFER',record);
          this.track('seller_lead',{part:record.part||'',condition:record.condition||'',location:record.location||''});
          const text=`IALS INVENTORY OFFER\nPart: ${record.part||''}\nQty: ${record.quantity||''}\nCondition: ${record.condition||''}\nLocation: ${record.location||''}\nContact: ${record.contact||''}\nDocs/notes: ${record.notes||''}`;
          toast('Inventory offer saved','It is now visible in the admin Lead Inbox on this device.');
          shareText(text);
        });
      }

      const rfq=document.getElementById('rfqForm');
      if(rfq&&!rfq.dataset.ialsBound){
        rfq.dataset.ialsBound='1';
        rfq.addEventListener('submit',event=>{
          event.preventDefault();
          const record=Object.fromEntries(new FormData(rfq).entries());
          saveLead('RFQ',record);
          this.track('rfq_submit',{part:record.part||'',urgency:record.urgency||'',destination:record.destination||'',endUse:record.endUse||''});
          const text=`IALS RFQ\nPart / NSN: ${record.part||''}\nQty: ${record.quantity||''}\nCondition: ${record.condition||''}\nUrgency: ${record.urgency||''}\nEnd use: ${record.endUse||''}\nDestination: ${record.destination||''}\nCompany/contact: ${record.contact||''}\nNotes: ${record.notes||''}\nEUC acknowledged: ${record.eucAck?'YES':'NO'}`;
          toast('RFQ saved','It is now visible in the admin Lead Inbox on this device.');
          shareText(text);
        });
      }
    };

    const originalInitPublic=I.initPublic.bind(I);
    I.initPublic=async function(){
      await originalInitPublic();
      const inventory=this.data?.inventory||[];
      const parts=document.getElementById('metricParts');
      const nsn=document.getElementById('metricNsn');
      const alts=document.getElementById('metricAlts');
      if(parts)parts.textContent=String(inventory.length);
      if(nsn)nsn.textContent=String(inventory.filter(item=>item.nsn).length);
      if(alts)alts.textContent=String(inventory.reduce((sum,item)=>sum+(item.alts||[]).length,0));
      if(!this.inventoryHealthy){
        const panel=document.querySelector('#inventory .search-panel');
        if(panel&&!panel.querySelector('.ials-runtime-alert')){
          const alert=document.createElement('div');
          alert.className='ials-runtime-alert';
          alert.textContent='Inventory feed is temporarily unavailable. RFQ and seller intake remain active; send the exact part number and IALS will source it.';
          panel.prepend(alert);
        }
      }
    };
    return true;
  };

  const patchLoop=setInterval(()=>{if(enhanceIALS())clearInterval(patchLoop);},10);
  setTimeout(()=>clearInterval(patchLoop),6000);
  enhanceIALS();

  const layout=document.createElement('script');
  layout.src=new URL('./premium-layout.js?v=launch1',base).href;
  layout.async=false;
  layout.dataset.ialsPremiumLayout='launch-readiness-v1';
  document.head.appendChild(layout);

  window.IALSMediaReady=installLogo();

  if(!document.querySelector('script[data-ials-viper]')){
    const opportunity=document.createElement('script');
    opportunity.dataset.ialsViper='1';
    opportunity.src=new URL('./viper-opportunity.js?v=launch1',base).href;
    opportunity.async=false;
    document.head.appendChild(opportunity);
  }
})();
