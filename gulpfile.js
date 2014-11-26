var gulp = require('gulp')
var g = require('gulp-load-plugins')()
var series = require('run-sequence')
var del = require('del')
var fs = require('fs')
var package_config = require('./package.json')

var small_header = '// Alchemist.js v<%= version %> | license: <%= license %>\n'
var large_header = '/**\n' +
' * Alchemist.js\n' +
' * v<%= version %>\n' +
' * License: <%= license %>\n' +
' *\n' +
' * Author: <%= author %>\n' +
' * Website: <%= homepage %>\n' +
' */\n\n'


gulp.task('clean', del.bind(null, ['.tmp', 'dist']))

gulp.task('build:min', ['build:web'], function () {
  return gulp.src('dist/alchemist-*.js')
  .pipe(g.uglify())
  .pipe(g.header(small_header, package_config))
  .pipe(g.rename({ suffix: '.min' }))
  .pipe(gulp.dest('dist'))
  .pipe(g.size({ showFiles: true }))
  .pipe(g.size({ showFiles: true, gzip: true }))
})

gulp.task('build:web', function () {
  return gulp.src('lib/alchemist.js')
  .pipe(g.webpack({
    output: {
      filename: 'alchemist.js',
      library: 'Alchemist',
      libraryTarget: 'umd',
      sourcePrefix: ''
    }
  }))
  .pipe(g.header(large_header, package_config))
  .pipe(g.rename({ suffix: '-' + package_config.version }))
  .pipe(gulp.dest('dist'))
})

gulp.task('build', function () {
  series('clean', 'build:web', 'build:min')
})

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
