(()=>{
  'use strict';

  const loaderScript=document.currentScript;
  const base=loaderScript?.src||new URL('assets/media-loader.js',location.href).href;
  const root=document.documentElement;
  const logoSelector='img[data-ials-logo],img[src*="ials-warbird.svg"],.brand-lockup img,.admin-header img,.footer img';

  /* Immediate structural protection: never reserve dead image space. */
  const critical=document.createElement('style');
  critical.dataset.ialsRuntime='forensic-v3';
  critical.textContent=`
    html,body{max-width:100%;overflow-x:hidden}
    .hero{min-height:0!important}
    .hero:before,.hero:after,.metal-stack,.shield-grid,.engine-orb,.bearing-icon{display:none!important}
    .metal-stack,.shield-grid,.engine-orb{height:0!important;min-height:0!important;margin:0!important;border:0!important;background:none!important}
    ${logoSelector}{display:block!important;object-fit:contain!important;object-position:center!important;background:transparent!important}
    @media(max-width:760px){
      .site-nav,.admin-header{min-height:0!important}
      .hero{margin-top:0!important}
      .radar-screen{display:none!important}
    }
  `;
  document.head.appendChild(critical);

  const decode=src=>new Promise((resolve,reject)=>{
    const image=new Image();
    const timer=setTimeout(()=>reject(new Error('image timeout')),15000);
    image.onload=()=>{clearTimeout(timer);resolve(image)};
    image.onerror=()=>{clearTimeout(timer);reject(new Error('image decode failed'))};
    image.src=src;
  });

  const installLogo=async()=>{
    try{
      const response=await fetch(new URL('./media/captain-logo.txt?v=forensic3',base),{cache:'no-store'});
      if(!response.ok)throw new Error(`captain logo unavailable (${response.status})`);
      const encoded=(await response.text()).replace(/\s+/g,'');
      if(!encoded.startsWith('l2dX'))throw new Error('captain logo payload invalid');
      const logoUrl=`data:image/webp;base64,${encoded}`;
      await decode(logoUrl);
      const apply=()=>{
        document.querySelectorAll(logoSelector).forEach(img=>{
          img.removeAttribute('srcset');
          img.src=logoUrl;
          img.style.opacity='1';
          img.style.visibility='visible';
          img.style.display='block';
        });
        document.querySelectorAll('link[rel~="icon"]').forEach(link=>link.href=logoUrl);
      };
      apply();
      if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
      root.classList.add('ials-logo-ready','ials-media-ready');
      return logoUrl;
    }catch(error){
      console.error('IALS captain logo failed to load',error);
      root.classList.add('ials-logo-failed','ials-media-ready');
      return null;
    }
  };

  /* The real catalog is v2/inventory.json. Patch before the page init listener runs. */
  const patchInventoryPath=()=>{
    if(!window.IALS)return false;
    window.IALS.dataUrl=()=>{
      const marker='/ials-command-center-v3/';
      const path=location.pathname;
      const prefix=path.includes(marker)?path.split(marker)[0]:'';
      return `${prefix}/ials-command-center-v2/inventory.json`;
    };
    return true;
  };
  document.addEventListener('DOMContentLoaded',()=>{
    if(!patchInventoryPath()){
      let attempts=0;
      const timer=setInterval(()=>{
        attempts+=1;
        if(patchInventoryPath()||attempts>40)clearInterval(timer);
      },25);
    }
  },{once:true});

  /* Load the actual forensic layout. Previous builds committed it but never executed it. */
  const layout=document.createElement('script');
  layout.src=new URL('./premium-layout.js?v=forensic3',base).href;
  layout.async=false;
  layout.dataset.ialsPremiumLayout='forensic-v3';
  document.head.appendChild(layout);

  window.IALSMediaReady=installLogo();

  if(!document.querySelector('script[data-ials-viper]')){
    const opportunity=document.createElement('script');
    opportunity.dataset.ialsViper='1';
    opportunity.src=new URL('./viper-opportunity.js?v=forensic3',base).href;
    opportunity.async=false;
    document.head.appendChild(opportunity);
  }
})();
