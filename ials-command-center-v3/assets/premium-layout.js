(()=>{
  const body=document.body;
  body.classList.add('ials-premium-layout');

  const isAdmin=body.classList.contains('admin-shell');
  body.classList.add(isAdmin?'ials-admin-page':'ials-public-page');

  document.querySelectorAll('img[data-ials-logo],.brand-lockup img,.admin-header img,.footer img').forEach(img=>{
    img.loading='eager';
    img.decoding='async';
  });

  const style=document.createElement('style');
  style.id='ials-premium-layout-v2';
  style.textContent=`
    :root{
      --ials-max:1440px;
      --ials-radius:14px;
      --ials-gold-line:rgba(216,164,75,.46);
      --ials-glass:linear-gradient(145deg,rgba(13,31,43,.97),rgba(3,10,15,.98));
    }

    html body.ials-premium-layout{
      background:
        radial-gradient(circle at 90% 0,rgba(183,122,38,.12),transparent 26%),
        linear-gradient(180deg,#02070a,#06131c 44%,#020609)!important;
    }

    body.ials-premium-layout .btn{
      border-radius:9px!important;
      min-height:48px!important;
      padding:13px 20px!important;
      box-shadow:inset 0 1px rgba(255,255,255,.05),0 10px 26px rgba(0,0,0,.22);
    }

    body.ials-premium-layout .topbar{
      max-width:none!important;
      padding:9px clamp(20px,4vw,70px)!important;
      border-bottom:1px solid rgba(119,146,161,.24)!important;
      background:#010508!important;
    }

    body.ials-premium-layout .site-nav,
    body.ials-premium-layout .admin-header{
      min-height:116px!important;
      padding:8px clamp(20px,4vw,70px)!important;
      gap:28px!important;
      background:linear-gradient(180deg,rgba(2,8,12,.99),rgba(2,7,11,.96))!important;
      border-bottom:1px solid var(--ials-gold-line)!important;
      box-shadow:0 20px 45px rgba(0,0,0,.34)!important;
    }

    body.ials-premium-layout .brand-lockup,
    body.ials-premium-layout .admin-header>a{
      flex:0 0 auto!important;
      justify-content:center!important;
    }

    html body.ials-premium-layout .site-nav .brand-lockup img,
    html body.ials-premium-layout .admin-header>a img{
      width:320px!important;
      height:104px!important;
      max-height:none!important;
      object-fit:contain!important;
      filter:drop-shadow(0 12px 26px rgba(0,0,0,.8))!important;
    }

    body.ials-premium-layout .navlinks{
      justify-content:center!important;
      gap:18px!important;
      font-size:14px!important;
    }

    body.ials-premium-layout .navlinks .secure{
      border-radius:8px!important;
      padding:13px 18px!important;
      background:linear-gradient(180deg,rgba(226,182,99,.16),rgba(83,51,14,.16))!important;
    }

    body.ials-public-page .hero{
      display:grid!important;
      grid-template-columns:minmax(0,1.05fr) minmax(320px,.95fr)!important;
      grid-template-rows:1fr auto!important;
      align-items:end!important;
      min-height:650px!important;
      padding:64px clamp(24px,5vw,78px) 48px!important;
      background-position:center 48%!important;
    }

    body.ials-public-page .hero-seo-copy{
      grid-column:1!important;
      width:min(720px,100%)!important;
      margin:0 0 28px!important;
      padding:0!important;
      background:transparent!important;
    }

    body.ials-public-page .hero-seo-copy h1{
      max-width:760px!important;
      font-size:clamp(62px,6.3vw,96px)!important;
      line-height:.86!important;
      letter-spacing:.01em!important;
      text-wrap:balance;
    }

    body.ials-public-page .hero-seo-copy p{
      max-width:650px!important;
      font-size:18px!important;
      line-height:1.6!important;
    }

    body.ials-public-page .hero-controls{
      grid-column:1/-1!important;
      display:grid!important;
      grid-template-columns:minmax(0,1fr) minmax(330px,500px)!important;
      align-items:end!important;
      gap:28px!important;
      padding:0!important;
      background:transparent!important;
    }

    body.ials-public-page .hero-controls .actions{
      display:flex!important;
      gap:12px!important;
    }

    body.ials-public-page .hero-proof{
      border:1px solid rgba(90,119,135,.62)!important;
      border-left:4px solid #c78932!important;
      border-radius:10px!important;
      padding:16px 18px!important;
      background:rgba(2,9,14,.78)!important;
      box-shadow:0 16px 38px rgba(0,0,0,.28)!important;
    }

    body.ials-public-page .search-command{
      width:min(calc(100% - 44px),var(--ials-max))!important;
      margin:20px auto 0!important;
      border-radius:var(--ials-radius)!important;
      overflow:hidden!important;
      border-color:#435c69!important;
    }

    body.ials-public-page main>section:not(.special),
    body.ials-public-page .command-deck{
      width:min(100%,var(--ials-max));
      margin-inline:auto;
    }

    body.ials-premium-layout .console-card,
    body.ials-premium-layout .program,
    body.ials-premium-layout .card,
    body.ials-premium-layout .form,
    body.ials-premium-layout .search-panel,
    body.ials-premium-layout .login-card,
    body.ials-premium-layout .copilot-console,
    body.ials-premium-layout .copilot-tour{
      border-radius:var(--ials-radius)!important;
      overflow:hidden;
    }

    body.ials-premium-layout .console-card{
      border-color:#38515f!important;
      background:var(--ials-glass)!important;
      box-shadow:0 18px 44px rgba(0,0,0,.28),inset 0 1px rgba(255,255,255,.035)!important;
    }

    body.ials-premium-layout .console-card .card-link{
      border-radius:8px!important;
    }

    body.ials-premium-layout .engine-chip,
    body.ials-premium-layout .command-cell,
    body.ials-premium-layout .kpi{
      border-radius:10px;
    }

    body.ials-premium-layout .section-head{
      padding-bottom:18px!important;
      border-bottom:1px solid rgba(78,103,116,.34);
    }

    body.ials-admin-page .admin-header{
      position:relative!important;
      top:auto!important;
    }

    body.ials-admin-page .admin-header .actions{
      margin-left:auto!important;
    }

    body.ials-admin-page .admin-wrap{
      width:min(100%,1320px)!important;
      margin-inline:auto!important;
      padding:32px clamp(18px,4vw,56px) 54px!important;
    }

    body.ials-admin-page.admin-login-mode .admin-wrap{
      min-height:calc(100vh - 116px)!important;
      display:grid!important;
      place-items:start center!important;
    }

    body.ials-admin-page .login-card{
      width:min(100%,720px)!important;
      max-width:none!important;
      margin:30px auto 0!important;
      padding:40px 42px!important;
      border:1px solid #4b6574!important;
      background:
        radial-gradient(circle at 100% 0,rgba(210,149,54,.14),transparent 34%),
        linear-gradient(145deg,#0c2635,#06131b 72%)!important;
      box-shadow:0 28px 70px rgba(0,0,0,.44),inset 0 1px rgba(255,255,255,.045)!important;
    }

    body.ials-admin-page .login-card h2{
      margin:16px 0 18px!important;
      font-size:clamp(52px,6vw,76px)!important;
      line-height:.9!important;
    }

    body.ials-admin-page .login-card .subtle{
      max-width:620px!important;
      font-size:16px!important;
      line-height:1.72!important;
    }

    body.ials-admin-page .login-card input{
      width:100%!important;
      min-height:58px!important;
      margin-top:18px!important;
      border-radius:9px!important;
      font-size:17px!important;
    }

    body.ials-admin-page .login-card .btn{
      width:100%!important;
      margin-top:12px!important;
      min-height:56px!important;
    }

    @media(max-width:1180px){
      html body.ials-premium-layout .site-nav .brand-lockup img,
      html body.ials-premium-layout .admin-header>a img{
        width:270px!important;
        height:94px!important;
      }
      body.ials-premium-layout .site-nav,
      body.ials-premium-layout .admin-header{min-height:104px!important;gap:18px!important}
      body.ials-premium-layout .navlinks{gap:12px!important;font-size:12px!important}
      body.ials-premium-layout .nav-trust{display:none!important}
    }

    @media(max-width:820px){
      body.ials-premium-layout .topbar{
        display:grid!important;
        grid-template-columns:1fr!important;
        gap:2px!important;
        padding:9px 16px!important;
        text-align:center!important;
        font-size:9px!important;
        line-height:1.55!important;
      }

      body.ials-premium-layout .site-nav,
      body.ials-premium-layout .admin-header{
        position:relative!important;
        top:auto!important;
        display:grid!important;
        grid-template-columns:1fr!important;
        justify-items:center!important;
        min-height:0!important;
        padding:16px 14px 14px!important;
        gap:14px!important;
      }

      body.ials-premium-layout .brand-lockup,
      body.ials-premium-layout .admin-header>a{
        width:100%!important;
        flex:none!important;
        justify-content:center!important;
      }

      html body.ials-premium-layout .site-nav .brand-lockup img,
      html body.ials-premium-layout .admin-header>a img{
        width:min(88vw,390px)!important;
        height:auto!important;
        aspect-ratio:1.36/1!important;
        max-height:238px!important;
      }

      body.ials-public-page .navlinks{
        width:min(100%,620px)!important;
        display:grid!important;
        grid-template-columns:1fr 1fr 1fr!important;
        gap:8px!important;
        margin:0!important;
      }

      body.ials-public-page .navlinks a{
        display:none!important;
      }

      body.ials-public-page .navlinks a[href="#inventory"],
      body.ials-public-page .navlinks a[href="#sell"],
      body.ials-public-page .navlinks .secure{
        display:flex!important;
        min-height:46px!important;
        align-items:center!important;
        justify-content:center!important;
        padding:10px 8px!important;
        border:1px solid #385262!important;
        border-radius:8px!important;
        background:linear-gradient(180deg,#102534,#07151e)!important;
        font-size:11px!important;
        text-align:center!important;
      }

      body.ials-public-page .navlinks .secure{
        border-color:#a87934!important;
        color:#f0d293!important;
        background:linear-gradient(180deg,#2a1c0b,#0b1217)!important;
      }

      body.ials-public-page .hero{
        display:block!important;
        min-height:0!important;
        padding:0 18px 30px!important;
        background:#02070a!important;
      }

      body.ials-public-page .hero::before{
        content:""!important;
        display:block!important;
        width:calc(100% + 36px)!important;
        margin-left:-18px!important;
        aspect-ratio:16/9!important;
        min-height:0!important;
        background-image:linear-gradient(0deg,rgba(2,7,10,.62),transparent 54%),var(--ials-hero-image)!important;
        background-size:cover!important;
        background-position:center!important;
        border-bottom:1px solid rgba(197,143,55,.4)!important;
      }

      body.ials-public-page .hero-seo-copy{
        width:100%!important;
        margin:0!important;
        padding:28px 0 10px!important;
        background:transparent!important;
      }

      body.ials-public-page .hero-seo-copy h1{
        font-size:clamp(46px,12.5vw,62px)!important;
        line-height:.88!important;
        margin-bottom:20px!important;
      }

      body.ials-public-page .hero-seo-copy p{
        font-size:16px!important;
        line-height:1.62!important;
      }

      body.ials-public-page .hero-controls{
        display:block!important;
        padding:8px 0 0!important;
        background:transparent!important;
      }

      body.ials-public-page .hero-controls .actions{
        display:grid!important;
        grid-template-columns:1fr 1fr!important;
        gap:9px!important;
        width:100%!important;
      }

      body.ials-public-page .hero-controls .actions .btn:first-child{
        grid-column:1/-1!important;
      }

      body.ials-public-page .hero-controls .btn{
        width:100%!important;
        min-height:52px!important;
        padding:12px 10px!important;
      }

      body.ials-public-page .hero-proof{
        max-width:none!important;
        margin-top:14px!important;
        padding:15px 16px!important;
      }

      body.ials-public-page .search-command{
        width:calc(100% - 28px)!important;
        margin:14px auto 0!important;
        border-radius:12px!important;
      }

      body.ials-public-page main section,
      body.ials-public-page .command-deck{
        padding:44px 16px!important;
      }

      body.ials-public-page .command-deck{
        padding-top:18px!important;
      }

      body.ials-premium-layout .command-grid{
        display:grid!important;
        grid-template-columns:1fr!important;
        gap:12px!important;
      }

      body.ials-premium-layout .console-card{
        margin:0!important;
        min-height:0!important;
        padding:22px 20px!important;
      }

      body.ials-premium-layout .console-card .card-link{
        position:static!important;
        display:block!important;
        margin-top:18px!important;
        padding:14px!important;
      }

      body.ials-premium-layout .section-head{
        display:block!important;
        margin-bottom:24px!important;
      }

      body.ials-premium-layout .section-head p{
        margin-top:14px!important;
      }

      body.ials-admin-page .admin-header .actions{
        width:min(100%,620px)!important;
        display:grid!important;
        grid-template-columns:1fr 1fr!important;
        gap:8px!important;
        margin:0!important;
      }

      body.ials-admin-page .admin-header .btn{
        width:100%!important;
        min-height:46px!important;
        padding:10px!important;
      }

      body.ials-admin-page.admin-login-mode .admin-wrap{
        min-height:0!important;
        display:block!important;
      }

      body.ials-admin-page .admin-wrap{
        padding:20px 14px 42px!important;
      }

      body.ials-admin-page .login-card{
        width:100%!important;
        margin:18px auto 0!important;
        padding:28px 24px!important;
      }

      body.ials-admin-page .login-card h2{
        font-size:clamp(50px,13vw,66px)!important;
      }

      body.ials-admin-page .login-card .subtle{
        font-size:15px!important;
        line-height:1.65!important;
      }
    }

    @media(max-width:460px){
      html body.ials-premium-layout .site-nav .brand-lockup img,
      html body.ials-premium-layout .admin-header>a img{
        width:min(94vw,370px)!important;
        max-height:226px!important;
      }

      body.ials-public-page .navlinks{
        grid-template-columns:1fr 1fr!important;
      }

      body.ials-public-page .navlinks a[href="#inventory"]{
        display:none!important;
      }

      body.ials-public-page .hero::before{
        aspect-ratio:4/3!important;
        background-position:58% center!important;
      }

      body.ials-public-page .hero-seo-copy h1{
        font-size:clamp(44px,13.2vw,56px)!important;
      }

      body.ials-public-page .hero-controls .actions{
        grid-template-columns:1fr 1fr!important;
      }

      body.ials-public-page .hero-controls .actions .btn:first-child{
        grid-column:1/-1!important;
      }

      body.ials-public-page .hero-controls .btn{
        font-size:11px!important;
      }

      body.ials-admin-page .login-card{
        padding:26px 20px!important;
      }
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
})();
