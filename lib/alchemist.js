var plugins = require('./plugins')
var Color = require('./color')
var Converter = require('./converter')
var ColorSpaceStore = require('./colorSpaceStore')
var helpers = require('./helpers')

/**
 * Alchemist. This is the object that will eventually be exported.
 * It can be used both as is, and as a constructor with .create()
 */

var Alchemist = Object.create(helpers.Createable)

/**
 * Initialize all state on Alchemist. Is called on create()
 */

Alchemist.init = function init (options) {
  var color_spaces = ColorSpaceStore.create()
  options = options || {}
  this.spaces = color_spaces
  this.BaseSpace = Color.create({
    white: options.white || null,
    converter: Converter.create(color_spaces, options.precision)
  })
}

/**
 * Interprets the type of plugin it is and calls the associated plugin installer
 * if the passed object is an array, it will try to interpret each item in that
 * array as a plugin, essentially allowing you to create plugin bundles.
 */

Alchemist.use = function use (plugin) {
  if (helpers.isArray(plugin)) {
    for (var i = 0; i < plugin.length; i++) {
      this.use(plugin[i])
    }
  } else {
    switch (plugins.type(plugin)) {
      case 'space':
        if (this[plugin.name] && !this.spaces.has(plugin.name))
          throw new Error('"' + plugin.name + '" already exists on Alchemist and cannot be used as a plugin name')
        var plugin_spaces = plugins.serializeColorSpace(plugin, this.BaseSpace)
        this.spaces.merge(plugin_spaces)
        this.spaces.each(function (color_space) {
          if (color_space.is_concrete) {
            this.makeConstructorMethod(color_space)
            this.makeConversionMethod(color_space)
          }
        }, this)
    }
  }
}

/**
 * Creates a Color constructor method on Alchemist for the given <color_space>.
 * e.g. alchemist.rgb([255, 255, 255])
 *
 * This function will return a new Color with the assigned values, any
 * necessary config, and attached conversion functions.
 */

Alchemist.makeConstructorMethod = function makeConstructorMethod (color_space) {
  this[color_space.type] = function createColor (value) {
    var color_value;

    if (arguments.length > 1) {
      // I hear this deoptimizes things. Find a way around if necessary.
      color_value = Array.prototype.slice.call(arguments)
    } else {
      color_value = value
    }

    return color_space.create(color_value)
  }
}

/**
 * Creates a method on the BaseSpace that can be used to convert directly to the
 * given <color_space>
 */

Alchemist.makeConversionMethod = function makeConversionMethod (color_space) {
  this.BaseSpace[color_space.type] = function convertTo () {
    return this.to(color_space.type)
  }
}


Alchemist.init()
// export Alchemist!
module.exports = Alchemist
