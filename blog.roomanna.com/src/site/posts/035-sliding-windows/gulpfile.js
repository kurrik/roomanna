var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var exit = require('gulp-exit');

function compile(watch) {
  var browserifyOpts = {
    //standalone: 'slidingwindows',
    debug: true
  };
  var transformOpts = {
    presets: ['es2015']
  };
  var bundler = watchify(browserify('./src/index.js', browserifyOpts)
      .transform(babel, transformOpts));

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('post035.built.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
    rebundle();
  } else {
    rebundle().pipe(exit())
  }
}

function watch() {
  return compile(true);
};

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['watch']);
