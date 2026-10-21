(function () {
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
