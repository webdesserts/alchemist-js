import gulp from 'gulp'

export default function test_watch (done) {
  return gulp.series(
    gulp.task('test'),
    function watch () {
      gulp.watch([
        'alchemist.js',
        'alchemist-lite.js',
        'lib/**/*.js',
        'tests/**/*.js'
      ], gulp.task('test'))
    }
  )(done)
}
