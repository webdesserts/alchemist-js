var helpers = require('./helpers')

var Storage = Object.create(helpers.Createable)

Storage.init = function init () {
  this.store = {}
}

/**
 * Adds <key>/<value> to the store. <key> should be a unique identifier. If key
 * is already present in the store, add will throw an error. This is to prevent
 * accidental overwrites. In most cases we'll want to use merge() instead anyway
 */

Storage.add = function add (key, value) {
  if (this.store[key]) throw new Error('the key "' + key + '" already exists in this store')
  this.store[key] = value
}

/**
 * Returns the value associated with <key> if it exists, otherwise, return null
 */

Storage.find = function find (key) {
  return this.store[key] || null
}

/**
 * Returns true if the key already exists, otherwise, it returns false
 */

Storage.has = function has (key) {
  return Boolean(this.find(key))
}

/**
 * Removes <key> and it's associated value from the store
 */

Storage.remove = function remove (key) {
  delete this.store[key]
}

/**
 * iterates over the store, calling <func> on each iteration
 * if the function returns anything, the iteration is halted and the result is returned
 */

Storage.each = function each (func, context) {
  return helpers.each.call(this, this.store, func, context)
}

/**
 * loops over the <external_store> comparing its values with the local store. If
 * the <external_store> has any keys that the local does not, it adds them. If
 * both stores have the same key, it calls merge() on the value of the local key
 */

Storage.merge = function merge (external_store) {
  external_store.each(function (value, key) {
    var local = this.find(key)
    if (local) local.merge(value);
    else this.store[key] = value
  }, this)
}

module.exports = Storage
