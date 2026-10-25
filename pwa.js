(function () {
  function fixFinanceSidebarLink() {
    document.querySelectorAll('.sidebar nav a').forEach(function (link) {
      if (link.textContent.indexOf('Financeiro') >= 0) link.setAttribute('href', 'financeiro.html');
    });
  }
  document.addEventListener('DOMContentLoaded', fixFinanceSidebarLink);

  // Sincronização e roteamento por hash para todas as abas do financeiro
  var userSwitchedTab = false;
  document.addEventListener('click', function (event) {
    var tabBtn = event.target.closest && event.target.closest('[data-finance-tab]');
    if (tabBtn && event.isTrusted) {
      userSwitchedTab = true;
      var hashMap = {
        receivables: '#recebimentos',
        payables: '#pagamentos',
        transfers: '#transferencias',
        recurrence: '#recorrencia',
        receipts: '#recibos',
        conciliation: '#conciliacao'
      };
      var newHash = hashMap[tabBtn.dataset.financeTab] || '';
      if (newHash && location.hash !== newHash) {
        history.replaceState(null, '', location.pathname + newHash);
      }
    }
  }, true);

  function openFinanceTabFromHash() {
    if (userSwitchedTab) return;
    var path = location.pathname.toLowerCase();
    if (!path.endsWith('/financeiro.html') && !path.endsWith('/financeiro-pagamentos.html') && !path.endsWith('/financeiro')) return;
    var hash = location.hash.toLowerCase();
    var target = 'receivables';
    if (hash === '#pagar' || hash === '#pagamentos') target = 'payables';
    else if (hash === '#transferencias' || hash === '#transferencia') target = 'transfers';
    else if (hash === '#recorrencia') target = 'recurrence';
    else if (hash === '#recibos' || hash === '#recibo') target = 'receipts';
    else if (hash === '#conciliacao' || hash === '#conciliar') target = 'conciliation';

    if (typeof window.switchFinanceTab === 'function') {
      window.switchFinanceTab(target);
    } else {
      var tab = document.querySelector('[data-finance-tab="' + target + '"]');
      if (tab) tab.click();
    }
  }

  document.addEventListener('DOMContentLoaded', openFinanceTabFromHash);
  window.addEventListener('hashchange', function () {
    userSwitchedTab = false;
    openFinanceTabFromHash();
  });

  // Centralização suave por toque das abas horizontais
  document.addEventListener('click', function (e) {
    var tab = e.target.closest('.tabs .tab, .finance-tabs button, .purchase-tab, .client-tabs button, .product-tabs button, .categories button, .buyer-tabs button, .fleet-tabs button, .service-tabs button');
    if (tab) {
      setTimeout(function () {
        try {
          tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } catch (err) {}
      }, 40);
    }
  }, true);

  function scrollInitialActiveTab() {
    var activeTab = document.querySelector('.tabs .tab.active, .finance-tabs button.active, .purchase-tab.active, .client-tabs button.active, .product-tabs button.active, .categories button.active, .buyer-tabs button.active, .fleet-tabs button.active');
    if (activeTab) {
      setTimeout(function () {
        try {
          activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } catch (err) {}
      }, 140);
    }
  }

  // Barra de Navegação Inferior PWA (Bottom Navigation)
  function highlightActiveBottomNav() {
    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var map = {
      'index.html': 'home',
      '': 'home',
      'financeiro.html': 'financeiro',
      'financeiro-pagamentos.html': 'financeiro',
      'vendas.html': 'vendas',
      'compras.html': 'compras',
      'clientes.html': 'clientes',
      'novo-cliente.html': 'clientes',
      'novo-comprador.html': 'clientes'
    };
    var activeKey = map[path] || '';
    document.querySelectorAll('.pwa-bottom-nav .pwa-nav-item').forEach(function (item) {
      item.classList.toggle('active', item.dataset.pwaNav === activeKey);
    });
  }

  function injectBottomNav() {
    if (document.querySelector('.pwa-bottom-nav')) return;
    if (document.body.classList.contains('login-page')) return;
    var nav = document.createElement('nav');
    nav.className = 'pwa-bottom-nav';
    nav.setAttribute('aria-label', 'Navegação rápida PWA');
    nav.innerHTML = '' +
      '<a href="index.html" class="pwa-nav-item" data-pwa-nav="home">' +
        '<img src="public/icons/icons8-home-48.png" alt="" class="pwa-nav-icon">' +
        '<span>Início</span>' +
      '</a>' +
      '<a href="financeiro.html" class="pwa-nav-item" data-pwa-nav="financeiro">' +
        '<img src="public/icons/icons8-financial-64.png" alt="" class="pwa-nav-icon">' +
        '<span>Financeiro</span>' +
      '</a>' +
      '<a href="vendas.html" class="pwa-nav-item" data-pwa-nav="vendas">' +
        '<img src="public/icons/icons8-buy-for-cash-48.png" alt="" class="pwa-nav-icon">' +
        '<span>Vendas</span>' +
      '</a>' +
      '<a href="compras.html" class="pwa-nav-item" data-pwa-nav="compras">' +
        '<img src="public/icons/icons8-buy-48.png" alt="" class="pwa-nav-icon">' +
        '<span>Compras</span>' +
      '</a>' +
      '<a href="clientes.html" class="pwa-nav-item" data-pwa-nav="clientes">' +
        '<img src="public/icons/icons8-budget-48.png" alt="" class="pwa-nav-icon">' +
        '<span>Contatos</span>' +
      '</a>' +
      '<button type="button" class="pwa-nav-item pwa-nav-menu" data-pwa-nav="menu" aria-label="Abrir menu">' +
        '<span class="pwa-nav-icon-text">☰</span>' +
        '<span>Menu</span>' +
      '</button>';
    document.body.appendChild(nav);

    var menuBtn = nav.querySelector('.pwa-nav-menu');
    if (menuBtn) {
      menuBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window.piremaxxToggleMobileMenu === 'function') {
          window.piremaxxToggleMobileMenu();
        } else {
          var drawerBtn = document.querySelector('.mobile-menu-toggle');
          if (drawerBtn) drawerBtn.click();
          else document.body.classList.toggle('mobile-menu-open');
        }
      });
    }
    highlightActiveBottomNav();
  }

  function applyMobileLayout() {
    var mobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    document.documentElement.classList.toggle('pwa-mobile', !!mobile);
    if (!mobile) return;
    document.querySelectorAll('main, .sidebar, main>.topbar, main>.products-topbar, main>.titlebar, main>.clients-title, main>.purchase-header, main>.dashboard-title, main>.finance-title, main>.fleet-title, main>.products-title, main>.reports-title, main>.config-title').forEach(function (element) {
      element.removeAttribute('style');
    });
  }

  applyMobileLayout();
  window.addEventListener('resize', applyMobileLayout);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectBottomNav();
      scrollInitialActiveTab();
    });
  } else {
    injectBottomNav();
    scrollInitialActiveTab();
  }

  // PWA Service Worker
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function (registration) {
      registration.update();
    }).catch(function (error) {
      console.warn('PWA indisponível:', error);
    });
  });

  // PWA Install Prompt Banner
  var deferredInstall;
  function showInstallBanner() {
    if (document.querySelector('.pwa-install-banner') || window.matchMedia('(display-mode: standalone)').matches) return;
    if (localStorage.getItem('piremaxx_pwa_dismissed')) return;
    var banner = document.createElement('div');
    banner.className = 'pwa-install-banner';
    banner.innerHTML = '<div class="pwa-install-info"><img src="public/pwa-icon-192.png" alt="App"><span>Instalar Piremaxx no celular</span></div><div class="pwa-install-buttons"><button type="button" class="pwa-install-confirm">Instalar</button><button type="button" class="pwa-install-close" aria-label="Fechar">×</button></div>';
    document.body.appendChild(banner);
    banner.querySelector('.pwa-install-confirm').onclick = function () {
      if (typeof window.piremaxxInstallPWA === 'function') window.piremaxxInstallPWA();
    };
    banner.querySelector('.pwa-install-close').onclick = function () {
      banner.remove();
      localStorage.setItem('piremaxx_pwa_dismissed', '1');
    };
  }

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredInstall = event;
    window.piremaxxInstallPWA = function () {
      if (!deferredInstall) return Promise.resolve(false);
      deferredInstall.prompt();
      return deferredInstall.userChoice.then(function (choice) {
        deferredInstall = null;
        var banner = document.querySelector('.pwa-install-banner');
        if (banner) banner.remove();
        return choice.outcome === 'accepted';
      });
    };
    showInstallBanner();
    document.dispatchEvent(new CustomEvent('pwa-install-ready'));
  });

  window.addEventListener('appinstalled', function () {
    deferredInstall = null;
    document.documentElement.classList.add('pwa-installed');
    var banner = document.querySelector('.pwa-install-banner');
    if (banner) banner.remove();
  });
})();
