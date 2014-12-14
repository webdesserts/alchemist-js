var helpers = require('./helpers')
var Color = require('./color')

var ColorSpace = Object.create(helpers.Createable)

// initialize all state
ColorSpace.init = function init (name, options) {
  options = options || {}
  this.name = name
  this.conversions = {}
  this.isAbstract = options.abstract || false
  this.Color = Color.create(null, this)
}

// define a conversion to another color space
ColorSpace.defineConvTo = function defineConvTo (space_name, conversion) {
  if (typeof conversion !== 'function') throw new TypeError('Expected the conversion, ' + conversion + ', to be a function')
  this.conversions[space_name] = conversion
}

ColorSpace.definePointerTo = function definePointerTo (target, pointer) {
  if (typeof pointer !== 'string') throw new TypeError('Expected the pointer, ' + pointer + ', to be a string')
  this.conversions[target] = pointer
}

// return a known conversion to antoher color space
ColorSpace.to = function to (space_name) {
  return this.conversions[space_name] || null }

ColorSpace.merge = function merge (giving_space) {
  var conversions = giving_space.conversions
  // If we're merging like so...
  // abstract_space.merge(concrete_space)
  // use all the concrete space's conversions by default
  var curing = this.isAbstract && !giving_space.isAbstract

  for (var dest_space in conversions) {
    if (curing || !this.to(dest_space)) {
      var conversion = conversions[dest_space]
      this.defineConvTo(dest_space, conversion)
    }
  }

  // when the conversion is over, make the abstract space concrete
  if (curing) this.isAbstract = false
}

// lock down some properties
Object.defineProperties(ColorSpace, {
  defineConvTo: { writable: false },
  to: { writable: false }
})

// export the module
module.exports = ColorSpace
