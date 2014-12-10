var plugins = require('./plugins')
var Color = require('./color')
var ColorSpace = require('./colorSpace')
var Converter = require('./converter')
var ColorSpaceStore = require('./colorSpaceStore')
var ModifierStore = require('./modifierStore')
var helpers = require('./helpers')

/**
 * The constructor for Alchemist. This is the object that will eventually be
 * exported.
 */

var Alchemist = Object.create(helpers.Createable)

// Initialize all state on Alchemist
Alchemist.init = function init (options) {
  var color_spaces = ColorSpaceStore.create()
  options = options || {}
  this.spaces = color_spaces
  this.converter = Converter.create(color_spaces)
  this.white = options.white || null
  this.precision = options.precision || 4
}

/**
 * Interprets the type of plugin it is and calls the associated plugin installer
 * if the passed object is an array, it will try to interpret each item in that
 * array as a plugin, essentially allowing you to create plugin bundles.
 *
 * @param {object || array} plugin The plugin to be included
 */

Alchemist.use = function use (plugin) {
  if (helpers.isArray(plugin)) {
    for (var i = 0; i < plugin.length; i++) {
      this.use(plugin[i])
    }
  } else {
    if (this[plugin.name] && !this.spaces.find(plugin.name))
      throw new Error('"' + plugin.name + '" already exists on Alchemist and cannot be used as a plugin name')
    var plugin_spaces = plugins.serialize(plugin)
    this.spaces.merge(plugin_spaces)
    this.spaces.each(function (color_space) {
      if (!color_space.isAbstract)
      this.makeColorMethod(color_space)
    }.bind(this))
  }
}

/**
 * Creates a Color Spaces's constructor method to be called from Alchemist.
 * e.g. alchemist.rgb()
 *
 * This function will return a new Color with the assigned values, any 
 * necessary config, and attached conversion functions.
 *
 * @param {string} color_space The name of the color space being created
 */

Alchemist.makeColorMethod = function makeColorMethod (color_space) {

  // TODO Use a ColorSpace's defined conversions
  this.spaces.each(function (dest_space) {
    if (!dest_space.isAbstract && color_space.name !== dest_space.name) {
      this.makeConversionMethod(color_space.Color, dest_space.name)
    }
  }.bind(this))

  // defined method
  this[color_space.name] = function createColor (value) {
    var color_value, new_color;

    if (arguments.length > 1) {
      // I hear this deoptimizes things. Find a way around if necessary.
      color_value = Array.prototype.slice.call(arguments)
    } else {
      color_value = value
    }

    new_color = color_space.Color.create(color_value)

    return new_color
  }
}

/**
 * Creates a Color Space's conversion method to be called from a Color.
 * When called that function will then kick of the convert function with
 * it's necessary params.
 *
 * @param {Color} color The color object to define the method on
 * @param {string} dest_name The name of the destination color space and,
 *                           also, the name of the method created
 */

Alchemist.makeConversionMethod = function makeConversionMethod (color, dest_name) {
  var that = this

  color[dest_name] = function convertColor () {
    var result = that.converter.convert(this, dest_name)
    return helpers.round(result.value, that.precision)
  }
}

Alchemist.init()
// export Alchemist!
module.exports = Alchemist
