const CACHE_NAME = 'lifexp-v20-split-gamejs';
const urlsToCache = [
  '/',
  '/index.html',
  '/classes.js',
  '/items.js',
  '/enemies.js',
  '/combat.js',
  '/quests.js',
  '/item_flavor.js',
  '/data_tasks.js',
  '/engine.js',
  '/expansion_items.js',
  '/expansion_enemies.js',
  '/expansion_quests.js',
  '/expansion_tasks.js',
  '/update2_content.js',
  '/inventory_system.js',
  '/ui_hub.js',
  '/ui_tasks.js',
  '/ui_combat.js',
  '/ui_misc.js',
  '/guild.js',
  '/ui_feedback.js',
  '/ui_quests.js',
  '/item_system.js',
  '/main.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(urlsToCache.map(url =>
        fetch(url)
          .then(response => response.ok ? cache.put(url, response) : null)
          .catch(() => null)
      )))
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
    /\/(?:index\.html|item_flavor\.js|data_tasks\.js|engine\.js|ui_hub\.js|ui_tasks\.js|ui_combat\.js|ui_misc\.js|guild\.js|ui_feedback\.js|ui_quests\.js|item_system\.js|main\.js|items\.js|classes\.js|enemies\.js|combat\.js|quests\.js|expansion_[^/]+\.js|update2_content\.js|inventory_system\.js|sw\.js)$/.test(new URL(request.url).pathname);

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

  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});
