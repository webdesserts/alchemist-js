import gulp from 'gulp'
import open from 'open'
import { join } from 'path'

export default function () {
  return gulp.series('build:tests', function open_browser (done) {
    open('./tests/runner.html')
    done()
  })()
}
