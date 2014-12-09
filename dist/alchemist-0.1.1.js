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

var plugins = __webpack_require__(1)
var Color = __webpack_require__(2)
var ColorSpace = __webpack_require__(3)
var Converter = __webpack_require__(4)
var ColorSpaceStore = __webpack_require__(5)
var ModifierStore = __webpack_require__(6)
var helpers = __webpack_require__(7)

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
  var color = Color.create(color_space.name, null, { white: this.white })

  // TODO Use a ColorSpace's defined conversions
  this.spaces.each(function (color_space) {
    if (!color_space.isAbstract) {
      this.makeConversionMethod(color, color_space.name)
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

    new_color = Object.create(color)
    color.value = color_value

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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

var ColorSpace = __webpack_require__(3)
var ColorSpaceStore = __webpack_require__(5)
var helpers = __webpack_require__(7)

plugins = {}

plugins.serialize = function serialize (plugin) {
  if (plugin.to || plugin.from) {
    return this.serializeColorSpace(plugin)
  } else if (plugin.modifies) {
    return this.serializeModifier(plugin)
  } else throw new Error('unrecognized plugin format');
}

plugins.serializeColorSpace = function serializeColorSpace (plugin) {
  var results, color_space, abstract_space;

  if (typeof plugin.name !== 'string') throw Error('Error: color-space plugin is missing a name')

  results = ColorSpaceStore.create()
  color_space = ColorSpace.create(plugin.name)
  results.add(color_space)

  for (dest_name in plugin.to) {
    color_space.defineConvTo(dest_name, plugin.to[dest_name])
  }

  for (src_name in plugin.from) {
    abstract_space = ColorSpace.create(src_name, { abstract: true })
    abstract_space.defineConvTo(plugin.name, plugin.from[src_name])
    results.add(abstract_space)
  }

  return results
}

plugins.serializeModifier = function serializeModifier (plugin) {
  throw new Error('Modifiers aren\'t implemented yet! Sorry!')
}

module.exports = plugins


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

var helpers = __webpack_require__(7)

var Color = Object.create(helpers.Createable)

Color.init = function init (color_space, value, options) {
  options = options || {}
  this.color_space = color_space
  this.value = value
  this.white = options.white || { X: 0.95047, Y: 1, Z: 1.08883 }
}

module.exports = Color


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

var helpers = __webpack_require__(7)
var ColorSpace = Object.create(helpers.Createable)

// initialize all state
ColorSpace.init = function init (name, options) {
  var options = options || {}
  this.name = name
  this.conversions = {}
  this.isAbstract = options.abstract || false
}

// define a conversion to another color space
ColorSpace.defineConvTo = function defineConvTo (space_name, conversion) {
  if (typeof conversion !== 'function') throw TypeError('Expected the conversion, ' + conversion + ', to be a function')
  this.conversions[space_name] = conversion
}

ColorSpace.definePointerTo = function definePointerTo (target, pointer) {
  if (typeof pointer !== 'string') throw TypeError('Expected the pointer, ' + pointer + ', to be a string')
  this.conversions[target] = pointer
}

// return a known conversion to antoher color space
ColorSpace.to = function to (space_name) {
  return this.conversions[space_name] || null }

ColorSpace.merge = function merge (color_space) {
  var options = options || {}
  var conversions = color_space.conversions
  // If we're merging like so...
  // abstract_space.merge(concrete_space)
  // use all the concrete space's conversions by default
  var curing = this.isAbstract && !color_space.isAbstract

  for (dest_space in conversions) {
    if (curing || !this.to(dest_space)) {
      var conversion = conversions[dest_space]
      this.defineConvTo(dest_space, conversion)
    }
  }

  // when the conversion is over, make the abstract space concrete
  if (curing) this.isAbstract = false
}

// lock down some properties
Object.defineProperties(ColorSpace, {
  defineConvTo: { writable: false },
  to: { writable: false }
})

// export the module
module.exports = ColorSpace


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

var helpers = __webpack_require__(7)

var Converter = Object.create(helpers.Createable)

Converter.init = function init (color_spaces, context) {
  this.spaces = color_spaces
  this.context = context || null
}

Converter.convert = function convert (color, target_name) {
  var current_name = color.color_space
  var current_space = this.spaces.find(current_name)
  var target_space = this.spaces.find(target_name)

  if (!current_space) throw new Error('could not find the ' + current_name + ' color space');
  if (!target_space) throw new Error('could not find the ' + target_name + ' color space');

  var conversion = current_space.to(target_name)
  // Test to see if the current space knows how to convert to target
  if (typeof conversion === 'function') {
    return this.applyConversion(color, target_name, conversion)
  // if the conversion is a another color space
  } else if (typeof conversion === 'string') {
    var next_color = this.followPointer(color, current_space, conversion)
    return this.convert(next_color, target_name)
  } else {
    // attempt to find path
    var next_space = this.mapConversionPath(current_name, target_name)

    // if we find the path begin stepping down it
    if (next_space) return this.convert(color, target_name);

    // else throw an error
    else throw new Error('Alchemist does not know how to convert from ' + current_space.name + ' to ' + target_space.name)
  }
}

Converter.applyConversion = function applyConversion (color, target, conversion) {
  var value;
  if (helpers.isArray(color.value)) {
    value = conversion.apply(this.context, helpers.clone(color.value).concat(color));
  } else {
    value = conversion(helpers.clone(color.value), color)
  }
  value = helpers.round(value)
  color.color_space = target
  color.value = value
  return color
}

Converter.followPointer = function followPointer (color, current_space, pointer) {
  // that should mean that color space knows how to convert, so convert to
  // that one and try from there
  var conversion = current_space.to(pointer)
  if (typeof conversion !== 'function') throw new TypeError('Expected the pointer, ' + pointer  + ', to point to a function; Instead found  ' + conversion )
  return this.applyConversion(color, pointer, conversion)
}

Converter.mapConversionPath = function mapConversionPath (current, target) {
  var conversion
  // Is there a path?
  var parents = this.findConversionPath(current, target)
  // if not return null
  if (!parents) return null;

  var next_space = parents[target]
  var space = parents[next_space]

  var steps_taken = 0

  // step backwards through the parent array and leave "next step" instructions along the way
  while (steps_taken < 100) {
    conversion = this.spaces.find(space).to(target)

    if (!conversion || typeof conversion !== 'function') {
      this.spaces.find(space).definePointerTo(target, next_space)
    }

    // if we're finished mapping, go ahead and tell us how to start the conversion
    if (space === current) return next_space;
    else if (!parents[space]) return null;

    // take a step backwards
    next_space = space
    space = parents[space]
    steps_taken++
  }

  throw new Error('something went wrong while mapping the path from' + current_space + ' to ' + target_space)
}

Converter.findConversionPath = function findConversionPath (current_space, target_space) {
  var Q = []
  var explored = []
  var parent = {}
  Q.push(current_space)
  explored.push(current_space)

  while (Q.length) {
    var space = Q.pop()
    if (space === target_space) { return parent }
    var neighbors = this.spaces.findNeighbors(space)

    // for each neighbor
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i]

      // if this neighbor hasn't been explored yet
      if (explored.indexOf(neighbor) === -1) {
        parent[neighbor] = space
        explored.push(neighbor)
        Q.push(neighbor)
      }
    }
  }
  return null
}

module.exports = Converter


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

var ColorSpace = __webpack_require__(3)
var helpers = __webpack_require__(7)

var ColorSpaceStore = Object.create(helpers.Createable)

ColorSpaceStore.init = function init () {
  this.store = []
}

ColorSpaceStore.add = function add (color_space) {
  this.store.push(color_space)
}

ColorSpaceStore.find = function find (space_name) {
  var i = this.findIndex(space_name)
  return this.store[i] || null
}

ColorSpaceStore.findIndex = function findIndex (space_name) {
  var result = this.each(function (space, i) {
    if (space.name === space_name) return i;
  })
  return result
}

ColorSpaceStore.findNeighbors = function findNeighbors (space_name) {
  var neighbors = []
  var color_space = this.find(space_name)

  if (color_space === null) return neighbors;

  var conversions = color_space.conversions

  for (target in conversions) {
    var target_space = this.find(target)
    if (target_space && !target_space.isAbstract)
      neighbors.push(target);
  }
  return neighbors
}

ColorSpaceStore.has = function has (space_name) {
  var i = this.findIndex(space_name)
  return Boolean(i || i === 0)
}

ColorSpaceStore.remove = function remove (space_name) {
  var i = this.findIndex(space_name)
  this.store.splice(i, 1)
}

ColorSpaceStore.each = function each (func, context) {
  return helpers.each.call(this, this.store, func, context)
}

ColorSpaceStore.merge = function merge (external_store) {
  external_store.each(function (color_space) {
    this.mergeColorSpace(color_space)
  }.bind(this))
}

ColorSpaceStore.mergeColorSpace = function mergeColorSpace (color_space) {
  var name = color_space.name
  local_space = this.find(name)
  if (!local_space) {
    this.add(color_space)
  } else {
    local_space.merge(color_space)
  }
}

module.exports = ColorSpaceStore


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {


/**================
 * Modifier Store *
 ================**/

var ModifierStore = {}

module.exports = ModifierStore


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {


/**=========
 * Helpers *
 =========**/

/**
 * copy the original object's properties onto a new object and returns it
 *
 * @param {object} original object to be cloned
 */

exports.clone = function clone (target) {
  "use strict";
  var cloned;

  var obj = Object(target);

  switch (obj.constructor) {
    case String:
      cloned = obj.toString()
      break;
    case Number:
      cloned = Number(obj)
      break;
    case Array:
      cloned = []
      this.each(obj, function (item, i) {
        cloned[i] = clone(item)
      })
      break;
    default:
      throw new TypeError('Alchemist does not know how to clone ' + target)
  }
  return cloned;
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

exports.each = function each (array, func, context) {
  var length = array.length
  var result;
  context = context || null
  for (var i = 0; i < length; i++) {
    result = func.call(context, array[i], i)
    if (result != undefined) return result
  }
return null
}

/**
 * If the passed value is a number, it will round it. If the passed value is an
 * Array it will try to round each of it's values. the rounding is based on
 * Alchemist's precision option
 *
 * @param {object} value the object we will try to round
 */

exports.round = function (value, precision) {
  precision = precision || 4
  if (exports.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      value[i] = this.roundIfNumber(value[i], precision)
    }
  } else {
    value = this.roundIfNumber(value, precision)
  }
  return value
}

/**
 * If the value is a number, we round it to whatever the current precision setting
 * is at.
 *
 * @param {object} value the possible number to be rounded
 */

exports.roundIfNumber = function (value, precision) {
  if (typeof value === 'number') {
    value = Number(value.toFixed(precision))
  }
  return value
}

exports.Createable = {
  create: function () {
    var obj = Object.create(this)
    if (obj.init) obj.init.apply(obj, arguments);
    return obj
  }
}


/***/ }
/******/ ])
});
