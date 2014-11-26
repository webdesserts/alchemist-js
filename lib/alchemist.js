
var ColorSpaceStore = require('./colorSpaceStore')
var ModifierStore = require('./modifierStore')

var helpers = require('./helpers')

/**=======
 * Color *
 ========*/

/**
 * The constructor for all Colors.
 *
 * @constructor
 * @param {string} color_space the name of the color space this color uses
 * @param {object} value ideally this could be anything, but practically
 *                       this should be either a string, a number, or an array
 *                       of either
 * @param {options} options currently this is just an optional reference white
 */

Color = function (color_space, value, options) {
  options = options || {}
  this.color_space = color_space
  this.value = value
  this.white = options.white || { X: 0.95047, Y: 1, Z: 1.08883 }
}

/**===========
 * Alchemist *
 ===========**/

/**
 * The constructor for Alchemist. This is the object that will eventually be
 * exported.
 *
 * @constructor
 * @param {object} options Optional configuration
 */

var Alchemist = function (options) {
  options = options || {}
  this.spaces = {}
  this.abstract_spaces = {}
  this.white = options.white || null
  this.precision = options.precision || 4
}

// define any extra objects
helpers.mixin(Alchemist.prototype, ColorSpaceStore)
helpers.mixin(Alchemist.prototype, ModifierStore)

/**
 * Convenience method for quickly creating an Alchemist instance during a require
 *
 * @param {object} options The same options you would normally pass to Alchemist
 *                         constructor.
 */

Alchemist.create = function (options) {
  return new Alchemist(options)
}

// make sure that the user can still access Alchemist in case they don't know
// about the obj.constructor property. (necessary?)
Alchemist.prototype.Alchemist = Alchemist

// Attach the Color class to Alchemist and all of its instances
Alchemist.Color = Alchemist.prototype.Color = Color

/**
 * Interprets the type of plugin it is and calls the associated plugin installer
 * if the passed object is an array, it will try to interpret each item in that
 * array as a plugin, essentially allowing you to create plugin bundles.
 *
 * @param {object || array} plugin The plugin to be included
 */

Alchemist.prototype.use = function (plugin) {
  if (helpers.isArray(plugin)) {
    for (var i = 0; i < plugin.length; i++) {
      this.use(plugin[i])
    }
  } else if (plugin.to || plugin.from) {
    this.defineColorSpace(plugin);
    this.makeColorMethod(plugin.name)
  } else if (plugin.modifies) {
    this.defineTransform(plugin);
  } else throw new Error('unrecognized plugin format');
}

/**
 * Removes all included Color Spaces, starting with a clean slate.
 */

Alchemist.prototype.removeAll = function () {
  this.spaces = {}
  this.abstract_spaces = {}
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

Alchemist.prototype.makeColorMethod = function (color_space) {
  // defined method
  this[color_space] = function (value) {
    var color_value;
    if (arguments.length > 1) {
      // I hear this deoptimizes things. Find a way around if necessary.
      var color_value = Array.prototype.slice.call(arguments)
    } else {
      var color_value = value
    }
    var color = new this.Color(color_space, color_value, { white: this.white })

    for (var dest_name in this.spaces) {
      this.makeConversionMethod(color, dest_name)
    }
    return color
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

Alchemist.prototype.makeConversionMethod = function (color, dest_name) {
  var that = this
  color[dest_name] = function () {
    return that.round(that.convert(color, dest_name).value)
  }
}

/**
 * Converts a color from one color-space to another
 *
 * @param {Color} color
 * @param {string} dest
 */

Alchemist.prototype.convert = function (color, dest) {
  var converter, value, next_color, next_space;
  var current_space = this.findColorSpace(color.color_space)
  var dest_space = this.findColorSpace(dest)

  if (!current_space) throw new Error('Internal Error: could not find the ' + current + ' color space');
  if (!dest_space) throw new Error('Internal Error: could not find the ' + dest + ' color space');

  converter = current_space.to[dest]
  // Test to see if the current space knows how to convert to dest
  if (typeof converter === 'function') {
    if (helpers.isArray(color.value)) {
      value = converter.apply(this, helpers.attemptClone(color.value).concat(color));
    } else {
      value = converter(helpers.attemptClone(color.value), color)
    }
    value = this.round(value)
    color.color_space = dest
    color.value = value
    return color
    // if the converter is a another color space
  } else if (typeof converter === 'string') {
    // that should mean that color space knows how to convert, so convert to
    // that one and try from there
    next_color = this.convert(color, converter)
    return this.convert(next_color, dest)
  } else {
    // attempt to find path
    next_space = this.mapConversionPath(color.color_space, dest)
    // if we find the path begin stepping down it
    if (next_space) return this.convert(color, dest);
    // else throw an error
    else throw new Error('Alchemist does not know how to convert from ' + color.color_space + ' to ' + dest)
  }
}

/**
 * If the passed value is a number, it will round it. If the passed value is an
 * Array it will try to round each of it's values. the rounding is based on
 * Alchemist's precision option
 *
 * @param {object} value the object we will try to round
 */

Alchemist.prototype.round = function (value) {
  if (helpers.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      value[i] = this.roundIfNumber(value[i])
    }
  } else {
    value = this.roundIfNumber(value)
  }
  return value
}

/**
 * If the value is a number, we round it to whatever the current precision setting
 * is at.
 *
 * @param {object} value the possible number to be rounded
 */

Alchemist.prototype.roundIfNumber = function (value) {
  if (typeof value === 'number') {
    value = Number(value.toFixed(this.precision))
  }
  return value
}

// export Alchemist!
module.exports = Alchemist
