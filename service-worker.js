var cacheName = 'offlineCache-v11';

var contentToCache = [
  './manifest.json',
  './assets/plus.png',
  './assets/home.png',
  './assets/plan.png',
  './assets/chicken_512.png',
  './assets/chicken_192.png',
  './assets/WorkSans-VariableFont_wght.ttf',
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

/*

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

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return fetch(event.request) || response;
    })
  );
});*/
