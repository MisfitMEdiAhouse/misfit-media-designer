(()=>{
  const script=document.currentScript;
  const base=script?.src||new URL('assets/media-loader.js',location.href).href;

  document.documentElement.style.setProperty('--ials-hero-image','linear-gradient(135deg,#111b24 0%,#04090d 58%,#382713 100%)');
  const style=document.createElement('style');
  style.textContent=`
    .brand-lockup img.premium-logo-loaded,.admin-header img.premium-logo-loaded{
      width:210px!important;height:auto!important;max-height:112px!important;
      object-fit:contain!important;object-position:center!important;background:transparent!important;
      filter:drop-shadow(0 8px 18px rgba(0,0,0,.78))!important;
    }
    .footer img.premium-logo-loaded{
      width:260px!important;height:auto!important;max-height:180px!important;
      object-fit:contain!important;background:transparent!important;
    }
    @media(max-width:760px){
      .brand-lockup img.premium-logo-loaded,.admin-header img.premium-logo-loaded{
        width:158px!important;max-height:96px!important;
      }
      .site-nav,.admin-header{min-height:92px!important}
      .footer img.premium-logo-loaded{width:215px!important;max-height:150px!important;margin-inline:auto!important}
    }
  `;
  document.head.appendChild(style);

  const join=async(name,count)=>{
    const responses=await Promise.all(
      Array.from({length:count},(_,i)=>
        fetch(new URL(`./media/${name}-${i}.txt`,base),{cache:'no-store'})
          .then(r=>{if(!r.ok)throw new Error(`${name}-${i} unavailable`);return r.text();})
      )
    );
    const value=responses.join('').replace(/\s+/g,'');
    if(value.length<1000)throw new Error(`${name} payload incomplete`);
    return value;
  };

  const loadImage=src=>new Promise((resolve,reject)=>{
    const img=new Image();
    const timer=setTimeout(()=>reject(new Error('image load timeout')),12000);
    img.onload=()=>{clearTimeout(timer);resolve(img)};
    img.onerror=()=>{clearTimeout(timer);reject(new Error('image decode failed'))};
    img.src=src;
  });

  const cropDarkBorder=async src=>{
    const img=await loadImage(src);
    const scan=document.createElement('canvas');
    scan.width=img.naturalWidth;scan.height=img.naturalHeight;
    const ctx=scan.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(img,0,0);
    const data=ctx.getImageData(0,0,scan.width,scan.height).data;
    let minX=scan.width,minY=scan.height,maxX=0,maxY=0,found=false;
    for(let y=0;y<scan.height;y+=2){
      for(let x=0;x<scan.width;x+=2){
        const p=(y*scan.width+x)*4;
        const brightness=Math.max(data[p],data[p+1],data[p+2]);
        if(data[p+3]>20&&brightness>28){
          found=true;
          if(x<minX)minX=x;if(x>maxX)maxX=x;
          if(y<minY)minY=y;if(y>maxY)maxY=y;
        }
      }
    }
    if(!found)return src;
    const padX=Math.round((maxX-minX)*.04),padY=Math.round((maxY-minY)*.055);
    minX=Math.max(0,minX-padX);maxX=Math.min(scan.width,maxX+padX);
    minY=Math.max(0,minY-padY);maxY=Math.min(scan.height,maxY+padY);
    const w=maxX-minX,h=maxY-minY;
    const out=document.createElement('canvas');
    const targetW=Math.min(1100,w);
    out.width=targetW;out.height=Math.round(h*(targetW/w));
    out.getContext('2d').drawImage(img,minX,minY,w,h,0,0,out.width,out.height);
    return out.toDataURL('image/webp',.91);
  };

  const loadOpportunity=()=>{
    if(document.querySelector('script[data-ials-viper]'))return;
    const s=document.createElement('script');
    s.dataset.ialsViper='1';
    s.src=new URL('./viper-opportunity.js',base).href;
    document.head.appendChild(s);
  };

  window.IALSMediaReady=(async()=>{
    let logoUrl=null,heroUrl=null;
    try{
      const [logo64,hero64]=await Promise.all([join('logo',2),join('hero',4)]);
      logoUrl=await cropDarkBorder(`data:image/webp;base64,${logo64}`);
      heroUrl=`data:image/webp;base64,${hero64}`;
      await loadImage(heroUrl);
      document.documentElement.style.setProperty('--ials-hero-image',`url("${heroUrl}")`);
      document.querySelectorAll('img[src*="ials-warbird.svg"],[data-ials-logo]').forEach(img=>{
        img.src=logoUrl;
        img.classList.add('premium-logo-loaded');
      });
      document.documentElement.classList.add('ials-premium-media');
    }catch(error){
      console.warn('IALS premium media fallback active',error);
    }finally{
      document.documentElement.classList.add('ials-media-ready');
      loadOpportunity();
    }
    return {logoUrl,heroUrl};
  })();
})();