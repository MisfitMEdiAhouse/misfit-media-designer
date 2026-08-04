(()=>{
  const script=document.currentScript;
  const base=script?.src||new URL('assets/media-loader.js',location.href).href;
  const root=document.documentElement;

  /* Static logo is the source of truth. Never hide it behind JavaScript. */
  root.classList.add('ials-logo-ready','ials-media-ready');
  root.style.setProperty('--ials-hero-image','none');

  const style=document.createElement('style');
  style.textContent=`
    img[data-ials-logo],img[src*="ials-warbird.svg"]{
      opacity:1!important;visibility:visible!important;display:block!important;
      object-fit:contain!important;object-position:center!important;background:transparent!important;
      filter:drop-shadow(0 8px 18px rgba(0,0,0,.82))!important;
    }
    .brand-lockup img,.admin-header img{width:230px!important;height:104px!important;max-height:none!important}
    .footer img{width:270px!important;height:180px!important;max-height:none!important;object-fit:contain!important}
    .login-card{margin:28px auto!important}
    html:not(.ials-hero-ready) .hero{min-height:0!important;background:#020609!important;box-shadow:none!important}
    @media(max-width:760px){
      .site-nav,.admin-header{min-height:82px!important;padding-block:3px!important}
      .brand-lockup img,.admin-header img{width:175px!important;height:78px!important}
      .footer img{width:220px!important;height:150px!important;margin-inline:auto!important}
      .hero:before{display:none!important}
      html.ials-hero-ready .hero:before{
        content:""!important;display:block!important;width:100%!important;height:auto!important;
        min-height:0!important;aspect-ratio:16/9!important;
        background-image:var(--ials-hero-image)!important;background-size:cover!important;
        background-position:center!important;background-repeat:no-repeat!important;
      }
      .login-card{margin:20px 14px!important}
    }
  `;
  document.head.appendChild(style);

  const join=async(name,count)=>{
    const pieces=await Promise.all(Array.from({length:count},(_,i)=>
      fetch(new URL(`./media/${name}-${i}.txt`,base),{cache:'no-store'})
        .then(r=>{if(!r.ok)throw new Error(`${name}-${i} unavailable`);return r.text();})
    ));
    const value=pieces.join('').replace(/\s+/g,'');
    if(value.length<1000)throw new Error(`${name} payload incomplete`);
    return value;
  };

  const decode=src=>new Promise((resolve,reject)=>{
    const img=new Image();
    const timer=setTimeout(()=>reject(new Error('hero load timeout')),12000);
    img.onload=()=>{clearTimeout(timer);resolve(img)};
    img.onerror=()=>{clearTimeout(timer);reject(new Error('hero decode failed'))};
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
    let heroUrl=null;
    try{
      const hero64=await join('hero',4);
      heroUrl=`data:image/webp;base64,${hero64}`;
      await decode(heroUrl);
      root.style.setProperty('--ials-hero-image',`url("${heroUrl}")`);
      root.classList.add('ials-hero-ready');
    }catch(error){
      console.error('IALS premium hero unavailable; collapsing image area',error);
    }finally{
      loadOpportunity();
    }
    return {logoUrl:new URL('./ials-warbird.svg',base).href,heroUrl};
  })();
})();
