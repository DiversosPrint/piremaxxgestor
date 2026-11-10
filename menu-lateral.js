(function(){
  let sidebar=document.querySelector('.sidebar');
  if(!sidebar){
    sidebar=document.createElement('aside');
    sidebar.className='sidebar shared-sidebar';
    document.body.insertBefore(sidebar,document.body.firstChild);
  }
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const active=(path==='financeiro.html'||path==='financeiro-pagamentos.html')?'financeiro':path==='frota.html'?'frota':path==='vendas.html'?'vendas':path==='compras.html'?'compras':(path==='clientes.html'||path==='novo-cliente.html'||path==='novo-comprador.html')?'clientes':(path==='produtos.html'||path==='novo-produto.html'||path==='novo-servico.html')?'produtos':path==='pix.html'?'pix':path==='relatorios.html'?'relatorios':(path==='configuracoes.html'||path==='usuarios.html')?'configuracoes':'home';
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
    ['pix','Pix','pix.html','icons8-pix-48.png',''],
    ['fiscal','NF-e / Fiscal','#','icons8-fiscal-50.png',''],
    ['relatorios','Relatórios','relatorios.html','icons8-business-report-94.png',''],
    ['configuracoes','Configurações','configuracoes.html','icons8-settings-48.png','']
  ];
  sidebar.classList.add('shared-sidebar');
  function applyBrandStyles(){
    const sharedBrand=sidebar.querySelector('.brand');
    if(sharedBrand){
      const isMobile=window.innerWidth<=768;
      sharedBrand.style.setProperty('display',isMobile?'block':'none','important');
      sharedBrand.style.setProperty('visibility',isMobile?'visible':'hidden','important');
      sharedBrand.style.setProperty('width',isMobile?'100%':'143px','important');
      sharedBrand.style.setProperty('height',isMobile?'49px':'0px','important');
      sharedBrand.style.setProperty('min-height',isMobile?'49px':'0px','important');
      sharedBrand.style.setProperty('background-color','#123d72','important');
      sharedBrand.style.setProperty('background-image',"url('public/images/TOPO1.png')",'important');
      sharedBrand.style.setProperty('background-position','center center','important');
      sharedBrand.style.setProperty('background-repeat','no-repeat','important');
      sharedBrand.style.setProperty('background-size','135px auto','important');
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
    topbar.style.setProperty('background-color','#0d315e','important');
    topbar.style.setProperty('background-image',"url('public/images/topo-textura-automotiva.svg?v=2')",'important');
    topbar.style.setProperty('background-position','center center','important');
    topbar.style.setProperty('background-repeat','no-repeat','important');
    topbar.style.setProperty('background-size','cover','important');
    topbar.style.setProperty('overflow','visible','important');
    const brandEl=topbar.querySelector('.brand-mini');
    if(brandEl){
      const isMob=window.innerWidth<=768;
      brandEl.style.setProperty('width',isMob?'96px':'185px','important');
      brandEl.style.setProperty('min-width',isMob?'96px':'185px','important');
      brandEl.style.setProperty('max-width',isMob?'96px':'185px','important');
      brandEl.style.setProperty('height',isMob?'38px':'49px','important');
      brandEl.style.setProperty('background-image',"url('public/images/TOPO1.png')",'important');
      brandEl.style.setProperty('background-position','left center','important');
      brandEl.style.setProperty('background-repeat','no-repeat','important');
      brandEl.style.setProperty('background-size',isMob?'94px auto':'178px auto','important');
      brandEl.style.setProperty('font-size','0','important');
      brandEl.style.setProperty('color','transparent','important');
      brandEl.style.setProperty('position','relative','important');
    }
    const oldMascot=topbar.querySelector('.topbar-mascot');
    if(oldMascot)oldMascot.remove();
    const searchEl=topbar.querySelector('.search, .products-search');
    if(searchEl){
      searchEl.classList.add('search');
      if(!searchEl.querySelector('.topbar-search-input')){
        searchEl.innerHTML='<input type="search" class="topbar-search-input" placeholder="Buscar vendas, contatos, produtos ou telas..." aria-label="Buscar no sistema" autocomplete="off"><button type="button" class="topbar-search-clear" title="Limpar busca" aria-label="Limpar busca" hidden>×</button><button type="button" class="topbar-search-btn" title="Buscar" aria-label="Buscar">⌕</button><div class="topbar-search-results" hidden></div>';
        const inputEl=searchEl.querySelector('.topbar-search-input');
        const clearBtn=searchEl.querySelector('.topbar-search-clear');
        const submitBtn=searchEl.querySelector('.topbar-search-btn');
        const resultsBox=searchEl.querySelector('.topbar-search-results');

        const MODULES=[
          {title:'Indicadores e Painel Geral',sub:'Gráficos, métricas e últimas atividades',href:'index.html',badge:'Módulo',keywords:'home inicio indicadores dashboard painel auditoria graficos'},
          {title:'Financeiro — Contas a Receber',sub:'Recebimentos, baixas e fluxo de caixa',href:'financeiro.html#recebimentos',badge:'Financeiro',keywords:'financeiro receber recebimentos caixa entradas'},
          {title:'Financeiro — Contas a Pagar',sub:'Despesas, fornecedores e vencimentos',href:'financeiro.html#pagamentos',badge:'Financeiro',keywords:'financeiro pagar pagamentos despesas boletos'},
          {title:'Financeiro — Recibos e Transferências',sub:'Emissão de recibos e transferências',href:'financeiro.html#recibos',badge:'Financeiro',keywords:'recibos transferencias conciliacao recorrencia'},
          {title:'Vendas e Orçamentos',sub:'Pedidos de venda, PDV e orçamentos',href:'vendas.html',badge:'Vendas',keywords:'vendas orcamentos pedidos pdv nota clientes'},
          {title:'Compras e Coletas de Carcaças',sub:'Entradas de mercadoria, XML e coletas',href:'compras.html',badge:'Compras',keywords:'compras coletas carcacas fornecedores xml entrada'},
          {title:'Frota e Veículos',sub:'Controle de veículos, manutenção e viagens',href:'frota.html',badge:'Frota',keywords:'frota veiculos caminhoes manutencao combustivel'},
          {title:'Contatos — Clientes e Fornecedores',sub:'Cadastro de clientes, compradores e transportadoras',href:'clientes.html',badge:'Contatos',keywords:'clientes contatos fornecedores compradores vendedores transportadoras'},
          {title:'Produtos, Pneus e Estoque',sub:'Catálogo de produtos, serviços e ajuste de estoque',href:'produtos.html',badge:'Produtos',keywords:'produtos pneus servicos estoque preco catalogo'},
          {title:'Pix — Cobranças e Chaves',sub:'QR Code Pix, chaves e histórico',href:'pix.html',badge:'Pix',keywords:'pix qrcode chave cobranca'},
          {title:'Relatórios Gerenciais',sub:'Relatórios financeiros, vendas, estoque e DRE',href:'relatorios.html',badge:'Relatórios',keywords:'relatorios dre balanco vendas estoque financeiro'},
          {title:'Configurações e Usuários',sub:'Minha conta, usuários e permissões de acesso',href:'configuracoes.html',badge:'Config',keywords:'configuracoes usuarios permissoes senha conta avatar'}
        ];

        function esc(s){
          return String(s==null?'':s).replace(/[&<>"']/g,function(c){
            return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
          });
        }

        function filterCurrentPage(term){
          const q=String(term||'').trim();
          const nativeSelectors=[
            '#searchInput',
            '#productSearch',
            '#serviceSearch',
            '.client-search input',
            '.finance-toolbar input',
            '#searchUsersInput',
            '.collections-toolbar input'
          ];
          let matchedNative=false;
          nativeSelectors.forEach(function(sel){
            document.querySelectorAll(sel).forEach(function(inp){
              if(inp.offsetParent!==null||sel==='#searchInput'||sel==='#productSearch'){
                if(inp.value!==q){
                  inp.value=q;
                  inp.dispatchEvent(new Event('input',{bubbles:true}));
                  inp.dispatchEvent(new Event('keyup',{bubbles:true}));
                }
                matchedNative=true;
              }
            });
          });
          if(!matchedNative){
            const lower=q.toLowerCase();
            document.querySelectorAll('main table tbody tr').forEach(function(tr){
              if(tr.querySelector('td[colspan]'))return;
              const txt=(tr.textContent||'').toLowerCase();
              tr.style.display=(!lower||txt.includes(lower))?'':'none';
            });
          }
        }

        function collectGlobalResults(rawQuery){
          const q=String(rawQuery||'').trim().toLowerCase();
          const results=[];
          if(!q){
            MODULES.slice(0,6).forEach(function(m){
              results.push({type:'module',badge:m.badge,title:m.title,sub:m.sub,href:m.href,query:''});
            });
            return results;
          }
          MODULES.forEach(function(m){
            if((m.title+' '+m.sub+' '+m.keywords).toLowerCase().includes(q)){
              results.push({type:'module',badge:m.badge,title:m.title,sub:m.sub,href:m.href,query:''});
            }
          });
          try{
            const localProds=JSON.parse(localStorage.getItem('localProducts')||'[]');
            const impProds=(window.cloneData&&window.cloneData.products)||window.importedProducts||[];
            const seenP=new Set();
            [...localProds,...impProds].forEach(function(p){
              if(results.length>=18)return;
              const name=String(p.name||p.nome||'').trim();
              const code=String(p.code||p.codigo||'').trim();
              if(!name||seenP.has(code+'|'+name))return;
              const hay=(code+' '+name+' '+(p.category||p.categoria||'')).toLowerCase();
              if(hay.includes(q)){
                seenP.add(code+'|'+name);
                const price=Number(p.price||p.preco||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
                const stock=p.stock!=null?p.stock:(p.estoque!=null?p.estoque:'-');
                results.push({
                  type:'product',
                  badge:'Produto',
                  title:(code?('#'+code+' — '):'')+name,
                  sub:'Venda: '+price+' · Estoque: '+stock,
                  href:'produtos.html',
                  query:name
                });
              }
            });
          }catch(e){}
          try{
            const localContacts=JSON.parse(localStorage.getItem('piremaxx_contatos')||'[]');
            const impContacts=(window.cloneData&&window.cloneData.contacts)||window.importedContacts||[];
            const seenC=new Set();
            [...localContacts,...impContacts].forEach(function(c){
              if(results.length>=24)return;
              const name=String(c.nome||c.name||c.fantasy||'').trim();
              if(!name||seenC.has(name.toLowerCase()))return;
              const doc=String(c.cpfCnpj||c.doc||c.cnpj||'').trim();
              const phone=String(c.telefone||c.phones||c. celular||'').trim();
              const hay=(name+' '+doc+' '+phone+' '+(c.email||'')).toLowerCase();
              if(hay.includes(q)){
                seenC.add(name.toLowerCase());
                results.push({
                  type:'contact',
                  badge:'Contato',
                  title:name,
                  sub:[doc,phone].filter(Boolean).join(' · ')||'Cadastro de contato',
                  href:'clientes.html',
                  query:name
                });
              }
            });
          }catch(e){}
          try{
            const localSales=JSON.parse(localStorage.getItem('localSales')||'[]');
            const impSales=(window.cloneData&&window.cloneData.sales)||window.importedSales||[];
            const delSales=new Set([
              ...JSON.parse(localStorage.getItem('deletedSaleCodes')||'[]'),
              ...JSON.parse(localStorage.getItem('deletedSalesCodes')||'[]')
            ].map(function(x){return String(x).trim()}));
            const seenS=new Set();
            [...localSales,...impSales].forEach(function(s){
              if(results.length>=30)return;
              const code=String(s.code||s.id||'').trim();
              if(code&&delSales.has(code))return;
              const client=String(s.client||s.cliente||'').trim();
              if(!client&&!code)return;
              const key=code+'|'+client;
              if(seenS.has(key))return;
              const hay=(code+' '+client+' '+(s.status||'')+' '+(s.total||'')).toLowerCase();
              if(hay.includes(q)){
                seenS.add(key);
                results.push({
                  type:'sale',
                  badge:'Venda',
                  title:(code?('Venda #'+code+' — '):'')+(client||'Cliente'),
                  sub:(s.date||s.data||'')+(s.total?(' · '+s.total):''),
                  href:'vendas.html',
                  query:code||client
                });
              }
            });
          }catch(e){}
          return results.slice(0,12);
        }

        function navigateSearchResult(item){
          if(!item)return;
          const targetPage=(item.href||'').split('#')[0].split('?')[0].toLowerCase();
          const currentPage=(location.pathname.split('/').pop()||'index.html').toLowerCase();
          if(item.query){
            try{sessionStorage.setItem('piremaxx_global_search',JSON.stringify({q:item.query,page:targetPage,ts:Date.now()}));}catch(e){}
          }
          if(targetPage===currentPage&&item.query){
            inputEl.value=item.query;
            clearBtn.hidden=!inputEl.value;
            filterCurrentPage(item.query);
            resultsBox.hidden=true;
            topbar.classList.remove('pwa-search-active');
            return;
          }
          location.href=item.href;
        }

        function renderResults(){
          const q=inputEl.value.trim();
          const items=collectGlobalResults(q);
          if(!items.length){
            resultsBox.innerHTML='<div class="topbar-search-head"><span>Busca Global Piremaxx</span><small>Enter para filtrar na tela</small></div><div class="topbar-search-empty">Nenhum resultado direto para "<b>'+esc(q)+'</b>". Pressione <b>Enter</b> para filtrar na página atual.</div>';
            resultsBox.hidden=false;
            return;
          }
          const headerTitle=q?('Resultados para "'+esc(q)+'"'):'Acesso Rápido aos Módulos';
          resultsBox.innerHTML='<div class="topbar-search-head"><span>'+headerTitle+'</span><small>ESC fecha</small></div>'+items.map(function(it,idx){
            return '<button type="button" class="topbar-search-item" data-idx="'+idx+'"><span class="topbar-search-badge '+esc(it.type)+'">'+esc(it.badge)+'</span><span class="topbar-search-text"><strong>'+esc(it.title)+'</strong><small>'+esc(it.sub)+'</small></span></button>';
          }).join('');
          resultsBox._items=items;
          resultsBox.hidden=false;
        }

        inputEl.addEventListener('focus',function(){
          topbar.classList.add('pwa-search-active');
          renderResults();
        });
        inputEl.addEventListener('input',function(){
          const val=inputEl.value;
          clearBtn.hidden=!val;
          filterCurrentPage(val);
          renderResults();
        });
        inputEl.addEventListener('keydown',function(ev){
          if(ev.key==='Escape'){
            resultsBox.hidden=true;
            topbar.classList.remove('pwa-search-active');
            inputEl.blur();
            return;
          }
          if(ev.key==='Enter'){
            ev.preventDefault();
            const q=inputEl.value.trim();
            filterCurrentPage(q);
            const items=resultsBox._items||[];
            if(q&&items.length===1){
              navigateSearchResult(items[0]);
            }else{
              resultsBox.hidden=true;
              topbar.classList.remove('pwa-search-active');
            }
          }
        });
        clearBtn.addEventListener('click',function(ev){
          ev.stopPropagation();
          inputEl.value='';
          clearBtn.hidden=true;
          filterCurrentPage('');
          renderResults();
          inputEl.focus();
        });
        submitBtn.addEventListener('click',function(ev){
          ev.stopPropagation();
          const q=inputEl.value.trim();
          if(!q){
            inputEl.focus();
            renderResults();
            return;
          }
          filterCurrentPage(q);
          const items=collectGlobalResults(q);
          if(items.length===1){
            navigateSearchResult(items[0]);
          }else{
            renderResults();
          }
        });
        resultsBox.addEventListener('click',function(ev){
          const btn=ev.target.closest('.topbar-search-item');
          if(!btn)return;
          ev.stopPropagation();
          const idx=Number(btn.dataset.idx);
          const item=(resultsBox._items||[])[idx];
          if(item)navigateSearchResult(item);
        });
        if(!document.body.dataset.topbarSearchOutsideBound){
          document.body.dataset.topbarSearchOutsideBound='1';
          document.addEventListener('click',function(e){
            if(!e.target.closest('.topbar .search, .products-topbar .products-search')){
              document.querySelectorAll('.topbar-search-results').forEach(function(b){b.hidden=true;});
              document.querySelectorAll('.topbar.pwa-search-active, .products-topbar.pwa-search-active').forEach(function(t){t.classList.remove('pwa-search-active');});
            }
          });
        }
        try{
          const pending=JSON.parse(sessionStorage.getItem('piremaxx_global_search')||'null');
          const curPage=(location.pathname.split('/').pop()||'index.html').toLowerCase();
          if(pending&&pending.q&&(!pending.page||pending.page===curPage)&&(Date.now()-(pending.ts||0)<15000)){
            sessionStorage.removeItem('piremaxx_global_search');
            setTimeout(function(){
              inputEl.value=pending.q;
              clearBtn.hidden=false;
              filterCurrentPage(pending.q);
            },120);
          }
        }catch(e){}
      }
    }
    const userEl=topbar.querySelector('.user, .products-user');
    if(userEl){
      const AVATAR_PRESETS={
        default:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%23ffffff'/%3E%3Cpath d='M12 64 C13 48 21 43 32 43 C43 43 51 48 52 64 Z' fill='%231e293b'/%3E%3Cpolygon points='26,43 32,57 38,43' fill='%23e2e8f0'/%3E%3Cpolygon points='30,45 32,43 34,45 33,58 32,60 31,58' fill='%2338bdf8'/%3E%3Crect x='28' y='35' width='8' height='10' rx='3' fill='%23e0ac8b'/%3E%3Cpath d='M21 24 C21 16 25 12 32 12 C39 12 43 16 43 24 C43 32 38 38 32 38 C26 38 21 32 21 24 Z' fill='%23eab898'/%3E%3Cpath d='M20 23 C20 14 25 10 32 10 C39 10 44 14 44 22 C42 18 39 16 33 16 C26 16 22 18 20 23 Z' fill='%231e1b18'/%3E%3C/svg%3E",
        navy:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%23e8f0fe'/%3E%3Cpath d='M11 64 C12 47 20 42 32 42 C44 42 52 47 53 64 Z' fill='%2317366f'/%3E%3Cpolygon points='26,42 32,56 38,42' fill='%23ffffff'/%3E%3Cpolygon points='30,44 32,42 34,44 33,57 32,59 31,57' fill='%23e11d48'/%3E%3Crect x='28' y='34' width='8' height='10' rx='3' fill='%23c68b67'/%3E%3Cpath d='M21 24 C21 16 25 12 32 12 C39 12 43 16 43 24 C43 32 38 38 32 38 C26 38 21 32 21 24 Z' fill='%23d49b78'/%3E%3Cpath d='M20 22 C20 13 25 9 32 9 C39 9 44 13 44 22 C41 17 37 15 32 15 C27 15 23 17 20 22 Z' fill='%23111827'/%3E%3C/svg%3E",
        female:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%23f0f5ff'/%3E%3Cpath d='M17 26 C17 14 23 9 32 9 C41 9 47 14 47 26 C47 36 45 43 42 46 L22 46 C19 43 17 36 17 26 Z' fill='%23292524'/%3E%3Cpath d='M12 64 C13 48 21 43 32 43 C43 43 51 48 52 64 Z' fill='%231e3a8a'/%3E%3Cpolygon points='25,43 32,55 39,43' fill='%23f8fafc'/%3E%3Crect x='28' y='35' width='8' height='9' rx='3' fill='%23e5b293'/%3E%3Cpath d='M22 25 C22 17 26 13 32 13 C38 13 42 17 42 25 C42 32 38 38 32 38 C26 38 22 32 22 25 Z' fill='%23f1c4a7'/%3E%3Cpath d='M20 24 C21 15 26 11 33 11 C39 11 43 15 44 23 C40 18 35 17 29 18 C25 19 22 21 20 24 Z' fill='%23292524'/%3E%3C/svg%3E"
      };
      function getCurrentUserKey(){
        try{
          const s=JSON.parse(localStorage.getItem('piremaxx_sessao')||'null');
          if(s&&s.login)return String(s.login).toLowerCase().trim();
        }catch(e){}
        return 'odiman';
      }
      function getSavedAvatar(){
        const key=getCurrentUserKey();
        try{
          const map=JSON.parse(localStorage.getItem('piremaxx_avatares')||'{}');
          if(map&&map[key])return map[key];
        }catch(e){}
        try{
          const s=JSON.parse(localStorage.getItem('piremaxx_sessao')||'null');
          if(s&&s.avatar)return s.avatar;
        }catch(e){}
        try{
          const list=JSON.parse(localStorage.getItem('piremaxx_usuarios')||'[]');
          const hit=Array.isArray(list)&&list.find(function(u){return String(u.login||'').toLowerCase()===key;});
          if(hit&&hit.avatar)return hit.avatar;
        }catch(e){}
        return '';
      }
      function applyAvatarEverywhere(){
        const customUrl=getSavedAvatar();
        const resolvedUrl=customUrl||AVATAR_PRESETS.default;
        document.querySelectorAll('.topbar .user-avatar, .products-topbar .user-avatar, .user-menu .user-menu-head-avatar').forEach(function(el){
          el.style.setProperty('background-image','url("'+resolvedUrl+'")','important');
          el.style.setProperty('background-position','center center','important');
          el.style.setProperty('background-repeat','no-repeat','important');
          el.style.setProperty('background-size','cover','important');
        });
        document.querySelectorAll('.user-menu .avatar-preset-btn, #accountModal .avatar-preset-btn').forEach(function(btn){
          const pKey=btn.dataset.avatarPreset;
          const pUrl=AVATAR_PRESETS[pKey]||'';
          const isActive=(!customUrl&&pKey==='default')||(customUrl&&customUrl===pUrl);
          btn.classList.toggle('active',Boolean(isActive));
        });
        const accAvatar=document.getElementById('accAvatar');
        if(accAvatar){
          accAvatar.style.setProperty('background-image','url("'+resolvedUrl+'")','important');
          accAvatar.style.setProperty('background-position','center center','important');
          accAvatar.style.setProperty('background-repeat','no-repeat','important');
          accAvatar.style.setProperty('background-size','cover','important');
          accAvatar.style.setProperty('color','transparent','important');
          accAvatar.style.setProperty('font-size','0','important');
        }
      }
      function saveAvatar(dataUrl){
        const key=getCurrentUserKey();
        try{
          const map=JSON.parse(localStorage.getItem('piremaxx_avatares')||'{}');
          if(dataUrl)map[key]=dataUrl;
          else delete map[key];
          localStorage.setItem('piremaxx_avatares',JSON.stringify(map));
        }catch(e){}
        try{
          const s=JSON.parse(localStorage.getItem('piremaxx_sessao')||'null');
          if(s){
            s.avatar=dataUrl||'';
            localStorage.setItem('piremaxx_sessao',JSON.stringify(s));
          }
        }catch(e){}
        try{
          const list=JSON.parse(localStorage.getItem('piremaxx_usuarios')||'[]');
          if(Array.isArray(list)){
            const idx=list.findIndex(function(u){return String(u.login||'').toLowerCase()===key;});
            if(idx>=0){
              list[idx].avatar=dataUrl||'';
              localStorage.setItem('piremaxx_usuarios',JSON.stringify(list));
            }
          }
        }catch(e){}
        window.applyAvatarEverywhere = applyAvatarEverywhere;
      applyAvatarEverywhere();
      }
      function processAvatarFile(file,onDone){
        if(!file||!file.type||!file.type.startsWith('image/'))return;
        const reader=new FileReader();
        reader.onload=function(ev){
          const img=new Image();
          img.onload=function(){
            const canvas=document.createElement('canvas');
            const size=180;
            canvas.width=size;
            canvas.height=size;
            const ctx=canvas.getContext('2d');
            ctx.fillStyle='#ffffff';
            ctx.fillRect(0,0,size,size);
            const sSize=Math.min(img.width,img.height);
            const sx=(img.width-sSize)/2;
            const sy=(img.height-sSize)/2;
            ctx.drawImage(img,sx,sy,sSize,sSize,0,0,size,size);
            const out=canvas.toDataURL('image/jpeg',0.88);
            saveAvatar(out);
            if(typeof onDone==='function')onDone(out);
          };
          img.src=ev.target.result;
        };
        reader.readAsDataURL(file);
      }
      window.piremaxxAvatar={
        presets:AVATAR_PRESETS,
        get:getSavedAvatar,
        set:saveAvatar,
        processFile:processAvatarFile,
        applyEverywhere:applyAvatarEverywhere
      };

      let sess=null;
      try{sess=JSON.parse(localStorage.getItem('piremaxx_sessao')||'null')}catch(e){}
      const displayName=(sess&&sess.nome)?String(sess.nome).toUpperCase():'ODIMAN COSTA';
      const roleLabel=(sess&&sess.perfil==='vendedor')?'Vendedor':(sess&&sess.perfil==='financeiro')?'Financeiro':'Administrador';
      userEl.classList.add('user');
      if(!userEl.querySelector('.user-menu')){
        userEl.innerHTML='<span class="user-avatar" aria-hidden="true"></span><span class="user-info"><b>'+displayName+'</b><small>DNFX - COMERCIO DE PNEUS</small></span><div class="user-menu"><div class="user-menu-head"><button type="button" class="user-menu-head-avatar" title="Clique para carregar foto do perfil" aria-label="Carregar foto do perfil"><span class="user-menu-cam-badge" aria-hidden="true"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></span></button><div class="user-menu-head-text"><strong>'+displayName+'</strong><span>'+roleLabel+' · Piremaxx</span></div></div><div class="user-menu-avatar-section"><input type="file" accept="image/*" class="user-avatar-file-input" hidden><button type="button" class="user-menu-upload-btn"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg><span>Carregar foto do perfil</span></button><div class="user-menu-presets-row"><span class="user-menu-presets-label">Avatar:</span><button type="button" class="avatar-preset-btn" data-avatar-preset="default" title="Avatar Executivo 1" style="background-image:url(&quot;'+AVATAR_PRESETS.default+'&quot;)"></button><button type="button" class="avatar-preset-btn" data-avatar-preset="navy" title="Avatar Executivo 2" style="background-image:url(&quot;'+AVATAR_PRESETS.navy+'&quot;)"></button><button type="button" class="avatar-preset-btn" data-avatar-preset="female" title="Avatar Executiva" style="background-image:url(&quot;'+AVATAR_PRESETS.female+'&quot;)"></button><button type="button" class="avatar-reset-btn" title="Restaurar avatar padrão">Padrão</button></div></div><a href="configuracoes.html#conta"><span class="user-menu-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>Minha conta</a><a href="configuracoes.html"><span class="user-menu-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>Usuários e Permissões</a><a href="configuracoes.html#novo"><span class="user-menu-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg></span>Novo usuário</a><a href="configuracoes.html"><span class="user-menu-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>Configurações</a><a href="#" data-action="open-backup-modal"><span class="user-menu-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg></span>💾 Backup e Restauração</a><a href="login.html" data-logout-link="1"><span class="user-menu-ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>Sair / Trocar usuário</a></div>';
        const menu=userEl.querySelector('.user-menu');
        const fileInput=menu.querySelector('.user-avatar-file-input');
        fileInput.addEventListener('click',function(ev){ev.stopPropagation();});
        fileInput.addEventListener('change',function(){
          if(this.files&&this.files[0]){
            processAvatarFile(this.files[0]);
            this.value='';
          }
        });
        userEl.addEventListener('click',function(event){
          const backupLink=event.target.closest('a[data-action="open-backup-modal"]');
          if(backupLink){
            event.preventDefault();
            event.stopPropagation();
            menu.classList.remove('open');
            if(typeof window.openBackupModal==='function')window.openBackupModal();
            return;
          }
          const logoutLink=event.target.closest('a[data-logout-link]');
          if(logoutLink){
            // Antes de sair, lembra o usuário de fazer o backup (auth-guard.js)
            if(typeof window.piremaxxRequestLogout==='function'){
              event.preventDefault();
              event.stopPropagation();
              menu.classList.remove('open');
              window.piremaxxRequestLogout();
              return;
            }
            localStorage.removeItem('piremaxx_sessao');return;
          }
          if(event.target.closest('.user-menu-upload-btn, .user-menu-head-avatar')){
            event.stopPropagation();
            fileInput.click();
            return;
          }
          const presetBtn=event.target.closest('.avatar-preset-btn');
          if(presetBtn){
            event.stopPropagation();
            const pKey=presetBtn.dataset.avatarPreset;
            saveAvatar(pKey==='default'?'':(AVATAR_PRESETS[pKey]||''));
            return;
          }
          if(event.target.closest('.avatar-reset-btn')){
            event.stopPropagation();
            saveAvatar('');
            return;
          }
          if(event.target.closest('a'))return;
          if(event.target.closest('.user-menu'))return;
          menu.classList.toggle('open');
        });
        if(!document.body.dataset.userMenuOutsideBound){
          document.body.dataset.userMenuOutsideBound='1';
          document.addEventListener('click',function(e){
            if(!e.target.closest('.user, .products-user')){
              document.querySelectorAll('.user-menu.open').forEach(function(m){m.classList.remove('open');});
            }
          });
        }
      }else if(!userEl.querySelector('.user-avatar')){
        const avatar=document.createElement('span');
        avatar.className='user-avatar';
        userEl.insertBefore(avatar,userEl.firstChild);
      }
      window.applyAvatarEverywhere = applyAvatarEverywhere;
      applyAvatarEverywhere();
    }
  }
  function isCurrentUserAdmin(){
    let sess=null;
    try{sess=JSON.parse(localStorage.getItem('piremaxx_sessao')||'null')}catch(e){}
    if(!sess)return true;
    const p=String(sess.perfil||'').toLowerCase().trim();
    const l=String(sess.permissaoLabel||'').toLowerCase().trim();
    const n=String(sess.nome||'').toLowerCase().trim();
    if(p==='admin'||p.includes('admin')||p.includes('administrador')||p.includes('diretor'))return true;
    if(l.includes('completo')||l.includes('total')||l.includes('admin')||l.includes('administrador'))return true;
    if(n.includes('odiman')||n.includes('admin'))return true;
    if(!sess.permissoes||Object.keys(sess.permissoes).length===0)return true;
    return false;
  }
  function ensureBackupLinkInNav(){
    const nav=sidebar.querySelector('nav')||document.querySelector('aside.sidebar nav');
    if(!nav)return;
    let a=nav.querySelector('[data-menu-key="backup"]');
    if(!a){
      a=document.createElement('a');
      a.href='#';
      a.dataset.menuKey='backup';
      a.id='menuBtnBackup';
      a.className='admin-only-feature';
      a.innerHTML='<span style="display:inline-block;width:16px;margin-right:8px;text-align:center;font-size:14px;line-height:1;">💾</span><b>Backup / Dados</b>';
      a.onclick=function(e){
        e.preventDefault();
        e.stopPropagation();
        if(typeof window.openBackupModal==='function')window.openBackupModal();
      };
      const sup=nav.querySelector('[data-menu-key="suporte"]')||nav.lastElementChild;
      if(sup)nav.insertBefore(a,sup);
      else nav.appendChild(a);
    }
    const isAdmin=isCurrentUserAdmin();
    a.style.setProperty('display',isAdmin?'flex':'none','important');
  }
  function applySessionPermissions(){
    ensureBackupLinkInNav();
    let sess=null;
    try{sess=JSON.parse(localStorage.getItem('piremaxx_sessao')||'null')}catch(e){}
    if(!sess||sess.perfil==='admin'||!sess.permissoes)return;
    const perms=sess.permissoes;
    sidebar.querySelectorAll('nav a[data-menu-key]').forEach(function(a){
      const key=a.dataset.menuKey;
      if(key&&key!=='backup'&&Object.prototype.hasOwnProperty.call(perms,key)&&perms[key]===false){
        a.style.setProperty('display','none','important');
      }else if(key!=='backup'){
        a.style.removeProperty('display');
      }
    });
  }
  function render(){
    if(sidebar.dataset.rendered!=='1'||!sidebar.querySelector('[data-menu-key="frota"]')){
      sidebar.innerHTML='<div class="brand"><strong>egestor<span>+</span></strong><small>Plano profissional</small></div><nav>'+items.map(x=>'<a class="'+x[4]+' '+(x[0]===active?'active':'')+'" href="'+x[2]+'" data-menu-key="'+x[0]+'"'+(x[0]===active?' aria-current="page"':'')+'><img src="public/icons/'+x[3]+'" alt=""><b>'+x[1]+'</b></a>').join('')+'<a href="#" data-menu-key="backup" class="admin-only-feature"><span>💾</span><b>Backup / Dados</b></a><a href="#" data-menu-key="suporte"><span>❔</span><b>Suporte online</b></a></nav>';
      sidebar.dataset.rendered='1';
    }else{
      sidebar.querySelectorAll('nav a[data-menu-key]').forEach(function(a){
        a.classList.toggle('active',a.dataset.menuKey===active);
        if(a.dataset.menuKey==='pix'&&a.getAttribute('href')==='#')a.setAttribute('href','pix.html');
        if(a.dataset.menuKey==='home'){const b=a.querySelector('b');if(b)b.textContent='Indicadores';}
      });
    }
    ensureBackupLinkInNav();
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
    style.textContent='@media (min-width:769px){.shared-sidebar{width:143px!important;min-width:143px!important;min-height:calc(100vh - 49px)!important;position:fixed!important;left:0!important;top:49px!important;z-index:90!important}.shared-sidebar .brand{display:none!important}.shared-sidebar nav a{height:31px!important;min-height:31px!important;display:flex!important;align-items:center!important;padding:9px 13px!important;color:#fff!important;text-decoration:none!important;font-size:12px!important}body:has(.shared-sidebar) main{margin-left:143px!important;width:calc(100% - 143px)!important}}.shared-sidebar nav a>img{width:16px!important;height:16px!important;max-width:16px!important;max-height:16px!important;object-fit:contain!important;margin-right:8px!important}.shared-sidebar nav a>span{width:16px!important;margin-right:8px!important;text-align:center!important}.shared-sidebar nav a b{margin-left:0!important}.shared-sidebar nav a.active,.shared-sidebar nav a[data-menu-key="pix"].active,.shared-sidebar nav a:hover{background:#263840!important;box-shadow:inset 4px 0 #26a7e8!important}';
    document.head.appendChild(style);
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',render);
  }
  window.addEventListener('resize',function(){
    applyBrandStyles();
    normalizeTopbar();
  });
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
          body .sidebar.shared-sidebar .brand,body .sidebar .brand{display:none!important;visibility:hidden!important;width:143px!important;height:0!important;min-height:0!important;background-image:none!important}
          body .topbar .brand-mini,body .products-topbar .brand-mini{display:block!important;width:185px!important;min-width:185px!important;height:49px!important;min-height:49px!important;background-image:url("public/images/TOPO1.png")!important;background-position:left center!important;background-repeat:no-repeat!important;background-size:178px auto!important;font-size:0!important;color:transparent!important}
          body .sidebar.shared-sidebar nav a,body .sidebar nav a{height:31px!important;min-height:31px!important;padding:9px 13px!important;font-size:12px!important;line-height:13px!important}
          body main{margin-left:143px!important;width:calc(100% - 143px)!important;padding-top:98px!important}
          body.pix-page main{padding-top:98px!important}
          body main>.topbar,body main>.products-topbar{position:fixed!important;left:0!important;top:0!important;width:100%!important;height:49px!important;min-height:49px!important;padding:0 10px!important;z-index:85!important;background-color:#0d315e!important;background-image:url("public/images/topo-textura-automotiva.svg?v=2")!important;background-position:center center!important;background-repeat:no-repeat!important;background-size:cover!important;display:flex!important;align-items:center!important;overflow:visible!important}
          body main>.titlebar,body main>.clients-title,body main>.purchase-header,body main>.dashboard-title,body main>.finance-title,body main>.fleet-title,body main>.products-title,body main>.reports-title,body main>.config-title,body.pix-page main>.pix-title{position:fixed!important;left:143px!important;top:49px!important;width:calc(100% - 143px)!important;height:49px!important;min-height:49px!important;z-index:80!important;background-color:#5e7d89!important;background-image:none!important;opacity:1!important}
          body .finance-form-overlay,body .transfer-form-overlay,body .recurrence-form-overlay,body .receipt-form-overlay,body .receipt-history-overlay,body .conciliation-upload-overlay,body .new-purchase,body .stock-adjust-modal,body .account-modal,body .user-modal-overlay{left:143px!important;top:49px!important;right:0!important;bottom:0!important;width:calc(100% - 143px)!important;height:calc(100vh - 49px)!important;z-index:82!important}
          body main>.sales-content:before{content:"";position:fixed;left:143px;top:98px;width:calc(100% - 143px);height:117px;background:#f2f3f4;z-index:33;pointer-events:none}
          body main>.sales-content>.tabs{position:fixed!important;left:143px!important;top:122px!important;width:calc(100% - 143px)!important;height:38px!important;z-index:34!important;background:#f2f3f4!important}
          body main>.sales-content>.toolbar{position:fixed!important;left:143px!important;top:160px!important;width:calc(100% - 143px)!important;height:55px!important;z-index:34!important;background:#f2f3f4!important}
        }
        body .topbar .user-menu,body .products-topbar .user-menu{display:none!important;position:absolute!important;right:0!important;top:52px!important;width:258px!important;background:#f1f5fd!important;color:#193b78!important;border:1px solid #c7d3e8!important;border-radius:12px!important;padding:6px!important;z-index:220!important;box-shadow:0 14px 32px rgba(16,46,103,.32),0 4px 10px rgba(23,54,111,.16)!important;text-align:left!important;overflow:hidden!important}
        body .topbar .user-menu.open,body .products-topbar .user-menu.open{display:block!important}
        body .topbar .user-menu .user-menu-head,body .products-topbar .user-menu .user-menu-head{background:linear-gradient(135deg,#17366f 0%,#102e67 100%)!important;color:#fff!important;padding:10px 12px!important;margin:-6px -6px 6px -6px!important;border-bottom:1px solid #2b4f8c!important;display:flex!important;flex-direction:row!important;align-items:center!important;gap:10px!important}
        body .topbar .user-menu .user-menu-head-avatar,body .products-topbar .user-menu .user-menu-head-avatar{position:relative!important;width:42px!important;height:42px!important;flex:0 0 42px!important;border-radius:50%!important;border:2px solid rgba(255,255,255,.85)!important;background-color:#fff!important;background-position:center center!important;background-repeat:no-repeat!important;background-size:cover!important;padding:0!important;cursor:pointer!important;box-shadow:0 2px 6px rgba(0,0,0,.28)!important}
        body .topbar .user-menu .user-menu-cam-badge,body .products-topbar .user-menu .user-menu-cam-badge{position:absolute!important;right:-2px!important;bottom:-2px!important;width:18px!important;height:18px!important;border-radius:50%!important;background:#08b8bb!important;color:#fff!important;border:1.5px solid #102e67!important;display:inline-flex!important;align-items:center!important;justify-content:center!important}
        body .topbar .user-menu .user-menu-head-text,body .products-topbar .user-menu .user-menu-head-text{display:flex!important;flex-direction:column!important;gap:2px!important;min-width:0!important}
        body .topbar .user-menu .user-menu-head strong,body .products-topbar .user-menu .user-menu-head strong{font-size:12.5px!important;font-weight:700!important;color:#fff!important;letter-spacing:.2px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
        body .topbar .user-menu .user-menu-head span,body .products-topbar .user-menu .user-menu-head span{font-size:10.5px!important;color:#bcd2f5!important;font-weight:500!important}
        body .topbar .user-menu .user-menu-avatar-section,body .products-topbar .user-menu .user-menu-avatar-section{background:#e5eefb!important;border:1px solid #cddbf0!important;border-radius:9px!important;padding:8px!important;margin-bottom:6px!important;display:flex!important;flex-direction:column!important;gap:7px!important}
        body .topbar .user-menu .user-menu-upload-btn,body .products-topbar .user-menu .user-menu-upload-btn{width:100%!important;height:30px!important;border:1px solid #2b549a!important;border-radius:7px!important;background:linear-gradient(135deg,#244d92 0%,#17366f 100%)!important;color:#fff!important;font-size:11.5px!important;font-weight:700!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;cursor:pointer!important;box-shadow:0 2px 5px rgba(23,54,111,.22)!important}
        body .topbar .user-menu .user-menu-upload-btn:hover,body .products-topbar .user-menu .user-menu-upload-btn:hover{filter:brightness(1.1)!important}
        body .topbar .user-menu .user-menu-presets-row,body .products-topbar .user-menu .user-menu-presets-row{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:5px!important}
        body .topbar .user-menu .user-menu-presets-label,body .products-topbar .user-menu .user-menu-presets-label{font-size:10.5px!important;font-weight:700!important;color:#35558a!important}
        body .topbar .user-menu .avatar-preset-btn,body .products-topbar .user-menu .avatar-preset-btn{width:26px!important;height:26px!important;flex:0 0 26px!important;border-radius:50%!important;border:2px solid #fff!important;background-color:#fff!important;background-position:center center!important;background-repeat:no-repeat!important;background-size:cover!important;padding:0!important;cursor:pointer!important;box-shadow:0 1px 3px rgba(16,46,103,.25)!important}
        body .topbar .user-menu .avatar-preset-btn.active,body .products-topbar .user-menu .avatar-preset-btn.active{border-color:#08b8bb!important;box-shadow:0 0 0 2px rgba(8,184,187,.32)!important}
        body .topbar .user-menu .avatar-reset-btn,body .products-topbar .user-menu .avatar-reset-btn{height:22px!important;padding:0 7px!important;border:1px solid #b9cbe6!important;border-radius:5px!important;background:#f8fbff!important;color:#2b4f8c!important;font-size:10px!important;font-weight:700!important;cursor:pointer!important}
        body .topbar .user-menu a,body .products-topbar .user-menu a{display:flex!important;align-items:center!important;gap:10px!important;color:#193b78!important;background:transparent!important;text-decoration:none!important;padding:8px 10px!important;border-bottom:0!important;border-radius:8px!important;font-size:12.5px!important;font-weight:600!important;transition:background .15s ease,color .15s ease!important}
        body .topbar .user-menu a .user-menu-ico,body .products-topbar .user-menu a .user-menu-ico{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:26px!important;height:26px!important;flex:0 0 26px!important;border-radius:7px!important;background:#e1ebf9!important;color:#1e468a!important}
        body .topbar .user-menu a:hover,body .products-topbar .user-menu a:hover{background:#dce7f9!important;color:#102e67!important}
        body .topbar .user-menu a:hover .user-menu-ico,body .products-topbar .user-menu a:hover .user-menu-ico{background:#17366f!important;color:#fff!important}
        body .topbar .user-menu a[data-logout-link],body .products-topbar .user-menu a[data-logout-link]{margin-top:4px!important;padding-top:9px!important;border-top:1px solid #d5e0f2!important;border-radius:0 0 8px 8px!important;color:#b91c1c!important}
        body .topbar .user-menu a[data-logout-link] .user-menu-ico,body .products-topbar .user-menu a[data-logout-link] .user-menu-ico{background:#fee2e2!important;color:#dc2626!important}
        body .topbar .user-menu a[data-logout-link]:hover,body .products-topbar .user-menu a[data-logout-link]:hover{background:#fee2e2!important;color:#991b1b!important}
        body .topbar .user-menu a[data-logout-link]:hover .user-menu-ico,body .products-topbar .user-menu a[data-logout-link]:hover .user-menu-ico{background:#dc2626!important;color:#fff!important}
        body .client-tabs{display:flex!important;align-items:flex-start!important;height:38px!important;min-height:38px!important;border-bottom:1px solid #20a9a8!important;margin:0!important}
        body .client-tabs button{height:38px!important;min-height:38px!important;box-sizing:border-box!important;padding:10px 16px!important;margin:0 4px 0 0!important;font-size:12px!important;line-height:18px!important;border-radius:4px 4px 0 0!important}
        body .topbar .search,body .products-topbar .products-search{position:relative!important;overflow:visible!important;display:flex!important;align-items:center!important}
        body .topbar .search .topbar-search-input,body .products-topbar .products-search .topbar-search-input{flex:1 1 auto!important;width:100%!important;min-width:0!important;height:32px!important;border:0!important;outline:none!important;background:transparent!important;box-shadow:none!important;color:#17366f!important;font-size:12.5px!important;font-weight:500!important;padding:0 6px 0 0!important;margin:0!important}
        body .topbar .search .topbar-search-clear,body .products-topbar .products-search .topbar-search-clear{width:24px!important;min-width:24px!important;max-width:24px!important;height:24px!important;flex:0 0 24px!important;margin:0 4px 0 0!important;padding:0!important;border:0!important;border-radius:50%!important;background:#e2eaf7!important;color:#1e468a!important;font-size:15px!important;line-height:1!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important}
        body .topbar .search .topbar-search-clear[hidden],body .products-topbar .products-search .topbar-search-clear[hidden]{display:none!important}
        body .topbar .topbar-search-results,body .products-topbar .topbar-search-results{position:absolute!important;left:0!important;right:0!important;top:40px!important;background:#f1f5fd!important;border:1px solid #c7d3e8!important;border-radius:12px!important;box-shadow:0 16px 36px rgba(13,49,94,.34),0 4px 10px rgba(23,54,111,.18)!important;padding:6px!important;z-index:260!important;max-height:380px!important;overflow-y:auto!important;text-align:left!important}
        body .topbar .topbar-search-results[hidden],body .products-topbar .topbar-search-results[hidden]{display:none!important}
        body .topbar .topbar-search-head,body .products-topbar .topbar-search-head{display:flex!important;align-items:center!important;justify-content:space-between!important;padding:7px 10px!important;margin:-6px -6px 6px -6px!important;background:linear-gradient(135deg,#17366f 0%,#102e67 100%)!important;color:#fff!important;border-radius:11px 11px 0 0!important;font-size:11.5px!important;font-weight:700!important}
        body .topbar .topbar-search-head small,body .products-topbar .topbar-search-head small{color:#bcd2f5!important;font-size:10px!important;font-weight:500!important}
        body .topbar .topbar-search-item,body .products-topbar .topbar-search-item{width:100%!important;border:0!important;background:transparent!important;padding:8px 10px!important;border-radius:8px!important;display:flex!important;align-items:center!important;gap:10px!important;text-align:left!important;cursor:pointer!important;color:#193b78!important}
        body .topbar .topbar-search-item:hover,body .products-topbar .topbar-search-item:hover{background:#dce7f9!important}
        body .topbar .topbar-search-badge,body .products-topbar .topbar-search-badge{font-size:9.5px!important;font-weight:700!important;text-transform:uppercase!important;padding:3px 7px!important;border-radius:6px!important;background:#17366f!important;color:#fff!important;flex:0 0 auto!important;min-width:58px!important;text-align:center!important}
        body .topbar .topbar-search-badge.product,body .products-topbar .topbar-search-badge.product{background:#0891b2!important}
        body .topbar .topbar-search-badge.contact,body .products-topbar .topbar-search-badge.contact{background:#2563eb!important}
        body .topbar .topbar-search-badge.sale,body .products-topbar .topbar-search-badge.sale{background:#0d9488!important}
        body .topbar .topbar-search-text,body .products-topbar .topbar-search-text{display:flex!important;flex-direction:column!important;gap:2px!important;min-width:0!important;flex:1 1 auto!important}
        body .topbar .topbar-search-text strong,body .products-topbar .topbar-search-text strong{font-size:12px!important;color:#102e67!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
        body .topbar .topbar-search-text small,body .products-topbar .topbar-search-text small{font-size:10.5px!important;color:#4b6794!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
        body .topbar .topbar-search-empty,body .products-topbar .topbar-search-empty{padding:12px 10px!important;font-size:12px!important;color:#35558a!important;line-height:1.45!important}

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
            width:36px!important;
            height:36px!important;
            margin-right:4px!important;
            border:1px solid rgba(255,255,255,0.28)!important;
            border-radius:9px!important;
            background:rgba(255,255,255,0.14)!important;
            color:#fff!important;
            font-size:19px!important;
            cursor:pointer!important;
            flex:0 0 36px!important;
            box-shadow:0 2px 6px rgba(0,0,0,0.2)!important;
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

          /* Topbar mobile / PWA fixa e enxuta */
          html body main>.topbar,
          html body main>.products-topbar {
            position:sticky!important;
            top:0!important;
            left:0!important;
            width:100%!important;
            height:calc(54px + env(safe-area-inset-top, 0px))!important;
            min-height:calc(54px + env(safe-area-inset-top, 0px))!important;
            padding:env(safe-area-inset-top, 0px) 10px 0 10px!important;
            z-index:150!important;
            display:flex!important;
            align-items:center!important;
            gap:8px!important;
            background-color:#0d315e!important;
            background-image:url("public/images/topo-textura-automotiva.svg?v=2")!important;
            background-position:center center!important;
            background-repeat:no-repeat!important;
            background-size:cover!important;
            border-bottom:1px solid rgba(130,198,255,0.24)!important;
            box-shadow:0 4px 14px rgba(9,30,66,0.34)!important;
            overflow:visible!important;
          }
          html body main>.topbar .brand-mini,
          html body main>.products-topbar .brand-mini,
          html body .topbar .brand-mini,
          html body .products-topbar .brand-mini {
            width:96px!important;
            min-width:96px!important;
            max-width:96px!important;
            height:38px!important;
            min-height:38px!important;
            background-image:url("public/images/TOPO1.png")!important;
            background-position:left center!important;
            background-repeat:no-repeat!important;
            background-size:94px auto!important;
            flex:0 0 96px!important;
          }
          html body main>.topbar.pwa-search-active .brand-mini,
          html body main>.products-topbar.pwa-search-active .brand-mini,
          html body .topbar.pwa-search-active .brand-mini,
          html body .products-topbar.pwa-search-active .brand-mini {
            display:none!important;
          }
          html body main>.topbar .search,
          html body main>.products-topbar .products-search,
          html body main>.products-topbar .search,
          html body .topbar .search,
          html body .products-topbar .products-search {
            flex:1 1 0!important;
            width:auto!important;
            min-width:0!important;
            max-width:none!important;
            height:34px!important;
            margin:0!important;
            padding:0 0 0 10px!important;
            border-radius:18px!important;
            display:flex!important;
            align-items:center!important;
            justify-content:space-between!important;
            font-size:12px!important;
            overflow:visible!important;
            white-space:nowrap!important;
            position:relative!important;
          }
          html body main>.topbar .search button.topbar-search-btn,
          html body main>.products-topbar .products-search button.topbar-search-btn,
          html body main>.topbar .search>button:not(.topbar-search-clear),
          html body main>.products-topbar .products-search>button:not(.topbar-search-clear),
          html body .topbar .search button.topbar-search-btn,
          html body .products-topbar .products-search button.topbar-search-btn,
          html body .topbar .search>button:not(.topbar-search-clear),
          html body .products-topbar .products-search>button:not(.topbar-search-clear) {
            float:none!important;
            margin:0!important;
            width:34px!important;
            min-width:34px!important;
            max-width:34px!important;
            height:34px!important;
            flex:0 0 34px!important;
            border-radius:0 18px 18px 0!important;
            font-size:16px!important;
          }
          html body .topbar .topbar-search-results,
          html body .products-topbar .topbar-search-results {
            position:fixed!important;
            left:8px!important;
            right:8px!important;
            top:calc(56px + env(safe-area-inset-top, 0px))!important;
            width:auto!important;
            max-height:68vh!important;
            z-index:320!important;
          }
          html body main>.topbar .user,
          html body main>.products-topbar .products-user,
          html body main>.products-topbar .user,
          html body .topbar .user,
          html body .products-topbar .products-user {
            margin:0 0 0 auto!important;
            font-size:0!important;
            padding:0!important;
            width:38px!important;
            min-width:38px!important;
            max-width:38px!important;
            height:38px!important;
            flex:0 0 38px!important;
            display:flex!important;
            align-items:center!important;
            justify-content:center!important;
            white-space:nowrap!important;
            overflow:visible!important;
            position:relative!important;
            z-index:160!important;
          }
          html body main>.topbar .user .user-avatar,
          html body main>.products-topbar .user .user-avatar,
          html body .topbar .user .user-avatar,
          html body .products-topbar .user .user-avatar {
            width:34px!important;
            height:34px!important;
            flex:0 0 34px!important;
            margin:0!important;
            border:2px solid rgba(255,255,255,.9)!important;
          }
          html body main>.topbar .user:after,
          html body main>.products-topbar .user:after,
          html body .topbar .user:after,
          html body .products-topbar .user:after {
            display:none!important;
            content:none!important;
          }
          html body main>.topbar .user .user-info,
          html body main>.products-topbar .user .user-info,
          html body .topbar .user .user-info,
          html body .topbar .user small { display:none!important; }
          html body main>.topbar .user .user-menu,
          html body main>.products-topbar .user .user-menu,
          html body .topbar .user .user-menu,
          html body .products-topbar .user .user-menu {
            position:fixed!important;
            top:calc(54px + env(safe-area-inset-top, 0px))!important;
            right:8px!important;
            left:auto!important;
            width:min(272px, calc(100vw - 16px))!important;
            max-height:calc(100vh - 118px)!important;
            overflow-y:auto!important;
            z-index:9999!important;
          }

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
          html body main>.sales-content {
            padding:10px 10px calc(92px + env(safe-area-inset-bottom, 0px))!important;
            background:#e7edf9!important;
          }
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
          html body .sales-table-wrapper,
          html body .purchase-table-wrapper,
          html body .client-table-wrapper,
          html body .table-responsive,
          html body .clients,
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
          html body .sales-table-wrapper,
          html body .purchase-table-wrapper,
          html body .client-table-wrapper,
          html body .table-responsive {
            display:block!important;
            width:100%!important;
            box-sizing:border-box!important;
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
          html body .products-content,
          html body .fleet-content,
          html body .reports-content,
          html body .pix-content,
          html body .new-client,
          html body .buyer-page {
            padding:12px 10px calc(92px + env(safe-area-inset-bottom, 0px))!important;
            background:#e7edf9!important;
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
          html body .user-modal-overlay {
            left:0!important;
            top:0!important;
            width:100%!important;
            max-width:100vw!important;
            height:100vh!important;
            z-index:240!important;
          }
          html body #newSale,
          html body .new-sale,
          html body .return-wizard {
            position:relative!important;
            left:0!important;
            top:0!important;
            width:100%!important;
            max-width:100vw!important;
            height:auto!important;
            z-index:1!important;
            background:#e7edf9!important;
            padding:12px 12px calc(96px + env(safe-area-inset-bottom, 0px))!important;
            box-sizing:border-box!important;
          }
          html body #newSale .actions,
          html body .return-wizard .return-actions,
          html body .new-client .actions,
          html body .buyer-actions {
            position:relative!important;
            z-index:2!important;
            background:#f1f5fd!important;
            border:1px solid #c7d3e8!important;
            border-radius:8px!important;
            padding:12px!important;
            margin-top:16px!important;
            margin-bottom:8px!important;
            display:flex!important;
            flex-wrap:wrap!important;
            justify-content:flex-end!important;
            gap:8px!important;
            box-shadow:0 2px 8px rgba(23, 54, 111, 0.08)!important;
            box-sizing:border-box!important;
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

    if(sidebar){sidebar.style.setProperty('top','49px','important');sidebar.style.setProperty('left','0px','important');sidebar.style.setProperty('width','143px','important');sidebar.style.setProperty('min-width','143px','important');sidebar.style.setProperty('height','calc(100vh - 49px)','important');sidebar.style.setProperty('min-height','calc(100vh - 49px)','important');sidebar.style.setProperty('z-index','90','important');const brand=sidebar.querySelector('.brand');if(brand){brand.style.setProperty('display','none','important');}sidebar.querySelectorAll('nav a').forEach(a=>{a.style.setProperty('height','31px','important');a.style.setProperty('min-height','31px','important');a.style.setProperty('padding','9px 13px','important');a.style.setProperty('font-size','12px','important');});}
    if(main){main.style.setProperty('margin-left','143px','important');main.style.setProperty('width','calc(100% - 143px)','important');main.style.setProperty('padding-top','98px','important');}
    if(topbar){topbar.style.setProperty('position','fixed','important');topbar.style.setProperty('left','0','important');topbar.style.setProperty('top','0','important');topbar.style.setProperty('width','100%','important');topbar.style.setProperty('height','49px','important');topbar.style.setProperty('min-height','49px','important');topbar.style.setProperty('z-index','85','important');topbar.style.setProperty('background-color','#0d315e','important');topbar.style.setProperty('background-image',"url('public/images/topo-textura-automotiva.svg?v=2')",'important');topbar.style.setProperty('background-position','center center','important');topbar.style.setProperty('background-repeat','no-repeat','important');topbar.style.setProperty('background-size','cover','important');topbar.style.setProperty('overflow','visible','important');}
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

  function generatePiremaxxPdfKey(code){
    const num = String(code || '3300').replace(/\D/g, '') || '3300';
    return 'pmx.' + num.padStart(4, '0') + '.d8a4';
  }

  function findSaleDataForPdf(code, fallbackOpts){
    const codeStr = String(code || '').trim();
    let sale = null;
    try {
      const localSales = JSON.parse(localStorage.getItem('localSales') || '[]');
      sale = localSales.find(function(x){ return String(x.code) === codeStr; }) || null;
    } catch(_){}
    if(!sale && Array.isArray(window.importedSales)){
      sale = window.importedSales.find(function(x){ return String(x.code) === codeStr; }) || null;
    }
    if(sale) return sale;
    return {
      code: codeStr || '3300',
      type: (fallbackOpts && fallbackOpts.type) || 'Venda',
      client: (fallbackOpts && fallbackOpts.client) || 'Consumidor final',
      vendor: 'Diego Miranda',
      date: new Date().toISOString().slice(0, 10),
      total: 0,
      items: [{ name: (fallbackOpts && fallbackOpts.client) || 'Venda #' + codeStr, qty: 1, price: 0 }]
    };
  }

  function buildPiremaxxPdfUrl(code, opts){
    const codeStr = String(code || '3300').trim();
    const key = generatePiremaxxPdfKey(codeStr);
    const urlObj = new URL('venda-pdf.html', location.href);
    urlObj.searchParams.set('code', codeStr);
    urlObj.searchParams.set('key', key);
    try {
      const localSales = JSON.parse(localStorage.getItem('localSales') || '[]');
      const localRec = localSales.find(function(x){ return String(x.code) === codeStr; });
      if(localRec){
        const compact = {
          code: localRec.code,
          type: localRec.type || 'Venda',
          client: localRec.client || 'Consumidor final',
          vendor: localRec.vendor || 'Diego Miranda',
          date: localRec.date || '',
          total: Number(localRec.total || 0),
          items: Array.isArray(localRec.items) ? localRec.items.slice(0, 15).map(function(it){
            return { name: it.name || it.product || '', qty: Number(it.qty ?? it.quantity ?? 1), price: Number(it.price ?? it.unitPrice ?? 0) };
          }) : [],
          financial: Array.isArray(localRec.financial) ? localRec.financial.slice(0, 8) : (Array.isArray(localRec.parts) ? localRec.parts.slice(0, 8) : []),
          notes: String(localRec.notes || '').slice(0, 240)
        };
        const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(compact))));
        if(encoded.length <= 1200){
          urlObj.searchParams.set('d', encoded);
        }
      }
    } catch(_){}
    return urlObj.href;
  }

  async function generateSalePdfBlob(sale){
    const W = 1240, H = 1754;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    try {
      await new Promise(function(resolve){
        const bg = new Image();
        bg.crossOrigin = 'anonymous';
        bg.onload = function(){
          ctx.drawImage(bg, 0, 0, W, H);
          resolve();
        };
        bg.onerror = function(){ resolve(); };
        bg.src = 'public/papel-timbrado.jpg';
      });
    } catch(_){}

    const fmtMoney = function(v){
      return Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };
    const fmtDate = function(v){
      const s = String(v || '');
      return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s.split('-').reverse().join('/') : (s || new Date().toLocaleDateString('pt-BR'));
    };

    const code = String(sale.code || '3300');
    const docType = String(sale.type || 'Venda');
    const client = String(sale.client || 'Consumidor final');
    const vendor = String(sale.vendor || 'Diego Miranda');
    const saleDate = fmtDate(sale.date);
    const rawItems = Array.isArray(sale.items) && sale.items.length
      ? sale.items.map(function(it){
          return {
            name: String(it.name || it.product || 'Item'),
            qty: Number(it.qty ?? it.quantity ?? 1),
            price: Number(it.price ?? it.unitPrice ?? 0)
          };
        })
      : [{ name: client, qty: 1, price: Number(sale.total || 0) }];
    const totalVal = sale.total !== undefined
      ? Number(sale.total)
      : rawItems.reduce(function(acc, it){ return acc + (it.qty * it.price); }, 0);
    const finRows = (Array.isArray(sale.financial) && sale.financial.length)
      ? sale.financial
      : ((Array.isArray(sale.parts) && sale.parts.length) ? sale.parts : [{ value: totalVal, date: sale.date, method: 'Dinheiro', status: 'A receber' }]);

    const marginX = 92;
    const contentW = W - marginX * 2;
    let y = 370;

    ctx.fillStyle = '#1b2886';
    ctx.font = 'bold 34px Arial, sans-serif';
    ctx.fillText(docType.toUpperCase() + ' #' + code, marginX, y);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#243746';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText('Protocolo: ' + code, W - marginX, y - 24);
    ctx.font = '19px Arial, sans-serif';
    ctx.fillText('Tipo: ' + docType + '   |   Data: ' + saleDate, W - marginX, y + 4);
    ctx.textAlign = 'left';

    y += 22;
    ctx.strokeStyle = '#1b2886';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(marginX, y);
    ctx.lineTo(W - marginX, y);
    ctx.stroke();

    y += 42;
    ctx.fillStyle = '#1b2886';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText('DADOS DO CLIENTE', marginX, y);
    y += 10;
    ctx.fillStyle = '#f6f8fb';
    ctx.fillRect(marginX, y, contentW, 82);
    ctx.strokeStyle = '#d8dee1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(marginX, y, contentW, 82);

    ctx.fillStyle = '#243746';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText('Cliente: ', marginX + 18, y + 32);
    ctx.font = '20px Arial, sans-serif';
    ctx.fillText(client, marginX + 102, y + 32);
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText('Vendedor: ', marginX + 18, y + 64);
    ctx.font = '20px Arial, sans-serif';
    ctx.fillText(vendor, marginX + 125, y + 64);

    y += 122;
    ctx.fillStyle = '#1b2886';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText('ITENS DO PEDIDO (#' + code + ')', marginX, y);
    y += 14;

    const colPriceX = marginX + Math.round(contentW * 0.56);
    const colQtyX = marginX + Math.round(contentW * 0.75);
    const colTotX = marginX + contentW - 16;

    ctx.fillStyle = '#1b2886';
    ctx.fillRect(marginX, y, contentW, 44);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 19px Arial, sans-serif';
    ctx.fillText('Produto ou serviço', marginX + 16, y + 29);
    ctx.fillText('Preço unit.', colPriceX, y + 29);
    ctx.fillText('Qtd.', colQtyX, y + 29);
    ctx.textAlign = 'right';
    ctx.fillText('Total', colTotX, y + 29);
    ctx.textAlign = 'left';
    y += 44;

    rawItems.slice(0, 12).forEach(function(item, idx){
      ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f7f9fc';
      ctx.fillRect(marginX, y, contentW, 42);
      ctx.strokeStyle = '#d8dee1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(marginX, y + 42);
      ctx.lineTo(W - marginX, y + 42);
      ctx.stroke();

      ctx.fillStyle = '#243746';
      ctx.font = '19px Arial, sans-serif';
      const label = String(item.name || '').slice(0, 44);
      ctx.fillText(label, marginX + 16, y + 28);
      ctx.fillText(fmtMoney(item.price), colPriceX, y + 28);
      ctx.fillText(String(item.qty || 0), colQtyX, y + 28);
      ctx.textAlign = 'right';
      ctx.font = 'bold 19px Arial, sans-serif';
      ctx.fillText(fmtMoney((item.price || 0) * (item.qty || 0)), colTotX, y + 28);
      ctx.textAlign = 'left';
      y += 42;
    });

    y += 38;
    ctx.textAlign = 'right';
    ctx.fillStyle = '#1b2886';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillText('Total: ' + fmtMoney(totalVal), W - marginX, y);
    ctx.textAlign = 'left';

    y += 44;
    ctx.fillStyle = '#1b2886';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText('FINANCEIRO', marginX, y);
    y += 14;

    ctx.fillStyle = '#1b2886';
    ctx.fillRect(marginX, y, contentW, 42);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.fillText('Parcela', marginX + 16, y + 27);
    ctx.fillText('Valor', marginX + 170, y + 27);
    ctx.fillText('Vencimento', marginX + 380, y + 27);
    ctx.fillText('Forma de pagamento', marginX + 590, y + 27);
    ctx.fillText('Status', marginX + 870, y + 27);
    y += 42;

    finRows.slice(0, 6).forEach(function(p, idx){
      ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f7f9fc';
      ctx.fillRect(marginX, y, contentW, 40);
      ctx.strokeStyle = '#d8dee1';
      ctx.beginPath();
      ctx.moveTo(marginX, y + 40);
      ctx.lineTo(W - marginX, y + 40);
      ctx.stroke();

      const pVal = p.value !== undefined ? Number(p.value) : (totalVal / (finRows.length || 1));
      ctx.fillStyle = '#243746';
      ctx.font = '18px Arial, sans-serif';
      ctx.fillText((idx + 1) + '/' + finRows.length, marginX + 16, y + 26);
      ctx.fillText(fmtMoney(pVal), marginX + 170, y + 26);
      ctx.fillText(fmtDate(p.date || sale.date), marginX + 380, y + 26);
      ctx.fillText(String(p.method || 'Dinheiro'), marginX + 590, y + 26);
      ctx.fillText(String(p.status || 'A receber'), marginX + 870, y + 26);
      y += 40;
    });

    y += 38;
    ctx.fillStyle = '#587383';
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('Documento emitido por PIREMAXX PNEUS · Piremaxx Gestor', marginX, Math.min(y, H - 180));

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const base64 = dataUrl.split(',')[1];
    const binStr = atob(base64);
    const jpgBytes = new Uint8Array(binStr.length);
    for(let i = 0; i < binStr.length; i++) jpgBytes[i] = binStr.charCodeAt(i);

    const enc = new TextEncoder();
    const parts = [];
    const offsets = [];
    let byteLen = 0;
    function pushStr(str){
      const b = enc.encode(str);
      parts.push(b);
      byteLen += b.length;
    }
    function pushBytes(b){
      parts.push(b);
      byteLen += b.length;
    }

    pushStr('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n');
    offsets[1] = byteLen;
    pushStr('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    offsets[2] = byteLen;
    pushStr('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
    offsets[3] = byteLen;
    pushStr('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n');
    offsets[4] = byteLen;
    pushStr('4 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + W + ' /Height ' + H + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpgBytes.length + ' >>\nstream\n');
    pushBytes(jpgBytes);
    pushStr('\nendstream\nendobj\n');
    const contentStream = 'q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ\n';
    offsets[5] = byteLen;
    pushStr('5 0 obj\n<< /Length ' + contentStream.length + ' >>\nstream\n' + contentStream + 'endstream\nendobj\n');
    const xrefOffset = byteLen;
    pushStr('xref\n0 6\n0000000000 65535 f \n');
    for(let i = 1; i <= 5; i++){
      pushStr(String(offsets[i]).padStart(10, '0') + ' 00000 n \n');
    }
    pushStr('trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF');

    return new Blob(parts, { type: 'application/pdf' });
  }

  // Modal oficial "Envio via WhatsApp" com link Piremaxx Gestor e anexo/download PDF
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
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          background: #fff;
        }
        .wa-modal-pdf-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .wa-modal-main-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }
        .wa-btn-pdf {
          height: 34px;
          padding: 0 12px;
          border: 1px solid #1b2886;
          border-radius: 4px;
          background: #f0f4ff;
          color: #1b2886;
          font-size: 12.5px;
          font-weight: bold;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .wa-btn-pdf:hover { background: #e1e9ff; }
        .wa-btn-pdf:disabled { opacity: 0.65; cursor: wait; }
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
    const openPdfUrl = opts.pdfUrl || buildPiremaxxPdfUrl(code, opts);
    const displayUrl = opts.displayUrl || openPdfUrl;
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
Aqui é da empresa PIREMAXX PNEUS.

Estou enviando ${escHtml(docLabel)}. Para visualizar, basta clicar no link:
Piremaxx Gestor: <a href="${escHtml(openPdfUrl)}" target="_blank" rel="noopener">${escHtml(displayUrl)}</a>`}</div>
          <label class="wa-modal-label" for="waModalPhoneInput">Informe o número</label>
          <input id="waModalPhoneInput" type="tel" class="wa-modal-phone" value="${escHtml(initialPhone)}" autocomplete="off">
        </div>
        <div class="wa-modal-footer">
          <div class="wa-modal-pdf-actions">
            <button type="button" class="wa-btn-pdf wa-btn-download-pdf" title="Abrir e salvar o PDF padrão oficial desta venda">🖨️ Baixar / Imprimir PDF Oficial</button>
            <button type="button" class="wa-btn-pdf wa-btn-share-pdf" title="Visualizar documento oficial da venda no papel timbrado">👁️ Visualizar Documento</button>
          </div>
          <div class="wa-modal-main-actions">
            <button type="button" class="wa-btn-send">Enviar</button>
            <button type="button" class="wa-btn-back">Voltar</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    const phoneInput = overlay.querySelector('#waModalPhoneInput');
    const msgBox = overlay.querySelector('.wa-modal-msgbox');
    const btnDownloadPdf = overlay.querySelector('.wa-btn-download-pdf');
    const btnSharePdf = overlay.querySelector('.wa-btn-share-pdf');
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

    btnDownloadPdf.onclick = function(){
      try {
        const printUrl = new URL(openPdfUrl, location.href);
        printUrl.searchParams.set('print', '1');
        printUrl.searchParams.set('autoPrint', '1');
        const w = nativeWindowOpen.call(window, printUrl.href, '_blank');
        if(!w){
          location.href = printUrl.href;
        }
      } catch(e) {
        nativeWindowOpen.call(window, openPdfUrl, '_blank');
      }
    };

    btnSharePdf.onclick = function(){
      nativeWindowOpen.call(window, openPdfUrl, '_blank');
    };

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
    'deletedSalesCodes',
    'localProducts',
    'deletedProductCodes',
    'localServices',
    'deletedServiceCodes',
    'piremaxx_compras',
    'piremaxx_contas_receber',
    'piremaxx_contas_pagar',
    'localCashBalance',
    'localCashTransactions',
    'returnReceivableAdjustments',
    'piremaxx_usuarios',
    'piremaxx_avatares',
    'piremaxx_config_geral'
  ];

  const origSetItem = Storage.prototype.setItem.bind(localStorage);
  const origGetItem = Storage.prototype.getItem.bind(localStorage);

  // Época dos dados: quando as planilhas são reimportadas, os dados locais antigos
  // (clientes, fornecedores, produtos, vendas e derivados) são descartados uma única vez
  // neste navegador, para que o sistema passe a usar somente os dados novos.
  const DATA_EPOCH = 'planilhas-2026-11-09';
  try {
    if (origGetItem('piremaxx_data_epoch') !== DATA_EPOCH) {
      ['localSales','localReturns','returnReceivableAdjustments','deletedSaleCodes','deletedSalesCodes','deletedSales',
       'localProducts','deletedProductCodes','archivedProductCodes','localServices','deletedServiceCodes',
       'piremaxx_fornecedores','deletedContactCodes','piremaxx_contas_receber'].forEach(function(k){ localStorage.removeItem(k); });
      try {
        const keepContacts = JSON.parse(origGetItem('piremaxx_contatos') || '[]').filter(function(c){
          return !(Array.isArray(c.tipos) ? c.tipos : []).some(function(t){ return t === 'cliente' || t === 'fornecedor'; });
        });
        origSetItem('piremaxx_contatos', JSON.stringify(keepContacts));
      } catch (e) { localStorage.removeItem('piremaxx_contatos'); }
      origSetItem('piremaxx_data_epoch', DATA_EPOCH);
    }
  } catch (e) {}

  function extractReceivableSaleCode(r) {
    if (!r) return '';
    if (r.saleCode) return String(r.saleCode).trim();
    const desc = String(r.description || r.descricao || '');
    const m = desc.match(/(?:c[óo]digo|venda\s*#?)\s*(\d+)/i);
    return m ? String(m[1]).trim() : '';
  }

  function normalizePiremaxxDeletedSales() {
    try {
      const d1 = JSON.parse(origGetItem('deletedSaleCodes') || '[]');
      const d2 = JSON.parse(origGetItem('deletedSalesCodes') || '[]');
      const d3 = JSON.parse(origGetItem('deletedSales') || '[]');
      const delSet = new Set(
        [...(Array.isArray(d1) ? d1 : []), ...(Array.isArray(d2) ? d2 : []), ...(Array.isArray(d3) ? d3 : [])]
          .map(function(c) { return String(c || '').trim(); })
          .filter(Boolean)
      );

      let changed = (Array.isArray(d1) ? d1.length : 0) !== delSet.size || (Array.isArray(d2) ? d2.length : 0) !== delSet.size;

      // Caso o usuário tenha selecionado " todas " na Página 1 (100 linhas) e desmarcado apenas algumas vendas (ex.: 98 excluídas),
      // propaga a exclusão para as páginas anteriores do histórico importado para manter apenas os registros preservados pelo usuário.
      const imported = Array.isArray(window.importedSales) ? window.importedSales : ((window.cloneData && Array.isArray(window.cloneData.sales)) ? window.cloneData.sales : []);
      if (imported.length > 100 && delSet.size >= 50) {
        let localArr = [];
        try { localArr = JSON.parse(origGetItem('localSales') || '[]'); } catch (e) { localArr = []; }
        const orderedSalesCodes = [];
        const seenCodes = new Set();
        (Array.isArray(localArr) ? localArr : []).forEach(function(s) {
          const t = String(s.type || 'Venda').toLowerCase();
          if (t.includes('orçamento') || t.includes('orcamento') || t.includes('devolu')) return;
          const c = String(s.code || '').trim();
          if (c && !seenCodes.has(c)) { seenCodes.add(c); orderedSalesCodes.push(c); }
        });
        imported.forEach(function(s) {
          const t = String(s.type || 'Venda').toLowerCase();
          if (t.includes('orçamento') || t.includes('orcamento') || t.includes('devolu')) return;
          const c = String(s.code || '').trim();
          if (c && !seenCodes.has(c)) { seenCodes.add(c); orderedSalesCodes.push(c); }
        });

        const page1Codes = orderedSalesCodes.slice(0, 100);
        const restCodes = orderedSalesCodes.slice(100);
        const deletedInPage1 = page1Codes.filter(function(c) { return delSet.has(c); }).length;
        const deletedInRest = restCodes.filter(function(c) { return delSet.has(c); }).length;

        if (deletedInPage1 >= 80 && restCodes.length > 0 && deletedInRest < 10) {
          restCodes.forEach(function(c) {
            if (!delSet.has(c)) {
              delSet.add(c);
              changed = true;
            }
          });
        }
      }

      if (delSet.size > 0) {
        try {
          const localSales = JSON.parse(origGetItem('localSales') || '[]');
          if (Array.isArray(localSales)) {
            const filteredLocal = localSales.filter(function(s) { return !delSet.has(String(s.code || '').trim()); });
            if (filteredLocal.length !== localSales.length) {
              origSetItem('localSales', JSON.stringify(filteredLocal));
              changed = true;
            }
          }
        } catch (e) {}

        try {
          const recList = JSON.parse(origGetItem('piremaxx_contas_receber') || '[]');
          if (Array.isArray(recList) && recList.length) {
            const filteredRec = recList.filter(function(r) {
              const sc = extractReceivableSaleCode(r);
              return !sc || !delSet.has(sc);
            });
            if (filteredRec.length !== recList.length) {
              origSetItem('piremaxx_contas_receber', JSON.stringify(filteredRec));
              changed = true;
            }
          }
        } catch (e) {}
      }

      if (changed) {
        const arrStr = JSON.stringify(Array.from(delSet));
        origSetItem('deletedSaleCodes', arrStr);
        origSetItem('deletedSalesCodes', arrStr);
      }
      return delSet;
    } catch (e) {
      return new Set();
    }
  }

  window.normalizePiremaxxDeletedSales = normalizePiremaxxDeletedSales;
  window.extractReceivableSaleCode = extractReceivableSaleCode;

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
    if (key === 'deletedSaleCodes' || key === 'deletedSalesCodes') {
      payload['deletedSaleCodes'] = value;
      payload['deletedSalesCodes'] = value;
    }
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
    if (key === 'deletedSaleCodes') origSetItem('deletedSalesCodes', value);
    else if (key === 'deletedSalesCodes') origSetItem('deletedSaleCodes', value);
    if (this === localStorage && SYNC_KEYS.includes(key)) {
      pushKeyToServer(key, value);
    }
  };

  normalizePiremaxxDeletedSales();
  syncSupplierMirror();

  if (location.protocol !== 'file:' && !/financeiro(?:-pagamentos)?\.html$/i.test(location.pathname)) {
    fetch('/api/storage', { cache: 'no-store' })
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(serverDB) {
        if (!serverDB || typeof serverDB !== 'object') return;
        let updatedAny = false;
        const toPush = {};

        // 1. Consolida códigos de vendas excluídas entre navegador e servidor (união de conjuntos)
        try {
          const localDel = JSON.parse(origGetItem('deletedSaleCodes') || '[]');
          const srvDel1 = JSON.parse(serverDB['deletedSaleCodes'] || '[]');
          const srvDel2 = JSON.parse(serverDB['deletedSalesCodes'] || '[]');
          const mergedDel = new Set([
            ...(Array.isArray(localDel) ? localDel : []),
            ...(Array.isArray(srvDel1) ? srvDel1 : []),
            ...(Array.isArray(srvDel2) ? srvDel2 : [])
          ].map(function(x) { return String(x || '').trim(); }).filter(Boolean));
          if (mergedDel.size > 0) {
            const mergedStr = JSON.stringify(Array.from(mergedDel));
            if (origGetItem('deletedSaleCodes') !== mergedStr) {
              origSetItem('deletedSaleCodes', mergedStr);
              origSetItem('deletedSalesCodes', mergedStr);
              updatedAny = true;
            }
            if (serverDB['deletedSaleCodes'] !== mergedStr) {
              toPush['deletedSaleCodes'] = mergedStr;
              toPush['deletedSalesCodes'] = mergedStr;
            }
          }
        } catch (e) {}

        const activeDeletedSales = normalizePiremaxxDeletedSales();
        if (activeDeletedSales.size > 0) {
          const fullDelStr = JSON.stringify(Array.from(activeDeletedSales));
          if (serverDB['deletedSaleCodes'] !== fullDelStr) {
            toPush['deletedSaleCodes'] = fullDelStr;
            toPush['deletedSalesCodes'] = fullDelStr;
          }
        }

        SYNC_KEYS.forEach(function(k) {
          if (k === 'deletedSaleCodes' || k === 'deletedSalesCodes') return;
          const localVal = origGetItem(k);
          const serverVal = serverDB[k];
          if (k === 'localSales' && serverVal) {
            try {
              const srvSales = JSON.parse(serverVal || '[]');
              const locSales = JSON.parse(localVal || '[]');
              
              let maxCodeNum = 0;
              [...srvSales, ...locSales].forEach(function(s) {
                const n = Number(s.code);
                if (!isNaN(n) && n > maxCodeNum) maxCodeNum = n;
              });
              if (maxCodeNum < 3477) maxCodeNum = 3477;

              const map = new Map();
              (Array.isArray(srvSales) ? srvSales : []).forEach(function(s) {
                const c = String(s.code || '').trim();
                if (c && !activeDeletedSales.has(c)) map.set(c, s);
              });

              let localConflictCount = 0;
              (Array.isArray(locSales) ? locSales : []).forEach(function(s) {
                let c = String(s.code || '').trim();
                if (!c || activeDeletedSales.has(c)) return;

                const existing = map.get(c);
                if (existing) {
                  const isSame = String(existing.client || '').trim().toLowerCase() === String(s.client || '').trim().toLowerCase() &&
                                 Math.abs((Number(existing.total) || 0) - (Number(s.total) || 0)) < 0.05 &&
                                 String(existing.date || '').trim() === String(s.date || '').trim();
                  if (!isSame) {
                    maxCodeNum++;
                    const oldCode = c;
                    c = String(maxCodeNum);
                    s.code = c;
                    s.conflictReassignedFrom = oldCode;
                    localConflictCount++;
                    console.warn('[Sync] Conflito de protocolo resolvido: Venda #' + oldCode + ' de ' + s.client + ' renomeada para #' + c);
                  }
                } else if (s.isPendingSync || c.startsWith('OFF-') || c.startsWith('TMP-')) {
                  maxCodeNum++;
                  c = String(maxCodeNum);
                  s.code = c;
                  delete s.isPendingSync;
                  localConflictCount++;
                }
                map.set(c, s);
              });

              const finalSales = Array.from(map.values()).sort(function(a, b) {
                return (Number(b.code) || 0) - (Number(a.code) || 0);
              });
              const finalStr = JSON.stringify(finalSales);
              if (localVal !== finalStr) {
                origSetItem('localSales', finalStr);
                updatedAny = true;
              }
              if (serverVal !== finalStr || localConflictCount > 0) {
                toPush['localSales'] = finalStr;
              }
            } catch (e) {}
            return;
          }
          if (k === 'piremaxx_avatares') {
            try {
              const locMap = JSON.parse(localVal || '{}');
              const srvMap = JSON.parse(serverVal || '{}');
              const mergedMap = Object.assign({}, locMap, srvMap);
              const mergedStr = JSON.stringify(mergedMap);
              if (localVal !== mergedStr) {
                origSetItem('piremaxx_avatares', mergedStr);
                updatedAny = true;
                if (typeof window.applyAvatarEverywhere === 'function') {
                  window.applyAvatarEverywhere();
                }
              }
              if (serverVal !== mergedStr) {
                toPush['piremaxx_avatares'] = mergedStr;
              }
            } catch (e) {}
            return;
          }
          if (k === 'piremaxx_usuarios') {
            try {
              const locUsers = JSON.parse(localVal || '[]');
              const srvUsers = JSON.parse(serverVal || '[]');
              if (Array.isArray(srvUsers) && srvUsers.length) {
                const userMap = new Map();
                srvUsers.forEach(function(u) { if (u && u.login) userMap.set(String(u.login).toLowerCase(), u); });
                locUsers.forEach(function(u) {
                  if (u && u.login && !userMap.has(String(u.login).toLowerCase())) {
                    userMap.set(String(u.login).toLowerCase(), u);
                  }
                });
                const mergedUsers = Array.from(userMap.values());
                const mergedStr = JSON.stringify(mergedUsers);
                if (localVal !== mergedStr) {
                  origSetItem('piremaxx_usuarios', mergedStr);
                  updatedAny = true;
                }
                if (serverVal !== mergedStr) {
                  toPush['piremaxx_usuarios'] = mergedStr;
                }
              } else if (Array.isArray(locUsers) && locUsers.length && !serverVal) {
                toPush['piremaxx_usuarios'] = localVal;
              }
            } catch (e) {}
            return;
          }
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
        normalizePiremaxxDeletedSales();
        syncSupplierMirror();
        if (Object.keys(toPush).length) {
          fetch('/api/storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(toPush),
            keepalive: true
          }).catch(function(){});
        }
        if (updatedAny) {
          if (typeof window.renderContactsTable === 'function') {
            window.renderContactsTable();
          }
          if (typeof window.buildDashboard === 'function') {
            window.buildDashboard();
          }
          if (typeof window.reloadSalesFromStorage === 'function') {
            window.reloadSalesFromStorage();
          }
          if (typeof window.applyAvatarEverywhere === 'function') {
            window.applyAvatarEverywhere();
          }
        }
      })
      .catch(function(){});
  }
})();

// =========================================================================
// MODAL DE CONFIRMAÇÃO PERSONALIZADO (Substitui o window.confirm nativo)
// =========================================================================
(function(){
  function ensureConfirmStyles() {
    if (document.getElementById('piremaxx-confirm-styles')) return;
    const style = document.createElement('style');
    style.id = 'piremaxx-confirm-styles';
    style.textContent = `
      .pmx-confirm-overlay {
        position: fixed;
        inset: 0;
        z-index: 10050;
        background: rgba(15, 29, 58, 0.52);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        box-sizing: border-box;
        animation: pmxConfirmFadeIn 0.16s ease-out;
      }
      .pmx-confirm-card {
        width: min(440px, 94vw);
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid #d5e0f2;
        box-shadow: 0 20px 45px rgba(14, 30, 62, 0.28), 0 4px 12px rgba(14, 30, 62, 0.12);
        overflow: hidden;
        font-family: Arial, Helvetica, sans-serif;
        color: #243746;
        transform-origin: center;
        animation: pmxConfirmPopIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .pmx-confirm-header {
        background: linear-gradient(135deg, #17366f 0%, #224b94 100%);
        color: #ffffff;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .pmx-confirm-header-title {
        display: flex;
        align-items: center;
        gap: 9px;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 0.2px;
      }
      .pmx-confirm-header-badge {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.16);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .pmx-confirm-close {
        border: 0;
        background: rgba(255, 255, 255, 0.12);
        color: #ffffff;
        width: 26px;
        height: 26px;
        border-radius: 6px;
        font-size: 17px;
        line-height: 1;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s ease;
      }
      .pmx-confirm-close:hover {
        background: rgba(255, 255, 255, 0.25);
      }
      .pmx-confirm-body {
        padding: 22px 22px 18px;
        display: flex;
        align-items: flex-start;
        gap: 15px;
      }
      .pmx-confirm-icon {
        flex: 0 0 46px;
        width: 46px;
        height: 46px;
        border-radius: 12px;
        background: #fff1f2;
        border: 1px solid #fecdd3;
        color: #e11d48;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .pmx-confirm-content {
        flex: 1;
        min-width: 0;
      }
      .pmx-confirm-message {
        margin: 0 0 6px;
        font-size: 15px;
        font-weight: bold;
        color: #1e293b;
        line-height: 1.4;
      }
      .pmx-confirm-sub {
        margin: 0;
        font-size: 12px;
        color: #64748b;
        line-height: 1.45;
      }
      .pmx-confirm-footer {
        padding: 13px 20px 16px;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
      }
      .pmx-confirm-btn {
        height: 36px;
        padding: 0 18px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: transform 0.12s ease, box-shadow 0.15s ease, filter 0.15s ease;
      }
      .pmx-confirm-btn:active {
        transform: scale(0.97);
      }
      .pmx-confirm-cancel {
        background: #ffffff;
        color: #475569;
        border: 1px solid #cbd5e1;
      }
      .pmx-confirm-cancel:hover {
        background: #f1f5f9;
        color: #1e293b;
      }
      .pmx-confirm-ok {
        background: linear-gradient(135deg, #e53935 0%, #c62828 100%);
        color: #ffffff;
        border: 0;
        box-shadow: 0 4px 10px rgba(229, 57, 53, 0.3);
      }
      .pmx-confirm-ok:hover {
        filter: brightness(1.06);
        box-shadow: 0 6px 14px rgba(229, 57, 53, 0.38);
      }
      .pmx-confirm-ok:focus-visible, .pmx-confirm-cancel:focus-visible {
        outline: 2px solid #17366f;
        outline-offset: 2px;
      }
      @keyframes pmxConfirmFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes pmxConfirmPopIn {
        from { opacity: 0; transform: translateY(10px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  function piremaxxConfirm(message, onConfirmOrOptions) {
    ensureConfirmStyles();
    const existing = document.getElementById('piremaxxConfirmModal');
    if (existing) existing.remove();

    const opts = typeof onConfirmOrOptions === 'function'
      ? { onConfirm: onConfirmOrOptions }
      : (onConfirmOrOptions || {});

    const titleText = opts.title || 'Gestão Piremaxx — Confirmação';
    const subText = opts.subtitle || 'Esta ação removerá os registros selecionados e atualizará os indicadores do sistema.';
    const confirmLabel = opts.confirmText || 'Sim, excluir';
    const cancelLabel = opts.cancelText || 'Cancelar';

    return new Promise(function(resolve) {
      const overlay = document.createElement('div');
      overlay.id = 'piremaxxConfirmModal';
      overlay.className = 'pmx-confirm-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');

      overlay.innerHTML = `
        <div class="pmx-confirm-card">
          <header class="pmx-confirm-header">
            <div class="pmx-confirm-header-title">
              <span class="pmx-confirm-header-badge">⚠</span>
              <span></span>
            </div>
            <button type="button" class="pmx-confirm-close" aria-label="Fechar">×</button>
          </header>
          <div class="pmx-confirm-body">
            <div class="pmx-confirm-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                <path d="M10 11v6"></path>
                <path d="M14 11v6"></path>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
              </svg>
            </div>
            <div class="pmx-confirm-content">
              <p class="pmx-confirm-message"></p>
              <p class="pmx-confirm-sub"></p>
            </div>
          </div>
          <footer class="pmx-confirm-footer">
            <button type="button" class="pmx-confirm-btn pmx-confirm-cancel"></button>
            <button type="button" class="pmx-confirm-btn pmx-confirm-ok"></button>
          </footer>
        </div>
      `;

      overlay.querySelector('.pmx-confirm-header-title span:last-child').textContent = titleText;
      overlay.querySelector('.pmx-confirm-message').textContent = String(message || 'Deseja confirmar esta operação?');
      overlay.querySelector('.pmx-confirm-sub').textContent = subText;
      const btnCancel = overlay.querySelector('.pmx-confirm-cancel');
      const btnOk = overlay.querySelector('.pmx-confirm-ok');
      const btnClose = overlay.querySelector('.pmx-confirm-close');
      btnCancel.textContent = cancelLabel;
      btnOk.textContent = confirmLabel;

      let settled = false;
      function finish(result) {
        if (settled) return;
        settled = true;
        document.removeEventListener('keydown', onKey);
        overlay.remove();
        if (result && typeof opts.onConfirm === 'function') {
          opts.onConfirm();
        }
        resolve(result);
      }

      function onKey(e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          finish(false);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          finish(true);
        }
      }

      btnCancel.onclick = function() { finish(false); };
      btnClose.onclick = function() { finish(false); };
      btnOk.onclick = function() { finish(true); };
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) finish(false);
      });
      document.addEventListener('keydown', onKey);

      document.body.appendChild(overlay);
      setTimeout(function() { btnOk.focus(); }, 10);
    });
  }

  window.piremaxxConfirm = piremaxxConfirm;
  window.appConfirm = piremaxxConfirm;

  function piremaxxToast(message, options) {
    options = options || {};
    if (!document.getElementById('piremaxx-toast-styles')) {
      const st = document.createElement('style');
      st.id = 'piremaxx-toast-styles';
      st.textContent = `
        .pmx-save-toast {
          position: fixed;
          right: 22px;
          bottom: 22px;
          z-index: 10060;
          background: linear-gradient(135deg, #17366f 0%, #224b94 100%);
          color: #ffffff;
          padding: 12px 18px;
          border-radius: 10px;
          border-left: 4px solid #29a55d;
          box-shadow: 0 10px 26px rgba(14, 30, 62, 0.28);
          font: bold 13px/1.4 Arial, Helvetica, sans-serif;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: pmxConfirmPopIn 0.18s ease-out;
        }
        .pmx-save-toast-badge {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #29a55d;
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex: 0 0 22px;
        }
        .pmx-save-toast-action {
          margin-left: 6px;
          background: #2b9348;
          color: #fff;
          border: 0;
          border-radius: 6px;
          padding: 6px 10px;
          font: bold 12px Arial, Helvetica, sans-serif;
          cursor: pointer;
          white-space: nowrap;
        }
        .pmx-save-toast-action:hover { background: #237a3b; }
        @media (max-width: 768px) {
          .pmx-save-toast {
            left: 12px;
            right: 12px;
            bottom: calc(66px + env(safe-area-inset-bottom, 0px));
            flex-wrap: wrap;
          }
        }
      `;
      document.head.appendChild(st);
    }
    const oldToast = document.getElementById('piremaxxSaveToast');
    if (oldToast) oldToast.remove();
    const toast = document.createElement('div');
    toast.id = 'piremaxxSaveToast';
    toast.className = 'pmx-save-toast';
    toast.innerHTML = '<span class="pmx-save-toast-badge">✓</span><span></span>';
    toast.querySelector('span:last-child').textContent = String(message || ' Alterações salvas com sucesso.');
    if (options.actionLabel && typeof options.onAction === 'function') {
      const actionBtn = document.createElement('button');
      actionBtn.type = 'button';
      actionBtn.className = 'pmx-save-toast-action';
      actionBtn.textContent = options.actionLabel;
      actionBtn.onclick = function() {
        if (toast.parentNode) toast.remove();
        options.onAction();
      };
      toast.appendChild(actionBtn);
    }
    document.body.appendChild(toast);
    setTimeout(function() {
      if (toast.parentNode) toast.remove();
    }, options.duration || 3200);
  }

  window.piremaxxToast = piremaxxToast;
  if (typeof window.appMessage !== 'function') {
    window.appMessage = piremaxxToast;
  }
})();

// Envelopamento responsivo automático de tabelas no mobile para isolar a rolagem horizontal
(function(){
  function wrapMobileTables(){
    if(!window.matchMedia('(max-width: 768px)').matches) return;
    const tableSelectors = ['.sales-table', '.purchase-table', '.client-table'];
    tableSelectors.forEach(function(sel){
      const tables = document.querySelectorAll(sel);
      tables.forEach(function(table){
        if(!table || table.parentElement.classList.contains('table-responsive') || 
           table.parentElement.classList.contains('sales-table-wrapper') ||
           table.parentElement.classList.contains('purchase-table-wrapper') ||
           table.parentElement.classList.contains('client-table-wrapper')) {
          return;
        }
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive ' + sel.replace('.', '') + '-wrapper';
        wrapper.style.cssText = 'width:100%!important;max-width:100%!important;overflow-x:auto!important;-webkit-overflow-scrolling:touch!important;box-sizing:border-box!important;margin:0 0 12px 0!important;';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', wrapMobileTables);
  } else {
    wrapMobileTables();
  }
  window.addEventListener('resize', wrapMobileTables);
  setTimeout(wrapMobileTables, 150);
  setTimeout(wrapMobileTables, 600);
  setTimeout(wrapMobileTables, 1500);
})();

// =========================================================================
// SISTEMA DE BACKUP E RESTAURAÇÃO DE DADOS (CONTROLE TOTAL / ADMIN)
// =========================================================================
(function(){
  const BACKUP_STORAGE_KEYS = [
    'localSales',
    'piremaxx_contatos',
    'piremaxx_fornecedores',
    'deletedContactCodes',
    'localProducts',
    'deletedProductCodes',
    'localServices',
    'deletedServiceCodes',
    'piremaxx_compras',
    'piremaxx_contas_receber',
    'piremaxx_contas_pagar',
    'localCashBalance',
    'localCashTransactions',
    'returnReceivableAdjustments',
    'localReturns',
    'deletedSaleCodes',
    'deletedSalesCodes',
    'piremaxx_stock_ledger',
    'piremaxx_usuarios',
    'piremaxx_avatares',
    'piremaxx_config_geral'
  ];

  function ensureBackupModalStyles() {
    if (document.getElementById('piremaxx-backup-styles')) return;
    const style = document.createElement('style');
    style.id = 'piremaxx-backup-styles';
    style.textContent = `
      .pmx-backup-overlay {
        position: fixed; inset: 0; z-index: 10050;
        background: rgba(15, 29, 58, 0.6); backdrop-filter: blur(4px);
        display: flex; align-items: center; justify-content: center;
        padding: 16px; box-sizing: border-box; animation: pmxConfirmFadeIn 0.18s ease-out;
      }
      .pmx-backup-card {
        width: min(560px, 95vw); max-height: 90vh; overflow-y: auto;
        background: #fff; border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,0.32);
        display: flex; flex-direction: column; overflow: hidden;
      }
      .pmx-backup-head {
        background: #1e3a47; color: #fff; padding: 16px 20px;
        display: flex; align-items: center; justify-content: space-between;
      }
      .pmx-backup-head h3 { margin: 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
      .pmx-backup-close {
        background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; opacity: 0.8;
      }
      .pmx-backup-close:hover { opacity: 1; }
      .pmx-backup-tabs {
        display: flex; border-bottom: 1px solid #e1e7ea; background: #f4f7f9;
      }
      .pmx-backup-tab {
        flex: 1; padding: 12px 16px; border: none; background: none; font-size: 13px; font-weight: 600;
        color: #55707d; cursor: pointer; text-align: center; border-bottom: 2px solid transparent;
      }
      .pmx-backup-tab.active {
        color: #0b7285; border-bottom-color: #0b7285; background: #fff;
      }
      .pmx-backup-body { padding: 20px; font-size: 13px; color: #334e5b; }
      .pmx-backup-stats {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 10px; margin-bottom: 18px;
      }
      .pmx-backup-stat-box {
        background: #f8fafb; border: 1px solid #dde5e8; border-radius: 8px; padding: 10px; text-align: center;
      }
      .pmx-backup-stat-val { font-size: 18px; font-weight: bold; color: #1e3a47; }
      .pmx-backup-stat-lbl { font-size: 11px; color: #6a828e; margin-top: 2px; }
      .pmx-btn-primary {
        background: #0b7285; color: #fff; border: none; border-radius: 6px; padding: 11px 18px;
        font-size: 13px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%;
      }
      .pmx-btn-primary:hover { background: #085a69; }
      .pmx-backup-file-drop {
        border: 2px dashed #b5c7ce; border-radius: 8px; padding: 22px; text-align: center; background: #fafbfc;
        cursor: pointer; margin-bottom: 16px; transition: border-color 0.15s;
      }
      .pmx-backup-file-drop:hover { border-color: #0b7285; background: #f2f7f9; }
      .pmx-backup-options { margin: 14px 0; background: #fdfdfe; border: 1px solid #e2e8ea; border-radius: 8px; padding: 12px; }
      .pmx-backup-opt { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px; cursor: pointer; }
      .pmx-backup-opt:last-child { margin-bottom: 0; }
      .pmx-backup-opt input { margin-top: 3px; }
      .pmx-backup-opt div small { display: block; color: #6c8693; font-size: 11px; }
    `;
    document.head.appendChild(style);
  }

  function getBackupStats() {
    let salesCount = 0, contactsCount = 0, productsCount = 0, finCount = 0;
    try { salesCount = (JSON.parse(localStorage.getItem('localSales') || '[]')).length; } catch(e){}
    try { contactsCount = (JSON.parse(localStorage.getItem('piremaxx_contatos') || '[]')).length; } catch(e){}
    try { productsCount = (JSON.parse(localStorage.getItem('localProducts') || '[]')).length; } catch(e){}
    try { finCount = (JSON.parse(localStorage.getItem('piremaxx_contas_receber') || '[]')).length; } catch(e){}
    return { salesCount, contactsCount, productsCount, finCount };
  }

  function downloadBackupFile() {
    const backupData = {
      app: 'Piremaxx Gestor',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      timestamp: Date.now(),
      payload: {}
    };

    BACKUP_STORAGE_KEYS.forEach(k => {
      const val = localStorage.getItem(k);
      if (val !== null) backupData.payload[k] = val;
    });

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const dateStr = [now.getFullYear(), pad(now.getMonth()+1), pad(now.getDate())].join('-') + '_' + pad(now.getHours()) + pad(now.getMinutes());
    a.href = url;
    a.download = `backup-piremaxx-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
    try { localStorage.setItem('piremaxx_last_backup', String(Date.now())); } catch (e) {}

    if (typeof window.appMessage === 'function') {
      window.appMessage('Arquivo de backup baixado com sucesso!');
    }
  }
  window.piremaxxDownloadBackup = downloadBackupFile;

  function openBackupModal() {
    let sess = null;
    try { sess = JSON.parse(localStorage.getItem('piremaxx_sessao') || 'null'); } catch(e){}
    const isAdmin = !sess || sess.perfil === 'admin' || (sess.permissaoLabel && sess.permissaoLabel.toLowerCase().includes('completo'));
    if (!isAdmin) {
      if (typeof window.appMessage === 'function') {
        window.appMessage('Acesso restrito: Apenas administradores com controle total podem acessar o backup.');
      }
      return;
    }

    ensureBackupModalStyles();
    const old = document.getElementById('pmxBackupModal');
    if (old) old.remove();

    const stats = getBackupStats();
    const overlay = document.createElement('div');
    overlay.id = 'pmxBackupModal';
    overlay.className = 'pmx-backup-overlay';
    overlay.innerHTML = `
      <div class="pmx-backup-card">
        <div class="pmx-backup-head">
          <h3>💾 Backup e Restauração do Sistema</h3>
          <button type="button" class="pmx-backup-close" aria-label="Fechar">&times;</button>
        </div>
        <div class="pmx-backup-tabs">
          <button type="button" class="pmx-backup-tab active" data-tab="export">📥 Fazer Backup</button>
          <button type="button" class="pmx-backup-tab" data-tab="import">📤 Restaurar Dados</button>
        </div>
        <div class="pmx-backup-body">
          <div id="pmxTabExport">
            <p style="margin-top:0; color:#526f7d;">Baixe um arquivo seguro contendo todos os registros de vendas, contatos, compras, produtos, contas a receber e configurações para proteção contra perda de dados.</p>
            <div class="pmx-backup-stats">
              <div class="pmx-backup-stat-box"><div class="pmx-backup-stat-val">${stats.salesCount}</div><div class="pmx-backup-stat-lbl">Vendas salvas</div></div>
              <div class="pmx-backup-stat-box"><div class="pmx-backup-stat-val">${stats.contactsCount}</div><div class="pmx-backup-stat-lbl">Contatos</div></div>
              <div class="pmx-backup-stat-box"><div class="pmx-backup-stat-val">${stats.productsCount}</div><div class="pmx-backup-stat-lbl">Produtos</div></div>
              <div class="pmx-backup-stat-box"><div class="pmx-backup-stat-val">${stats.finCount}</div><div class="pmx-backup-stat-lbl">Recebimentos</div></div>
            </div>
            <button type="button" class="pmx-btn-primary" id="pmxBtnDownloadBackup">
              <span>💾</span> Baixar Arquivo de Backup Completo (.json)
            </button>
          </div>
          <div id="pmxTabImport" style="display:none;">
            <p style="margin-top:0; color:#526f7d;">Selecione um arquivo de backup previamente exportado (.json) para restaurar no sistema.</p>
            <input type="file" id="pmxBackupFileInput" accept=".json,application/json" style="display:none;">
            <div class="pmx-backup-file-drop" id="pmxDropZone">
              <div style="font-size:24px; margin-bottom:4px;">📁</div>
              <strong id="pmxFileLabel" style="color:#1e3a47;">Clique aqui para selecionar o arquivo de backup</strong>
              <small style="display:block; color:#859ba5; margin-top:4px;">Suporta arquivos .json gerados pelo Piremaxx</small>
            </div>
            <div id="pmxFileInfoBlock" style="display:none; background:#f0f7f9; border:1px solid #c2dbe3; border-radius:6px; padding:10px; margin-bottom:12px;"></div>
            <div class="pmx-backup-options">
              <label class="pmx-backup-opt">
                <input type="radio" name="pmxRestoreMode" value="merge" checked>
                <div>
                  <strong>Mesclagem Segura (Recomendado)</strong>
                  <small>Junta os dados do backup com o sistema atual. Vendas novas feitas na rua ou offline NÃO serão apagadas nem sobrescritas.</small>
                </div>
              </label>
              <label class="pmx-backup-opt">
                <input type="radio" name="pmxRestoreMode" value="full">
                <div>
                  <strong style="color:#b22a2a;">Substituição Completa</strong>
                  <small>Substitui integralmente o banco pelo backup. Use apenas em caso de restauração após perda total do aparelho.</small>
                </div>
              </label>
            </div>
            <button type="button" class="pmx-btn-primary" id="pmxBtnApplyRestore" disabled style="opacity:0.6; cursor:not-allowed;">
              <span>⚡</span> Restaurar Dados Agora
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.pmx-backup-close');
    closeBtn.onclick = () => overlay.remove();
    overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

    const tabBtns = overlay.querySelectorAll('.pmx-backup-tab');
    const tabExport = overlay.querySelector('#pmxTabExport');
    const tabImport = overlay.querySelector('#pmxTabImport');
    tabBtns.forEach(btn => {
      btn.onclick = () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const isExport = btn.dataset.tab === 'export';
        tabExport.style.display = isExport ? 'block' : 'none';
        tabImport.style.display = isExport ? 'none' : 'block';
      };
    });

    overlay.querySelector('#pmxBtnDownloadBackup').onclick = downloadBackupFile;

    const fileInput = overlay.querySelector('#pmxBackupFileInput');
    const dropZone = overlay.querySelector('#pmxDropZone');
    const fileLabel = overlay.querySelector('#pmxFileLabel');
    const infoBlock = overlay.querySelector('#pmxFileInfoBlock');
    const restoreBtn = overlay.querySelector('#pmxBtnApplyRestore');
    let parsedBackup = null;

    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = function() {
      if (!this.files || !this.files[0]) return;
      const file = this.files[0];
      fileLabel.textContent = file.name;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const json = JSON.parse(e.target.result);
          if (!json || typeof json !== 'object' || (!json.payload && !json.localSales)) {
            throw new Error('Arquivo de backup inválido ou incompatível.');
          }
          parsedBackup = json;
          const payload = json.payload || json;
          const sCount = payload.localSales ? JSON.parse(payload.localSales || '[]').length : 0;
          const cCount = payload.piremaxx_contatos ? JSON.parse(payload.piremaxx_contatos || '[]').length : 0;
          infoBlock.innerHTML = `
            <strong>Arquivo analisado com sucesso:</strong><br>
            • Data do arquivo: ${json.exportedAt ? new Date(json.exportedAt).toLocaleString('pt-BR') : 'Data não informada'}<br>
            • Conteúdo detectado: ${sCount} vendas, ${cCount} contatos.
          `;
          infoBlock.style.display = 'block';
          restoreBtn.disabled = false;
          restoreBtn.style.opacity = '1';
          restoreBtn.style.cursor = 'pointer';
        } catch(err) {
          alert('Erro ao ler arquivo de backup: ' + err.message);
          restoreBtn.disabled = true;
          restoreBtn.style.opacity = '0.6';
          restoreBtn.style.cursor = 'not-allowed';
        }
      };
      reader.readAsText(file);
    };

    restoreBtn.onclick = function() {
      if (!parsedBackup) return;
      const mode = overlay.querySelector('input[name="pmxRestoreMode"]:checked').value;
      if (mode === 'full') {
        const ok = confirm('ATENÇÃO: A substituição completa irá substituir todos os dados atuais do sistema pelo conteúdo do arquivo de backup.\n\nDeseja realmente continuar?');
        if (!ok) return;
      }

      const payload = parsedBackup.payload || parsedBackup;
      const toPushServer = {};

      if (mode === 'full') {
        BACKUP_STORAGE_KEYS.forEach(k => {
          if (payload[k] !== undefined) {
            localStorage.setItem(k, typeof payload[k] === 'string' ? payload[k] : JSON.stringify(payload[k]));
            toPushServer[k] = localStorage.getItem(k);
          }
        });
      } else {
        try {
          const curSales = JSON.parse(localStorage.getItem('localSales') || '[]');
          const bkpSales = JSON.parse(payload.localSales || '[]');
          let maxCode = 0;
          [...curSales, ...bkpSales].forEach(s => {
            const n = Number(s.code);
            if (!isNaN(n) && n > maxCode) maxCode = n;
          });
          const salesMap = new Map();
          (Array.isArray(bkpSales) ? bkpSales : []).forEach(s => {
            const c = String(s.code || '').trim();
            if (c) salesMap.set(c, s);
          });
          (Array.isArray(curSales) ? curSales : []).forEach(s => {
            let c = String(s.code || '').trim();
            if (!c) return;
            const existing = salesMap.get(c);
            if (existing) {
              const isSame = String(existing.client || '').trim().toLowerCase() === String(s.client || '').trim().toLowerCase() &&
                             Math.abs((Number(existing.total) || 0) - (Number(s.total) || 0)) < 0.05;
              if (!isSame) {
                maxCode++;
                c = String(maxCode);
                s.code = c;
              }
            }
            salesMap.set(c, s);
          });
          const mergedSales = Array.from(salesMap.values()).sort((a,b) => (Number(b.code)||0) - (Number(a.code)||0));
          const salesStr = JSON.stringify(mergedSales);
          localStorage.setItem('localSales', salesStr);
          toPushServer['localSales'] = salesStr;
        } catch(e) {}

        BACKUP_STORAGE_KEYS.forEach(k => {
          if (k === 'localSales') return;
          if (payload[k] !== undefined) {
            const curVal = localStorage.getItem(k);
            if (!curVal || curVal === '[]' || curVal === '{}') {
              const valStr = typeof payload[k] === 'string' ? payload[k] : JSON.stringify(payload[k]);
              localStorage.setItem(k, valStr);
              toPushServer[k] = valStr;
            }
          }
        });
      }

      if (Object.keys(toPushServer).length && location.protocol !== 'file:') {
        fetch('/api/storage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toPushServer),
          keepalive: true
        }).catch(() => {});
      }

      overlay.remove();
      if (typeof window.appMessage === 'function') {
        window.appMessage('Restauração concluída com sucesso! Recarregando...');
      }
      setTimeout(() => { location.reload(); }, 1200);
    };
  }

  window.openBackupModal = openBackupModal;

  // A conta e a administração de usuários usam uma tela própria. A aba
  // Configurações do painel lateral continua apontando para configuracoes.html.
  function redirectUserMenuLinks() {
    document.querySelectorAll('.user-menu a').forEach(function(link) {
      var label = (link.textContent || '').trim().toLowerCase();
      if (label.indexOf('minha conta') !== -1) link.href = 'conta-usuarios.html#conta';
      if (label.indexOf('usuários e permissões') !== -1) link.href = 'conta-usuarios.html';
      if (label.indexOf('novo usuário') !== -1) link.href = 'conta-usuarios.html#novo';
      if (label === 'configurações') link.href = 'conta-usuarios.html';
    });
  }
  redirectUserMenuLinks();
  setTimeout(redirectUserMenuLinks, 0);

  document.addEventListener('click', function(e) {
    const backupTarget = e.target.closest('[data-menu-key="backup"], [data-action="open-backup-modal"], #menuBtnBackup');
    if (backupTarget) {
      e.preventDefault();
      e.stopPropagation();
      openBackupModal();
    }
  });
})();



