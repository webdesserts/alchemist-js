import gulp from 'gulp'
import webpack from 'gulp-webpack'
import named from 'vinyl-named'
import uglify from 'gulp-uglify'
import rename from 'gulp-rename'
import { resolve } from 'path'

export default function () {
  return gulp.src('./alchemist.js')
    .pipe(named())
    .pipe(webpack({
      output: { libraryTarget: 'commonjs2' },
      target: 'node',
      externals: [{
        'alchemist-common': 'commonjs alchemist-common',
        'stateless': 'commonjs stateless'
      }],
      module: {
        loaders: [{
          test: /\.js$/,
          loader: 'babel',
          exlcude: [/node_modules/]
        }]
      },
      devtool: 'inline-source-map'
    }))
    .pipe(rename({ suffix: '-node' }))
    .pipe(gulp.dest('./dist'))
}

