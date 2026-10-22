(function () {
  function fixFinanceSidebarLink() {
    document.querySelectorAll('.sidebar nav a').forEach(function (link) {
      if (link.textContent.indexOf('Financeiro') >= 0) link.setAttribute('href', 'financeiro.html');
    });
  }
  document.addEventListener('DOMContentLoaded', fixFinanceSidebarLink);
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
      if (newHash) {
        history.replaceState(null, '', location.pathname + newHash);
      }
    }
  }, true);
  function openPayablesFromHash() {
    if (userSwitchedTab) return;
    if ((location.pathname.endsWith('/financeiro.html') || location.pathname.endsWith('/financeiro-pagamentos.html')) && (location.hash === '#pagar' || location.hash === '#pagamentos')) {
      var tab = document.querySelector('[data-finance-tab="payables"]');
      if (tab) tab.click();
    }
  }
  document.addEventListener('DOMContentLoaded', openPayablesFromHash);
  window.addEventListener('hashchange', function () {
    userSwitchedTab = false;
    openPayablesFromHash();
  });
  function applyMobileLayout() {
    var mobile = window.matchMedia && window.matchMedia('(max-width: 700px)').matches;
    document.documentElement.classList.toggle('pwa-mobile', !!mobile);
    if (!mobile) return;
    document.querySelectorAll('main, .sidebar, main>.topbar, main>.products-topbar').forEach(function (element) {
      element.removeAttribute('style');
    });
  }
  applyMobileLayout();
  window.addEventListener('resize', applyMobileLayout);

  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function (registration) {
      registration.update();
    }).catch(function (error) {
      console.warn('PWA indisponível:', error);
    });
  });

  var deferredInstall;
  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredInstall = event;
    window.piremaxxInstallPWA = function () {
      if (!deferredInstall) return Promise.resolve(false);
      deferredInstall.prompt();
      return deferredInstall.userChoice.then(function (choice) {
        deferredInstall = null;
        return choice.outcome === 'accepted';
      });
    };
    document.dispatchEvent(new CustomEvent('pwa-install-ready'));
  });

  window.addEventListener('appinstalled', function () {
    deferredInstall = null;
    document.documentElement.classList.add('pwa-installed');
  });
})();
