/*
 * Importa as planilhas exportadas (contatos, produtos, produtosCateg, vendas, vendasItens)
 * e gera o arquivo vendas-importadas.js consumido pelo sistema.
 *
 * Uso: node importar-planilhas.js [pasta-das-planilhas] [mes-inicial] [mes-final]
 *   - mes-inicial / mes-final no formato AAAA-MM (padrao: 2026-08 ate 2026-11)
 * As planilhas devem se chamar contatos.xls, produtos.xls, produtosCateg.xls, vendas.xls e vendasItens.xls.
 */
const fs = require('fs');
const path = require('path');

const dir = process.argv[2] || path.join(__dirname, 'planilhas');
const fromMonth = process.argv[3] || '2026-08';
const toMonth = process.argv[4] || '2026-11';
const output = path.join(__dirname, 'vendas-importadas.js');

// Vendedores (CODUSUARIO -> nome), mesmos usuarios ja cadastrados no sistema
const USERS = { '1': 'Diego Miranda', '2': 'Katia Maria', '3': 'Viviane Martins', '4': 'CLAUDEMIR NOGUEIRA', '5': 'ODIMAN COSTA' };

const decoder = new TextDecoder('windows-1252');
const decodeEntities = s => s.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#(\d+);/g, (m, n) => String.fromCharCode(n)).replace(/&amp;/g, '&');

function readTable(name) {
  const html = decoder.decode(fs.readFileSync(path.join(dir, name)));
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m =>
    [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(c => decodeEntities(c[1].replace(/<[^>]+>/g, '')).trim())
  );
  const headers = rows.shift() || [];
  return rows.map(r => { const o = {}; headers.forEach((h, i) => { o[h] = r[i] === undefined ? '' : r[i]; }); return o; });
}

const num = v => {
  if (v === undefined || v === null || String(v).trim() === '') return 0;
  const n = Number(String(v).trim().replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};
const round2 = n => Math.round(n * 100) / 100;

const contactsRaw = readTable('contatos.xls');
const productsRaw = readTable('produtos.xls');
const categories = {};
readTable('produtosCateg.xls').forEach(c => { categories[c.CODIGO] = c.NOME; });
const salesRaw = readTable('vendas.xls');
const itemsRaw = readTable('vendasItens.xls');

// Contatos: todos entram no mapa (para nomear vendas antigas), mas so os ativos sao listados
const contactMap = {};
contactsRaw.forEach(c => { contactMap[c.CODIGO] = c; });
const contacts = contactsRaw.filter(c => c.ATIVO === '1' && !c.DTDEL).map(c => ({
  code: c.CODIGO,
  name: c.NOME,
  fantasy: c.FANTASIA,
  contact: c.CONTATO,
  document: c.CPFCNPJ,
  email: c.EMAILS,
  address: c.END,
  number: c.NUM,
  complement: c.COMPL,
  neighborhood: c.BAIRRO,
  city: c.CIDADENOME,
  state: c.UF,
  zip: c.CEP,
  phones: c.FONES,
  ie: c.IE,
  im: c.IM,
  keywords: c.TAGS,
  notes: c.OBS
}));

// Produtos / servicos ativos
const productMap = {};
productsRaw.forEach(p => { productMap[p.CODIGO] = p; });
const isService = p => /serv/i.test(p.TIPOPRODUTO);
const products = productsRaw.filter(p => p.ATIVO === '1' && !p.DTDEL && p.ARQUIVADO !== '1').map(p => ({
  code: p.CODIGO,
  name: p.IXPROD || p.ICPROD,
  sku: p.ICPROD,
  type: isService(p) ? 'Serviço' : 'Produto',
  category: categories[p.CODCATEGORIA] || '',
  price: num(p.PRECOVENDA),
  cost: num(p.PRECOCUSTO),
  stock: num(p.ESTOQUE),
  minStock: num(p.ESTOQUEMINIMO),
  keywords: p.TAGS
}));

// Vendas do periodo
const inRange = d => { const m = String(d || '').slice(0, 7); return m >= fromMonth && m <= toMonth; };
const sales = salesRaw.filter(s => s.ATIVO === '1' && !s.DTDEL && inRange(s.DTVENDA));
const saleCodes = new Set(sales.map(s => s.CODIGO));

const itemsBySale = {};
itemsRaw.forEach(it => {
  if (!saleCodes.has(it.CODVENDA)) return;
  const prod = productMap[it.CODPRODUTO];
  const price = num(it.PRECO), qty = num(it.QUANT);
  (itemsBySale[it.CODVENDA] = itemsBySale[it.CODVENDA] || []).push({
    code: it.CODPRODUTO,
    name: prod ? (prod.IXPROD || prod.ICPROD) : 'Produto ' + it.CODPRODUTO,
    type: /serv/i.test(it.TIPOPROD) ? 'Serviço' : 'Produto',
    price,
    qty,
    total: round2(price * qty),
    returnedQty: num(it.DEVOL),
    returnedValue: num(it.VDEVOL),
    selected: true
  });
});

const salesOut = sales.map(s => {
  const contact = contactMap[s.CODCONTATO];
  const quote = s.SITUACAO === '10';
  return {
    code: s.CODIGO,
    client: contact && contact.NOME ? contact.NOME : 'Cliente #' + s.CODCONTATO,
    clientCode: s.CODCONTATO,
    vendor: USERS[s.CODUSUARIO] || 'Usuário #' + s.CODUSUARIO,
    vendorCode: s.CODUSUARIO,
    date: s.DTVENDA,
    type: quote ? 'Orçamento' : 'Venda',
    total: num(s.VALORTOTAL),
    returnedTotal: num(s.VALORDEVOL),
    statusCode: s.SITUACAO,
    quoteStatus: quote ? 'pending' : 'converted',
    items: itemsBySale[s.CODIGO] || []
  };
});

const maxCode = Math.max(0, ...salesRaw.map(s => Number(s.CODIGO) || 0));
const payload = {
  importedAt: new Date().toISOString().slice(0, 19),
  sourceFile: 'planilhas (contatos, produtos, vendas)',
  period: fromMonth + ' a ' + toMonth,
  maxSaleCode: maxCode,
  contacts,
  products,
  sales: salesOut
};
const js = 'window.cloneData=' + JSON.stringify(payload) + ';window.importedContacts=window.cloneData.contacts;window.importedProducts=window.cloneData.products;window.importedSales=window.cloneData.sales;';
fs.writeFileSync(output, js, 'utf8');

const itemCount = salesOut.reduce((a, s) => a + s.items.length, 0);
console.log(`Importados: ${contacts.length} contatos, ${products.length} produtos/serviços, ${salesOut.length} vendas/orçamentos (${fromMonth} a ${toMonth}), ${itemCount} itens. Maior código de venda na planilha: ${maxCode}.`);
