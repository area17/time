const { injectManifest } = require('workbox-build');

// These are some common options, and not all are required.
// Consult the docs for more info.
injectManifest({
  globDirectory: './',
  globPatterns: [
    'public/css/*.css',
    'public/fonts/*.woff2',
    'public/icons/*.svg',
    'public/js/timezones.js',
  ],
  swSrc: './js/service-worker-src.js',
  swDest: './public/sw.js',
}).then(({count, size, warnings}) => {
  // Optionally, log any warnings and details.
  warnings.forEach(warning => console.warn(warning));
  console.log(`${count} files will be precached, totaling ${size} bytes.`);
}).catch(error => {
  console.log(error)
});
