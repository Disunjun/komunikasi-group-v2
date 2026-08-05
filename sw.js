// Komunikasi Group V2 - Service Worker Auto Update
// HTML/navigation: NETWORK FIRST so every deploy gets the newest app.
// Static assets: stale-while-revalidate for speed + offline fallback.

const CACHE_NAME = 'komgrup-auto-v2';
const APP_SHELL = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .catch(err => console.warn('[SW] Precache warning:', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;

  // Never cache Railway/API traffic.
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    return;
  }

  // IMPORTANT: index.html and browser navigations always try network first.
  // This prevents an old cached index.html from surviving a new Netlify deploy.
  if (request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request, { cache: 'no-store' });
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put('/index.html', fresh.clone());
        }
        return fresh;
      } catch (err) {
        return (await caches.match('/index.html')) ||
               new Response('Aplikasi sedang offline.', {
                 status: 503,
                 headers: {'Content-Type':'text/plain; charset=utf-8'}
               });
      }
    })());
    return;
  }

  // Other same-origin static files: return cache quickly, refresh in background.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    const network = fetch(request).then(async response => {
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    }).catch(() => null);

    if (cached) {
      event.waitUntil(network);
      return cached;
    }

    return (await network) || new Response('Offline', {status:503});
  })());
});
