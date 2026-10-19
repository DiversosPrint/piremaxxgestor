(function(){
  const sidebar=document.querySelector('.sidebar');
  if(!sidebar)return;
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const active=path==='vendas.html'?'vendas':path==='compras.html'?'compras':(path==='clientes.html'||path==='novo-cliente.html')?'clientes':(path==='produtos.html'||path==='novo-produto.html')?'produtos':'home';
  const items=[
    ['home','Home','index.html','icons8-home-48.png','dashboard-link'],
    ['financeiro','Financeiro','index.html','icons8-financial-64.png','finance-link'],
    ['vendas','Vendas','vendas.html','icons8-buy-for-cash-48.png',''],
    ['compras','Compras','compras.html','icons8-buy-48.png',''],
    ['clientes','Clientes','clientes.html','icons8-budget-48.png',''],
    ['produtos','Produtos','produtos.html','icons8-product-48.png',''],
    ['boletos','Boletos','#','icons8-boleto-bancário-48.png',''],
    ['cobrancas','Cobranças','#','icons8-billing-32.png',''],
    ['pix','Pix','#','icons8-pix-48.png',''],
    ['fiscal','NF-e / Fiscal','#','icons8-fiscal-50.png',''],
    ['relatorios','Relatórios','#','icons8-business-report-94.png',''],
    ['configuracoes','Configurações','configuracoes.html','icons8-settings-48.png','']
  ];
  sidebar.classList.add('shared-sidebar');
  function render(){sidebar.innerHTML='<div class="brand"><strong>egestor<span>+</span></strong><small>Plano profissional</small></div><nav>'+items.map(x=>'<a class="'+x[4]+' '+(x[0]===active?'active':'')+'" href="'+x[2]+'" data-menu-key="'+x[0]+'"><img src="public/icons/'+x[3]+'" alt=""><b>'+x[1]+'</b></a>').join('')+'<a href="#" data-menu-key="suporte"><span>❔</span><b>Suporte online</b></a></nav>'}
  render();
  if(!document.getElementById('shared-menu-style')){
    const style=document.createElement('style');
    style.id='shared-menu-style';
    style.textContent='.shared-sidebar{width:143px!important;min-height:100vh!important}.shared-sidebar nav a{height:31px!important;min-height:31px!important;display:flex!important;align-items:center!important;padding:9px 13px!important;color:#fff!important;text-decoration:none!important;font-size:12px!important}.shared-sidebar nav a>img{width:16px!important;height:16px!important;max-width:16px!important;max-height:16px!important;object-fit:contain!important;margin-right:8px!important}.shared-sidebar nav a>span{width:16px!important;margin-right:8px!important;text-align:center!important}.shared-sidebar nav a b{margin-left:0!important}.shared-sidebar nav a.active,.shared-sidebar nav a:hover{background:#263840!important}body:has(.shared-sidebar) main{margin-left:143px!important;width:calc(100% - 143px)!important}';
    document.head.appendChild(style);
    const sharedBrand=sidebar.querySelector('.brand');
    if(sharedBrand){sharedBrand.style.display='block';sharedBrand.style.height='49px';sharedBrand.style.backgroundImage="url('public/logo.webp')";sharedBrand.style.backgroundPosition='center center';sharedBrand.style.backgroundRepeat='no-repeat';sharedBrand.style.backgroundSize='120px auto';sharedBrand.style.fontSize='0';}
  }
  document.addEventListener('DOMContentLoaded',render);
})();

// Mantém Nova coleta funcional mesmo quando o toolbar é reconstruído por outro script.
(function(){
  document.addEventListener('click',function(event){
    var button=event.target.closest('.collections-new');
    if(!button||!document.getElementById('collections-panel')||document.querySelector('.collection-modal'))return;
    var modal=document.createElement('section');
    modal.className='collection-modal';
    modal.innerHTML='<div class="collection-dialog"><header><b>Nova coleta</b><button type="button" class="collection-close">×</button></header><div class="collection-form"><div class="collection-form-grid"><label>Cliente / fornecedor<select id="fallback-client"><option value="">Selecione...</option></select></label><label>Responsável<input id="fallback-responsible"></label><label>Data<input id="fallback-date" type="date"></label><label>Atividade<select id="fallback-activity"><option>Coleta/compra de carcaças</option><option>Coleta</option><option>Compra</option></select></label><label>Situação<select id="fallback-status"><option>Em preparação</option><option>Em campo</option><option>Concluída</option></select></label><label class="cf-wide">Observações<textarea id="fallback-notes"></textarea></label></div></div><footer><button type="button" class="collection-cancel">Cancelar</button><button type="button" class="collection-save">Salvar coleta</button></footer></div>';
    document.body.appendChild(modal);
    modal.querySelector('#fallback-date').value=new Date().toISOString().slice(0,10);
    try{var clients=JSON.parse(localStorage.getItem('piremaxx_clientes')||'[]');var select=modal.querySelector('#fallback-client');clients.forEach(function(client){var option=document.createElement('option');option.textContent=client.nome||client.name||'';option.value=option.textContent;if(option.value)select.appendChild(option)})}catch(error){}
    var close=function(){modal.remove()};
    modal.querySelector('.collection-close').onclick=modal.querySelector('.collection-cancel').onclick=close;
    modal.querySelector('.collection-save').onclick=function(){var client=modal.querySelector('#fallback-client').value;if(!client){alert('Selecione o cliente ou fornecedor.');return}var list=[];try{list=JSON.parse(localStorage.getItem('piremaxx_coletas')||'[]')}catch(error){}list.unshift({code:String(Date.now()).slice(-6),client:client,responsible:modal.querySelector('#fallback-responsible').value,date:modal.querySelector('#fallback-date').value,activity:modal.querySelector('#fallback-activity').value,status:modal.querySelector('#fallback-status').value,notes:modal.querySelector('#fallback-notes').value,total:0,items:[]});localStorage.setItem('piremaxx_coletas',JSON.stringify(list));close();location.reload()};
  });
})();

// Reproduz a transição curta do original ao trocar abas: o enquadramento fica
// parado, o conteúdo mostra um carregamento breve e então a nova lista aparece.
(function(){
  const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(!['vendas.html','compras.html','clientes.html'].includes(file))return;
  const style=document.createElement('style');
  style.id='shared-tab-transition-style';
  style.textContent='.shared-tab-transition{position:relative!important;min-height:120px!important}.shared-tab-transition>*:not(.tabs):not(.purchase-tabs):not(.client-tabs){opacity:.16!important;transition:opacity .12s ease}.shared-tab-transition:after{content:"";position:absolute;z-index:30;left:50%;top:50%;width:20px;height:20px;margin:-10px;border:3px solid rgba(64,98,118,.22);border-top-color:#299c9a;border-radius:50%;animation:shared-tab-spin .65s linear infinite}@keyframes shared-tab-spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(style);
  let timer;
  document.addEventListener('click',function(e){
    const tab=e.target.closest('.tabs .tab,.purchase-tab,.client-tabs button,.tabs button');
    if(!tab)return;
    const region=tab.closest('.sales-content,.purchase-content,.clientes,.contacts-content');
    if(!region)return;
    region.classList.add('shared-tab-transition');
    clearTimeout(timer);
    timer=setTimeout(function(){region.classList.remove('shared-tab-transition')},280);
  },true);
})();

// Aplica o enquadramento final antes da primeira pintura da página. Isso evita
// que o menu apareça brevemente no tamanho antigo e só depois seja ampliado.
(function(){
  const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
   if(!['index.html','vendas.html','compras.html','clientes.html','novo-cliente.html'].includes(file))return;
  const style=document.createElement('style');
  style.id='standard-layout-first-paint';
   style.textContent='body .sidebar.shared-sidebar{position:fixed!important;top:0!important;left:0!important;width:143px!important;min-width:143px!important;height:100vh!important;min-height:100vh!important;z-index:50!important}body .sidebar.shared-sidebar .brand{display:block!important}body .sidebar.shared-sidebar nav a{height:31px!important;min-height:31px!important;padding:9px 13px!important;font-size:12px!important;line-height:13px!important}body main{margin-left:143px!important;width:calc(100% - 143px)!important;padding-top:98px!important}body main>.topbar{position:fixed!important;left:143px!important;top:0!important;width:calc(100% - 143px)!important;height:49px!important;min-height:49px!important;padding:0 10px!important;z-index:40!important}body main>.titlebar,body main>.clients-title,body main>.purchase-header,body main>.dashboard-title{position:fixed!important;left:143px!important;top:49px!important;width:calc(100% - 143px)!important;height:49px!important;min-height:49px!important;z-index:35!important}body main>.sales-content:before{content:"";position:fixed;left:143px;top:98px;width:calc(100% - 143px);height:117px;background:#f2f3f4;z-index:33;pointer-events:none}body main>.sales-content>.tabs{position:fixed!important;left:143px!important;top:122px!important;width:calc(100% - 143px)!important;height:38px!important;z-index:34!important;background:#f2f3f4!important}body main>.sales-content>.toolbar{position:fixed!important;left:143px!important;top:160px!important;width:calc(100% - 143px)!important;height:55px!important;z-index:34!important;background:#f2f3f4!important}body .client-tabs{display:flex!important;align-items:flex-start!important;height:38px!important;min-height:38px!important;border-bottom:1px solid #20a9a8!important;margin:0!important}body .client-tabs button{height:38px!important;min-height:38px!important;box-sizing:border-box!important;padding:10px 16px!important;margin:0 4px 0 0!important;font-size:12px!important;line-height:18px!important;border-radius:4px 4px 0 0!important}';
  document.head.appendChild(style);
  const sidebar=document.querySelector('.sidebar'),main=document.querySelector('main'),topbar=document.querySelector('main>.topbar');
   if(sidebar){sidebar.style.setProperty('top','0px','important');sidebar.style.setProperty('width','143px','important');sidebar.style.setProperty('min-width','143px','important');sidebar.style.setProperty('height','100vh','important');sidebar.style.setProperty('min-height','100vh','important');const brand=sidebar.querySelector('.brand');if(brand){brand.style.setProperty('display','block','important');brand.style.setProperty('height','49px','important');brand.style.setProperty('background-image',"url('public/logo.webp')",'important');brand.style.setProperty('background-position','center center','important');brand.style.setProperty('background-repeat','no-repeat','important');brand.style.setProperty('background-size','120px auto','important');brand.style.setProperty('font-size','0','important');}sidebar.querySelectorAll('nav a').forEach(a=>{a.style.setProperty('height','31px','important');a.style.setProperty('min-height','31px','important');a.style.setProperty('padding','9px 13px','important');a.style.setProperty('font-size','12px','important');});}
   if(main){main.style.setProperty('margin-left','143px','important');main.style.setProperty('width','calc(100% - 143px)','important');main.style.setProperty('padding-top','98px','important');}
   if(topbar){topbar.style.setProperty('position','fixed','important');topbar.style.setProperty('left','143px','important');topbar.style.setProperty('top','0','important');topbar.style.setProperty('width','calc(100% - 143px)','important');topbar.style.setProperty('height','49px','important');topbar.style.setProperty('min-height','49px','important');topbar.style.setProperty('z-index','40','important');}
   if(sidebar)sidebar.style.setProperty('z-index','50','important');
   const title=document.querySelector('main>.titlebar,main>.clients-title,main>.purchase-header,main>.dashboard-title');
   if(title){title.style.setProperty('position','fixed','important');title.style.setProperty('left','143px','important');title.style.setProperty('top','49px','important');title.style.setProperty('width','calc(100% - 143px)','important');title.style.setProperty('height','49px','important');title.style.setProperty('z-index','35','important');title.style.setProperty('background-color','#5e7d89','important');title.style.setProperty('background-image','none','important');title.style.setProperty('opacity','1','important');}
   const sales=document.querySelector('.sales-content'),tabs=sales?.querySelector(':scope > .tabs'),toolbar=sales?.querySelector(':scope > .toolbar');
   if(sales){sales.style.setProperty('padding-top','117px','important');}
   if(tabs){tabs.style.setProperty('position','fixed','important');tabs.style.setProperty('left','143px','important');tabs.style.setProperty('top','122px','important');tabs.style.setProperty('width','calc(100% - 143px)','important');tabs.style.setProperty('height','38px','important');tabs.style.setProperty('z-index','34','important');tabs.style.setProperty('background-color','#f2f3f4','important');tabs.style.setProperty('background-image','none','important');tabs.style.setProperty('opacity','1','important');}
   if(toolbar){toolbar.style.setProperty('position','fixed','important');toolbar.style.setProperty('left','143px','important');toolbar.style.setProperty('top','160px','important');toolbar.style.setProperty('width','calc(100% - 143px)','important');toolbar.style.setProperty('height','55px','important');toolbar.style.setProperty('z-index','34','important');toolbar.style.setProperty('background-color','#f2f3f4','important');toolbar.style.setProperty('background-image','none','important');toolbar.style.setProperty('opacity','1','important');}
})();
