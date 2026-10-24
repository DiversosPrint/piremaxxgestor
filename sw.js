const CACHE_NAME = 'piremaxx-gestor-v18';
const APP_SHELL = [
  '/offline.html',
  '/',
  '/index.html',
  '/styles.css',
  '/vendas.css',
  '/menu-lateral.js',
  '/pwa.js',
  '/mobile.css'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.allSettled(APP_SHELL.map(function(url) {
        return cache.add(url).catch(function(err){ console.warn('Cache add skipped:', url); });
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
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request).then(function (response) {
      if (response && response.ok) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
      }
      return response;
    }).catch(function () {
      return caches.match(event.request, { ignoreSearch: true }).then(function (cached) {
        if (cached) return cached;
        if (event.request.mode === 'navigate') return caches.match('/offline.html');
        return new Response('', { status: 404, statusText: 'Not Found' });
      });
    })
  );
});
