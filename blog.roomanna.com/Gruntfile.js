module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: ['build'],

    copy: {
      dist: {
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

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['copy', 'less', 'concat', 'cssmin', 'uglify']);
};
