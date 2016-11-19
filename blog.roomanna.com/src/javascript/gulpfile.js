var babel = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var exit = require('gulp-exit');
var gulp = require('gulp');
var merge = require('merge-stream');
var minify = require('gulp-minify');
var path = require('path');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');

function compileTarget(src, dst, watch) {
  var transformed = browserify(src, { debug: false })
    .transform(babel, { presets: ['es2015'] });

  var bundler = watchify(transformed);

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source(path.basename(dst)))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(minify({ ext:{ src:'.js', min:'.min.js' }, ignoreFiles: ['min.js'] }))
      .pipe(gulp.dest(path.dirname(dst)));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }
  return rebundle();
};

function compile(watch) {
  var pipeline = merge(
    compileTarget('./src/site/index.js', '../site/static/js/roomanna-blog.newbuild.js', watch),
    compileTarget('./src/post035/index.js', '../site/static/js/post035.built.newbuild.js', watch)
  );
  return watch ? pipeline : pipeline.pipe(exit());
};

gulp.task('build', function() { return compile(false); });
gulp.task('watch', function() { return compile(true); });
gulp.task('default', ['watch']);
