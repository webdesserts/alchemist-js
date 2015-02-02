'use strict'
var alchemist_common = require('alchemist-common')

var Alchemist = require('./lib/alchemist');
Alchemist.use(alchemist_common)

var common = function common () {
  return alchemist_common
}

Alchemist.common = Alchemist.common = common

module.exports = Alchemist
