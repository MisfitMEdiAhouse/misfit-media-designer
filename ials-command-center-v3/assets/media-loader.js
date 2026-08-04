(()=>{
  const script=document.currentScript;
  const base=script?.src||new URL('assets/media-loader.js',location.href).href;
  const root=document.documentElement;

  const style=document.createElement('style');
  style.dataset.ialsHotfix='approved-logo-mobile-v1';
  style.textContent=`
    html,body{max-width:100%;overflow-x:hidden}
    img[data-ials-logo],img[src*="ials-warbird.svg"]{
      display:block!important;visibility:visible!important;object-fit:contain!important;
      object-position:center!important;background:#000!important;
      filter:drop-shadow(0 10px 24px rgba(0,0,0,.82));
    }
    html:not(.ials-logo-fixed) img[data-ials-logo],
    html:not(.ials-logo-fixed) img[src*="ials-warbird.svg"]{opacity:0!important}
    html.ials-logo-fixed img[data-ials-logo],
    html.ials-logo-fixed img[src*="ials-warbird.svg"]{opacity:1!important}
    .site-nav,.admin-header{min-height:94px!important;padding-block:4px!important;background:rgba(1,6,9,.98)!important}
    .brand-lockup img,.admin-header img{width:244px!important;height:88px!important;max-height:none!important}
    .footer img{width:300px!important;height:205px!important;object-fit:contain!important}
    .hero{min-height:0!important;background:#02070b!important;box-shadow:none!important}
    .hero-seo-copy{position:relative!important;width:100%!important;height:auto!important;margin:0!important;padding:32px clamp(20px,4vw,68px) 12px!important;clip:auto!important;white-space:normal!important;overflow:visible!important;background:linear-gradient(180deg,#07131d,#02070b)!important}
    .hero-controls{padding:8px clamp(20px,4vw,68px) 34px!important;background:#02070b!important}
    .console-card{overflow:hidden!important}
    .recovery-card .metal-stack{height:190px!important;margin:16px 0!important;border-radius:12px!important;border:1px solid #425866!important;background:#050b0f center/cover no-repeat!important;box-shadow:inset 0 0 30px rgba(0,0,0,.35),0 14px 28px rgba(0,0,0,.28)!important}
    .special .engine-orb{background-position:center!important;background-size:cover!important}
    .special .engine-orb:after{display:none!important}
    .login-card{margin:24px auto!important}
    @media(max-width:900px){
      .nav-trust{display:none!important}
      .command-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      .radar-card,.program-card,.recovery-card,.compliance-card,.special-card,.outreach-card,.command-card{grid-column:auto!important}
    }
    @media(max-width:760px){
      .topbar{padding:9px 16px!important;font-size:9px!important;line-height:1.55!important}
      .site-nav,.admin-header{position:relative!important;min-height:88px!important;padding:4px 14px!important;gap:8px!important}
      .brand-lockup img,.admin-header img{width:184px!important;height:76px!important}
      .navlinks{margin-left:auto!important}.navlinks .secure{font-size:12px!important;padding:11px 13px!important}
      .hero{display:block!important;padding:0!important}
      .hero:before{display:none!important}
      html.ials-hero-ready .hero:before{content:""!important;display:block!important;width:100%!important;aspect-ratio:16/9!important;background-image:linear-gradient(0deg,rgba(1,5,8,.28),transparent 48%),var(--ials-hero-image)!important;background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;border-bottom:1px solid rgba(190,133,48,.35)!important}
      .hero-seo-copy{padding:28px 20px 10px!important}
      .hero-seo-copy h1{font-size:clamp(43px,13vw,58px)!important;line-height:.9!important}
      .hero-seo-copy p{font-size:16px!important;line-height:1.58!important}
      .hero-controls{display:block!important;padding:8px 20px 30px!important}
      .hero-controls .actions{display:grid!important;grid-template-columns:1fr!important;gap:10px!important;width:100%!important}
      .hero-controls .btn{width:100%!important;min-height:56px!important}
      .hero-proof{max-width:none!important;margin-top:18px!important;padding:18px!important}
      .search-command{margin:0!important;grid-template-columns:1fr!important;border-left:0!important;border-right:0!important}
      .command-cell{min-height:auto!important;border-right:0!important;border-bottom:1px solid #31434e!important;padding:16px!important}
      .metric-strip{grid-template-columns:repeat(2,1fr)!important;gap:10px!important;min-height:110px!important}
      .metric{padding:10px!important;border:1px solid #263c48!important;background:#071722!important}
      main section{padding:48px 18px!important}
      .command-deck{padding:16px 14px 28px!important}
      .command-grid{display:block!important}
      .console-card{margin-bottom:14px!important;min-height:0!important;padding:20px!important}
      .console-card .card-link{position:static!important;display:block!important;margin-top:18px!important;padding:14px!important}
      .radar-list{position:static!important;margin-top:12px!important;padding:0!important}
      .radar-screen{margin-inline:auto!important}
      .engine-matrix{grid-template-columns:1fr 1fr!important;gap:8px!important}
      .engine-chip{min-height:94px!important;padding:12px!important}
      .recovery-card .metal-stack{height:auto!important;aspect-ratio:16/9!important;background-size:cover!important;background-position:center!important}
      .section-head{display:block!important;margin-bottom:24px!important}
      .grid,.agent-grid,.programs,.split,.special-grid,.article-grid,.form,.footer-grid,.kpis{grid-template-columns:1fr!important}
      .program{min-height:0!important;padding:22px!important}
      .special .actions{display:grid!important;grid-template-columns:1fr!important}
      .special .btn{width:100%!important;min-height:54px!important}
      .special .engine-orb{min-height:0!important;aspect-ratio:4/3!important;margin-top:20px!important}
      .form{padding:18px!important;gap:14px!important}.form label,.full{grid-column:1/-1!important}
      .form input,.form select,.form textarea{font-size:16px!important}
      .search-tools{display:grid!important;grid-template-columns:1fr!important;padding:14px!important}
      .search-tools input{min-width:0!important;width:100%!important}
      .footer{padding:34px 20px 26px!important}
      .footer-grid{text-align:center!important;gap:22px!important}
      .footer img{width:250px!important;height:174px!important;margin:0 auto!important}
      .footer p{font-size:15px!important;line-height:1.7!important;margin-inline:auto!important}
      .footer small{font-size:11px!important;text-align:left!important}
      .login-card{margin:18px 14px!important;padding:24px 20px!important}
      .admin-wrap{padding:18px 14px!important}
    }
    @media(max-width:430px){
      .brand-lockup img,.admin-header img{width:164px!important;height:70px!important}
      .navlinks .secure{font-size:11px!important;padding:10px 11px!important}
      html.ials-hero-ready .hero:before{aspect-ratio:4/3!important;background-position:58% center!important}
      .engine-chip{font-size:18px!important;min-height:90px!important;padding:10px!important}
      .eyebrow{font-size:9px!important;letter-spacing:.1em!important}
    }
  `;
  document.head.appendChild(style);

  const decode=src=>new Promise((resolve,reject)=>{
    const image=new Image();
    const timer=setTimeout(()=>reject(new Error('image timeout')),15000);
    image.onload=()=>{clearTimeout(timer);resolve(image)};
    image.onerror=()=>{clearTimeout(timer);reject(new Error('image decode failed'))};
    image.src=src;
  });

  const fixApprovedLogo=async()=>{
    try{
      const response=await fetch(new URL('./ials-warbird.svg',base),{cache:'no-store'});
      if(!response.ok)throw new Error('logo asset unavailable');
      const svg=await response.text();
      const match=svg.match(/data:image\/(?:webp|png|jpe?g);base64,([^"']+)/i);
      if(!match)throw new Error('embedded approved logo not found');
      /* Approved image bytes are JPEG/JFIF; the prior SVG incorrectly labeled them WebP. */
      const logoUrl=`data:image/jpeg;base64,${match[1].replace(/\s+/g,'')}`;
      await decode(logoUrl);
      document.querySelectorAll('img[data-ials-logo],img[src*="ials-warbird.svg"]').forEach(img=>{
        img.src=logoUrl;
        img.removeAttribute('srcset');
      });
      document.querySelectorAll('link[rel~="icon"]').forEach(link=>link.href=logoUrl);
      root.classList.add('ials-logo-fixed','ials-logo-ready','ials-media-ready');
      return logoUrl;
    }catch(error){
      console.error('IALS approved logo repair failed',error);
      root.classList.add('ials-logo-ready','ials-media-ready');
      return null;
    }
  };

  const join=async(name,count)=>{
    const parts=await Promise.all(Array.from({length:count},(_,i)=>fetch(new URL(`./media/${name}-${i}.txt`,base),{cache:'no-store'}).then(r=>{
      if(!r.ok)throw new Error(`${name}-${i} unavailable`);
      return r.text();
    })));
    return parts.join('').replace(/\s+/g,'');
  };

  const loadHero=async()=>{
    try{
      const encoded=await join('hero',4);
      const heroUrl=`data:image/webp;base64,${encoded}`;
      await decode(heroUrl);
      root.style.setProperty('--ials-hero-image',`url("${heroUrl}")`);
      root.classList.add('ials-hero-ready');
      document.querySelectorAll('.recovery-card .metal-stack').forEach(el=>{
        el.style.backgroundImage=`linear-gradient(90deg,rgba(2,7,10,.08),rgba(2,7,10,.16)),url("${heroUrl}")`;
        el.style.backgroundSize='245% auto';
        el.style.backgroundPosition='91% 88%';
      });
      document.querySelectorAll('.special .engine-orb').forEach(el=>el.style.backgroundImage=`url("${heroUrl}")`);
      return heroUrl;
    }catch(error){
      console.warn('IALS hero unavailable; no empty space reserved',error);
      return null;
    }
  };

  window.IALSMediaReady=Promise.allSettled([fixApprovedLogo(),loadHero()]);

  if(!document.querySelector('script[data-ials-viper]')){
    const opportunity=document.createElement('script');
    opportunity.dataset.ialsViper='1';
    opportunity.src=new URL('./viper-opportunity.js',base).href;
    document.head.appendChild(opportunity);
  }
})();
