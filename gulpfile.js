var gulp = require('gulp')
var g = require('gulp-load-plugins')()
var series = require('run-sequence')
var del = require('del')

var package_config = require('./package.json')
var fs = require('fs')
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

gulp.task('dev', ['test'], function () {
  gulp.watch('test/*.js', ['test'])
  gulp.watch('lib/*.js', ['test', 'lint'])
})

gulp.task('default', ['build'])

function warn (err) {
  console.warn(err.message)
  this.emit('end')
}
