// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-7-starter';

const urlsToCache = [
  // '/',
  '/assets/scripts/main.js',
  // '/assets/scripts/Router.js',
  // '/assets/components/RecipeCard.js',
  // '/assets/components/RecipeExpand.js',
  '/assets/styles/main.css',
]

// Once the service worker has been installed, feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  /**
   * TODO - Part 2 Step 2
   * Create a function as outlined above
   */
  // cache name was already defined above
  console.log('SW: Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  )  
});

/**
 * Once the service worker 'activates', this makes it so clients loaded
 * in the same scope do not need to be reloaded before their fetches will
 * go through this service worker
 */
self.addEventListener('activate', function (event) {
  /**
   * TODO - Part 2 Step 3
   * Create a function as outlined above, it should be one line
   */
  // Make it so clients loaded in the same scope don't have to be reloaded before their fetches go through this service worker, the function is below:
  console.log('SW: Activate');
  event.waitUntil(clients.claim());
});

// Intercept fetch requests and store them in the cache
self.addEventListener('fetch', function (event) {
  /**
   * TODO - Part 2 Step 4
   * Create a function as outlined above
   */
  console.log('SW: Fetch');
  event.respondWith(caches.match(event.request).then((response) => {
    
    // if we got it already let's reuse it
    if (response) return response;

    // otherwise...
    return fetch(event.request).then(response => {
      const cachedResponse = response.clone();

      // bad invalid responses shouldn't be saved/cached
      if (!response || response.status !== 200 || response.type !== 'basic') return response;

      // store the response for later quick access?
      caches.open(CACHE_NAME).then(cache => {
        cache.put(event.request, cachedResponse);
      })

      // finally pass along the response
      return response;
    });
  }))
});