import jscs from 'gulp-jscs'
import { warn } from '../utils'

export default function lint_lib () {
  var gulp = this.gulp

  return gulp.src(['alchemist.js', 'alchemist-lite.js', 'lib/**/*.js'])
  .pipe(jscs({ configPath: '.jscsrc' }))
  .on('error', warn)
}
