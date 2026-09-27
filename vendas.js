let sales = [], clients = [], products = [], editingId = null, currentPage = 1;
const sellers = {1:'Diego Miranda',2:'Katia Maria',3:'Viviane Martins',4:'CLAUDEMIR NOGUEIRA',5:'ODIMAN COSTA',6:'ELYELSON LIMA',7:'ODIMAN'};
const $ = id => document.getElementById(id);
const today = () => new Date().toISOString().slice(0, 10);
const fmt = value => { const number = Number(value); return (Number.isFinite(number) ? number : 0).toLocaleString('pt-BR', {style:'currency', currency:'BRL'}); };
const esc = value => String(value ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const api = (url, options) => fetch(url, options).then(async response => { if (!response.ok) throw Error(await response.text()); return response.status === 204 ? null : response.json(); });
const dateBR = value => { const parts = String(value || '').slice(0, 10).split('-'); return parts.length === 3 ? parts.reverse().join('/') : value || ''; };
const sellerName = sale => sale.seller || sellers[sale.codusuario] || '—';

async function load() {
  [sales, clients, products] = await Promise.all([api('/api/sales'), api('/api/clients'), api('/api/products')]);
  $('clientOptions').innerHTML = clients.slice(0, 3000).map(client => `<option value="${esc(client.name || '')}">`).join('');
  $('productOptions').innerHTML = products.slice(0, 3000).map(product => `<option value="${esc(product.name || '')}">`).join('');
  const seller = $('seller');
  if (seller) seller.innerHTML = Object.values(sellers).map(name => `<option>${esc(name)}</option>`).join('');
  renderList();
  if (new URLSearchParams(location.search).has('new')) startNew();
}
function filtered() { const query = ($('search').value || '').toLowerCase(); return sales.filter(sale => (`${sale.customer || ''} ${sale.id} ${sellerName(sale)}`).toLowerCase().includes(query)); }
function renderList() {
  const rows = filtered(), shown = rows.slice((currentPage - 1) * 100, currentPage * 100);
  $('salesRows').innerHTML = shown.map(sale => `<tr><td><input class="check sale-check" type="checkbox" value="${esc(sale.id)}"></td><td>${esc(sale.id)}</td><td><button class="open" onclick="openSale('${esc(sale.id)}')">${esc(sale.customer || '')}</button></td><td>${esc(sellerName(sale))}</td><td>${esc(dateBR(sale.date || sale.dtvenda))}</td><td>${esc(sale.kind || 'Venda')}</td><td class="amount">${fmt(sale.total || sale.value)}</td></tr>`).join('') || '<tr><td colspan="7" class="empty">Nenhuma venda ou orçamento encontrado.</td></tr>';
  $('listSummary').textContent = `${rows.length} registros encontrados`;
  $('listTotal').textContent = `TOTAL LISTADO ${fmt(rows.reduce((sum, sale) => sum + Number(sale.total || sale.value || 0), 0))}`;
}
function toggleAll(element) { document.querySelectorAll('.sale-check').forEach(check => { check.checked = element.checked; }); }
function selected() { return [...document.querySelectorAll('.sale-check:checked')].map(check => String(check.value)); }
function page(change) { const maximum = Math.max(1, Math.ceil(filtered().length / 100)); currentPage = Math.max(1, Math.min(maximum, currentPage + change)); renderList(); }
function changeMonth(change) { const current = new Date(2026, 8 + change, 1); $('monthLabel').textContent = current.toLocaleDateString('pt-BR', {month:'long', year:'numeric'}); }
function setCurrentMonth() { $('monthLabel').textContent = new Date().toLocaleDateString('pt-BR', {month:'long', year:'numeric'}); }
function cloneSelected() { const id = selected()[0]; if (id) openSale(id, true); else alert('Selecione uma venda para clonar.'); }
function emitNfe() { alert('A emissão de NFe está disponível após salvar o registro local.'); }
function changeStatus() { alert('Selecione a venda e abra o registro para alterar o status.'); }
async function deleteSelected() { const ids = selected(); if (!ids.length) return alert('Selecione ao menos uma venda.'); if (!confirm('Excluir os registros selecionados do sistema local?')) return; for (const id of ids) await api('/api/sales/' + encodeURIComponent(id), {method:'DELETE'}); sales = sales.filter(sale => !ids.includes(String(sale.id))); renderList(); }
function showList() { document.body.classList.remove('editor-mode'); $('editor').classList.remove('show'); $('listView').style.display = 'block'; editingId = null; renderList(); }
function startNew() { editingId = null; document.body.classList.add('editor-mode'); $('docTitle').textContent = 'Orçamento novo'; $('customerInput').value = ''; $('kind').value = 'Orçamento'; $('date').value = today(); $('seller').value = 'Diego Miranda'; $('finalConsumer').value = 'Não'; $('tags').value = ''; $('notes').value = ''; $('items').innerHTML = ''; $('paydate').value = today(); $('paymentStatus').value = 'A receber'; addItem(); $('listView').style.display = 'none'; $('editor').classList.add('show'); }
function addItem(item = {}) { const row = document.createElement('tr'); row.innerHTML = `<td><input class="iname" list="productOptions" placeholder="Adicionar item" value="${esc(item.name || '')}"><small>Observações adicionais</small></td><td><input class="iprice" type="number" step="0.01" value="${item.price || 0}"></td><td><input class="iqty" type="number" min="0" value="${item.quantity || 0}"></td><td>R$ 0,00</td><td class="line">R$ 0,00</td><td><button class="remove" onclick="this.closest('tr').remove();calc()">🗑</button></td>`; $('items').appendChild(row); row.querySelector('.iname').onchange = () => { const product = products.find(candidate => candidate.name === row.querySelector('.iname').value); if (product && !Number(row.querySelector('.iprice').value)) row.querySelector('.iprice').value = product.price || 0; calc(); }; row.querySelectorAll('input').forEach(input => input.oninput = calc); calc(); }
function calc() { let quantity = 0, total = 0; document.querySelectorAll('#items tr').forEach(row => { const price = +row.querySelector('.iprice').value || 0, count = +row.querySelector('.iqty').value || 0; quantity += count; total += price * count; row.querySelector('.line').textContent = fmt(price * count); }); $('qtyTotal').textContent = quantity; $('grand').textContent = fmt(total); $('installment').value = total.toFixed(2); $('finTotal').textContent = fmt(total); return total; }
function openSale(id, clone = false) { const sale = sales.find(candidate => String(candidate.id) === String(id)); if (!sale) return; startNew(); editingId = clone ? null : sale.id; $('docTitle').textContent = clone ? 'Orçamento novo' : `Orçamento número ${sale.id}`; $('customerInput').value = sale.customer || ''; $('kind').value = sale.kind || 'Venda'; $('date').value = String(sale.date || sale.dtvenda || today()).slice(0, 10); $('seller').value = sellerName(sale); $('tags').value = sale.tags || ''; $('notes').value = sale.notes || ''; $('items').innerHTML = ''; (sale.items || []).forEach(addItem); if (!sale.items?.length) addItem(); calc(); }
async function saveSale() { const total = calc(); const items = [...document.querySelectorAll('#items tr')].filter(row => row.querySelector('.iname').value.trim()).map(row => ({name:row.querySelector('.iname').value, price:+row.querySelector('.iprice').value || 0, quantity:+row.querySelector('.iqty').value || 0})); const payload = {customer:$('customerInput').value.trim(), kind:$('kind').value, seller:$('seller').value, date:$('date').value, tags:$('tags').value, notes:$('notes').value, total, status:$('paymentStatus').value, items, payment:{value:+$('installment').value || total, date:$('paydate').value, method:$('payment').value}}; if (!payload.customer) return alert('Informe o nome do cliente.'); if (!items.length) return alert('Adicione pelo menos um produto ou serviço.'); try { const saved = editingId ? await api('/api/sales/' + encodeURIComponent(editingId), {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)}) : await api('/api/sales', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)}); if (editingId) sales[sales.findIndex(sale => String(sale.id) === String(editingId))] = saved; else sales.unshift(saved); alert('Registro salvo com sucesso.'); showList(); } catch (error) { alert('Não foi possível salvar: ' + error.message); } }
load().catch(error => alert('Erro ao carregar vendas: ' + error.message));

function installReturnsTab() {
  const list = document.querySelector('#listView');
  const buttons = list?.querySelectorAll('.tabs button');
  if (!list || !buttons || buttons.length < 2 || buttons[1].dataset.returnsReady) return;
  buttons[1].dataset.returnsReady = '1';
  const returnsMarkup = '<div class="tabs"><button onclick="location.reload()">▦ VENDAS</button><button class="active">↪ DEVOLUÇÕES</button></div><div class="filterbar"><div class="left-actions"><button class="new-sale" onclick="alert(\'A tela de nova devolução será incluída na próxima etapa.\')">↪ Nova</button><button class="tool" onclick="window.print()">▤</button></div></div><div class="list-wrap"><table class="list"><thead><tr><th style="width:45px">□</th><th>Cód</th><th>Descrição</th><th>Cliente</th><th>Palavras-chave</th><th>Anotações</th><th>Valor total</th><th>Data</th></tr></thead><tbody><tr><td colspan="8" class="empty">Nenhuma devolução encontrada.<br><small>Veja no mês anterior</small></td></tr></tbody></table></div><footer class="list-footer"><span>0 registros encontrados</span><span></span><div class="pager"><button>‹</button><button class="active">1</button><button>›</button></div></footer>';
  buttons[1].addEventListener('click', event => { event.preventDefault(); event.stopImmediatePropagation(); list.innerHTML = returnsMarkup; }, true);
}
installReturnsTab();
setTimeout(installReturnsTab, 300);
