var helpers = require('./helpers')

var Color = Object.create(helpers.Createable)

Color.init = function init (value, color_space, options) {
  options = options || {}
  this.color_space = color_space || this.color_space
  this.value = value
  this.white = options.white || { X: 0.95047, Y: 1, Z: 1.08883 }
}

module.exports = Color
