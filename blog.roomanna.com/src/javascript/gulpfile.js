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
var pathmodify = require('pathmodify');

function compileTarget(src, dst, watch) {
  var transformed = browserify(src, { debug: false })
    .transform(babel, { presets: ['es2015'] })
    .plugin(pathmodify, {mods: [
      pathmodify.mod.dir('lib', path.join(__dirname, 'lib'))
    ]});

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
    compileTarget('./src/site/main.js', '../site/static/js/roomanna.js', watch),
    compileTarget('./src/post031/main.js', '../site/static/js/post031.js', watch),
    compileTarget('./src/post032/main.js', '../site/static/js/post032.js', watch),
    compileTarget('./src/post035/main.js', '../site/static/js/post035.js', watch)
  );
  return watch ? pipeline : pipeline.pipe(exit());
};

gulp.task('build', function() { return compile(false); });
gulp.task('watch', function() { return compile(true); });
gulp.task('default', ['watch']);
