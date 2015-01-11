'use strict'

var helpers = require('./helpers')

var Converter = Object.create(helpers.Createable)

/**
 * Initializes Converter's state. Is called on create()
 */

Converter.init = function init (color_spaces, precision) {
  this.spaces = color_spaces
  this.precision = precision || 9
}

/**
 * Converts <color> to a target color space
 */

Converter.convert = function convert (color, target_name) {
  var current_name = color.space
  if (current_name === target_name) return color;

  if (!this.spaces.has(current_name)) throw new Error('could not find the ' + current_name + ' color space');
  if (!this.spaces.has(target_name)) throw new Error('could not find the ' + target_name + ' color space');

  var conversion = color.conversions.find(target_name)
  // Test to see if the current space knows how to convert to target
  if (typeof conversion === 'function') {
    return this.applyConversion(color, target_name)
  // if the conversion is a another color space
  } else if (typeof conversion === 'string') {
    var next_color = this.applyConversion(color, conversion)
    return this.convert(next_color, target_name)
  } else {
    // attempt to find path
    var next_space = this.mapConversionPath(current_name, target_name)

    // if we find the path begin stepping down it
    if (next_space) return this.convert(color, target_name);

    // else throw an error
    else throw new Error('Alchemist does not know how to convert from ' + current_name + ' to ' + target_name)
  }
}

/**
 * Finds the target color space under the <color>'s conversions, applies
 * that conversion, and returns a new color.
 */

Converter.applyConversion = function applyConversion (color, target_name) {
  var value, new_color;
  var conversion = color.conversions.find(target_name)
  if (typeof conversion !== 'function') throw new TypeError('expected ' + conversion + ' to be a function');

  if (color.value === null) {
    value = color.value
  } else if (helpers.isArray(color.value)) {
    value = conversion.apply(color, helpers.clone(color.value));
  } else {
    value = conversion.call(color, helpers.clone(color.value))
  }

  value = helpers.round(value, this.precision)

  new_color = this.spaces.find(target_name).create(value)

  return new_color
}

/**
 * Leaves a trail of "conversion pointers" that convert() can follow from one
 * color space to a target color space
 *
 * A "pointer" is just a string that tells convert() what color space to convert
 * to next to get one step closer to the target space
 */

Converter.mapConversionPath = function mapConversionPath (current_name, target_name) {
  var conversion
  // Is there a path?
  var parents = this.findConversionPath(current_name, target_name)
  // if not return null
  if (!parents) return null;

  var next_space = parents[target_name]
  var space = parents[next_space]

  var steps_taken = 0

  // step backwards through the parent array and leave "next step" instructions along the way
  while (steps_taken < 100) {
    conversion = this.spaces.find(space).conversions.find(target_name)

    if (!conversion || typeof conversion !== 'function') {
      this.spaces.find(space).conversions.add(target_name, next_space)
    }

    // if we're finished mapping, go ahead and tell us how to start the conversion
    if (space === current_name) return next_space;
    else if (!parents[space]) return null;

    // take a step backwards
    next_space = space
    space = parents[space]
    steps_taken++
  }

  throw new Error('something went wrong while mapping the path from' + current_name + ' to ' + target_name)
}

/**
 * Searches all conversions to find the quickest path between two color spaces.
 * Returns an array of parent:child relationships that can be walked backwards
 * to get the path
 */

Converter.findConversionPath = function findConversionPath (current_name, target_name) {
  var Q = []
  var explored = []
  var parent = {}
  Q.push(current_name)
  explored.push(current_name)

  while (Q.length) {
    var space = Q.pop()
    if (space === target_name) { return parent }
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
