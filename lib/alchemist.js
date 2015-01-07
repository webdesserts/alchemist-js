'use strict'

var plugins = require('./plugins')
var Color = require('./color')
var Converter = require('./converter')
var ColorSpaceStore = require('./colorSpaceStore')
var Limiter = require('./Limiter')
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
    white: options.white || { X: 0.95047, Y: 1, Z: 1.08883 },
    converter: Converter.create(color_spaces, options.precision),
    limiter: Limiter.create(null, null, options.limits || 'nullify')
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
    switch (plugins.identify(plugin)) {
      case 'space': this.attachColorSpace(plugin); break
      case 'method': this.attachColorMethod(plugin); break
    }
  }
}

/**
 * Stores a valid colorspace <plugin> and creates it's methods
 */

Alchemist.attachColorSpace = function attachColorSpace (plugin) {
  var existing_plugin = this.spaces.find(plugin.name)
  if (existing_plugin && existing_plugin.is_concrete)
    throw new Error('The "' + plugin.name + '" plugin already exists')
  var plugin_spaces = plugins.serializeColorSpace(plugin, this.BaseSpace)
  this.spaces.merge(plugin_spaces)
  this.spaces.each(function (color_space) {
    if (color_space.is_concrete) {
      this.makeConstructorMethod(color_space)
      this.makeConversionMethod(color_space)
    }
  }, this)
}

/**
 * Attaches the methods for a valid method <plugin>
 */

Alchemist.attachColorMethod = function (plugin) {
  if (plugin.methods.color && this.BaseSpace[plugin.name]) throw new Error('The method name "' + plugin.name + '" already exists for colors');
  if (plugin.methods.global && this[plugin.name]) throw new Error('The method name "' + plugin.name + '" already exists on alchemist');

  if (plugin.methods.color) {
    this.BaseSpace[plugin.name] = plugin.methods.color
  }
  if (plugin.methods.global) {
    this[plugin.name] = plugin.methods.global
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
  this[color_space.space] = function createColor (value) {
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
  this.BaseSpace[color_space.space] = function convertTo () {
    return this.to(color_space.space)
  }
}

Alchemist.init()
// export Alchemist!
module.exports = Alchemist
