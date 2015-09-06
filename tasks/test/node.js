import gulp from 'gulp'
import mocha from 'gulp-mocha'
import { warn } from '../utils'

export default function () {
  var config = this.config

  return gulp.src([
      'tests/setup/node.js',
      'tests/**/*.spec.js',
      'node_modules/alchemist-common/node_modules/alchemist-*/tests/**/*.spec.js'
    ], { read: false })
    .pipe(mocha({
      reporter: config.mocha.reporter,
      globals: config.mocha.globals
    }))
    .on('error', warn);
}
