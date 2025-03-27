// src/service-worker.js
import { build, files, version } from "$service-worker";

// Unique cache name based on the build version
const CACHE_NAME = `cache-${version}`;

// List of assets to cache initially
// 'build' contains core SvelteKit files
// 'files' contains files from your 'static' directory
const ASSETS_TO_CACHE = [...build, ...files];

// Install event: Cache necessary assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching assets on install");
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        self.skipWaiting(); // Activate the new service worker immediately
      }),
  );
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(
              "[Service Worker] Deleting old cache:",
              cacheName,
            );
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim(); // Take control of uncontrolled clients
});

// Fetch event: Serve from cache if available, otherwise fetch from network
self.addEventListener("fetch", (event) => {
  // Ignore non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Ignore requests to Chrome extensions or other schemes
  if (!event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // console.log('[Service Worker] Serving from cache:', event.request.url);
        return cachedResponse;
      }

      // console.log('[Service Worker] Fetching from network:', event.request.url);
      return fetch(event.request).then(
        (response) => {
          // Optional: Cache dynamically fetched resources if needed
          // Be careful caching everything, especially API responses that change often
          // if (response.status === 200) {
          //   const responseToCache = response.clone();
          //   caches.open(CACHE_NAME).then((cache) => {
          //     cache.put(event.request, responseToCache);
          //   });
          // }
          return response;
        },
        (error) => {
          console.error(
            "[Service Worker] Fetch failed:",
            error,
            event.request.url,
          );
          // Optional: Return a fallback offline page here
          // return caches.match('/offline.html');
          throw error;
        },
      );
    }),
  );
});
