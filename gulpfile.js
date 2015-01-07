'use strict'

var gulp = require('gulp')
var g = require('gulp-load-plugins')()
var series = require('run-sequence')
var del = require('del')

var package_config = require('./package.json')
var EOL = require('os').EOL

var small_header = '// Alchemist.js v<%= version %> | license: <%= license %>' + EOL
var large_header = [
  '/**',
  ' * Alchemist.js',
  ' * v<%= version %>',
  ' * License: <%= license %>',
  ' *',
  ' * Author: <%= author %>',
  ' * Website: <%= homepage %>',
  ' */',
  EOL
].join(EOL)

gulp.task('clean', del.bind(null, ['.tmp', 'dist']))

gulp.task('build:min', function () {
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
      sourcePrefix: '' } }))
      .pipe(g.header(large_header, package_config))
      .pipe(g.rename({ suffix: '-' + package_config.version }))
      .pipe(gulp.dest('dist'))
})

gulp.task('build', function (cb) {
  series('clean', 'build:web', 'build:min', cb)
})

gulp.task('test:run', function () {
  return gulp.src('test/*.js')
  .pipe(g.mocha({ reporter: 'spec' }))
  .on('error', warn)
})

gulp.task('test', function (cb) {
  series('test:run', 'lint', cb)
})

gulp.task('lint:src', function () {
  return gulp.src(['lib/*.js', 'index.js'])
  .pipe(g.eslint({ env: { node: true } }))
  .pipe(g.jscs())
  .on('error', warn)
  .pipe(g.eslint.format())
})

gulp.task('lint:dev', function () {
  return gulp.src(['gulpfile.js', 'test/*.js'])
  .pipe(g.eslint({
    rules: {
      'no-unused-expressions': 0,
      'no-shadow': 0
    },
    env: { mocha: true, node: true }
  }))
  .pipe(g.jscs())
  .on('error', warn)
  .pipe(g.eslint.format())
})

gulp.task('lint', function (cb) {
  series('lint:dev', 'lint:src', cb)
})

gulp.task('watch:lint', ['lint'], function () {
  gulp.watch(['gulpfile.js', '.eslintrc', 'test/*.js', 'lib/*.js', 'index.js'], ['lint'])
})

gulp.task('dev', ['test'], function () {
  gulp.watch('test/*.js', ['test'])
  gulp.watch('lib/*.js', ['test', 'lint'])
})

gulp.task('default', ['build'])

function warn (err) {
  console.warn(err.message)
  this.emit('end')
}
