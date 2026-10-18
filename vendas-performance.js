/* Renderização paginada da lista de Vendas.
   Mantém os dados completos, mas deixa no DOM somente a página visível. */
(function(){
  const PAGE_SIZE=100;
  let cachedRows=[], currentPage=1, currentMode=localStorage.getItem('activeSalesTab')==='quotes'?'quotes':'sales', tbody=null;
  const original=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');
  if(!original||!original.set)return;
  const rowParts=value=>String(value).split('</tr>').filter(x=>x.includes('<tr')).map(x=>x+'</tr>');
  const textFromCell=html=>String(html).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
  const rowType=html=>{const cells=[...String(html).matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(x=>textFromCell(x[1]));return String(cells[5]||'').toLowerCase()};
  function scrollToListTop(){
    window.scrollTo(0,0);
    document.documentElement.scrollTop=0;
    document.body.scrollTop=0;
  }
  const filtered=()=>cachedRows.filter(row=>currentMode==='quotes'?rowType(row).includes('orçamento'):!rowType(row).includes('orçamento'));
  function render(){
    if(!tbody)return;
    const rows=filtered(), pages=Math.max(1,Math.ceil(rows.length/PAGE_SIZE));
    currentPage=Math.min(currentPage,pages);
    original.set.call(tbody,rows.slice((currentPage-1)*PAGE_SIZE,currentPage*PAGE_SIZE).join(''));
    let pager=document.getElementById('sales-pagination');
    if(!pager){pager=document.createElement('div');pager.id='sales-pagination';pager.className='sales-pagination';const table=document.querySelector('.sales-table');if(table)table.after(pager)}
    pager.innerHTML='<button type="button" data-sales-page="prev" '+(currentPage<=1?'disabled':'')+'>‹</button><span>Página '+currentPage+' de '+pages+' · '+rows.length+' registros</span><button type="button" data-sales-page="next" '+(currentPage>=pages?'disabled':'')+'>›</button>';
    pager.style.display=pages>1?'flex':'none';
  }
  Object.defineProperty(Element.prototype,'innerHTML',{configurable:original.configurable,enumerable:original.enumerable,get:original.get,set:function(value){
    if(this.id==='saleRows' && String(value).includes('<tr')){
      tbody=this;
      cachedRows=rowParts(value);
      render();
      return;
    }
    original.set.call(this,value);
  }});
  document.addEventListener('DOMContentLoaded',function(){
    tbody=document.getElementById('saleRows');
    if(!tbody)return;
    document.addEventListener('click',function(e){
      const page=e.target.closest('[data-sales-page]');
      if(page){currentPage=Math.max(1,currentPage+(page.dataset.salesPage==='next'?1:-1));render();scrollToListTop();return}
      const tab=e.target.closest('#salesTab,#quotesTab');
      if(tab){currentMode=tab.id==='quotesTab'?'quotes':'sales';currentPage=1;setTimeout(render,0)}
    },true);
    setTimeout(render,0);
  });
})();
