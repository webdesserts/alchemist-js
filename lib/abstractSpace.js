var ColorSpace = require('./colorSpace')

AbstractSpace = Object.create(ColorSpace)

AbstractSpace.create = function (name) {
  var abstract_space = ColorSpace.create.call(this, name)
  abstract_space.conversions.from = {}
  return abstract_space
}

AbstractSpace.defineConvFrom = function (color_space, conversion) {
  this.conversions.from[color_space.name] = conversion
}

AbstractSpace.from = function (color_space) {
  return this.conversions.from[color_space.name] || null
}

Object.defineProperties(AbstractSpace, {
  defineConvFrom: { writable: false },
  from: { writable: false },
  create: { enumerable: false }
})

module.exports = AbstractSpace
