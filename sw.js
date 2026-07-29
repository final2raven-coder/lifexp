const CACHE_NAME = 'lifexp-rpg-v13-block2';
const urlsToCache = [
  '/',
  '/index.html',
  '/classes.js',
  '/items.js',
  '/combat.js',
  '/enemies.js',
  '/quests.js',
  '/game.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const isAppFile = request.mode === 'navigate' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'document';

  if (isAppFile) {
    // Network first: GitHub Pages updates become visible without relying
    // on an old cached app shell. Cache is only the offline fallback.
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    event.respondWith(
      caches.match(request).then(response => response || fetch(request))
    );
  }
});

self.addEventListener('message', event => { if (event.data === 'SKIP_WAITING') self.skipWaiting(); });
