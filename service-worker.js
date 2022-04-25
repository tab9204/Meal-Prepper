var cacheName = 'offlineCache-v5';

var contentToCache = [
  './manifest.json',
  './assets/loading.gif',
  './assets/navigate.png',
  './assets/plus.png',
  './assets/shoppingCart.png',
  './assets/trashCan.png',
  './assets/home.png',
  './assets/plan.png',
  './assets/WorkSans-VariableFont_wght.ttf',
  './assets/x.png',
  './libraries/mithril.min.js',
  './libraries/pouchdb-7.2.1.js'
];


self.addEventListener('install', (event) => {
  console.log('Service Worker Installed');
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('Service Worker Caching Files');
      return cache.addAll(contentToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if(key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', (event) => {
  var url = event.request;
  event.respondWith(
    caches.match(event.request).then(function(response) {//respond with cache first
      return response || fetch(event.request);
    })
  );
});
