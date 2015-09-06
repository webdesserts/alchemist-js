import gulp from 'gulp'
import webpack from 'gulp-webpack'
import named from 'vinyl-named'
import uglify from 'gulp-uglify'
import rename from 'gulp-rename'
import { join } from 'path'

export default function () {
  return gulp.src('./alchemist.js')
  .pipe(named())
  .pipe(webpack({
    output: {
      library: 'alchemist',
      libraryTarget: 'umd'
    },
    resolve: {
      packageMains: ['main:src', 'main'],
      root: 'node_modules'
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
  .pipe(gulp.dest('./dist'))
  .pipe(uglify())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('./dist'))
}

