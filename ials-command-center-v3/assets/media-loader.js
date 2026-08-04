(()=>{
  const script=document.currentScript;
  const base=script?.src||new URL('assets/media-loader.js',location.href).href;
  const root=document.documentElement;

  /* The static SVG stays visible until the exact supplied artwork is ready. */
  root.classList.add('ials-logo-ready','ials-media-ready');
  root.style.setProperty('--ials-hero-image','none');

  const style=document.createElement('style');
  style.textContent=`
    img[data-ials-logo],img[src*="ials-warbird.svg"]{
      opacity:1!important;visibility:visible!important;display:block!important;
      object-fit:contain!important;object-position:center!important;background:transparent!important;
      filter:drop-shadow(0 8px 18px rgba(0,0,0,.82))!important;
    }
    .brand-lockup img,.admin-header img{width:238px!important;height:108px!important;max-height:none!important}
    .footer img{width:286px!important;height:190px!important;max-height:none!important;object-fit:contain!important}
    .login-card{margin:28px auto!important}
    html:not(.ials-hero-ready) .hero{min-height:0!important;background:#020609!important;box-shadow:none!important}
    @media(max-width:760px){
      .site-nav,.admin-header{min-height:88px!important;padding-block:3px!important}
      .brand-lockup img,.admin-header img{width:190px!important;height:82px!important}
      .footer img{width:242px!important;height:162px!important;margin-inline:auto!important}
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
    const timer=setTimeout(()=>reject(new Error('image load timeout')),15000);
    img.onload=()=>{clearTimeout(timer);resolve(img)};
    img.onerror=()=>{clearTimeout(timer);reject(new Error('image decode failed'))};
    img.src=src;
  });

  const cropBlackMargins=img=>{
    const source=document.createElement('canvas');
    source.width=img.naturalWidth;
    source.height=img.naturalHeight;
    const ctx=source.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(img,0,0);
    const pixels=ctx.getImageData(0,0,source.width,source.height).data;
    let left=source.width,top=source.height,right=-1,bottom=-1;
    for(let y=0;y<source.height;y++){
      for(let x=0;x<source.width;x++){
        const i=(y*source.width+x)*4;
        if(Math.max(pixels[i],pixels[i+1],pixels[i+2])>16&&pixels[i+3]>20){
          if(x<left)left=x;if(x>right)right=x;if(y<top)top=y;if(y>bottom)bottom=y;
        }
      }
    }
    if(right<left||bottom<top)return source.toDataURL('image/webp',.92);
    const margin=Math.max(12,Math.round(Math.min(source.width,source.height)*.018));
    left=Math.max(0,left-margin);top=Math.max(0,top-margin);
    right=Math.min(source.width-1,right+margin);bottom=Math.min(source.height-1,bottom+margin);
    const sw=right-left+1,sh=bottom-top+1;
    const maxWidth=1200,scale=Math.min(1,maxWidth/sw);
    const out=document.createElement('canvas');
    out.width=Math.max(1,Math.round(sw*scale));
    out.height=Math.max(1,Math.round(sh*scale));
    out.getContext('2d').drawImage(source,left,top,sw,sh,0,0,out.width,out.height);
    return out.toDataURL('image/webp',.92);
  };

  const loadExactLogo=async()=>{
    try{
      const logo64=await join('logo',3);
      const rawUrl=`data:image/webp;base64,${logo64}`;
      const decoded=await decode(rawUrl);
      const exactLogoUrl=cropBlackMargins(decoded);
      document.querySelectorAll('img[data-ials-logo],img[src*="ials-warbird.svg"]').forEach(img=>{
        img.src=exactLogoUrl;
        img.classList.add('exact-logo-loaded');
      });
      root.classList.add('ials-exact-logo-ready');
      return exactLogoUrl;
    }catch(error){
      console.error('IALS exact logo failed; static fallback remains visible',error);
      return new URL('./ials-warbird.svg',base).href;
    }
  };

  const loadHero=async()=>{
    try{
      const hero64=await join('hero',4);
      const heroUrl=`data:image/webp;base64,${hero64}`;
      await decode(heroUrl);
      root.style.setProperty('--ials-hero-image',`url("${heroUrl}")`);
      root.classList.add('ials-hero-ready');
      return heroUrl;
    }catch(error){
      console.error('IALS premium hero unavailable; image area remains collapsed',error);
      return null;
    }
  };

  const loadOpportunity=()=>{
    if(document.querySelector('script[data-ials-viper]'))return;
    const s=document.createElement('script');
    s.dataset.ialsViper='1';
    s.src=new URL('./viper-opportunity.js',base).href;
    document.head.appendChild(s);
  };

  window.IALSMediaReady=(async()=>{
    const [logoResult,heroResult]=await Promise.allSettled([loadExactLogo(),loadHero()]);
    loadOpportunity();
    return {
      logoUrl:logoResult.status==='fulfilled'?logoResult.value:null,
      heroUrl:heroResult.status==='fulfilled'?heroResult.value:null
    };
  })();
})();
