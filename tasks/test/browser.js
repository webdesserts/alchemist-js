import gulp from 'gulp'
import open from 'open'
import { join } from 'path'

export default function (done) {
  return gulp.series('build:tests', function open_browser (open_done) {
    open('./tests/runner.html')
    open_done()
  })(done)
}
