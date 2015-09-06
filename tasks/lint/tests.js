import jscs from 'gulp-jscs'
import { warn } from '../utils'

export default function lint_tests () {
  var gulp = this.gulp

  return gulp.src(['tests/**/*.js'])
  .pipe(jscs({ configPath: '.jscsrc' }))
  .on('error', warn)
}
