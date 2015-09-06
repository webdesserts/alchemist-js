export default {
  'build': {
    'export': 'alchemist',
    'entries': {
      'main': 'alchemist.js',
      'light': 'alchemist-light.js',
      'common': 'common.js'
    }
  },
  'mocha': {
    'reporter': 'spec',
    'globals': [
      'stub',
      'spy',
      'expect'
    ]
  }
}
