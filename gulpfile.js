require('./tasks/babel-setup')()
var gulp = require('gulp')
var config = require('./tasks/config')
var Summary = require('gulp-summary')

var summary = new Summary(gulp)

summary.configure(config)

/*======*\
*  Main  *
\*======*/

summary.define({
  command: 'default',
  description: 'tests, lints, and then builds alchemist',
  task: require('./tasks/default')
})

summary.define({
  command: 'dev',
  description: 'watches all files and tests and lints as they change',
  task: require('./tasks/dev')
})

summary.define({
  command: 'build',
  description: 'bundles all production builds of alchemist and places them in the dist/ directory',
  task: require('./tasks/build')
})

summary.define({
  command: 'test',
  description: 'runs tests for node',
  task: require('./tasks/test/main')
})

summary.define({
  command: 'lint',
  description: 'lints alchemist, its tests, and all task files',
  task: require('./tasks/lint/main')
})

/*========*\
*  Builds  *
\*========*/

summary.define({
  command: 'build:tests',
  description: 'bundles alchemist and its tests for testing in the browser',
  task: require('./tasks/build/tests')
})

summary.define({
  command: 'build:node',
  description: 'transpiles and bundles all es6 code, but leaves the cjs requires',
  task: require('./tasks/build/node')
})

summary.define({
  command: 'build:browser',
  description: 'bundles alchemist with alchemist-common and produces a development and minified build',
  task: require('./tasks/build/browser')
})

summary.define({
  command: 'build:lite',
  description: 'bundles alchemist without alchemist-common and produces a development and minified build',
  task: require('./tasks/build/lite')
})

summary.define({
  command: 'build:size',
  description: 'reports the size of all builds',
  task: require('./tasks/build/size')
})

/*=======*\
*  Tests  *
\*=======*/

summary.define({
  command: 'test:node',
  description: 'runs tests with normal node requires and outputs to console',
  task: require('./tasks/test/node')
})

summary.define({
  command: 'test:browser',
  description: 'opens the runner.html in your default browser',
  task: require('./tasks/test/browser')
})

summary.define({
  command: 'test:watch',
  description: 'watches the project and runs the node tests on change',
  task: require('./tasks/test/watch')
})

/*=========*\
*  Linting  *
\*=========*/

summary.define({
  command: 'lint:lib',
  description: 'lints alchemist',
  task: require('./tasks/lint/lib')
})

summary.define({
  command: 'lint:tests',
  description: 'lints all of alchemist\'s tests',
  task: require('./tasks/lint/tests')
})

summary.define({
  command: 'lint:tasks',
  description: 'lints gulp tasks',
  task: require('./tasks/lint/tasks')
})

summary.define({
  command: 'lint:watch',
  description: 'watches all files and lints them on change',
  task: require('./tasks/lint/watch')
})

module.exports = summary
