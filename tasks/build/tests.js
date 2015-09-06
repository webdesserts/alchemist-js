import gulp from 'gulp'
import webpack from 'gulp-webpack'
import rename from 'gulp-rename'
import { join, resolve } from 'path'

export default function () {
  return gulp.src([
      'tests/setup/browser.js',
      'tests/**/*.spec.js',
      'node_modules/alchemist-common/node_modules/alchemist-*/tests/**/*.spec.js'
    ])
    .pipe(webpack({
      output: {
        filename: '__spec-build.js',
        libraryTarget: 'umd'
      },
      // devtool: 'inline-source-map',
      resolve: {
        alias: { 'alchemist-js': resolve(__dirname, '../../alchemist.js') },
        root: join(__dirname, '../../node_modules')
      },
      resolveLoader: {
        root: join(__dirname, '../../node_modules')
      },
      module: {
        loaders: [{
          test: /\.js$/,
          loader: 'babel-loader',
          optional: ['runtime']
        }]
      }
    }))
    .pipe(gulp.dest('./.tmp/'))
}
