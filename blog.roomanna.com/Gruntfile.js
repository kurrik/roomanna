module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bgShell: {
      ghostwriter: {
        cmd: '$GOPATH/bin/ghostwriter -src=src/site -dst=build/content',
        bg: false,
      },

      serve: {
        cmd: 'cd .. && PORT=9998 ROOMANNA_MODE=dev go run blog.roomanna.com/src/server/main.go',
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

    watch: {
      frontend: {
        files: ['lib/**/*', 'src/img/**/*'],
        tasks: ['frontend']
      },
      server: {
        files: ['src/server/**/*'],
        tasks: []
      },
      content: {
        files: ['src/site/**/*'],
        tasks: ['content']
      },
    },

  });

  grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Site components
  grunt.registerTask('frontend',        ['bgShell:javascript']);
  grunt.registerTask('frontend-devel',  ['bgShell:javascriptDevel']);
  grunt.registerTask('content',         ['bgShell:ghostwriter']);
  grunt.registerTask('all-devel',       ['clean', 'frontend-devel', 'content']);
  grunt.registerTask('all',             ['clean', 'frontend', 'content']);

  // Verbs
  grunt.registerTask('serve',           ['bgShell:serve']);
  grunt.registerTask('develop',         ['all-devel', 'serve', 'watch']);
  grunt.registerTask('develop-prod',    ['all', 'serve', 'watch']);
  grunt.registerTask('default',         ['all']);
};
