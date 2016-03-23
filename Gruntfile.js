module.exports = function(grunt) {

  var fsExtra = require('fs-extra'); // file system commands for node.js
  var fs = require('fs');
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {  // $ grunt connect
      server: {
        options: {
          port: 8000,
          base: '.',
          keepalive: true
        }
      }
    },
    uglify: {
      options: {
        compress: {
          drop_console: true
        }
      },
      dev_application_js: {
        options: {
          mangle: false,
          compress: false,
          beautify: true
        },
        files: {
          'app/application.js': ['app/js/*.js']
        }
      },
    },
    sass: {
      options: {
        outputStyle: 'compressed'
      },
      // vendor_css: {
      //   files: { "assets/vendor.css": "vendor/stylesheets/vendor.css.scss" }
      // },
      application_css: {
        files: { "stylesheets/application.css": "stylesheets/application.css.scss" }
      }
    },
    watch: {
      options: {
        port: 23456
      },
      application_js: {
        files: ['app/js/*.js'],
        tasks: ['process_application_js:dev'],
        options: {
          livereload: true,
        }
      },
      application_scss: {
        files: ['app/stylesheets/*.scss'],
        tasks: ['process_application_scss'],
        options: {
          livereload: true,
        }
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      dev: [
        'watch',
        'connect',
      ]
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('connect', [], function () {
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.task.run('connect');
  });

  grunt.registerTask('process_application_scss', [], function () {
    require('time-grunt')(grunt);
    grunt.loadNpmTasks('grunt-sass');
    fsExtra.ensureFileSync('stylesheets/application.css.scss'); // Ensure necessary file exist

    grunt.task.run('sass:application_css');
  });

  grunt.registerTask('process_application_js:dev', [], function () {
    require('time-grunt')(grunt);
    grunt.loadNpmTasks('grunt-contrib-uglify');

    fsExtra.ensureFileSync('app/application.js'); // Ensure necessary file exist

    grunt.task.run(
      'uglify:dev_application_js'
    );
  });

  grunt.registerTask('compile_dev', [], function(mode) {
    var fullTaskList = [
      // 'process_vendor_scss',
      'process_application_scss',
      'process_application_js:dev'
    ];

    grunt.task.run(fullTaskList);

  });

  // ** default grunt behaviour **
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', [
    'compile_dev',
    'concurrent:dev'
  ]);

  grunt.loadNpmTasks('grunt-concurrent');
};
