var gulp = require('gulp')
var to5 = require('gulp-6to5')
var rjs = require('requirejs')
var series = require('run-sequence')
var del = require('del')
var g = require('gulp-load-plugins')()

es6_whitelist = ['modules']

gulp.task('clean', del.bind(null, ['.tmp', 'dist']))

gulp.task('build', function (cb) {
  return gulp.src('alchemist.js')
  .pipe(gulp.dest('dist/'))
})

/*gulp.task('test:compile', ['clean'], function () {
  return gulp.src('test/spec/*.spec.js')
    .pipe(to5({ modules: 'amd', blacklist: es6_blacklist }))
    .on('error', warn)
    .pipe(gulp.dest('.tmp/spec'))
})*/

gulp.task('test:run', function () {
  return gulp.src('test/index.html')
    .pipe(g.mochaPhantomjs({ reporter: 'spec' }))
    .on('error', warn)
})

gulp.task('test', function (cb) {
  series('build', 'test:run', 'lint', cb)
})

gulp.task('lint', function () {
  return gulp.src(['gulpfile.js', 'test/**/*.js', 'alchemist.js'])
    .pipe(g.jscs())
    .on('error', warn)
})

gulp.task('watch:lint', ['lint'], function () {
  gulp.watch(['gulpfile.js', '.jscsrc', 'test/**/*.js', 'alchemist.js'], ['lint'])
})

gulp.task('default', ['test'], function () {
  gulp.watch('test/assets/*.js', ['test'])
  gulp.watch('test/spec/*.spec.js', ['test'])
  gulp.watch('alchemist.js', ['test', 'lint'])
})

function warn (err) {
  console.warn(err.message)
  this.emit('end')
}
