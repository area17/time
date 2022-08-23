const { injectManifest } = require('workbox-build');

// These are some common options, and not all are required.
// Consult the docs for more info.
injectManifest({
  globDirectory: './',
  globPatterns: [
    'css/*.css',
    'fonts/*.woff2',
    'icons/*.svg',
    'js/timezones.js',
  ],
  swSrc: './js/src/service-worker-src.js',
  swDest: './sw.js',
}).then(({count, size, warnings}) => {
  // Optionally, log any warnings and details.
  warnings.forEach(warning => console.warn(warning));
  console.log(`${count} files will be precached, totaling ${size} bytes.`);
}).catch(error => {
  console.log(error)
});
