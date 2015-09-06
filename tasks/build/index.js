import gulp from 'gulp'

export default function (done) {
  var builds = gulp.parallel('build:lite', 'build:browser', 'build:node')
  return gulp.series(builds, 'build:size')(done)
}

