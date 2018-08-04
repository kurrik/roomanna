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

      javascript: {
        cmd: 'cd src/javascript && PROD=1 npm run build-grunt',
        bg: false,
      },

      javascriptDevel: {
        cmd: 'cd src/javascript && npm run watch-grunt',
        bg: true,
      }
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

    watch: {
      frontend: {
        files: ['lib/**/*', 'src/img/**/*'],
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
  grunt.registerTask('frontend',        ['copy:frontend', 'bgShell:javascript']);
  grunt.registerTask('frontend-devel',  ['copy:frontend', 'bgShell:javascriptDevel']);
  grunt.registerTask('server',          ['copy:server']);
  grunt.registerTask('content',         ['bgShell:ghostwriter']);
  grunt.registerTask('all-devel',       ['clean', 'server', 'frontend-devel', 'content']);
  grunt.registerTask('all',             ['clean', 'server', 'frontend', 'content']);

  // Verbs
  grunt.registerTask('serve',           ['copy:server', 'bgShell:serve']);
  grunt.registerTask('develop',         ['all-devel', 'serve', 'watch']);
  grunt.registerTask('develop-prod',    ['all', 'serve', 'watch']);
  grunt.registerTask('default',         ['all']);
};
