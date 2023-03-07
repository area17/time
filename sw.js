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

  workbox.precaching.precacheAndRoute([{"revision":"f5d8456c787a5398d9f0ea98b7c74286","url":"css/timezones.css"},{"revision":"dd9b30a7e2b672ceb3c1feeb18df32d7","url":"fonts/SuisseIntl-Regular-WebXL.woff2"},{"revision":"c6eb20f3c4c9b35c4b657932363b07e1","url":"icons/chances_rain.svg"},{"revision":"6da4ff678c7b736fc6adad16217a2523","url":"icons/moon_first_moon.svg"},{"revision":"8e4b2534981d9f270eb836dc405d9166","url":"icons/moon_full_moon.svg"},{"revision":"e8cb430069bfd89505fa51b8d33838d8","url":"icons/moon_last_quarter.svg"},{"revision":"ee9190e8a5a91ec1cab00d601062057c","url":"icons/moon_new_moon.svg"},{"revision":"9bc6e244df3f9da1360641dcd726986f","url":"icons/moon_waning_crescent.svg"},{"revision":"a9b69e64c9efe4470fec7bf2899ac54c","url":"icons/moon_waning_gibbous.svg"},{"revision":"f30c075295e69a1c23873d5e59344b9e","url":"icons/moon_waxing_crescent.svg"},{"revision":"d6fa1033cb5703639c880687ef4554f4","url":"icons/moon_waxing_gibbous.svg"},{"revision":"71f9ce58b57d4c7163579b761718e1df","url":"icons/weather_clear.svg"},{"revision":"5abffa3965df249e1bcf3bb6735aae9f","url":"icons/weather_cloudy.svg"},{"revision":"617b72e258e289039eb6e838a35971c0","url":"icons/weather_fog_split.svg"},{"revision":"b3ab0c4b018bdab2655695471f0beb24","url":"icons/weather_fog.svg"},{"revision":"cbf2a662d0174f5e0ca5727dd8742125","url":"icons/weather_partly_cloudy_night_split.svg"},{"revision":"744f9c055ca024dbea41a31254239535","url":"icons/weather_partly_cloudy_night.svg"},{"revision":"4eb4002aa7a2cdc525a8e1aaf8f290e0","url":"icons/weather_partly_cloudy_split.svg"},{"revision":"d12e388dd90f38794e468ab6e6b67661","url":"icons/weather_partly_cloudy.svg"},{"revision":"83e9819eaad185b92c512ade98c8e8a4","url":"icons/weather_rain.svg"},{"revision":"f87ead0fbe392823e6a6316c16693bc2","url":"icons/weather_snow_split.svg"},{"revision":"74aebda26ff2d0494c925b312bd36d1f","url":"icons/weather_snow.svg"},{"revision":"efeccdfb88a6fa4c957ab96d650f203f","url":"icons/weather_wind_split.svg"},{"revision":"a5ba10a5c5735d11fe24cb9a1c00ab21","url":"icons/weather_wind.svg"},{"revision":"b6d97e04b2ab4689b1d39cf8085c8595","url":"js/timezones.js"}]);

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
