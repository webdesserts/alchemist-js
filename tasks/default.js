import gulp from 'gulp'

export default function (done) {
  return gulp.series(['test', 'lint', 'build'])(done)
}
