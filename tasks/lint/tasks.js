import jscs from 'gulp-jscs'
import { warn } from '../utils'

export default function lint_tasks () {
  var gulp = this.gulp

  return gulp.src(['gulpfile.js', 'tasks/**/*.js'])
    .pipe(jscs({ configPath: '.jscsrc' }))
    .on('error', warn)
}

