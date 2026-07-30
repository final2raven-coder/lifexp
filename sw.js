const CACHE_NAME = 'lifexp-v15-canonical-inventory';
const urlsToCache = [
  '/',
  '/index.html',
  '/classes.js',
  '/items.js',
  '/enemies.js',
  '/combat.js',
  '/quests.js',
  '/game.js',
  '/expansion_items.js',
  '/expansion_enemies.js',
  '/expansion_quests.js',
  '/expansion_tasks.js',
  '/update2_content.js',
  '/ashbrand_hotfix.js',
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
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const isAppAsset = request.method === 'GET' &&
    /\/(?:index\.html|game\.js|items\.js|classes\.js|enemies\.js|combat\.js|quests\.js|expansion_[^/]+\.js|update2_content\.js|ashbrand_hotfix\.js|sw\.js)$/.test(new URL(request.url).pathname);

  if (isAppAsset) {
    event.respondWith(
      fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      }).catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(caches.match(request).then(response => response || fetch(request)));
});
