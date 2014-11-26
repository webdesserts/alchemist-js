/**
 * Alchemist.js
 * v0.1.1
 * License: MIT
 *
 * Author: Michael Mullins
 * Website: https://github.com/webdesserts/alchemist-js
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Alchemist"] = factory();
	else
		root["Alchemist"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {


var ColorSpaceStore = __webpack_require__(1)
var ModifierStore = __webpack_require__(2)

var helpers = __webpack_require__(3)

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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {


/**===================
 * Color Space Store *
 ===================**/

var ColorSpaceStore = {}

/**
 * Runs a breadth first search across the conversion tree to find the
 * quickest path from the source color space to the provided destination space.
 * It collects a crawlable list of parents to each space as it steps through
 * the tree. This can be used to retrace out steps once the destination space
 * is found.
 *
 * The parent array for a conversion path from rgb to cmyk might look something
 * like this:
 *
 * [ hsl: 'rgb', cmy: 'rgb', cmyk: 'cmy' ]
 *
 * If a path can be found it returns the parent array
 * If a path could not be found it returns null
 *
 * @param {object} src_space source space
 * @param {object} dest_space destination space
 */

ColorSpaceStore.findConversionPath = function Search (src_space, dest_space) {
  var Q = []
  var explored = []
  var parent = {}
  Q.push(src_space)
  explored.push(src_space)

  while (Q.length) {
    var space = Q.pop()
    if (space === dest_space) { return parent }
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

/**
 * For a given color space, collect a list of neighboring color spaces
 *
 * @param {string} color_space the name of the color space to be searched
 */

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

/**
 * Short Description:
 * Maps the steps necessary to convert from one color space to another
 *
 * Long Description:
 * First tries to find a path. If there is none, we return null
 *
 * Then steps backward through the path found in findConversionPath and sets the
 * crawlable path by defining a "next step" pointer on color spaces along the
 * path of a conversion
 *
 * If you couldn't tell already this function is super fucking confusing because
 * it's hard to think backwards and because I am horrible at writing code so gl;hf
 *
 * @param {string} current_space start of the conversion path
 * @param {string} target_space end of the conversion path
 */

ColorSpaceStore.mapConversionPath = function mapConversionPath (current_space, target_space) {
  // Is there a path?
  var parents = this.findConversionPath(current_space, target_space)
  // if not return null
  if (!parents) return null;

  var next_space = parents[target_space]
  var space = parents[next_space]

  var steps_taken = 0

  // step backwards through the parent array and leave "next step" instructions along the way
  while (steps_taken < 100) {
    if (!this.spaces[space].to[target_space] || typeof this.spaces[space].to[target_space] !== 'function') {
      this.spaces[space].to[target_space] = next_space
    }

    // if we're finished mapping, go ahead and tell us how to start the conversion
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
 * do not already exist, it will store them in an Abstract Space.
 *
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
 *
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
 *
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
 *
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
 *
 * @param {string} color_space the name of the color space
 */

ColorSpaceStore.createSpace = function (color_space) {
  this.spaces[color_space] = { to: {} }
}

/**
 * Does this Color Space exist yet?
 *
 * @param {string} color_space the name of the color space
 * @returns {Boolean}
 */

ColorSpaceStore.isColorSpace = function (color_space) {
  return Boolean(this.spaces[color_space])
}

/**
 * Creates the initial Abstract Space object
 *
 * @param {string} abstract_space the name of the abstract space
 */

ColorSpaceStore.createAbstractSpace = function (abstract_space) {
  this.abstract_spaces[abstract_space] = { to: {}, from: {} }
}

/**
 * Is this currently defined as an Abstract Space?
 *
 * @param {string} color_space the name of the color space
 * @returns {Boolean}
 */

ColorSpaceStore.isAbstractSpace = function (color_space) {
  return Boolean(this.abstract_spaces[color_space])
}

/**
 * Turn an Abstract Space into a normal Color Space
 *
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
 *
 * @param {string} color_space
 * @returns {object}
 */

ColorSpaceStore.findColorSpace = function (color_space) {
  return this.spaces[color_space] || null
}


module.exports = ColorSpaceStore


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {


/**================
 * Modifier Store *
 ================**/

var ModifierStore = {}

ModifierStore.defineModifier = function (modifier) {
  throw new Error('Modifiers are not yet implemented')
}

module.exports = ModifierStore


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {


/**=========
 * Helpers *
 =========**/

/**
 * Mix all the things!
 *
 * Defines all the properties of the giving_obj on the receiving_obj. This
 * does not include properties higher up in the prototype chain.
 *
 * Also allows you to name the methods you want mixed
 *
 * @param {object} receiving_obj object receiving the properties
 * @param {object} giving_obj object that the properties will be taken from
 *
 * (thanks addyosamani)
 */

exports.mixin = function (receiving_obj, giving_obj) {
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

exports.clone = function (original) {
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

exports.attemptClone = function (original) {
  var cloned = this.clone(original);
  return cloned || original
}

/**
 * I don't think Array.isArray is well supported. Use this function instead for
 * now so that if we need to add a fallback it won't take as much effort.
 *
 * @param {object} object possibly an array?
 */

exports.isArray = function isArray (object) {
  return Array.isArray(object)
}


/***/ }
/******/ ])
});
