const CACHE_NAME = 'piremaxx-gestor-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/login.html',
  '/financeiro.html',
  '/vendas.html',
  '/compras.html',
  '/clientes.html',
  '/produtos.html',
  '/configuracoes.html',
  '/styles.css',
  '/menu-lateral.js',
  '/pwa.js',
  '/mobile.css',
  '/manifest.webmanifest',
  '/public/pwa-icon.svg',
  '/public/logo.webp',
  '/public/logo.png',
  '/public/icons/icons8-home-48.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    return cache.addAll(APP_SHELL);
  }).then(function () {
    return self.skipWaiting();
  }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) { return key !== CACHE_NAME; }).map(function (key) { return caches.delete(key); }));
  }).then(function () {
    return self.clients.claim();
  }));
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(function (response) {
    if (response && response.ok) {
      var copy = response.clone();
      caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
    }
    return response;
  }).catch(function () {
    return caches.match(event.request).then(function (cached) {
      return cached || (event.request.mode === 'navigate' ? caches.match('/index.html') : Response.error());
    });
  }));
});
