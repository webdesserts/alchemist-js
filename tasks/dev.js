import gulp from 'gulp'

export default function (done) {
  return gulp.series(
    'default',
    function watch () {
      gulp.watch(['alchemist.js', 'alchemist-lite.js', 'lib/**/*.js'], gulp.series(['test', 'lint:lib', 'build']))

      gulp.watch(['tests/**/*.js'], gulp.series('test', 'lint:tests'))
      gulp.watch(['gulpfile.babel.js', 'tasks/**/*.js'], gulp.task('lint:tasks'))
      gulp.watch(['.jscsrc'], gulp.task('lint'))
    }
  )(done)
}
