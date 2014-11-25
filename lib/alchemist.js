//
//          Alchemist.js
// ------------------------------
// The Color Manipulation Library
//
// Author: Michael C. Mullins
// Lisence: MIT


/**===========
 * Alchemist *
 ===========**/

var Alchemist = function (options) {
  options = options || {}
  this.spaces = {}
  this.abstract_spaces = {}
  this.white = options.white || null
  this.precision = options.precision || 4
}

/**
 * Convenience method for quickly creating an Alchemist instance during a require
 * @param {object} options the same options you would normally pass to Alchemist
 *                         constructor
 */

Alchemist.create = function (options) {
  return new Alchemist(options)
}

Alchemist.prototype.Alchemist = Alchemist

Alchemist.prototype.use = function (plugin) {
  if (isArray(plugin)) {
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

Color = function (color_space, value, options) {
  options = options || {}
  this.color_space = color_space
  this.value = value
  this.white = options.white || { X: 0.95047, Y: 1, Z: 1.08883 }
}

Alchemist.Color = Alchemist.prototype.Color = Color

Alchemist.prototype.removeAll = function () {
  this.spaces = {}
  this.abstract_spaces = {}
}

Alchemist.prototype.makeColorMethod = function (color_space) {
  this[color_space] = function (value) {
    if (arguments.length > 1) {
      var value = Array.prototype.slice(arguments)
    }
    var color = new this.Color(color_space, value, { white: this.white })

    for (var dest_name in this.spaces) {
      this.makeConversionMethod(color, dest_name)
    }
    return color
  }
}

Alchemist.prototype.makeConversionMethod = function (color, dest_name) {
  var that = this
  color[dest_name] = function () {
    return that.round(that.convert(color, dest_name).value)
  }
}

/**
 * Converts a color from one color-space to another
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
    if (isArray(color.value)) {
      value = converter.apply(this, attemptClone(color.value).concat(color));
    } else {
      value = converter(attemptClone(color.value), color)
    }
    value = this.round(value)
    color.color_space = dest
    color.value = value
    return color
    // if the converter is a another color space
  } else if (typeof converter === 'string') {
    // that should mean that color space knows how to convert, so convert to that one
    // and try from there
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

Alchemist.prototype.round = function (value) {
  if (isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      value[i] = this.roundIfNumber(value[i])
    }
  } else {
    value = this.roundIfNumber(value)
  }
  return value
}

Alchemist.prototype.roundIfNumber = function (value) {
  if (typeof value === 'number') {
    value = Number(value.toFixed(this.precision))
  }
  return value
}

/**===================
 * Color Space Store *
 ===================**/

var ColorSpaceStore = {}

ColorSpaceStore.spaces = {}
ColorSpaceStore.abstract_spaces = {}

ColorSpaceStore.findConversionPath = function Search (from, to) {
  var Q = []
  var explored = []
  var parent = {}
  Q.push(from)
  explored.push(from)

  while (Q.length) {
    var space = Q.pop()
    if (space === to) { return parent }
    var neighbors = this.findNeighbors(space)

    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i]

      // if this space hasn't been explored yet
      if (explored.indexOf(neighbor) === -1) {
        parent[neighbor] = space
        explored.push(neighbor)
        Q.push(neighbor)
      }
    }
  }
  return null
}

ColorSpaceStore.findNeighbors = function findNeighbors (color_space) {
  var neighbors = []
  var conversions = this.spaces[color_space].to
  for (conv_space in conversions) {
    if (typeof conversions[conv_space] === 'function') {
      neighbors.push(conv_space)
    }
  }
  return neighbors
}

ColorSpaceStore.mapConversionPath = function findPath (current_space, target_space) {
  // this function is super fucking confusing because we are working backwards
  // and because I am horrible at writing code so gl;hf
  var parents = this.findConversionPath(current_space, target_space)
  if (!parents) return null
    var next_space = parents[target_space]
  var space = parents[next_space]

  while (true) {
  var steps_taken = 0

  // step backwards through the parent array and leave "next step" instructions along the way
  while (steps_taken < 100) {
    if (!this.spaces[space].to[target_space] || typeof this.spaces[space].to[target_space] !== 'function') {
      this.spaces[space].to[target_space] = next_space
    }

    if (space === current_space) return next_space;
    else if (!parents[space]) return null;

    // take a step backwards
    next_space = space
    space = parents[space]
    steps_taken++
  }

  throw new Error('something went wrong while mapping the path from' + current_space + ' to ' + target_space)
}

/**
 * Creates a Color Space
 *
 * If there are any included conversions for a Color Space that
 * does not exist yet, it will store them in an Abstract Space.
 * @param {object} color_space
 */

ColorSpaceStore.defineColorSpace = function (color_space) {
  var mine = color_space.name

  // make sure the name doesn't exist yet
  this.validateName(mine)
  // if space already exists as an abstract space
  if (this.isAbstractSpace(mine))
    this.makeConcrete(mine)
  else
    this.createSpace(mine)

  for (var theirs in color_space.to) {
    var conversion = color_space.to[theirs]
    if (this.isColorSpace(theirs))
      this.defineConversion(mine, theirs, conversion)
    else
      this.defineAbstractConversion(theirs, mine, 'from', conversion)
  }
  for (var theirs in color_space.from) {
    var conversion = color_space.from[theirs]
    if (this.isColorSpace(theirs))
      this.defineConversion(theirs, mine, conversion)
    else
      this.defineAbstractConversion(theirs, mine, 'to', conversion)
  }
}

/**
 * Stores a Conversion between two spaces
 * Expects both spaces to already be included
 * @param {string} mine
 * @param {string} theirs
 * @param {object} conversion
 */

ColorSpaceStore.defineConversion = function (mine, theirs, conversion) {
  this.spaces[mine].to[theirs] = conversion
}

/**
 * Stores a Conversion that we know about, but are not yet using
 * Creates an Abstract Space for the conversion, if one does not already exist
 * @param {string} mine
 * @param {string} theirs
 * @param {string} direction
 * @param {function} conversion
 */

ColorSpaceStore.defineAbstractConversion = function (mine, theirs, direction, conversion) {
  var abstract_spaces = this.abstract_spaces
  if (!abstract_spaces[mine]) this.createAbstractSpace(mine);

  abstract_spaces[mine][direction][theirs] = conversion
}

/**
 * Validates to make sure that we are not overriding any existing methods
 * @param {string} name
 */

ColorSpaceStore.validateName = function (name) {
  if (this[name]) {
    if (!this.spaces[name]) throw new Error('Invalid Name:', name, 'is already the name of one of alchemist\'s private functions and can not be used as a the name of an color space')
      else throw new Error('"' + name + '" Already Exists: there is a space with the same name already in use')
  }
}

/**
 * creates the initial Color Space object
 * @param {string} color_space
 */

ColorSpaceStore.createSpace = function (color_space) {
  this.spaces[color_space] = { to: {} }
}

/**
 * Does this Color Space exist yet?
 * @param {string} color_space
 */

ColorSpaceStore.isColorSpace = function (color_space) {
  return Boolean(this.spaces[color_space])
}

/**
 * creates the initial Abstract Space object
 * @param {string} abstract_space
 */

ColorSpaceStore.createAbstractSpace = function (abstract_space) {
  this.abstract_spaces[abstract_space] = { to: {}, from: {} }
}

/**
 * Is this currently defined as an Abstract Space?
 * @param {string} color_space
 * @returns {Boolean}
 */

ColorSpaceStore.isAbstractSpace = function (color_space) {
  return Boolean(this.abstract_spaces[color_space])
}

/**
 * Turn an Abstract Space into a normal Color Space
 * @param {string} abstract_space
 */

ColorSpaceStore.makeConcrete = function (abstract_space) {
  var space_obj = this.abstract_spaces[abstract_space]
  delete this.abstract_spaces[abstract_space]
  space_obj.name = abstract_space
  this.defineColorSpace(space_obj)
}

/**
 * If the given color space exists already, it will return that colorspace,
 * else it will return null
 * @param {string} color_space
 * @returns {object}
 */

ColorSpaceStore.findColorSpace = function (color_space) {
  return this.spaces[color_space] || null
}

/**================
 * Modifier Store *
 ================**/

var ModifierStore = {}

ModifierStore.defineModifier = function (modifier) {
  throw new Error('Modifiers are not yet implemented')
}

/**======================================
 * Now let's throw everything together! *
 ======================================**/

// Mix all the things!
// (thanks addyosamani)
var mixin = function (receiving_obj, giving_obj) {
  // allows you to only mix in a set set of methods
  if (arguments[2]) {
    for (var i = 2, len = arguments.length; i < len; i++) {
      receiving_obj[arguments[i]] = giving_obj[arguments[i]]
    }
    // otherwise, mix all the things! (does not mix existing properties)
  } else {
    for (var method_name in giving_obj) {
      if (!Object.hasOwnProperty.call(receiving_obj, method_name)) {
        receiving_obj[method_name] = giving_obj[method_name]
      }
    }
    receiving_obj
  }
  return receiving_obj
}

/**
 * copy the original object's properties onto a new object and returns it
 *
 * @param {object} original object to be cloned
 */

var clone = function (original) {
  var Con = original.constructor

  if (typeof original === 'string' || typeof original === 'number')
    return new Con(original)

  if (isArray(original)) {
    var cloned_array = []
    for (var i = 0; i < original.length; i++) {
      cloned_array[i] = original[i]
    }
    return cloned_array
  }

  if (typeof original == 'object')
    return mixin({}, original)

  return null
}

/**
 * Same as clone, but just returns the original object when it doesn't recognize
 * the object. This is a dangerous function and should be used scarecely if at
 * all
 *
 * @param {object} orignal object to be cloned
 */

var attemptClone = function (original) {
  var cloned = clone(original);
  return cloned || original
}

/**
 * I don't think Array.isArray is well supported. Use this function instead for
 * now so that if we need to add a fallback it won't take as much effort.
 *
 * @param {object} object possibly an array?
 */

var isArray = function isArray (object) {
  return Array.isArray(object)
}

mixin(Alchemist.prototype, ColorSpaceStore)
mixin(Alchemist.prototype, ModifierStore)

module.exports = Alchemist
