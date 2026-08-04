(()=>{
  const script=document.currentScript;
  const base=script?.src||new URL('assets/media-loader.js',location.href).href;
  const opportunity=()=>{
    if(document.querySelector('script[data-ials-viper]'))return;
    const s=document.createElement('script');
    s.dataset.ialsViper='1';
    s.src=new URL('./viper-opportunity.js',base).href;
    document.head.appendChild(s);
  };
  const validate=dataUrl=>new Promise(resolve=>{
    const img=new Image();
    const timer=setTimeout(()=>resolve(false),5000);
    img.onload=()=>{clearTimeout(timer);resolve(img.naturalWidth>400&&img.naturalHeight>180)};
    img.onerror=()=>{clearTimeout(timer);resolve(false)};
    img.src=dataUrl;
  });
  window.IALSMediaReady=(async()=>{
    try{
      const response=await fetch(new URL('./media/hero-0.txt',base),{cache:'no-store'});
      if(!response.ok)throw new Error('premium hero unavailable');
      const encoded=(await response.text()).replace(/\s+/g,'');
      if(encoded.length<1000)throw new Error('premium hero payload incomplete');
      const heroUrl=`data:image/webp;base64,${encoded}`;
      if(await validate(heroUrl)){
        document.documentElement.style.setProperty('--ials-hero-image',`url("${heroUrl}")`);
        document.documentElement.classList.add('ials-premium-hero');
        return {heroUrl};
      }
    }catch(error){
      console.warn('IALS cinematic SVG fallback active',error);
    }
    return {heroUrl:null};
  })().finally(()=>{
    document.documentElement.classList.add('ials-media-ready');
    opportunity();
  });
})();