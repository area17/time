var timer = require("grunt-timer");
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
          'js/timezones.js': ['js/src/*.js','js/src/**/*.js']
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
          'js/timezones.js': ['js/src/*.js','js/src/**/*.js']
        }
      }
    },
    sass: {
      dev: {
        options: {
          sourceMap: false,
          outputStyle: "nested"
        },
        files: {
          'css/timezones.css': 'scss/timezones.scss'
        }
      },
      dist: {
        options: {
          sourceMap: false,
          outputStyle: "compressed"
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
        files: ['js/src/*.js','js/src/**/*.js'],
        tasks: ['uglify:dev']
      }
    }
  });


  // Default task
  grunt.registerTask('dist', ['gitinfo','sass:dist','uglify:dist']);

  // fresh GIT clone
  grunt.registerTask('default', ['gitinfo','sass:dev','uglify:dev']);

};
