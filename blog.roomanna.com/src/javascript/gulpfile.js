var babel = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var exit = require('gulp-exit');
var gulp = require('gulp');
var minify = require('gulp-minify');
var path = require('path');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');
var pathmodify = require('pathmodify');
var fs = require('fs');
var concat = require('concat-stream');
var file = require('gulp-file');

function write(filepath) {
  return concat(function (content) {
    return file(path.basename(filepath), content, { src: true })
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(minify({ ext:{ src:'.js', min:'.min.js' }, ignoreFiles: ['min.js'] }))
      .pipe(gulp.dest('../site/static/js'));
  });
}

/*
function compileTargets(src, dst, watch) {
  var transformed = browserify(src, { debug: false })
    .transform(babel, { presets: ['es2015'] })
    .plugin(pathmodify, {mods: [
      pathmodify.mod.dir('lib', path.join(__dirname, 'lib'))
    ]})
    .plugin('factor-bundle', { outputs: dst });

  //var bundler = watchify(transformed);
  var bundler = transformed;

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      //.pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(minify({ ext:{ src:'.js', min:'.min.js' }, ignoreFiles: ['min.js'] }))
      .pipe(write('common'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }
  return rebundle();
};
*/

function compileAll(src, dst, watch) {
  var bundler = watchify(browserify(src, { debug: false }));
  bundler.transform(babel, { presets: ['es2015'] });
  bundler.on('update', rebundle);

  function rebundle() {

    bundler.plugin(pathmodify, { mods: [
      pathmodify.mod.dir('lib', path.join(__dirname, 'lib'))
    ]});
    bundler.plugin('factor-bundle', { outputs: dst });
    return bundler.bundle()
      .on('error', function (err) { console.error(err); })
      .pipe(write('common.js'));
  };
  return rebundle();
}

/*
    "babel": "^6.5.2",
    "babel-polyfill": "^6.16.0",
    "babel-preset-latest": "^6.16.0",
    "babel-register": "^6.18.0",
    "babelify": "^7.3.0",
    "bootstrap": "^3.3.7",
    "browserify": "^13.1.1",
    "browserify-shim": "^3.8.12",
    "chai": "^3.5.0",
    "concat-stream": "^1.5.2",
    "factor-bundle": "^2.5.0",
    "gulp": "^3.9.1",
    "gulp-exit": "0.0.2",
    "gulp-file": "^0.3.0",
    "gulp-minify": "0.0.14",
    "gulp-sourcemaps": "^2.2.0",
    "icanhaz": "^0.10.3",
    "jquery": "^3.1.1",
    "mocha": "^3.1.2",
    "pathmodify": "^0.5.0",
    "vinyl-buffer": "^1.0.0",
    "vinyl-source-stream": "^1.1.0",
    "watchify": "^3.7.0"

*/

/*
function compileTargets(src, dst, watch) {
  var b = watchify(browserify(src, { debug: false }))
    .transform(babel, { presets: ['es2015'] })
    .plugin(pathmodify, {mods: [
      pathmodify.mod.dir('lib', path.join(__dirname, 'lib'))
    ]})
    .plugin('factor-bundle', { outputs: dst });

  if (watch) {
    b.on('update', function (ids) {
      console.log('>> file changed, bundle updated');
      console.dir(ids);
      w.bundle();
    });
  }
  return b.bundle()
    .on('error', function(err) { console.error(err); this.emit('end'); })
    .pipe(write('common.js'));
}
*/

function compile(watch) {
  var pipeline = compileAll([
      './src/site/main.js',
      './src/post031/main.js',
      './src/post032/main.js',
      './src/post035/main.js'
    ],[
      write('roomanna.js'),
      write('post031.js'),
      write('post032.js'),
      write('post035.js')
    ],
    watch);
  return pipeline;
};

gulp.task('build', function() { return compile(false); });
gulp.task('watch', function() { return compile(true); });
gulp.task('default', ['watch']);
