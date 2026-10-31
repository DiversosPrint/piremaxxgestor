const sales=[['3227','KAUAI CAR AUTO CENTER LTDA','CLAUDEMIR NOGUEIRA','15/10/2026','Orçamento','R$ 11.550,00'],['3226','EXPRESSO - SEP ETIBA','Viviane Martins','15/10/2026','Venda','R$ 825,00'],['3225','KAUAI CAR AUTO CENTER LTDA','Viviane Martins','15/10/2026','Venda','R$ 10.725,00'],['3224','THIAGO CRISTOVAO FERREIRA MONTEIRO','Viviane Martins','15/10/2026','Venda','R$ 330,00'],['3223','R&G (RAQUEL)','Viviane Martins','15/10/2026','Venda','R$ 330,00']];
let editingCode=null,selectedCode=null,isNewRecord=false;
let items=[{name:'',type:'Produto',price:0,qty:0}],parts=[];const products=(()=>{let local=[];try{local=JSON.parse(localStorage.getItem('localProducts')||'[]')}catch(e){}const imported=window.cloneData?.products||window.importedProducts||[];const catalog=[...local,...imported].filter(function(p){const type=String(p.type||'Produto').toLowerCase();return type!=='serviço'&&type!=='servico'&&String(p.name||p.sku||'').trim()});const seen=new Set();const mapped=catalog.map(function(p){const name=String(p.name||p.sku||('Produto '+p.code)),code=String(p.code||p.sku||''),price=Number(p.price??p.salePrice??p.precoVenda??0)||0;return[name,code,price]}).filter(function(p){const key=p[1]+'|'+p[0].toLowerCase();if(seen.has(key))return false;seen.add(key);return true});return mapped.length?mapped:[['A-103-175/65/R14','103',190],['A-104-175/70/R14','104',210],['A-110-185/65/R15','110',240],['A-102-175/70/R13','102',250]]})();
const money=n=>Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});const total=()=>items.reduce((s,x)=>s+(Number(x.price)||0)*(Number(x.qty)||0),0);
function generateNextProtocolCode(){
  const saved=JSON.parse(localStorage.getItem('localSales')||'[]');
  return String(Math.max(0,...sales.map(r=>Number(r[0])||0),...saved.map(s=>Number(s.code)||0))+1);
}
function adjustProductStockSingle(itemCode,itemName,deltaQty){
  const delta=Number(deltaQty)||0;
  if(!delta)return;
  const normName=String(itemName||'').trim().toLowerCase();
  const normCode=String(itemCode||'').trim().toLowerCase();
  if(!normName&&!normCode)return;
  let local=[];
  try{local=JSON.parse(localStorage.getItem('localProducts')||'[]')}catch(e){local=[]}
  const imported=window.cloneData?.products||window.importedProducts||[];
  const matchFn=function(p){
    const pCode=String(p.code||p.sku||'').trim().toLowerCase();
    const pName=String(p.name||p.sku||'').trim().toLowerCase();
    if(normCode&&pCode&&pCode===normCode)return true;
    if(normName&&pName&&(pName===normName||pName.includes(normName)||normName.includes(pName)))return true;
    return false;
  };
  let idx=local.findIndex(matchFn);
  if(idx>=0){
    local[idx].stock=(Number(local[idx].stock)||0)+delta;
  }else{
    const imp=imported.find(matchFn);
    if(imp){
      const copy=Object.assign({},imp,{stock:(Number(imp.stock)||0)+delta});
      local.unshift(copy);
    }else if(normName){
      const catHit=products.find(p=>p[0].toLowerCase()===normName||(normCode&&String(p[1]).toLowerCase()===normCode));
      local.unshift({
        code:catHit?String(catHit[1]):(itemCode||String(Date.now()).slice(-4)),
        name:catHit?catHit[0]:itemName,
        category:'Geral',
        type:'Produto',
        price:catHit?Number(catHit[2]):0,
        stock:delta
      });
    }
  }
  localStorage.setItem('localProducts',JSON.stringify(local));
}
function syncStockForSale(saleCode,newItems,newType,previousSaleObj){
  const key=String(saleCode||'').trim();
  if(!key)return;
  let ledger={};
  try{ledger=JSON.parse(localStorage.getItem('piremaxx_stock_ledger')||'{}')}catch(e){ledger={}}
  let oldMap=ledger[key];
  if(!oldMap&&previousSaleObj&&previousSaleObj.type==='Venda'&&Array.isArray(previousSaleObj.items)){
    oldMap={};
    previousSaleObj.items.forEach(function(it){
      if(String(it.type||'Produto').toLowerCase()==='serviço')return;
      const k=(String(it.code||'')+'|'+String(it.name||'').trim().toLowerCase());
      oldMap[k]={code:it.code||'',name:it.name||'',qty:(oldMap[k]?.qty||0)+(Number(it.qty)||0)};
    });
  }
  if(oldMap){
    Object.values(oldMap).forEach(function(entry){
      if(entry.qty)adjustProductStockSingle(entry.code,entry.name,+Number(entry.qty));
    });
  }
  if(newType==='Venda'&&Array.isArray(newItems)){
    const nextMap={};
    newItems.forEach(function(it){
      if(String(it.type||'Produto').toLowerCase()==='serviço')return;
      const q=Number(it.qty)||0;
      const nm=String(it.name||'').trim();
      if(!nm||q<=0)return;
      const catHit=products.find(p=>p[0].toLowerCase()===nm.toLowerCase());
      const cd=it.code||(catHit?catHit[1]:'');
      const k=String(cd)+'|'+nm.toLowerCase();
      nextMap[k]={code:cd,name:nm,qty:(nextMap[k]?.qty||0)+q};
      adjustProductStockSingle(cd,nm,-q);
    });
    ledger[key]=nextMap;
  }else{
    delete ledger[key];
  }
  localStorage.setItem('piremaxx_stock_ledger',JSON.stringify(ledger));
}
function syncReceivablesForSale(sale){
  if(!sale||!sale.code)return;
  let list=[];
  try{list=JSON.parse(localStorage.getItem('piremaxx_contas_receber')||'[]')}catch(e){list=[]}
  list=list.filter(x=>String(x.saleCode||'')!==String(sale.code));
  if(sale.type==='Venda'){
    const fin=(Array.isArray(sale.financial)&&sale.financial.length)?sale.financial:(sale.parts||[]);
    fin.forEach(function(f,idx){
      list.unshift({
        id:'VENDA-'+sale.code+'-'+(idx+1),
        saleCode:String(sale.code),
        description:'Venda #'+sale.code+' ('+(idx+1)+'/'+fin.length+') - '+(sale.client||'Cliente'),
        category:'Receitas de vendas',
        client:sale.client||'',
        dueDate:f.date||sale.date||todayValue(),
        paymentDate:f.status==='Recebido'?(f.date||sale.date||todayValue()):'',
        value:Number(f.value)||0,
        method:f.method||'Dinheiro',
        status:f.status==='Recebido'?'Recebido':'A receber',
        notes:sale.notes||''
      });
    });
  }
  localStorage.setItem('piremaxx_contas_receber',JSON.stringify(list));
}
if(window.importedSales)window.importedSales.forEach(s=>{const row=[String(s.code),s.client,s.vendor,s.date?.split('-').reverse().join('/')||'',s.type,money(s.total)];const index=sales.findIndex(r=>String(r[0])===String(s.code));if(index>=0)sales[index]=row;else sales.push(row)});
{const deletedSaleSet=new Set(JSON.parse(localStorage.getItem('deletedSaleCodes')||'[]').map(String));for(let i=sales.length-1;i>=0;i--){if(deletedSaleSet.has(String(sales[i][0])))sales.splice(i,1)}}document.getElementById('saleRows').innerHTML=sales.map(r=>'<tr><td><input type="checkbox" class="sale-select"></td>'+r.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('');
const importedCodes=new Set((window.importedSales||[]).map(s=>String(s.code)));const storedSales=JSON.parse(localStorage.getItem('localSales')||'[]');const localSavedSales=storedSales.filter(s=>!importedCodes.has(String(s.code))||s.source==='userOverride');if(localSavedSales.length!==storedSales.length)localStorage.setItem('localSales',JSON.stringify(localSavedSales));let localSalesChanged=false;localSavedSales.slice().reverse().forEach(s=>{if(s.vendor==='Sim'||!s.vendor){s.vendor='Diego Miranda';localSalesChanged=true}const formatted=[String(s.code),s.client,s.vendor,(s.date||'').split('-').reverse().join('/'),s.type||'Venda',money(s.total)];const existingIdx=sales.findIndex(r=>String(r[0])===String(s.code));if(existingIdx>=0)sales[existingIdx]=formatted;else sales.unshift(formatted)});if(localSalesChanged)localStorage.setItem('localSales',JSON.stringify(localSavedSales));{const deletedSaleSet=new Set(JSON.parse(localStorage.getItem('deletedSaleCodes')||'[]').map(String));for(let i=sales.length-1;i>=0;i--){if(deletedSaleSet.has(String(sales[i][0])))sales.splice(i,1)}}document.getElementById('saleRows').innerHTML=sales.map(r=>'<tr><td><input type="checkbox" class="sale-select"></td>'+r.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('');
{const deletedSaleSet=new Set(JSON.parse(localStorage.getItem('deletedSaleCodes')||'[]').map(String));for(let i=sales.length-1;i>=0;i--){if(deletedSaleSet.has(String(sales[i][0])))sales.splice(i,1)}}document.getElementById('saleRows').innerHTML=sales.map(r=>'<tr><td><input type="checkbox" class="sale-select"></td>'+r.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('');
function recalcPartsFromCart(){
  if(!parts||!parts.length){
    parts=[{days:0,value:total(),edited:false}];
  }else{
    parts.forEach(function(p){p.edited=false;p.value=0});
  }
  document.querySelectorAll('#installments .installment input[type="number"]').forEach(function(inp){delete inp.dataset.edited});
  renderParts();
}
function removeCartItem(i){
  items.splice(i,1);
  if(!items.length)items=[{name:'',type:'Produto',price:0,qty:0}];
  recalcPartsFromCart();
  renderItems();
}
function renderItems(){document.getElementById('items').innerHTML=items.map((x,i)=>'<div class="cart-row"><div class="product-wrap"><input placeholder="Adicionar item" value="'+x.name+'" onfocus="productFocus('+i+')" oninput="productInput('+i+',this.value)">'+(x.focused||x.name&&!x.selected?'<div class="product-list">'+products.filter(p=>p[0].toLowerCase().includes(x.name.toLowerCase())).map(p=>'<button type="button" onclick="chooseProduct('+i+',\''+p[0]+'\','+p[2]+',\''+p[1]+'\')">'+p[0]+' <small>cód. '+p[1]+' · R$ '+p[2].toFixed(2).replace('.',',')+'</small></button>').join('')+'</div>':'')+'</div><input type="number" min="0" step=".01" value="'+x.price+'" oninput="updateItem('+i+',\'price\',this.value)"><input type="number" min="0" step="1" value="'+x.qty+'" oninput="updateItem('+i+',\'qty\',this.value)"><span>R$ 0,00</span><span>'+money(x.price*x.qty)+' <button type="button" class="item-remove" title="Excluir item" aria-label="Excluir item" onclick="removeCartItem('+i+')"><img src="public/icons/icons8-remove-48.png" alt="Excluir item" class="local-action-icon"></button></span></div>').join('');refresh()}
function productFocus(i){items[i].focused=true;items[i].selected=false;renderItems();const input=document.querySelectorAll('.cart-row input')[i*3];if(input){input.focus();input.setSelectionRange(input.value.length,input.value.length)}}
function productInput(i,v){items[i].name=v;items[i].focused=true;items[i].selected=false;renderItems();const input=document.querySelectorAll('.cart-row input')[i*3];if(input){input.focus();input.setSelectionRange(v.length,v.length)}}
function chooseProduct(i,name,price,code){items[i].name=name;if(code)items[i].code=code;items[i].price=price;if(!items[i].qty||Number(items[i].qty)<=0)items[i].qty=1;items[i].selected=true;items[i].focused=false;recalcPartsFromCart();renderItems()}
document.addEventListener('click',function(e){if(!e.target.closest('.product-wrap')){const open=items.some(function(x){return x.focused});if(open){items.forEach(function(x){x.focused=false});document.querySelectorAll('.product-list').forEach(function(el){el.style.display='none'})}return}const b=e.target.closest('.product-list button');if(!b)return;const row=b.closest('.cart-row');const idx=[...document.querySelectorAll('.cart-row')].indexOf(row);const hit=products.find(p=>b.textContent.includes(p[0]));if(hit&&idx>=0)chooseProduct(idx,hit[0],hit[2],hit[1])});
function updateItem(i,f,v){items[i][f]=Number(String(v).replace(',','.'))||0;recalcPartsFromCart();refresh()}
document.addEventListener('input',function(e){const row=e.target.closest('.cart-row');if(!row)return;const rows=[...document.querySelectorAll('.cart-row')],i=rows.indexOf(row);const ns=row.querySelectorAll('input[type="number"]');if(i>=0&&ns.length>=2&&e.target.type==='number'){items[i].price=Number(ns[0].value)||0;items[i].qty=Number(ns[1].value)||0;const out=row.querySelectorAll('span');const totalCell=out[out.length-1];if(totalCell)totalCell.innerHTML=money(items[i].price*items[i].qty)+' <button type="button" class="item-remove" title="Excluir item" aria-label="Excluir item" onclick="removeCartItem('+i+')"><img src="public/icons/icons8-remove-48.png" alt="Excluir item" class="local-action-icon"></button>';document.getElementById('qtyTotal').textContent=items.reduce((s,x)=>s+(Number(x.qty)||0),0);document.getElementById('grandTotal').textContent=money(total());document.getElementById('financeTotal').textContent=money(total());recalcPartsFromCart()}});
function refresh(){document.getElementById('qtyTotal').textContent=items.reduce((s,x)=>s+(Number(x.qty)||0),0);document.getElementById('grandTotal').textContent=money(total());document.getElementById('financeTotal').textContent=money(total());renderParts()}
function addItem(){items.push({name:'',type:'Produto',price:0,qty:0});renderItems()}
function todayValue(){const d=new Date();return[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function renderParts(){if(typeof window.renderParts==='function'&&window.renderParts!==renderParts)return window.renderParts()}
function addInstallment(){if(typeof window.addInstallment==='function'&&window.addInstallment!==addInstallment)return window.addInstallment()}function setPlan(n){if(typeof window.setPlan==='function'&&window.setPlan!==setPlan)return window.setPlan(n)}function togglePlans(){const p=document.getElementById('plans');if(p)p.classList.toggle('hidden')}
function toggleFinance(){
  const sel=document.querySelector('.form-grid select');
  const typeVal=sel?sel.value:'Venda';
  const showFin=(typeVal==='Venda'||typeVal==='Orçamento');
  document.querySelector('.finance-title').style.display=showFin?'':'none';
  document.querySelector('.finance-head').style.display=showFin?'':'none';
  document.getElementById('installments').style.display=showFin?'':'none';
  document.querySelector('.finance-total').style.display=showFin?'':'none';
  document.querySelector('.parcel-menu').style.display=showFin?'':'none';
  const title=document.getElementById('formTitle')||document.querySelector('#newSale .sale-header strong');
  if(title){
    const proto=editingCode||generateNextProtocolCode();
    if(typeVal==='Orçamento')title.textContent=(isNewRecord?'Novo orçamento - Protocolo #':'Orçamento número ')+proto;
    else if(typeVal==='Devolução')title.textContent='Devolução da Venda número '+proto;
    else title.textContent=(isNewRecord?'Nova Venda - Protocolo #':'Venda número ')+proto;
  }
  const protoInput=document.getElementById('saleProtocolInput');
  if(protoInput)protoInput.value=editingCode||'';
}
function getProtocolReturns(protoCode){
  const key=String(protoCode||'').trim();
  if(!key)return[];
  const localRet=JSON.parse(localStorage.getItem('localReturns')||'[]');
  const impRet=window.importedReturns||[];
  const seen=new Set();
  return [...localRet,...impRet].filter(function(ret){
    const rCode=String(ret.code||'').trim();
    if(rCode&&seen.has(rCode))return false;
    const match=String(ret.saleCode||'').trim()===key||rCode.startsWith('DEV-'+key+'-');
    if(match&&rCode)seen.add(rCode);
    return match;
  });
}
function buildReturnsPrintHtml(protoCode){
  const returns=getProtocolReturns(protoCode);
  if(!returns.length)return '';
  const entries=[];
  returns.forEach(function(ret){
    const list=Array.isArray(ret.items)&&ret.items.length?ret.items:[{name:ret.description||'Produto devolvido',qty:ret.quantity||'-',total:Number(ret.total||ret.value||0)}];
    list.forEach(function(x){
      entries.push({
        returnCode:ret.code||'-',
        name:x.name||x.item||'Produto devolvido',
        qty:x.qty??x.quantity??'-',
        total:Number(x.total||x.value||0),
        date:formatPtDate(ret.date)
      });
    });
  });
  const totalRet=returns.reduce((sum,x)=>sum+Number(x.total||x.value||0),0);
  return '<h2>Devoluções registradas</h2><table><thead><tr><th>Devolução</th><th>Produto ou serviço</th><th>Quantidade devolvida</th><th>Valor devolvido</th><th>Data</th></tr></thead><tbody>'+entries.map(function(x){
    return '<tr><td>'+escapeReturnHtml(x.returnCode)+'</td><td>'+escapeReturnHtml(x.name)+'</td><td>'+escapeReturnHtml(x.qty)+'</td><td>'+money(x.total)+'</td><td>'+escapeReturnHtml(x.date)+'</td></tr>';
  }).join('')+'</tbody></table><div class="total" style="font-size:14px;margin-top:8px">Total devolvido: '+money(totalRet)+'</div>';
}
function renderSaleReturnSummary(){
  const saleRoot=document.getElementById('newSale'),old=document.getElementById('saleReturnSummary');
  if(old)old.remove();
  if(!saleRoot||!editingCode)return;
  const returns=getProtocolReturns(editingCode);
  if(!returns.length)return;
  const entries=[];
  returns.forEach(function(ret){(Array.isArray(ret.items)&&ret.items.length?ret.items:[{name:ret.description||'Produto devolvido',qty:'-',total:Number(ret.total||ret.value||0)}]).forEach(function(x){entries.push({returnCode:ret.code||'-',name:x.name||x.item||'Produto devolvido',qty:x.qty??x.quantity??'-',total:Number(x.total||x.value||0),date:String(ret.date||'').split('-').reverse().join('/')||'-'})})});
  const total=returns.reduce((sum,x)=>sum+Number(x.total||x.value||0),0),section=document.createElement('section');section.id='saleReturnSummary';section.className='sale-return-summary';
  section.innerHTML='<div class="sale-return-summary-head"><div><strong>Devoluções registradas</strong><small>Produtos e valores já devolvidos neste protocolo</small></div><b>Total devolvido: '+returnMoney(total)+'</b></div><table><thead><tr><th>Devolução</th><th>Produto ou serviço</th><th>Quantidade devolvida</th><th>Valor devolvido</th><th>Data</th></tr></thead><tbody>'+entries.map(function(x){return'<tr><td>'+escapeReturnHtml(x.returnCode)+'</td><td>'+escapeReturnHtml(x.name)+'</td><td>'+escapeReturnHtml(x.qty)+'</td><td>'+returnMoney(x.total)+'</td><td>'+escapeReturnHtml(x.date)+'</td></tr>'}).join('')+'</tbody></table>';
  const actions=saleRoot.querySelector('.actions');if(actions)actions.before(section);else saleRoot.append(section);
}
function ensureProtocolFieldInForm(){
  const grid=document.querySelector('#newSale .form-grid');
  if(!grid||document.getElementById('saleProtocolWrap'))return;
  const wrap=document.createElement('label');
  wrap.id='saleProtocolWrap';
  wrap.innerHTML='Protocolo<input id="saleProtocolInput" readonly style="background:#eef2f4;font-weight:bold;color:#1b2886">';
  grid.insertBefore(wrap,grid.firstChild);
}
function openNewSaleForm(){
  editingCode=null;
  isNewRecord=true;
  showSale(true);
}
window.openNewSaleForm=openNewSaleForm;
function showSale(forceNew){
  ensureProtocolFieldInForm();
  if(forceNew||!editingCode){
    isNewRecord=true;
    editingCode=generateNextProtocolCode();
    items=[{name:'',type:'Produto',price:0,qty:0}];
    parts=[];
    const client=document.getElementById('client');if(client)client.value='';
    const isQuoteTab=localStorage.getItem('activeSalesTab')==='quotes'||document.getElementById('quotesTab')?.classList.contains('active');
    const type=document.querySelector('.form-grid select');if(type)type.value=isQuoteTab?'Orçamento':'Venda';
    const qWrap=document.getElementById('quoteStatusWrap');if(qWrap)qWrap.dataset.wasQuote=isQuoteTab?'1':'0';
    const qStatus=document.getElementById('quoteStatus');if(qStatus)qStatus.value='pending';
    const date=document.querySelector('.form-grid input[type="date"]');if(date)date.value=todayValue();
    const notesEl=document.querySelector('#newSale .notes textarea');if(notesEl)notesEl.value='';
    const kwEl=document.getElementById('saleKeywordInput')||document.querySelector('#newSale .form-grid input:not(#client):not([type="date"]):not(#saleProtocolInput)');if(kwEl)kwEl.value='';
  }
  const protoInput=document.getElementById('saleProtocolInput');
  if(protoInput)protoInput.value=editingCode||'';
  document.querySelector('.sales-content').classList.add('hidden');
  document.getElementById('newSale').classList.remove('hidden');
  renderItems();
  toggleFinance();
  if(typeof setupQuoteControls==='function')setupQuoteControls();
  renderSaleReturnSummary();
  if(typeof populateVendors==='function')populateVendors();
}
function toggleType(btn){document.querySelectorAll('.type-menu').forEach(m=>{if(m!==btn.nextElementSibling)m.classList.add('hidden')});document.querySelectorAll('.product-list').forEach(m=>m.style.display='none');const m=btn.nextElementSibling;m.classList.toggle('hidden')}
function chooseType(btn,label){const menu=btn.parentElement;const selector=menu.previousElementSibling;const row=menu.closest('.cart-row');const i=[...document.querySelectorAll('.cart-row')].indexOf(row);if(i>=0)items[i].type=label;selector.textContent=label+' ▾';menu.classList.add('hidden')}
document.addEventListener('click',function(e){if(!e.target.closest('.type-picker'))document.querySelectorAll('.type-menu').forEach(m=>m.classList.add('hidden'))});
const renderItemsBase=renderItems;renderItems=function(){renderItemsBase();document.querySelectorAll('.product-wrap').forEach((w,i)=>{if(w.querySelector('.type-picker'))return;w.insertAdjacentHTML('afterbegin','<div class="type-picker"><button type="button" onclick="toggleType(this)">'+(items[i].type||'Produto')+' ▾</button><div class="type-menu hidden"><button type="button" onclick="chooseType(this,\'Produto\')">⚙ Produto</button><button type="button" onclick="chooseType(this,\'Serviço\')">⚒ Serviço</button></div></div>')})}
function saveSale(){
  document.querySelectorAll('#items .cart-row').forEach((row,idx)=>{
    if(!items[idx])return;
    const nameInput=row.querySelector('.product-wrap input[placeholder="Adicionar item"]');
    const numInputs=row.querySelectorAll('input[type="number"]');
    if(nameInput)items[idx].name=nameInput.value.trim();
    if(numInputs[0])items[idx].price=Number(String(numInputs[0].value).replace(',','.'))||0;
    if(numInputs[1])items[idx].qty=Number(String(numInputs[1].value).replace(',','.'))||0;
    if(items[idx].price>0&&(!items[idx].qty||items[idx].qty<=0))items[idx].qty=1;
  });
  const client=document.getElementById('client').value.trim();
  const value=total();
  if(!client){alert('Informe o nome do cliente.');return}
  if(value<=0){alert('Adicione um produto com preço e quantidade.');return}
  const selects=document.querySelectorAll('.form-grid select');
  let type=selects[0]?.value||'Venda';
  const rawQuoteStatus=document.getElementById('quoteStatus')?.value||'pending';

  // Item 9: Caso o usuário selecione "Devolução" no formulário de venda/orçamento
  if(type==='Devolução'){
    const codeToReturn=editingCode||generateNextProtocolCode();
    const existingSale=findReturnSale(codeToReturn)||{
      code:String(codeToReturn),
      client:client,
      vendor:selects[1]?.value||'Diego Miranda',
      date:document.querySelector('.form-grid input[type="date"]')?.value||todayValue(),
      type:'Venda',
      total:value,
      items:JSON.parse(JSON.stringify(items))
    };
    document.getElementById('newSale').classList.add('hidden');
    const root=returnWizardRoot();
    root.classList.remove('hidden');
    returnWizardState={
      step:2,
      sale:existingSale,
      products:returnProducts(existingSale).map(p=>Object.assign({},p,{returnQty:p.originalQty})),
      keywords:(document.getElementById('saleKeywordInput')?.value||'').trim(),
      notes:(document.querySelector('#newSale .notes textarea')?.value||'').trim(),
      finance:'receivables'
    };
    renderReturnStep2();
    return;
  }

  // Item 8: Orçamento cujo status foi alterado para "Convertido em venda" muda automaticamente o tipo para Venda
  if(type==='Orçamento'&&rawQuoteStatus==='converted'){
    type='Venda';
    if(selects[0])selects[0].value='Venda';
  }

  const targetMode=type==='Orçamento'?'quotes':'sales';
  localStorage.setItem('activeSalesTab',targetMode);
  const saved=JSON.parse(localStorage.getItem('localSales')||'[]');
  const wasEditing=!isNewRecord&&Boolean(editingCode);
  const nextCode=editingCode||generateNextProtocolCode();
  const previousSale=saved.find(s=>String(s.code)===String(nextCode))||(window.importedSales||[]).find(s=>String(s.code)===String(nextCode))||null;
  const quoteStatus=type==='Orçamento'?rawQuoteStatus:'converted';
  const instRows=[...document.querySelectorAll('#installments .installment')];
  const financialData=instRows.map(function(r,i){
    const num=r.querySelector('input[type=number]');
    const dt=r.querySelector('input[type=date]');
    const sel=r.querySelector('select');
    const st=r.querySelector('.sale-status');
    const val=Number(String(num?.value||0).replace(',','.'))||0;
    return{
      index:i+1,
      totalParts:instRows.length,
      value:val,
      date:dt?.value||document.querySelector('.form-grid input[type="date"]')?.value||todayValue(),
      method:sel?.value||'Dinheiro',
      status:st?.textContent.trim()||'A receber',
      edited:true
    };
  });
  const partsData=financialData.map(function(f,i){
    return{days:i*30,value:f.value,date:f.date,method:f.method,status:f.status,edited:true};
  });
  const notesVal=(document.querySelector('#newSale .notes textarea')?.value||'').trim();
  const keywordVal=(document.getElementById('saleKeywordInput')?.value||document.querySelector('#newSale .form-grid input:not(#client):not([type="date"]):not(#saleProtocolInput)')?.value||'').trim();
  const consumerFinalVal=document.getElementById('consumerFinalSelect')?.value||selects[2]?.value||'Sim';

  const sale={
    code:String(nextCode),
    client,
    vendor:selects[1]?.value||'Diego Miranda',
    date:document.querySelector('.form-grid input[type="date"]').value||todayValue(),
    type,
    quoteStatus,
    status:quoteStatus,
    notes:notesVal,
    observations:notesVal,
    keywords:keywordVal,
    consumerFinal:consumerFinalVal,
    total:value,
    items:JSON.parse(JSON.stringify(items)),
    parts:partsData,
    financial:financialData,
    source:(window.importedSales||[]).some(s=>String(s.code)===String(nextCode))?'userOverride':'local',
    createdAt:previousSale?.createdAt||new Date().toISOString()
  };

  // Item 10: Sincroniza o estoque de produtos com a venda
  syncStockForSale(sale.code,sale.items,sale.type,wasEditing?previousSale:null);
  // Item 8: Sincroniza vínculo financeiro em Contas a Receber
  syncReceivablesForSale(sale);

  const oldIndex=saved.findIndex(s=>String(s.code)===String(nextCode));
  if(oldIndex>=0)saved[oldIndex]=sale;else saved.unshift(sale);
  localStorage.setItem('localSales',JSON.stringify(saved));
  const formattedRow=[String(sale.code),sale.client,sale.vendor,sale.date.split('-').reverse().join('/'),sale.type,money(sale.total)];
  const rowIndex=sales.findIndex(r=>String(r[0])===String(nextCode));
  if(rowIndex>=0)sales[rowIndex]=formattedRow;else sales.unshift(formattedRow);
  editingCode=null;
  isNewRecord=false;
  const searchInput=document.querySelector('.sales-search-input');
  if(searchInput)searchInput.value='';
  {const deletedSaleSet=new Set(JSON.parse(localStorage.getItem('deletedSaleCodes')||'[]').map(String));for(let i=sales.length-1;i>=0;i--){if(deletedSaleSet.has(String(sales[i][0])))sales.splice(i,1)}}
  document.getElementById('saleRows').innerHTML=sales.map(r=>'<tr><td><input type="checkbox" class="sale-select"></td>'+r.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('');
  if(typeof window.setSalesPaginationMode==='function')window.setSalesPaginationMode(targetMode,true);
  document.getElementById('newSale').classList.add('hidden');
  document.querySelector('.sales-content').classList.remove('hidden');
  filterSalesRows(targetMode);
  if(window.piremaxxAudit)window.piremaxxAudit.log(wasEditing?'update':'create',type,'#'+sale.code+' - '+sale.client+' ('+money(sale.total)+')');
  appMessage(type==='Orçamento'?'Orçamento salvo com sucesso':'Venda efetuada com sucesso');
}
document.addEventListener('DOMContentLoaded',function(){const b=document.querySelector('.actions .save');if(b)b.addEventListener('click',saveSale)});
(function(){function closeProductCascade(){let changed=false;items.forEach(function(item){if(item.focused){item.focused=false;changed=true}});if(changed)document.querySelectorAll('.product-list').forEach(function(el){el.style.display='none'})}document.addEventListener('mousedown',function(e){const target=e.target;if(target.closest('.product-list')||target.closest('.product-wrap input[placeholder="Adicionar item"]'))return;closeProductCascade()})})();
(function(){function install(){document.querySelectorAll('.product-wrap').forEach(function(wrap,i){if(wrap.querySelector('.product-picker-toggle'))return;const input=wrap.querySelector('input[placeholder="Adicionar item"]');if(!input)return;const toggle=document.createElement('button');toggle.type='button';toggle.className='product-picker-toggle';toggle.setAttribute('aria-label','Mostrar produtos');toggle.textContent='▾';toggle.addEventListener('mousedown',function(e){e.preventDefault();e.stopPropagation()});toggle.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();const item=items[i];if(!item)return;item.focused=!item.focused;item.selected=false;renderItems();if(item.focused){const next=document.querySelectorAll('.cart-row')[i]?.querySelector('input[placeholder="Adicionar item"]');if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length)}}});wrap.appendChild(toggle)})}install();new MutationObserver(install).observe(document.body,{childList:true,subtree:true})})();
function setupSalesToolbar(){const bar=document.querySelector('.toolbar');if(!bar||bar.querySelector('.list-tools'))return;const link=document.createElement('link');link.rel='stylesheet';link.href='https://v4.egestor.com.br/_vendor/WP8/css/font-awesome.min.css';document.head.appendChild(link);const wrap=document.createElement('span');wrap.className='list-tools';wrap.innerHTML='<button title="Clonar venda" aria-label="Clonar venda"><span class="fa fa-files-o"></span></button><button title="Gerar NFe" aria-label="Gerar NFe"><span class="fa fa-file-code-o"></span></button><button title="Excluir" aria-label="Excluir"><span class="fa fa-trash"></span></button><button title="Editar" aria-label="Editar"><span class="fa fa-pencil-square-o"></span></button><button title="WhatsApp" aria-label="Enviar para WhatsApp"><span class="fa fa-whatsapp"></span></button><button title="Imprimir" aria-label="Imprimir"><span class="fa fa-print"></span></button><button class="print-menu-btn" title="Mais opções">⌄</button><div class="print-menu hidden"><button><span class="fa fa-print"></span> Imprimir selecionada</button><button><span class="fa fa-print"></span><span class="fa fa-file-text-o"></span> Imprimir listagem</button></div>';bar.querySelector('.new-btn').after(wrap);wrap.querySelector('.print-menu-btn').onclick=function(){wrap.querySelector('.print-menu').classList.toggle('hidden')};wrap.querySelectorAll('button:not(.print-menu-btn):not(.print-menu button)').forEach(b=>b.onclick=function(){appMessage(b.title+' disponível para o registro selecionado.')})}
document.addEventListener('DOMContentLoaded',setupSalesToolbar);
document.addEventListener('DOMContentLoaded',function(){const b=document.querySelector('.list-tools button[title="WhatsApp"]');if(b)b.innerHTML='<i class="fa-brands fa-whatsapp"></i>'});
document.addEventListener('DOMContentLoaded',function(){const b=document.querySelector('.list-tools button[title="Editar"]');if(b)b.innerHTML='<img src="public/icons/icons8-edit-pencil.gif" alt="Editar" class="local-action-icon">'});
document.addEventListener('DOMContentLoaded',function(){const icons={'Clonar venda':'icons8-copy.gif','Gerar NFe':'icons8-nf.gif','Excluir':'icons8-trash.gif','WhatsApp':'icons8-whatsapp.gif','Imprimir':'icons8-print.gif'};Object.entries(icons).forEach(([title,file])=>{const b=document.querySelector('.list-tools button[title="'+title+'"]');if(b)b.innerHTML='<img src="public/icons/'+file+'" alt="'+title+'" class="local-action-icon">'})});
document.addEventListener('DOMContentLoaded',function(){const s=document.createElement('style');s.textContent='.local-action-icon{width:18px;height:18px;object-fit:contain;vertical-align:middle}';document.head.appendChild(s)});
document.addEventListener('DOMContentLoaded',function(){const l=document.createElement('link');l.rel='stylesheet';l.href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';document.head.appendChild(l)});
document.addEventListener('DOMContentLoaded',function(){const s=document.createElement('style');s.textContent='.list-tools .fa{font-family:Arial,sans-serif!important;font-style:normal}.list-tools .fa-files-o:before{content:"⧉"}.list-tools .fa-file-code-o:before{content:"▤"}.list-tools .fa-trash:before{content:"♜"}.list-tools .fa-pencil-square-o:before{content:"✎"}.list-tools .fa-whatsapp:before{content:"◔"}.list-tools .fa-print:before{content:"▣"}.list-tools .fa-file-text-o:before{content:"▤"}';document.head.appendChild(s)});
document.addEventListener('DOMContentLoaded',function(){const link=[...document.querySelectorAll('.sidebar nav a')].find(a=>a.textContent.includes('Vendas'));if(!link||link.querySelector('.sidebar-sale-icon'))return;link.innerHTML='<img class="sidebar-sale-icon" src="public/icons/icons8-buy-for-cash-48.png" alt=""><b>Vendas</b>';const s=document.createElement('style');s.textContent='.sidebar-sale-icon{width:16px;height:16px;object-fit:contain;vertical-align:-3px;margin-right:8px;mix-blend-mode:normal;filter:none}';document.head.appendChild(s)});
document.addEventListener('DOMContentLoaded',function(){const link=[...document.querySelectorAll('.sidebar nav a')].find(a=>a.textContent.includes('Compras'));if(!link||link.querySelector('.sidebar-buy-icon'))return;link.innerHTML='<img class="sidebar-buy-icon" src="public/icons/icons8-buy-48.png" alt=""><b>Compras</b>';const s=document.createElement('style');s.textContent='.sidebar-buy-icon{width:16px;height:16px;object-fit:contain;vertical-align:-3px;margin-right:8px;filter:none}';document.head.appendChild(s)});
document.addEventListener('DOMContentLoaded',function(){const link=[...document.querySelectorAll('.sidebar nav a')].find(a=>a.textContent.includes('Compras'));if(link)link.href='compras.html'});
document.addEventListener('DOMContentLoaded',function(){const link=[...document.querySelectorAll('.sidebar nav a')].find(a=>a.textContent.includes('Clientes'));if(!link||link.querySelector('.sidebar-client-icon'))return;link.innerHTML='<img class="sidebar-client-icon" src="public/icons/icons8-budget-48.png" alt=""><b>Clientes</b>';const s=document.createElement('style');s.textContent='.sidebar-client-icon{width:16px;height:16px;object-fit:contain;vertical-align:-3px;margin-right:8px;filter:none}';document.head.appendChild(s)});
document.addEventListener('DOMContentLoaded',function(){const link=[...document.querySelectorAll('.sidebar nav a')].find(a=>a.textContent.includes('Produtos'));if(!link||link.querySelector('.sidebar-product-icon'))return;link.innerHTML='<img class="sidebar-product-icon" src="public/icons/icons8-product-48.png" alt=""><b>Produtos</b>';const s=document.createElement('style');s.textContent='.sidebar-product-icon{width:16px;height:16px;object-fit:contain;vertical-align:-3px;margin-right:8px;filter:none}';document.head.appendChild(s)});
document.addEventListener('DOMContentLoaded',function(){const link=[...document.querySelectorAll('.sidebar nav a')].find(a=>a.textContent.trim().includes('Pix'));if(!link||link.querySelector('.sidebar-pix-icon'))return;link.innerHTML='<img class="sidebar-pix-icon" src="public/icons/icons8-pix-48.png" alt=""><b>Pix</b>';const s=document.createElement('style');s.textContent='.sidebar-pix-icon{width:16px;height:16px;object-fit:contain;vertical-align:-3px;margin-right:8px;filter:none}';document.head.appendChild(s)});
document.addEventListener('DOMContentLoaded',function(){const link=[...document.querySelectorAll('.sidebar nav a')].find(a=>a.textContent.trim().includes('Boletos'));if(!link||link.querySelector('.sidebar-boleto-icon'))return;link.innerHTML='<img class="sidebar-boleto-icon" src="public/icons/icons8-boleto-bancário-48.png" alt=""><b>Boletos</b>';const s=document.createElement('style');s.textContent='.sidebar-boleto-icon{width:16px;height:16px;object-fit:contain;vertical-align:-3px;margin-right:8px;filter:none}';document.head.appendChild(s)});
document.addEventListener('DOMContentLoaded',function(){const link=[...document.querySelectorAll('.sidebar nav a')].find(a=>a.textContent.trim().includes('Cobranças'));if(!link||link.querySelector('.sidebar-billing-icon'))return;link.innerHTML='<img class="sidebar-billing-icon" src="public/icons/icons8-billing-32.png" alt=""><b>Cobranças</b>';const s=document.createElement('style');s.textContent='.sidebar-billing-icon{width:16px;height:16px;object-fit:contain;vertical-align:-3px;margin-right:8px;filter:none}';document.head.appendChild(s)});
document.addEventListener('DOMContentLoaded',function(){const link=[...document.querySelectorAll('.sidebar nav a')].find(a=>a.textContent.trim().includes('Configurações'));if(!link||link.querySelector('.sidebar-settings-icon'))return;link.innerHTML='<img class="sidebar-settings-icon" src="public/icons/icons8-settings-48.png" alt=""><b>Configurações</b>';const s=document.createElement('style');s.textContent='.sidebar-settings-icon{width:16px;height:16px;object-fit:contain;vertical-align:-3px;margin-right:8px;filter:none}';document.head.appendChild(s)});
document.addEventListener('DOMContentLoaded',function(){const link=[...document.querySelectorAll('.sidebar nav a')].find(a=>a.textContent.trim().includes('Relatórios'));if(!link||link.querySelector('.sidebar-report-icon'))return;link.innerHTML='<img class="sidebar-report-icon" src="public/icons/icons8-business-report-94.png" alt=""><b>Relatórios</b>';const s=document.createElement('style');s.textContent='.sidebar-report-icon{width:16px;height:16px;object-fit:contain;vertical-align:-3px;margin-right:8px;filter:none}';document.head.appendChild(s)});
document.addEventListener('DOMContentLoaded',function(){const link=[...document.querySelectorAll('.sidebar nav a')].find(a=>a.textContent.trim().includes('NF-e / Fiscal'));if(!link||link.querySelector('.sidebar-fiscal-icon'))return;link.innerHTML='<img class="sidebar-fiscal-icon" src="public/icons/icons8-fiscal-50.png" alt=""><b>NF-e / Fiscal</b>';const s=document.createElement('style');s.textContent='.sidebar-fiscal-icon{width:16px;height:16px;object-fit:contain;vertical-align:-3px;margin-right:8px;filter:none}';document.head.appendChild(s)});
document.addEventListener('DOMContentLoaded',function(){const link=[...document.querySelectorAll('.sidebar nav a')].find(a=>a.textContent.trim().includes('Vitrine Online'));if(link)link.remove()});
document.addEventListener('DOMContentLoaded',function(){const link=[...document.querySelectorAll('.sidebar nav a')].find(a=>a.textContent.trim().includes('Financeiro'));if(!link||link.querySelector('.sidebar-financial-icon'))return;link.innerHTML='<img class="sidebar-financial-icon" src="public/icons/icons8-financial-64.png" alt=""><b>Financeiro</b>';const s=document.createElement('style');s.textContent='.sidebar-financial-icon{width:16px;height:16px;object-fit:contain;vertical-align:-3px;margin-right:8px;filter:none}';document.head.appendChild(s)});
function formatPtDate(d){
  if(!d)return '-';
  const s=String(d).trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(s))return s.split('-').reverse().join('/');
  return s;
}
function openExistingSaleRecord(code,row){
  if(!code)return;
  const saved=JSON.parse(localStorage.getItem('localSales')||'[]').find(s=>String(s.code)===String(code));
  const imported=(window.importedSales||[]).find(s=>String(s.code)===String(code));
  const ref=(typeof returnReferenceSales==='object'&&returnReferenceSales)?returnReferenceSales[String(code)]:null;
  const rowTotal=Number(String(row?.children[7]?.textContent||row?.children[6]?.textContent||'').replace(/[^0-9,-]/g,'').replace(/\./g,'').replace(',','.'))||0;
  const fallbackRow={
    code:String(code),
    client:row?.children[2]?.textContent.trim()||'',
    vendor:row?.children[3]?.textContent.trim()||'Diego Miranda',
    date:row?.children[4]?.textContent.trim().split('/').reverse().join('-')||todayValue(),
    type:(row?.children[5]?.textContent||'').replace(/NÃO APROVADO/g,'').trim()||'Venda',
    total:rowTotal
  };
  const source=saved|| (imported ? Object.assign({},ref||{},imported) : (ref ? Object.assign({},fallbackRow,ref) : fallbackRow));
  isNewRecord=false;
  editingCode=String(source.code||code);
  items=typeof normalizedSaleItems==='function'?normalizedSaleItems(source,Number(source.total)||rowTotal):(source.items||[{name:'',type:'Produto',price:rowTotal,qty:1}]);
  const rawP=(Array.isArray(source.financial)&&source.financial.length)?source.financial:(Array.isArray(source.parts)?source.parts:[]);
  const saleTotalNum=Number(source.total)||rowTotal||total();
  parts=rawP.map((p,i)=>({
    days:p.days!==undefined?p.days:i*30,
    value:Number(p.value)||0,
    date:p.date||source.date||todayValue(),
    dateEdited:Boolean(p.date),
    method:p.method||'Dinheiro',
    status:p.status||'A receber',
    edited:false,
    loaded:true
  }));
  if(parts.length>1&&Math.abs((Number(parts[0].value)||0)-saleTotalNum)<0.01){
    const restSum=parts.slice(1).reduce((s,p)=>s+(Number(p.value)||0),0);
    if(restSum>0&&restSum<saleTotalNum){
      parts[0].value=Number((saleTotalNum-restSum).toFixed(2));
    }else if(restSum===0){
      const cents=Math.round(saleTotalNum*100),cnt=parts.length,base=Math.floor(cents/cnt),rem=cents%cnt;
      parts.forEach((p,i)=>{p.value=Number(((base+(i<rem?1:0))/100).toFixed(2))});
    }
  }
  showSale(false);
  const clientInput=document.getElementById('client');
  if(clientInput)clientInput.value=source.client||'';
  const selects=document.querySelectorAll('#newSale .form-grid select');
  const resolvedType=(source.quoteStatus==='converted'||source.status==='converted')?'Venda':(source.type||'Venda');
  if(selects[0])selects[0].value=resolvedType;
  if(typeof populateVendors==='function')populateVendors(source.vendor||'Diego Miranda');
  if(selects[1])selects[1].value=source.vendor||'Diego Miranda';
  const dateInput=document.querySelector('#newSale .form-grid input[type="date"]');
  if(dateInput)dateInput.value=source.date||todayValue();
  const notesEl=document.querySelector('#newSale .notes textarea');
  if(notesEl)notesEl.value=source.notes||source.observations||'';
  const kwEl=document.getElementById('saleKeywordInput')||document.querySelector('#newSale .form-grid input:not(#client):not([type="date"]):not(#saleProtocolInput)');
  if(kwEl)kwEl.value=source.keywords||'';
  const cfEl=document.getElementById('consumerFinalSelect');
  if(cfEl)cfEl.value=source.consumerFinal||'Sim';
  const qWrap=document.getElementById('quoteStatusWrap');
  if(qWrap)qWrap.dataset.wasQuote=(resolvedType==='Orçamento'||source.type==='Orçamento')?'1':'0';
  const qsEl=document.getElementById('quoteStatus');
  if(qsEl)qsEl.value=source.quoteStatus||source.status||(resolvedType==='Venda'?'converted':'pending');
  renderItems();
  if(typeof window.renderParts==='function')window.renderParts();
  toggleFinance();
  if(typeof setupQuoteControls==='function')setupQuoteControls();
  renderSaleReturnSummary();
}
function editSelectedSale(){
  const checked=document.querySelector('.sale-select:checked');
  const row=checked?.closest('tr');
  const code=row?.children[1]?.textContent.trim()||selectedCode;
  if(!code){appMessage('Selecione uma venda ou orçamento na lista para editar.');return}
  openExistingSaleRecord(code,row);
}
document.addEventListener('DOMContentLoaded',function(){const b=document.querySelector('.list-tools button[title="Editar"]');if(b)b.onclick=editSelectedSale});
function printSalesList(){const checked=[...document.querySelectorAll('.sale-select:checked')].map(c=>c.closest('tr')).filter(Boolean);const visible=[...document.querySelectorAll('#saleRows tr')].filter(r=>r.style.display!=='none'&&!r.hidden&&r.id!=='returnsEmptyRow');const selected=(checked.length?checked:visible).sort((a,b)=>Number(b.children[1]?.textContent)-Number(a.children[1]?.textContent));if(!selected.length){appMessage('Nenhum registro encontrado para imprimir.');return}const rows=selected.map(r=>{const totalCell=r.children[7]||r.children[6];return '<tr><td>'+(r.children[1]?.textContent||'')+'</td><td>'+(r.children[2]?.textContent||'')+'</td><td>'+(r.children[3]?.textContent||'')+'</td><td>'+(r.children[4]?.textContent||'')+'</td><td>'+(r.children[5]?.textContent||'').replace('NÃO APROVADO','').trim()+'</td><td>'+(totalCell?.textContent||'')+'</td></tr>'}).join('');const w=window.open('','_blank','width=900,height=800');if(!w)return;w.document.write('<!doctype html><html><head><title>Gestão Piremaxx - Listagem</title><style>@page{size:A4;margin:0}body{font:12px Arial;color:#243746}h1{color:#1b2886;border-bottom:2px solid #1b2886;padding-bottom:10px;text-transform:uppercase;font-size:18px}table{width:100%;border-collapse:collapse}th{background:#1b2886;color:white;text-align:left}td,th{padding:8px;border-bottom:1px solid #ddd}.total{text-align:right;margin-top:16px;font-weight:bold;color:#1b2886}</style></head><body><h1>Relatório de Vendas e Orçamentos</h1><table><thead><tr><th>Protocolo</th><th>Cliente</th><th>Vendedor</th><th>Data</th><th>Tipo</th><th>Total</th></tr></thead><tbody>'+rows+'</tbody></table><div class="total">Quantidade de registros: '+selected.length+'</div><script>window.onload=function(){window.print()}<\/script></body></html>');w.document.close()}
function cloneSelectedSale(){const checked=[...document.querySelectorAll('.sale-select:checked')].map(c=>c.closest('tr')).filter(Boolean);if(checked.length!==1){appMessage('Selecione um único registro para clonar.');return}const row=checked[0],code=row.children[1]?.textContent.trim();const saved=JSON.parse(localStorage.getItem('localSales')||'[]');const imported=(window.importedSales||[]).find(s=>String(s.code)===String(code));const base=saved.find(s=>String(s.code)===String(code))||imported;const rowTotal=Number(String(row.children[7]?.textContent||row.children[6]?.textContent||'').replace(/[^0-9,-]/g,'').replace(/\./g,'').replace(',','.'))||0;const nextCode=generateNextProtocolCode();const type=(base?.type||(row.children[5]?.textContent||'').replace('NÃO APROVADO','').trim()||'Venda');const cloned={code:nextCode,client:base?.client||row.children[2]?.textContent.trim()||'',vendor:base?.vendor||row.children[3]?.textContent.trim()||'Diego Miranda',date:todayValue(),type,quoteStatus:type==='Orçamento'?'pending':'converted',status:type==='Orçamento'?'pending':'converted',notes:base?.notes||'',keywords:base?.keywords||'',total:Number(base?.total)||rowTotal,items:base?.items?JSON.parse(JSON.stringify(base.items)):[{name:'Item clonado #'+(code||''),type:'Produto',price:rowTotal,qty:1}],parts:base?.parts?JSON.parse(JSON.stringify(base.parts)):[{days:0,value:Number(base?.total)||rowTotal,date:todayValue(),method:'Dinheiro',status:'A receber',edited:true}],financial:base?.financial?JSON.parse(JSON.stringify(base.financial)):[],source:'local',createdAt:new Date().toISOString()};if(cloned.type==='Venda'){syncStockForSale(cloned.code,cloned.items,'Venda',null);syncReceivablesForSale(cloned)}saved.unshift(cloned);localStorage.setItem('localSales',JSON.stringify(saved));const formatted=[String(cloned.code),cloned.client,cloned.vendor,cloned.date.split('-').reverse().join('/'),cloned.type,money(cloned.total)];sales.unshift(formatted);const targetMode=type==='Orçamento'?'quotes':'sales';if(typeof window.setSalesPaginationMode==='function')window.setSalesPaginationMode(targetMode,true);filterSalesRows(targetMode);appMessage('Registro clonado com sucesso sob o protocolo #'+nextCode+'.')}
function deleteSelectedSales(){
  const checked=[...document.querySelectorAll('.sale-select:checked')].map(c=>c.closest('tr')).filter(Boolean);
  if(!checked.length){appMessage('Selecione ao menos um registro para excluir.');return}
  if(!confirm('Deseja realmente excluir '+checked.length+' registro(s) selecionado(s)?'))return;
  const codes=new Set(checked.map(r=>String(r.children[1]?.textContent.trim())));
  const allSaved=JSON.parse(localStorage.getItem('localSales')||'[]');
  codes.forEach(function(c){
    const prev=allSaved.find(s=>String(s.code)===c)||(window.importedSales||[]).find(s=>String(s.code)===c);
    syncStockForSale(c,[],'Excluído',prev);
    syncReceivablesForSale({code:c,type:'Excluído'});
  });
  const saved=allSaved.filter(s=>!codes.has(String(s.code)));
  localStorage.setItem('localSales',JSON.stringify(saved));
  const del=new Set(JSON.parse(localStorage.getItem('deletedSaleCodes')||'[]').map(String));
  codes.forEach(c=>del.add(c));
  localStorage.setItem('deletedSaleCodes',JSON.stringify([...del]));
  for(let i=sales.length-1;i>=0;i--){if(codes.has(String(sales[i][0])))sales.splice(i,1)}
  checked.forEach(r=>r.remove());
  const master=document.querySelector('.sales-select-all,.sale-select-all');
  if(master){master.checked=false;master.indeterminate=false}
  appMessage(checked.length+' registro(s) excluído(s) com sucesso.');
}
function whatsappSelectedSale(){const checked=[...document.querySelectorAll('.sale-select:checked')].map(c=>c.closest('tr')).filter(Boolean);if(checked.length!==1){appMessage('Selecione um único registro para enviar por WhatsApp.');return}const r=checked[0],code=r.children[1]?.textContent.trim(),client=r.children[2]?.textContent.trim(),date=r.children[4]?.textContent.trim(),type=(r.children[5]?.textContent||'').replace('NÃO APROVADO','').trim(),val=(r.children[7]||r.children[6])?.textContent.trim();if(typeof window.openPiremaxxWhatsAppModal==='function'){window.openPiremaxxWhatsAppModal({code,type,client});return}const msg=`Olá *${client}*! Segue o resumo do seu *${type} #${code}* na *Piremaxx Pneus*:\n• Data: ${date}\n• Valor Total: *${val}*`;window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank')}
document.addEventListener('DOMContentLoaded',function(){const a=document.querySelector('#newSale .actions');if(!a||a.querySelector('.wa-send-sale'))return;const b=document.createElement('button');b.type='button';b.className='wa-send-sale';b.innerHTML='<img src="public/icons/icons8-whatsapp.gif" alt="" class="local-action-icon"> Enviar por WhatsApp';b.style.cssText='background:#4cb050;color:#fff;display:inline-flex;align-items:center;gap:5px';b.onclick=function(){const type=document.querySelector('#newSale .form-grid select')?.value||'Venda';const client=document.getElementById('client')?.value||'';if(!editingCode){appMessage('Salve o registro antes de enviá-lo por WhatsApp.');return}window.openPiremaxxWhatsAppModal({code:editingCode,type,client})};a.insertBefore(b,a.querySelector('.save'))});function nfeSelectedSale(){const checked=[...document.querySelectorAll('.sale-select:checked')].map(c=>c.closest('tr')).filter(Boolean);if(!checked.length){appMessage('Selecione ao menos uma venda para gerar a NF-e.');return}printSelected()}
function installSelection(){
  document.querySelectorAll('#saleRows tr').forEach(r=>{const c=r.children[0];if(c&&!c.querySelector('input')&&r.children.length>2){c.innerHTML='<input type="checkbox" class="sale-select">'}});
  const newBtn=document.querySelector('.sales-content:not(.returns-view) .toolbar .new-btn');
  if(newBtn)newBtn.onclick=openNewSaleForm;
  const print=document.querySelector('.list-tools button[title="Imprimir"]');if(print)print.onclick=printSelected;
  const clone=document.querySelector('.list-tools button[title="Clonar venda"]');if(clone)clone.onclick=cloneSelectedSale;
  const del=document.querySelector('.list-tools button[title="Excluir"]');if(del)del.onclick=deleteSelectedSales;
  const edit=document.querySelector('.list-tools button[title="Editar"]');if(edit)edit.onclick=editSelectedSale;
  const wa=document.querySelector('.list-tools button[title="WhatsApp"]');if(wa)wa.onclick=whatsappSelectedSale;
  const nfe=document.querySelector('.list-tools button[title="Gerar NFe"]');if(nfe)nfe.onclick=nfeSelectedSale;
  const menuBtn=document.querySelector('.list-tools .print-menu-btn');
  if(menuBtn)menuBtn.onclick=function(e){e.stopPropagation();document.querySelector('.list-tools .print-menu')?.classList.toggle('hidden')};
  const menuBtns=document.querySelectorAll('.print-menu button');
  if(menuBtns[0])menuBtns[0].onclick=function(){document.querySelector('.print-menu')?.classList.add('hidden');printSelected()};
  if(menuBtns[1])menuBtns[1].onclick=function(){document.querySelector('.print-menu')?.classList.add('hidden');printSalesList()};
}
document.addEventListener('click',function(e){if(e.target.matches('.sale-select'))e.stopPropagation()},true);
document.addEventListener('DOMContentLoaded',installSelection);
function printSelected(){
  const selected=[...document.querySelectorAll('.sale-select:checked')].map(c=>c.closest('tr')).filter(Boolean).sort((a,b)=>Number(a.children[1]?.textContent)-Number(b.children[1]?.textContent));
  if(!selected.length){appMessage('Selecione ao menos uma venda ou orçamento para imprimir.');return}
  const saved=JSON.parse(localStorage.getItem('localSales')||'[]');
  const allReturns=JSON.parse(localStorage.getItem('localReturns')||'[]');
  const pages=selected.map(r=>{
    const code=r.children[1]?.textContent.trim()||'';
    const imported=(window.importedSales||[]).find(x=>String(x.code)===String(code));
    const ref=(typeof returnReferenceSales==='object'&&returnReferenceSales)?returnReferenceSales[String(code)]:null;
    const s=saved.find(x=>String(x.code)===String(code))||imported||ref;
    const docType=(s?.type||(r.children[5]?.textContent||'').replace(/NÃO APROVADO/g,'').trim()||'Venda');
    const saleDate=s?.date?formatPtDate(s.date):(r.children[4]?.textContent||'');
    const clientName=s?.client||r.children[2]?.textContent||'';
    const vendorName=s?.vendor||r.children[3]?.textContent||'';
    const totalCellText=(r.children[7]||r.children[6])?.textContent||'R$ 0,00';
    const saleTotalVal=s?.total!==undefined?Number(s.total):returnSaleTotal(totalCellText);
    const its=s?normalizedSaleItems(s,saleTotalVal):[{name:clientName,price:saleTotalVal,qty:1}];
    const rawPrs=(Array.isArray(s?.financial)&&s.financial.length)?s.financial:(Array.isArray(s?.parts)&&s.parts.length?s.parts:[{value:saleTotalVal,date:s?.date||saleDate,method:'Dinheiro',status:'A receber'}]);
    const notesText=String(s?.notes||s?.observations||'').trim();
    const returnBlock=buildReturnsPrintHtml(code);
    const notesBlock=notesText?`<h2>OBSERVAÇÕES GERAIS</h2><div class="notes-box">${escapeReturnHtml(notesText)}</div>`:'';
    return `<section class="page"><header><div class="logo">${docType} #${code}</div><div><b>Protocolo:</b> ${code}<br><b>Tipo:</b> ${docType}<br><b>Data:</b> ${saleDate}</div></header><h2>DADOS DO CLIENTE</h2><p><b>Cliente:</b> ${clientName}<br><b>Vendedor:</b> ${vendorName}</p><h2>ITENS DO PROTOCOLO (#${code})</h2><table><thead><tr><th>Produto ou serviço</th><th>Preço unitário</th><th>Quantidade</th><th>Total</th></tr></thead><tbody>${its.map(x=>`<tr><td>${x.name||''}</td><td>${money(x.price)}</td><td>${x.qty||0}</td><td>${money((x.price||0)*(x.qty||0))}</td></tr>`).join('')}</tbody></table><div class="grand">Total: ${money(saleTotalVal)}</div>${returnBlock}<h2>FINANCEIRO</h2><table><thead><tr><th>Parcela</th><th>Valor</th><th>Data de vencimento</th><th>Forma de pagamento</th><th>Status</th></tr></thead><tbody>${rawPrs.map((x,i)=>`<tr><td>${i+1}/${rawPrs.length}</td><td>${money(x.value!==undefined?x.value:(saleTotalVal/(rawPrs.length||1)))}</td><td>${formatPtDate(x.date||s?.date||saleDate)}</td><td>${x.method||'Dinheiro'}</td><td>${x.status||'A receber'}</td></tr>`).join('')}</tbody></table>${notesBlock}</section>`;
  }).join('');
  const w=window.open('','_blank','width=900,height=900');
  if(!w){appMessage('Permita pop-ups no navegador para abrir a impressão.');return}
  w.document.write(`<!doctype html><html><head><title>Gestão Piremaxx - documentos</title><style>@page{size:A4;margin:0}body{font:12px Arial;color:#243746}.page{page-break-after:always}.page:last-child{page-break-after:auto}header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #1b2886;padding:4px 0 12px}.logo{font-size:20px;font-weight:bold;color:#1b2886;text-transform:uppercase}h2{font-size:14px;color:#1b2886;border-bottom:2px solid #1b2886;padding-bottom:5px;margin-top:20px}table{width:100%;border-collapse:collapse}th{background:#1b2886;color:#fff;text-align:left}td,th{padding:8px;border-bottom:1px solid #d8dee1}.grand{text-align:right;font-size:17px;font-weight:bold;margin-top:14px;color:#1b2886}.notes-box{border:1px solid #d8dee1;padding:10px 12px;margin-top:8px;white-space:pre-wrap;background:rgba(255,255,255,.9)}</style></head><body>${pages}<script>window.onload=function(){window.print()}<\/script></body></html>`);
  w.document.close();
}
function goBackToList(){
  if(isNewRecord){
    editingCode=null;
    isNewRecord=false;
  }
  document.getElementById('newSale').classList.add('hidden');
  document.querySelector('.sales-content').classList.remove('hidden');
}
document.addEventListener('DOMContentLoaded',function(){const buttons=document.querySelectorAll('.actions button');const back=buttons[buttons.length-1];if(back)back.onclick=goBackToList});
function appMessage(message){const old=document.getElementById('appMessage');if(old)old.remove();const box=document.createElement('div');box.id='appMessage';box.innerHTML='<div class="app-message-title">Gestão Piremaxx</div><div class="app-message-body">'+message+'</div><button>OK</button>';box.querySelector('button').onclick=()=>box.remove();document.body.appendChild(box)}
function filterSalesRows(mode){localStorage.setItem('activeSalesTab',mode);document.querySelectorAll('#saleRows tr').forEach(r=>{const type=(r.children[5]?.textContent||'').replace(/NÃO APROVADO/g,'').trim().toLowerCase();r.style.display=mode==='quotes'?(type==='orçamento'?'':'none'):(type==='venda'?'':'none')});document.querySelectorAll('.tabs .tab').forEach(x=>x.classList.remove('active'));const target=document.getElementById(mode==='quotes'?'quotesTab':'salesTab');if(target)target.classList.add('active')}
function setupQuoteTab(){const tabs=document.querySelector('.tabs');if(!tabs)return;let q=document.getElementById('quotesTab');if(!q){q=document.createElement('button');q.id='quotesTab';q.className='tab';q.textContent='▣ ORÇAMENTOS';tabs.insertBefore(q,tabs.children[1])}const v=tabs.children[0];v.id='salesTab';v.onclick=function(e){e.preventDefault();filterSalesRows('sales')};q.onclick=function(e){e.preventDefault();filterSalesRows('quotes')};const h=document.querySelector('.sales-table th:nth-child(2)');if(h)h.textContent='Protocolo';document.querySelectorAll('#saleRows tr').forEach(r=>{if((r.children[5]?.textContent||'').replace(/NÃO APROVADO/g,'').trim()==='Orçamento'&&!r.querySelector('.not-approved')){const badge=document.createElement('span');badge.className='not-approved';badge.textContent='NÃO APROVADO';r.children[5].appendChild(badge)}});filterSalesRows(localStorage.getItem('activeSalesTab')==='quotes'?'quotes':'sales')}
document.addEventListener('DOMContentLoaded',setupQuoteTab);
function showOnlySales(){filterSalesRows('sales')}
document.addEventListener('DOMContentLoaded',function(){const v=document.querySelector('.tabs .tab');if(v)v.onclick=showOnlySales;if(location.hash==='#orcamentos'||localStorage.getItem('activeSalesTab')==='quotes')showOnlyQuotes();else showOnlySales()});
function showOnlyQuotes(){filterSalesRows('quotes')}
document.addEventListener('DOMContentLoaded',function(){const q=document.getElementById('quotesTab');if(q)q.onclick=showOnlyQuotes});
function setupQuoteControls(){
  const grid=document.querySelector('.form-grid'),actions=document.querySelector('.actions'),typeSelect=grid?.querySelector('select');
  if(!grid||!actions||!typeSelect)return;
  if(![...typeSelect.options].some(o=>o.value==='Devolução')){
    const opt=document.createElement('option');opt.value='Devolução';opt.textContent='Devolução';typeSelect.appendChild(opt);
  }
  let wrap=document.getElementById('quoteStatusWrap');
  if(!wrap){
    wrap=document.createElement('label');
    wrap.id='quoteStatusWrap';
    wrap.textContent='Status do orçamento';
    wrap.innerHTML+=' <select id="quoteStatus"><option value="pending">Aguardando aprovação</option><option value="approved">Aprovado</option><option value="rejected">Reprovado</option><option value="converted">Convertido em venda</option></select>';
    grid.appendChild(wrap);
    const qs=wrap.querySelector('#quoteStatus');
    if(qs){
      qs.addEventListener('change',function(){
        if(this.value==='converted'&&typeSelect.value==='Orçamento'){
          typeSelect.value='Venda';
          toggleFinance();
          setupQuoteControls();
          typeSelect.dispatchEvent(new Event('change',{bubbles:true}));
        }else if(this.value!=='converted'&&typeSelect.value==='Venda'&&wrap.dataset.wasQuote==='1'){
          typeSelect.value='Orçamento';
          toggleFinance();
          setupQuoteControls();
          typeSelect.dispatchEvent(new Event('change',{bubbles:true}));
        }
      });
    }
  }
  let convert=actions.querySelector('.convert');
  if(!convert){
    convert=document.createElement('button');
    convert.type='button';
    convert.textContent='Converter em venda';
    convert.className='convert';
    convert.onclick=function(){
      wrap.dataset.wasQuote='1';
      typeSelect.value='Venda';
      const qs=document.getElementById('quoteStatus');
      if(qs){
        qs.value='converted';
        qs.dispatchEvent(new Event('change',{bubbles:true}));
      }
      toggleFinance();
      setupQuoteControls();
      typeSelect.dispatchEvent(new Event('change',{bubbles:true}));
    };
    actions.insertBefore(convert,actions.querySelector('.save'));
  }
  let returnBtn=actions.querySelector('.return-from-sale-btn');
  if(!returnBtn){
    returnBtn=document.createElement('button');
    returnBtn.type='button';
    returnBtn.textContent='↩ Devolução';
    returnBtn.className='return-from-sale-btn';
    returnBtn.style.cssText='background:#e67e22;color:#fff;font-weight:bold';
    returnBtn.onclick=function(){
      typeSelect.value='Devolução';
      saveSale();
    };
    actions.insertBefore(returnBtn,actions.querySelector('.save'));
  }
  if(!typeSelect.dataset.quoteStatusBound){
    typeSelect.dataset.quoteStatusBound='1';
    typeSelect.addEventListener('change',function(){
      if(this.value==='Orçamento'){
        wrap.dataset.wasQuote='1';
        const qs=document.getElementById('quoteStatus');
        if(qs&&qs.value==='converted')qs.value='pending';
      }
      toggleFinance();
      setupQuoteControls();
    });
  }
  const quote=typeSelect.value==='Orçamento';
  if(quote)wrap.dataset.wasQuote='1';
  const showQuoteStatus=quote||(wrap.dataset.wasQuote==='1'&&document.getElementById('quoteStatus')?.value==='converted');
  const isExistingSale=!isNewRecord&&Boolean(editingCode)&&typeSelect.value==='Venda';
  wrap.style.display=showQuoteStatus?'':'none';
  convert.style.display=quote?'':'none';
  returnBtn.style.display=isExistingSale?'':'none';
}
document.addEventListener('DOMContentLoaded',setupQuoteControls);
function printSale(){
  const proto=editingCode||document.getElementById('saleProtocolInput')?.value||generateNextProtocolCode();
  const client=document.getElementById('client')?.value||'Consumidor final';
  const vendor=document.getElementById('vendorSelect')?.value||document.querySelectorAll('#newSale .form-grid select')[1]?.value||'Diego Miranda';
  const docType=document.querySelector('.form-grid select')?.value||'Venda';
  const saleDate=formatPtDate(document.querySelector('#newSale .form-grid input[type="date"]')?.value||todayValue());
  const notesText=(document.querySelector('#newSale .notes textarea')?.value||'').trim();
  const rows=items.filter(x=>x.name||x.price||x.qty).map(x=>'<tr><td>'+(x.name||'')+'</td><td>'+Number(x.qty||0)+'</td><td>'+money(x.price)+'</td><td>'+money((x.price||0)*(x.qty||0))+'</td></tr>').join('');
  const domInstRows=[...document.querySelectorAll('#installments .installment')];
  const instList=domInstRows.length?domInstRows.map((r,i)=>({
    value:Number(String(r.querySelector('input[type=number]')?.value||0).replace(',','.'))||0,
    date:r.querySelector('input[type=date]')?.value||todayValue(),
    method:r.querySelector('select')?.value||'Dinheiro',
    status:r.querySelector('.sale-status')?.textContent.trim()||'A receber'
  })):(parts.length?parts:[{value:total(),date:todayValue(),method:'Dinheiro',status:'A receber'}]);
  const ps=instList.map((p,i)=>'<tr><td>'+(i+1)+'/'+instList.length+'</td><td>'+money(p.value)+'</td><td>'+formatPtDate(p.date)+'</td><td>'+(p.method||'Dinheiro')+'</td><td>'+(p.status||'A receber')+'</td></tr>').join('');
  const returnBlock=buildReturnsPrintHtml(proto);
  const notesHtml=notesText?'<h2>Observações gerais</h2><div class="box" style="white-space:pre-wrap">'+escapeReturnHtml(notesText)+'</div>':'';
  const w=window.open('','_blank','width=900,height=700');
  if(!w){alert('Permita pop-ups para imprimir o documento.');return}
  w.document.write('<!doctype html><html><head><title>Documento de '+docType+' #'+proto+'</title><style>@page{size:A4;margin:0}body{font:13px Arial;color:#263746}header{border-bottom:2px solid #1b2886;padding-bottom:12px;display:flex;justify-content:space-between;align-items:center}h1{color:#1b2886;margin:0;font-size:20px;text-transform:uppercase}h2{font-size:15px;margin-top:24px;color:#1b2886;border-bottom:2px solid #1b2886;padding-bottom:4px}table{width:100%;border-collapse:collapse;margin-top:10px}th{background:#1b2886;color:#fff;text-align:left}th,td{padding:9px;border-bottom:1px solid #d8dee1}.total{text-align:right;font-size:18px;font-weight:bold;margin-top:18px;color:#1b2886}.box{border:1px solid #d8dee1;padding:12px;margin-top:10px}@media print{button{display:none}}</style></head><body><header><div><h1>'+docType+' #'+proto+'</h1></div><div><b>Protocolo:</b> '+proto+'<br><b>Cliente:</b> '+client+'<br><b>Vendedor:</b> '+vendor+'<br><b>Data:</b> '+saleDate+'</div></header><h2>Itens da '+docType.toLowerCase()+'</h2><table><thead><tr><th>Produto ou serviço</th><th>Quantidade</th><th>Preço unitário</th><th>Total</th></tr></thead><tbody>'+rows+'</tbody></table><div class="total">Total: '+money(total())+'</div>'+returnBlock+'<h2>Financeiro</h2><table><thead><tr><th>Parcela</th><th>Valor</th><th>Vencimento</th><th>Forma de pagamento</th><th>Status</th></tr></thead><tbody>'+ps+'</tbody></table>'+notesHtml+'<div class="box">Documento emitido por Piremaxx Pneus.</div><script>window.onload=function(){window.print()}<\/script></body></html>');
  w.document.close();
}
function showHistory(){alert('Histórico da venda\n\nRegistro criado e mantido no armazenamento local.')}function generateNFe(){alert('Geração de NF-e disponível para integração fiscal.')} 
document.addEventListener('DOMContentLoaded',function(){const a=document.querySelector('.actions');if(!a)return;const h=document.createElement('button');h.textContent='▣ Ver histórico';h.onclick=showHistory;const p=document.createElement('button');p.textContent='▣ Imprimir';p.onclick=printSale;const n=document.createElement('button');n.textContent='▧ Gerar NFe';n.onclick=generateNFe;a.insertBefore(h,a.firstChild);a.insertBefore(p,a.children[1]);a.insertBefore(n,a.children[2])});
document.addEventListener('click',function(e){
  const row=e.target.closest('#saleRows tr');
  if(!row||row.dataset.returnRow||row.id==='returnsEmptyRow'||e.target.closest('input,button,a'))return;
  const code=row.children[1]?.textContent.trim();
  if(code)openExistingSaleRecord(code,row);
});
document.title='Gestão Piremaxx';
const originalToggleFinance=toggleFinance;toggleFinance=function(){originalToggleFinance();const sel=document.querySelector('.form-grid select');const status=document.getElementById('quoteStatusWrap');if(status){const show=(sel&&sel.value==='Orçamento')||(status.dataset.wasQuote==='1'&&document.getElementById('quoteStatus')?.value==='converted');status.style.display=show?'':'none'}};
document.addEventListener('DOMContentLoaded',function(){const b=document.querySelector('.toolbar .new-btn');if(!b||b.querySelector('.new-action-icon'))return;b.innerHTML='<img class="new-action-icon" src="public/icons/icons8-add-48.png" alt=""> Nova';const s=document.createElement('style');s.textContent='.new-action-icon{width:18px;height:18px;object-fit:contain;vertical-align:-4px;margin-right:4px}';document.head.appendChild(s)});
document.addEventListener('DOMContentLoaded',function(){const nav=document.querySelector('.sidebar nav');if(nav&&!nav.querySelector('.dashboard-link')&&!nav.querySelector('a[href="index.html"] b')){const a=document.createElement('a');a.className='dashboard-link';a.href='index.html';a.innerHTML='<img class="side-icon" src="public/icons/icons8-home-48.png"><b>Indicadores</b>';nav.insertBefore(a,nav.firstElementChild)}});
document.addEventListener('DOMContentLoaded',function(){const css=document.createElement('style');css.textContent='.installment{display:grid;grid-template-columns:.55fr 1fr 1fr 1.3fr 1fr 34px 34px;gap:8px;align-items:center;margin:5px 0}.installment input,.installment select{height:28px;border:1px solid #cbd1d4;color:#496a79;padding:4px}.sale-finance-more,.sale-finance-remove{height:28px;border:0;border-radius:3px}.sale-finance-more{background:#fff;color:#587383}.sale-finance-remove{background:#e94e50;color:#fff}.sale-finance-due{background:#ddd!important;color:#587383!important}.sale-row-options{position:absolute;z-index:30;background:#fff;border:1px solid #aaa;box-shadow:0 3px 8px #888;padding:0 10px 10px;width:230px}.sale-row-options b{display:block;background:#238eaa;color:#fff;margin:0 -10px 8px;padding:7px}.sale-row-options label{display:block;margin:5px 0;font-size:11px}.sale-row-options select,.sale-row-options input{display:block;width:100%;height:27px;margin-top:3px}';document.head.appendChild(css);function rows(){return [...document.querySelectorAll('#installments .installment')]}function syncPartsFromDOM(){const rs=rows();rs.forEach((r,i)=>{if(!parts[i])parts[i]={days:i*30};const num=r.querySelector('input[type=number]'),dt=r.querySelector('input[type=date]'),sel=r.querySelector('select'),st=r.querySelector('.sale-status');if(num){parts[i].value=Number(num.value)||0;parts[i].edited=num.dataset.edited==='1'}if(dt){parts[i].date=dt.value;if(dt.dataset.edited==='1')parts[i].dateEdited=true}if(sel)parts[i].method=sel.value;if(st)parts[i].status=st.textContent.trim()})}function distribute(){const rs=rows();if(!rs.length)return;const v=total();const needsInitialSplit=parts.every(p=>!p.edited&&!p.loaded&&(!p.value||Number(p.value)===0));if(needsInitialSplit){const cents=Math.round(v*100),count=rs.length,base=count?Math.floor(cents/count):0,rest=count?(cents%count):0;rs.forEach((r,i)=>{const f=r.querySelector('input[type=number]');const valStr=((base+(i<rest?1:0))/100).toFixed(2);if(f)f.value=valStr;if(parts[i])parts[i].value=Number(valStr)})}const formDate=document.querySelector('.form-grid input[type="date"]')?.value||todayValue();rs.forEach((r,i)=>{const span=r.querySelector('span');if(span)span.textContent=(i+1)+'/'+rs.length;const d=r.querySelector('input[type=date]');if(d&&!d.dataset.edited&&!d.value){try{const partsD=(formDate||'2026-10-16').split('-'),dt=new Date(Number(partsD[0]),Number(partsD[1])-1,Number(partsD[2]));dt.setMonth(dt.getMonth()+i);d.value=dt.toISOString().slice(0,10)}catch(e){d.value=formDate}}if(parts[i]){if(d)parts[i].date=d.value;const sel=r.querySelector('select');if(sel)parts[i].method=sel.value;const st=r.querySelector('.sale-status');if(st)parts[i].status=st.textContent.trim()}});const sumAll=rs.reduce((s,r)=>s+(Number(r.querySelector('input[type=number]')?.value)||0),0);const ft=document.getElementById('financeTotal');if(ft)ft.textContent=money(sumAll)}window.renderParts=function(){if(!parts.length)parts=[{days:0,value:total(),edited:false}];const el=document.getElementById('installments');if(!el)return;const formDate=document.querySelector('.form-grid input[type="date"]')?.value||todayValue();const methods=['Dinheiro','Cheque','Boleto','Cartão crédito','Cartão débito','Pix','Transferência eletrônica'];el.innerHTML=parts.map((p,i)=>{const isEdited=Boolean(p.edited);const val=(p.value!==undefined&&p.value!==null)?Number(p.value).toFixed(2):'0.00';const dateVal=p.date||(function(){try{const partsD=(formDate||'2026-10-16').split('-'),dt=new Date(Number(partsD[0]),Number(partsD[1])-1,Number(partsD[2]));dt.setMonth(dt.getMonth()+i);return dt.toISOString().slice(0,10)}catch(e){return formDate}})();const method=p.method||'Dinheiro';const status=p.status||'A receber';const isDue=status!=='Recebido';return '<div class="installment"><span>'+(i+1)+'/'+parts.length+'</span><input type="number" step=".01" value="'+val+'"'+(isEdited?' data-edited="1"':'')+'><input type="date" value="'+dateVal+'"'+(p.dateEdited||p.date?' data-edited="1"':'')+'><select>'+methods.map(m=>'<option'+(m===method?' selected':'')+'>'+m+'</option>').join('')+'</select><button type="button" class="sale-status'+(isDue?' sale-finance-due':'')+'">'+status+'</button><button type="button" class="sale-finance-more">⚙</button><button type="button" class="sale-finance-remove">▥</button></div>'}).join('');distribute()};window.setPlan=function(n){parts=Array.from({length:n},(_,i)=>({days:i*30,value:0,edited:false,loaded:false}));renderParts();togglePlans()};window.addInstallment=function(){syncPartsFromDOM();const tot=total();const editedParts=parts.filter(p=>p.edited);const sumEdited=editedParts.reduce((s,p)=>s+(Number(p.value)||0),0);parts.push({days:parts.length*30,value:0,edited:false,loaded:false});if(!editedParts.length||sumEdited>=tot){const cents=Math.round(tot*100),count=parts.length,base=count?Math.floor(cents/count):0,rest=count?(cents%count):0;parts.forEach((p,i)=>{p.edited=false;p.loaded=true;p.value=Number(((base+(i<rest?1:0))/100).toFixed(2))})}else{const unedited=parts.filter(p=>!p.edited);const remainCents=Math.max(0,Math.round((tot-sumEdited)*100)),count=unedited.length,base=count?Math.floor(remainCents/count):0,rest=count?(remainCents%count):0;unedited.forEach((p,i)=>{p.loaded=true;p.value=Number(((base+(i<rest?1:0))/100).toFixed(2))})}renderParts()};document.addEventListener('click',function(e){const st=e.target.closest('.sale-status');if(st){st.classList.toggle('sale-finance-due');st.textContent=st.classList.contains('sale-finance-due')?'A receber':'Recebido';syncPartsFromDOM();return}const rm=e.target.closest('.sale-finance-remove');if(rm){const rs=rows();if(rs.length>1){syncPartsFromDOM();const removeIdx=rs.indexOf(rm.closest('.installment'));parts.splice(removeIdx,1);const tot=total(),editedParts=parts.filter(p=>p.edited),sumEdited=editedParts.reduce((s,p)=>s+(Number(p.value)||0),0);if(!editedParts.length){const cents=Math.round(tot*100),count=parts.length,base=count?Math.floor(cents/count):0,rest=count?(cents%count):0;parts.forEach((p,i)=>{p.value=Number(((base+(i<rest?1:0))/100).toFixed(2));p.loaded=true})}else{const unedited=parts.filter(p=>!p.edited);if(unedited.length){const remainCents=Math.max(0,Math.round((tot-sumEdited)*100)),count=unedited.length,base=Math.floor(remainCents/count),rest=remainCents%count;unedited.forEach((p,i)=>{p.value=Number(((base+(i<rest?1:0))/100).toFixed(2));p.loaded=true})}else if(parts.length>0){const lastIdx=parts.length-1;let sumBeforeLast=0;for(let i=0;i<lastIdx;i++)sumBeforeLast+=Number(parts[i].value)||0;parts[lastIdx].value=Number(Math.max(0,tot-sumBeforeLast).toFixed(2))}}renderParts()}return}const more=e.target.closest('.sale-finance-more');if(more){const row=more.closest('.installment'),old=row.querySelector('.sale-row-options');if(old){old.remove();return}const p=document.createElement('div');p.className='sale-row-options';p.innerHTML='<b>Mais opções</b><label>Plano de contas<select><option>Vendas</option><option>Receitas de vendas</option><option>Outras receitas</option></select></label><label>Forma de pagamento<select><option>Dinheiro</option><option>Cheque</option><option>Boleto</option><option>Cartão crédito</option><option>Cartão débito</option><option>Pix</option><option>Sem documento</option></select></label><label>Número do documento<input></label><button type="button">✓</button> <button type="button">×</button>';row.style.position='relative';row.appendChild(p);p.querySelectorAll('button').forEach(b=>b.onclick=()=>p.remove())}});document.addEventListener('input',function(e){const f=e.target;if(!f.closest('.installment'))return;const rs=rows(),idx=rs.indexOf(f.closest('.installment'));if(idx<0)return;if(f.type==='number'){f.dataset.edited='1';const currentVal=Number(f.value)||0;if(parts[idx]){parts[idx].value=currentVal;parts[idx].edited=true;parts[idx].loaded=true}const subsequentCount=rs.length-1-idx;if(subsequentCount>0){let sumPrior=0;for(let i=0;i<=idx;i++){sumPrior+=Number(rs[i]?.querySelector('input[type=number]')?.value)||0}const remain=Math.max(0,total()-sumPrior),remainCents=Math.round(remain*100),base=Math.floor(remainCents/subsequentCount),rest=remainCents%subsequentCount;for(let j=0;j<subsequentCount;j++){const subIdx=idx+1+j,subRow=rs[subIdx],subInput=subRow?.querySelector('input[type=number]'),cents=base+(j<rest?1:0),valStr=(cents/100).toFixed(2);if(subInput){subInput.value=valStr;delete subInput.dataset.edited}if(parts[subIdx]){parts[subIdx].value=Number(valStr);parts[subIdx].edited=false;parts[subIdx].loaded=true}}}const sumAll=rs.reduce((s,r)=>s+(Number(r.querySelector('input[type=number]')?.value)||0),0);const ft=document.getElementById('financeTotal');if(ft)ft.textContent=money(sumAll)}else if(f.type==='date'){f.dataset.edited='1';if(parts[idx]){parts[idx].date=f.value;parts[idx].dateEdited=true}}});document.addEventListener('change',function(e){const f=e.target;if(!f.closest('.installment'))return;const rs=rows(),idx=rs.indexOf(f.closest('.installment'));if(idx>=0&&parts[idx]){if(f.tagName==='SELECT')parts[idx].method=f.value}})});
document.addEventListener('DOMContentLoaded',function(){const p=document.getElementById('plans');if(!p||p.dataset.entryOptions)return;p.dataset.entryOptions='1';[['Entrada + 15, 30, 60 dias',4],['Entrada + 30, 60, 90 dias',4],['Entrada + 30, 60, 90, 120 dias',5]].forEach(x=>{const b=document.createElement('button');b.type='button';b.textContent=x[0];b.onclick=function(){parts=Array.from({length:x[1]},(_,i)=>({days:i*30}));renderParts();togglePlans()};p.appendChild(b)})});
document.addEventListener('DOMContentLoaded',function(){document.addEventListener('click',function(e){const b=e.target.closest('.sale-status');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const row=b.closest('.installment'),amount=Number(row?.querySelector('input[type=number]')?.value)||0,key='salePaid:'+[...document.querySelectorAll('#installments .installment')].indexOf(row),paid=JSON.parse(localStorage.getItem('salePaidRows')||'{}');if(paid[key]){delete paid[key];localStorage.setItem('localCashBalance',String((Number(localStorage.getItem('localCashBalance')||0)-amount)));b.textContent='A receber';b.classList.add('sale-finance-due')}else{paid[key]=true;localStorage.setItem('salePaidRows',JSON.stringify(paid));localStorage.setItem('localCashBalance',String((Number(localStorage.getItem('localCashBalance')||0)+amount)));b.textContent='Recebido';b.classList.remove('sale-finance-due')}localStorage.setItem('salePaidRows',JSON.stringify(paid))},true)});
document.addEventListener('DOMContentLoaded',function(){const s=document.createElement('style');s.textContent='.finance-head span:nth-child(3){font-size:0}.finance-head span:nth-child(3):after{content:"Data de pagamento";font-size:12px}.sale-status{height:28px!important;border:0!important;border-radius:3px!important;background:#337fba!important;color:#fff!important;text-align:center;cursor:pointer}.sale-finance-due{background:#ddd!important;color:#587383!important}';document.head.appendChild(s);const h=document.querySelector('.finance-head');if(h){const spans=h.querySelectorAll('span');if(spans[3])spans[3].textContent='Conta de origem';if(spans[4])spans[4].textContent='Status'}});
document.addEventListener('DOMContentLoaded',function(){const a=[...document.querySelectorAll('.sidebar nav a')].find(x=>x.textContent.includes('Clientes'));if(a)a.href='clientes.html'});
document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){const body=document.getElementById('saleRows'),table=document.querySelector('.sales-table');if(!body||body.children.length||table?.dataset.returnsView==='1')return;const source=window.importedSales||[],saved=JSON.parse(localStorage.getItem('localSales')||'[]'),rows=[...saved,...source.map(s=>({code:s.code,client:s.client,vendor:s.vendor||'Diego Miranda',date:(s.date||'2026-10-15').split('-').reverse().join('/'),type:s.type||'Venda',total:s.total||0}))];body.innerHTML=rows.map(s=>'<tr><td><input type="checkbox" class="sale-select"></td><td>'+s.code+'</td><td>'+s.client+'</td><td>'+s.vendor+'</td><td>'+s.date+'</td><td>'+s.type+'</td><td>'+money(s.total)+'</td></tr>').join('');if(typeof installSelection==='function')installSelection();if(typeof filterSalesRows==='function')filterSalesRows(localStorage.getItem('activeSalesTab')==='quotes'?'quotes':'sales')},350)});
document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){const wa=document.querySelector('.list-tools button[title="WhatsApp"]');if(!wa)return;wa.onclick=function(){const c=document.querySelector('.sale-select:checked')?.closest('tr');if(!c){appMessage('Selecione uma venda para enviar via WhatsApp.');return}const code=c.children[1].textContent.trim(),url=location.origin+'/venda-pdf.html?code='+encodeURIComponent(code),old=document.getElementById('whatsappSaleModal');if(old)old.remove();const m=document.createElement('div');m.id='whatsappSaleModal';m.className='whatsapp-sale-modal';m.innerHTML='<div class="whatsapp-sale-card"><header>Envio via WhatsApp <button class="wa-close">×</button></header><div class="wa-alert">O documento PDF ficará disponível pelo link enviado na mensagem.</div><label>Mensagem<textarea>Olá! Aqui é da empresa DNFX - COMERCIO DE PNEUS.\n\nEstou enviando o PDF da venda nº '+code+'.\n\nAcesse o documento: '+url+'</textarea></label><div class="wa-phone"><label>Número:<input></label></div><footer><button class="wa-send">Enviar</button><button class="wa-back">Voltar</button></footer></div>';document.body.appendChild(m);m.querySelector('.wa-close').onclick=()=>m.remove();m.querySelector('.wa-back').onclick=()=>m.remove();m.querySelector('.wa-send').onclick=function(){const n=m.querySelector('input').value.replace(/\D/g,'');if(!n){appMessage('Informe o número para enviar via WhatsApp.');return}window.open('https://wa.me/'+n+'?text='+encodeURIComponent(m.querySelector('textarea').value),'_blank');m.remove()}}},650)});
document.addEventListener('DOMContentLoaded',function(){const body=document.getElementById('saleRows');if(!body)return;function restore(){body.querySelectorAll('tr').forEach(r=>{const c=r.children[0];if(c&&!c.querySelector('input')&&r.children.length>2)c.innerHTML='<input type="checkbox" class="sale-select">'})}restore();new MutationObserver(restore).observe(body,{childList:true,subtree:true})});
document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){const table=document.querySelector('.sales-table'),head=table?.querySelector('thead tr'),del=document.querySelector('.list-tools button[title="Excluir"]'),body=document.getElementById('saleRows');if(!head||!body)return;const first=head.children[0];if(first&&!first.querySelector('.sale-select-all')){first.innerHTML='<input type="checkbox" class="sale-select-all" title="Selecionar todas">';first.querySelector('input').onclick=function(){body.querySelectorAll('.sale-select').forEach(x=>x.checked=this.checked)}}if(del)del.onclick=deleteSelectedSales},900)});
document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){const removed=JSON.parse(localStorage.getItem('deletedSales')||'[]'),body=document.getElementById('saleRows');if(body)body.querySelectorAll('tr').forEach(r=>{if(removed.includes(r.children[1]?.textContent.trim()))r.remove()})},1000)});
document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){const body=document.getElementById('saleRows'),source=window.importedSales||[];if(!body||!source.length||body.querySelector('tr'))return;body.innerHTML=source.map(s=>'<tr><td><input type="checkbox" class="sale-select"></td><td>'+s.code+'</td><td>'+s.client+'</td><td>'+(s.vendor||'Diego Miranda')+'</td><td>'+((s.date||'').split('-').reverse().join('/'))+'</td><td>'+(s.type||'Venda')+'</td><td>'+money(s.total)+'</td></tr>').join('');if(typeof installSelection==='function')installSelection();if(typeof setupQuoteTab==='function')setupQuoteTab()},1300)});
document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){const nav=document.querySelector('.sidebar nav');if(nav&&!nav.querySelector('img')){const links=[['Indicadores','index.html','icons8-home-48.png'],['Financeiro','index.html','icons8-financial-64.png'],['Vendas','vendas.html','icons8-buy-for-cash-48.png'],['Compras','compras.html','icons8-buy-48.png'],['Clientes','clientes.html','icons8-budget-48.png'],['Produtos','#','icons8-product-48.png'],['Boletos','#','icons8-boleto-bancário-48.png'],['Cobranças','#','icons8-billing-32.png'],['Pix','#','icons8-pix-48.png'],['NF-e / Fiscal','#','icons8-fiscal-50.png'],['Relatórios','#','icons8-business-report-94.png'],['Configurações','#','icons8-settings-48.png'],['Suporte online','#','icons8-question-48.png']];nav.innerHTML=links.map(x=>'<a href="'+x[1]+'"><img src="public/icons/'+x[2]+'" alt=""><b>'+x[0]+'</b></a>').join('');nav.querySelectorAll('a').forEach(a=>{if(a.textContent.includes('Vendas'))a.classList.add('active')})}document.querySelectorAll('.list-tools button[title]').forEach(b=>{const title=b.title;if(!b.querySelector('img')){const map={'Clonar venda':'icons8-copy.gif','Gerar NFe':'icons8-nf.gif','Excluir':'icons8-trash.gif','Editar':'icons8-edit-pencil.gif','WhatsApp':'icons8-whatsapp.gif','Imprimir':'icons8-print.gif'},file=map[title];if(file)b.innerHTML='<img src="public/icons/'+file+'" alt="'+title+'" class="local-action-icon">'}})},1100)});
document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){const a=[...document.querySelectorAll('.sidebar nav a')].find(x=>x.textContent.includes('Suporte'));if(a&&!a.querySelector('span')&&!a.querySelector('img'))a.insertBefore(document.createTextNode('❔ '),a.firstChild)},1200)});
document.addEventListener('DOMContentLoaded',function(){const s=document.createElement('style');s.textContent='.sidebar nav a{display:flex!important;align-items:center!important;min-height:32px!important}.sidebar nav a>img{width:16px!important;height:16px!important;max-width:16px!important;object-fit:contain!important;vertical-align:middle!important;margin-right:8px!important}.sidebar nav a b{line-height:16px!important}';document.head.appendChild(s)});
document.addEventListener('DOMContentLoaded',function(){const key='salesBatchDeleteMigrationV2';if(!localStorage.getItem(key)){localStorage.removeItem('deletedSales');localStorage.setItem(key,'1')}});
/* Status real dos orçamentos: não marcar orçamento automaticamente como não autorizado. */
(function(){
  const labels={pending:'AGUARDANDO APROVAÇÃO',approved:'APROVADO',rejected:'REPROVADO',converted:'CONVERTIDO EM VENDA'};
  function ensureStatusColumn(){const table=document.querySelector('.sales-table'),head=table?.querySelector('thead tr'),body=document.getElementById('saleRows');if(!table||table.dataset.returnsView==='1'||!head||!body)return;let statusHead=head.querySelector('[data-quote-status-head]');if(!statusHead){statusHead=document.createElement('th');statusHead.dataset.quoteStatusHead='1';statusHead.textContent='Status';const totalHead=[...head.children].find(x=>x.textContent.trim().toLowerCase()==='total');if(totalHead)head.insertBefore(statusHead,totalHead);else head.appendChild(statusHead)}body.querySelectorAll('tr').forEach(row=>{if(row.children.length<6)return;let statusCell=row.querySelector('[data-quote-status-cell]');if(!statusCell){statusCell=document.createElement('td');statusCell.dataset.quoteStatusCell='1';const totalCell=row.children[6];if(totalCell)row.insertBefore(statusCell,totalCell);else row.appendChild(statusCell)}const oldBadge=row.children[5]?.querySelector('.quote-status');if(oldBadge)statusCell.appendChild(oldBadge)})}
  function rowType(row){return (row?.children[5]?.childNodes[0]?.textContent||row?.children[5]?.textContent||'').trim().toLowerCase()}
  function statusFor(row){const code=row?.children[1]?.textContent.trim();const saved=JSON.parse(localStorage.getItem('localSales')||'[]').find(x=>String(x.code)===code);const imported=(window.importedSales||[]).find(x=>String(x.code)===code);return saved?.quoteStatus||saved?.status||imported?.quoteStatus||imported?.status||'pending'}
  function refreshQuoteBadges(){ensureStatusColumn();document.querySelectorAll('#saleRows tr').forEach(row=>{row.querySelectorAll('.not-approved').forEach(x=>x.remove());const type=(row.cells[5]?.textContent||'').trim().toLowerCase();if(type!=='orçamento'){row.querySelectorAll('.quote-status').forEach(x=>x.remove());return}let cell=row.querySelector('[data-quote-status-cell]');if(!cell){cell=document.createElement('td');cell.dataset.quoteStatusCell='1';row.insertBefore(cell,row.cells[row.cells.length-1]||null)}const status=statusFor(row),label=labels[status]||status.toUpperCase(),existing=cell.querySelector('.quote-status');if(existing&&existing.textContent===label&&existing.classList.contains('quote-status-'+status))return;cell.querySelectorAll('.quote-status').forEach(x=>x.remove());const badge=document.createElement('span');badge.className='quote-status quote-status-'+status;badge.textContent=label;cell.appendChild(badge)})}window.refreshSalesTableDecorations=refreshQuoteBadges;
  const oldFilter=filterSalesRows;
  filterSalesRows=function(mode){if(localStorage.getItem('activeSalesTab')==='returns'||document.querySelector('.sales-table')?.dataset.returnsView==='1')return;const targetMode=mode==='quotes'?'quotes':'sales';localStorage.setItem('activeSalesTab',targetMode);if(typeof window.setSalesPaginationMode==='function')window.setSalesPaginationMode(targetMode,false);ensureStatusColumn();refreshQuoteBadges();document.querySelectorAll('#saleRows tr').forEach(r=>{if(r.id==='returnsEmptyRow')return;const hide=targetMode==='quotes'?rowType(r)!=='orçamento':rowType(r)!=='venda';r.hidden=hide;r.classList.toggle('hidden',hide);r.style.display=hide?'none':''});document.querySelectorAll('.tabs .tab').forEach(x=>x.classList.remove('active'));const target=document.getElementById(targetMode==='quotes'?'quotesTab':'salesTab');if(target)target.classList.add('active')};
  const oldSetupQuoteTab=setupQuoteTab;
  setupQuoteTab=function(){oldSetupQuoteTab();refreshQuoteBadges();filterSalesRows(localStorage.getItem('activeSalesTab')==='quotes'?'quotes':'sales')};
  document.addEventListener('click',function(e){const tab=e.target.closest('#salesTab,#quotesTab');if(tab&&location.hash==='#devolVendas')history.replaceState(null,'',location.pathname+location.search)},true);
  const oldSaveSale=saveSale;
  saveSale=function(){oldSaveSale();setTimeout(refreshQuoteBadges,0)};
  document.addEventListener('DOMContentLoaded',function(){const s=document.getElementById('quoteStatus');if(s)s.innerHTML='<option value="pending">Aguardando aprovação</option><option value="approved">Aprovado</option><option value="rejected">Reprovado</option><option value="converted">Convertido em venda</option>';setTimeout(function(){refreshQuoteBadges();filterSalesRows(localStorage.getItem('activeSalesTab')==='quotes'?'quotes':'sales')},0)});
  document.addEventListener('click',function(e){const tab=e.target.closest('#salesTab,#quotesTab');if(!tab)return;e.preventDefault();const mode=tab.id==='quotesTab'?'quotes':'sales';if(typeof window.restoreSalesView==='function')window.restoreSalesView();localStorage.setItem('activeSalesTab',mode);if(typeof window.setSalesPaginationMode==='function')window.setSalesPaginationMode(mode,true);filterSalesRows(mode)},true);
  document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){setupQuoteControls();ensureStatusColumn();refreshQuoteBadges();filterSalesRows(localStorage.getItem('activeSalesTab')==='quotes'?'quotes':'sales')},0)});
  document.addEventListener('change',function(e){if(e.target.id!=='quoteStatus')return;e.target.classList.toggle('quote-status-approved',e.target.value==='approved');e.target.classList.toggle('quote-status-pending',e.target.value==='pending');e.target.classList.toggle('quote-status-rejected',e.target.value==='rejected');e.target.classList.toggle('quote-status-converted',e.target.value==='converted')});
})();

/* Navegação: abrir vendas.html mostra as três abas; Devoluções usa a rota própria. */
document.addEventListener('click',function(e){
  const tab=e.target.closest('#returnsTab,#salesTab,#quotesTab');
  if(!tab)return;
  if(tab.id==='returnsTab')history.replaceState(null,'','#devolVendas');
  else if(location.hash==='#devolVendas')history.replaceState(null,'',location.pathname+location.search);
},true);
document.addEventListener('DOMContentLoaded',function(){
  if(location.hash==='#devolVendas')return;
  if(localStorage.getItem('activeSalesTab')==='returns'){
    localStorage.setItem('activeSalesTab','sales');
    document.getElementById('quotesTab')?.removeAttribute('hidden');
    if(typeof window.restoreSalesView==='function')window.restoreSalesView();
    if(typeof filterSalesRows==='function')filterSalesRows('sales');
  }
});
  document.addEventListener('DOMContentLoaded',function(){
    const salesTab=document.getElementById('salesTab'),returnsTab=document.getElementById('returnsTab');
    if(salesTab)salesTab.innerHTML='<img class="tab-action-icon" src="public/icons/icons8-buy-48.png" alt=""> VENDAS';
    if(returnsTab)returnsTab.innerHTML='<span class="tab-undo-icon">↩</span> DEVOLUÇÕES';
  });
let returnWizardState={step:1,sale:null,products:[],keywords:'',notes:'',finance:'none'};
function returnMoney(value){return typeof money==='function'?money(Number(value)||0):'R$ '+(Number(value)||0).toFixed(2).replace('.',',')}
function returnSaleTotal(value){if(typeof value==='number')return value;return Number(String(value||'').replace(/[^0-9,.-]/g,'').replace(/\./g,'').replace(',','.'))||0}
const returnReferenceSales={
  '3226':{client:'934 - EXPRESSO - SEPETIBA',date:'2026-10-15',total:3620.98,items:[
    {code:'15',name:'A-107-185/70/R14',qty:3,total:495},
    {code:'91',name:'A-104-175/70/R14',qty:2,total:330},
    {code:'11',name:'A-103-175/65/R14',qty:4,total:660},
    {code:'14',name:'A-106-185/65/R14',qty:2,total:330},
    {code:'17',name:'A-109-185/60/R15',qty:4,total:660},
    {code:'18',name:'A-110-185/60/R15',qty:4,total:660},
    {code:'31',name:'A-123-235/60/R16',qty:2,total:485.98}
  ]}
};
function findReturnSale(code){
  const key=String(code||'').trim();
  const local=JSON.parse(localStorage.getItem('localSales')||'[]');
  const localHit=local.find(x=>String(x.code).trim()===key);
  if(localHit)return localHit;
  const reference=returnReferenceSales[key];
  const importedHit=(window.importedSales||[]).find(x=>String(x.code).trim()===key);
  if(importedHit)return reference?Object.assign({},reference,importedHit):importedHit;
  const base=sales.find(x=>String(x[0]).trim()===key);
  return base?Object.assign({code:base[0],client:base[1],vendor:base[2],date:String(base[3]||'').split('/').reverse().join('-'),type:base[4],total:returnSaleTotal(base[5])},reference||{}):null;
}
function normalizedSaleItems(sale,fallbackTotal){
  const asList=function(value){return Array.isArray(value)?value:value?[value]:[]};
  const raw=asList(sale?.items).length?asList(sale.items):asList(sale?.products).length?asList(sale.products):asList(sale?.itens).length?asList(sale.itens):asList(sale?.produtos);
  if(raw.length)return raw.map(function(x){const qty=Number(x.qty??x.quantity??x.quantidade)||0,total=Number(x.total??x.value??x.valor)||0,price=Number(x.price??x.unitPrice??x.preco??x.valorUnitario)||(qty>0?total/qty:0);return{code:x.code??x.codigo??'',name:x.name??x.item??x.description??x.descricao??'Produto/serviço',type:x.type??x.tipo??'Produto',price,qty,total:price*qty,selected:true}});
  const total=Number(fallbackTotal??sale?.total)||0;
  return[{code:'',name:sale?.description||sale?.item||'Registro importado',type:'Produto',price:total,qty:total?1:0,total,selected:true}];
}
function returnProducts(sale){
  const saleItems=Array.isArray(sale?.items)?sale.items:sale?.items?[sale.items]:[];
  if(saleItems.length)return saleItems.map((x,i)=>{const qty=Math.max(0,Number(x.qty)||0),unit=Number(x.price)||0,total=Number(x.total)||(unit*qty);return{code:x.code||String(i+1),item:x.name||'Produto',originalQty:qty,total,returnQty:0}}).filter(x=>x.originalQty>0);
  return[{code:'1',item:'175/70/r13',originalQty:10,total:Number(sale?.total)||0,returnQty:0}]
}
function returnWizardRoot(){let root=document.getElementById('returnWizard');if(!root){root=document.createElement('section');root.id='returnWizard';root.className='return-wizard hidden';document.querySelector('main')?.append(root)}return root}
function showReturn(){document.querySelector('.sales-content')?.classList.add('hidden');document.getElementById('newSale')?.classList.add('hidden');const root=returnWizardRoot();root.classList.remove('hidden');returnWizardState={step:1,sale:null,products:[],keywords:'',notes:'',finance:'none'};renderReturnStep1()}
function closeReturnWizard(){document.getElementById('returnWizard')?.classList.add('hidden');document.querySelector('.sales-content')?.classList.remove('hidden')}
function returnHeader(){return'<div class="return-header"><strong>Nova devolução</strong><button type="button" class="return-close">×</button></div>'}
function renderReturnStep1(){const root=returnWizardRoot();root.innerHTML=returnHeader()+'<div class="return-panel return-step-one"><label>Informe o código da venda para buscar os dados</label><div class="return-search-line"><span class="return-input-icon">▤</span><input class="return-code-input" autocomplete="off"><button type="button" class="return-search-button">Buscar</button></div></div><div class="return-actions"><button type="button" class="return-next">Próximo passo »</button><button type="button" class="return-back">Voltar</button></div>';wireReturnStep1(root)}
function wireReturnStep1(root){root.querySelector('.return-close').onclick=closeReturnWizard;root.querySelector('.return-back').onclick=closeReturnWizard;root.querySelector('.return-search-button').onclick=searchReturnSale;root.querySelector('.return-next').onclick=function(){if(returnWizardState.sale)renderReturnStep2();else searchReturnSale()};root.querySelector('.return-code-input').onkeydown=function(e){if(e.key==='Enter')searchReturnSale()};root.querySelector('.return-code-input').focus()}
function searchReturnSale(){const root=returnWizardRoot(),input=root.querySelector('.return-code-input'),code=input?.value.trim();if(!code){appMessage('Informe o código da venda.');return}const sale=findReturnSale(code);if(!sale){appMessage('Venda não encontrada.');return}returnWizardState.sale=sale;returnWizardState.products=returnProducts(sale);renderReturnStep2()}
function returnSaleInfo(){const s=returnWizardState.sale||{};return'<div class="return-sale-info"><b>Venda código '+s.code+'</b><br>Cliente: '+(s.client||'')+'<br>Data venda: '+((s.date||'').split('-').reverse().join('/')||'')+'<br>Valor: '+returnMoney(s.total)+'</div>'}
function renderReturnStep2(){const root=returnWizardRoot(),s=returnWizardState.sale;root.innerHTML=returnHeader()+'<div class="return-panel return-step-two"><div class="return-top-row"><div><label>Informe o código da venda para buscar os dados</label><div class="return-search-line"><span class="return-input-icon">▤</span><input class="return-code-input" value="'+s.code+'"><button type="button" class="return-search-button">Buscar</button></div></div>'+returnSaleInfo()+'</div><h3>Lista de produtos</h3><div class="return-product-head"><span>Cód</span><span>Item</span><span>Quant original</span><span>$ total</span><span>Devolver</span><span></span><span>$ proporcional</span></div><div class="return-product-list">'+returnWizardState.products.map((p,i)=>'<div class="return-product-row" data-index="'+i+'"><span>'+p.code+'</span><span>'+p.item+'</span><span>'+p.originalQty+'</span><span>'+returnMoney(p.total)+'</span><label class="return-qty"><span class="return-input-icon">▤</span><input type="number" min="0" max="'+p.originalQty+'" value="'+(p.returnQty||'')+'"></label><label class="return-all"><input type="checkbox" '+(p.returnQty===p.originalQty&&p.returnQty>0?'checked':'')+'> Tudo</label><span class="return-proportional">'+returnMoney((p.total/(p.originalQty||1))*(p.returnQty||0))+'</span></div>').join('')+'</div></div><div class="return-actions"><button type="button" class="return-next">Próximo passo »</button><button type="button" class="return-back">Voltar</button></div>';wireReturnStep2(root)}
function wireReturnStep2(root){root.querySelector('.return-close').onclick=closeReturnWizard;root.querySelector('.return-back').onclick=renderReturnStep1;root.querySelector('.return-search-button').onclick=searchReturnSale;root.querySelector('.return-code-input').onkeydown=function(e){if(e.key==='Enter')searchReturnSale()};root.querySelectorAll('.return-product-row').forEach(row=>{const i=Number(row.dataset.index),input=row.querySelector('input[type=number]'),all=row.querySelector('.return-all input');const update=function(){let qty=Math.max(0,Math.min(returnWizardState.products[i].originalQty,Number(input.value)||0));returnWizardState.products[i].returnQty=qty;input.value=qty||'';all.checked=qty===returnWizardState.products[i].originalQty&&qty>0;row.classList.toggle('return-selected',qty>0);row.querySelector('.return-proportional').textContent=returnMoney((returnWizardState.products[i].total/(returnWizardState.products[i].originalQty||1))*qty)};input.oninput=update;all.onchange=function(){input.value=this.checked?returnWizardState.products[i].originalQty:'';update()}});root.querySelector('.return-next').onclick=function(){if(!returnWizardState.products.some(x=>(x.returnQty||0)>0)){appMessage('Informe a quantidade que será devolvida.');return}renderReturnStep3()}}
function returnTotal(){return returnWizardState.products.reduce((sum,p)=>sum+(p.total/(p.originalQty||1))*(p.returnQty||0),0)}
function returnFinanceEffect(sale,entry){
  const amount=Number(entry.total)||0,mode=entry.finance||'none',id=entry.code,now=new Date().toISOString();
  if(!amount||mode==='none')return{mode:'none',label:'Nenhuma alteração financeira',amount:0};
  if(mode==='receivables'){
    const adjustments=JSON.parse(localStorage.getItem('returnReceivableAdjustments')||'[]');
    adjustments.unshift({id,saleCode:String(sale.code),amount,createdAt:now,description:'Devolução de venda'});
    localStorage.setItem('returnReceivableAdjustments',JSON.stringify(adjustments));
    const saved=JSON.parse(localStorage.getItem('localSales')||'[]'),localSale=saved.find(x=>String(x.code)===String(sale.code));
    if(localSale){
      let remaining=amount,rows=Array.isArray(localSale.financial)&&localSale.financial.length?localSale.financial:Array.isArray(localSale.parts)?localSale.parts:[];
      rows.slice().reverse().forEach(row=>{if(remaining<=0||String(row.status||'').toLowerCase()==='recebido')return;const value=returnSaleTotal(row.value),reduction=Math.min(value,remaining);row.value=Number((value-reduction).toFixed(2));remaining-=reduction});
      localSale.financial=rows;localSale.parts=rows;localSale.receivableReduction=(Number(localSale.receivableReduction)||0)+amount;localStorage.setItem('localSales',JSON.stringify(saved));
      syncReceivablesForSale(localSale);
    }
    return{mode,label:'Recebimentos da venda reduzidos',amount};
  }
  const transactions=JSON.parse(localStorage.getItem('localCashTransactions')||'[]');
  transactions.unshift({id,type:'deduction',category:'Devoluções de vendas',description:'Dedução referente à devolução da venda '+sale.code,saleCode:String(sale.code),amount:-amount,createdAt:now});
  localStorage.setItem('localCashTransactions',JSON.stringify(transactions));
  const balance=(Number(localStorage.getItem('localCashBalance')||0)-amount);localStorage.setItem('localCashBalance',String(balance));
  return{mode:'deduction',label:'Dedução lançada no caixa',amount};
}
function renderReturnStep3(){const root=returnWizardRoot(),s=returnWizardState.sale,total=returnTotal();root.innerHTML=returnHeader()+'<div class="return-panel return-step-three">'+returnSaleInfo()+'<div class="return-product-head"><span>Cód</span><span>Item</span><span>Quant atual</span><span>Quant devol.</span><span>Quant restante</span><span>Valor da devol.</span></div><div class="return-product-list">'+returnWizardState.products.filter(p=>(p.returnQty||0)>0).map(p=>'<div class="return-product-row return-confirm-row"><span>'+p.code+'</span><span>'+p.item+'</span><span>'+p.originalQty+'</span><span>'+p.returnQty+'</span><span>'+(p.originalQty-p.returnQty)+'</span><label class="return-value"><span>$</span><input type="text" value="'+returnMoney((p.total/(p.originalQty||1))*p.returnQty).replace(/^R\$\s*/,'').replace(/^R\$\u00a0*/,'')+'" readonly></label></div>').join('')+'</div><div class="return-detail-fields"><label>Palavras-chave<div class="return-field-with-icon"><span>▰</span><input class="return-keywords" value="'+returnWizardState.keywords+'"></div></label><label>Observações<textarea class="return-notes">'+returnWizardState.notes+'</textarea></label><div class="return-total"><b>Valor total da devolução:</b><strong>'+returnMoney(total)+'</strong></div></div><h2>Financeiro</h2><div class="return-finance"><label><input type="radio" name="returnFinance" value="none" '+(returnWizardState.finance==='none'?'checked':'')+'> Não alterar valores financeiros</label><label><input type="radio" name="returnFinance" value="receivables" '+(returnWizardState.finance==='receivables'?'checked':'')+'> Alterar recebimentos da venda</label><label><input type="radio" name="returnFinance" value="deduction" '+(returnWizardState.finance==='deduction'?'checked':'')+'> Criar dedução (lançamento em Pagamentos)</label></div></div><div class="return-actions"><button type="button" class="return-confirm">Confirmar devolução</button><button type="button" class="return-back">Voltar</button></div>';wireReturnStep3(root)}
function wireReturnStep3(root){root.querySelector('.return-close').onclick=closeReturnWizard;root.querySelector('.return-back').onclick=renderReturnStep2;root.querySelector('.return-keywords').oninput=e=>returnWizardState.keywords=e.target.value;root.querySelector('.return-notes').oninput=e=>returnWizardState.notes=e.target.value;root.querySelectorAll('input[name=returnFinance]').forEach(x=>x.onchange=()=>returnWizardState.finance=x.value);root.querySelector('.return-confirm').onclick=confirmReturn}
function confirmReturn(){
  const s=returnWizardState.sale,retVal=returnTotal(),savedReturns=JSON.parse(localStorage.getItem('localReturns')||'[]');
  const returnedItems=returnWizardState.products.filter(x=>x.returnQty>0).map(x=>({
    code:x.code,
    name:x.item,
    qty:Number(x.returnQty)||0,
    total:(x.total/(x.originalQty||1))*(Number(x.returnQty)||0)
  }));

  // Item 11: Devolve a quantidade dos itens devolvidos para o estoque de produtos
  returnedItems.forEach(function(it){
    adjustProductStockSingle(it.code,it.name,+Number(it.qty));
  });

  // Item 12: Atualiza o protocolo da venda com as quantidades e o total restantes (ex.: 50 - 10 = 40 pneus)
  const allSavedSales=JSON.parse(localStorage.getItem('localSales')||'[]');
  let saleIdx=allSavedSales.findIndex(x=>String(x.code).trim()===String(s.code).trim());
  let saleRecord=saleIdx>=0?allSavedSales[saleIdx]:JSON.parse(JSON.stringify(s));
  const currentItems=normalizedSaleItems(saleRecord,Number(saleRecord.total)||0);
  const updatedItems=currentItems.map(function(item,idx){
    const match=returnWizardState.products[idx] || returnWizardState.products.find(p=>String(p.item).trim().toLowerCase()===String(item.name).trim().toLowerCase()||(p.code&&String(p.code)===String(item.code)));
    const rQty=match?(Number(match.returnQty)||0):0;
    const newQty=Math.max(0,(Number(item.qty)||0)-rQty);
    const unitPrice=Number(item.price)||0;
    return Object.assign({},item,{qty:newQty,total:unitPrice*newQty});
  }).filter(it=>it.qty>0||currentItems.length===1);

  const newSaleTotal=updatedItems.reduce((sum,it)=>sum+(Number(it.price)||0)*(Number(it.qty)||0),0);
  saleRecord.items=updatedItems;
  saleRecord.total=newSaleTotal;
  saleRecord.source='userOverride';
  if(!Array.isArray(saleRecord.financial)||!saleRecord.financial.length){
    saleRecord.financial=Array.isArray(saleRecord.parts)&&saleRecord.parts.length?saleRecord.parts:[{index:1,totalParts:1,value:newSaleTotal,date:saleRecord.date||todayValue(),method:'Dinheiro',status:'A receber',edited:true}];
  }
  if(returnWizardState.finance==='none'){
    // Ajusta proporcionalmente as parcelas se havia 1 parcela para manter consistência com o novo total do protocolo
    if(saleRecord.financial.length===1){
      saleRecord.financial[0].value=Number(newSaleTotal.toFixed(2));
      saleRecord.parts=saleRecord.financial;
    }
  }
  if(saleIdx>=0)allSavedSales[saleIdx]=saleRecord;
  else allSavedSales.unshift(saleRecord);
  localStorage.setItem('localSales',JSON.stringify(allSavedSales));

  // Atualiza também o ledger de estoque para essa venda refletir a nova quantidade restante
  try{
    const ledger=JSON.parse(localStorage.getItem('piremaxx_stock_ledger')||'{}');
    const nextMap={};
    updatedItems.forEach(function(it){
      if(String(it.type||'Produto').toLowerCase()==='serviço')return;
      const q=Number(it.qty)||0;
      const nm=String(it.name||'').trim();
      if(!nm||q<=0)return;
      const k=String(it.code||'')+'|'+nm.toLowerCase();
      nextMap[k]={code:it.code||'',name:nm,qty:(nextMap[k]?.qty||0)+q};
    });
    ledger[String(saleRecord.code)]=nextMap;
    localStorage.setItem('piremaxx_stock_ledger',JSON.stringify(ledger));
  }catch(e){}

  // Atualiza a linha na matriz `sales`
  const formattedRow=[String(saleRecord.code),saleRecord.client,saleRecord.vendor||'Diego Miranda',(saleRecord.date||'').split('-').reverse().join('/'),saleRecord.type||'Venda',money(saleRecord.total)];
  const sRowIdx=sales.findIndex(r=>String(r[0])===String(saleRecord.code));
  if(sRowIdx>=0)sales[sRowIdx]=formattedRow;

  const entry={
    code:'DEV-'+s.code+'-'+Date.now().toString().slice(-4),
    saleCode:String(s.code),
    client:s.client||'',
    vendor:s.vendor||'',
    date:s.date||todayValue(),
    type:'Devolução',
    description:returnedItems.map(x=>x.name).join(', '),
    keywords:returnWizardState.keywords,
    notes:returnWizardState.notes,
    total:retVal,
    items:returnedItems,
    finance:returnWizardState.finance
  };
  entry.financialEffect=returnFinanceEffect(saleRecord,entry);
  savedReturns.unshift(entry);
  localStorage.setItem('localReturns',JSON.stringify(savedReturns));
  closeReturnWizard();
  if(typeof window.showReturnsTab==='function')window.showReturnsTab();
}

function escapeReturnHtml(value){return String(value??'').replace(/[&<>"']/g,function(ch){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch]})}
function returnDetailItems(item){
  const items=Array.isArray(item?.items)&&item.items.length?item.items:[{code:'-',name:item?.description||'Produto devolvido',qty:item?.quantity||'-',total:Number(item?.total||item?.value||0)}];
  return items.map(function(x){return{code:x.code||'-',name:x.name||x.item||'Produto devolvido',qty:x.qty??x.quantity??'-',total:Number(x.total||x.value||0)}});
}
function printReturnDetail(item){
  const rows=returnDetailItems(item).map(function(x){return'<tr><td>'+escapeReturnHtml(x.code)+'</td><td>'+escapeReturnHtml(x.name)+'</td><td>'+escapeReturnHtml(x.qty)+'</td><td>'+returnMoney(x.total)+'</td></tr>'}).join('');
  const w=window.open('','_blank','width=900,height=700');
  if(!w)return;
  w.document.write('<!doctype html><html><head><title>Ficha da devolução</title><style>@page{size:A4;margin:15mm}body{font:12px Arial;color:#405967}h1{color:#209b98;border-bottom:3px solid #209b98;padding-bottom:10px}h2{font-size:15px;color:#506b79;border-bottom:2px solid #209b98;padding-bottom:6px;margin-top:22px}table{width:100%;border-collapse:collapse}th{background:#209b98;color:#fff;text-align:left}td,th{padding:8px;border-bottom:1px solid #d8dee1}.total{text-align:right;font-size:17px;font-weight:bold;margin-top:15px}</style></head><body><h1>Ficha da devolução</h1><p><b>Código:</b> '+escapeReturnHtml(item.code)+'<br><b>Venda original:</b> '+escapeReturnHtml(item.saleCode||'-')+'<br><b>Cliente:</b> '+escapeReturnHtml(item.client||'-')+'<br><b>Data:</b> '+escapeReturnHtml(String(item.date||'').split('-').reverse().join('/')||'-')+'</p><h2>Produtos devolvidos</h2><table><thead><tr><th>Código</th><th>Produto ou serviço</th><th>Quantidade devolvida</th><th>Valor devolvido</th></tr></thead><tbody>'+rows+'</tbody></table><div class="total">Total devolvido: '+returnMoney(item.total||item.value||0)+'</div></body></html>');w.document.close();w.focus();w.print();
}
function showReturnDetail(item){
  document.getElementById('returnDetailModal')?.remove();
  const entries=returnDetailItems(item),date=String(item.date||'').split('-').reverse().join('/')||'-';
  const finance=item.financialEffect?.label||(item.finance==='receivables'?'Recebimentos da venda reduzidos':item.finance==='deduction'?'Dedução lançada no caixa':'Nenhuma alteração financeira');
  const modal=document.createElement('div');modal.id='returnDetailModal';modal.className='return-detail-modal';
  modal.innerHTML='<div class="return-detail-card" role="dialog" aria-modal="true"><header><strong>Ficha da devolução</strong><button type="button" class="return-detail-close">×</button></header><div class="return-detail-body"><div class="return-detail-summary"><div><b>Código da devolução:</b> '+escapeReturnHtml(item.code||'-')+'<br><b>Venda original:</b> '+escapeReturnHtml(item.saleCode||'-')+'<br><b>Cliente:</b> '+escapeReturnHtml(item.client||'-')+'<br><b>Data:</b> '+escapeReturnHtml(date)+'</div><div class="return-detail-total"><b>Valor total devolvido</b><strong>'+returnMoney(item.total||item.value||0)+'</strong></div></div><h3>Produtos devolvidos</h3><table><thead><tr><th>Cód.</th><th>Produto ou serviço</th><th>Quantidade devolvida</th><th>Valor devolvido</th></tr></thead><tbody>'+entries.map(function(x){return'<tr><td>'+escapeReturnHtml(x.code)+'</td><td>'+escapeReturnHtml(x.name)+'</td><td>'+escapeReturnHtml(x.qty)+'</td><td>'+returnMoney(x.total)+'</td></tr>'}).join('')+'</tbody></table><div class="return-detail-finance"><b>Financeiro</b><span>'+escapeReturnHtml(finance)+'</span></div>'+(item.keywords?'<p><b>Palavras-chave:</b> '+escapeReturnHtml(item.keywords)+'</p>':'')+(item.notes?'<p><b>Observações:</b> '+escapeReturnHtml(item.notes)+'</p>':'')+'</div><footer><button type="button" class="return-detail-print">Imprimir ficha</button><button type="button" class="return-detail-close">Fechar</button></footer></div>';
  document.body.appendChild(modal);
  modal.querySelectorAll('.return-detail-close').forEach(function(button){button.onclick=function(){modal.remove()}});
  modal.querySelector('.return-detail-print').onclick=function(){printReturnDetail(item)};
  modal.addEventListener('click',function(e){if(e.target===modal)modal.remove()});
}

/* Ativação da guia Devoluções dentro de Vendas. */
(function(){
  let salesToolbarHTML=null,salesHeadHTML=null;
  window.restoreSalesView=function(){
    const toolbar=document.querySelector('.toolbar'),table=document.querySelector('.sales-table'),head=table?.querySelector('thead tr'),body=document.getElementById('saleRows');
    if(table)table.dataset.returnsView='0';
    document.querySelector('.sales-content')?.classList.remove('returns-view');
    document.querySelector('.returns-pagination')?.remove();
    if(toolbar&&salesToolbarHTML!==null)toolbar.innerHTML=salesToolbarHTML;
    if(head&&salesHeadHTML!==null)head.innerHTML=salesHeadHTML;
    if(body){
      const deletedSaleSet=new Set(JSON.parse(localStorage.getItem('deletedSaleCodes')||'[]').map(String));
      const activeSales=sales.filter(r=>!deletedSaleSet.has(String(r[0])));
      body.innerHTML=activeSales.map(r=>'<tr><td><input type="checkbox" class="sale-select"></td>'+r.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('');
    }
    const quotesTab=document.getElementById('quotesTab');if(quotesTab)quotesTab.hidden=false;
    if(typeof installSelection==='function')installSelection();
    if(typeof window.installSalesSearch==='function')window.installSalesSearch();
    if(head){
      const first=head.children[0];
      if(first&&body){
        first.innerHTML='<input type="checkbox" class="sale-select-all" title="Selecionar todas">';
        const allCb=first.querySelector('input');
        if(allCb)allCb.onclick=function(){body.querySelectorAll('.sale-select').forEach(x=>x.checked=this.checked)};
      }
    }
  };
  function showReturns(){
    const toolbar=document.querySelector('.toolbar'),table=document.querySelector('.sales-table'),head=table?.querySelector('thead tr'),body=document.getElementById('saleRows'),tabs=document.querySelectorAll('.tabs .tab'),tab=document.getElementById('returnsTab');
    if(!body||!tab)return;
    if(table)table.dataset.returnsView='1';
      document.querySelector('.sales-content')?.classList.add('returns-view');
    if(toolbar&&salesToolbarHTML===null)salesToolbarHTML=toolbar.innerHTML;
    if(head&&salesHeadHTML===null)salesHeadHTML=head.innerHTML;
    localStorage.setItem('activeSalesTab','returns');
      if(toolbar)toolbar.innerHTML='<button class="new-btn" type="button">⊞ Nova</button><button class="returns-delete-btn" title="Excluir devoluções selecionadas" aria-label="Excluir devoluções selecionadas"><img src="public/icons/icons8-trash.gif" alt="Excluir" class="local-action-icon"></button><button class="returns-print-btn" title="Imprimir lista" aria-label="Imprimir lista"><img src="public/icons/icons8-print.gif" alt="Imprimir lista" class="local-action-icon"></button><button class="returns-search-btn" title="Pesquisar devoluções" aria-label="Pesquisar devoluções">⌕</button>';
      if(head)head.innerHTML='<th>□</th><th>Cód</th><th>Descrição</th><th>Cliente</th><th>Palavras-chave</th><th>Anotações</th><th>Valor total</th><th>Data <span class="returns-sort">↕</span></th>';
    const normalize=function(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')};
    const saved=JSON.parse(localStorage.getItem('localSales')||'[]'),savedReturns=JSON.parse(localStorage.getItem('localReturns')||'[]'),returns=[...(window.importedReturns||[]),...savedReturns.filter(x=>['devolucao','devolucoes','return'].includes(normalize(x.type))),...saved.filter(x=>['devolucao','devolucoes','return'].includes(normalize(x.type)))];
    window.currentReturns=returns;
    body.innerHTML=returns.map(function(item){const date=item.date?String(item.date).split('-').reverse().join('/'):'',description=item.description||item.name||'Devolução';return '<tr data-return-row="1"><td><input type="checkbox" class="sale-select"></td><td>'+String(item.code||'')+'</td><td>'+description+'</td><td>'+String(item.client||'')+'</td><td>'+String(item.keywords||'')+'</td><td>'+String(item.notes||item.observations||'')+'</td><td>'+money(item.total||item.value||0)+'</td><td>'+date+'</td></tr>'}).join('');
    if(!returns.length)body.innerHTML='<tr id="returnsEmptyRow"><td colspan="8" class="sales-empty">Nenhuma devolução encontrada. <a href="#" class="returns-previous-link">Veja no mês anterior</a></td></tr>';
    document.querySelector('.returns-pagination')?.remove();
      const pagination=document.createElement('div');pagination.className='returns-pagination';pagination.innerHTML='<button type="button" class="returns-page-size">100 linhas por página⌃</button><span class="returns-page-nav"><button type="button" disabled>◀◀</button><button type="button" disabled>◀</button><a href="#">1/1</a><button type="button">▶</button><button type="button">▶▶</button></span>';document.querySelector('.sales-table')?.after(pagination);
      const quotesTab=document.getElementById('quotesTab');if(quotesTab)quotesTab.hidden=false;
      tabs.forEach(function(x){x.classList.remove('active')});tab.classList.add('active');
    const print=toolbar?.querySelector('.returns-print-btn');if(print)print.onclick=function(){const checked=[...document.querySelectorAll('#saleRows tr[data-return-row] .sale-select:checked')].map(c=>c.closest('tr'));const all=[...document.querySelectorAll('#saleRows tr[data-return-row]')];const rowsToPrint=checked.length?checked:all;if(!rowsToPrint.length){appMessage('Nenhuma devolução encontrada para imprimir.');return}const trs=rowsToPrint.map(r=>'<tr><td>'+(r.children[1]?.textContent||'')+'</td><td>'+(r.children[2]?.textContent||'')+'</td><td>'+(r.children[3]?.textContent||'')+'</td><td>'+(r.children[6]?.textContent||'')+'</td><td>'+(r.children[7]?.textContent||'')+'</td></tr>').join('');const w=window.open('','_blank','width=900,height=800');if(!w)return;w.document.write('<!doctype html><html><head><title>Devoluções - Piremaxx</title><style>@page{size:A4;margin:0}body{font:12px Arial;color:#243746}h1{color:#1b2886;border-bottom:2px solid #1b2886;padding-bottom:10px;font-size:18px;text-transform:uppercase}table{width:100%;border-collapse:collapse}th{background:#1b2886;color:#fff;text-align:left}td,th{padding:8px;border-bottom:1px solid #ddd}</style></head><body><h1>Relatório de Devoluções</h1><table><thead><tr><th>Cód</th><th>Descrição</th><th>Cliente</th><th>Valor total</th><th>Data</th></tr></thead><tbody>'+trs+'</tbody></table><script>window.onload=function(){window.print()}<\/script></body></html>');w.document.close()};
    const delRet=toolbar?.querySelector('.returns-delete-btn');
    if(delRet)delRet.onclick=function(){
      const checked=[...document.querySelectorAll('#saleRows tr[data-return-row] .sale-select:checked')].map(c=>c.closest('tr'));
      if(!checked.length){appMessage('Selecione ao menos uma devolução para excluir.');return}
      if(!confirm('Excluir '+checked.length+' devolução(ões) selecionada(s)?'))return;
      const codes=new Set(checked.map(r=>String(r.children[1]?.textContent.trim())));
      const allRet=JSON.parse(localStorage.getItem('localReturns')||'[]');
      allRet.filter(x=>codes.has(String(x.code))).forEach(function(retObj){
        (Array.isArray(retObj.items)?retObj.items:[]).forEach(function(it){
          adjustProductStockSingle(it.code,it.name,-Number(it.qty||0));
        });
      });
      const savedRet=allRet.filter(x=>!codes.has(String(x.code)));
      localStorage.setItem('localReturns',JSON.stringify(savedRet));
      showReturns();
    };
    if(window.installSalesCheckboxes)window.installSalesCheckboxes();
    const create=toolbar?.querySelector('.new-btn');if(create)create.onclick=function(){showReturn()};
    document.getElementById('appMessage')?.remove();
    window.showReturnsTab=showReturns;
  }
  document.addEventListener('click',function(e){const tab=e.target.closest('#returnsTab');if(!tab)return;e.preventDefault();e.stopPropagation();showReturns()});
  document.addEventListener('click',function(e){const row=e.target.closest('#saleRows tr[data-return-row]');if(!row||e.target.closest('input'))return;const code=row.children[1]?.textContent.trim(),item=(window.currentReturns||[]).find(x=>String(x.code||'')===String(code));if(item)showReturnDetail(item)});
  document.addEventListener('DOMContentLoaded',function(){const body=document.getElementById('saleRows');if(body&&!body.dataset.returnsGuard){body.dataset.returnsGuard='1';new MutationObserver(function(){if(document.querySelector('.sales-table')?.dataset.returnsView!=='1')return;if(body.querySelector('tr:not([data-return-row]):not(#returnsEmptyRow)'))setTimeout(showReturns,0)}).observe(body,{childList:true})}if(location.hash==='#devolVendas'&&localStorage.getItem('activeSalesTab')==='returns'){setTimeout(showReturns,20);setTimeout(function(){if(window.showReturnsTab)window.showReturnsTab()},1500)}});
})();

/* Pesquisa da lista: localiza protocolo, cliente, vendedor, data ou total. */
(function(){
  function normalize(value){return String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()}
  function applySalesSearch(){
    const input=document.querySelector('.sales-search-input'),query=normalize(input?.value);
    if(document.querySelector('.sales-table')?.dataset.returnsView==='1')return;
    const mode=localStorage.getItem('activeSalesTab')==='quotes'?'quotes':'sales';
    document.querySelectorAll('#saleRows tr').forEach(function(row){
      if(row.id==='returnsEmptyRow')return;
      const type=normalize(row.cells[5]?.textContent),inCurrentTab=mode==='quotes'?type==='orcamento':type==='venda';
      const content=normalize([...row.cells].map(cell=>cell.textContent).join(' '));
      const visible=inCurrentTab&&(!query||content.includes(query));
      row.hidden=!visible;row.classList.toggle('hidden',!visible);row.style.display=visible?'':'none';
    });
  }
  function installSalesSearch(){
    const toolbar=document.querySelector('.sales-content:not(.returns-view) .toolbar'),period=toolbar?.querySelector(':scope > span:last-child');
    if(!toolbar||!period||period.dataset.searchReady)return;
    period.dataset.searchReady='1';period.classList.add('sales-period');period.childNodes.forEach(function(node){if(node.nodeType===3)node.nodeValue=node.nodeValue.replace(/🔍\s*$/,'')});
    const button=document.createElement('button');button.type='button';button.className='sales-search-btn';button.title='Pesquisar venda';button.setAttribute('aria-label','Pesquisar venda');button.textContent='🔍';
    const input=document.createElement('input');input.type='search';input.className='sales-search-input hidden';input.placeholder='Pesquisar protocolo ou cliente';input.setAttribute('aria-label','Pesquisar protocolo ou cliente');
    period.append(button,input);
    button.onclick=function(){const opening=input.classList.contains('hidden');input.classList.toggle('hidden',!opening);if(opening){input.focus();input.select()}else{input.value='';applySalesSearch()}};
    input.oninput=applySalesSearch;
    input.onkeydown=function(e){if(e.key==='Escape'){input.value='';input.classList.add('hidden');applySalesSearch()}};
    const originalFilter=window.filterSalesRows;
    if(typeof originalFilter==='function'&&!originalFilter.__searchWrapped){const wrapped=function(mode){originalFilter(mode);applySalesSearch()};wrapped.__searchWrapped=true;window.filterSalesRows=wrapped}
    applySalesSearch();
  }
  window.installSalesSearch=installSalesSearch;
  document.addEventListener('DOMContentLoaded',function(){installSalesSearch();setTimeout(installSalesSearch,500);setTimeout(installSalesSearch,1500)});
})();

/* Cabeçalho da ficha: mantém o número do protocolo no topo sem sobrescrever alterações do usuário. */
(function(){
  function syncSaleHeader(){
    const root=document.getElementById('newSale'),title=root?.querySelector('.sale-header strong');
    if(!root||!title)return;
    const type=root.querySelector('.form-grid select')?.value||'Venda';
    const proto=editingCode||generateNextProtocolCode();
    if(type==='Orçamento')title.textContent=(isNewRecord?'Novo orçamento - Protocolo #':'Orçamento número ')+proto;
    else if(type==='Devolução')title.textContent='Devolução da Venda número '+proto;
    else title.textContent=(isNewRecord?'Nova Venda - Protocolo #':'Venda número ')+proto;
    const protoInput=document.getElementById('saleProtocolInput');
    if(protoInput)protoInput.value=proto;
  }
  document.addEventListener('DOMContentLoaded',function(){
    syncSaleHeader();
    document.addEventListener('click',function(e){if(e.target.closest('#saleRows tr,.new-btn,[title="Editar"]'))setTimeout(syncSaleHeader,0)});
    document.addEventListener('change',function(e){if(e.target.closest('#newSale .form-grid'))syncSaleHeader()});
  });
})();
/* Mantém o enquadramento de Vendas idêntico ao topo da Home desde o primeiro frame. */
(function(){if(window.innerWidth<=768)return;const s=document.querySelector('.sidebar'),m=document.querySelector('main'),t=document.querySelector('.topbar');if(!s||!m||!t)return;s.style.cssText+=';top:0!important;width:143px!important;min-width:143px!important;height:100vh!important;min-height:100vh!important';m.style.cssText+=';margin-left:143px!important;width:calc(100% - 143px)!important;padding-top:0!important';t.style.cssText+=';position:relative!important;left:auto!important;top:auto!important;width:100%!important;height:49px!important;min-height:49px!important;padding:0 10px!important';})();
(function(){function contactCatalog(){let local=[];try{local=JSON.parse(localStorage.getItem('piremaxx_contatos')||'[]')}catch(e){}const imported=(window.importedContacts||[]).map(function(c){return{id:String(c.code||''),nome:String(c.name||c.fantasy||'').trim(),tipos:['cliente']}});const records=[...local,...imported.filter(function(c){return !local.some(function(x){return String(x.id||'')===String(c.id)||String(x.nome||'').trim().toLowerCase()===c.nome.toLowerCase()})})];return records.filter(function(c){return (!Array.isArray(c.tipos)||c.tipos.includes('cliente'))&&String(c.nome||'').trim()}).sort(function(a,b){return String(a.nome).localeCompare(String(b.nome),'pt-BR')})}function setupClientPicker(){const input=document.getElementById('client');if(!input||input.dataset.clientPicker)return;input.dataset.clientPicker='1';const wrap=document.createElement('div');wrap.className='client-picker';input.parentNode.insertBefore(wrap,input);wrap.appendChild(input);const list=document.createElement('div');list.className='client-picker-list hidden';wrap.appendChild(list);function render(query){const q=String(query||'').trim().toLowerCase(),items=contactCatalog().filter(function(c){return !q||String(c.nome).toLowerCase().includes(q)||String(c.id||'').toLowerCase().includes(q)}).slice(0,80);list.innerHTML='';items.forEach(function(c){const button=document.createElement('button');button.type='button';button.className='client-picker-option';button.dataset.name=c.nome;button.textContent=c.nome+(c.id?' · cód. '+c.id:'');list.appendChild(button)});list.classList.toggle('hidden',!items.length)}input.addEventListener('focus',function(){render(input.value)});input.addEventListener('input',function(){render(input.value)});list.addEventListener('click',function(e){const button=e.target.closest('.client-picker-option');if(!button)return;input.value=button.dataset.name;list.classList.add('hidden');input.dispatchEvent(new Event('change',{bubbles:true}))});document.addEventListener('click',function(e){if(!wrap.contains(e.target))list.classList.add('hidden')});const style=document.createElement('style');style.textContent='.client-picker{position:relative;width:100%}.client-picker-list{position:absolute;left:0;right:0;top:100%;z-index:80;max-height:260px;overflow:auto;background:#fff;border:1px solid #9aa8af;box-shadow:0 3px 8px rgba(0,0,0,.25)}.client-picker-list.hidden{display:none}.client-picker-option{display:block;width:100%;padding:8px 10px;border:0;border-bottom:1px solid #e1e5e7;background:#fff;color:#405d6d;text-align:left;cursor:pointer}.client-picker-option:hover{background:#e8f3f5}';document.head.appendChild(style)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupClientPicker);else setupClientPicker()})();
document.addEventListener('DOMContentLoaded',function(){const input=document.getElementById('client'),wrap=input?.closest('.client-picker');if(!input||!wrap)return;input.setAttribute('autocomplete','off');input.setAttribute('autocapitalize','off');input.setAttribute('spellcheck','false');wrap.classList.add('has-client-symbol');const style=document.createElement('style');style.textContent='.client-picker.has-client-symbol:before{content:"♙";position:absolute;z-index:2;left:9px;top:50%;transform:translateY(-50%);color:#52717e;font-size:16px;pointer-events:none}.client-picker.has-client-symbol input{padding-left:30px!important}';document.head.appendChild(style)});
document.addEventListener('DOMContentLoaded',function(){const input=document.getElementById('client'),wrap=input?.closest('.client-picker');if(!input||!wrap||wrap.querySelector('.client-picker-toggle'))return;const list=wrap.querySelector('.client-picker-list'),toggle=document.createElement('button');toggle.type='button';toggle.className='client-picker-toggle';toggle.setAttribute('aria-label','Mostrar clientes');toggle.textContent='▾';wrap.appendChild(toggle);toggle.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();const wasOpen=!list.classList.contains('hidden');input.focus();if(wasOpen)list.classList.add('hidden')});const style=document.createElement('style');style.textContent='.client-picker.has-client-symbol:before{content:none!important}.client-picker.has-client-symbol input{padding-left:10px!important;padding-right:30px!important}.client-picker-toggle{position:absolute;right:4px;top:50%;z-index:3;transform:translateY(-50%);width:25px;height:25px;border:0;background:transparent;color:#52717e;font-size:17px;line-height:25px;cursor:pointer}.client-picker-toggle:hover{background:#e8f3f5;border-radius:3px}';document.head.appendChild(style)});
(function(){function apply(){const input=document.getElementById('client'),wrap=input?.closest('.client-picker');if(!input||!wrap)return;input.setAttribute('autocomplete','off');input.setAttribute('autocapitalize','off');input.setAttribute('spellcheck','false');wrap.classList.add('has-client-symbol');if(!wrap.querySelector('.client-picker-toggle')){const list=wrap.querySelector('.client-picker-list'),toggle=document.createElement('button');if(!list)return;toggle.type='button';toggle.className='client-picker-toggle';toggle.setAttribute('aria-label','Mostrar clientes');toggle.textContent='▾';wrap.appendChild(toggle);toggle.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();const wasOpen=!list.classList.contains('hidden');input.focus();if(wasOpen)list.classList.add('hidden')})}if(!document.getElementById('client-picker-toggle-style')){const style=document.createElement('style');style.id='client-picker-toggle-style';style.textContent='.client-picker.has-client-symbol:before{content:none!important}.client-picker.has-client-symbol input{padding-left:10px!important;padding-right:30px!important}.client-picker-toggle{position:absolute;right:4px;top:50%;z-index:3;transform:translateY(-50%);width:25px;height:25px;border:0;background:transparent;color:#52717e;font-size:17px;line-height:25px;cursor:pointer}.client-picker-toggle:hover{background:#e8f3f5;border-radius:3px}';document.head.appendChild(style)}}apply();new MutationObserver(apply).observe(document.body,{childList:true,subtree:true})})();

// Carregamento dinâmico dos vendedores cadastrados para o campo Vendedor da Nova Venda
(function(){
  function populateVendors(preferredValue){
    const select=document.getElementById('vendorSelect')||document.querySelectorAll('#newSale .form-grid select')[1];
    if(!select)return;

    const currentSelection=preferredValue||select.value||'';
    const deleted=new Set((JSON.parse(localStorage.getItem('deletedContactCodes')||'[]')).map(String));

    let contacts=[];
    try{contacts=JSON.parse(localStorage.getItem('piremaxx_contatos')||'[]')}catch(e){contacts=[]}

    const vendorNames=new Set();

    contacts.forEach(function(c){
      const isVendor=Array.isArray(c.tipos)&&c.tipos.includes('vendedor');
      const name=String(c.nome||c.name||'').trim();
      const id=String(c.id||'').trim();
      if(isVendor&&name&&!deleted.has(id)&&!deleted.has(name)){
        vendorNames.add(name);
      }
    });

    const defaultVendors=[
      'Diego Miranda',
      'Katia Maria',
      'Viviane Martins',
      'CLAUDEMIR NOGUEIRA',
      'ODIMAN COSTA'
    ];

    defaultVendors.forEach(function(name){
      if(!deleted.has(name)&&!deleted.has(name.toLowerCase())){
        vendorNames.add(name);
      }
    });

    (window.importedSales||[]).forEach(function(s){
      const v=String(s.vendor||'').trim();
      if(v&&!deleted.has(v)){
        vendorNames.add(v);
      }
    });

    if(currentSelection){
      vendorNames.add(currentSelection);
    }

    const sorted=Array.from(vendorNames).sort(function(a,b){return a.localeCompare(b,'pt-BR')});

    select.innerHTML=sorted.map(function(name){
      const esc=name.replace(/"/g,'&quot;');
      return '<option value="'+esc+'">'+name+'</option>';
    }).join('');

    if(currentSelection&&sorted.includes(currentSelection)){
      select.value=currentSelection;
    }else if(sorted.length){
      select.value=sorted.includes('Diego Miranda')?'Diego Miranda':sorted[0];
    }
  }

  window.populateVendors=populateVendors;

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){populateVendors()});
  }else{
    populateVendors();
  }

  window.addEventListener('focus',function(){
    const newSale=document.getElementById('newSale');
    if(newSale&&!newSale.classList.contains('hidden')){
      populateVendors();
    }
  });
})();
