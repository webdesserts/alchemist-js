var Storage = require('./storage')

var ConversionStore = Storage.create()


/**
 * Loops over the <external_store> comparing its conversions with the local
 * store's. If the <external_store> has any conversions that the local does not,
 * it adds them. If both stores have the same conversion, it uses the current
 * conversion. If <options.force> is truthy the merge will always overwrite the
 * current conversion.
 */

ConversionStore.merge = function merge (external_store, options) {
  options = options || {}
  external_store.each(function (value, key) {
    var local = this.find(key)
    if (options.force || !local || typeof local === 'string') {
      this.store[key] = value
    }
  }, this)
}

module.exports = ConversionStore
