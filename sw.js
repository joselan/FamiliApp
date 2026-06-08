// Service Worker de FamiliApp
// Estrategia: "red primero" para TODO lo del mismo origen, con la caché solo
// como respaldo offline. Así, estando con internet, siempre se ve la última
// versión (HTML e imágenes) sin quedar pegado en versiones viejas.
const CACHE = 'familiapp-v13';

// Lo mínimo para que abra offline. Se cachea al instalar y, además, cada
// pedido exitoso refresca la caché (ver fetch).
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
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
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
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Solo manejamos pedidos del mismo origen (no Firebase, clima ni CDNs).
  if (url.origin !== self.location.origin) return;

  // Red primero: traemos lo último y de paso refrescamos la caché.
  // Si no hay internet, respondemos con lo último que tengamos guardado.
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
