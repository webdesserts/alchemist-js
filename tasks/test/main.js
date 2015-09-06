import gulp from 'gulp'

export default function lint (done) {
  return gulp.series(['test:node'])(done)
}
