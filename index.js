var Alchemist = require('./lib/alchemist.js');

var common = function common () {
  return require('alchemist-common')
}

Alchemist.common = Alchemist.prototype.common = common

module.exports = Alchemist
