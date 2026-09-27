(() => {
  if (!('serviceWorker' in navigator)) return;

  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  let deferredPrompt = null;

  navigator.serviceWorker.register('/service-worker.js?v=2').catch(() => {});

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    if (standalone || document.querySelector('.pwa-install')) return;

    const button = document.createElement('button');
    button.className = 'pwa-install';
    button.type = 'button';
    button.textContent = 'Instalar Piremaxx Gestor';
    Object.assign(button.style, {
      position: 'fixed',
      right: '18px',
      bottom: '18px',
      zIndex: '9999',
      border: '0',
      borderRadius: '3px',
      padding: '11px 16px',
      background: '#08d887',
      color: '#fff',
      font: 'bold 13px Arial, sans-serif',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,.22)'
    });
    button.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      button.remove();
    });
    document.body.appendChild(button);
  });

  window.addEventListener('appinstalled', () => {
    document.querySelector('.pwa-install')?.remove();
    deferredPrompt = null;
  });
})();
