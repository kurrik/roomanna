module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bgShell: {
      ghostwriter: {
        cmd: '$GOPATH/bin/ghostwriter -src=src/site -dst=build/content',
        bg: false,
      },

      serve: {
        cmd: 'pkill -f dev_appserver || ~/src/go_appengine/dev_appserver.py --skip_sdk_update_check=yes --port=9998 build',
        bg: true,
      },
    },

    clean: ['build'],

    copy: {
      server: {
        files: [
          {
            expand: true,
            cwd:    'src/server',
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
            src:    ['*.woff', '*.eot', '*.ttf', '*.svg'],
            dest:   'build/content/static/font',
          },
          {
            expand: true,
            cwd:    'lib/visitor1/',
            src:    ['*.woff', '*.otf', '*.eot', '*.svg', '*.ttf'],
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
          'build/content/static/js/site.js',
          'lib/bootstrap-2.3.1/js/*.js',
        ],
        dest: 'build/content/static/js/<%= pkg.name %>.js',
        separator: ';\n',
      },
      css: {
        src: [
          'lib/font-awesome/font-awesome.css',
          'build/content/static/css/site.css',
        ],
        dest: 'build/content/static/css/<%= pkg.name %>.css',
        separator: '\n',
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
          paths: ['src/less', 'lib/bootstrap-2.3.1/less'],
          yuicompress: true
        },
        files: {
          'build/content/static/css/site.css': 'src/less/site.less',
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          name: "node_modules/almond/almond",
          out: "build/content/static/js/site.js",
          baseUrl: "./",
          include: ['src/js/site'],
          insertRequire: ['src/js/site'],
          paths: {
            'jquery': 'lib/jquery/jquery-1.9.1'
          }
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
    },

    watch: {
      frontend: {
        files: ['lib/**/*', 'src/img/**/*', 'src/js/**/*', 'src/less/**/*'],
        tasks: ['frontend']
      },
      server: {
        files: ['src/server/**/*'],
        tasks: ['server']
      },
      content: {
        files: ['src/site/**/*'],
        tasks: ['content']
      },
    },

  });

  grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Site components
  grunt.registerTask('frontend', ['copy:frontend', 'less', 'requirejs', 'concat', 'cssmin', 'uglify']);
  grunt.registerTask('server',   ['copy:server']);
  grunt.registerTask('content',  ['bgShell:ghostwriter']);
  grunt.registerTask('all',      ['clean', 'server', 'frontend', 'content']);

  // Verbs
  grunt.registerTask('serve',    ['copy:server', 'bgShell:serve']);
  grunt.registerTask('develop',  ['all', 'serve', 'watch']);
  grunt.registerTask('default',  ['all']);
};
