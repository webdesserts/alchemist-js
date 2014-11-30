/**
 * Color Space
 */

ColorSpace = {}

ColorSpace.create = function (name) {
  color_space = Object.create(this)
  color_space.name = this.name || name
  color_space.conversions = this.conversions || { to: {} }
  return color_space
}

ColorSpace.defineConvTo = function defineConvTo (color_space, conversion) {
  this.conversions.to[color_space.name] = conversion
}

ColorSpace.to = function to (color_space) {
  return this.conversions.to[color_space.name] || null
}

Object.defineProperties(ColorSpace, {
  defineConvTo: { writable: false },
  to: { writable: false },
  create: { enumerable: false }
})

module.exports = ColorSpace
