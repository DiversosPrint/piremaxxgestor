const CACHE_NAME = 'piremaxx-gestor-v23';
const APP_SHELL = [
  '/',
  '/index.html',
  '/vendas.html',
  '/clientes.html',
  '/financeiro.html',
  '/financeiro-pagamentos.html',
  '/compras.html',
  '/produtos.html',
  '/frota.html',
  '/relatorios.html',
  '/configuracoes.html',
  '/novo-cliente.html',
  '/novo-produto.html',
  '/novo-servico.html',
  '/novo-comprador.html',
  '/login.html',
  '/offline.html',
  '/styles.css',
  '/mobile.css',
  '/vendas.css',
  '/menu-lateral.js',
  '/pwa.js',
  '/vendas.js',
  '/vendas-importadas.js',
  '/vendas-performance.js',
  '/manifest.webmanifest',
  '/public/pwa-icon-192.png',
  '/public/pwa-icon-512.png',
  '/public/apple-touch-icon.png',
  '/public/pwa-icon.svg',
  '/public/logo.png',
  '/public/logo.webp'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.allSettled(APP_SHELL.map(function (url) {
        return cache.add(url).catch(function (err) {
          console.warn('Cache add skipped:', url, err);
        });
      }));
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request).then(function (response) {
      if (response && response.ok) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, copy);
        });
      }
      return response;
    }).catch(function () {
      return caches.match(event.request, { ignoreSearch: true }).then(function (cached) {
        if (cached) return cached;
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html').then(function (indexFallback) {
            return indexFallback || caches.match('/offline.html');
          });
        }
        return new Response('', { status: 404, statusText: 'Not Found' });
      });
    })
  );
});
