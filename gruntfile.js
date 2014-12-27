// grunt compass https://github.com/gruntjs/grunt-contrib-compass
// grunt timer https://github.com/leecrossley/grunt-timer
// load grunt tasks https://www.npmjs.org/package/load-grunt-tasks
// grunt git info https://github.com/damkraw/grunt-gitinfo
// grunt rename https://github.com/jdavis/grunt-rename
// grunt clean https://github.com/gruntjs/grunt-contrib-clean
// grunt banner https://github.com/mattstyles/grunt-banner
// grunt sass https://github.com/sindresorhus/grunt-sass
// grunt-datauri-variables https://github.com/davemo/grunt-datauri-variables

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
      }
    },
    usebanner: {
      images: {
        options: {
          position: 'top',
          banner: '/*!\n' +
                  ' * Generated with a Grunt task\n' +
                  ' * #### DON\'T EDIT THIS FILE\n' +
                  ' */\n',
          linebreak: false
        },
        files: {
          src: [ 'img/_images.scss']
        }
      }
    },
    svgmin: {
      options: {
        plugins: [
          { removeViewBox: false },
          { removeUselessStrokeAndFill: false }
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'img/svg_source',
          src: '*.svg',
          dest: 'img/',
          ext: '.svg'
        }]
      }
    },
    datauri: {
      options: {
        varPrefix: '',
        useMap: "images"
      },
      your_target: {
        files: {
          src: "img/*.{png,jpg,gif,svg}",
          // dest doesn't work, so I'm using rename:datauri and clean:datauri for now
          dest: "scss/_images.scss"
        }
      }
    },
    rename: {
      datauri: {
        files: [{
          src: 'src',
          dest: 'scss/_images.scss'
        }]
      }
    },
    clean: {
      datauri: {
        src: 'dest'
      }
    },
    watch: {
      svg: {
        files: ['img/svg_source/*.svg'],
        tasks: ['svgmin']
      },
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
  grunt.registerTask('default', ['gitinfo','sass:dev','uglify:dev']);

  // Image task
  grunt.registerTask('images', ['svgmin:dist','datauri','rename:datauri','clean:datauri','usebanner:images']);

  // fresh GIT clone
  grunt.registerTask('init', ['gitinfo','svgmin','datauri','rename:datauri','clean:datauri','usebanner:images','sass:dev','uglify:dev']);

};
