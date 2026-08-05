(()=>{
  'use strict';
  const body=document.body;
  const root=document.documentElement;
  const isAdmin=body.classList.contains('admin-shell');
  body.classList.add('ials-forensic-v3',isAdmin?'ials-admin-page':'ials-public-page');

  const style=document.createElement('style');
  style.id='ials-forensic-v3-style';
  style.textContent=`
    :root{
      --ials-bg:#02070a;
      --ials-panel:#081822;
      --ials-panel-2:#0b2230;
      --ials-line:#2f4857;
      --ials-gold:#d39a3f;
      --ials-gold-soft:#f0c66f;
      --ials-text:#f4f5f4;
      --ials-muted:#aab4bb;
      --ials-max:1360px;
    }
    *{box-sizing:border-box}
    html,body{max-width:100%;overflow-x:hidden}
    html body.ials-forensic-v3{
      margin:0!important;
      background:radial-gradient(circle at 90% 0,rgba(183,122,38,.11),transparent 25%),linear-gradient(180deg,#020609,#06131c 48%,#020609)!important;
      color:var(--ials-text)!important;
    }
    body.ials-forensic-v3 .topbar{
      width:100%!important;max-width:none!important;margin:0!important;
      display:flex!important;justify-content:center!important;gap:14px!important;flex-wrap:wrap!important;
      padding:10px 18px!important;background:#010508!important;border-bottom:1px solid rgba(81,109,124,.34)!important;
      font-size:11px!important;line-height:1.4!important;letter-spacing:.14em!important;text-align:center!important;
    }
    body.ials-forensic-v3 .site-nav,
    body.ials-forensic-v3 .admin-header{
      position:relative!important;top:auto!important;z-index:5!important;
      width:100%!important;min-height:0!important;margin:0!important;
      display:grid!important;grid-template-columns:minmax(260px,360px) 1fr auto!important;align-items:center!important;
      gap:24px!important;padding:10px clamp(20px,4vw,62px)!important;
      background:linear-gradient(180deg,#03090d,#010609)!important;
      border-bottom:1px solid rgba(211,154,63,.42)!important;
      box-shadow:0 14px 34px rgba(0,0,0,.36)!important;
    }
    body.ials-forensic-v3 .brand-lockup,
    body.ials-forensic-v3 .admin-header>a{
      width:100%!important;min-width:0!important;display:flex!important;align-items:center!important;justify-content:center!important;
      margin:0!important;padding:0!important;
    }
    html body.ials-forensic-v3 .site-nav .brand-lockup img,
    html body.ials-forensic-v3 .admin-header>a img{
      display:block!important;width:min(100%,340px)!important;height:auto!important;max-width:340px!important;max-height:none!important;
      aspect-ratio:auto!important;object-fit:contain!important;object-position:center!important;background:transparent!important;
      filter:drop-shadow(0 12px 26px rgba(0,0,0,.82))!important;
    }
    body.ials-forensic-v3 .navlinks{display:flex!important;align-items:center!important;justify-content:center!important;gap:15px!important;margin:0!important;flex-wrap:wrap!important}
    body.ials-forensic-v3 .navlinks a{font-size:12px!important;letter-spacing:.08em!important;white-space:nowrap!important}
    body.ials-forensic-v3 .navlinks .secure,
    body.ials-forensic-v3 .admin-header .btn{
      border:1px solid #a87832!important;border-radius:8px!important;background:linear-gradient(180deg,rgba(92,58,15,.36),rgba(9,17,22,.96))!important;color:#f1ce86!important;
      min-height:46px!important;padding:12px 17px!important;
    }
    body.ials-forensic-v3 .nav-trust{font-size:10px!important;line-height:1.5!important;letter-spacing:.1em!important;text-align:right!important;color:#b9c2c7!important}

    body.ials-public-page .hero{
      position:relative!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;min-height:0!important;
      width:min(100%,var(--ials-max))!important;margin:0 auto!important;padding:54px clamp(22px,5vw,76px) 36px!important;
      background:radial-gradient(circle at 88% 18%,rgba(190,126,35,.15),transparent 29%),linear-gradient(145deg,#071722,#02080c 64%)!important;
      border-left:1px solid rgba(55,82,96,.35)!important;border-right:1px solid rgba(55,82,96,.35)!important;border-bottom:1px solid rgba(55,82,96,.35)!important;
      box-shadow:none!important;overflow:hidden!important;
    }
    body.ials-public-page .hero::before,
    body.ials-public-page .hero::after{content:none!important;display:none!important}
    body.ials-public-page .hero-seo-copy{
      position:relative!important;width:min(880px,100%)!important;height:auto!important;margin:0!important;padding:0!important;
      clip:auto!important;white-space:normal!important;overflow:visible!important;background:transparent!important;
    }
    body.ials-public-page .hero-seo-copy h1{
      margin:16px 0 22px!important;max-width:920px!important;font-size:clamp(58px,7.2vw,102px)!important;line-height:.86!important;letter-spacing:.005em!important;text-wrap:balance!important;
    }
    body.ials-public-page .hero-seo-copy p{max-width:760px!important;margin:0!important;font-size:19px!important;line-height:1.58!important;color:#b9c2c8!important}
    body.ials-public-page .hero-controls{
      display:grid!important;grid-template-columns:minmax(0,1fr) minmax(320px,470px)!important;align-items:end!important;gap:24px!important;
      width:100%!important;margin-top:28px!important;padding:0!important;background:transparent!important;
    }
    body.ials-public-page .hero-controls .actions{display:flex!important;gap:10px!important;flex-wrap:wrap!important}
    body.ials-forensic-v3 .btn{border-radius:8px!important;min-height:50px!important;padding:13px 20px!important}
    body.ials-public-page .hero-proof{
      margin:0!important;padding:17px 18px!important;border:1px solid #405b69!important;border-left:4px solid var(--ials-gold)!important;border-radius:9px!important;
      background:rgba(2,9,14,.82)!important;box-shadow:0 16px 34px rgba(0,0,0,.25)!important;
    }
    body.ials-public-page .hero-proof b{display:block!important;margin-bottom:5px!important;color:#efd18d!important}

    body.ials-public-page .search-command{
      width:min(calc(100% - 32px),var(--ials-max))!important;margin:18px auto 0!important;border:1px solid #405a68!important;border-radius:12px!important;
      overflow:hidden!important;background:#071721!important;box-shadow:0 18px 40px rgba(0,0,0,.26)!important;
    }
    body.ials-public-page .command-deck,
    body.ials-public-page main>section:not(.special){width:min(100%,var(--ials-max))!important;margin-inline:auto!important}
    body.ials-public-page .command-grid{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;gap:14px!important}
    body.ials-public-page .console-card{
      position:relative!important;min-height:0!important;margin:0!important;padding:24px!important;border:1px solid #36505e!important;border-radius:12px!important;
      overflow:hidden!important;background:linear-gradient(145deg,rgba(12,32,44,.98),rgba(3,11,16,.99))!important;box-shadow:0 16px 38px rgba(0,0,0,.25)!important;
    }
    body.ials-public-page .radar-card,body.ials-public-page .program-card,body.ials-public-page .recovery-card,body.ials-public-page .compliance-card{grid-column:span 6!important}
    body.ials-public-page .special-card,body.ials-public-page .outreach-card,body.ials-public-page .command-card{grid-column:span 4!important}
    body.ials-forensic-v3 .console-card .card-link{position:static!important;display:block!important;margin-top:18px!important;padding:14px!important;border-radius:8px!important}
    body.ials-forensic-v3 .metal-stack,
    body.ials-forensic-v3 .shield-grid,
    body.ials-forensic-v3 .engine-orb{display:none!important;background:none!important;min-height:0!important;height:0!important;margin:0!important;border:0!important}
    body.ials-public-page .special-grid{grid-template-columns:1fr!important;max-width:980px!important;margin-inline:auto!important}
    body.ials-public-page .special{background:linear-gradient(180deg,#100c07,#05090c)!important}
    body.ials-forensic-v3 .program,
    body.ials-forensic-v3 .card,
    body.ials-forensic-v3 .form,
    body.ials-forensic-v3 .search-panel{
      border-radius:12px!important;overflow:hidden!important;border-color:#36505e!important;background:linear-gradient(145deg,#0a202d,#040d13)!important;
    }
    body.ials-forensic-v3 .section-head{padding-bottom:18px!important;border-bottom:1px solid rgba(72,101,116,.35)!important}
    body.ials-forensic-v3 .footer{padding-top:42px!important}
    body.ials-forensic-v3 .footer img{width:min(360px,90vw)!important;height:auto!important;max-height:none!important;aspect-ratio:auto!important;object-fit:contain!important;margin:0 auto 18px!important}

    body.ials-admin-page .admin-wrap{width:min(100%,1280px)!important;margin:0 auto!important;padding:28px clamp(16px,4vw,52px) 50px!important}
    body.ials-admin-page.admin-login-mode .admin-wrap{min-height:0!important;display:block!important}
    body.ials-admin-page .login-card{
      width:min(100%,720px)!important;max-width:none!important;margin:24px auto 0!important;padding:38px 40px!important;border:1px solid #486475!important;border-radius:13px!important;
      background:radial-gradient(circle at 100% 0,rgba(210,149,54,.13),transparent 35%),linear-gradient(145deg,#0c2635,#06131b 72%)!important;box-shadow:0 28px 65px rgba(0,0,0,.4)!important;
    }
    body.ials-admin-page .login-card h2{font-size:clamp(52px,7vw,76px)!important;line-height:.9!important;margin:15px 0 18px!important}
    body.ials-admin-page .login-card input{width:100%!important;min-height:56px!important;margin-top:18px!important;border-radius:8px!important;font-size:17px!important}
    body.ials-admin-page .login-card .btn{width:100%!important;margin-top:10px!important}

    @media(max-width:1040px){
      body.ials-forensic-v3 .site-nav,body.ials-forensic-v3 .admin-header{grid-template-columns:280px 1fr!important;gap:16px!important}
      body.ials-forensic-v3 .nav-trust{display:none!important}
      body.ials-public-page .hero-controls{grid-template-columns:1fr!important}
      body.ials-public-page .hero-proof{max-width:760px!important}
    }
    @media(max-width:760px){
      body.ials-forensic-v3 .topbar{display:block!important;padding:9px 14px!important;font-size:9px!important;line-height:1.55!important}
      body.ials-forensic-v3 .topbar span{display:block!important}
      body.ials-forensic-v3 .site-nav,body.ials-forensic-v3 .admin-header{
        grid-template-columns:1fr!important;justify-items:center!important;gap:10px!important;padding:10px 14px 13px!important;
      }
      html body.ials-forensic-v3 .site-nav .brand-lockup img,
      html body.ials-forensic-v3 .admin-header>a img{
        width:min(92vw,520px)!important;max-width:520px!important;height:auto!important;max-height:none!important;aspect-ratio:auto!important;
      }
      body.ials-public-page .navlinks{width:100%!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important}
      body.ials-public-page .navlinks a{display:none!important}
      body.ials-public-page .navlinks a[href="#sell"],body.ials-public-page .navlinks .secure{display:flex!important;align-items:center!important;justify-content:center!important;min-height:46px!important}
      body.ials-admin-page .admin-header .actions{width:100%!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;margin:0!important}
      body.ials-public-page .hero{margin:0!important;padding:30px 18px 28px!important;border-left:0!important;border-right:0!important}
      body.ials-public-page .hero-seo-copy{padding:0!important}
      body.ials-public-page .hero-seo-copy h1{font-size:clamp(45px,13.1vw,62px)!important;line-height:.88!important;margin:14px 0 20px!important}
      body.ials-public-page .hero-seo-copy p{font-size:16px!important;line-height:1.58!important}
      body.ials-public-page .hero-controls{display:block!important;margin-top:22px!important}
      body.ials-public-page .hero-controls .actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:9px!important}
      body.ials-public-page .hero-controls .actions .btn:first-child{grid-column:1/-1!important}
      body.ials-public-page .hero-controls .btn{width:100%!important;min-height:54px!important;padding:12px 9px!important}
      body.ials-public-page .hero-proof{margin-top:14px!important;padding:15px 16px!important}
      body.ials-public-page .search-command{width:calc(100% - 24px)!important;margin-top:12px!important;grid-template-columns:1fr!important}
      body.ials-public-page .command-cell{min-height:0!important;padding:16px!important;border-right:0!important;border-bottom:1px solid #304653!important}
      body.ials-public-page .metric-strip{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}
      body.ials-public-page main section,body.ials-public-page .command-deck{padding:38px 14px!important}
      body.ials-public-page .command-deck{padding-top:16px!important}
      body.ials-public-page .command-grid{grid-template-columns:1fr!important;gap:12px!important}
      body.ials-public-page .radar-card,body.ials-public-page .program-card,body.ials-public-page .recovery-card,body.ials-public-page .compliance-card,body.ials-public-page .special-card,body.ials-public-page .outreach-card,body.ials-public-page .command-card{grid-column:1!important}
      body.ials-public-page .console-card{padding:22px 20px!important}
      body.ials-forensic-v3 .section-head{display:block!important;margin-bottom:22px!important}
      body.ials-forensic-v3 .section-head p{margin-top:13px!important}
      body.ials-forensic-v3 .grid,body.ials-forensic-v3 .programs,body.ials-forensic-v3 .split,body.ials-forensic-v3 .form,body.ials-forensic-v3 .footer-grid,body.ials-forensic-v3 .kpis{grid-template-columns:1fr!important}
      body.ials-forensic-v3 .special .actions{display:grid!important;grid-template-columns:1fr!important}
      body.ials-forensic-v3 .special .btn{width:100%!important}
      body.ials-forensic-v3 .form{padding:18px!important}
      body.ials-forensic-v3 .footer{padding:32px 20px 24px!important;text-align:center!important}
      body.ials-forensic-v3 .footer small{text-align:left!important;display:block!important}
      body.ials-admin-page .admin-wrap{padding:18px 14px 40px!important}
      body.ials-admin-page .login-card{width:100%!important;margin:16px auto 0!important;padding:28px 22px!important}
      body.ials-admin-page .login-card h2{font-size:clamp(48px,13vw,64px)!important}
    }
    @media(max-width:430px){
      html body.ials-forensic-v3 .site-nav .brand-lockup img,
      html body.ials-forensic-v3 .admin-header>a img{width:min(96vw,500px)!important}
      body.ials-public-page .hero-controls .btn{font-size:11px!important}
      body.ials-public-page .hero-seo-copy h1{font-size:clamp(43px,13.3vw,55px)!important}
    }
  `;
  document.head.appendChild(style);

  const syncAdminMode=()=>{
    if(!isAdmin)return;
    const login=document.getElementById('loginScreen');
    const app=document.getElementById('adminApp');
    const loginVisible=login&&!login.classList.contains('hidden')&&(!app||app.classList.contains('hidden'));
    body.classList.toggle('admin-login-mode',Boolean(loginVisible));
  };
  syncAdminMode();
  if(isAdmin){
    const observer=new MutationObserver(syncAdminMode);
    const login=document.getElementById('loginScreen');
    const app=document.getElementById('adminApp');
    if(login)observer.observe(login,{attributes:true,attributeFilter:['class','style']});
    if(app)observer.observe(app,{attributes:true,attributeFilter:['class','style']});
  }

  let tries=0;
  const repairInventory=()=>{
    tries+=1;
    if(typeof IALS==='undefined'){
      if(tries<80)setTimeout(repairInventory,100);
      return;
    }
    IALS.dataUrl=()=>{
      const p=location.pathname;
      const marker='/ials-command-center-v3/';
      if(p.includes(marker))return p.split(marker)[0]+'/ials-command-center-v2/inventory.json';
      return '../ials-command-center-v2/inventory.json';
    };
    IALS.data=null;
    IALS.load().then(data=>{
      const inventory=Array.isArray(data?.inventory)?data.inventory:[];
      const parts=inventory.length;
      const alts=inventory.reduce((n,x)=>n+(Array.isArray(x.alts)?x.alts.length:0),0);
      const nsn=inventory.filter(x=>x.nsn).length;
      const partEl=document.getElementById('metricParts');
      const altEl=document.getElementById('metricAlts');
      const nsnEl=document.getElementById('metricNsn');
      if(partEl)partEl.textContent=String(parts);
      if(altEl)altEl.textContent=String(alts);
      if(nsnEl)nsnEl.textContent=String(nsn);
      if(typeof IALS.renderOpportunities==='function')IALS.renderOpportunities();
      if(typeof IALS.renderInventory==='function')IALS.renderInventory();
      root.classList.add('ials-inventory-repaired');
    }).catch(error=>console.error('IALS inventory repair failed',error));
  };
  repairInventory();
})();