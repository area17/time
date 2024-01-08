importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js');

if (workbox) {
  // cache name
  workbox.core.setCacheNameDetails({
    prefix: 'a17-time-cache',
    precache: 'precache',
    runtime: 'runtime',
  });
  workbox.clientsClaim = true;
  workbox.skipWaiting = true;

  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  workbox.googleAnalytics.initialize();
  // runtime cache
  workbox.routing.registerRoute(
    new RegExp('/forecast.php'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'forecast-cache',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 30,
        })
      ]
    })
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
