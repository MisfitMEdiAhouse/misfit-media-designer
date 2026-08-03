(()=>{
  const script=document.currentScript;
  const base=script?.src||new URL('assets/media-loader.js',location.href).href;
  const join=async(name,count)=>{
    const parts=await Promise.all(Array.from({length:count},(_,i)=>fetch(new URL(`./media/${name}-${i}.txt`,base),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`${name}-${i} unavailable`);return r.text();})));
    return parts.join('').replace(/\s+/g,'');
  };
  const loadOpportunity=()=>{
    if(document.querySelector('script[data-ials-viper]'))return;
    const s=document.createElement('script');s.dataset.ialsViper='1';s.src=new URL('./viper-opportunity.js',base).href;document.head.appendChild(s);
  };
  window.IALSMediaReady=(async()=>{
    const [logo,hero]=await Promise.all([join('logo',2),join('hero',4)]);
    const logoUrl=`data:image/webp;base64,${logo}`;
    const heroUrl=`data:image/webp;base64,${hero}`;
    document.documentElement.style.setProperty('--ials-logo-image',`url("${logoUrl}")`);
    document.documentElement.style.setProperty('--ials-hero-image',`url("${heroUrl}")`);
    document.querySelectorAll('img[src*="ials-warbird.svg"],[data-ials-logo]').forEach(img=>{img.src=logoUrl;img.classList.add('premium-logo-loaded');});
    document.documentElement.classList.add('ials-media-ready');
    return {logoUrl,heroUrl};
  })().catch(err=>{console.warn('IALS premium media fallback active',err);return null;}).finally(loadOpportunity);
})();
