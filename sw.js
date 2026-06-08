// Service Worker de FamiliApp
// Cambiar la versión al actualizar archivos para forzar refresco de caché.
const CACHE = 'familiapp-v8';

// App shell + avatares: se cachean para que la app abra al instante y offline.
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './pipe_normal.webp',
  './pili_normal.webp',
  './pipe_frio.webp',
  './pili_frio.webp',
  './pipe_mucho_frio.webp',
  './pili_mucho_frio.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Solo manejamos pedidos del mismo origen (no Firebase, clima ni CDNs).
  if (url.origin !== self.location.origin) return;

  // Imágenes y assets: primero caché (rápido), luego red de respaldo.
  if (ASSETS.some((a) => url.pathname.endsWith(a.replace('./', '')))) {
    e.respondWith(
      caches.match(e.request).then((hit) => hit || fetch(e.request))
    );
    return;
  }

  // HTML: primero red (para ver cambios), con caché como respaldo offline.
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
