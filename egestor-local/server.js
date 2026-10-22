const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT || 10000);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const menuItems = [
  ['home', 'Indicadores', 'index.html', 'icons8-home-48.png', 'dashboard-link'],
  ['financeiro', 'Financeiro', 'financeiro.html', 'icons8-financial-64.png', 'finance-link'],
  ['vendas', 'Vendas', 'vendas.html', 'icons8-buy-for-cash-48.png', ''],
  ['compras', 'Compras', 'compras.html', 'icons8-buy-48.png', ''],
  ['frota', 'Frota', 'frota.html', 'icons8-shipped-48.png', ''],
  ['clientes', 'Contatos', 'clientes.html', 'icons8-budget-48.png', ''],
  ['produtos', 'Produtos', 'produtos.html', 'icons8-product-48.png', ''],
  ['boletos', 'Boletos', '#', 'icons8-boleto-bancário-48.png', ''],
  ['cobrancas', 'Cobranças', '#', 'icons8-billing-32.png', ''],
  ['pix', 'Pix', '#', 'icons8-pix-48.png', ''],
  ['fiscal', 'NF-e / Fiscal', '#', 'icons8-fiscal-50.png', ''],
  ['relatorios', 'Relatórios', 'relatorios.html', 'icons8-business-report-94.png', ''],
  ['configuracoes', 'Configurações', 'configuracoes.html', 'icons8-settings-48.png', '']
];

function getActiveMenuKey(pageName) {
  const p = (pageName || 'index.html').toLowerCase();
  if (p === 'financeiro.html' || p === 'financeiro-pagamentos.html') return 'financeiro';
  if (p === 'frota.html') return 'frota';
  if (p === 'vendas.html') return 'vendas';
  if (p === 'compras.html') return 'compras';
  if (p === 'clientes.html' || p === 'novo-cliente.html' || p === 'novo-comprador.html') return 'clientes';
  if (p === 'produtos.html' || p === 'novo-produto.html' || p === 'novo-servico.html') return 'produtos';
  if (p === 'relatorios.html') return 'relatorios';
  if (p === 'configuracoes.html' || p === 'usuarios.html') return 'configuracoes';
  return 'home';
}

function buildCanonicalSidebar(pageName) {
  const active = getActiveMenuKey(pageName);
  const links = menuItems.map(x =>
    `<a class="${x[4]} ${x[0] === active ? 'active' : ''}" href="${x[2]}" data-menu-key="${x[0]}"><img src="public/icons/${x[3]}" alt=""><b>${x[1]}</b></a>`
  ).join('');
  return `<aside class="sidebar shared-sidebar" data-rendered="1"><div class="brand"><strong>egestor<span>+</span></strong><small>Plano profissional</small></div><nav>${links}<a href="#" data-menu-key="suporte"><span>❔</span><b>Suporte online</b></a></nav></aside>`;
}

const criticalFirstPaintCSS = `<style id="standard-layout-first-paint">@media (min-width: 769px){body .sidebar.shared-sidebar,body .sidebar{position:fixed!important;top:0!important;left:0!important;width:143px!important;min-width:143px!important;height:100vh!important;min-height:100vh!important;z-index:90!important;background:#344952!important}body .sidebar.shared-sidebar .brand,body .sidebar .brand{display:block!important;visibility:visible!important;width:143px!important;height:49px!important;min-height:49px!important;background-color:#eee!important;background-image:url("public/logo.webp")!important;background-position:center center!important;background-repeat:no-repeat!important;background-size:auto 26px!important;font-size:0!important;color:transparent!important;padding:0!important;margin:0!important}body .topbar .brand-mini,body .products-topbar .brand-mini{display:block!important;width:133px!important;min-width:133px!important;height:49px!important;min-height:49px!important;background-image:url("public/logo.png")!important;background-position:center center!important;background-repeat:no-repeat!important;background-size:auto 26px!important;font-size:0!important;color:transparent!important}body .sidebar.shared-sidebar nav a,body .sidebar nav a{height:31px!important;min-height:31px!important;display:flex!important;align-items:center!important;padding:9px 13px!important;color:#fff!important;text-decoration:none!important;font-size:12px!important;line-height:13px!important}body .sidebar.shared-sidebar nav a>img,body .sidebar nav a>img{width:16px!important;height:16px!important;max-width:16px!important;max-height:16px!important;object-fit:contain!important;margin-right:8px!important}body .sidebar.shared-sidebar nav a>span,body .sidebar nav a>span{width:16px!important;margin-right:8px!important;text-align:center!important}body .sidebar.shared-sidebar nav a b,body .sidebar nav a b{margin-left:0!important}body .sidebar.shared-sidebar nav a.active,body .sidebar.shared-sidebar nav a:hover,body .sidebar nav a.active,body .sidebar nav a:hover{background:#263840!important}body main{margin-left:143px!important;width:calc(100% - 143px)!important;padding-top:98px!important}body main>.topbar,body main>.products-topbar{position:fixed!important;left:143px!important;top:0!important;width:calc(100% - 143px)!important;height:49px!important;min-height:49px!important;padding:0 10px!important;z-index:85!important;background:#eee!important;display:flex!important;align-items:center!important}body main>.titlebar,body main>.clients-title,body main>.purchase-header,body main>.dashboard-title,body main>.finance-title,body main>.fleet-title,body main>.products-title,body main>.reports-title,body main>.config-title{position:fixed!important;left:143px!important;top:49px!important;width:calc(100% - 143px)!important;height:49px!important;min-height:49px!important;z-index:80!important;background-color:#5e7d89!important;background-image:none!important;opacity:1!important}body .finance-form-overlay,body .transfer-form-overlay,body .recurrence-form-overlay,body .receipt-form-overlay,body .receipt-history-overlay,body .conciliation-upload-overlay,body .new-purchase,body .stock-adjust-modal,body .account-modal{left:143px!important;top:49px!important;right:0!important;bottom:0!important;width:calc(100% - 143px)!important;height:calc(100vh - 49px)!important;z-index:82!important}body .client-tabs{display:flex!important;align-items:flex-start!important;height:38px!important;min-height:38px!important;border-bottom:1px solid #20a9a8!important;margin:0!important}body .client-tabs button{height:38px!important;min-height:38px!important;box-sizing:border-box!important;padding:10px 16px!important;margin:0 4px 0 0!important;font-size:12px!important;line-height:18px!important;border-radius:4px 4px 0 0!important}}body .sales-tab-icon,body .finance-tab-icon,body .purchase-tab-icon,body .client-tabs button img,body .product-tabs button img{width:15px!important;height:15px!important;max-width:15px!important;max-height:15px!important;object-fit:contain!important;flex:0 0 15px!important}body .local-action-icon,body .finance-action-icon,body .purchase-action-icon,body .toolbar-icon{width:18px!important;height:18px!important;max-width:18px!important;max-height:18px!important;object-fit:contain!important}</style>`;

const server = http.createServer((req, res) => {
  const requested = decodeURIComponent((req.url || '/').split('?')[0]);
  const relative = requested === '/' ? '/index.html' : requested;
  const file = path.resolve(root, `.${relative}`);

  if (!file.startsWith(root + path.sep) && file !== root) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(file, (error, stats) => {
    if (error || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file).toLowerCase();

    if (ext === '.html') {
      fs.readFile(file, 'utf8', (readError, html) => {
        if (readError) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Unable to read page');
          return;
        }
        let body = html;
        if (baseName !== 'login.html') {
          body = body.replace(/<aside class="sidebar[^"]*">[\s\S]*?<\/aside>/i, buildCanonicalSidebar(baseName));
        }
        const pwaTags = `${criticalFirstPaintCSS}<link rel="manifest" href="/manifest.webmanifest"><link rel="stylesheet" href="/mobile.css?v=20261021f"><meta name="theme-color" content="#5e7d89"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><script src="/pwa.js?v=20261021f" defer></script>`;
        body = body.includes('/pwa.js') ? body : body.replace('</head>', `${pwaTags}</head>`);
        res.writeHead(200, { 'Content-Type': types['.html'], 'Cache-Control': 'no-cache' });
        res.end(body);
      });
      return;
    }

    const isCacheableAsset = ['.png', '.webp', '.gif', '.svg', '.jpg', '.jpeg', '.ico'].includes(ext) || baseName === 'vendas-importadas.js';
    res.writeHead(200, {
      'Content-Type': types[ext] || 'application/octet-stream',
      'Cache-Control': isCacheableAsset ? 'public, max-age=86400' : 'no-cache'
    });
    fs.createReadStream(file).pipe(res);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Piremaxx Gestor listening on port ${port}`);
});
