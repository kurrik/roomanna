module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: ['build'],

    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd:    'lib/',
            src:    ['*.png'],
            dest:   'build/img',
            filter: 'isFile',
          },
          {
            expand: true,
            cwd:    'src/img/',
            src:    ['*.png'],
            dest:   'build/img',
            filter: 'isFile',
          },
          {
            expand: true,
            cwd:    'src/',
            src:    ['*'],
            dest:   'build/',
            filter: 'isFile'
          },
        ]
      },
    },

    concat: {
      dist: {
        src: [
          'lib/jquery/*.js',
          'lib/bootstrap/js/*.js',
          'src/js/site.js',
        ],
        dest: 'build/content/static/js/<%= pkg.name %>.js',
      },
    },

    less: {
      production: {
        options: {
          paths: ["lib/bootstrap/less"],
          yuicompress: true
        },
        files: {
          "build/content/static/css/<%= pkg.name %>.min.css": "src/static/less/site.less"
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
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'uglify', 'less']);
};
