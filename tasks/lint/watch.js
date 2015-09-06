import gulp from 'gulp'

export default function lint_watch (done) {
  return gulp.series(
    gulp.task('lint'),
    function watch () {
      gulp.watch([
        '.jscsrc',
        'alchemist.js',
        'alchemist-lite.js',
        'lib/**/*.js',
        'tests/**/*.js',
        'tasks/**/*.js',
        'gulpfile.js'
      ], gulp.task('lint'))
    }
  )(done)
}
