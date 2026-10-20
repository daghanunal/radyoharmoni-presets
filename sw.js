/* Radyo Harmoni service worker: makes the page installable and readable offline.
   Network first, so a new revision always shows; the cache is only the fallback.
   Streams, videos and range requests are never touched. */
// The release build puts a hash of its files in the name, so every release installs afresh and clears the old cache
const CACHE = 'rh-ayvalik-1525ad6c58';
const SHELL = ['./', './app.js', './info.js', 'shared/radio.js', 'shared/light.js', 'shared/i18n.js', './i18n/en.js', 'shared/vendor/hls.min.js',
  'shared/fonts/fonts.css', 'media/ayvalik.jpg', 'media/monteverde-photo.jpg', 'media/moon.png', './icons/icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || req.headers.has('range') || /\.(mp4|m4v|m3u8|ts|mp3|aac)$/i.test(url.pathname)) return;
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(async () => (await caches.match(req)) || (await caches.match(req, { ignoreSearch: true }))   // offline: this file, else its last copy
    || (req.mode === 'navigate' && await caches.match('./')) || Response.error()));
});
