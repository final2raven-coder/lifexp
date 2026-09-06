const DEFAULT_BUILD_INFO = Object.freeze({
  buildId: 'development',
  label: 'development',
  commitSha: 'unknown',
  shortSha: 'unknown',
  builtAt: null,
  cacheName: 'lifexp-development'
});

const urlsToCache = [
  '/',
  '/index.html',
  '/build-info.js',
  '/build-info.json',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
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
  '/main.js'
];

let buildInfoPromise = null;

function normalizeBuildInfo(value) {
  if (!value || typeof value !== 'object') return DEFAULT_BUILD_INFO;
  const buildId = typeof value.buildId === 'string' && value.buildId.trim() ? value.buildId.trim() : DEFAULT_BUILD_INFO.buildId;
  const cacheName = typeof value.cacheName === 'string' && value.cacheName.trim() ? value.cacheName.trim() : `lifexp-${buildId}`;
  return Object.freeze({
    buildId,
    label: typeof value.label === 'string' && value.label.trim() ? value.label : buildId,
    commitSha: typeof value.commitSha === 'string' ? value.commitSha : DEFAULT_BUILD_INFO.commitSha,
    shortSha: typeof value.shortSha === 'string' ? value.shortSha : DEFAULT_BUILD_INFO.shortSha,
    builtAt: typeof value.builtAt === 'string' ? value.builtAt : DEFAULT_BUILD_INFO.builtAt,
    cacheName
  });
}

function getBuildInfo() {
  if (!buildInfoPromise) {
    const url = new URL('build-info.json', self.registration.scope);
    url.searchParams.set('lifexp_sw_build_check', String(Date.now()));
    buildInfoPromise = fetch(url.href, { cache: 'no-store' })
      .then(response => response.ok ? response.json() : Promise.reject(new Error(`Build info request failed with HTTP ${response.status}.`)))
      .then(normalizeBuildInfo)
      .catch(() => DEFAULT_BUILD_INFO);
  }
  return buildInfoPromise;
}

function resolveAppUrl(url) {
  return new URL(url, self.registration.scope).href;
}

function cacheAsset(cache, url) {
  const resolvedUrl = resolveAppUrl(url);
  return fetch(resolvedUrl, { cache: 'no-store' })
    .then(response => response.ok ? cache.put(resolvedUrl, response) : null)
    .catch(() => null);
}

self.addEventListener('message', event => {
  if (!event.data || event.data.type !== 'lifexp-get-status' || !event.ports || !event.ports[0]) return;
  event.waitUntil(getBuildInfo().then(buildInfo => {
    event.ports[0].postMessage({
      type: 'lifexp-sw-status',
      buildId: buildInfo.buildId,
      label: buildInfo.label,
      cacheName: buildInfo.cacheName,
      protocolVersion: 2,
      scope: self.registration.scope
    });
  }));
});

self.addEventListener('install', event => {
  event.waitUntil(
    getBuildInfo()
      .then(buildInfo => caches.open(buildInfo.cacheName))
      .then(cache => Promise.all(urlsToCache.map(url => cacheAsset(cache, url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    getBuildInfo().then(buildInfo => {
      if (buildInfo.buildId === DEFAULT_BUILD_INFO.buildId) return;
      return caches.keys().then(keys => Promise.all(
        keys
          .filter(key => key.startsWith('lifexp-') && key !== buildInfo.cacheName)
          .map(key => caches.delete(key))
      ));
    }).then(() => self.clients.claim())
  );
});

function isAppAsset(request) {
  if (request.method !== 'GET') return false;
  const pathname = new URL(request.url).pathname;
  return /\/(?:build-info\.js|build-info\.json|index\.html|item_flavor\.js|data_tasks\.js|engine\.js|ui_hub\.js|ui_tasks\.js|ui_combat\.js|ui_misc\.js|guild\.js|ui_feedback\.js|ui_quests\.js|item_system\.js|main\.js|items\.js|classes\.js|enemies\.js|combat\.js|quests\.js|expansion_[^/]+\.js|update2_content\.js|inventory_system\.js)$/.test(pathname);
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (isAppAsset(request)) {
    event.respondWith(
      fetch(request, { cache: 'no-store' }).then(response => {
        const copy = response.clone();
        getBuildInfo().then(buildInfo => caches.open(buildInfo.cacheName).then(cache => cache.put(request, copy))).catch(() => {});
        return response;
      }).catch(() => caches.match(request).then(response => response || caches.match(request)))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});
