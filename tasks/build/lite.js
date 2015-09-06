import gulp from 'gulp'
import webpack from 'gulp-webpack'
import named from 'vinyl-named'
import uglify from 'gulp-uglify'
import rename from 'gulp-rename'

export default function () {
  return gulp.src('./alchemist-lite.js')
    .pipe(named())
    .pipe(webpack({
      output: {
        library: 'alchemist',
        libraryTarget: 'umd'
      },
      resolve: {
        packageMains: ['main:src', 'main']
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
