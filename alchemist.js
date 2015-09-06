import alchemist_common from 'alchemist-common'
import alchemist from './lib/index'

alchemist.use(alchemist_common)

var common = function common () {
  return alchemist_common
}

alchemist.common = common

module.exports = alchemist
