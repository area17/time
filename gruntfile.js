var timer = require('grunt-timer');
var workboxBuild = require('workbox-build');
module.exports = function(grunt) {
  timer.init(grunt);

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    gitinfo: {
      options: {
        cwd: '.'
      },
    },
    uglify: {
      dev: {
        options: {
          mangle: false,
          beautify: true,
          compress: false,
          preserveComments: true
        },
        files: {
          'js/timezones.js': ['js/src/*.js','js/src/**/*.js', '!js/src/service-worker-src.js', '!js/src/sw.js']
        }
      },
      dist: {
        options: {
          mangle: false,
          beautify: false,
          compress: true,
          preserveComments: false
        },
        files: {
          'js/timezones.js': ['js/src/*.js','js/src/**/*.js', '!js/src/service-worker-src.js', '!js/src/sw.js']
        }
      }
    },
    sass: {
      dev: {
        options: {
          sourceMap: false,
          outputStyle: 'nested'
        },
        files: {
          'css/timezones.css': 'scss/timezones.scss'
        }
      },
      dist: {
        options: {
          sourceMap: false,
          outputStyle: 'compressed'
        },
        files: {
          'css/timezones.css': 'scss/timezones.scss'
        }
      }
    },
    watch: {
      sass: {
        files: ['scss/*.scss','scss/**/*.scss','scss/**/**/*.scss'],
        tasks: ['sass:dev']
      },
      scripts: {
        files: ['js/src/*.js','js/src/**/*.js', '!js/src/sw.js'],
        tasks: ['uglify:dev', 'gulp:generateSwManifest']
      }
    },
    gulp: {
      generateSwManifest: function () {
        return workboxBuild.injectManifest({
          globDirectory: './',
          globPatterns: [
            'css/*.css',
            'fonts/*.woff2',
            'icons/*.svg',
            'js/timezones.js',
          ],
          templatedURLs: {
            //'/' : '/index.php'
          },
          swSrc: './js/src/service-worker-src.js',
          swDest: './sw.js',
        }).then(({count, size, warnings}) => {
          // Optionally, log any warnings and details.
          warnings.forEach(warning => console.warn(warning));
          console.log(`${count} files will be precached, totaling ${size} bytes.`);
        }).catch(error => {
          console.log(error)
        });
      }
    }
  });

  grunt.loadNpmTasks('grunt-gulp');

  // Default task
  grunt.registerTask('dist', ['gitinfo','sass:dist','uglify:dist', 'gulp:generateSwManifest']);

  // fresh GIT clone
  grunt.registerTask('default', ['gitinfo','sass:dev','uglify:dev', 'gulp:generateSwManifest']);

};
