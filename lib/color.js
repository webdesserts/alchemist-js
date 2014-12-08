var helpers = require('./helpers')
var Color = Object.create(helpers.Createable)

// initialize all state
Color.init = function (color_space, value, options) {
  options = options || {}
  this.color_space = color_space
  this.value = value
  this.white = options.white || { X: 0.95047, Y: 1, Z: 1.08883 }
}

module.exports = Color
