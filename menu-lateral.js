(function(){
  let sidebar=document.querySelector('.sidebar');
  if(!sidebar){
    sidebar=document.createElement('aside');
    sidebar.className='sidebar shared-sidebar';
    document.body.insertBefore(sidebar,document.body.firstChild);
  }
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const active=(path==='financeiro.html'||path==='financeiro-pagamentos.html')?'financeiro':path==='frota.html'?'frota':path==='vendas.html'?'vendas':path==='compras.html'?'compras':(path==='clientes.html'||path==='novo-cliente.html'||path==='novo-comprador.html')?'clientes':(path==='produtos.html'||path==='novo-produto.html'||path==='novo-servico.html')?'produtos':path==='relatorios.html'?'relatorios':(path==='configuracoes.html'||path==='usuarios.html')?'configuracoes':'home';
  const items=[
    ['home','Indicadores','index.html','icons8-home-48.png','dashboard-link'],
    ['financeiro','Financeiro','financeiro.html','icons8-financial-64.png','finance-link'],
    ['vendas','Vendas','vendas.html','icons8-buy-for-cash-48.png',''],
    ['compras','Compras','compras.html','icons8-buy-48.png',''],
    ['frota','Frota','frota.html','icons8-shipped-48.png',''],
    ['clientes','Contatos','clientes.html','icons8-budget-48.png',''],
    ['produtos','Produtos','produtos.html','icons8-product-48.png',''],
    ['boletos','Boletos','#','icons8-boleto-bancário-48.png',''],
    ['cobrancas','Cobranças','#','icons8-billing-32.png',''],
    ['pix','Pix','#','icons8-pix-48.png',''],
    ['fiscal','NF-e / Fiscal','#','icons8-fiscal-50.png',''],
    ['relatorios','Relatórios','relatorios.html','icons8-business-report-94.png',''],
    ['configuracoes','Configurações','configuracoes.html','icons8-settings-48.png','']
  ];
  sidebar.classList.add('shared-sidebar');
  function applyBrandStyles(){
    const sharedBrand=sidebar.querySelector('.brand');
    if(sharedBrand){
      sharedBrand.style.setProperty('display','block','important');
      sharedBrand.style.setProperty('visibility','visible','important');
      sharedBrand.style.setProperty('width',window.innerWidth<=768?'100%':'143px','important');
      sharedBrand.style.setProperty('height','49px','important');
      sharedBrand.style.setProperty('min-height','49px','important');
      sharedBrand.style.setProperty('background-color','#eee','important');
      sharedBrand.style.setProperty('background-image',"url('public/logo.webp')",'important');
      sharedBrand.style.setProperty('background-position','center center','important');
      sharedBrand.style.setProperty('background-repeat','no-repeat','important');
      sharedBrand.style.setProperty('background-size','auto 26px','important');
      sharedBrand.style.setProperty('font-size','0','important');
      sharedBrand.style.setProperty('color','transparent','important');
      sharedBrand.style.setProperty('padding','0','important');
      sharedBrand.style.setProperty('margin','0','important');
    }
  }
  function normalizeTopbar(){
    const main=document.querySelector('main');
    if(!main)return;
    let topbar=main.querySelector(':scope > .topbar, :scope > .products-topbar');
    if(!topbar){
      topbar=document.createElement('header');
      topbar.className='topbar';
      topbar.innerHTML='<div class="brand-mini"><strong>egestor<span>+</span></strong><small>Plano profissional</small></div><div class="search">Digite sua busca <button>⌕</button></div><div class="user">ODIMAN COSTA<br><small>DNFX - COMERCIO DE PNEUS ◉</small></div>';
      main.insertBefore(topbar,main.firstChild);
    }
    topbar.classList.add('topbar');
    const searchEl=topbar.querySelector('.search, .products-search');
    if(searchEl)searchEl.classList.add('search');
    const userEl=topbar.querySelector('.user, .products-user');
    if(userEl){
      let sess=null;
      try{sess=JSON.parse(localStorage.getItem('piremaxx_sessao')||'null')}catch(e){}
      const displayName=(sess&&sess.nome)?String(sess.nome).toUpperCase():'ODIMAN COSTA';
      userEl.classList.add('user');
      if(!userEl.querySelector('.user-menu')){
        userEl.innerHTML=displayName+'<br><small>DNFX - COMERCIO DE PNEUS ◉</small><div class="user-menu"><a href="configuracoes.html#conta">▣ Minha conta</a><a href="configuracoes.html">♟ Usuários e Permissões</a><a href="configuracoes.html#novo">⊞ Novo usuário</a><a href="configuracoes.html">⚙ Configurações</a><a href="login.html" data-logout-link="1">◉ Sair / Trocar usuário</a></div><span class="user-avatar"></span>';
        const menu=userEl.querySelector('.user-menu');
        userEl.addEventListener('click',function(event){
          const logoutLink=event.target.closest('a[data-logout-link]');
          if(logoutLink){localStorage.removeItem('piremaxx_sessao');return;}
          if(event.target.closest('a'))return;
          menu.classList.toggle('open');
        });
      }else if(!userEl.querySelector('.user-avatar')){
        const avatar=document.createElement('span');
        avatar.className='user-avatar';
        userEl.appendChild(avatar);
      }
    }
  }
  function applySessionPermissions(){
    let sess=null;
    try{sess=JSON.parse(localStorage.getItem('piremaxx_sessao')||'null')}catch(e){}
    if(!sess||sess.perfil==='admin'||!sess.permissoes)return;
    const perms=sess.permissoes;
    sidebar.querySelectorAll('nav a[data-menu-key]').forEach(function(a){
      const key=a.dataset.menuKey;
      if(key&&Object.prototype.hasOwnProperty.call(perms,key)&&perms[key]===false){
        a.style.setProperty('display','none','important');
      }else{
        a.style.removeProperty('display');
      }
    });
  }
  function render(){
    if(sidebar.dataset.rendered!=='1'||!sidebar.querySelector('[data-menu-key="frota"]')){
      sidebar.innerHTML='<div class="brand"><strong>egestor<span>+</span></strong><small>Plano profissional</small></div><nav>'+items.map(x=>'<a class="'+x[4]+' '+(x[0]===active?'active':'')+'" href="'+x[2]+'" data-menu-key="'+x[0]+'"><img src="public/icons/'+x[3]+'" alt=""><b>'+x[1]+'</b></a>').join('')+'<a href="#" data-menu-key="suporte"><span>❔</span><b>Suporte online</b></a></nav>';
      sidebar.dataset.rendered='1';
    }else{
      sidebar.querySelectorAll('nav a[data-menu-key]').forEach(function(a){
        a.classList.toggle('active',a.dataset.menuKey===active);
        if(a.dataset.menuKey==='home'){const b=a.querySelector('b');if(b)b.textContent='Indicadores';}
      });
    }
    applyBrandStyles();
    normalizeTopbar();
    applySessionPermissions();
  }
  render();
  if(path==='clientes.html'){
    document.title='Gestão Piremaxx - Contatos';
    const title=document.querySelector('.clients-title');
    if(title){
      const text=[...title.childNodes].find(n=>n.nodeType===3);
      if(text)text.nodeValue='Contatos';
      else if(!title.children.length)title.textContent='Contatos';
    }
  }
  if(!document.getElementById('shared-menu-style')){
    const style=document.createElement('style');
    style.id='shared-menu-style';
    style.textContent='@media (min-width:769px){.shared-sidebar{width:143px!important;min-width:143px!important;min-height:100vh!important;position:fixed!important;left:0!important;top:0!important;z-index:90!important}.shared-sidebar .brand{display:block!important;visibility:visible!important;width:143px!important;height:49px!important;min-height:49px!important;background-color:#eee!important;background-image:url("public/logo.webp")!important;background-position:center center!important;background-repeat:no-repeat!important;background-size:auto 26px!important;font-size:0!important;color:transparent!important;padding:0!important;margin:0!important}.shared-sidebar nav a{height:31px!important;min-height:31px!important;display:flex!important;align-items:center!important;padding:9px 13px!important;color:#fff!important;text-decoration:none!important;font-size:12px!important}body:has(.shared-sidebar) main{margin-left:143px!important;width:calc(100% - 143px)!important}}.shared-sidebar nav a>img{width:16px!important;height:16px!important;max-width:16px!important;max-height:16px!important;object-fit:contain!important;margin-right:8px!important}.shared-sidebar nav a>span{width:16px!important;margin-right:8px!important;text-align:center!important}.shared-sidebar nav a b{margin-left:0!important}.shared-sidebar nav a.active,.shared-sidebar nav a:hover{background:#263840!important}';
    document.head.appendChild(style);
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',render);
  }
})();

// Auditoria global do sistema (registra eventos reais para exibição em "Últimas Atividades" na Home)
(function(){
  function logAudit(entry){
    try{
      var list=JSON.parse(localStorage.getItem('piremaxx_auditoria')||'[]');
      if(!Array.isArray(list))list=[];
      var now=new Date();
      var pad=function(n){return String(n).padStart(2,'0')};
      var dateStr=pad(now.getDate())+'/'+pad(now.getMonth()+1)+'/'+now.getFullYear()+' '+pad(now.getHours())+':'+pad(now.getMinutes());
      list.unshift({
        id:'aud-'+Date.now()+'-'+Math.floor(Math.random()*1000),
        timestamp:now.getTime(),
        dateStr:entry.dateStr||dateStr,
        user:entry.user||'odiman',
        module:entry.module||'Sistema',
        action:entry.action||'Registrou atividade',
        detail:entry.detail||'',
        value:entry.value||''
      });
      if(list.length>80)list=list.slice(0,80);
      localStorage.setItem('piremaxx_auditoria',JSON.stringify(list));
    }catch(e){}
  }
  window.piremaxxAudit={log:logAudit};

  // Intercepta salvamentos nas principais telas para alimentar a auditoria em tempo real
  document.addEventListener('click',function(e){
    var finSave=e.target.closest('#finance-receivable-form .finance-form-actions .save');
    if(finSave){
      var overlay=document.getElementById('finance-receivable-form');
      var desc=overlay&&overlay.querySelector('#finance-description');
      var val=overlay&&overlay.querySelector('.finance-form-inline input');
      if(desc&&desc.value.trim()){
        var isPay=overlay.classList.contains('payment-mode');
        logAudit({
          module:'Financeiro',
          action:isPay?'Nova conta a pagar':'Nova conta a receber',
          detail:desc.value.trim(),
          value:'R$ '+(val&&val.value?val.value:'0,00')
        });
      }
    }
    var trfSave=e.target.closest('#finance-transfer-form .transfer-form-actions .save');
    if(trfSave){
      var tOverlay=document.getElementById('finance-transfer-form');
      var tVal=tOverlay&&tOverlay.querySelector('.transfer-inline input');
      logAudit({
        module:'Financeiro',
        action:'Nova transferência entre contas',
        detail:'Caixa interno',
        value:'R$ '+(tVal&&tVal.value?tVal.value:'0,00')
      });
    }
    var recSave=e.target.closest('#finance-receipt-form .receipt-form-actions .save');
    if(recSave){
      var rOverlay=document.getElementById('finance-receipt-form');
      var inputs=rOverlay?rOverlay.querySelectorAll('.receipt-field input'):[];
      logAudit({
        module:'Financeiro',
        action:'Emissão de recibo',
        detail:(inputs[0]&&inputs[0].value)||'Recibo avulso',
        value:'R$ '+((inputs[2]&&inputs[2].value)||'0,00')
      });
    }
    var saleSave=e.target.closest('#newSale .actions .save');
    if(saleSave){
      var clientEl=document.getElementById('client');
      var totalEl=document.getElementById('grandTotal');
      var typeSel=document.querySelector('#newSale .form-grid select');
      var isQuote=typeSel&&typeSel.value==='Orçamento';
      logAudit({
        module:isQuote?'Orçamento':'Vendas',
        action:isQuote?'Novo orçamento registrado':'Nova venda registrada',
        detail:(clientEl&&clientEl.value)||'Cliente',
        value:(totalEl&&totalEl.textContent)||'R$ 0,00'
      });
    }
    var colSave=e.target.closest('.collection-modal .collection-save');
    if(colSave){
      var cfClient=document.getElementById('cf-client');
      var cfTotal=document.getElementById('cf-total');
      if(cfClient&&cfClient.value){
        logAudit({
          module:'Coletas',
          action:'Coleta de carcaças salva',
          detail:cfClient.value,
          value:(cfTotal&&cfTotal.textContent)||'R$ 0,00'
        });
      }
    }
  },false);
})();

// No celular, o menu original abre sobre o conteúdo e não reduz a largura da página.
(function(){
  function setupMobileMenu(){
    const sidebar=document.querySelector('.sidebar');
    const topbar=document.querySelector('main>.topbar, main>.products-topbar, main>.product-top, main>.service-top, main>.buyer-head, main>.client-form-head, .topbar, main>header, main>div:first-child');
    if(!sidebar||!topbar||topbar.querySelector('.mobile-menu-toggle'))return;
    const button=document.createElement('button');
    button.type='button';
    button.className='mobile-menu-toggle';
    button.setAttribute('aria-label','Abrir menu');
    button.setAttribute('aria-expanded','false');
    button.textContent='☰';
    topbar.insertBefore(button,topbar.firstChild);
    let backdrop=document.querySelector('.mobile-menu-backdrop');
    if(!backdrop){
      backdrop=document.createElement('button');
      backdrop.type='button';
      backdrop.className='mobile-menu-backdrop';
      backdrop.setAttribute('aria-label','Fechar menu');
      document.body.appendChild(backdrop);
    }
    function close(){
      document.body.classList.remove('mobile-menu-open');
      button.setAttribute('aria-expanded','false');
    }
    function toggle(){
      const open=document.body.classList.toggle('mobile-menu-open');
      button.setAttribute('aria-expanded',String(open));
    }
    window.piremaxxToggleMobileMenu=toggle;
    window.piremaxxCloseMobileMenu=close;
    window.piremaxxOpenMobileMenu=function(){
      document.body.classList.add('mobile-menu-open');
      button.setAttribute('aria-expanded','true');
    };
    button.addEventListener('click',toggle);
    backdrop.addEventListener('click',close);
    sidebar.addEventListener('click',function(event){
      if(event.target.closest('a'))close();
    });
    window.addEventListener('resize',function(){
      if(window.innerWidth>768)close();
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupMobileMenu);
  else setupMobileMenu();
})();

// Aba adicional de compradores na tela de Contatos — inserida imediatamente sem delay de 450ms!
(function(){
  if((location.pathname.split('/').pop()||'').toLowerCase()!=='clientes.html')return;
  function setupBuyersTab(){
    const tabs=document.querySelector('.client-tabs');
    const table=document.querySelector('.client-table');
    if(!tabs||!table)return;
    let button=tabs.querySelector('.buyers-tab');
    if(!button){
      button=document.createElement('button');
      button.type='button';
      button.className='buyers-tab';
      button.textContent='▣ COMPRADORES';
      tabs.appendChild(button);
    }
    const all=[...tabs.querySelectorAll('button')];
    if(all[0])all[0].style.order='0';
    if(all[1])all[1].style.order='2';
    if(all[2])all[2].style.order='3';
    button.style.order='1';
    if(!document.getElementById('buyers-tab-style')){
      const style=document.createElement('style');
      style.id='buyers-tab-style';
      style.textContent='.client-tabs .buyers-tab{background:#b17828!important;order:1}.client-tabs .buyers-tab.active{background:#d49a35!important}.client-tabs .buyers-tab:hover{background:#c1882e!important}';
      document.head.appendChild(style);
    }
    function activateBuyers(){
      tabs.querySelectorAll('button').forEach(function(item){item.classList.remove('active')});
      button.classList.add('active');
      const body=table.querySelector('tbody');
      const deleted=new Set(JSON.parse(localStorage.getItem('deletedContactCodes')||'[]').map(String));
      const records=JSON.parse(localStorage.getItem('piremaxx_contatos')||'[]').filter(function(item){return Array.isArray(item.tipos)&&item.tipos.includes('comprador')&&!deleted.has(String(item.id))&&!deleted.has(String(item.nome||'').trim())});
      if(body)body.innerHTML=records.length?records.map(function(item){return '<tr><td><input type="checkbox" class="client-select" data-code="'+String(item.id||'')+'" data-name="'+String(item.nome||'').replace(/"/g,'&quot;')+'"></td><td>'+String(item.id||'')+'</td><td>'+String(item.nome||'')+'</td><td>'+String(item.telefone||'')+'</td><td></td><td>'+String(item.cidade||'')+(item.uf?'/'+String(item.uf):'')+'</td></tr>'}).join(''):'<tr><td colspan="7" class="empty">Nenhum comprador encontrado.</td></tr>';
      if(window.installClientCheckboxes)window.installClientCheckboxes();
      const search=document.querySelector('.client-search input');
      if(search){
        search.placeholder='Buscar compradores';
        search.value='';
      }
      const novo=document.querySelector('.client-toolbar button');
      if(novo){
        novo.innerHTML='<img src="public/icons/icons8-add-48.png" alt=""> Novo';
        novo.style.background='#b17828';
        novo.onclick=function(){location.href='novo-cliente.html?tipo=comprador'};
      }
      document.title='Gestão Piremaxx - Compradores';
      history.replaceState(null,'','clientes.html#compradores');
    }
    button.onclick=function(e){
      if(e)e.preventDefault();
      activateBuyers();
    };
    window.activateBuyersTab=activateBuyers;
    if(location.hash==='#compradores')activateBuyers();
  }
  setupBuyersTab();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupBuyersTab);
  setTimeout(setupBuyersTab,0);
})();

// Aba adicional de vendedores na tela de Contatos
(function(){
  if((location.pathname.split('/').pop()||'').toLowerCase()!=='clientes.html')return;
  function setupVendorsTab(){
    const tabs=document.querySelector('.client-tabs');
    const table=document.querySelector('.client-table');
    if(!tabs||!table)return;
    let button=tabs.querySelector('.vendors-tab');
    if(!button){
      button=document.createElement('button');
      button.type='button';
      button.className='vendors-tab';
      button.innerHTML='<img src="public/icons/icons8-budget-48.png" alt=""> VENDEDORES';
      tabs.appendChild(button);
    } else {
      const img=button.querySelector('img');
      if(!img||!img.getAttribute('src')||!img.getAttribute('src').includes('icons8-budget-48.png')){
        button.innerHTML='<img src="public/icons/icons8-budget-48.png" alt=""> VENDEDORES';
      }
    }
    const all=[...tabs.querySelectorAll('button')];
    if(all[0])all[0].style.order='0';
    const buyers=tabs.querySelector('.buyers-tab');
    if(buyers)buyers.style.order='1';
    const suppliers=[...tabs.querySelectorAll('button')].find(b=>b.textContent.includes('FORNECEDOR'));
    if(suppliers)suppliers.style.order='2';
    const trans=[...tabs.querySelectorAll('button')].find(b=>b.textContent.includes('TRANSPORTADOR'));
    if(trans)trans.style.order='3';
    button.style.order='4';
    if(!document.getElementById('vendors-tab-style')){
      const style=document.createElement('style');
      style.id='vendors-tab-style';
      style.textContent='.client-tabs .vendors-tab{background:#6f42c1!important;color:#fff!important;border-radius:4px 4px 0 0!important;padding:15px 22px;font-weight:bold;font-size:14px;border:0;cursor:pointer;order:4}.client-tabs .vendors-tab.active{background:#8453d8!important;box-shadow:inset 0 -2px 0 #fff}.client-tabs .vendors-tab:hover{background:#5e35b1!important}.clients:has(.client-tabs .vendors-tab.active) .client-tabs{border-bottom:2px solid #8453d8}.clients:has(.client-tabs .vendors-tab.active) .client-toolbar>button:first-child{background:#6f42c1!important}';
      document.head.appendChild(style);
    }
    function activateVendors(){
      tabs.querySelectorAll('button').forEach(function(item){item.classList.remove('active')});
      button.classList.add('active');
      const body=table.querySelector('tbody');
      const deleted=new Set(JSON.parse(localStorage.getItem('deletedContactCodes')||'[]').map(String));
      const local=JSON.parse(localStorage.getItem('piremaxx_contatos')||'[]');
      const localVendors=local.filter(function(item){return Array.isArray(item.tipos)&&item.tipos.includes('vendedor')&&!deleted.has(String(item.id))&&!deleted.has(String(item.nome||'').trim())});
      
      const defaultVendors=[
        {id:'1',nome:'Diego Miranda',telefone:'(21) 98765-4321',cidade:'Rio de Janeiro',uf:'RJ',tipos:['vendedor']},
        {id:'2',nome:'Katia Maria',telefone:'(21) 97654-3210',cidade:'Rio de Janeiro',uf:'RJ',tipos:['vendedor']},
        {id:'3',nome:'Viviane Martins',telefone:'(21) 96543-2109',cidade:'Rio de Janeiro',uf:'RJ',tipos:['vendedor']},
        {id:'4',nome:'CLAUDEMIR NOGUEIRA',telefone:'(21) 99876-5432',cidade:'Rio de Janeiro',uf:'RJ',tipos:['vendedor']},
        {id:'5',nome:'ODIMAN COSTA',telefone:'(21) 99999-0000',cidade:'Rio de Janeiro',uf:'RJ',tipos:['vendedor']}
      ].filter(function(dv){
        return !deleted.has(String(dv.id))&&!deleted.has(String(dv.nome).trim())&&!local.some(function(l){return String(l.id)===String(dv.id)||String(l.nome||'').trim().toLowerCase()===dv.nome.toLowerCase()});
      });

      const records=[...localVendors,...defaultVendors];
      if(body){
        body.innerHTML=records.length?records.map(function(item){
          return '<tr><td><input type="checkbox" class="client-select" data-code="'+String(item.id||'')+'" data-name="'+String(item.nome||'').replace(/"/g,'&quot;')+'"></td><td>'+String(item.id||'')+'</td><td>'+String(item.nome||'')+'</td><td>'+String(item.telefone||'')+'</td><td></td><td>'+String(item.cidade||'')+(item.uf?'/'+String(item.uf):'')+'</td></tr>';
        }).join(''):'<tr><td colspan="7" class="empty">Nenhum vendedor encontrado.</td></tr>';
      }
      if(window.installClientCheckboxes)window.installClientCheckboxes();
      const search=document.querySelector('.client-search input');
      if(search){
        search.placeholder='Buscar vendedores';
        search.value='';
      }
      const novo=document.querySelector('.client-toolbar button');
      if(novo){
        novo.innerHTML='<img src="public/icons/icons8-add-48.png" alt=""> Novo';
        novo.style.background='#6f42c1';
        novo.onclick=function(){location.href='novo-cliente.html?tipo=vendedor'};
      }
      document.title='Gestão Piremaxx - Vendedores';
      history.replaceState(null,'','clientes.html#vendedores');
    }
    button.onclick=function(e){
      if(e)e.preventDefault();
      activateVendors();
    };
    window.activateVendorsTab=activateVendors;
    if(location.hash==='#vendedores')activateVendors();
  }
  setupVendorsTab();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupVendorsTab);
  setTimeout(setupVendorsTab,0);
  window.addEventListener('hashchange',function(){
    if(location.hash==='#vendedores'&&window.activateVendorsTab)window.activateVendorsTab();
    if(location.hash==='#compradores'&&window.activateBuyersTab)window.activateBuyersTab();
  });
})();

// O botão Novo usa o mesmo cadastro completo em todas as categorias da guia Contatos,
// definindo automaticamente o tipo conforme a aba ativa.
(function(){
  if((location.pathname.split('/').pop()||'').toLowerCase()!=='clientes.html')return;
  function getActiveContactType(){
    const activeTab=document.querySelector('.client-tabs button.active');
    const text=(activeTab&&activeTab.textContent||'').toLowerCase();
    if(text.includes('fornecedor'))return 'fornecedor';
    if(text.includes('transportador'))return 'transportador';
    if(text.includes('comprador'))return 'comprador';
    if(text.includes('vendedor'))return 'vendedor';
    const hash=location.hash.replace('#','').toLowerCase();
    if(hash==='fornecedores'||hash==='fornecedors')return 'fornecedor';
    if(hash==='transportadores')return 'transportador';
    if(hash==='compradores')return 'comprador';
    if(hash==='vendedores')return 'vendedor';
    return 'cliente';
  }
  document.addEventListener('click',function(event){
    const target=event.target.closest('.client-toolbar button:first-child, .clients-title .page-actions .new');
    if(!target)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const tipo=getActiveContactType();
    location.href='novo-cliente.html?tipo='+tipo;
  },true);
})();

// Corrige o hash antigo digitado como "fornecedors" e reabre a lista correta.
(function(){
  if((location.pathname.split('/').pop()||'').toLowerCase()!=='clientes.html')return;
  if(location.hash==='#fornecedors'){
    history.replaceState(null,'','clientes.html#fornecedores');
  }
})();

// Aplica o enquadramento final antes da primeira pintura da página e adapta automaticamente para Mobile, Tablet e Desktop.
(function(){
  function enforceFixedLayout(){
    ['standard-layout-inline','vendas-home-reference-critical','compras-home-reference','compras-brand-final'].forEach(function(id){
      const old=document.getElementById(id);
      if(old)old.remove();
    });
    let style=document.getElementById('standard-layout-first-paint');
    const isNewStyle=!style;
    if(isNewStyle){
      style=document.createElement('style');
      style.id='standard-layout-first-paint';
    }
    style.textContent=`
        @media screen and (min-width: 769px) {
          .mobile-menu-toggle, .mobile-menu-backdrop { display:none!important; }
          body .sidebar.shared-sidebar,body .sidebar{position:fixed!important;top:0!important;left:0!important;width:143px!important;min-width:143px!important;height:100vh!important;min-height:100vh!important;z-index:90!important;transform:none!important}
          body .sidebar.shared-sidebar .brand,body .sidebar .brand{display:block!important;visibility:visible!important;width:143px!important;height:49px!important;min-height:49px!important;background-color:#eee!important;background-image:url("public/logo.webp")!important;background-position:center center!important;background-repeat:no-repeat!important;background-size:auto 26px!important;font-size:0!important;color:transparent!important}
          body .topbar .brand-mini,body .products-topbar .brand-mini{display:block!important;width:133px!important;min-width:133px!important;height:49px!important;min-height:49px!important;background-image:url("public/logo.png")!important;background-position:center center!important;background-repeat:no-repeat!important;background-size:auto 26px!important;font-size:0!important;color:transparent!important}
          body .sidebar.shared-sidebar nav a,body .sidebar nav a{height:31px!important;min-height:31px!important;padding:9px 13px!important;font-size:12px!important;line-height:13px!important}
          body main{margin-left:143px!important;width:calc(100% - 143px)!important;padding-top:98px!important}
          body main>.topbar,body main>.products-topbar{position:fixed!important;left:143px!important;top:0!important;width:calc(100% - 143px)!important;height:49px!important;min-height:49px!important;padding:0 10px!important;z-index:85!important;background:#eee!important;display:flex!important;align-items:center!important}
          body main>.titlebar,body main>.clients-title,body main>.purchase-header,body main>.dashboard-title,body main>.finance-title,body main>.fleet-title,body main>.products-title,body main>.reports-title,body main>.config-title{position:fixed!important;left:143px!important;top:49px!important;width:calc(100% - 143px)!important;height:49px!important;min-height:49px!important;z-index:80!important;background-color:#5e7d89!important;background-image:none!important;opacity:1!important}
          body .finance-form-overlay,body .transfer-form-overlay,body .recurrence-form-overlay,body .receipt-form-overlay,body .receipt-history-overlay,body .conciliation-upload-overlay,body .new-purchase,body .stock-adjust-modal,body .account-modal,body .user-modal-overlay{left:143px!important;top:49px!important;right:0!important;bottom:0!important;width:calc(100% - 143px)!important;height:calc(100vh - 49px)!important;z-index:82!important}
          body main>.sales-content:before{content:"";position:fixed;left:143px;top:98px;width:calc(100% - 143px);height:117px;background:#f2f3f4;z-index:33;pointer-events:none}
          body main>.sales-content>.tabs{position:fixed!important;left:143px!important;top:122px!important;width:calc(100% - 143px)!important;height:38px!important;z-index:34!important;background:#f2f3f4!important}
          body main>.sales-content>.toolbar{position:fixed!important;left:143px!important;top:160px!important;width:calc(100% - 143px)!important;height:55px!important;z-index:34!important;background:#f2f3f4!important}
        }
        body .client-tabs{display:flex!important;align-items:flex-start!important;height:38px!important;min-height:38px!important;border-bottom:1px solid #20a9a8!important;margin:0!important}
        body .client-tabs button{height:38px!important;min-height:38px!important;box-sizing:border-box!important;padding:10px 16px!important;margin:0 4px 0 0!important;font-size:12px!important;line-height:18px!important;border-radius:4px 4px 0 0!important}

        /* Adaptação fluida para Tablets e Dispositivos Móveis (<= 768px) */
        @media (max-width: 768px) {
          html, body { width:100%!important; max-width:100vw!important; overflow-x:hidden!important; -webkit-text-size-adjust:100%; }
          body { display:block!important; }

          /* Menu lateral recolhível em gaveta fluida (Off-Canvas Drawer) */
          html body .sidebar,
          html body .sidebar.shared-sidebar {
            position:fixed!important;
            top:0!important;
            left:0!important;
            width:240px!important;
            min-width:240px!important;
            max-width:82vw!important;
            height:100vh!important;
            min-height:100vh!important;
            z-index:999!important;
            background:#344750!important;
            transform:translateX(-105%)!important;
            transition:transform 0.24s cubic-bezier(0.4,0,0.2,1)!important;
            box-shadow:none!important;
            overflow-y:auto!important;
            display:block!important;
          }
          html body.mobile-menu-open .sidebar,
          html body.mobile-menu-open .sidebar.shared-sidebar {
            transform:translateX(0)!important;
            box-shadow:6px 0 24px rgba(0,0,0,0.35)!important;
          }
          html body .sidebar .brand,
          html body .sidebar.shared-sidebar .brand {
            width:100%!important;
            height:52px!important;
            min-height:52px!important;
            background-size:auto 28px!important;
          }
          html body .sidebar nav a,
          html body .sidebar.shared-sidebar nav a {
            height:42px!important;
            min-height:42px!important;
            max-height:42px!important;
            padding:0 16px!important;
            font-size:13px!important;
            border-bottom:1px solid rgba(255,255,255,0.05)!important;
          }

          /* Botão hambúrguer e backdrop no mobile */
          .mobile-menu-toggle {
            display:inline-flex!important;
            align-items:center!important;
            justify-content:center!important;
            width:38px!important;
            height:38px!important;
            margin-right:6px!important;
            border:1px solid #d0d9dd!important;
            border-radius:4px!important;
            background:#fff!important;
            color:#344750!important;
            font-size:20px!important;
            cursor:pointer!important;
            flex:0 0 38px!important;
          }
          .mobile-menu-backdrop {
            display:none!important;
            position:fixed!important;
            inset:0!important;
            background:rgba(15,25,32,0.48)!important;
            z-index:998!important;
            border:0!important;
          }
          body.mobile-menu-open .mobile-menu-backdrop {
            display:block!important;
          }

          /* Container principal ocupando 100% da tela */
          html body main,
          html body:has(.shared-sidebar) main {
            margin-left:0!important;
            width:100%!important;
            max-width:100%!important;
            padding-top:0!important;
          }

          /* Topbar mobile fixa e enxuta */
          html body main>.topbar,
          html body main>.products-topbar {
            position:sticky!important;
            top:0!important;
            left:0!important;
            width:100%!important;
            height:52px!important;
            min-height:52px!important;
            padding:0 10px!important;
            z-index:120!important;
            display:flex!important;
            align-items:center!important;
            gap:6px!important;
            background:#eee!important;
            border-bottom:1px solid #d5dde0!important;
          }
          html body .topbar .brand-mini,
          html body .products-topbar .brand-mini {
            width:92px!important;
            min-width:92px!important;
            height:40px!important;
            min-height:40px!important;
            background-size:contain!important;
            flex:0 0 92px!important;
          }
          html body .topbar .search,
          html body .products-topbar .products-search {
            flex:1 1 auto!important;
            width:auto!important;
            min-width:0!important;
            max-width:none!important;
            height:34px!important;
            margin:0!important;
            padding:0 8px!important;
            display:flex!important;
            align-items:center!important;
            justify-content:space-between!important;
            font-size:11px!important;
            overflow:hidden!important;
            white-space:nowrap!important;
          }
          html body .topbar .search button,
          html body .products-topbar .products-search button {
            float:none!important;
            margin:0 -8px 0 6px!important;
            width:34px!important;
            height:34px!important;
            flex:0 0 34px!important;
            font-size:16px!important;
          }
          html body .topbar .user,
          html body .products-topbar .products-user {
            margin-left:auto!important;
            font-size:10px!important;
            line-height:1.15!important;
            padding-right:28px!important;
            max-width:120px!important;
            white-space:nowrap!important;
            overflow: visible!important;
          }
          html body .topbar .user small { display:none!important; }

          /* Cabeçalho de título da página */
          html body main>.titlebar,
          html body main>.clients-title,
          html body main>.purchase-header,
          html body main>.dashboard-title,
          html body main>.finance-title,
          html body main>.fleet-title,
          html body main>.products-title,
          html body main>.reports-title,
          html body main>.config-title {
            position:relative!important;
            left:0!important;
            top:0!important;
            width:100%!important;
            min-height:48px!important;
            height:auto!important;
            padding:10px 12px!important;
            display:flex!important;
            flex-wrap:wrap!important;
            align-items:center!important;
            justify-content:space-between!important;
            gap:8px!important;
            font-size:15px!important;
            z-index:40!important;
          }

          /* Abas horizontais deslizáveis por toque (Touch Swipe Tabs) */
          html body main>.sales-content:before { display:none!important; }
          html body main>.sales-content { padding:10px!important; }
          html body main>.sales-content>.tabs,
          html body .client-tabs,
          html body .finance-tabs,
          html body .purchase-tabs,
          html body .product-tabs,
          html body .categories {
            position:relative!important;
            left:0!important;
            top:0!important;
            width:100%!important;
            height:auto!important;
            min-height:38px!important;
            display:flex!important;
            flex-direction:row!important;
            flex-wrap:nowrap!important;
            overflow-x:auto!important;
            overflow-y:hidden!important;
            -webkit-overflow-scrolling:touch!important;
            scrollbar-width:none!important;
            gap:4px!important;
            padding-bottom:2px!important;
          }
          html body main>.sales-content>.tabs::-webkit-scrollbar,
          html body .client-tabs::-webkit-scrollbar,
          html body .finance-tabs::-webkit-scrollbar,
          html body .purchase-tabs::-webkit-scrollbar,
          html body .product-tabs::-webkit-scrollbar,
          html body .categories::-webkit-scrollbar { display:none!important; }
          html body main>.sales-content>.tabs .tab,
          html body .client-tabs button,
          html body .finance-tabs button,
          html body .purchase-tab,
          html body .product-tabs button,
          html body .categories button {
            flex:0 0 auto!important;
            width:auto!important;
            white-space:nowrap!important;
            padding:0 14px!important;
            height:38px!important;
            min-height:38px!important;
          }

          /* Barras de ferramentas responsivas */
          html body main>.sales-content>.toolbar,
          html body .toolbar,
          html body .client-toolbar,
          html body .finance-toolbar,
          html body .purchase-toolbar,
          html body .product-toolbar {
            position:relative!important;
            left:0!important;
            top:0!important;
            width:100%!important;
            min-width:0!important;
            height:auto!important;
            min-height:48px!important;
            padding:10px 12px!important;
            display:flex!important;
            flex-wrap:wrap!important;
            align-items:center!important;
            gap:8px!important;
          }
          html body .client-search,
          html body .toolbar input,
          html body .toolbar-right,
          html body .toolbar-right input {
            width:100%!important;
            max-width:none!important;
            flex:1 1 100%!important;
          }

          /* Tabelas com rolagem horizontal suave por toque */
          html body .sales-content,
          html body .client-panel,
          html body .finance-panel,
          html body .purchase-panel,
          html body .product-panel,
          html body .panel {
            overflow-x:auto!important;
            -webkit-overflow-scrolling:touch!important;
            max-width:100%!important;
          }
          html body .sales-table,
          html body .client-table,
          html body .finance-table,
          html body .purchase-table,
          html body .product-table,
          html body .user-table {
            min-width:640px!important;
            width:100%!important;
          }

          /* Indicadores (Dashboard) e Formulários adaptáveis */
          html body .dashboard,
          html body .clients,
          html body .config-body,
          html body .finance-content,
          html body .purchase-content,
          html body .products-content {
            padding:12px 10px 28px!important;
          }
          html body .dash-metrics {
            grid-template-columns:repeat(2,1fr)!important;
            gap:10px!important;
          }
          html body .dash-grid,
          html body .dash-cat-box,
          html body .form-grid,
          html body .user-form-grid,
          html body .perm-grid,
          html body .account-grid,
          html body .finance-form-grid,
          html body .purchase-form-grid,
          html body .grid-2,
          html body .grid-3,
          html body .grid-4,
          html body .grid-address {
            grid-template-columns:1fr!important;
            gap:10px!important;
          }

          /* Modais e sobreposições ocupando 100% no mobile */
          html body .finance-form-overlay,
          html body .transfer-form-overlay,
          html body .recurrence-form-overlay,
          html body .receipt-form-overlay,
          html body .receipt-history-overlay,
          html body .conciliation-upload-overlay,
          html body .new-purchase,
          html body .stock-adjust-modal,
          html body .account-modal,
          html body .user-modal-overlay,
          html body #newSale {
            left:0!important;
            top:0!important;
            width:100%!important;
            max-width:100vw!important;
            height:100vh!important;
            padding:10px!important;
          }
          html body #newSale {
            position:relative!important;
            height:auto!important;
          }
          html body .cart-head,
          html body .finance-head { display:none!important; }
          html body .cart-row,
          html body .installment {
            grid-template-columns:1fr 1fr!important;
            gap:8px!important;
            padding:8px 0!important;
            border-bottom:1px solid #e3e8eb!important;
          }
          html body .cart-row .product-wrap {
            grid-column:1 / -1!important;
          }
        }

        @media (max-width: 480px) {
          html body .dash-metrics {
            grid-template-columns:1fr!important;
          }
          html body .topbar .user {
            font-size:0!important;
            width:32px!important;
            min-width:32px!important;
            padding-right:0!important;
          }
          html body .topbar .user .user-menu {
            font-size:12px!important;
            right:0!important;
            left:auto!important;
          }
        }
      `;
    if(isNewStyle)document.head.appendChild(style);
    const isMobile=window.matchMedia('(max-width: 768px)').matches;
    const sidebar=document.querySelector('.sidebar'),main=document.querySelector('main'),topbar=document.querySelector('main>.topbar,main>.products-topbar');
    const title=document.querySelector('main>.titlebar,main>.clients-title,main>.purchase-header,main>.dashboard-title,main>.finance-title,main>.fleet-title,main>.products-title,main>.reports-title,main>.config-title');
    const sales=document.querySelector('.sales-content'),tabs=sales?.querySelector(':scope > .tabs'),toolbar=sales?.querySelector(':scope > .toolbar');

    if(isMobile){
      [sidebar,main,topbar,title,sales,tabs,toolbar].forEach(function(el){
        if(!el)return;
        ['top','left','width','min-width','height','min-height','margin-left','padding-top','position','z-index'].forEach(function(prop){
          el.style.removeProperty(prop);
        });
      });
      return;
    }

    if(sidebar){sidebar.style.setProperty('top','0px','important');sidebar.style.setProperty('left','0px','important');sidebar.style.setProperty('width','143px','important');sidebar.style.setProperty('min-width','143px','important');sidebar.style.setProperty('height','100vh','important');sidebar.style.setProperty('min-height','100vh','important');sidebar.style.setProperty('z-index','90','important');const brand=sidebar.querySelector('.brand');if(brand){brand.style.setProperty('display','block','important');brand.style.setProperty('visibility','visible','important');brand.style.setProperty('width','143px','important');brand.style.setProperty('height','49px','important');brand.style.setProperty('background-color','#eee','important');brand.style.setProperty('background-image',"url('public/logo.webp')",'important');brand.style.setProperty('background-position','center center','important');brand.style.setProperty('background-repeat','no-repeat','important');brand.style.setProperty('background-size','auto 26px','important');brand.style.setProperty('font-size','0','important');brand.style.setProperty('color','transparent','important');}sidebar.querySelectorAll('nav a').forEach(a=>{a.style.setProperty('height','31px','important');a.style.setProperty('min-height','31px','important');a.style.setProperty('padding','9px 13px','important');a.style.setProperty('font-size','12px','important');});}
    if(main){main.style.setProperty('margin-left','143px','important');main.style.setProperty('width','calc(100% - 143px)','important');main.style.setProperty('padding-top','98px','important');}
    if(topbar){topbar.style.setProperty('position','fixed','important');topbar.style.setProperty('left','143px','important');topbar.style.setProperty('top','0','important');topbar.style.setProperty('width','calc(100% - 143px)','important');topbar.style.setProperty('height','49px','important');topbar.style.setProperty('min-height','49px','important');topbar.style.setProperty('z-index','85','important');}
    if(title){title.style.setProperty('position','fixed','important');title.style.setProperty('left','143px','important');title.style.setProperty('top','49px','important');title.style.setProperty('width','calc(100% - 143px)','important');title.style.setProperty('height','49px','important');title.style.setProperty('z-index','80','important');title.style.setProperty('background-color','#5e7d89','important');title.style.setProperty('background-image','none','important');title.style.setProperty('opacity','1','important');}
    if(sales){sales.style.setProperty('padding-top','117px','important');}
    if(tabs){tabs.style.setProperty('position','fixed','important');tabs.style.setProperty('left','143px','important');tabs.style.setProperty('top','122px','important');tabs.style.setProperty('width','calc(100% - 143px)','important');tabs.style.setProperty('height','38px','important');tabs.style.setProperty('z-index','34','important');tabs.style.setProperty('background-color','#f2f3f4','important');tabs.style.setProperty('background-image','none','important');tabs.style.setProperty('opacity','1','important');}
    if(toolbar){toolbar.style.setProperty('position','fixed','important');toolbar.style.setProperty('left','143px','important');toolbar.style.setProperty('top','160px','important');toolbar.style.setProperty('width','calc(100% - 143px)','important');toolbar.style.setProperty('height','55px','important');toolbar.style.setProperty('z-index','34','important');toolbar.style.setProperty('background-color','#f2f3f4','important');toolbar.style.setProperty('background-image','none','important');toolbar.style.setProperty('opacity','1','important');}
  }
  enforceFixedLayout();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enforceFixedLayout);
  window.addEventListener('resize',enforceFixedLayout);
})();

// Papel timbrado oficial Piremaxx Pneus em todas as impressões do sistema + Modal de Envio via WhatsApp.
(function(){
  const BG_URL = new URL('public/papel-timbrado.jpg', location.href).href;

  function escHtml(v){
    return String(v == null ? '' : v).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function findContactPhone(clientName){
    if(!clientName) return '';
    const norm = String(clientName).trim().toLowerCase();
    try {
      const local = JSON.parse(localStorage.getItem('piremaxx_contatos') || '[]');
      const hitLocal = local.find(function(x){ return String(x.nome || '').trim().toLowerCase() === norm; });
      if(hitLocal && hitLocal.telefone) return String(hitLocal.telefone);
    } catch(e){}
    try {
      const imp = window.importedContacts || [];
      const hitImp = imp.find(function(x){ return String(x.name || x.fantasy || '').trim().toLowerCase() === norm; });
      if(hitImp && hitImp.phones) return String(hitImp.phones);
    } catch(e){}
    return '';
  }

  function generateEgestorKey(code){
    const num = String(code || '3300').replace(/\D/g, '') || '3300';
    return '48285.' + num.padStart(4, '8').slice(0, 4) + '.01a91.4146.831a.2e5d';
  }

  // Modal oficial "Envio via WhatsApp" idêntico à referência visual
  window.openPiremaxxWhatsAppModal = function(opts){
    opts = opts || {};
    document.getElementById('piremaxxWhatsAppOverlay')?.remove();

    if(!document.getElementById('piremaxxWhatsAppStyle')){
      const st = document.createElement('style');
      st.id = 'piremaxxWhatsAppStyle';
      st.textContent = `
        #piremaxxWhatsAppOverlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 36px 14px;
          overflow-y: auto;
          font-family: Arial, Helvetica, sans-serif;
        }
        .wa-modal-card {
          width: 560px;
          max-width: 95vw;
          background: #fff;
          border-radius: 6px;
          box-shadow: 0 5px 22px rgba(0, 0, 0, 0.35);
          overflow: hidden;
          animation: waModalFadeIn 0.16s ease-out;
        }
        @keyframes waModalFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .wa-modal-header {
          height: 50px;
          background: #4cb050;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          font-size: 16px;
          font-weight: bold;
        }
        .wa-modal-close {
          border: 0;
          background: transparent;
          color: rgba(255, 255, 255, 0.78);
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
          padding: 4px;
        }
        .wa-modal-close:hover { color: #fff; }
        .wa-modal-body {
          padding: 20px 28px 22px;
          color: #666;
          font-size: 13px;
        }
        .wa-modal-alert {
          background: #dff0d8;
          border: 1px solid #d0e6c6;
          color: #3c763d;
          border-radius: 4px;
          padding: 14px 16px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
        }
        .wa-modal-alert a {
          color: #1b6ec2;
          text-decoration: none;
        }
        .wa-modal-alert a:hover { text-decoration: underline; }
        .wa-modal-alert-close {
          border: 0;
          background: transparent;
          color: #9ab996;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          padding: 0 2px;
        }
        .wa-modal-label {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #777;
          font-size: 13px;
          margin-bottom: 6px;
        }
        .wa-modal-help {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #777;
          color: #fff;
          font-size: 10px;
          font-weight: bold;
          cursor: help;
        }
        .wa-modal-msgbox {
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 13px 15px;
          min-height: 120px;
          color: #666;
          font-size: 13px;
          line-height: 1.48;
          background: #fff;
          margin-bottom: 20px;
          outline: none;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .wa-modal-msgbox:focus {
          border-color: #4cb050;
        }
        .wa-modal-msgbox a {
          color: #1b6ec2;
          text-decoration: none;
        }
        .wa-modal-msgbox a:hover {
          text-decoration: underline;
        }
        .wa-modal-phone {
          width: 100%;
          height: 36px;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 0 12px;
          font-size: 14px;
          color: #444;
          box-sizing: border-box;
          outline: none;
        }
        .wa-modal-phone:focus {
          border-color: #4cb050;
        }
        .wa-modal-footer {
          border-top: 1px solid #e5e5e5;
          padding: 14px 18px;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          background: #fff;
        }
        .wa-btn-send {
          height: 34px;
          padding: 0 16px;
          border: 0;
          border-radius: 4px;
          background: #2b9348;
          color: #fff;
          font-size: 13px;
          font-weight: bold;
          cursor: pointer;
        }
        .wa-btn-send:hover { background: #237a3b; }
        .wa-btn-back {
          height: 34px;
          padding: 0 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fff;
          color: #333;
          font-size: 13px;
          cursor: pointer;
        }
        .wa-btn-back:hover { background: #f5f5f5; }
      `;
      document.head.appendChild(st);
    }

    const code = String(opts.code || '3300').trim();
    const docTypeRaw = String(opts.type || 'Venda').trim();
    const isQuote = docTypeRaw.toLowerCase().includes('orçamento') || docTypeRaw.toLowerCase().includes('orcamento');
    const docLabel = opts.docLabel || (isQuote ? ('o orçamento nº ' + code) : ('o pedido de venda nº ' + code));
    const displayKey = generateEgestorKey(code);
    const displayUrl = opts.displayUrl || ('https://v4.egestor.com.br/vendas/print.php?key=' + displayKey);
    const openPdfUrl = opts.pdfUrl || new URL('venda-pdf.html?code=' + encodeURIComponent(code), location.href).href;
    const initialPhone = opts.phone != null ? String(opts.phone) : findContactPhone(opts.client || '');

    const overlay = document.createElement('div');
    overlay.id = 'piremaxxWhatsAppOverlay';
    overlay.innerHTML = `
      <div class="wa-modal-card" role="dialog" aria-modal="true" aria-label="Envio via WhatsApp">
        <div class="wa-modal-header">
          <span>Envio via WhatsApp</span>
          <button type="button" class="wa-modal-close" aria-label="Fechar">×</button>
        </div>
        <div class="wa-modal-body">
          <div class="wa-modal-alert">
            <span>Você precisa estar conectado no <a href="https://web.whatsapp.com/" target="_blank" rel="noopener">WhatsApp Web</a>.</span>
            <button type="button" class="wa-modal-alert-close" aria-label="Fechar aviso">×</button>
          </div>
          <label class="wa-modal-label">Mensagem <span class="wa-modal-help" title="Mensagem que será enviada para o cliente no WhatsApp">?</span></label>
          <div class="wa-modal-msgbox" contenteditable="true" spellcheck="false">${opts.message ? escHtml(opts.message) : `Olá!
Aqui é da empresa DNFX - COMERCIO DE PNEUS.

Estou enviando ${escHtml(docLabel)}. Para visualizar, basta clicar no link:
<a href="${escHtml(openPdfUrl)}" target="_blank" rel="noopener">${escHtml(displayUrl)}</a>`}</div>
          <label class="wa-modal-label" for="waModalPhoneInput">Informe o número</label>
          <input id="waModalPhoneInput" type="tel" class="wa-modal-phone" value="${escHtml(initialPhone)}" autocomplete="off">
        </div>
        <div class="wa-modal-footer">
          <button type="button" class="wa-btn-send">Enviar</button>
          <button type="button" class="wa-btn-back">Voltar</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    const phoneInput = overlay.querySelector('#waModalPhoneInput');
    const msgBox = overlay.querySelector('.wa-modal-msgbox');
    setTimeout(function(){ phoneInput?.focus(); }, 40);

    function close(){ overlay.remove(); }
    overlay.querySelector('.wa-modal-close').onclick = close;
    overlay.querySelector('.wa-btn-back').onclick = close;
    overlay.querySelector('.wa-modal-alert-close').onclick = function(){
      overlay.querySelector('.wa-modal-alert')?.remove();
    };
    overlay.addEventListener('click', function(e){
      if(e.target === overlay) close();
    });

    msgBox.addEventListener('click', function(e){
      const a = e.target.closest('a');
      if(a){
        e.preventDefault();
        nativeWindowOpen.call(window, a.href, '_blank');
      }
    });

    overlay.querySelector('.wa-btn-send').onclick = function(){
      const rawPhone = (phoneInput.value || '').replace(/\D/g, '');
      const text = (msgBox.innerText || msgBox.textContent || '').trim();
      let phoneParam = '';
      if(rawPhone){
        phoneParam = rawPhone.startsWith('55') && rawPhone.length >= 12 ? rawPhone : ('55' + rawPhone);
      }
      const waUrl = phoneParam
        ? ('https://web.whatsapp.com/send?phone=' + phoneParam + '&text=' + encodeURIComponent(text))
        : ('https://web.whatsapp.com/send?text=' + encodeURIComponent(text));
      nativeWindowOpen.call(window, waUrl, '_blank');
      close();
    };
  };

  // Gerador de documentos corporativos profissionais no papel timbrado Piremaxx Pneus (nunca imprime printscreen da tela)
  const popupLetterheadCSS = `
    <style id="piremaxx-popup-letterhead">
      @page { size: A4 portrait; margin: 0 !important; }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        min-height: 297mm;
        background: transparent !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        font-family: Arial, Helvetica, sans-serif !important;
        color: #1f2f3d !important;
      }
      body {
        padding: 0 15mm !important;
        box-sizing: border-box !important;
        position: relative !important;
        z-index: 1 !important;
      }
      body:has(> .page), body:has(> .product-sheet) {
        padding: 0 15mm !important;
      }
      .page, .product-sheet {
        padding: 0 !important;
        box-sizing: border-box !important;
        min-height: 0 !important;
        position: relative !important;
        z-index: 1 !important;
      }
      /* Moldura de impressão: o thead/tfoot se repete em TODAS as páginas, reservando o espaço do cabeçalho e rodapé do papel timbrado */
      table.pmx-print-frame { width: 100% !important; border-collapse: collapse !important; margin: 0 !important; border: 0 !important; }
      table.pmx-print-frame > thead > tr > td,
      table.pmx-print-frame > tfoot > tr > td,
      table.pmx-print-frame > tbody > tr > td.pmx-frame-cell {
        padding: 0 !important; border: 0 !important; background: transparent !important;
        font-size: inherit !important; color: inherit !important; text-transform: none !important;
      }
      .pmx-frame-top { height: 34mm; }
      .pmx-frame-bottom { height: 16mm; }
      table.pmx-print-frame > thead { display: table-header-group; }
      table.pmx-print-frame > tfoot { display: table-footer-group; }
      table:not(.pmx-print-frame) tr { break-inside: avoid; page-break-inside: avoid; }
      table:not(.pmx-print-frame) thead { display: table-header-group; }
      .piremaxx-print-bg {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: fill !important;
        z-index: -1 !important;
        pointer-events: none !important;
      }
      .doc-header-banner {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        border-bottom: 2px solid #1b2886;
        padding-bottom: 10px;
        margin-bottom: 16px;
      }
      .doc-header-banner h1 {
        margin: 0 !important;
        font-size: 18px !important;
        color: #1b2886 !important;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        border: 0 !important;
        padding: 0 !important;
      }
      .doc-header-meta {
        text-align: right;
        font-size: 11px;
        color: #3b5162;
        line-height: 1.45;
      }
      table {
        width: 100% !important;
        border-collapse: collapse !important;
        background: transparent !important;
        margin-top: 8px;
      }
      thead th, th {
        background: #1b2886 !important;
        color: #ffffff !important;
        font-size: 11px !important;
        font-weight: bold !important;
        text-transform: uppercase;
        padding: 8px 10px !important;
        border: 1px solid #1b2886 !important;
        text-align: left;
      }
      tbody td, td {
        background: transparent !important;
        color: #1f2f3d !important;
        font-size: 11.5px !important;
        padding: 7px 10px !important;
        border-bottom: 1px solid #cfd8de !important;
      }
      tfoot td, .print-total td {
        background: rgba(27, 40, 134, 0.06) !important;
        font-weight: bold !important;
        color: #1b2886 !important;
        border-top: 2px solid #1b2886 !important;
      }
      .doc-footer-sign {
        margin-top: 28px;
        padding-top: 10px;
        border-top: 1px solid #cfd8de;
        display: flex;
        justify-content: space-between;
        font-size: 10.5px;
        color: #546a7b;
      }
    </style>
  `;

  const nativeWindowOpen = window.open;
  window.open = function(url){
    // Se algum botão tentar abrir wa.me diretamente, abre primeiro o modal oficial de Envio via WhatsApp
    if(typeof url === 'string' && (url.includes('wa.me/') || url.includes('api.whatsapp.com'))){
      let parsedText = '';
      try {
        const u = new URL(url);
        parsedText = u.searchParams.get('text') || '';
      } catch(e){}
      const codeMatch = parsedText.match(/#(\d+)/);
      window.openPiremaxxWhatsAppModal({
        code: codeMatch ? codeMatch[1] : '3300',
        type: parsedText.toLowerCase().includes('orçamento') ? 'Orçamento' : 'Venda'
      });
      return null;
    }

    const win = nativeWindowOpen.apply(this, arguments);
    if(!win) return win;
    try {
      const nativeWrite = win.document.write.bind(win.document);
      let rawPrint = win.print ? win.print.bind(win) : null;
      win.print = function(){
        const bg = win.document && win.document.querySelector('.piremaxx-print-bg');
        if(bg && !bg.complete){
          bg.addEventListener('load', function(){ if(rawPrint) rawPrint(); }, { once: true });
          bg.addEventListener('error', function(){ if(rawPrint) rawPrint(); }, { once: true });
          return;
        }
        if(rawPrint) rawPrint();
      };
      win.document.write = function(html){
        let content = String(html || '');
        if(/<head[^>]*>/i.test(content)){
          content = content.replace(/<head[^>]*>/i, '$&' + popupLetterheadCSS);
        } else {
          content = popupLetterheadCSS + content;
        }
        const frameOpen = '<img class="piremaxx-print-bg" src="' + BG_URL + '" alt=""><table class="pmx-print-frame"><thead><tr><td><div class="pmx-frame-top"></div></td></tr></thead><tfoot><tr><td><div class="pmx-frame-bottom"></div></td></tr></tfoot><tbody><tr><td class="pmx-frame-cell">';
        const frameClose = '</td></tr></tbody></table>';
        if(/<body[^>]*>/i.test(content)){
          content = content.replace(/<body[^>]*>/i, '$&' + frameOpen);
        } else {
          content = frameOpen + content;
        }
        if(/<\/body>/i.test(content)){
          content = content.replace(/<\/body>/i, frameClose + '</body>');
        } else {
          content = content + frameClose;
        }
        return nativeWrite(content);
      };
    } catch(e){}
    return win;
  };

  window.openPiremaxxPrintDocument = function(title, bodyHtml){
    const w = window.open('', '_blank', 'width=940,height=840');
    if(!w){
      alert('Permita a abertura de pop-ups para visualizar e imprimir o documento.');
      return;
    }
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
    w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escHtml(title)} - Piremaxx Pneus</title></head><body><div class="doc-header-banner"><h1>${escHtml(title)}</h1><div class="doc-header-meta"><b>PIREMAXX PNEUS</b><br>Emitido em: ${dateStr}</div></div>${bodyHtml}<div class="doc-footer-sign"><span>Documento oficial emitido pelo Sistema Gestão Piremaxx Pneus</span><span>Rua Ourique 261 - Penha Circular · Tel: (21) 3881-1891</span></div><script>window.onload=function(){window.print()}<\/script></body></html>`);
    w.document.close();
  };

  // Se qualquer tela chamar window.print() diretamente (exceto venda-pdf.html), converte automaticamente a tabela/ficha ativa em um documento corporativo limpo no papel timbrado, evitando "printscreen" da interface!
  const isDedicatedPdfPage = (location.pathname.split('/').pop() || '').toLowerCase() === 'venda-pdf.html';
  const nativePrint = window.print ? window.print.bind(window) : null;
  if(nativePrint && !isDedicatedPdfPage){
    window.print = function(){
      // 1. Verifica se há uma área de impressão específica preparada (.finance-print-sheet, .client-report, .print-area)
      const specificArea = document.querySelector('.finance-print-sheet:not(:empty), .client-report:not(:empty), .print-area:not(:empty)');
      if(specificArea){
        const clone = specificArea.cloneNode(true);
        clone.querySelectorAll('button, input[type="checkbox"], .contact-actions').forEach(function(el){ el.remove(); });
        const heading = clone.querySelector('h1, h2, h3');
        const docTitle = heading ? heading.textContent.replace(/[↪▣🖨]/g, '').trim() : (document.title || 'Relatório Piremaxx');
        if(heading) heading.remove();
        window.openPiremaxxPrintDocument(docTitle, clone.innerHTML);
        return;
      }
      // 2. Caso contrário, extrai a tabela visível da aba atual e monta um relatório limpo
      const visibleTable = Array.from(document.querySelectorAll('main table')).find(function(t){ return t.offsetParent !== null; });
      if(visibleTable){
        const cloneTable = visibleTable.cloneNode(true);
        cloneTable.querySelectorAll('tr').forEach(function(tr){
          const firstCell = tr.cells[0];
          if(firstCell && (firstCell.querySelector('input[type="checkbox"]') || firstCell.textContent.trim() === '□')){
            firstCell.remove();
          }
          const lastCell = tr.cells[tr.cells.length - 1];
          if(lastCell && (lastCell.classList.contains('contact-actions') || lastCell.querySelector('button'))){
            lastCell.remove();
          }
        });
        const pageTitle = document.querySelector('.titlebar, .clients-title, .purchase-header, .finance-title, .products-title, .reports-title, .config-title');
        const activeTab = document.querySelector('.tabs .tab.active, .client-tabs button.active, .finance-tabs button.active, .purchase-tab.active, .product-tabs button.active');
        const titleText = ((pageTitle ? pageTitle.childNodes[0]?.textContent : '') + (activeTab ? ' - ' + activeTab.textContent : '')).replace(/[▣↪⇄↶♣⚒☷]/g, '').trim() || 'Relatório do Sistema';
        window.openPiremaxxPrintDocument(titleText, cloneTable.outerHTML);
        return;
      }
      return nativePrint();
    };
  }
})();

// =========================================================================
// SINCRONIZAÇÃO ONLINE DE DADOS (Fornecedores, Contatos, Vendas, Estoque, etc.)
// =========================================================================
(function(){
  const SYNC_KEYS = [
    'piremaxx_contatos',
    'piremaxx_fornecedores',
    'deletedContactCodes',
    'localSales',
    'localReturns',
    'deletedSaleCodes',
    'localProducts',
    'deletedProductCodes',
    'localServices',
    'deletedServiceCodes',
    'piremaxx_compras',
    'piremaxx_contas_receber',
    'piremaxx_contas_pagar',
    'localCashBalance',
    'localCashTransactions',
    'returnReceivableAdjustments'
  ];

  const origSetItem = Storage.prototype.setItem.bind(localStorage);
  const origGetItem = Storage.prototype.getItem.bind(localStorage);

  function syncSupplierMirror() {
    try {
      const contacts = JSON.parse(origGetItem('piremaxx_contatos') || '[]');
      const dedicated = JSON.parse(origGetItem('piremaxx_fornecedores') || '[]');
      const deleted = new Set(JSON.parse(origGetItem('deletedContactCodes') || '[]').map(String));

      let contactsChanged = false;
      dedicated.forEach(function(sup) {
        const id = String(sup.id || sup.code || '').trim();
        const nome = String(sup.nome || sup.name || '').trim();
        if (!nome || deleted.has(id) || deleted.has(nome)) return;
        const idx = contacts.findIndex(function(c) {
          return (id && String(c.id || c.code || '').trim() === id) ||
                 String(c.nome || c.name || '').trim().toLowerCase() === nome.toLowerCase();
        });
        if (idx >= 0) {
          const tipos = Array.isArray(contacts[idx].tipos) ? contacts[idx].tipos : ['fornecedor'];
          if (!tipos.includes('fornecedor')) {
            tipos.push('fornecedor');
            contacts[idx].tipos = tipos;
            contactsChanged = true;
          }
        } else {
          contacts.unshift(Object.assign({}, sup, {
            id: id || ('FORN-' + Date.now().toString().slice(-5)),
            nome: nome,
            tipos: Array.isArray(sup.tipos) && sup.tipos.includes('fornecedor') ? sup.tipos : ['fornecedor'],
            tipo: 'fornecedor'
          }));
          contactsChanged = true;
        }
      });

      if (contactsChanged) {
        origSetItem('piremaxx_contatos', JSON.stringify(contacts));
      }

      const allSuppliers = contacts.filter(function(c) {
        const tipos = Array.isArray(c.tipos) ? c.tipos : [];
        const t = String(c.tipo || c.categoria || '').toLowerCase();
        return tipos.includes('fornecedor') || t === 'fornecedor';
      });
      origSetItem('piremaxx_fornecedores', JSON.stringify(allSuppliers));
    } catch (e) {}
  }

  function pushKeyToServer(key, value) {
    if (location.protocol === 'file:') return Promise.resolve();
    const payload = {};
    payload[key] = value;
    if (key === 'piremaxx_contatos') {
      syncSupplierMirror();
      payload['piremaxx_fornecedores'] = origGetItem('piremaxx_fornecedores') || '[]';
    } else if (key === 'piremaxx_fornecedores') {
      syncSupplierMirror();
      payload['piremaxx_contatos'] = origGetItem('piremaxx_contatos') || '[]';
    }
    try {
      return fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function(){});
    } catch (e) {
      return Promise.resolve();
    }
  }

  window.piremaxxSyncOnline = pushKeyToServer;
  window.syncSupplierMirror = syncSupplierMirror;

  Storage.prototype.setItem = function(key, value) {
    origSetItem(key, value);
    if (this === localStorage && SYNC_KEYS.includes(key)) {
      pushKeyToServer(key, value);
    }
  };

  syncSupplierMirror();

  if (location.protocol !== 'file:') {
    fetch('/api/storage', { cache: 'no-store' })
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(serverDB) {
        if (!serverDB || typeof serverDB !== 'object') return;
        let updatedAny = false;
        const toPush = {};
        SYNC_KEYS.forEach(function(k) {
          const localVal = origGetItem(k);
          const serverVal = serverDB[k];
          if (serverVal && (!localVal || localVal === '[]' || localVal === '{}')) {
            origSetItem(k, serverVal);
            updatedAny = true;
          } else if (localVal && localVal !== '[]' && localVal !== '{}' && !serverVal) {
            toPush[k] = localVal;
          } else if (serverVal && localVal && (k === 'piremaxx_contatos' || k === 'piremaxx_fornecedores')) {
            try {
              const localArr = JSON.parse(localVal);
              const serverArr = JSON.parse(serverVal);
              if (Array.isArray(localArr) && Array.isArray(serverArr)) {
                const deleted = new Set(JSON.parse(origGetItem('deletedContactCodes') || '[]').map(String));
                let mergedChanged = false;
                serverArr.forEach(function(item) {
                  const id = String(item.id || item.code || '').trim();
                  const nome = String(item.nome || item.name || '').trim();
                  if (!nome || deleted.has(id) || deleted.has(nome)) return;
                  const exists = localArr.some(function(x) {
                    return (id && String(x.id || x.code || '').trim() === id) ||
                           String(x.nome || x.name || '').trim().toLowerCase() === nome.toLowerCase();
                  });
                  if (!exists) {
                    localArr.push(item);
                    mergedChanged = true;
                  }
                });
                if (mergedChanged) {
                  origSetItem(k, JSON.stringify(localArr));
                  toPush[k] = JSON.stringify(localArr);
                  updatedAny = true;
                }
              }
            } catch (e) {}
          }
        });
        syncSupplierMirror();
        if (Object.keys(toPush).length) {
          fetch('/api/storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(toPush),
            keepalive: true
          }).catch(function(){});
        }
        if (updatedAny && typeof window.renderContactsTable === 'function') {
          window.renderContactsTable();
        }
      })
      .catch(function(){});
  }
})();

