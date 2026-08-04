(()=>{
  const script=document.currentScript;
  const base=script?.src||new URL('assets/media-loader.js',location.href).href;
  const root=document.documentElement;
  const blank='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
  const logoSelector='img[data-ials-logo],img[src*="ials-warbird.svg"],.brand-lockup img,.admin-header img,.footer img';

  root.classList.add('ials-logo-loading','ials-media-ready');

  const logoNodes=()=>Array.from(document.querySelectorAll(logoSelector));
  const prepareLogos=()=>{
    logoNodes().forEach(img=>{
      if(!img.dataset.ialsLogoOriginal)img.dataset.ialsLogoOriginal=img.getAttribute('src')||'';
      img.removeAttribute('srcset');
      img.src=blank;
      img.style.opacity='0';
      img.style.visibility='hidden';
      img.style.display='block';
    });
  };
  prepareLogos();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',prepareLogos,{once:true});

  const style=document.createElement('style');
  style.dataset.ialsFix='real-webp-logo-mobile-layout';
  style.textContent=`
    html,body{max-width:100%;overflow-x:hidden}
    ${logoSelector}{display:block!important;object-fit:contain!important;object-position:center!important;background:transparent!important;filter:drop-shadow(0 9px 20px rgba(0,0,0,.78))!important}
    html.ials-logo-loading ${logoSelector}{opacity:0!important;visibility:hidden!important}
    html.ials-logo-ready ${logoSelector}{opacity:1!important;visibility:visible!important}
    .site-nav,.admin-header{min-height:90px!important;padding-block:4px!important;background:rgba(1,6,9,.98)!important}
    .brand-lockup img,.admin-header img{width:230px!important;height:82px!important;max-height:none!important}
    .footer img{width:280px!important;height:190px!important;margin:0!important;object-fit:contain!important}
    .login-card{margin:22px auto!important}
    .hero{min-height:0!important;box-shadow:none!important}
    .hero:before{display:none!important}
    .hero-seo-copy{position:relative!important;width:100%!important;height:auto!important;margin:0!important;clip:auto!important;white-space:normal!important;overflow:visible!important}
    .console-card{overflow:hidden!important}
    @media(max-width:900px){
      .nav-trust{display:none!important}
      .command-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      .radar-card,.program-card,.recovery-card,.compliance-card,.special-card,.outreach-card,.command-card{grid-column:auto!important}
    }
    @media(max-width:760px){
      .topbar{padding:9px 16px!important;font-size:9px!important;line-height:1.55!important}
      .site-nav,.admin-header{position:relative!important;min-height:84px!important;padding:3px 14px!important;gap:8px!important}
      .brand-lockup,.admin-header>a{min-width:0!important;flex:0 1 190px!important}
      .brand-lockup img,.admin-header img{width:184px!important;height:76px!important}
      .navlinks{margin-left:auto!important}.navlinks .secure{font-size:12px!important;padding:10px 12px!important}
      .hero{display:block!important;padding:0!important;background:#02070b!important}
      html.ials-hero-ready .hero:before{content:""!important;display:block!important;width:100%!important;aspect-ratio:16/9!important;background-image:linear-gradient(0deg,rgba(1,5,8,.3),transparent 48%),var(--ials-hero-image)!important;background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;border-bottom:1px solid rgba(190,133,48,.35)!important}
      .hero-seo-copy{padding:28px 20px 10px!important;background:linear-gradient(180deg,#07131d,#02070b)!important}
      .hero-seo-copy h1{font-size:clamp(43px,13vw,58px)!important;line-height:.9!important}
      .hero-seo-copy p{font-size:16px!important;line-height:1.58!important}
      .hero-controls{display:block!important;padding:8px 20px 30px!important;background:#02070b!important}
      .hero-controls .actions{display:grid!important;grid-template-columns:1fr!important;gap:10px!important;width:100%!important}
      .hero-controls .btn{width:100%!important;min-height:56px!important}
      .hero-proof{max-width:none!important;margin-top:18px!important;padding:18px!important}
      .search-command{margin:0!important;grid-template-columns:1fr!important;border-left:0!important;border-right:0!important}
      .command-cell{min-height:auto!important;border-right:0!important;border-bottom:1px solid #31434e!important;padding:16px!important}
      .metric-strip{grid-template-columns:repeat(2,1fr)!important;gap:10px!important;min-height:110px!important}
      .metric{padding:10px!important;border:1px solid #263c48!important;background:#071722!important}
      main section{padding:48px 18px!important}
      .command-deck{padding:16px 14px 28px!important}.command-grid{display:block!important}
      .console-card{margin-bottom:14px!important;min-height:0!important;padding:20px!important}
      .console-card .card-link{position:static!important;display:block!important;margin-top:18px!important;padding:14px!important}
      .radar-list{position:static!important;margin-top:12px!important;padding:0!important}.radar-screen{margin-inline:auto!important}
      .engine-matrix{grid-template-columns:1fr 1fr!important;gap:8px!important}.engine-chip{min-height:94px!important;padding:12px!important}
      .section-head{display:block!important;margin-bottom:24px!important}
      .grid,.agent-grid,.programs,.split,.special-grid,.article-grid,.form,.footer-grid,.kpis{grid-template-columns:1fr!important}
      .program{min-height:0!important;padding:22px!important}
      .special .actions{display:grid!important;grid-template-columns:1fr!important}.special .btn{width:100%!important;min-height:54px!important}
      .special .engine-orb{min-height:0!important;aspect-ratio:4/3!important;margin-top:20px!important}
      .form{padding:18px!important;gap:14px!important}.form label,.full{grid-column:1/-1!important}
      .form input,.form select,.form textarea{font-size:16px!important}
      .search-tools{display:grid!important;grid-template-columns:1fr!important;padding:14px!important}.search-tools input{min-width:0!important;width:100%!important}
      .footer{padding:28px 20px 24px!important}.footer-grid{text-align:center!important;gap:16px!important}
      .footer img{width:245px!important;height:170px!important;margin:0 auto!important}
      .footer p{font-size:15px!important;line-height:1.7!important;margin-inline:auto!important}
      .footer small{font-size:11px!important;text-align:left!important;margin-top:22px!important}
      .login-card{margin:16px 14px!important;padding:24px 20px!important}.admin-wrap{padding:18px 14px!important}
    }
    @media(max-width:430px){
      .brand-lockup,.admin-header>a{flex-basis:168px!important}
      .brand-lockup img,.admin-header img{width:164px!important;height:70px!important}
      .navlinks .secure{font-size:11px!important;padding:10px!important}
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

  const applyRealLogo=async()=>{
    try{
      const response=await fetch(new URL('./media/captain-logo.txt?v=1',base),{cache:'no-store'});
      if(!response.ok)throw new Error(`captain logo unavailable (${response.status})`);
      const encoded=(await response.text()).replace(/\s+/g,'');
      if(!encoded.startsWith('l2dX'))throw new Error('captain logo payload is invalid');
      const logoUrl=`data:image/webp;base64,${encoded}`;
      await decode(logoUrl);
      const install=()=>{
        logoNodes().forEach(img=>{
          img.src=logoUrl;
          img.removeAttribute('srcset');
          img.style.opacity='1';
          img.style.visibility='visible';
          img.style.display='block';
        });
        document.querySelectorAll('link[rel~="icon"]').forEach(link=>link.href=logoUrl);
      };
      install();
      if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
      root.classList.remove('ials-logo-loading');
      root.classList.add('ials-logo-ready','ials-logo-fixed','ials-media-ready');
      return logoUrl;
    }catch(error){
      console.error('IALS captain logo failed to load',error);
      root.classList.remove('ials-logo-loading');
      root.classList.add('ials-logo-failed','ials-media-ready');
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
      const mime=encoded.startsWith('/9j/')?'image/jpeg':encoded.startsWith('iVBOR')?'image/png':'image/webp';
      const heroUrl=`data:${mime};base64,${encoded}`;
      await decode(heroUrl);
      root.style.setProperty('--ials-hero-image',`url("${heroUrl}")`);
      root.classList.add('ials-hero-ready');
      document.querySelectorAll('.recovery-card .metal-stack').forEach(el=>{
        el.style.backgroundImage=`linear-gradient(90deg,rgba(2,7,10,.08),rgba(2,7,10,.16)),url("${heroUrl}")`;
        el.style.backgroundSize='245% auto';el.style.backgroundPosition='91% 88%';
      });
      document.querySelectorAll('.special .engine-orb').forEach(el=>el.style.backgroundImage=`url("${heroUrl}")`);
      return heroUrl;
    }catch(error){
      console.warn('IALS hero unavailable; no empty image area reserved',error);
      return null;
    }
  };

  window.IALSMediaReady=Promise.allSettled([applyRealLogo(),loadHero()]);
  if(!document.querySelector('script[data-ials-viper]')){
    const opportunity=document.createElement('script');
    opportunity.dataset.ialsViper='1';
    opportunity.src=new URL('./viper-opportunity.js',base).href;
    document.head.appendChild(opportunity);
  }
})();
