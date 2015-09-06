export default function lint (done) {
  var gulp = this.gulp

  return gulp.parallel([
    gulp.task('lint:lib'),
    gulp.task('lint:tests'),
    gulp.task('lint:tasks')
  ])(done)
}
