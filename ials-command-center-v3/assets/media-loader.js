(()=>{
  const script=document.currentScript;
  const base=script?.src||new URL('assets/media-loader.js',location.href).href;
  const root=document.documentElement;

  root.style.setProperty('--ials-hero-image','none');

  const style=document.createElement('style');
  style.textContent=`
    img[data-ials-logo],img[src*="ials-warbird.svg"]{opacity:0;transition:opacity .18s ease}
    html.ials-premium-media img[data-ials-logo],html.ials-premium-media img[src*="ials-warbird.svg"]{opacity:1}
    html.ials-premium-media .brand-lockup img,
    html.ials-premium-media .admin-header img{
      width:210px!important;height:112px!important;max-height:none!important;
      object-fit:contain!important;object-position:center!important;background:transparent!important;
      filter:drop-shadow(0 8px 18px rgba(0,0,0,.8))!important;
    }
    html.ials-premium-media .footer img{
      width:250px!important;height:176px!important;max-height:none!important;
      object-fit:contain!important;object-position:center!important;background:transparent!important;
    }
    @media(max-width:760px){
      .hero:before{display:none!important}
      .hero{min-height:0!important;background:#020609!important;box-shadow:none!important}
      html.ials-premium-media .hero:before{
        content:""!important;display:block!important;width:100%!important;
        height:auto!important;min-height:0!important;aspect-ratio:16/9!important;
        background-image:var(--ials-hero-image)!important;background-size:cover!important;
        background-position:center!important;background-repeat:no-repeat!important;
      }
      html.ials-premium-media .brand-lockup img,
      html.ials-premium-media .admin-header img{
        width:165px!important;height:96px!important;max-height:none!important;
      }
      .site-nav,.admin-header{min-height:94px!important;padding-block:4px!important}
      html.ials-premium-media .footer img{width:210px!important;height:148px!important;margin-inline:auto!important}
    }
  `;
  document.head.appendChild(style);

  const join=async(name,count)=>{
    const pieces=await Promise.all(
      Array.from({length:count},(_,i)=>fetch(new URL(`./media/${name}-${i}.txt`,base),{cache:'no-store'})
        .then(r=>{if(!r.ok)throw new Error(`${name}-${i} unavailable`);return r.text();}))
    );
    const value=pieces.join('').replace(/\s+/g,'');
    if(value.length<1000)throw new Error(`${name} payload incomplete`);
    return value;
  };

  const decode=src=>new Promise((resolve,reject)=>{
    const img=new Image();
    const timer=setTimeout(()=>reject(new Error('image load timeout')),12000);
    img.onload=()=>{clearTimeout(timer);resolve(img)};
    img.onerror=()=>{clearTimeout(timer);reject(new Error('image decode failed'))};
    img.src=src;
  });

  const loadOpportunity=()=>{
    if(document.querySelector('script[data-ials-viper]'))return;
    const s=document.createElement('script');
    s.dataset.ialsViper='1';
    s.src=new URL('./viper-opportunity.js',base).href;
    document.head.appendChild(s);
  };

  window.IALSMediaReady=(async()=>{
    try{
      const [logo64,hero64]=await Promise.all([join('logo',3),join('hero',4)]);
      const logoUrl=`data:image/webp;base64,${logo64}`;
      const heroUrl=`data:image/webp;base64,${hero64}`;
      await Promise.all([decode(logoUrl),decode(heroUrl)]);
      root.style.setProperty('--ials-hero-image',`url("${heroUrl}")`);
      document.querySelectorAll('img[data-ials-logo],img[src*="ials-warbird.svg"]').forEach(img=>{
        img.src=logoUrl;
        img.classList.add('premium-logo-loaded');
      });
      root.classList.add('ials-premium-media');
      return {logoUrl,heroUrl};
    }catch(error){
      console.error('IALS premium media failed',error);
      return null;
    }finally{
      root.classList.add('ials-media-ready');
      loadOpportunity();
    }
  })();
})();
