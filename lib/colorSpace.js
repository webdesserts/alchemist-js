ColorSpace = {}

// create an object like this one, but with a clean state
ColorSpace.create = function create () {
  color_space = Object.create(this)
  color_space.init.apply(color_space, arguments)
  return color_space
}

// initialize all state
ColorSpace.init = function init (name, options) {
  var options = options || {}
  this.name = name
  this.conversions = { to: {} }
  this.isAbstract = options.abstract || false
}

// define a conversion to another color space
ColorSpace.defineConvTo = function defineConvTo (space_name, conversion) {
  if (typeof conversion !== 'function') throw Error('Expected the conversion, ' + conversion + ', to be a function')
  this.conversions.to[space_name] = conversion
}

// return a known conversion to antoher color space
ColorSpace.to = function to (space_name) {
  return this.conversions.to[space_name] || null
}

ColorSpace.merge = function (color_space) {
  var options = options || {}
  var conversions = color_space.conversions.to
  // If we're merging like so...
  // abstract_space.merge(concrete_space)
  // use all the concrete space's conversions by default
  var curing = this.isAbstract && !color_space.isAbstract

  for (dest_space in conversions) {
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
