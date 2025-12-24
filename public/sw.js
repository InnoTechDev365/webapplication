// ExpenseCoin Service Worker
// Version: 3.0.0 - No-notifications + cache refresh

const CACHE_VERSION = 'v3';
const STATIC_CACHE = `expensecoin-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `expensecoin-dynamic-${CACHE_VERSION}`;

// Static assets to cache immediately (avoid caching HTML to prevent stale deploys)
const STATIC_ASSETS = [
  './manifest.json',
  './favicon.ico',
  './pwa-192x192.png',
  './pwa-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => {
          return new Request(url, { cache: 'reload' });
        })).catch(err => {
          console.warn('[SW] Some assets failed to cache:', err);
        });
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip cross-origin requests except for fonts
  if (url.origin !== location.origin && !url.hostname.includes('fonts')) {
    return;
  }
  
  // For navigation requests (HTML), force network (prevents stale UI after deploy)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(new Request(request.url, { cache: 'no-store' }))
        .then((response) => {
          // Cache the latest navigation response for offline fallback
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(request)
            .then((response) => response || caches.match('./index.html'));
        })
    );
    return;
  }
  
  // For static assets, use cache-first
  if (request.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$/)) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Update cache in background
            fetch(request).then((networkResponse) => {
              if (networkResponse.ok) {
                caches.open(STATIC_CACHE).then((cache) => {
                  cache.put(request, networkResponse);
                });
              }
            }).catch(() => {});
            return cachedResponse;
          }
          
          // Not in cache, fetch from network
          return fetch(request)
            .then((response) => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return response;
            });
        })
    );
    return;
  }
  
  // For everything else, use network-first
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
