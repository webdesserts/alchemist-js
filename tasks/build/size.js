import gulp from 'gulp'
import size from 'gulp-sizereport'

export default function () {
  var builds = ['./dist/*.js', '!./dist/*-node.js']

  return gulp.src(builds)
    .pipe(size({
      gzip: true, total: false
    }))
}
