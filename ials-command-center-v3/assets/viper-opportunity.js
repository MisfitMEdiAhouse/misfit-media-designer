(()=>{
  const script=document.currentScript;
  const assetBase=script?.src||new URL('assets/viper-opportunity.js',location.href).href;
  const logoSelector='img[data-ials-logo],img[src*="ials-warbird.svg"],.brand-lockup img,.admin-header img,.footer img';

  const decodeImage=src=>new Promise((resolve,reject)=>{
    const image=new Image();
    const timer=setTimeout(()=>reject(new Error('captain logo decode timeout')),15000);
    image.onload=()=>{clearTimeout(timer);resolve(image)};
    image.onerror=()=>{clearTimeout(timer);reject(new Error('captain logo decode failed'))};
    image.src=src;
  });

  const installCaptainLogo=async()=>{
    try{
      const files=['captain-logo-prefix-0.txt','captain-logo-prefix-1.txt','captain-logo.txt'];
      const chunks=await Promise.all(files.map(name=>fetch(new URL(`./media/${name}?v=2`,assetBase),{cache:'no-store'}).then(response=>{
        if(!response.ok)throw new Error(`${name} unavailable (${response.status})`);
        return response.text();
      })));
      const encoded=chunks.join('').replace(/\s+/g,'');
      if(encoded.length!==34640||!encoded.startsWith('UklGRnRlAABXRUJQ'))throw new Error(`invalid captain logo payload (${encoded.length})`);
      const logoUrl=`data:image/webp;base64,${encoded}`;
      await decodeImage(logoUrl);
      const apply=()=>{
        document.querySelectorAll(logoSelector).forEach(img=>{
          img.src=logoUrl;
          img.removeAttribute('srcset');
          img.style.setProperty('display','block','important');
          img.style.setProperty('opacity','1','important');
          img.style.setProperty('visibility','visible','important');
          img.style.setProperty('object-fit','contain','important');
          img.style.setProperty('background','transparent','important');
        });
        document.querySelectorAll('link[rel~="icon"]').forEach(link=>link.href=logoUrl);
        document.documentElement.classList.remove('ials-logo-loading','ials-logo-failed');
        document.documentElement.classList.add('ials-logo-ready','ials-logo-fixed','ials-media-ready');
      };
      apply();
      if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
      const observer=new MutationObserver(()=>apply());
      observer.observe(document.documentElement,{childList:true,subtree:true});
      setTimeout(()=>observer.disconnect(),10000);
      window.IALSCaptainLogo=logoUrl;
    }catch(error){
      console.error('IALS exact captain logo repair failed',error);
    }
  };
  installCaptainLogo();

  const root=location.pathname.includes('/ials-command-center-v3/')?location.pathname.split('/ials-command-center-v3/')[0]+'/ials-command-center-v3/':'./';
  const page=root+'programs/viper-500-600.html';
  const style=document.createElement('style');
  style.textContent=`
    html.ials-logo-ready ${logoSelector}{opacity:1!important;visibility:visible!important;display:block!important}
    .viper-priority{padding:24px clamp(18px,4vw,68px)!important;background:linear-gradient(100deg,#2a1a08,#07131c 58%,#081824);border-block:1px solid #9a6b29;box-shadow:inset 0 0 70px rgba(0,0,0,.48)}
    .viper-priority-box{display:grid;grid-template-columns:1.35fr .65fr;gap:24px;align-items:center;padding:24px;border:1px solid #9b7135;background:linear-gradient(145deg,rgba(22,35,43,.97),rgba(4,10,14,.98));box-shadow:0 18px 48px rgba(0,0,0,.34)}
    .viper-priority h2{margin:10px 0 8px;font-size:clamp(36px,5vw,70px)}
    .viper-priority p{max-width:850px;color:#c2ccd1;font-size:15px}.viper-priority strong{color:#f1d18b}
    .viper-tags{display:flex;flex-wrap:wrap;gap:7px;margin:14px 0}.viper-tag{padding:7px 10px;border:1px solid #4a6170;background:#091b27;color:#d6dde0;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
    .viper-target{padding:18px;border-left:4px solid #d09a43;background:#06141d}.viper-target b{display:block;color:#efd18e;font:800 23px/1.05 'Barlow Condensed',sans-serif;text-transform:uppercase}.viper-target span{display:block;margin-top:8px;color:#9fadb4}
    .viper-admin-alert{margin:0 0 18px;padding:18px;border:1px solid #a47734;background:linear-gradient(135deg,#2a1b0a,#091c28);box-shadow:0 12px 30px rgba(0,0,0,.25)}
    .viper-admin-alert h2{margin:7px 0 5px;font-size:36px}.viper-admin-alert p{color:#bdc7cc}.viper-admin-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:12px}
    @media(max-width:760px){.viper-priority-box{grid-template-columns:1fr}.viper-priority{padding:14px!important}.viper-priority h2{font-size:42px}}
  `;
  document.head.appendChild(style);
  const publicMount=()=>{
    if(document.getElementById('viperPriority')||!document.querySelector('.search-command'))return;
    const section=document.createElement('section');
    section.id='viperPriority';section.className='viper-priority';
    section.innerHTML=`<div class="viper-priority-box"><div><span class="eyebrow">Active buyer requirement · acquisition priority</span><h2>Viper 500 / 600. <span>522-series.</span></h2><p>IALS is actively locating <strong>Viper 500-series and 600-series turbine engines, 522-series units, complete starters, accessories, serial records and original logbooks</strong>. Current opportunity lanes include identified aircraft buyers connected to the United Kingdom and South America, plus qualified jet-car, land-speed and experimental markets.</p><div class="viper-tags"><span class="viper-tag">Complete engines</span><span class="viper-tag">Logbooks & records</span><span class="viper-tag">Complete starters</span><span class="viper-tag">500 series</span><span class="viper-tag">600 series</span><span class="viper-tag">522 series</span></div><div class="actions"><a class="btn gold" href="${page}">Offer or source a Viper →</a><a class="btn ghost" href="tel:+18018887612">Call IALS →</a></div></div><div class="viper-target"><b>Buyer exists.<br>Inventory needed.</b><span>Send exact model, data plate, serial, condition, ownership, location, accessories, log status, intended end use and destination. No eligibility or airworthiness claim is made until records are verified.</span></div></div>`;
    document.querySelector('.search-command').insertAdjacentElement('afterend',section);
  };
  const adminMount=()=>{
    const dash=document.getElementById('dashboardPanel');
    if(!dash||document.getElementById('viperAdminAlert'))return;
    const alert=document.createElement('div');alert.id='viperAdminAlert';alert.className='viper-admin-alert';
    alert.innerHTML=`<span class="eyebrow">P0 acquisition lane</span><h2>Find Viper 500 / 600 and 522-series inventory.</h2><p>Buyer demand is already identified. Priority targets: complete turbine engines, complete starters, accessories, logbooks, serial records and transferable inventory for UK, South American and qualified jet-car opportunities.</p><div class="viper-admin-actions"><a class="btn gold" href="${page}">Open acquisition page</a><button class="btn dark" id="copyViperCampaign">Copy supplier outreach</button></div>`;
    const anchor=dash.querySelector('.kpis')||dash.firstElementChild;anchor?.insertAdjacentElement(anchor.classList?.contains('kpis')?'beforebegin':'afterend',alert);
    document.getElementById('copyViperCampaign')?.addEventListener('click',()=>{
      const text=`Subject: Buying Viper 500 / 600 and 522-series turbine engines\n\nIALS has an active buyer requirement for Viper 500-series, 600-series and 522-series turbine engines. We are seeking complete engines, complete starters, accessories, data plates, serial information and original logbooks or maintenance records.\n\nPlease send exact model, serial number, condition, completeness, ownership, location, asking basis, photographs and logbook status. Aircraft, export, experimental and jet-car pathways remain subject to identity, end-use, destination and transfer review.\n\nInternational Aviation Logistics Support\n801-888-7612`;
      navigator.clipboard.writeText(text).then(()=>alert('Viper supplier outreach copied. Review the recipient and every claim before sending.'));
    });
  };
  const mount=()=>{publicMount();adminMount();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
