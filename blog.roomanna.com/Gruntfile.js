module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bgShell: {
      ghostwriter: {
        cmd: 'ghostwriter -src=src/site -dst=build/content',
        bg: false,
      },

      create: {
        cmd: 'ghostwriter -src=src/site -dst=build/content -action=create',
        bg: false,
      },

      serve: {
        cmd: '~/src/google_appengine_go/dev_appserver.py --port=9998 --address=0.0.0.0 build',
        bg: true,
      },

      deploy: {
        cmd: '~/src/google_appengine_go/appcfg.py --oauth2 update build',
        bg: false,
      },
    },

    clean: ['build'],

    copy: {
      server: {
        files: [
          {
            expand: true,
            cwd:    'server',
            src:    ['**/*'],
            dest:   'build',
          }
        ],
      },
      frontend: {
        files: [
          {
            expand: true,
            cwd:    'lib/bootstrap/img',
            src:    ['*.png'],
            dest:   'build/content/static/img',
          },
          {
            expand: true,
            cwd:    'lib/font-awesome/',
            src:    ['*.woff'],
            dest:   'build/content/static/font',
          },
          {
            expand: true,
            cwd:    'lib/visitor1/',
            src:    ['*.woff'],
            dest:   'build/content/static/font',
          },
          {
            expand: true,
            cwd:    'lib/font-awesome/',
            src:    ['font-awesome-ie7.css'],
            dest:   'build/content/static/css',
          },
          {
            expand: true,
            cwd:    'src/img/',
            src:    ['*'],
            dest:   'build/content/static/img',
            filter: 'isFile',
          },
        ]
      },
    },

    concat: {
      js: {
        src: [
          'lib/jquery/jquery-1.9.1.js',
          'lib/bootstrap/js/*.js',
          'src/js/site.js',
        ],
        dest: 'build/content/static/js/<%= pkg.name %>.js',
      },
      css: {
        src: [
          'lib/font-awesome/font-awesome.css',
          'build/content/static/css/site.css',
        ],
        dest: 'build/content/static/css/<%= pkg.name %>.css',
      },
    },

    cssmin: {
      dist: {
        options: {
          banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          'build/content/static/css/<%= pkg.name %>.min.css': 'build/content/static/css/<%= pkg.name %>.css',
        }
      }
    },

    less: {
      dist: {
        options: {
          paths: ['lib/bootstrap-2.3.1/less'],
          yuicompress: true
        },
        files: {
          'build/content/static/css/site.css': 'src/less/site.less',
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: 'build/content/static/js/<%= pkg.name %>.js',
        dest: 'build/content/static/js/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('frontend', ['copy:frontend', 'less', 'concat', 'cssmin', 'uglify']);
  grunt.registerTask('serve',    ['copy:server', 'bgShell:serve']);
  grunt.registerTask('server',   ['copy:server']);
  grunt.registerTask('create',   ['bgShell:create']);
  grunt.registerTask('content',  ['bgShell:ghostwriter']);
  grunt.registerTask('all',      ['server', 'frontend', 'content']);
  grunt.registerTask('default',  ['all']);
};
