var gulp = require('gulp')
var to5 = require('gulp-6to5')
var rjs = require('requirejs')
var series = require('run-sequence')
var del = require('del')
var g = require('gulp-load-plugins')()

es6_whitelist = ['modules']

gulp.task('clean', del.bind(null, ['.tmp', 'dist']))

gulp.task('build:min', ['build:web'], function () {
  return gulp.src('dist/alchemist.js')
  .pipe(g.uglify())
  .pipe(g.rename({ suffix: '.min' }))
  .pipe(g.size({ showFiles: true }))
  .pipe(g.size({ showFiles: true, gzip: true }))
  .pipe(gulp.dest('dist'))
})

gulp.task('build:web', function () {
  return gulp.src('lib/alchemist.js')
  .pipe(g.webpack({
    output: {
      filename: 'alchemist.js',
      libraryTarget: 'umd',
      library: 'Alchemist',
      sourcePrefix: ''
    }
  }))
  .pipe(gulp.dest('dist'))
})

gulp.task('build', ['build:web', 'build:min'])

gulp.task('test:run', function () {
  return gulp.src('test/*.js')
    .pipe(g.mocha({ reporter: 'spec' }))
    .on('error', warn)
})

gulp.task('test', function (cb) {
  series('build', 'test:run', 'lint', cb)
})

gulp.task('lint', function () {
  return gulp.src(['gulpfile.js', 'test/*.js', 'alchemist.js'])
    .pipe(g.jscs())
    .on('error', warn)
})

gulp.task('watch:lint', ['lint'], function () {
  gulp.watch(['gulpfile.js', '.jscsrc', 'test/*.js', 'alchemist.js'], ['lint'])
})

gulp.task('default', ['test'], function () {
  gulp.watch('test/*.js', ['test'])
  gulp.watch('lib/*.js', ['test', 'lint'])
})

function warn (err) {
  console.warn(err.message)
  this.emit('end')
}
